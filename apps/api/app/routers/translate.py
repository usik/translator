import base64
import time

import structlog
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from ..config import Settings
from ..dependencies import (
    get_converter_registry,
    get_extractor_registry,
    get_provider_registry,
    get_settings,
)
from ..extractors import ExtractorRegistry
from ..providers import ProviderRegistry
from ..converters import ConverterRegistry
from ..prompts import build_messages, build_segment_messages, parse_translated_segments
from ..schemas import SuccessResponse, TranslateResult, TranslateTextRequest

log = structlog.get_logger()

router = APIRouter(prefix="/api/v1")

_OUTPUT_CONTENT_TYPES = {
    "pdf": ("application/pdf", ".pdf"),
    "docx": ("application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".docx"),
    "hwpx": ("application/hwp+zip", ".hwpx"),
}


@router.post("/translate/text")
async def translate_text(
    req: TranslateTextRequest,
    settings: Settings = Depends(get_settings),
    provider_registry: ProviderRegistry = Depends(get_provider_registry),
    converter_registry: ConverterRegistry = Depends(get_converter_registry),
):
    """Translate plain text (JSON body)."""
    provider_name = settings.default_provider
    model = settings.default_model

    provider = provider_registry.get(provider_name)
    if provider is None:
        raise HTTPException(status_code=500, detail=f"Provider '{provider_name}' not available")

    total_start = time.monotonic()

    messages = build_messages(req.text, req.source_language, req.target_language)
    chat_response = await provider.chat(messages, model)

    translated_text = chat_response.content
    translation_time_ms = round((time.monotonic() - total_start) * 1000)

    log.info(
        "translation.done",
        input_chars=len(req.text),
        output_chars=len(translated_text),
        elapsed_ms=translation_time_ms,
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

        return Response(
            content=file_bytes,
            media_type=content_type,
            headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
        )

    return SuccessResponse(data=TranslateResult(
        translated_text=translated_text,
        source_language=req.source_language,
        target_language=req.target_language,
        output_format=req.output_format,
        provider=chat_response.provider,
        model=chat_response.model,
        metadata=metadata,
    ))


@router.post("/translate")
async def translate_file(
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
):
    """Translate file or text (multipart form)."""
    if not target_language:
        target_language = settings.default_target_language
    if not output_format:
        output_format = settings.default_output_format

    provider_name = settings.default_provider
    model = settings.default_model

    if file is None and not text:
        raise HTTPException(
            status_code=400,
            detail={"code": "MISSING_INPUT", "message": "Either 'file' or 'text' must be provided."},
        )

    total_start = time.monotonic()
    source_format = None
    extraction_time_ms = None
    extraction_result = None

    try:
        # Step 1: Extract text from file
        if file is not None:
            extract_start = time.monotonic()
            file_bytes = await file.read()

            # Validate file size
            max_bytes = settings.max_file_size_mb * 1024 * 1024
            if len(file_bytes) > max_bytes:
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Max size: {settings.max_file_size_mb}MB",
                )

            filename = file.filename or "upload"
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

                    return Response(
                        content=patched_bytes,
                        media_type=content_type,
                        headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
                    )

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

                return Response(
                    content=out_bytes,
                    media_type=content_type,
                    headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
                )

            return SuccessResponse(data=TranslateResult(
                translated_text=translated_text,
                source_language=source_language,
                target_language=target_language,
                source_format=source_format,
                output_format=output_format,
                provider="none (same language)",
                model="none",
                metadata=metadata,
            ))

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

            messages = build_segment_messages(
                extraction_result.segments, source_language, target_language,
            )
            translate_start = time.monotonic()
            chat_response = await provider.chat(messages, model)
            translation_time_ms = round((time.monotonic() - translate_start) * 1000)

            translated_segments = parse_translated_segments(
                chat_response.content, extraction_result.segments,
            )

            converter = converter_registry.get(extraction_result.source_format)
            if converter and hasattr(converter, "convert_structured"):
                source_bytes = base64.b64decode(extraction_result.source_file_b64)
                patched_bytes = await converter.convert_structured(source_bytes, translated_segments)

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

                return Response(
                    content=patched_bytes,
                    media_type=content_type,
                    headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
                )

        # Step 2: Translate via LLM
        provider = provider_registry.get(provider_name)
        if provider is None:
            raise HTTPException(status_code=500, detail=f"Provider '{provider_name}' not available")

        messages = build_messages(text, source_language, target_language)
        translate_start = time.monotonic()
        chat_response = await provider.chat(messages, model)
        translated_text = chat_response.content
        translation_time_ms = round((time.monotonic() - translate_start) * 1000)

        log.info(
            "translation.done",
            input_chars=len(text),
            output_chars=len(translated_text),
            elapsed_ms=translation_time_ms,
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

            return Response(
                content=out_bytes,
                media_type=content_type,
                headers={"Content-Disposition": f'attachment; filename="translated_output{ext}"'},
            )

        return SuccessResponse(data=TranslateResult(
            translated_text=translated_text,
            source_language=source_language,
            target_language=target_language,
            source_format=source_format,
            output_format=output_format,
            provider=chat_response.provider,
            model=chat_response.model,
            metadata=metadata,
        ))

    except HTTPException:
        raise
    except Exception as e:
        log.exception("Unexpected error in translate pipeline")
        raise HTTPException(
            status_code=500,
            detail={"code": "INTERNAL_ERROR", "message": str(e)},
        )
