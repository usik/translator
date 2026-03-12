import logging
import uuid
from contextvars import ContextVar

import structlog

request_id_var: ContextVar[str] = ContextVar("request_id", default="-")

_REQUEST_ID_HEADER = "X-Request-ID"


def setup_logging(service_name: str, debug: bool = False) -> None:
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.processors.add_log_level,
        structlog.processors.TimeStamper(fmt="%H:%M:%S.%f", utc=False),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
    ]

    if debug:
        renderer = structlog.dev.ConsoleRenderer()
    else:
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=[*shared_processors, renderer],
        wrapper_class=structlog.make_filtering_bound_logger(
            logging.DEBUG if debug else logging.INFO
        ),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )

    logging.basicConfig(
        format="%(message)s",
        handlers=[_StructlogHandler()],
        level=logging.WARNING,
        force=True,
    )

    structlog.contextvars.bind_contextvars(service=service_name)


class _StructlogHandler(logging.Handler):
    def emit(self, record):
        structlog.get_logger().log(
            record.levelno,
            record.getMessage(),
            logger=record.name,
        )


# --- FastAPI Middleware ---

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        rid = request.headers.get(_REQUEST_ID_HEADER) or uuid.uuid4().hex[:8]
        token = request_id_var.set(rid)
        structlog.contextvars.bind_contextvars(request_id=rid)

        log = structlog.get_logger()
        log.info("request.start", method=request.method, path=request.url.path)

        try:
            response = await call_next(request)
            log.info(
                "request.end",
                method=request.method,
                path=request.url.path,
                status=response.status_code,
            )
            response.headers[_REQUEST_ID_HEADER] = rid
            return response
        except Exception:
            log.exception(
                "request.error", method=request.method, path=request.url.path
            )
            raise
        finally:
            structlog.contextvars.unbind_contextvars("request_id")
            request_id_var.reset(token)
