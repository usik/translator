import asyncio
import base64
import os

from ..schemas import ExtractionResult

_IMAGE_MIMES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".webp": "image/webp",
}


class ImageExtractor:
    supported_extensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".tiff", ".webp"]
    supported_content_types = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "image/webp",
    ]

    def __init__(self, mistral_api_key: str) -> None:
        from mistralai import Mistral
        self._client = Mistral(api_key=mistral_api_key)

    def _extract_sync(self, file_bytes: bytes, filename: str) -> object:
        ext = os.path.splitext(filename)[1].lower()
        mime = _IMAGE_MIMES.get(ext, "image/png")

        encoded = base64.standard_b64encode(file_bytes).decode("utf-8")
        image_url = f"data:{mime};base64,{encoded}"

        return self._client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "image_url",
                "image_url": image_url,
            },
        )

    async def extract(self, file_bytes: bytes, filename: str) -> ExtractionResult:
        ocr_response = await asyncio.to_thread(
            self._extract_sync, file_bytes, filename
        )

        pages = ocr_response.pages
        text_parts = [page.markdown for page in pages]
        full_text = "\n\n".join(text_parts)

        return ExtractionResult(
            text=full_text,
            source_filename=filename,
            source_format="image",
            metadata={},
        )
