import structlog
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from ..config import Settings
from ..dependencies import (
    get_converter_registry,
    get_extractor_registry,
    get_settings,
)
from ..extractors import ExtractorRegistry
from ..converters import ConverterRegistry

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
):
    """Convert a file to a different format (extract text then convert)."""
    # Normalize common aliases
    if output_format == "txt":
        output_format = "text"

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
            return Response(
                content=pdf_bytes,
                media_type="application/pdf",
                headers={"Content-Disposition": 'attachment; filename="converted.pdf"'},
            )

    # General: extract text then convert
    extractor = extractor_registry.resolve(filename, file.content_type)
    if extractor is None:
        raise HTTPException(status_code=400, detail=f"Unsupported input format: {filename}")

    extraction_result = await extractor.extract(file_bytes, filename)

    converter = converter_registry.get(output_format)
    if converter is None:
        raise HTTPException(status_code=400, detail=f"Unsupported output format: {output_format}")

    out_bytes = await converter.convert(extraction_result.text)

    ct_info = _OUTPUT_CONTENT_TYPES.get(output_format)
    content_type = ct_info[0] if ct_info else "application/octet-stream"
    ext = ct_info[1] if ct_info else f".{output_format}"

    return Response(
        content=out_bytes,
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="converted{ext}"'},
    )
