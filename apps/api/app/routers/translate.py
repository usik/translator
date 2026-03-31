import asyncio
import base64
import time

import structlog
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse, Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from ..auth import verify_api_key
from ..billing import check_credits, estimate_pages, ingest_document_event
from ..config import Settings
from ..dependencies import (
    get_converter_registry,
    get_extractor_registry,
    get_provider_registry,
    get_settings,
)
from ..extractors import ExtractorRegistry
from ..free_tier import (
    COOKIE_NAME,
    check_and_increment,
    get_session_from_request,
    set_session_cookie,
)
from ..providers import ProviderRegistry
from ..converters import ConverterRegistry
from ..prompts import (
    build_messages,
    build_segment_messages,
    chunk_segments,
    extract_math,
    extract_math_from_segments,
    parse_translated_segments,
    restore_math,
    restore_math_in_segments,
)
from ..schemas import SuccessResponse, TextSegment, TranslateResult, TranslateTextRequest
from ..usage import record_translation

log = structlog.get_logger()

router = APIRouter(prefix="/api/v1")


def _rate_limit_key(request: Request) -> str:
    """Use X-API-Key as rate-limit key when present, else fall back to IP."""
    key = request.headers.get("X-API-Key")
    return key if key else get_remote_address(request)


limiter = Limiter(key_func=_rate_limit_key)


async def _check_access(
    request: Request,
    settings: Settings,
    api_key: str | None,
) -> str | None:
    """Gate access via free-tier limit (unauthenticated) or Polar credits (authenticated).

    Returns a new session ID string if one was created (caller must set the cookie),
    or None when no new session is needed.

    Raises HTTPException(402) when the caller is not allowed to proceed.
    """
    if api_key:
        # Authenticated — check Polar credit balance
        allowed, reason = await check_credits(settings=settings, external_customer_id=api_key)
        if not allowed:
            raise HTTPException(
                status_code=402,
                detail={
                    "code": "INSUFFICIENT_CREDITS",
                    "message": "No credits or active subscription. Please purchase credits at tryxenith.com.",
                },
            )
        return None

    # Unauthenticated — free tier (3 docs/day per IP+cookie)
    ip = get_remote_address(request)
    session = get_session_from_request(request)
    allowed, remaining, new_session = await check_and_increment(ip, session)
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "code": "FREE_TIER_LIMIT",
                "message": "Free tier limit reached (3 documents/day). Sign up for more at tryxenith.com.",
                "remaining": 0,
            },
        )
    return new_session


_OUTPUT_CONTENT_TYPES = {
    "pdf": ("application/pdf", ".pdf"),
    "docx": ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
    "hwpx": ("application/hwp+zip", ".hwpx"),
}


@router.post("/translate/text")
@limiter.limit("30/minute")
async def translate_text(
    request: Request,
    req: TranslateTextRequest,
    settings: Settings = Depends(get_settings),
    provider_registry: ProviderRegistry = Depends(get_provider_registry),
    converter_registry: ConverterRegistry = Depends(get_converter_registry),
    api_key: str | None = Depends(verify_api_key),
):
    """Translate plain text (JSON body)."""
    new_session = await _check_access(request, settings, api_key)

    provider_name = settings.default_provider
    model = settings.default_model

    provider = provider_registry.get(provider_name)
    if provider is None:
        raise HTTPException(status_code=500, detail=f"Provider '{provider_name}' not available")

    total_start = time.monotonic()

    text_for_llm, math_map = extract_math(req.text)
    messages = build_messages(text_for_llm, req.source_language, req.target_language)
    chat_response = await provider.chat(messages, model)

    translated_text = restore_math(chat_response.content, math_map)
    translation_time_ms = round((time.monotonic() - total_start) * 1000)

    log.info(
        "translation.done",
        input_chars=len(req.text),
        output_chars=len(translated_text),
        elapsed_ms=translation_time_ms,
    )

    await record_translation(
        source_language=req.source_language,
        target_language=req.target_language,
        source_format=None,
        output_format=req.output_format,
        input_chars=len(req.text),
        duration_ms=translation_time_ms,
        provider=chat_response.provider,
        api_key=api_key,
    )

    # Ingest billing event for authenticated users (fire-and-forget)
    if api_key:
        asyncio.create_task(
            ingest_document_event(
                settings=settings,
                external_customer_id=api_key,
                operation="translate",
                fmt="text",
                pages=estimate_pages(req.text),
                source_language=req.source_language,
                target_language=req.target_language,
                file_size_kb=len(req.text.encode()) // 1024,
            )
        )

    metadata = {
        "input_chars": len(req.text),
        "output_chars": len(translated_text),
        "translation_time_ms": translation_time_ms,
    }
    if chat_response.usage:
        metadata["token_usage"] = chat_response.usage.model_dump(exclude_none=True)

    # Convert to file format if requested
    if req.output_format != "text":
        converter = converter_registry.get(req.output_format)
        if converter is None:
            raise HTTPException(status_code=400, detail=f"Unsupported output format: {req.output_format}")

        file_bytes = await converter.convert(translated_text)
        ct_info = _OUTPUT_CONTENT_TYPES.get(req.output_format)
        content_type = ct_info[0] if ct_info else "application/octet-stream"
        ext = ct_info[1] if ct_info else f".{req.output_format}"

        resp = Response(
            content=file_bytes,
            media_type=content_type,
            headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
        )
        if new_session:
            set_session_cookie(resp, new_session)
        return resp

    resp = SuccessResponse(data=TranslateResult(
        translated_text=translated_text,
        source_language=req.source_language,
        target_language=req.target_language,
        output_format=req.output_format,
        provider=chat_response.provider,
        model=chat_response.model,
        metadata=metadata,
    ))
    if new_session:
        set_session_cookie(resp, new_session)
    return resp


