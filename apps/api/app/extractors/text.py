import chardet

from ..schemas import ExtractionResult


class TextExtractor:
    supported_extensions = [".txt", ".csv", ".md", ".json", ".xml", ".html"]
    supported_content_types = [
        "text/plain",
        "text/csv",
        "text/markdown",
        "application/json",
        "text/xml",
        "text/html",
    ]

    async def extract(self, file_bytes: bytes, filename: str) -> ExtractionResult:
        try:
            text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            detected = chardet.detect(file_bytes)
            encoding = detected.get("encoding") or "utf-8"
            text = file_bytes.decode(encoding, errors="replace")

        return ExtractionResult(
            text=text,
            source_filename=filename,
            source_format="text",
            metadata={"byte_length": len(file_bytes)},
        )
