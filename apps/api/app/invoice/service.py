from __future__ import annotations

import asyncio
import io
import json
import re
import time
import zipfile

import structlog

from ..exceptions import ExtractionError, LLMError
from ..extractors import ExtractorRegistry
from ..providers.base import LLMProvider
from ..schemas import ChatMessage
from .prompts import build_accountant_messages, build_extractor_messages
from .schemas import (
    InvoiceData,
    InvoiceProcessingResult,
    ValidatedInvoice,
    ValidationFlag,
)

log = structlog.get_logger()

# Files to skip when extracting from zip archives
_SKIP_PREFIXES = ("__MACOSX", ".DS_Store", "Thumbs.db")
_SUPPORTED_EXTENSIONS = {
    ".pdf", ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp",
    ".hwpx", ".docx", ".txt",
}


def _should_skip_entry(path: str) -> bool:
    """Check if a zip entry should be skipped (OS metadata, hidden files)."""
    parts = path.split("/")
    return any(
        part.startswith(".") or part in ("__MACOSX", "Thumbs.db")
        for part in parts
    )


def _is_supported_ext(filename: str) -> bool:
    """Check if a filename has a supported invoice extension."""
    dot = filename.rfind(".")
    if dot == -1:
        return False
    return filename[dot:].lower() in _SUPPORTED_EXTENSIONS


def _extract_zip(zip_bytes: bytes) -> list[tuple[str, bytes]]:
    """Extract supported files from a zip archive."""
    files: list[tuple[str, bytes]] = []
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        for entry in zf.namelist():
            if entry.endswith("/"):
                continue  # skip directories
            if _should_skip_entry(entry):
                continue
            basename = entry.split("/")[-1]
            if _is_supported_ext(basename):
                files.append((basename, zf.read(entry)))
    return files


def _parse_json_response(content: str) -> dict:
    """Parse JSON from LLM response, handling markdown code fences."""
    text = content.strip()
    # Strip markdown code fences
    match = re.search(r"```(?:json)?\s*\n?(.*?)\n?\s*```", text, re.DOTALL)
    if match:
        text = match.group(1).strip()
    return json.loads(text)


class InvoiceService:
    """Stateless invoice processing pipeline."""

    async def process(
        self,
        files: list[tuple[str, bytes]],
        extractor_registry: ExtractorRegistry,
        provider: LLMProvider,
        model: str,
    ) -> InvoiceProcessingResult:
        start = time.monotonic()

        # Expand zips
        all_files: list[tuple[str, bytes]] = []
        for filename, content in files:
            if filename.lower().endswith(".zip"):
                all_files.extend(_extract_zip(content))
            else:
                all_files.append((filename, content))

        total_files = len(all_files)
        log.info("invoice.pipeline.start", total_files=total_files)

        # Step 1 + 2: OCR extract and run Extractor Agent in parallel
        tasks = [
            self._extract_single(f, c, extractor_registry, provider, model)
            for f, c in all_files
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        extracted: list[InvoiceData] = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                log.warning(
                    "invoice.extract.failed",
                    filename=all_files[i][0],
                    error=str(result),
                )
                continue
            extracted.append(result)

        if not extracted:
            elapsed = round((time.monotonic() - start) * 1000)
            return InvoiceProcessingResult(
                invoices=[],
                total_files=total_files,
                total_processed=0,
                total_flags=0,
                processing_time_ms=elapsed,
            )

        # Step 3: Accountant Agent — validate all invoices
        validated = await self._run_accountant(extracted, provider, model)

        elapsed = round((time.monotonic() - start) * 1000)
        total_flags = sum(len(v.flags) for v in validated)

        log.info(
            "invoice.pipeline.done",
            total_files=total_files,
            total_processed=len(validated),
            total_flags=total_flags,
            elapsed_ms=elapsed,
        )

        return InvoiceProcessingResult(
            invoices=validated,
            total_files=total_files,
            total_processed=len(validated),
            total_flags=total_flags,
            processing_time_ms=elapsed,
        )

    async def _extract_single(
        self,
        filename: str,
        content: bytes,
        extractor_registry: ExtractorRegistry,
        provider: LLMProvider,
        model: str,
    ) -> InvoiceData:
        """OCR extract + Extractor Agent for a single file."""
        # Step 1: OCR extraction
        extractor = extractor_registry.resolve(filename, None)
        if extractor is None:
            raise ExtractionError(f"No extractor for: {filename}")

        extraction = await extractor.extract(content, filename)
        ocr_text = extraction.text

        if not ocr_text.strip():
            raise ExtractionError(f"Empty extraction result for: {filename}")

        log.info("invoice.ocr.done", filename=filename, chars=len(ocr_text))

        # Step 2: Extractor Agent (LLM)
        messages = build_extractor_messages(ocr_text, filename)
        response = await provider.chat(messages, model, json_mode=True)

        try:
            data = _parse_json_response(response.content)
            data["source_filename"] = filename
            invoice = InvoiceData.model_validate(data)
        except Exception as e:
            raise LLMError(
                f"Failed to parse extractor response for {filename}: {e}"
            ) from e

        log.info(
            "invoice.extract.done",
            filename=filename,
            vendor=invoice.vendor_name,
            total=invoice.total,
            currency=invoice.currency,
        )
        return invoice

    async def _run_accountant(
        self,
        invoices: list[InvoiceData],
        provider: LLMProvider,
        model: str,
    ) -> list[ValidatedInvoice]:
        """Run the Accountant Agent on all extracted invoices."""
        invoices_json = json.dumps(
            [inv.model_dump() for inv in invoices], indent=2, ensure_ascii=False
        )

        messages = build_accountant_messages(invoices_json)
        response = await provider.chat(messages, model, json_mode=True)

        try:
            data = _parse_json_response(response.content)
            validated_list = data.get("invoices", [])
            result: list[ValidatedInvoice] = []
            for item in validated_list:
                result.append(ValidatedInvoice.model_validate(item))
            return result
        except Exception as e:
            log.warning("invoice.accountant.parse_failed", error=str(e))
            # Fallback: return invoices without validation
            return [
                ValidatedInvoice(
                    invoice=inv,
                    flags=[
                        ValidationFlag(
                            type="low_confidence",
                            severity="info",
                            message="Accountant validation could not be completed",
                            invoice_index=i,
                        )
                    ],
                )
                for i, inv in enumerate(invoices)
            ]
