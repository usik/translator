"""Shared pytest fixtures for the translator API test suite."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.converters import ConverterRegistry
from app.converters.text import TextConverter
from app.dependencies import set_registries
from app.extractors import ExtractorRegistry
from app.extractors.text import TextExtractor
from app.main import create_app
from app.providers import ProviderRegistry
from app.schemas import ChatResponse, TokenUsage


class MockLLMProvider:
    """A mock LLM provider that echoes a configurable response."""

    provider_name = "mock"

    def __init__(self, response: str = "translated text") -> None:
        self._response = response

    async def chat(self, messages, model: str, **options) -> ChatResponse:
        return ChatResponse(
            content=self._response,
            provider=self.provider_name,
            model=model,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=5, total_tokens=15),
        )

    async def chat_stream(self, messages, model: str, **options):
        yield self._response


@pytest.fixture()
def mock_provider() -> MockLLMProvider:
    return MockLLMProvider(response="번역된 텍스트")


@pytest.fixture()
def extractor_registry() -> ExtractorRegistry:
    reg = ExtractorRegistry()
    reg.register(TextExtractor())
    return reg


@pytest.fixture()
def provider_registry(mock_provider: MockLLMProvider) -> ProviderRegistry:
    reg = ProviderRegistry()
    reg.register(mock_provider)
    return reg


@pytest.fixture()
def converter_registry() -> ConverterRegistry:
    reg = ConverterRegistry()
    reg.register(TextConverter())
    return reg


@pytest.fixture()
def client(
    extractor_registry: ExtractorRegistry,
    provider_registry: ProviderRegistry,
    converter_registry: ConverterRegistry,
) -> TestClient:
    """TestClient with mock registries injected; no external API calls."""
    set_registries(extractor_registry, provider_registry, converter_registry)
    app = create_app()
    # Override lifespan so it doesn't re-init registries from env
    return TestClient(app, raise_server_exceptions=True)
