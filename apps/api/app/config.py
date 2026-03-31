from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parents[1] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Service
    service_name: str = "translator-api"
    service_version: str = "1.0.0"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # API Keys
    gemini_api_key: str = ""
    mistral_api_key: str = ""
    openai_api_key: str = ""

    # Provider Fallback
    # Comma-separated ordered list of provider names to try on failure.
    # E.g. "gemini,openai" tries Gemini first, then OpenAI.
    fallback_providers: str = "gemini,openai"
    openai_default_model: str = "gpt-4o-mini"

    # Feature Toggles
    enable_whisper: bool = False
    whisper_model_size: str = "base"

    # Defaults
    default_provider: str = "gemini-2.5-flash"
    default_model: str = "gemini-2.5-flash"
    default_output_format: str = "text"
    default_target_language: str = "ko"

    # CORS
    cors_origins: str = "http://localhost:3000"

    # API Key Auth (comma-separated list of valid keys; empty = open access)
    api_keys: str = ""

    # Rate Limiting
    rate_limit_per_minute: int = 30

    # File Size
    max_file_size_mb: int = 20
