import asyncio
import tempfile
from pathlib import Path

import structlog

from ..exceptions import OutputError
from .docx import DocxConverter

log = structlog.get_logger()

_soffice_semaphore = asyncio.Semaphore(1)


async def _docx_bytes_to_pdf(docx_bytes: bytes, timeout: int = 120) -> bytes:
    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = Path(tmpdir) / "input.docx"
        input_path.write_bytes(docx_bytes)

        async with _soffice_semaphore:
            proc = await asyncio.create_subprocess_exec(
                "soffice",
                "--headless",
                "--norestore",
                "--convert-to", "pdf",
                "--outdir", tmpdir,
                str(input_path),
                env={"HOME": "/tmp", "PATH": "/usr/local/bin:/usr/bin:/bin"},
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            try:
                stdout, stderr = await asyncio.wait_for(
                    proc.communicate(), timeout=timeout,
                )
            except asyncio.TimeoutError:
                proc.kill()
                await proc.communicate()
                raise OutputError(
                    f"LibreOffice conversion timed out after {timeout}s",
                )

        if proc.returncode != 0:
            log.error(
                "soffice.failed",
                returncode=proc.returncode,
                stderr=stderr.decode(errors="replace")[:500],
            )
            raise OutputError(
                f"LibreOffice conversion failed (exit {proc.returncode})",
            )

        output_path = Path(tmpdir) / "input.pdf"
        if not output_path.exists() or output_path.stat().st_size == 0:
            raise OutputError("LibreOffice produced no output")

        return output_path.read_bytes()


class DocxToPdfConverter:
    format_name = "docx_to_pdf"
    content_type = "application/pdf"
    file_extension = ".pdf"

    def __init__(self) -> None:
        self._docx_converter = DocxConverter()

    async def convert(self, text: str, **options) -> bytes:
        try:
            docx_bytes = await self._docx_converter.convert(text, **options)
            return await _docx_bytes_to_pdf(docx_bytes)
        except OutputError:
            raise
        except Exception as e:
            raise OutputError(f"DOCX-to-PDF conversion failed: {e}") from e

    async def convert_file(self, file_bytes: bytes) -> bytes:
        try:
            return await _docx_bytes_to_pdf(file_bytes)
        except OutputError:
            raise
        except Exception as e:
            raise OutputError(f"DOCX-to-PDF file conversion failed: {e}") from e
