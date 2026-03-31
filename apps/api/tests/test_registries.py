"""Unit tests for ExtractorRegistry, ConverterRegistry, and ProviderRegistry."""

import pytest

from app.converters import ConverterRegistry
from app.converters.text import TextConverter
from app.extractors import ExtractorRegistry
from app.extractors.text import TextExtractor
from app.providers import ProviderRegistry
from app.schemas import ChatResponse


# ---------------------------------------------------------------------------
# ExtractorRegistry
# ---------------------------------------------------------------------------

class TestExtractorRegistry:
    def test_register_and_resolve_by_extension(self):
        reg = ExtractorRegistry()
        ext = TextExtractor()
        reg.register(ext)
        assert reg.resolve("document.txt") is ext

    def test_resolve_extension_case_insensitive(self):
        reg = ExtractorRegistry()
        ext = TextExtractor()
        reg.register(ext)
        assert reg.resolve("DOCUMENT.TXT") is ext

    def test_resolve_by_content_type_fallback(self):
        reg = ExtractorRegistry()
        ext = TextExtractor()
        reg.register(ext)
        # Extension not registered but content-type is
        assert reg.resolve("unknown_file", "text/plain") is ext

    def test_resolve_returns_none_for_unknown(self):
        reg = ExtractorRegistry()
        assert reg.resolve("file.xyz") is None

    def test_resolve_content_type_strips_params(self):
        reg = ExtractorRegistry()
        ext = TextExtractor()
        reg.register(ext)
        assert reg.resolve("file.xyz", "text/plain; charset=utf-8") is ext

    def test_resolve_structured_returns_extractor(self):
        """TextExtractor has no extract_structured, so should still fall back."""
        reg = ExtractorRegistry()
        ext = TextExtractor()
        reg.register(ext)
        # Falls back to normal extractor since no structured extractor exists
        assert reg.resolve_structured("file.txt") is ext

    def test_resolve_structured_prefers_structured_extractor(self):
        """If an extractor has extract_structured, it should be preferred."""
        class StructuredExtractor:
            supported_extensions = [".txt"]
            supported_content_types = ["text/plain"]

            async def extract(self, file_bytes, filename):
                pass

            async def extract_structured(self, file_bytes, filename):
                pass

        reg = ExtractorRegistry()
        basic = TextExtractor()
        structured = StructuredExtractor()
        reg.register(basic)
        reg.register(structured)
        assert reg.resolve_structured("doc.txt") is structured

    def test_supported_extensions_sorted(self):
        reg = ExtractorRegistry()
        reg.register(TextExtractor())
        exts = reg.supported_extensions
        assert exts == sorted(exts)

    def test_multiple_extractors_registered(self):
        class PdfLikeExtractor:
            supported_extensions = [".pdf"]
            supported_content_types = ["application/pdf"]
            async def extract(self, b, f): pass

        reg = ExtractorRegistry()
        txt = TextExtractor()
        pdf = PdfLikeExtractor()
        reg.register(txt)
        reg.register(pdf)
        assert reg.resolve("doc.txt") is txt
        assert reg.resolve("report.pdf") is pdf


# ---------------------------------------------------------------------------
# ConverterRegistry
# ---------------------------------------------------------------------------

class TestConverterRegistry:
    def test_register_and_get(self):
        reg = ConverterRegistry()
        conv = TextConverter()
        reg.register(conv)
        assert reg.get("text") is conv

    def test_get_returns_none_for_unknown(self):
        reg = ConverterRegistry()
        assert reg.get("pdf") is None

    def test_supported_formats_sorted(self):
        reg = ConverterRegistry()
        reg.register(TextConverter())
        fmts = reg.supported_formats
        assert fmts == sorted(fmts)

    def test_register_overwrites_same_format(self):
        class AnotherTextConverter:
            format_name = "text"
            async def convert(self, text, **kw): return b""

        reg = ConverterRegistry()
        first = TextConverter()
        second = AnotherTextConverter()
        reg.register(first)
        reg.register(second)
        assert reg.get("text") is second


# ---------------------------------------------------------------------------
# ProviderRegistry
# ---------------------------------------------------------------------------

class TestProviderRegistry:
    def test_register_and_get(self):
        class FakeProvider:
            provider_name = "fake"
            async def chat(self, messages, model, **kw): pass
            async def chat_stream(self, messages, model, **kw): pass

        reg = ProviderRegistry()
        p = FakeProvider()
        reg.register(p)
        assert reg.get("fake") is p

    def test_get_returns_none_for_unknown(self):
        reg = ProviderRegistry()
        assert reg.get("nonexistent") is None

    def test_available_providers_sorted(self):
        class P1:
            provider_name = "zzz"
            async def chat(self, *a, **kw): pass
            async def chat_stream(self, *a, **kw): pass

        class P2:
            provider_name = "aaa"
            async def chat(self, *a, **kw): pass
            async def chat_stream(self, *a, **kw): pass

        reg = ProviderRegistry()
        reg.register(P1())
        reg.register(P2())
        providers = reg.available_providers
        assert providers == sorted(providers)
