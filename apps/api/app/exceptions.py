class ServiceError(Exception):
    """Base exception for all service errors."""

    def __init__(self, code: str, message: str, status_code: int = 500):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class ExtractionError(ServiceError):
    """Raised when text extraction fails."""

    def __init__(self, message: str):
        super().__init__(code="EXTRACTION_FAILED", message=message, status_code=500)


class LLMError(ServiceError):
    """Raised when an LLM provider call fails."""

    def __init__(self, message: str, code: str = "LLM_FAILED"):
        super().__init__(code=code, message=message, status_code=500)


class OutputError(ServiceError):
    """Raised when output file generation fails."""

    def __init__(self, message: str):
        super().__init__(code="OUTPUT_GENERATION_FAILED", message=message, status_code=500)


class GatewayError(ServiceError):
    """Raised when the translation pipeline fails."""

    def __init__(self, message: str, code: str = "GATEWAY_ERROR", status_code: int = 500):
        super().__init__(code=code, message=message, status_code=status_code)
