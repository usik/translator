"""
HWP5 binary file extractor.

Parses .hwp files (Hancom's legacy binary format) using:
- olefile: OLE2/CFB compound file access
- zlib: stream decompression
- struct: binary record parsing

HWP5 format reference: Hancom public specification
All open-source HWP parsers (pyhwp, hwp2md, OpenHWP, hwp-rs) use this same approach.
"""

import asyncio
import base64
import io
import struct
import zlib

import olefile

from ..exceptions import ExtractionError
from ..schemas import ExtractionResult, TextSegment

# ---------------------------------------------------------------------------
# HWP5 constants
# ---------------------------------------------------------------------------

HWP_SIGNATURE = b"HWP Document File"

# FileHeader flags (uint32 at offset 36)
FLAG_COMPRESSED = 1 << 0
FLAG_ENCRYPTED = 1 << 1
FLAG_DISTRIBUTE = 1 << 2

# Tag IDs (base = 0x010 = 16 per Hancom spec)
HWPTAG_BEGIN = 0x010
HWPTAG_PARA_HEADER = HWPTAG_BEGIN + 50   # 66
HWPTAG_PARA_TEXT = HWPTAG_BEGIN + 51     # 67
HWPTAG_PARA_CHAR_SHAPE = HWPTAG_BEGIN + 52  # 68

# Inline control characters that consume 8 extra bytes
# Characters 1-3 and 11-12 are "extended" controls with 8-byte inline objects
# Characters 4-9 are also inline controls with 8-byte objects
# Characters 14-23 are inline controls with 8-byte objects
_INLINE_CHAR_EXTRA = set(range(1, 10)) | {11, 12} | set(range(14, 24))


# ---------------------------------------------------------------------------
# Binary record parser
# ---------------------------------------------------------------------------

def _iter_records(data: bytes):
    """Iterate over HWP5 binary records in a stream.

    Each record has a 4-byte LE header:
      bits  0-9:  tag_id (10 bits)
      bits 10-19: level  (10 bits)
      bits 20-31: size   (12 bits)

    If size == 0xFFF, the next 4 bytes are the actual uint32 size.
    """
    offset = 0
    while offset + 4 <= len(data):
        header = struct.unpack_from("<I", data, offset)[0]
        offset += 4

        tag_id = header & 0x3FF
        level = (header >> 10) & 0x3FF
        size = (header >> 20) & 0xFFF

        if size == 0xFFF:
            if offset + 4 > len(data):
                break
            size = struct.unpack_from("<I", data, offset)[0]
            offset += 4

        if offset + size > len(data):
            break

        yield tag_id, level, data[offset:offset + size]
        offset += size


# ---------------------------------------------------------------------------
# Text decoder
# ---------------------------------------------------------------------------

def _decode_para_text(data: bytes) -> str:
    """Decode UTF-16LE paragraph text, skipping HWP control characters.

    HWP5 uses UTF-16LE with special control chars in the 0-31 range.
    Some control chars have 8-byte inline extension objects that must be skipped.
    """
    chars: list[str] = []
    i = 0
    length = len(data)

    while i + 1 < length:
        code = data[i] | (data[i + 1] << 8)  # uint16 LE

        if code in _INLINE_CHAR_EXTRA:
            # Skip the 2-byte char + 8-byte inline object = 10 bytes total
            i += 2 + 8
        elif code < 32:
            # Other control chars: just skip the 2-byte char
            # But keep tab (9) and newline (10, 13) as whitespace
            if code == 9:
                chars.append("\t")
            elif code in (10, 13):
                chars.append("\n")
            i += 2
        else:
            chars.append(chr(code))
            i += 2

    return "".join(chars)


# ---------------------------------------------------------------------------
# Extractor
# ---------------------------------------------------------------------------

