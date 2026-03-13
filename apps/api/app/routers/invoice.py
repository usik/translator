from __future__ import annotations

import structlog
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from ..config import Settings
from ..dependencies import (
    get_extractor_registry,
    get_provider_registry,
    get_settings,
)
from ..extractors import ExtractorRegistry
from ..providers import ProviderRegistry
from ..invoice.report import generate_csv_report, generate_excel_report
from ..invoice.service import InvoiceService

log = structlog.get_logger()

router = APIRouter(prefix="/api/v1/invoice")
limiter = Limiter(key_func=get_remote_address)

_invoice_service = InvoiceService()


@router.post("/process")
@limiter.limit("10/minute")
async def process_invoices(
    request: Request,
    files: list[UploadFile] = File(...),
    source_language: str = Form("auto"),
    output_format: str = Form("xlsx"),
    settings: Settings = Depends(get_settings),
    extractor_registry: ExtractorRegistry = Depends(get_extractor_registry),
    provider_registry: ProviderRegistry = Depends(get_provider_registry),
):
    """Process invoice files and return an expense report."""
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    provider_name = settings.default_provider
    model = settings.default_model
    provider = provider_registry.get(provider_name)
    if provider is None:
        raise HTTPException(status_code=500, detail=f"Provider '{provider_name}' not available")

    # Read and validate files
    max_bytes = settings.max_file_size_mb * 1024 * 1024
    file_pairs: list[tuple[str, bytes]] = []

    for f in files:
        content = await f.read()
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File '{f.filename}' exceeds {settings.max_file_size_mb}MB limit",
            )
        file_pairs.append((f.filename or "upload", content))

    try:
        result = await _invoice_service.process(
            files=file_pairs,
            extractor_registry=extractor_registry,
            provider=provider,
            model=model,
        )
    except Exception as e:
        log.exception("invoice.process.failed")
        raise HTTPException(
            status_code=500,
            detail={"code": "INVOICE_PROCESSING_FAILED", "message": str(e)},
        ) from e

    # Generate report
    if output_format == "csv":
        report_bytes = await generate_csv_report(result.invoices)
        return Response(
            content=report_bytes,
            media_type="text/csv; charset=utf-8",
            headers={"Content-Disposition": 'attachment; filename="expense_report.csv"'},
        )

    # Default: xlsx
    report_bytes = await generate_excel_report(result.invoices)
    return Response(
        content=report_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": 'attachment; filename="expense_report.xlsx"'},
    )
