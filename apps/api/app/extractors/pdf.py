import asyncio
import base64

from ..markdown_ast import extract_segments
from ..schemas import ExtractionResult

_PAGE_SEP = "\n\n---\n\n"


class PDFExtractor:
    supported_extensions = [".pdf"]
    supported_content_types = ["application/pdf"]

    def __init__(self, mistral_api_key: str) -> None:
        from mistralai import Mistral
        self._client = Mistral(api_key=mistral_api_key)

    def _extract_sync(self, file_bytes: bytes) -> object:
        encoded = base64.standard_b64encode(file_bytes).decode("utf-8")
        document_url = f"data:application/pdf;base64,{encoded}"

        return self._client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": document_url,
            },
            include_image_base64=True,
        )

    async def extract(self, file_bytes: bytes, filename: str) -> ExtractionResult:
        ocr_response = await asyncio.to_thread(self._extract_sync, file_bytes)

        pages = ocr_response.pages
        text_parts = [page.markdown for page in pages]
        full_text = "\n\n".join(text_parts)

        return ExtractionResult(
            text=full_text,
            source_filename=filename,
            source_format="pdf",
            page_count=len(pages),
            metadata={},
        )

    async def extract_structured(
        self, file_bytes: bytes, filename: str,
    ) -> ExtractionResult:
        ocr_response = await asyncio.to_thread(self._extract_sync, file_bytes)

        pages = ocr_response.pages
        pages_markdown = [page.markdown for page in pages]
        full_text = _PAGE_SEP.join(pages_markdown)

        segments, _ = extract_segments(pages_markdown)

        # Collect image data: map image ID → base64 data URI
        images: dict[str, str] = {}
        for page in pages:
            if page.images:
                for img in page.images:
                    if img.image_base64 and img.id:
                        images[img.id] = img.image_base64

        # Store the per-page markdown as the "source file" for reconstruction
        source_b64 = base64.standard_b64encode(
            full_text.encode("utf-8")
        ).decode("utf-8")

        return ExtractionResult(
            text=full_text,
            source_filename=filename,
            source_format="pdf",
            page_count=len(pages),
            metadata={"images": images} if images else {},
            segments=segments,
            source_file_b64=source_b64,
        )
