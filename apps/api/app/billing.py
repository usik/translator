"""Polar billing integration — event ingestion and credit balance checks.

Events are sent to Polar after each document is processed (fire-and-forget).
Credit checks happen before processing when `polar_billing_enabled=True`.

Uses lazy imports to avoid adding Polar SDK to the cold-start critical path.
Fails open on all network/SDK errors so billing issues never block users.
"""

from __future__ import annotations

import asyncio
from typing import TYPE_CHECKING

import structlog

if TYPE_CHECKING:
    from .config import Settings

log = structlog.get_logger()


def _get_client(access_token: str):
    """Lazily import and return a configured Polar client."""
    from polar_sdk import Polar  # noqa: PLC0415

    return Polar(access_token=access_token)


async def ingest_document_event(
    *,
    settings: Settings,
    external_customer_id: str,
    operation: str,
    fmt: str,
    pages: int = 1,
    source_language: str = "auto",
    target_language: str = "",
    file_size_kb: int = 0,
) -> None:
    """Send a document_processed event to Polar.

    Fire-and-forget: errors are logged but never raised.
    Skipped entirely when POLAR_ACCESS_TOKEN is not configured.
    """
    if not settings.polar_access_token:
        return

    def _call() -> None:
        client = _get_client(settings.polar_access_token)
        client.events.ingest(
            request={
                "events": [
                    {
                        "name": "document_processed",
                        "external_customer_id": external_customer_id,
                        "metadata": {
                            "operation": operation,
                            "format": fmt,
                            "pages": pages,
                            "source_language": source_language,
                            "target_language": target_language,
                            "file_size_kb": file_size_kb,
                        },
                    }
                ]
            }
        )

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _call)
        log.info(
            "billing.event.sent",
            customer=external_customer_id,
            operation=operation,
            fmt=fmt,
            pages=pages,
        )
    except Exception as exc:
        log.warning("billing.event.error", error=str(exc), customer=external_customer_id)


async def check_credits(
    *,
    settings: Settings,
    external_customer_id: str,
) -> tuple[bool, str]:
    """Check whether a customer may process a document.

    Returns (allowed, reason).

    A customer is allowed when they have:
    - a positive credit balance, OR
    - at least one active subscription

    Fails open: if Polar is unreachable or billing is disabled, returns True.
    """
    if not settings.polar_access_token or not settings.polar_billing_enabled:
        return True, "billing disabled"

    def _call():
        client = _get_client(settings.polar_access_token)
        return client.customers.get_state_external(external_id=external_customer_id)

    try:
        loop = asyncio.get_event_loop()
        state = await loop.run_in_executor(None, _call)

        credits_balance = getattr(state, "credits_balance", None) or 0
        if credits_balance > 0:
            return True, "has credits"

        for sub in getattr(state, "active_subscriptions", []) or []:
            if getattr(sub, "status", None) == "active":
                return True, "active subscription"

        return False, "no credits or active subscription"

    except Exception as exc:
        log.warning("billing.check.error", error=str(exc), customer=external_customer_id)
        return True, "billing check failed (fail open)"


def estimate_pages(text: str) -> int:
    """Rough page estimate: 2 000 characters ≈ 1 page."""
    return max(1, len(text) // 2000)
