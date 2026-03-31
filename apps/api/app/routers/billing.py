"""Billing endpoints — customer portal redirect and account status.

GET /api/v1/billing/status   — current credit balance + active subscriptions
GET /api/v1/billing/portal   — redirect to Polar Customer Portal (manage billing)
"""

from __future__ import annotations

import asyncio

import structlog
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse

from ..auth import verify_api_key
from ..config import Settings
from ..dependencies import get_settings
from ..schemas import SuccessResponse

log = structlog.get_logger()

router = APIRouter(prefix="/api/v1/billing")


def _get_client(access_token: str):
    from polar_sdk import Polar  # noqa: PLC0415

    return Polar(access_token=access_token)


@router.get("/status")
async def billing_status(
    request: Request,
    settings: Settings = Depends(get_settings),
    api_key: str | None = Depends(verify_api_key),
):
    """Return the authenticated user's credit balance and active subscriptions.

    Requires X-API-Key. Returns 503 when Polar is not configured.
    """
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail={"code": "UNAUTHORIZED", "message": "X-API-Key required to check billing status"},
        )

    if not settings.polar_access_token:
        raise HTTPException(
            status_code=503,
            detail={"code": "BILLING_NOT_CONFIGURED", "message": "Billing is not configured on this server"},
        )

    def _call():
        client = _get_client(settings.polar_access_token)
        return client.customers.get_state_external(external_id=api_key)

    try:
        loop = asyncio.get_event_loop()
        state = await loop.run_in_executor(None, _call)

        credits_balance = getattr(state, "credits_balance", None) or 0
        active_subscriptions = [
            {
                "id": getattr(s, "id", None),
                "status": getattr(s, "status", None),
                "product_id": getattr(s, "product_id", None),
                "current_period_end": str(getattr(s, "current_period_end", "") or ""),
            }
            for s in (getattr(state, "active_subscriptions", []) or [])
            if getattr(s, "status", None) == "active"
        ]

        return SuccessResponse(
            data={
                "credits_balance": credits_balance,
                "active_subscriptions": active_subscriptions,
                "has_access": credits_balance > 0 or len(active_subscriptions) > 0,
            }
        )

    except Exception as exc:
        log.warning("billing.status.error", error=str(exc), customer=api_key)
        raise HTTPException(
            status_code=502,
            detail={"code": "BILLING_ERROR", "message": "Could not fetch billing status"},
        )


@router.get("/portal")
async def billing_portal(
    request: Request,
    settings: Settings = Depends(get_settings),
    api_key: str | None = Depends(verify_api_key),
):
    """Redirect the authenticated user to their Polar Customer Portal session.

    The portal lets users view usage, manage subscriptions, buy credits,
    and download invoices — all hosted by Polar.
    """
    if not api_key:
        raise HTTPException(
            status_code=401,
            detail={"code": "UNAUTHORIZED", "message": "X-API-Key required to access billing portal"},
        )

    if not settings.polar_access_token:
        raise HTTPException(
            status_code=503,
            detail={"code": "BILLING_NOT_CONFIGURED", "message": "Billing is not configured on this server"},
        )

    def _call():
        client = _get_client(settings.polar_access_token)
        # Get or create the Polar customer for this external ID
        customer = client.customers.get_state_external(external_id=api_key)
        customer_id = getattr(customer, "id", None) or getattr(getattr(customer, "customer", None), "id", None)
        if not customer_id:
            raise ValueError("Could not resolve Polar customer ID")
        # Create a short-lived portal session
        session = client.customer_sessions.create(request={"customer_id": customer_id})
        return getattr(session, "customer_portal_url", None) or getattr(session, "url", None)

    try:
        loop = asyncio.get_event_loop()
        portal_url = await loop.run_in_executor(None, _call)

        if not portal_url:
            raise HTTPException(
                status_code=502,
                detail={"code": "BILLING_ERROR", "message": "Could not generate portal URL"},
            )

        return RedirectResponse(url=portal_url, status_code=302)

    except HTTPException:
        raise
    except Exception as exc:
        log.warning("billing.portal.error", error=str(exc), customer=api_key)
        raise HTTPException(
            status_code=502,
            detail={"code": "BILLING_ERROR", "message": "Could not create portal session"},
        )