class Hwp5Extractor:
    """Extracts text from HWP5 binary files (.hwp)."""

    supported_extensions = [".hwp"]
    supported_content_types = ["application/x-hwp", "application/haansofthwp"]

    def _read_header(self, ole: olefile.OleFileIO) -> tuple[int, int]:
        """Read and validate the FileHeader. Returns (version, flags)."""
        if not ole.exists("FileHeader"):
            raise ExtractionError("Not a valid HWP file: missing FileHeader stream")

        header_data = ole.openstream("FileHeader").read()
        if len(header_data) < 40:
            raise ExtractionError("Not a valid HWP file: FileHeader too short")

        # Check signature
        sig = header_data[:17]
        if sig != HWP_SIGNATURE:
            raise ExtractionError(
                f"Not a valid HWP file: bad signature (got {sig!r})"
            )

        version = struct.unpack_from("<I", header_data, 32)[0]
        flags = struct.unpack_from("<I", header_data, 36)[0]

        return version, flags

    def _decompress_stream(self, raw: bytes, compressed: bool) -> bytes:
        """Decompress a stream if the file is compressed."""
        if not compressed:
            return raw
        try:
            return zlib.decompress(raw, -15)  # raw deflate (no zlib/gzip header)
        except zlib.error:
            # Some streams may not actually be compressed
            return raw

    def _get_section_streams(self, ole: olefile.OleFileIO) -> list[str]:
        """Find all BodyText/Section* streams, sorted."""
        streams = []
        for entry in ole.listdir():
            path = "/".join(entry)
            if path.startswith("BodyText/Section"):
                streams.append(path)
        return sorted(streams)

    def _extract_section_paragraphs(
        self, ole: olefile.OleFileIO, stream_path: str, compressed: bool
    ) -> list[str]:
        """Extract paragraph texts from a single section stream."""
        raw = ole.openstream(stream_path).read()
        data = self._decompress_stream(raw, compressed)

        paragraphs: list[str] = []

        for tag_id, _level, payload in _iter_records(data):
            if tag_id == HWPTAG_PARA_TEXT:
                text = _decode_para_text(payload)
                cleaned = text.strip()
                if cleaned:
                    paragraphs.append(cleaned)

        return paragraphs

    def _extract_sync(
        self, file_bytes: bytes, filename: str
    ) -> tuple[str, int, list[TextSegment]]:
        """Synchronous extraction logic."""
        try:
            ole = olefile.OleFileIO(io.BytesIO(file_bytes))
        except Exception as e:
            raise ExtractionError(
                f"Cannot open HWP file '{filename}': {e}"
            ) from e

        with ole:
            version, flags = self._read_header(ole)

            if flags & FLAG_ENCRYPTED:
                raise ExtractionError(
                    f"HWP file '{filename}' is encrypted. "
                    "Please remove the password and try again."
                )

            compressed = bool(flags & FLAG_COMPRESSED)

            section_streams = self._get_section_streams(ole)
            if not section_streams:
                raise ExtractionError(
                    f"No section streams found in HWP file: {filename}"
                )

            all_paragraphs: list[str] = []
            segments: list[TextSegment] = []

            for si, stream_path in enumerate(section_streams):
                paragraphs = self._extract_section_paragraphs(
                    ole, stream_path, compressed
                )
                for pi, para_text in enumerate(paragraphs):
                    segments.append(
                        TextSegment(
                            id=f"s{si}_p{pi}",
                            text=para_text,
                            path=f"{stream_path}:p[{pi}]",
                        )
                    )
                    all_paragraphs.append(para_text)

        full_text = "\n\n".join(all_paragraphs)
        return full_text, len(section_streams), segments

    async def extract(
        self, file_bytes: bytes, filename: str
    ) -> ExtractionResult:
        text, section_count, _segments = await asyncio.to_thread(
            self._extract_sync, file_bytes, filename
        )
        return ExtractionResult(
            text=text,
            source_filename=filename,
            source_format="hwp",
            page_count=section_count,
            metadata={"sections": section_count, "format": "hwp5"},
        )

    async def extract_structured(
        self, file_bytes: bytes, filename: str
    ) -> ExtractionResult:
        text, section_count, segments = await asyncio.to_thread(
            self._extract_sync, file_bytes, filename
        )
        return ExtractionResult(
            text=text,
            source_filename=filename,
            source_format="hwp",
            page_count=section_count,
            segments=segments,
            source_file_b64=base64.b64encode(file_bytes).decode("ascii"),
            metadata={"sections": section_count, "format": "hwp5"},
        )
