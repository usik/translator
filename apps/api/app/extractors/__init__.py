from __future__ import annotations

from pathlib import PurePosixPath

import structlog

from .base import Extractor

log = structlog.get_logger()


class ExtractorRegistry:
    """Maps file extensions and MIME types to Extractor instances."""

    def __init__(self) -> None:
        self._by_extension: dict[str, Extractor] = {}
        self._by_content_type: dict[str, Extractor] = {}

    def register(self, extractor: Extractor) -> None:
        if not isinstance(extractor, Extractor):
            raise TypeError(
                f"{type(extractor).__name__} does not satisfy the Extractor protocol"
            )

        for ext in extractor.supported_extensions:
            ext_lower = ext.lower()
            self._by_extension[ext_lower] = extractor
            log.info(
                "Registered extractor",
                extractor=type(extractor).__name__,
                extension=ext_lower,
            )

        for ct in extractor.supported_content_types:
            self._by_content_type[ct.lower()] = extractor

    def get_by_filename(self, filename: str) -> Extractor | None:
        ext = PurePosixPath(filename).suffix.lower()
        return self._by_extension.get(ext)

    def get_by_content_type(self, content_type: str) -> Extractor | None:
        base_type = content_type.split(";")[0].strip().lower()
        return self._by_content_type.get(base_type)

    def resolve(self, filename: str, content_type: str | None = None) -> Extractor | None:
        extractor = self.get_by_filename(filename)
        if extractor is None and content_type:
            extractor = self.get_by_content_type(content_type)
        return extractor

    @property
    def supported_extensions(self) -> list[str]:
        return sorted(self._by_extension.keys())

    @property
    def supported_content_types(self) -> list[str]:
        return sorted(self._by_content_type.keys())
