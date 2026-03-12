import asyncio

import structlog

from ..exceptions import OutputError

log = structlog.get_logger()

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
.body {
    column-count: 2;
    column-gap: 2em;
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


class PDFConverter:
    format_name = "pdf"
    content_type = "application/pdf"
    file_extension = ".pdf"

    def _build_html(self, markdown_text: str) -> str:
        from markdown_it import MarkdownIt
        md = MarkdownIt()
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
