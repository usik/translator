from __future__ import annotations

from typing import Protocol, runtime_checkable


@runtime_checkable
class Converter(Protocol):
    format_name: str
    content_type: str
    file_extension: str

    async def convert(self, text: str, **options) -> bytes: ...
