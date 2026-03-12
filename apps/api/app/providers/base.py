from __future__ import annotations

from typing import AsyncIterator, Protocol, runtime_checkable

from ..schemas import ChatMessage, ChatResponse


@runtime_checkable
class LLMProvider(Protocol):
    provider_name: str

    async def chat(
        self, messages: list[ChatMessage], model: str, **options
    ) -> ChatResponse: ...

    async def chat_stream(
        self, messages: list[ChatMessage], model: str, **options
    ) -> AsyncIterator[str]: ...
