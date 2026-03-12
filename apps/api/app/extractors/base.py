from __future__ import annotations

from typing import Protocol, runtime_checkable

from ..schemas import ExtractionResult


@runtime_checkable
class Extractor(Protocol):
    supported_extensions: list[str]
    supported_content_types: list[str]

    async def extract(self, file_bytes: bytes, filename: str) -> ExtractionResult: ...
