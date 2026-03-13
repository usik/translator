from __future__ import annotations

from pydantic import BaseModel


class LineItem(BaseModel):
    description: str
    description_original: str | None = None
    quantity: float | None = None
    unit_price: float | None = None
    amount: float
    tax_rate: float | None = None


class InvoiceData(BaseModel):
    vendor_name: str
    vendor_name_original: str | None = None
    invoice_number: str | None = None
    invoice_date: str | None = None
    due_date: str | None = None
    currency: str
    subtotal: float
    tax: float
    total: float
    line_items: list[LineItem] = []
    language: str  # ko, ja, zh, en, etc.
    confidence: float  # 0.0-1.0
    source_filename: str


class ValidationFlag(BaseModel):
    type: str  # math_error, tax_mismatch, duplicate, anomaly, low_confidence
    severity: str  # info, warning, critical
    message: str
    invoice_index: int  # which invoice in the batch


class ValidatedInvoice(BaseModel):
    invoice: InvoiceData
    flags: list[ValidationFlag] = []
    accountant_notes: str | None = None


class InvoiceProcessingResult(BaseModel):
    invoices: list[ValidatedInvoice]
    total_files: int
    total_processed: int
    total_flags: int
    processing_time_ms: int
