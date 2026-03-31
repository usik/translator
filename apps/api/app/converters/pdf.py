import asyncio
import base64
import re

import structlog

from ..exceptions import OutputError

log = structlog.get_logger()


_TABLE_BLOCK_RE = re.compile(
    r"((?:^\|.+\|[ \t]*\n?)+)",
    re.MULTILINE,
)


def _latex_to_mathml(text: str) -> str:
    """Convert LaTeX math to MathML for WeasyPrint rendering.

    Handles:
    - ``$$...$$`` display math
    - ``$...$`` inline math
    - bare ``^{...}`` superscripts and ``_{...}`` subscripts outside math mode

    Skips table blocks (pipe-delimited lines) to avoid mangling ``$`` in values.
    Gracefully falls back to the raw string on conversion errors.
    """
    import latex2mathml.converter

    def _safe_convert(latex: str) -> str:
        try:
            return latex2mathml.converter.convert(latex.strip())
        except Exception:
            return latex

    def _convert_display(m: re.Match) -> str:
        return _safe_convert(m.group(1))

    def _convert_inline(m: re.Match) -> str:
        return _safe_convert(m.group(1))

    def _convert_section(section: str) -> str:
        section = re.sub(r"\$\$(.+?)\$\$", _convert_display, section, flags=re.DOTALL)
        section = re.sub(r"\$(.+?)\$", _convert_inline, section)
        section = re.sub(r"\^\{([^}]*)\}", r"<sup>\1</sup>", section)
        section = re.sub(r"_\{([^}]*)\}", r"<sub>\1</sub>", section)
        return section

    # Split text into table blocks and non-table sections
    parts = _TABLE_BLOCK_RE.split(text)
    result: list[str] = []
    for part in parts:
        if _TABLE_BLOCK_RE.fullmatch(part):
            result.append(part)  # keep table as-is
        else:
            result.append(_convert_section(part))
    return "".join(result)

_CSS_TEMPLATE = """\
@page {
    size: A4;
    margin: 2cm 1.5cm;
}
body {
    font-family: "Nanum Gothic", "Noto Sans CJK KR", sans-serif;
    font-size: 10pt;
    line-height: 1.4;
    color: #000;
}
.header {
    text-align: center;
    margin-bottom: 1em;
}
.header h1 {
    font-size: 16pt;
    margin-bottom: 0.5em;
}
.header h6 {
    font-size: 9pt;
    font-variant: small-caps;
    font-weight: bold;
    text-align: left;
    margin-top: 1em;
}
.header p {
    text-align: left;
}
.body h2 {
    font-size: 12pt;
    margin-top: 0.8em;
}
"""

_HTML_TEMPLATE = """\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
<div class="header">{header}</div>
<div class="body">{body}</div>
</body>
</html>
"""

_STRUCTURED_CSS = """\
@page {
    size: A4;
    margin: 2cm 1.5cm;
}
body {
    font-family: "Nanum Gothic", "Noto Sans CJK KR", "Noto Sans JP",
                 "Noto Sans SC", sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: #000;
}
h1 { font-size: 16pt; margin: 0.6em 0 0.3em; }
h2 { font-size: 13pt; margin: 0.5em 0 0.3em; }
h3 { font-size: 11pt; margin: 0.4em 0 0.2em; }
table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.5em 0;
    font-size: 9pt;
}
th, td {
    border: 1px solid #999;
    padding: 4px 6px;
    text-align: left;
}
th { background: #f0f0f0; font-weight: bold; }
hr { border: none; border-top: 1px solid #ccc; margin: 1.5em 0; }
ul, ol { margin: 0.3em 0; padding-left: 2.5em; }
ol { list-style-type: decimal; }
img { max-width: 100%; height: auto; margin: 0.5em 0; }
"""

_STRUCTURED_HTML = """\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>{content}</body>
</html>
"""


class PDFConverter:
    format_name = "pdf"
    content_type = "application/pdf"
    file_extension = ".pdf"

    def _build_html(self, markdown_text: str) -> str:
        from markdown_it import MarkdownIt
        markdown_text = _latex_to_mathml(markdown_text)
        md = MarkdownIt("commonmark", {"html": True})
        html = md.render(markdown_text)

        split_marker = "<h2>"
        idx = html.find(split_marker)
        if idx > 0:
            header_html = html[:idx]
            body_html = html[idx:]
        else:
            header_html = ""
            body_html = html

        return _HTML_TEMPLATE.format(header=header_html, body=body_html)

    def _generate_sync(self, text: str, **options) -> bytes:
        import weasyprint
        full_html = self._build_html(text)
        css = weasyprint.CSS(string=_CSS_TEMPLATE)
        pdf_bytes = weasyprint.HTML(string=full_html).write_pdf(stylesheets=[css])
        log.info("pdf.generated", size=len(pdf_bytes))
        return pdf_bytes

    async def convert(self, text: str, **options) -> bytes:
        try:
            return await asyncio.to_thread(self._generate_sync, text, **options)
        except Exception as e:
            raise OutputError(f"PDF generation failed: {e}") from e

    @staticmethod
    def _inject_images(html: str, images: dict[str, str]) -> str:
        """Replace markdown image refs with base64 <img> tags."""
        for img_id, b64_data in images.items():
            if b64_data.startswith("data:"):
                data_uri = b64_data
            else:
                ext = img_id.rsplit(".", 1)[-1] if "." in img_id else "jpeg"
                data_uri = f"data:image/{ext};base64,{b64_data}"
            html = html.replace(f'src="{img_id}"', f'src="{data_uri}"')
        return html

    def _convert_structured_sync(
        self, source_file: bytes, segments: list,
        metadata: dict | None = None,
    ) -> bytes:
        import weasyprint

        from ..markdown_ast import apply_translations, render_pages_html

        original_md = source_file.decode("utf-8")
        page_sep = "\n\n---\n\n"
        pages_markdown = original_md.split(page_sep)

        # Build translation map from segments
        seg_map = {s.id: s.text for s in segments if s.text}

        # Apply translations to token trees and render to HTML
        page_tokens = apply_translations(seg_map, pages_markdown)
        html_content = render_pages_html(page_tokens)

        # Convert remaining LaTeX math to MathML
        html_content = _latex_to_mathml(html_content)

        # Inject images as base64 data URIs
        images = (metadata or {}).get("images", {})
        if images:
            html_content = self._inject_images(html_content, images)

        full_html = _STRUCTURED_HTML.format(content=html_content)
        css = weasyprint.CSS(string=_STRUCTURED_CSS)
        pdf_bytes = weasyprint.HTML(string=full_html).write_pdf(stylesheets=[css])
        log.info("pdf.structured_generated", size=len(pdf_bytes),
                 images=len(images))
        return pdf_bytes

    async def convert_structured(
        self, source_file: bytes, segments: list,
        metadata: dict | None = None,
    ) -> bytes:
        try:
            return await asyncio.to_thread(
                self._convert_structured_sync, source_file, segments,
                metadata,
            )
        except Exception as e:
            raise OutputError(f"PDF structured conversion failed: {e}") from e
