from fastapi import APIRouter

from ..schemas import HealthResponse

router = APIRouter()


@router.get("/health")
async def health() -> HealthResponse:
    return HealthResponse()
