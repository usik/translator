from __future__ import annotations

import structlog

from .base import LLMProvider

log = structlog.get_logger()


class ProviderRegistry:
    """Maps provider names to LLMProvider instances."""

    def __init__(self) -> None:
        self._providers: dict[str, LLMProvider] = {}

    def register(self, provider: LLMProvider) -> None:
        self._providers[provider.provider_name] = provider
        log.info("Registered LLM provider", provider=provider.provider_name)

    def get(self, name: str) -> LLMProvider | None:
        return self._providers.get(name)

    @property
    def available_providers(self) -> list[str]:
        return sorted(self._providers.keys())
