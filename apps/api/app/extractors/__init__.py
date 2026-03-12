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
        # Separate registry for extractors that support format-preserving extraction
        self._structured_by_extension: dict[str, Extractor] = {}

    def register(self, extractor: Extractor) -> None:
        has_structured = hasattr(extractor, "extract_structured")
        for ext in extractor.supported_extensions:
            ext_lower = ext.lower()
            self._by_extension[ext_lower] = extractor
            if has_structured:
                self._structured_by_extension[ext_lower] = extractor
            log.info(
                "Registered extractor",
                extractor=type(extractor).__name__,
                extension=ext_lower,
                structured=has_structured,
            )

        for ct in extractor.supported_content_types:
            self._by_content_type[ct.lower()] = extractor

    def resolve(self, filename: str, content_type: str | None = None) -> Extractor | None:
        ext = PurePosixPath(filename).suffix.lower()
        extractor = self._by_extension.get(ext)
        if extractor is None and content_type:
            base_type = content_type.split(";")[0].strip().lower()
            extractor = self._by_content_type.get(base_type)
        return extractor

    def resolve_structured(self, filename: str) -> Extractor | None:
        """Resolve an extractor that supports extract_structured(), falling back to default."""
        ext = PurePosixPath(filename).suffix.lower()
        return self._structured_by_extension.get(ext) or self._by_extension.get(ext)

    @property
    def supported_extensions(self) -> list[str]:
        return sorted(self._by_extension.keys())

    @property
    def supported_content_types(self) -> list[str]:
        return sorted(self._by_content_type.keys())
