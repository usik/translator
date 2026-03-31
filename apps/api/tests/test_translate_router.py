"""Integration tests for the translate API endpoints.

Uses FastAPI's TestClient with mock registries — no external API keys required.
"""

from __future__ import annotations

import json
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.converters import ConverterRegistry
from app.converters.text import TextConverter
from app.dependencies import (
    get_converter_registry,
    get_extractor_registry,
    get_provider_registry,
    get_settings,
)
from app.extractors import ExtractorRegistry
from app.extractors.text import TextExtractor
from app.providers import ProviderRegistry
from app.routers import translate as translate_router
from app.schemas import ChatResponse, TokenUsage


# ---------------------------------------------------------------------------
# Minimal mock provider
# ---------------------------------------------------------------------------

class MockProvider:
    provider_name = "mock"

    def __init__(self, response: str = "번역된 텍스트") -> None:
        self._response = response

    async def chat(self, messages, model: str, **options) -> ChatResponse:
        return ChatResponse(
            content=self._response,
            provider=self.provider_name,
            model=model,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=5, total_tokens=15),
        )

    async def chat_stream(self, messages, model, **options):
        yield self._response


# ---------------------------------------------------------------------------
# App factory for tests (no lifespan, direct DI override)
# ---------------------------------------------------------------------------

def _make_test_app(provider_response: str = "번역된 텍스트") -> FastAPI:
    """Build a minimal FastAPI app with mock dependencies injected."""
    from app.config import Settings

    ext_reg = ExtractorRegistry()
    ext_reg.register(TextExtractor())

    prov_reg = ProviderRegistry()
    prov_reg.register(MockProvider(response=provider_response))

    conv_reg = ConverterRegistry()
    conv_reg.register(TextConverter())

    settings = Settings(
        gemini_api_key="fake-key",
        default_provider="mock",
        default_model="mock-model",
    )

    app = FastAPI()
    app.include_router(translate_router.router)

    app.dependency_overrides[get_settings] = lambda: settings
    app.dependency_overrides[get_extractor_registry] = lambda: ext_reg
    app.dependency_overrides[get_provider_registry] = lambda: prov_reg
    app.dependency_overrides[get_converter_registry] = lambda: conv_reg

    # Attach limiter (required by slowapi decorator)
    from slowapi import Limiter
    from slowapi.util import get_remote_address
    app.state.limiter = Limiter(key_func=get_remote_address)

    return app


@pytest.fixture()
def client() -> TestClient:
    return TestClient(_make_test_app())


@pytest.fixture()
def client_factory():
    def _factory(provider_response: str = "번역된 텍스트") -> TestClient:
        return TestClient(_make_test_app(provider_response=provider_response))
    return _factory


# ---------------------------------------------------------------------------
# POST /api/v1/translate/text
# ---------------------------------------------------------------------------

class TestTranslateText:
    def test_basic_translation_returns_200(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "Hello world", "source_language": "en", "target_language": "ko"},
        )
        assert resp.status_code == 200

    def test_response_envelope(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "Hello", "target_language": "ko"},
        )
        body = resp.json()
        assert body["success"] is True
        assert "data" in body

    def test_translated_text_in_response(self, client_factory):
        client = client_factory(provider_response="안녕하세요")
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "Hello", "target_language": "ko"},
        )
        assert resp.json()["data"]["translated_text"] == "안녕하세요"

    def test_language_fields_echoed(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "Hi", "source_language": "en", "target_language": "ja"},
        )
        data = resp.json()["data"]
        assert data["source_language"] == "en"
        assert data["target_language"] == "ja"

    def test_provider_and_model_in_response(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "Hi", "target_language": "ko"},
        )
        data = resp.json()["data"]
        assert data["provider"] == "mock"
        assert "model" in data

    def test_metadata_contains_char_counts(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "Hello", "target_language": "ko"},
        )
        meta = resp.json()["data"]["metadata"]
        assert "input_chars" in meta
        assert "output_chars" in meta
        assert "translation_time_ms" in meta

    def test_text_too_long_returns_422(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "x" * 10001, "target_language": "ko"},
        )
        assert resp.status_code == 422

    def test_missing_text_returns_422(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate/text",
            json={"target_language": "ko"},
        )
        assert resp.status_code == 422


# ---------------------------------------------------------------------------
# POST /api/v1/translate (multipart)
# ---------------------------------------------------------------------------

class TestTranslateFile:
    def test_text_form_input_returns_200(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate",
            data={"text": "Hello world", "target_language": "ko"},
        )
        assert resp.status_code == 200

    def test_text_form_response_envelope(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate",
            data={"text": "Hi", "target_language": "ko"},
        )
        body = resp.json()
        assert body["success"] is True
        assert "data" in body

    def test_translated_text_returned(self, client_factory):
        client = client_factory(provider_response="반갑습니다")
        resp = client.post(
            "/api/v1/translate",
            data={"text": "Hello", "target_language": "ko"},
        )
        data = resp.json()["data"]
        assert data["translated_text"] == "반갑습니다"

    def test_txt_file_upload(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate",
            data={"target_language": "ko"},
            files={"file": ("test.txt", b"Hello file content", "text/plain")},
        )
        assert resp.status_code == 200

    def test_missing_both_file_and_text_returns_400(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate",
            data={"target_language": "ko"},
        )
        assert resp.status_code == 400

    def test_unsupported_file_format_returns_400(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate",
            data={"target_language": "ko"},
            files={"file": ("test.xyz", b"binary content", "application/octet-stream")},
        )
        assert resp.status_code == 400

    def test_same_language_skips_translation(self, client_factory):
        """Source == target language: translation is skipped, original text returned."""
        client = client_factory(provider_response="SHOULD_NOT_APPEAR")
        resp = client.post(
            "/api/v1/translate",
            data={"text": "Same language text.", "source_language": "ko", "target_language": "ko"},
        )
        assert resp.status_code == 200
        data = resp.json()["data"]
        assert data["translated_text"] == "Same language text."
        assert data["metadata"].get("skipped_translation") is True

    def test_metadata_has_extraction_time_for_file(self, client: TestClient):
        resp = client.post(
            "/api/v1/translate",
            data={"target_language": "ko"},
            files={"file": ("doc.txt", b"Content", "text/plain")},
        )
        meta = resp.json()["data"]["metadata"]
        assert "extraction_time_ms" in meta

    def test_default_target_language_used_when_not_specified(self, client: TestClient):
        """When target_language is omitted, the settings default is used."""
        resp = client.post(
            "/api/v1/translate",
            data={"text": "Hello"},
        )
        # Should not raise 422 — default target language is applied from settings
        assert resp.status_code == 200


# ---------------------------------------------------------------------------
# GET /api/v1/health (sanity check the router is included)
# ---------------------------------------------------------------------------

class TestHealthEndpointNotIncluded:
    def test_translate_text_route_exists(self, client: TestClient):
        """Confirms the /translate/text route is registered."""
        resp = client.post(
            "/api/v1/translate/text",
            json={"text": "test", "target_language": "ko"},
        )
        # Route exists (not 404)
        assert resp.status_code != 404
