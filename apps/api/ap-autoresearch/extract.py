"""
Thin wrapper that calls the same extraction pipeline as the API.

Used by evaluate.py to extract invoice data from a single file.
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path

# Add parent dir to path so we can import the app
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import Settings
from app.invoice.prompts import build_extractor_messages
from app.invoice.service import _parse_json_response
from app.providers.gemini import GeminiProvider
from app.schemas import ChatMessage


def extract_invoice(invoice_path: Path) -> dict:
    """Extract invoice data from a file, returning a dict matching InvoiceData schema."""
    return asyncio.run(_extract_async(invoice_path))


async def _extract_async(invoice_path: Path) -> dict:
    settings = Settings()
    provider = GeminiProvider(settings.gemini_api_key)
    model = settings.default_model or "gemini-2.5-flash"

    # Step 1: OCR extract
    filename = invoice_path.name
    file_bytes = invoice_path.read_bytes()

    # Lazy import extractors based on file type
    ext = invoice_path.suffix.lower()
    if ext == ".pdf":
        from app.extractors.pdf import PDFExtractor
        extractor = PDFExtractor(settings.mistral_api_key)
    elif ext in (".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp"):
        from app.extractors.image import ImageExtractor
        extractor = ImageExtractor(settings.mistral_api_key)
    elif ext == ".hwpx":
        from app.extractors.hwp import HwpExtractor
        extractor = HwpExtractor()
    elif ext == ".docx":
        from app.extractors.docx import BasicDocxExtractor
        extractor = BasicDocxExtractor()
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    extraction = await extractor.extract(file_bytes, filename)
    ocr_text = extraction.text

    # Step 2: Extractor Agent
    messages = build_extractor_messages(ocr_text, filename)
    response = await provider.chat(messages, model, json_mode=True)

    data = _parse_json_response(response.content)
    data["source_filename"] = filename
    return data


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract.py <invoice_file>")
        sys.exit(1)

    result = extract_invoice(Path(sys.argv[1]))
    print(json.dumps(result, indent=2, ensure_ascii=False))
