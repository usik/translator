from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .config import Settings
from .dependencies import get_settings, set_registries
from .exceptions import ServiceError
from .logging import RequestIdMiddleware, setup_logging

from .extractors import ExtractorRegistry
from .extractors.text import TextExtractor
from .extractors.docx import BasicDocxExtractor
from .extractors.hwp import HwpExtractor
from .extractors.hwp5 import Hwp5Extractor

from .providers import ProviderRegistry
from .providers.gemini import GeminiProvider

from .converters import ConverterRegistry
from .converters.text import TextConverter
from .converters.pdf import PDFConverter
from .converters.docx import DocxConverter
from .converters.docx_to_pdf import DocxToPdfConverter
from .converters.hwpx import HwpxConverter

from .routers import health, translate, convert, formats, invoice

log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    setup_logging(settings.service_name, settings.debug)

    # --- Init Extractor Registry ---
    extractor_registry = ExtractorRegistry()
    extractor_registry.register(TextExtractor())
    extractor_registry.register(BasicDocxExtractor())
    extractor_registry.register(HwpExtractor())
    extractor_registry.register(Hwp5Extractor())

    # Register OCR-based extractors if Mistral key is set
    if settings.mistral_api_key:
        from .extractors.pdf import PDFExtractor
        from .extractors.image import ImageExtractor
        from .extractors.docx import DocxExtractor

        extractor_registry.register(PDFExtractor(settings.mistral_api_key))
        extractor_registry.register(ImageExtractor(settings.mistral_api_key))
        # Override basic docx with OCR-based
        extractor_registry.register(DocxExtractor(settings.mistral_api_key))
        log.info("OCR extractors enabled (Mistral)")

    # Register Whisper extractor if enabled
    if settings.enable_whisper:
        from .extractors.voice import VoiceExtractor
        extractor_registry.register(VoiceExtractor(model_size=settings.whisper_model_size))
        log.info("Whisper voice extractor enabled")

    # --- Init Provider Registry ---
    provider_registry = ProviderRegistry()
    if settings.gemini_api_key:
        provider_registry.register(GeminiProvider(settings.gemini_api_key))
        log.info("Gemini provider enabled")

    # --- Init Converter Registry ---
    converter_registry = ConverterRegistry()
    converter_registry.register(TextConverter())
    converter_registry.register(PDFConverter())
    converter_registry.register(DocxConverter())
    converter_registry.register(DocxToPdfConverter())
    converter_registry.register(HwpxConverter())

    # Make registries available via dependency injection
    set_registries(extractor_registry, provider_registry, converter_registry)

    log.info(
        "startup.complete",
        extractors=extractor_registry.supported_extensions,
        providers=provider_registry.available_providers,
        converters=converter_registry.supported_formats,
    )

    yield

    log.info("shutdown")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Translator API",
        version="1.0.0",
        lifespan=lifespan,
    )

    # --- Rate Limiting ---
    limiter = Limiter(key_func=get_remote_address)
    app.state.limiter = limiter

    @app.exception_handler(RateLimitExceeded)
    async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
        return JSONResponse(
            status_code=429,
            content={"success": False, "error": {"code": "RATE_LIMITED", "message": "Too many requests"}},
        )

    # --- CORS ---
    origins = [o.strip() for o in settings.cors_origins.split(",")]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Request ID ---
    app.add_middleware(RequestIdMiddleware)

    # --- Global Error Handler ---
    @app.exception_handler(ServiceError)
    async def service_error_handler(request: Request, exc: ServiceError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": {"code": exc.code, "message": exc.message}},
        )

    # --- Routers ---
    app.include_router(health.router)
    app.include_router(translate.router)
    app.include_router(convert.router)
    app.include_router(formats.router)
    app.include_router(invoice.router)

    return app


app = create_app()
