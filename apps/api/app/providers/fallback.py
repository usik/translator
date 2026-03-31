from __future__ import annotations

from typing import AsyncIterator

import structlog

from .base import LLMProvider
from ..exceptions import LLMError
from ..schemas import ChatMessage, ChatResponse

log = structlog.get_logger()


class FallbackProvider:
    """Wraps an ordered list of providers, trying each on failure.

    Registered under the primary provider's name so callers are unaware
    of the fallback mechanism.
    """

    def __init__(self, providers: list[LLMProvider], primary_name: str) -> None:
        if not providers:
            raise ValueError("FallbackProvider requires at least one provider")
        self._providers = providers
        self.provider_name = primary_name

    async def chat(
        self, messages: list[ChatMessage], model: str, **options
    ) -> ChatResponse:
        last_error: Exception | None = None
        for provider in self._providers:
            try:
                response = await provider.chat(messages, model, **options)
                if provider is not self._providers[0]:
                    log.info(
                        "fallback.provider.used",
                        primary=self._providers[0].provider_name,
                        fallback=provider.provider_name,
                    )
                return response
            except Exception as exc:
                log.warning(
                    "provider.failed",
                    provider=provider.provider_name,
                    error=str(exc),
                )
                last_error = exc

        raise LLMError(
            f"All providers failed. Last error: {last_error}"
        ) from last_error

    async def chat_stream(
        self, messages: list[ChatMessage], model: str, **options
    ) -> AsyncIterator[str]:
        """Try streaming from each provider in order.

        Note: for fallback on streaming we eagerly try each provider. If a
        provider raises during setup (before yielding), we fall through to the
        next one. Mid-stream errors cannot be caught transparently, so they
        propagate normally.
        """
        last_error: Exception | None = None
        for provider in self._providers:
            try:
                # Attempt to obtain the async generator; errors during setup raise here
                stream = provider.chat_stream(messages, model, **options)
                if provider is not self._providers[0]:
                    log.info(
                        "fallback.provider.used.stream",
                        primary=self._providers[0].provider_name,
                        fallback=provider.provider_name,
                    )
                async for chunk in stream:
                    yield chunk
                return
            except Exception as exc:
                log.warning(
                    "provider.failed.stream",
                    provider=provider.provider_name,
                    error=str(exc),
                )
                last_error = exc

        raise LLMError(
            f"All providers failed during streaming. Last error: {last_error}"
        ) from last_error