@router.post("/translate")
@limiter.limit("20/minute")
async def translate_file(
    request: Request,
    file: UploadFile | None = File(None),
    text: str | None = Form(None),
    source_language: str = Form("auto"),
    target_language: str = Form(""),
    output_format: str = Form(""),
    preserve_format: bool = Form(False),
    settings: Settings = Depends(get_settings),
    extractor_registry: ExtractorRegistry = Depends(get_extractor_registry),
    provider_registry: ProviderRegistry = Depends(get_provider_registry),
    converter_registry: ConverterRegistry = Depends(get_converter_registry),
    api_key: str | None = Depends(verify_api_key),
):
    """Translate file or text (multipart form)."""
    if not target_language:
        target_language = settings.default_target_language
    if not output_format:
        output_format = settings.default_output_format
    if output_format == "txt":
        output_format = "text"

    provider_name = settings.default_provider
    model = settings.default_model

    if file is None and not text:
        raise HTTPException(
            status_code=400,
            detail={"code": "MISSING_INPUT", "message": "Either 'file' or 'text' must be provided."},
        )

    new_session = await _check_access(request, settings, api_key)

    total_start = time.monotonic()
    source_format = None
    extraction_time_ms = None
    extraction_result = None
    input_chars = len(text) if text else 0

    try:
        # Step 1: Extract text from file
        if file is not None:
            extract_start = time.monotonic()
            file_bytes = await file.read()
            input_chars = len(file_bytes)

            # Validate file size
            max_bytes = settings.max_file_size_mb * 1024 * 1024
            if len(file_bytes) > max_bytes:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Max size: {settings.max_file_size_mb}MB",
                )

            filename = file.filename or "upload"

            # When preserve_format, prefer extractor with extract_structured support
            if preserve_format:
                extractor = extractor_registry.resolve_structured(filename)
            else:
                extractor = extractor_registry.resolve(filename, file.content_type)
            if extractor is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format: {filename}",
                )

            # Use structured extraction if preserve_format and extractor supports it
            if preserve_format and hasattr(extractor, "extract_structured"):
                extraction_result = await extractor.extract_structured(file_bytes, filename)
            else:
                extraction_result = await extractor.extract(file_bytes, filename)

            text = extraction_result.text
            source_format = extraction_result.source_format
            extraction_time_ms = round((time.monotonic() - extract_start) * 1000)
            log.info(
                "extraction.done",
                chars=len(text),
                format=source_format,
                elapsed_ms=extraction_time_ms,
            )

        # Step 1.5: Same-language detection
        effective_source = source_language
        if effective_source == "auto" and extraction_result and extraction_result.language_detected:
            effective_source = extraction_result.language_detected

        same_language = (
            effective_source != "auto"
            and effective_source.lower() == target_language.lower()
        )

        if same_language:
            log.info("same_language.skip_llm", source=effective_source, target=target_language)

            # Structured passthrough
            if (
                preserve_format
                and extraction_result
                and extraction_result.segments
                and extraction_result.source_file_b64
            ):
                converter = converter_registry.get(extraction_result.source_format)
                if converter and hasattr(converter, "convert_structured"):
                    source_bytes = base64.b64decode(extraction_result.source_file_b64)
                    patched_bytes = await converter.convert_structured(source_bytes, extraction_result.segments)

                    ct_info = _OUTPUT_CONTENT_TYPES.get(extraction_result.source_format)
                    content_type = ct_info[0] if ct_info else "application/octet-stream"
                    ext = ct_info[1] if ct_info else f".{extraction_result.source_format}"

                    resp = Response(
                        content=patched_bytes,
                        media_type=content_type,
                        headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
                    )
                    if new_session:
                        set_session_cookie(resp, new_session)
                    return resp

            translated_text = text
            total_time_ms = round((time.monotonic() - total_start) * 1000)
            metadata = {
                "input_chars": len(text),
                "output_chars": len(translated_text),
                "translation_time_ms": 0,
                "total_time_ms": total_time_ms,
                "skipped_translation": True,
            }
            if extraction_time_ms is not None:
                metadata["extraction_time_ms"] = extraction_time_ms

            if output_format != "text":
                converter = converter_registry.get(output_format)
                if converter is None:
                    raise HTTPException(status_code=400, detail=f"Unsupported output format: {output_format}")
                out_bytes = await converter.convert(translated_text)

                ct_info = _OUTPUT_CONTENT_TYPES.get(output_format)
                content_type = ct_info[0] if ct_info else "application/octet-stream"
                ext = ct_info[1] if ct_info else f".{output_format}"

                resp = Response(
                    content=out_bytes,
                    media_type=content_type,
                    headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
                )
                if new_session:
                    set_session_cookie(resp, new_session)
                return resp

            resp = SuccessResponse(data=TranslateResult(
                translated_text=translated_text,
                source_language=source_language,
                target_language=target_language,
                source_format=source_format,
                output_format=output_format,
                provider="none (same language)",
                model="none",
                metadata=metadata,
            ))
            if new_session:
                set_session_cookie(resp, new_session)
            return resp

        # Structured translation: format-preserving
        if (
            preserve_format
            and extraction_result
            and extraction_result.segments
            and extraction_result.source_file_b64
        ):
            provider = provider_registry.get(provider_name)
            if provider is None:
                raise HTTPException(status_code=500, detail=f"Provider '{provider_name}' not available")

            chunks = chunk_segments(extraction_result.segments)
            log.info("translate.structured_chunks", chunks=len(chunks),
                     segments=len(extraction_result.segments))

            sem = asyncio.Semaphore(3)

            async def _translate_chunk(chunk: list[TextSegment]) -> list[TextSegment]:
                async with sem:
                    stripped_chunk, math_maps = extract_math_from_segments(chunk)
                    messages = build_segment_messages(
                        stripped_chunk, source_language, target_language,
                    )
                    chat_response = await provider.chat(messages, model)
                    translated = parse_translated_segments(
                        chat_response.content, stripped_chunk,
                    )
                    return restore_math_in_segments(translated, math_maps)

            translate_start = time.monotonic()
            chunk_results = await asyncio.gather(
                *[_translate_chunk(chunk) for chunk in chunks]
            )
            all_translated: list[TextSegment] = []
            for result in chunk_results:
                all_translated.extend(result)
            translation_time_ms = round((time.monotonic() - translate_start) * 1000)

            # Merge translated chunks back with any skipped segments (images etc.)
            translated_by_id = {s.id: s for s in all_translated}
            translated_segments = [
                translated_by_id.get(seg.id, seg)
                for seg in extraction_result.segments
            ]

            converter = converter_registry.get(extraction_result.source_format)
            if converter and hasattr(converter, "convert_structured"):
                source_bytes = base64.b64decode(extraction_result.source_file_b64)
                patched_bytes = await converter.convert_structured(
                    source_bytes, translated_segments,
                    metadata=extraction_result.metadata,
                )

                # Cross-format: DOCX source → PDF output
                if output_format == "pdf" and extraction_result.source_format == "docx":
                    docx_to_pdf = converter_registry.get("docx_to_pdf")
                    if docx_to_pdf and hasattr(docx_to_pdf, "convert_file"):
                        patched_bytes = await docx_to_pdf.convert_file(patched_bytes)
                    content_type = "application/pdf"
                    ext = ".pdf"
                else:
                    ct_info = _OUTPUT_CONTENT_TYPES.get(extraction_result.source_format)
                    content_type = ct_info[0] if ct_info else "application/octet-stream"
                    ext = ct_info[1] if ct_info else f".{extraction_result.source_format}"

                # Ingest billing event for authenticated users (fire-and-forget)
                if api_key:
                    asyncio.create_task(
                        ingest_document_event(
                            settings=settings,
                            external_customer_id=api_key,
                            operation="translate",
                            fmt=source_format or "unknown",
                            pages=len(extraction_result.segments) if extraction_result and extraction_result.segments else 1,
                            source_language=source_language,
                            target_language=target_language,
                            file_size_kb=input_chars // 1024,
                        )
                    )

                resp = Response(
                    content=patched_bytes,
                    media_type=content_type,
                    headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
                )
                if new_session:
                    set_session_cookie(resp, new_session)
                return resp

        # Step 2: Translate via LLM
        provider = provider_registry.get(provider_name)
        if provider is None:
            raise HTTPException(status_code=500, detail=f"Provider '{provider_name}' not available")

        text_for_llm, math_map = extract_math(text)
        messages = build_messages(text_for_llm, source_language, target_language)
        translate_start = time.monotonic()
        chat_response = await provider.chat(messages, model)
        translated_text = restore_math(chat_response.content, math_map)
        translation_time_ms = round((time.monotonic() - translate_start) * 1000)

        log.info(
            "translation.done",
            input_chars=len(text),
            output_chars=len(translated_text),
            elapsed_ms=translation_time_ms,
        )

        await record_translation(
            source_language=source_language,
            target_language=target_language,
            source_format=source_format,
            output_format=output_format,
            input_chars=input_chars,
            duration_ms=translation_time_ms,
            provider=chat_response.provider,
            api_key=api_key,
        )

        # Ingest billing event for authenticated users (fire-and-forget)
        if api_key:
            asyncio.create_task(
                ingest_document_event(
                    settings=settings,
                    external_customer_id=api_key,
                    operation="translate",
                    fmt=source_format or "text",
                    pages=estimate_pages(text),
                    source_language=source_language,
                    target_language=target_language,
                    file_size_kb=input_chars // 1024,
                )
            )

        total_time_ms = round((time.monotonic() - total_start) * 1000)
        metadata = {
            "input_chars": len(text),
            "output_chars": len(translated_text),
            "translation_time_ms": translation_time_ms,
            "total_time_ms": total_time_ms,
        }
        if extraction_time_ms is not None:
            metadata["extraction_time_ms"] = extraction_time_ms
        if chat_response.usage:
            metadata["token_usage"] = chat_response.usage.model_dump(exclude_none=True)

        # Step 3: Convert output
        if output_format != "text":
            effective_format = output_format
            if output_format == "pdf" and source_format == "docx":
                effective_format = "docx_to_pdf"

            converter = converter_registry.get(effective_format)
            if converter is None:
                raise HTTPException(status_code=400, detail=f"Unsupported output format: {output_format}")

            out_bytes = await converter.convert(translated_text)
            convert_time_ms = round((time.monotonic() - total_start) * 1000) - translation_time_ms
            metadata["conversion_time_ms"] = convert_time_ms

            ct_info = _OUTPUT_CONTENT_TYPES.get(output_format)
            content_type = ct_info[0] if ct_info else "application/octet-stream"
            ext = ct_info[1] if ct_info else f".{output_format}"

            resp = Response(
                content=out_bytes,
                media_type=content_type,
                headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
            )
            if new_session:
                set_session_cookie(resp, new_session)
            return resp

        resp = SuccessResponse(data=TranslateResult(
            translated_text=translated_text,
            source_language=source_language,
            target_language=target_language,
            source_format=source_format,
            output_format=output_format,
            provider=chat_response.provider,
            model=chat_response.model,
            metadata=metadata,
        ))
        if new_session:
            set_session_cookie(resp, new_session)
        return resp

    except HTTPException:
        raise
    except Exception as e:
        log.exception("Unexpected error in translate pipeline")
        raise HTTPException(
            status_code=500,
            detail={"code": "INTERNAL_ERROR", "message": str(e)},
        )
