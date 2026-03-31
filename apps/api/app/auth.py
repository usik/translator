"""Optional API key authentication.

If `api_keys` is set in settings (comma-separated), every request must supply
a valid key in the `X-API-Key` header.  When no keys are configured, the
dependency is a no-op (open access mode).
"""

from fastapi import Depends, HTTPException, Security
from fastapi.security import APIKeyHeader

from .config import Settings
from .dependencies import get_settings

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(
    api_key: str | None = Security(_api_key_header),
    settings: Settings = Depends(get_settings),
) -> str | None:
    """Return the validated API key, or None when auth is disabled.

    Raises HTTP 401 if keys are configured but the request provides none or an
    invalid one.
    """
    valid_keys = {k.strip() for k in settings.api_keys.split(",") if k.strip()}

    if not valid_keys:
        # Auth not configured — open access
        return None

    if not api_key or api_key not in valid_keys:
        raise HTTPException(
            status_code=401,
            detail={"code": "UNAUTHORIZED", "message": "Invalid or missing API key"},
        )

    return api_key
