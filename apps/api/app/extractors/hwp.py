import asyncio
import base64
import io
import zipfile
import xml.etree.ElementTree as ET

from ..exceptions import ExtractionError
from ..schemas import ExtractionResult, TextSegment


class HwpExtractor:
    """Extracts text from HWPX files (Hancom's XML-based format)."""

    supported_extensions = [".hwpx"]
    supported_content_types = ["application/hwp+zip", "application/x-hwpx"]

    def _extract_sync(self, file_bytes: bytes, filename: str) -> tuple[str, int]:
        try:
            zf = zipfile.ZipFile(io.BytesIO(file_bytes))
        except zipfile.BadZipFile:
            raise ExtractionError(f"Invalid HWPX file (not a valid ZIP): {filename}")

        with zf:
            section_files = sorted(
                f
                for f in zf.namelist()
                if f.lower().startswith("contents/section") and f.lower().endswith(".xml")
            )

            if not section_files:
                raise ExtractionError(
                    f"No section files found in HWPX archive: {filename}"
                )

            all_text: list[str] = []

            for section_file in section_files:
                with zf.open(section_file) as f:
                    tree = ET.parse(f)
                    root = tree.getroot()

                section_text = self._extract_section_text(root)
                if section_text:
                    all_text.append(section_text)

        return "\n\n".join(all_text), len(section_files)

    def _extract_section_text(self, root: ET.Element) -> str:
        paragraphs: list[str] = []

        for elem in root.iter():
            tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag

            if tag in ("p", "para"):
                para_text = self._extract_paragraph_text(elem)
                if para_text.strip():
                    paragraphs.append(para_text)

        return "\n".join(paragraphs)

    def _extract_paragraph_text(self, para_elem: ET.Element) -> str:
        text_parts: list[str] = []

        for elem in para_elem.iter():
            tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag

            if tag == "t" and elem.text:
                text_parts.append(elem.text)

        return "".join(text_parts)

    async def extract(self, file_bytes: bytes, filename: str) -> ExtractionResult:
        text, section_count = await asyncio.to_thread(
            self._extract_sync, file_bytes, filename
        )

        return ExtractionResult(
            text=text,
            source_filename=filename,
            source_format="hwpx",
            page_count=section_count,
            metadata={"sections": section_count},
        )

    def _extract_structured_sync(
        self, file_bytes: bytes, filename: str,
    ) -> tuple[str, int, list[TextSegment]]:
        try:
            zf = zipfile.ZipFile(io.BytesIO(file_bytes))
        except zipfile.BadZipFile:
            raise ExtractionError(f"Invalid HWPX file (not a valid ZIP): {filename}")

        with zf:
            section_files = sorted(
                f
                for f in zf.namelist()
                if f.lower().startswith("contents/section") and f.lower().endswith(".xml")
            )

            if not section_files:
                raise ExtractionError(
                    f"No section files found in HWPX archive: {filename}"
                )

            all_text: list[str] = []
            segments: list[TextSegment] = []

            for si, section_file in enumerate(section_files):
                with zf.open(section_file) as f:
                    tree = ET.parse(f)
                    root = tree.getroot()

                pi = 0
                for elem in root.iter():
                    tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
                    if tag in ("p", "para"):
                        para_text = self._extract_paragraph_text(elem)
                        if para_text.strip():
                            segments.append(TextSegment(
                                id=f"s{si}_p{pi}",
                                text=para_text,
                                path=f"{section_file}:p[{pi}]",
                            ))
                            all_text.append(para_text)
                            pi += 1

        return "\n\n".join(all_text), len(section_files), segments

    async def extract_structured(self, file_bytes: bytes, filename: str) -> ExtractionResult:
        text, section_count, segments = await asyncio.to_thread(
            self._extract_structured_sync, file_bytes, filename,
        )
        return ExtractionResult(
            text=text,
            source_filename=filename,
            source_format="hwpx",
            page_count=section_count,
            segments=segments,
            source_file_b64=base64.b64encode(file_bytes).decode("ascii"),
            metadata={"sections": section_count},
        )
