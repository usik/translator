import asyncio
import io
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
from xml.sax.saxutils import escape

from ..exceptions import OutputError

_TEMPLATE_DIR = Path(__file__).parent / "hwpx_template"

_NAMESPACES = (
    'xmlns:ha="http://www.hancom.co.kr/hwpml/2011/app" '
    'xmlns:hp="http://www.hancom.co.kr/hwpml/2011/paragraph" '
    'xmlns:hp10="http://www.hancom.co.kr/hwpml/2016/paragraph" '
    'xmlns:hs="http://www.hancom.co.kr/hwpml/2011/section" '
    'xmlns:hc="http://www.hancom.co.kr/hwpml/2011/core" '
    'xmlns:hh="http://www.hancom.co.kr/hwpml/2011/head" '
    'xmlns:hhs="http://www.hancom.co.kr/hwpml/2011/history" '
    'xmlns:hm="http://www.hancom.co.kr/hwpml/2011/master-page" '
    'xmlns:hpf="http://www.hancom.co.kr/schema/2011/hpf" '
    'xmlns:dc="http://purl.org/dc/elements/1.1/" '
    'xmlns:opf="http://www.idpf.org/2007/opf/" '
    'xmlns:ooxmlchart="http://www.hancom.co.kr/hwpml/2016/ooxmlchart" '
    'xmlns:hwpunitchar="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar" '
    'xmlns:epub="http://www.idpf.org/2007/ops" '
    'xmlns:config="urn:oasis:names:tc:opendocument:xmlns:config:1.0"'
)

_TEMPLATE_FILES = [
    "version.xml",
    "Contents/header.xml",
    "Scripts/headerScripts",
    "Scripts/sourceScripts",
    "settings.xml",
    "META-INF/container.rdf",
    "Contents/content.hpf",
    "META-INF/container.xml",
    "META-INF/manifest.xml",
]


class HwpxConverter:
    format_name = "hwpx"
    content_type = "application/hwp+zip"
    file_extension = ".hwpx"

    def _build_section_xml(self, text: str) -> str:
        paragraphs = text.split("\n")

        para_elements = []
        for i, para_text in enumerate(paragraphs):
            escaped = escape(para_text)
            para_elements.append(
                f'<hp:p id="{i}" paraPrIDRef="0" styleIDRef="0" '
                f'pageBreak="0" columnBreak="0" merged="0">'
                f'<hp:run charPrIDRef="0"><hp:t>{escaped}</hp:t></hp:run>'
                f"</hp:p>"
            )

        return (
            '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>'
            f"<hs:sec {_NAMESPACES}>"
            + "".join(para_elements)
            + "</hs:sec>"
        )

    def _generate_sync(self, text: str, **options) -> bytes:
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            info = zipfile.ZipInfo("mimetype")
            info.compress_type = zipfile.ZIP_STORED
            zf.writestr(info, "application/hwp+zip")

            for rel_path in _TEMPLATE_FILES:
                template_file = _TEMPLATE_DIR / rel_path
                zf.writestr(rel_path, template_file.read_bytes())

            zf.writestr("Contents/section0.xml", self._build_section_xml(text))

        return buf.getvalue()

    async def convert(self, text: str, **options) -> bytes:
        try:
            return await asyncio.to_thread(self._generate_sync, text, **options)
        except Exception as e:
            raise OutputError(f"HWPX generation failed: {e}") from e

    def _replace_paragraph_text(self, para_elem: ET.Element, new_text: str) -> None:
        t_elements = []
        for elem in para_elem.iter():
            tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
            if tag == "t":
                t_elements.append(elem)
        if t_elements:
            t_elements[0].text = new_text
            for t in t_elements[1:]:
                t.text = ""

    def _convert_structured_sync(self, source_file: bytes, segments: list) -> bytes:
        seg_map = {s.id: s.text for s in segments}
        zf_in = zipfile.ZipFile(io.BytesIO(source_file))
        buf = io.BytesIO()

        with zf_in, zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf_out:
            section_files = sorted(
                f
                for f in zf_in.namelist()
                if f.lower().startswith("contents/section")
                and f.lower().endswith(".xml")
            )

            for item in zf_in.namelist():
                if item in section_files:
                    continue
                if item == "mimetype":
                    info = zipfile.ZipInfo("mimetype")
                    info.compress_type = zipfile.ZIP_STORED
                    zf_out.writestr(info, zf_in.read(item))
                else:
                    zf_out.writestr(item, zf_in.read(item))

            for si, section_file in enumerate(section_files):
                with zf_in.open(section_file) as f:
                    tree = ET.parse(f)
                    root = tree.getroot()

                pi = 0
                for elem in root.iter():
                    tag = elem.tag.split("}")[-1] if "}" in elem.tag else elem.tag
                    if tag in ("p", "para"):
                        parts = []
                        for sub in elem.iter():
                            st = sub.tag.split("}")[-1] if "}" in sub.tag else sub.tag
                            if st == "t" and sub.text:
                                parts.append(sub.text)
                        if "".join(parts).strip():
                            seg_id = f"s{si}_p{pi}"
                            if seg_id in seg_map:
                                self._replace_paragraph_text(elem, seg_map[seg_id])
                            pi += 1

                zf_out.writestr(
                    section_file,
                    ET.tostring(root, encoding="unicode", xml_declaration=True),
                )

        return buf.getvalue()

    async def convert_structured(self, source_file: bytes, segments: list) -> bytes:
        try:
            return await asyncio.to_thread(
                self._convert_structured_sync, source_file, segments,
            )
        except Exception as e:
            raise OutputError(f"HWPX structured conversion failed: {e}") from e
