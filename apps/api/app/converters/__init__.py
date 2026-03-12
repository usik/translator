from __future__ import annotations

import structlog

from .base import Converter

log = structlog.get_logger()


class ConverterRegistry:
    """Maps format names to Converter instances."""

    def __init__(self) -> None:
        self._converters: dict[str, Converter] = {}

    def register(self, converter: Converter) -> None:
        if not isinstance(converter, Converter):
            raise TypeError(
                f"{type(converter).__name__} does not satisfy the Converter protocol"
            )
        self._converters[converter.format_name] = converter
        log.info("Registered output converter", format=converter.format_name)

    def get(self, format_name: str) -> Converter | None:
        return self._converters.get(format_name)

    @property
    def supported_formats(self) -> list[str]:
        return sorted(self._converters.keys())
