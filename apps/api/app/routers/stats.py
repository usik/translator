from fastapi import APIRouter, Depends

from ..auth import verify_api_key
from ..schemas import SuccessResponse
from ..usage import get_stats_snapshot

router = APIRouter(prefix="/api/v1")


@router.get("/stats")
async def get_stats(api_key: str | None = Depends(verify_api_key)):
    """Return basic usage metrics (in-memory, resets on redeploy)."""
    return SuccessResponse(data=get_stats_snapshot())
