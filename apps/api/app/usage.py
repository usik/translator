"""In-memory translation usage tracking.

Stats are accumulated per process lifetime (reset on redeploy).  A future
version can persist to a database; for now structured logs on Railway provide
the durable record.
"""

import asyncio
from collections import Counter
from dataclasses import dataclass, field

import structlog

log = structlog.get_logger()


@dataclass
class _UsageStore:
    total_translations: int = 0
    language_pairs: Counter = field(default_factory=Counter)
    formats: Counter = field(default_factory=Counter)
    providers: Counter = field(default_factory=Counter)
    total_input_chars: int = 0
    total_duration_ms: int = 0


_store = _UsageStore()
_lock = asyncio.Lock()


async def record_translation(
    *,
    source_language: str,
    target_language: str,
    source_format: str | None,
    output_format: str,
    input_chars: int,
    duration_ms: int,
    provider: str,
    api_key: str | None = None,
) -> None:
    """Append one translation event to in-memory stats and emit a structured log."""
    pair = f"{source_language}->{target_language}"
    fmt = source_format or output_format

    log.info(
        "usage.translation",
        source_language=source_language,
        target_language=target_language,
        language_pair=pair,
        source_format=source_format,
        output_format=output_format,
        input_chars=input_chars,
        duration_ms=duration_ms,
        provider=provider,
        authenticated=api_key is not None,
    )

    async with _lock:
        _store.total_translations += 1
        _store.language_pairs[pair] += 1
        _store.formats[fmt] += 1
        _store.providers[provider] += 1
        _store.total_input_chars += input_chars
        _store.total_duration_ms += duration_ms


def get_stats_snapshot() -> dict:
    """Return a snapshot of current stats (no lock needed for reads)."""
    total = _store.total_translations
    return {
        "total_translations": total,
        "top_language_pairs": [
            {"pair": p, "count": c}
            for p, c in _store.language_pairs.most_common(10)
        ],
        "top_formats": dict(_store.formats.most_common(10)),
        "top_providers": dict(_store.providers.most_common(5)),
        "total_input_chars": _store.total_input_chars,
        "avg_duration_ms": (
            round(_store.total_duration_ms / total) if total > 0 else 0
        ),
    }
