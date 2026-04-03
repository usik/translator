import csv
import re
from datetime import datetime, timezone
from pathlib import Path

import structlog
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

log = structlog.get_logger()
limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/v1", tags=["subscribe"])

EMAIL_FILE = Path(__file__).resolve().parents[3] / "data" / "subscribers.csv"
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class SubscribeRequest(BaseModel):
    email: str
    source: str = "unknown"  # e.g. "invoice", "translate", "convert"


@router.post("/subscribe")
@limiter.limit("5/minute")
async def subscribe(request: Request, body: SubscribeRequest):
    email = body.email.strip().lower()

    if not EMAIL_REGEX.match(email):
        return JSONResponse(status_code=400, content={"success": False, "error": "Invalid email"})

    EMAIL_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Check for duplicates and append
    existing = set()
    if EMAIL_FILE.exists():
        with open(EMAIL_FILE, newline="") as f:
            for row in csv.reader(f):
                if row:
                    existing.add(row[0])

    if email in existing:
        return JSONResponse(content={"success": True, "already_subscribed": True})

    with open(EMAIL_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([email, body.source, datetime.now(timezone.utc).isoformat()])

    log.info("subscriber.added", email=email, source=body.source)
    return JSONResponse(content={"success": True})
