import json
from typing import AsyncIterator

import structlog
from openai import AsyncOpenAI

from ..exceptions import LLMError
from ..schemas import ChatMessage, ChatResponse, TokenUsage

log = structlog.get_logger()


class OpenAIProvider:
    """OpenAI provider via the standard OpenAI API."""

    provider_name = "openai"

    def __init__(self, api_key: str, default_model: str = "gpt-4o-mini") -> None:
        self._client = AsyncOpenAI(api_key=api_key)
        self._default_model = default_model

    def _format_messages(self, messages: list[ChatMessage]) -> list[dict]:
        return [{"role": m.role, "content": m.content} for m in messages]

    async def chat(
        self, messages: list[ChatMessage], model: str, **options
    ) -> ChatResponse:
        model = model or self._default_model
        # Map Gemini model names to OpenAI equivalents when used as fallback
        if "gemini" in model:
            model = self._default_model
        try:
            kwargs: dict = {
                "model": model,
                "messages": self._format_messages(messages),
                "temperature": options.get("temperature"),
                "max_tokens": options.get("max_tokens"),
                "stream": False,
            }
            if options.get("json_mode"):
                kwargs["response_format"] = {"type": "json_object"}
            response = await self._client.chat.completions.create(**kwargs)
        except Exception as e:
            raise LLMError(f"OpenAI API error: {e}") from e

        choice = response.choices[0]
        usage = None
        if response.usage:
            usage = TokenUsage(
                prompt_tokens=response.usage.prompt_tokens,
                completion_tokens=response.usage.completion_tokens,
                total_tokens=response.usage.total_tokens,
            )

        return ChatResponse(
            content=choice.message.content or "",
            provider=self.provider_name,
            model=response.model,
            usage=usage,
            metadata={"finish_reason": choice.finish_reason},
        )

    async def chat_stream(
        self, messages: list[ChatMessage], model: str, **options
    ) -> AsyncIterator[str]:
        model = model or self._default_model
        if "gemini" in model:
            model = self._default_model
        try:
            stream = await self._client.chat.completions.create(
                model=model,
                messages=self._format_messages(messages),
                temperature=options.get("temperature"),
                max_tokens=options.get("max_tokens"),
                stream=True,
            )
        except Exception as e:
            raise LLMError(f"OpenAI API error: {e}") from e

        usage = None
        async for chunk in stream:
            if hasattr(chunk, "usage") and chunk.usage:
                usage = {
                    "prompt_tokens": chunk.usage.prompt_tokens,
                    "completion_tokens": chunk.usage.completion_tokens,
                    "total_tokens": chunk.usage.total_tokens,
                }

            if chunk.choices:
                delta = chunk.choices[0].delta
                if delta and delta.content:
                    yield f'data: {json.dumps({"content": delta.content})}\n\n'

        yield f'data: {json.dumps({"done": True, "usage": usage})}\n\n'
