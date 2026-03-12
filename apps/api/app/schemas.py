from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


# --- Success / Error Envelopes ---

class SuccessResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T


class ErrorDetail(BaseModel):
    code: str
    message: str
    field: str | None = None


class ErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail


class TextSegment(BaseModel):
    """A text segment with position info for format-preserving translation."""
    id: str
    text: str
    path: str


# --- Input Models ---

class ExtractionResult(BaseModel):
    text: str
    source_filename: str
    source_format: str
    page_count: int | None = None
    language_detected: str | None = None
    confidence: float | None = None
    metadata: dict[str, Any] = {}
    segments: list[TextSegment] | None = None
    source_file_b64: str | None = None


class TextExtractionRequest(BaseModel):
    text: str
    source_filename: str = "input.txt"


# --- LLM Models ---

class ChatMessage(BaseModel):
    role: str
    content: str


class TokenUsage(BaseModel):
    prompt_tokens: int | None = None
    completion_tokens: int | None = None
    total_tokens: int | None = None


class ChatResponse(BaseModel):
    content: str
    provider: str
    model: str
    usage: TokenUsage | None = None
    metadata: dict[str, Any] = {}


# --- Output Models ---

class OutputResult(BaseModel):
    content_type: str
    filename: str
    file_size_bytes: int
    output_format: str
    metadata: dict[str, Any] = {}


# --- Translation Models ---

class TranslateTextRequest(BaseModel):
    text: str
    source_language: str = "auto"
    target_language: str = "ko"
    output_format: str = "text"


class TranslateResult(BaseModel):
    translated_text: str
    source_language: str
    target_language: str
    source_format: str | None = None
    output_format: str
    provider: str
    model: str
    metadata: dict[str, Any] = {}


# --- Health ---

class HealthResponse(BaseModel):
    status: str = "healthy"
    service: str = "translator-api"
    version: str = "1.0.0"
