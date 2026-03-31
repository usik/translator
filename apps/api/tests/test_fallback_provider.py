"""Tests for the FallbackProvider logic (no API keys required)."""

from __future__ import annotations

import asyncio

import pytest

from app.exceptions import LLMError
from app.providers.fallback import FallbackProvider
from app.schemas import ChatMessage, ChatResponse, TokenUsage


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _run(coro):
    """Run a coroutine synchronously."""
    return asyncio.get_event_loop().run_until_complete(coro)


def _run_gen(agen):
    """Collect all items from an async generator synchronously."""
    async def _collect():
        return [item async for item in agen]
    return _run(_collect())


def _make_message(text: str = "hello") -> list[ChatMessage]:
    return [ChatMessage(role="user", content=text)]


def _ok_response(provider: str = "primary") -> ChatResponse:
    return ChatResponse(
        content="translated",
        provider=provider,
        model="test-model",
        usage=TokenUsage(prompt_tokens=5, completion_tokens=5, total_tokens=10),
    )


class OkProvider:
    """Always succeeds."""

    def __init__(self, name: str = "primary") -> None:
        self.provider_name = name
        self.calls = 0

    async def chat(self, messages, model: str, **options) -> ChatResponse:
        self.calls += 1
        return _ok_response(self.provider_name)

    async def chat_stream(self, messages, model: str, **options):
        self.calls += 1
        yield f'data: {{"content": "chunk"}}\n\n'
        yield f'data: {{"done": true}}\n\n'


class FailProvider:
    """Always raises LLMError."""

    def __init__(self, name: str = "failing") -> None:
        self.provider_name = name
        self.calls = 0

    async def chat(self, messages, model: str, **options) -> ChatResponse:
        self.calls += 1
        raise LLMError(f"{self.provider_name} is down")

    async def chat_stream(self, messages, model: str, **options):
        self.calls += 1
        raise LLMError(f"{self.provider_name} stream is down")
        yield  # type: ignore[misc]  # makes this an async generator


# ---------------------------------------------------------------------------
# Constructor
# ---------------------------------------------------------------------------


def test_fallback_requires_at_least_one_provider():
    with pytest.raises(ValueError):
        FallbackProvider([], primary_name="gemini-2.5-flash")


def test_fallback_takes_primary_name():
    p = OkProvider("gemini")
    fb = FallbackProvider([p], primary_name="gemini-2.5-flash")
    assert fb.provider_name == "gemini-2.5-flash"


# ---------------------------------------------------------------------------
# chat() — success path
# ---------------------------------------------------------------------------


def test_chat_primary_succeeds_no_fallback_called():
    primary = OkProvider("gemini")
    fallback = OkProvider("openai")
    fb = FallbackProvider([primary, fallback], primary_name="gemini-2.5-flash")

    resp = _run(fb.chat(_make_message(), model="gemini-2.5-flash"))

    assert resp.content == "translated"
    assert primary.calls == 1
    assert fallback.calls == 0


def test_chat_falls_back_when_primary_fails():
    primary = FailProvider("gemini")
    fallback = OkProvider("openai")
    fb = FallbackProvider([primary, fallback], primary_name="gemini-2.5-flash")

    resp = _run(fb.chat(_make_message(), model="gemini-2.5-flash"))

    assert resp.content == "translated"
    assert resp.provider == "openai"
    assert primary.calls == 1
    assert fallback.calls == 1


def test_chat_raises_when_all_providers_fail():
    p1 = FailProvider("gemini")
    p2 = FailProvider("openai")
    fb = FallbackProvider([p1, p2], primary_name="gemini-2.5-flash")

    with pytest.raises(LLMError, match="All providers failed"):
        _run(fb.chat(_make_message(), model="gemini-2.5-flash"))

    assert p1.calls == 1
    assert p2.calls == 1


def test_chat_single_provider_success():
    primary = OkProvider("gemini")
    fb = FallbackProvider([primary], primary_name="gemini-2.5-flash")

    resp = _run(fb.chat(_make_message(), model="gemini-2.5-flash"))
    assert resp.content == "translated"


def test_chat_single_provider_failure_propagates():
    primary = FailProvider("gemini")
    fb = FallbackProvider([primary], primary_name="gemini-2.5-flash")

    with pytest.raises(LLMError):
        _run(fb.chat(_make_message(), model="gemini-2.5-flash"))


# ---------------------------------------------------------------------------
# chat_stream() — success path
# ---------------------------------------------------------------------------


def test_stream_primary_succeeds_no_fallback_called():
    primary = OkProvider("gemini")
    fallback = OkProvider("openai")
    fb = FallbackProvider([primary, fallback], primary_name="gemini-2.5-flash")

    chunks = _run_gen(fb.chat_stream(_make_message(), model="gemini-2.5-flash"))

    assert len(chunks) == 2
    assert primary.calls == 1
    assert fallback.calls == 0


def test_stream_falls_back_when_primary_fails():
    primary = FailProvider("gemini")
    fallback = OkProvider("openai")
    fb = FallbackProvider([primary, fallback], primary_name="gemini-2.5-flash")

    chunks = _run_gen(fb.chat_stream(_make_message(), model="gemini-2.5-flash"))

    assert len(chunks) == 2
    assert primary.calls == 1
    assert fallback.calls == 1


def test_stream_raises_when_all_providers_fail():
    p1 = FailProvider("gemini")
    p2 = FailProvider("openai")
    fb = FallbackProvider([p1, p2], primary_name="gemini-2.5-flash")

    with pytest.raises(LLMError, match="All providers failed"):
        _run_gen(fb.chat_stream(_make_message(), model="gemini-2.5-flash"))

    assert p1.calls == 1
    assert p2.calls == 1
