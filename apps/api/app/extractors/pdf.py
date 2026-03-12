import asyncio
import base64

from ..schemas import ExtractionResult


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
