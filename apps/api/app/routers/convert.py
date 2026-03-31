import structlog
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from ..auth import verify_api_key
from ..billing import estimate_pages, ingest_document_event
from ..config import Settings
from ..dependencies import (
    get_converter_registry,
    get_extractor_registry,
    get_settings,
)
from ..extractors import ExtractorRegistry
from ..converters import ConverterRegistry
from ..free_tier import (
    check_and_increment,
    get_session_from_request,
    set_session_cookie,
)

log = structlog.get_logger()

router = APIRouter(prefix="/api/v1")
limiter = Limiter(key_func=get_remote_address)

_OUTPUT_CONTENT_TYPES = {
    "pdf": ("application/pdf", ".pdf"),
    "docx": ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
    "hwpx": ("application/hwp+zip", ".hwpx"),
    "text": ("text/plain", ".txt"),
}


@router.post("/convert")
@limiter.limit("20/minute")
async def convert_file(
    request: Request,
    file: UploadFile = File(...),
    output_format: str = Form(...),
    settings: Settings = Depends(get_settings),
    extractor_registry: ExtractorRegistry = Depends(get_extractor_registry),
    converter_registry: ConverterRegistry = Depends(get_converter_registry),
    api_key: str | None = Depends(verify_api_key),
):
    """Convert a file to a different format (extract text then convert)."""
    import asyncio  # noqa: PLC0415

    # Normalize common aliases
    if output_format == "txt":
        output_format = "text"

    # --- Access gate ---
    new_session: str | None = None
    if api_key is None:
        ip = get_remote_address(request)
        session = get_session_from_request(request)
        allowed, _remaining, new_session = await check_and_increment(ip, session)
        if not allowed:
            raise HTTPException(
                status_code=429,
                detail={
                    "code": "FREE_TIER_LIMIT",
                    "message": "Free tier limit reached (3 documents/day). Sign up for more at tryxenith.com.",
                    "remaining": 0,
                },
            )

    file_bytes = await file.read()

    max_bytes = settings.max_file_size_mb * 1024 * 1024
    if len(file_bytes) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Max size: {settings.max_file_size_mb}MB",
        )

    filename = file.filename or "upload"

    # Special case: DOCX → PDF via LibreOffice (no text extraction needed)
    if output_format == "pdf" and filename.lower().endswith(".docx"):
        docx_to_pdf = converter_registry.get("docx_to_pdf")
        if docx_to_pdf and hasattr(docx_to_pdf, "convert_file"):
            pdf_bytes = await docx_to_pdf.convert_file(file_bytes)
            if api_key:
                asyncio.create_task(
                    ingest_document_event(
                        settings=settings,
                        external_customer_id=api_key,
                        operation="convert",
                        fmt=filename.rsplit(".", 1)[-1].lower(),
                        pages=estimate_pages("" * len(file_bytes)),
                        file_size_kb=len(file_bytes) // 1024,
                    )
                )
            resp = Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": 'attachment; filename="converted.pdf"'},
            )
            if new_session:
                set_session_cookie(resp, new_session)
            return resp

    # General: extract text then convert
    extractor = extractor_registry.resolve(filename, file.content_type)
    if extractor is None:
        raise HTTPException(status_code=400, detail=f"Unsupported input format: {filename}")

    extraction_result = await extractor.extract(file_bytes, filename)

    converter = converter_registry.get(output_format)
    if converter is None:
        raise HTTPException(status_code=400, detail=f"Unsupported output format: {output_format}")

    out_bytes = await converter.convert(extraction_result.text)

    if api_key:
        asyncio.create_task(
            ingest_document_event(
                settings=settings,
                external_customer_id=api_key,
                operation="convert",
                fmt=extraction_result.source_format or filename.rsplit(".", 1)[-1].lower(),
                pages=estimate_pages(extraction_result.text),
                file_size_kb=len(file_bytes) // 1024,
            )
        )

    ct_info = _OUTPUT_CONTENT_TYPES.get(output_format)
    content_type = ct_info[0] if ct_info else "application/octet-stream"
    ext = ct_info[1] if ct_info else f".{output_format}"

    resp = Response(
        content=out_bytes,
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="converted{ext}"'},
    )
    if new_session:
        set_session_cookie(resp, new_session)
    return resp
