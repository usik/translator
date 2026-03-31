"""Free-tier rate limiting for unauthenticated users.

Tracks document count per (IP, session-cookie) key per calendar day.
State lives in-memory and resets on redeploy — acceptable because Railway
structured logs provide the durable record.

Limit: FREE_DAILY_LIMIT documents/day per key.
Cookie name: xenith_session (UUID, HttpOnly, SameSite=Lax).
"""

from __future__ import annotations

import asyncio
import uuid
from datetime import date

import structlog

log = structlog.get_logger()

FREE_DAILY_LIMIT = 3
COOKIE_NAME = "xenith_session"

# { "<ip>:<session>" : ("<yyyy-mm-dd>", count) }
_store: dict[str, tuple[str, int]] = {}
_lock = asyncio.Lock()


def _today() -> str:
    return date.today().isoformat()


def _key(ip: str, session: str) -> str:
    return f"{ip}:{session}"


async def check_and_increment(ip: str, session: str | None) -> tuple[bool, int, str | None]:
    """Check the free tier limit and increment the counter on success.

    Args:
        ip: Remote IP address of the caller.
        session: Existing xenith_session cookie value, or None if absent.

    Returns:
        (allowed, remaining, new_session)
        - allowed: True if the request may proceed.
        - remaining: How many free requests remain today after this one.
        - new_session: UUID string to set as cookie, or None if session existed.
    """
    new_session: str | None = None
    if session is None:
        session = str(uuid.uuid4())
        new_session = session

    k = _key(ip, session)
    today = _today()

    async with _lock:
        entry = _store.get(k)
        if entry is None or entry[0] != today:
            _store[k] = (today, 0)
            entry = (today, 0)

        _, count = entry

        if count >= FREE_DAILY_LIMIT:
            return False, 0, new_session

        _store[k] = (today, count + 1)
        remaining = FREE_DAILY_LIMIT - (count + 1)

    log.info("free_tier.request", ip=ip, count=count + 1, remaining=remaining)
    return True, remaining, new_session


def get_session_from_request(request) -> str | None:
    """Extract the xenith_session cookie from a FastAPI Request."""
    return request.cookies.get(COOKIE_NAME)


def set_session_cookie(response, session_id: str) -> None:
    """Attach the session cookie to a FastAPI Response."""
    response.set_cookie(
        key=COOKIE_NAME,
        value=session_id,
        max_age=60 * 60 * 24 * 365,  # 1 year
        httponly=True,
        samesite="lax",
        secure=True,
    )
