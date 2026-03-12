from fastapi import APIRouter, Depends

from ..dependencies import get_extractor_registry, get_converter_registry
from ..extractors import ExtractorRegistry
from ..converters import ConverterRegistry

router = APIRouter(prefix="/api/v1/formats")


@router.get("/input")
async def input_formats(
    registry: ExtractorRegistry = Depends(get_extractor_registry),
):
    return {
        "extensions": registry.supported_extensions,
        "content_types": registry.supported_content_types,
    }


@router.get("/output")
async def output_formats(
    registry: ConverterRegistry = Depends(get_converter_registry),
):
    return {
        "formats": registry.supported_formats,
    }
