from functools import lru_cache

from .config import Settings
from .extractors import ExtractorRegistry
from .providers import ProviderRegistry
from .converters import ConverterRegistry


@lru_cache
def get_settings() -> Settings:
    return Settings()


# These will be initialized in main.py lifespan and set here
_extractor_registry: ExtractorRegistry | None = None
_provider_registry: ProviderRegistry | None = None
_converter_registry: ConverterRegistry | None = None


def set_registries(
    extractors: ExtractorRegistry,
    providers: ProviderRegistry,
    converters: ConverterRegistry,
) -> None:
    global _extractor_registry, _provider_registry, _converter_registry
    _extractor_registry = extractors
    _provider_registry = providers
    _converter_registry = converters


def get_extractor_registry() -> ExtractorRegistry:
    assert _extractor_registry is not None, "ExtractorRegistry not initialized"
    return _extractor_registry


def get_provider_registry() -> ProviderRegistry:
    assert _provider_registry is not None, "ProviderRegistry not initialized"
    return _provider_registry


def get_converter_registry() -> ConverterRegistry:
    assert _converter_registry is not None, "ConverterRegistry not initialized"
    return _converter_registry
