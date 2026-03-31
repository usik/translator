# Xenith Invoice — Technical Architecture

---

## 1. Overview

Xenith Invoice is an AP automation service built on top of the existing Xenith Translator infrastructure. It processes Korean, Japanese, and English invoices through an AI-powered pipeline: intake, extraction, translation, structured field parsing, 3-way matching, exception detection, and report generation. A self-improving autoresearch loop continuously refines extraction prompts and matching rules based on human corrections.

This document covers what we reuse from the existing Xenith backend, what we build new, how the autoresearch loop works, the full data pipeline, API design, storage design, and MVP tech stack decisions.

---

## 2. Reusable Xenith Infrastructure

The existing Xenith backend (`apps/api/app/`) provides substantial infrastructure that Xenith Invoice inherits directly.

### 2.1 Extractor Registry (`extractors/`)

**What exists:**

| Extractor | File | Formats | Notes |
|-----------|------|---------|-------|
| `TextExtractor` | `extractors/text.py` | .txt, .csv, .md, .json, .xml, .html | Charset detection via `chardet` |
| `BasicDocxExtractor` | `extractors/docx.py` | .docx | python-docx, no API key needed. Has `extract_structured()` for format preservation |
| `DocxExtractor` | `extractors/docx.py` | .docx | Mistral OCR, overrides BasicDocxExtractor when API key present |
| `HwpExtractor` | `extractors/hwp.py` | .hwpx | XML-based extraction from ZIP archive. Has `extract_structured()` |
| `PDFExtractor` | `extractors/pdf.py` | .pdf | Mistral OCR (`mistral-ocr-latest`) |
| `ImageExtractor` | `extractors/image.py` | .png, .jpg, .jpeg, .gif, .bmp, .tiff, .webp | Mistral OCR |
| `VoiceExtractor` | `extractors/voice.py` | .mp3, .wav, .m4a, .ogg, .flac, .webm | faster-whisper, lazy-loaded |

**Reuse for Invoice:**
- `PDFExtractor` — most invoices arrive as PDF. Mistral OCR extracts markdown text from scanned/digital PDFs.
- `ImageExtractor` — handles photographed invoices (mobile capture).
- `HwpExtractor` — Korean government/institutional invoices sometimes arrive as HWPX.
- `BasicDocxExtractor` — some vendors send invoices as Word documents.
- `TextExtractor` — CSV/Excel text exports, email body text.

**Pattern:** The `ExtractorRegistry` uses Protocol-based duck typing. Each extractor declares `supported_extensions` and `supported_content_types`. The registry resolves extractors by file extension or MIME type. Invoice extraction plugs into this identically — the raw text/markdown extraction step is the same.

### 2.2 LLM Provider Registry (`providers/`)

**What exists:**
- `GeminiProvider` (`providers/gemini.py`) — Google Gemini 2.5 Flash via OpenAI-compatible API (`AsyncOpenAI` client pointed at `generativelanguage.googleapis.com`).
- Supports `chat()` (full response) and `chat_stream()` (SSE streaming).
- Token usage tracking via `TokenUsage` schema.

**Reuse for Invoice:**
- Gemini Flash is the LLM for both translation and structured field extraction. Invoice uses `chat()` with JSON mode for field extraction (structured output).
- The `ProviderRegistry` pattern allows adding other providers later (e.g., Claude for complex invoices) without changing the pipeline.

### 2.3 Converter Registry (`converters/`)

**What exists:**

| Converter | Formats | Notes |
|-----------|---------|-------|
| `TextConverter` | .txt | UTF-8 encode |
| `PDFConverter` | .pdf | WeasyPrint + markdown-it, CJK font support |
| `DocxConverter` | .docx | python-docx, `convert_structured()` for format preservation |
| `DocxToPdfConverter` | .pdf (from .docx) | LibreOffice headless |
| `HwpxConverter` | .hwpx | ZIP archive builder, `convert_structured()` for format preservation |

**Reuse for Invoice:**
- Report output can use existing converters: generate expense reports as PDF (via `PDFConverter`) or Excel (new).
- Format-preserved translated invoices reuse the `convert_structured()` path.

### 2.4 Schemas & Patterns

**Reusable schemas** (`schemas.py`):
- `ExtractionResult` — text + metadata + optional segments (format-preserving)
- `ChatMessage` / `ChatResponse` / `TokenUsage` — LLM interaction
- `SuccessResponse[T]` / `ErrorResponse` — API envelope pattern
- `TextSegment` — position-indexed text for structured extraction

**Reusable infrastructure:**
- `config.py` — `pydantic-settings` with `.env` file loading. Invoice adds new settings here.
- `dependencies.py` — FastAPI dependency injection for registries. Invoice adds its own registries.
- `exceptions.py` — `ServiceError` hierarchy (`ExtractionError`, `LLMError`, `OutputError`). Invoice adds `InvoiceProcessingError`, `MatchingError`.
- `main.py` — lifespan-based registry initialization. Invoice registers its components in the same lifespan.
- `prompts.py` — `build_messages()` / `build_segment_messages()` / `parse_translated_segments()`. Invoice adds invoice-specific prompt builders.

### 2.5 Middleware & Cross-Cutting Concerns

Already handled:
- **CORS** — configurable origins
- **Rate limiting** — slowapi per-IP
- **Request ID** — `RequestIdMiddleware` for tracing
- **Structured logging** — structlog
- **Global error handling** — `ServiceError` → JSON response

---

## 3. New Components for Xenith Invoice

### 3.1 Invoice Field Extraction (`app/invoice/extraction.py`)

A new module that takes raw text (from existing extractors) and uses the LLM with JSON-mode structured output to extract invoice fields.

```python
# Conceptual interface
class InvoiceExtractor:
    """Takes raw text/markdown from any Extractor and produces structured InvoiceData."""

    async def extract_fields(
        self,
        raw_text: str,
        source_language: str,
        provider: LLMProvider,
        model: str,
    ) -> InvoiceData:
        """
        1. Build prompt from invoice_prompts.py
        2. Call provider.chat() with JSON mode
        3. Parse and validate response into InvoiceData
        4. Optionally translate fields to English
        """
```

**Key design decisions:**
- Separation of concerns: file extraction (existing) is distinct from field extraction (new). The file extractor produces text; the invoice extractor produces structured data from that text.
- JSON-mode structured output: Gemini Flash supports `response_format={"type": "json_object"}`. The prompt includes the target JSON schema.
- Multi-pass strategy: extract header fields first, then line items, then verify totals. This improves accuracy over single-pass extraction.

### 3.2 Invoice Prompts (`app/invoice/prompts.py`)

Separate from the translation `prompts.py`. Contains:

```python
# System prompt for structured field extraction
INVOICE_EXTRACTION_SYSTEM = """..."""

# Language-specific field label mappings
KOREAN_FIELD_HINTS = {
    "공급가액": "subtotal",
    "부가가치세액": "vat",
    "세액": "tax",
    "합계": "total",
    "거래일자": "invoice_date",
    "작성일자": "date_of_preparation",
    "사업자등록번호": "business_registration_number",
    # ... more mappings
}

JAPANESE_FIELD_HINTS = {
    "小計": "subtotal",
    "消費税": "consumption_tax",
    "合計": "total",
    "請求日": "invoice_date",
    "登録番号": "registration_number",
    # ... more mappings
}

# Few-shot examples per language
KOREAN_INVOICE_EXAMPLES = [...]
JAPANESE_INVOICE_EXAMPLES = [...]
ENGLISH_INVOICE_EXAMPLES = [...]

def build_extraction_messages(raw_text: str, language_hint: str | None) -> list[ChatMessage]: ...
def build_verification_messages(extracted: InvoiceData, raw_text: str) -> list[ChatMessage]: ...
```

**This file is the primary target of the autoresearch loop.** The agent modifies prompts, examples, and hints to improve extraction accuracy.

### 3.3 Invoice Data Models (`app/invoice/schemas.py`)

```python
class LineItem(BaseModel):
    description: str
    description_original: str | None = None  # Original language text
    quantity: float | None = None
    unit_price: float | None = None
    amount: float
    tax_rate: float | None = None  # For Japanese dual-rate invoices

class InvoiceData(BaseModel):
    # Core identifiers
    invoice_id: str | None = None
    po_number: str | None = None

    # Vendor info
    vendor_name: str
    vendor_name_original: str | None = None
    vendor_registration_number: str | None = None  # Korean 사업자등록번호 / Japanese 登録番号

    # Buyer info
    buyer_name: str | None = None
    buyer_registration_number: str | None = None

    # Dates
    invoice_date: date | None = None
    due_date: date | None = None

    # Amounts
    currency: str  # KRW, JPY, USD
    subtotal: float
    tax: float
    total: float

    # Details
    line_items: list[LineItem] = []
    payment_terms: str | None = None

    # Metadata
    language: str  # ko, ja, en
    document_type: str = "invoice"  # invoice, credit_note, receipt
    confidence: float  # 0.0-1.0, LLM self-assessed extraction confidence
    raw_text: str  # Original extracted text for audit trail

    # Translation
    translated_text: str | None = None  # Full English translation

class InvoiceProcessingResult(BaseModel):
    invoice: InvoiceData
    extraction_time_ms: int
    translation_time_ms: int | None = None
    match_result: MatchResult | None = None
    exceptions: list[ExceptionFlag] = []
```

### 3.4 Matching Engine (`app/invoice/matching.py`)

Handles 3-way matching: Invoice <-> Purchase Order <-> Delivery Receipt.

```python
class MatchResult(BaseModel):
    status: Literal["matched", "partial", "unmatched"]
    po_match: POMatch | None = None
    amount_match: AmountMatch | None = None
    line_item_matches: list[LineItemMatch] = []
    confidence: float

class POMatch(BaseModel):
    po_number: str
    match_type: Literal["exact", "fuzzy", "manual"]
    similarity_score: float

class AmountMatch(BaseModel):
    invoice_total: float
    po_total: float
    difference: float
    difference_percent: float
    within_threshold: bool

class MatchingEngine:
    def __init__(self, rules: MatchingRules): ...

    async def match_invoice(
        self,
        invoice: InvoiceData,
        purchase_orders: list[PurchaseOrder],
        receipts: list[DeliveryReceipt],
    ) -> MatchResult: ...
```

**Key matching strategies:**
- **PO number matching**: Exact match first, then fuzzy match with configurable threshold.
- **Vendor name matching**: Uses `rapidfuzz` for fuzzy matching. Korean vendor names have multiple romanizations (e.g., "삼성전자" vs "Samsung Electronics" vs "SAMSUNG ELECTRONICS CO., LTD.").
- **Amount matching**: Configurable tolerance threshold (e.g., 2% or $10, whichever is greater). Handles currency conversion discrepancies.
- **Line item matching**: Match by description similarity + amount proximity.

### 3.5 Exception Detection (`app/invoice/exceptions.py`)

```python
class ExceptionFlag(BaseModel):
    type: Literal[
        "amount_mismatch",
        "missing_po",
        "duplicate_invoice",
        "currency_mismatch",
        "date_anomaly",
        "tax_discrepancy",
        "vendor_unknown",
        "low_confidence_extraction",
    ]
    severity: Literal["info", "warning", "critical"]
    message: str
    details: dict[str, Any] = {}

class ExceptionDetector:
    def __init__(self, rules: ExceptionRules): ...

    async def detect(
        self,
        invoice: InvoiceData,
        match_result: MatchResult | None,
        historical_invoices: list[InvoiceData],
    ) -> list[ExceptionFlag]: ...
```

**Detection rules** (configured in `rules.json`, modifiable by autoresearch):
- **Duplicate detection**: Same vendor + date + total amount within lookback window.
- **Amount mismatch**: Invoice total vs PO total exceeds threshold.
- **Tax validation**: Korean VAT should be 10% of subtotal. Japanese consumption tax should be 8% or 10%.
- **Date anomaly**: Invoice date in future, or more than 90 days old.
- **Low confidence**: Extraction confidence below threshold triggers human review.

### 3.6 Report Generation (`app/invoice/reports.py`)

```python
class ReportGenerator:
    async def generate_expense_report(
        self,
        invoices: list[InvoiceProcessingResult],
        format: Literal["csv", "xlsx", "pdf"],
        template: str | None = None,
    ) -> bytes: ...

    async def generate_exception_summary(
        self,
        invoices: list[InvoiceProcessingResult],
    ) -> bytes: ...

    async def generate_audit_trail(
        self,
        invoice: InvoiceProcessingResult,
    ) -> bytes: ...
```

**Output formats:**
- **CSV/Excel**: QuickBooks/Xero import-ready. Columns: Date, Vendor, Invoice#, PO#, Amount, Tax, Total, Currency, Status.
- **PDF**: Formatted expense report using existing `PDFConverter` patterns (WeasyPrint).
- **Exception summary**: Flagged invoices grouped by severity.
- **Audit trail**: Original document + extracted fields + translated version + match results.

### 3.7 Matching Rules (`app/invoice/rules.json`)

```json
{
  "matching": {
    "vendor_fuzzy_threshold": 85,
    "amount_tolerance_percent": 2.0,
    "amount_tolerance_absolute": 10.0,
    "po_fuzzy_threshold": 90,
    "line_item_description_threshold": 75
  },
  "exceptions": {
    "duplicate_lookback_days": 90,
    "future_date_tolerance_days": 7,
    "stale_invoice_days": 90,
    "low_confidence_threshold": 0.7,
    "tax_rate_tolerance_percent": 0.5
  },
  "currency": {
    "supported": ["KRW", "JPY", "USD"],
    "symbols": {"₩": "KRW", "원": "KRW", "¥": "JPY", "円": "JPY", "$": "USD"},
    "default_by_language": {"ko": "KRW", "ja": "JPY", "en": "USD"}
  },
  "date_formats": {
    "ko": ["YYYY년 MM월 DD일", "YYYY-MM-DD", "YYYY.MM.DD"],
    "ja": ["令和{N}年{M}月{D}日", "YYYY年MM月DD日", "YYYY-MM-DD"],
    "en": ["MM/DD/YYYY", "YYYY-MM-DD", "DD-MMM-YYYY"]
  }
}
```

**This file is the secondary target of the autoresearch loop.** Thresholds and patterns are tuned based on evaluation results.

---

## 4. Autoresearch Loop Architecture

The autoresearch loop is an autonomous agent that improves invoice extraction accuracy by modifying prompts and rules, then evaluating against labeled ground truth.

### 4.1 File Responsibilities

```
ap-autoresearch/
├── program.md              # Human-written spec (read-only)
├── evaluate.py             # Scoring harness (read-only)
├── extract.py              # Extraction pipeline (read-only)
├── prompts.py              # LLM prompts — AGENT MODIFIES
├── rules.json              # Matching/exception rules — AGENT MODIFIES
├── ground_truth/
│   ├── invoices/           # Raw invoice files (read-only)
│   └── labels/             # Correct extracted fields as JSON (read-only)
├── results.tsv             # Experiment log
└── run.log                 # Latest run output
```

### 4.2 How the Three Files Work Together

```
┌──────────────────────────────────────────────┐
│                 program.md                    │
│  (Human spec: what the agent optimizes,      │
│   constraints, experiment ideas, metric       │
│   definitions, loop instructions)             │
└──────────────────────┬───────────────────────┘
                       │ Agent reads once at start
                       ▼
┌──────────────────────────────────────────────┐
│              AGENT EXPERIMENT LOOP            │
│                                              │
│  1. Modify prompts.py and/or rules.json      │
│  2. git commit                               │
│  3. Run: python evaluate.py                  │
│  4. If overall_score improved → keep          │
│  5. If worse → git reset --hard HEAD~1       │
│  6. Record in results.tsv                    │
│  7. GOTO 1                                   │
└──────────┬───────────────┬───────────────────┘
           │               │
           ▼               ▼
┌────────────────┐  ┌──────────────────┐
│   prompts.py   │  │   rules.json     │
│                │  │                  │
│ - System       │  │ - Fuzzy match    │
│   prompts      │  │   thresholds     │
│ - Few-shot     │  │ - Date format    │
│   examples     │  │   patterns       │
│ - Field label  │  │ - Currency rules │
│   mappings     │  │ - Duplicate      │
│ - Chain-of-    │  │   detection      │
│   thought      │  │ - Exception      │
│ - JSON schema  │  │   thresholds     │
└───────┬────────┘  └───────┬──────────┘
        │                   │
        └───────┬───────────┘
                ▼
┌──────────────────────────────────────────────┐
│              evaluate.py                      │
│                                              │
│  For each invoice in ground_truth/:           │
│  1. Load raw invoice file                    │
│  2. Run extract.py with current prompts.py   │
│  3. Compare extracted fields to label JSON    │
│  4. Score: field_accuracy, amount_accuracy,   │
│     line_item_accuracy, vendor_accuracy,      │
│     date_accuracy, exception_precision/recall │
│  5. Compute weighted overall_score           │
│                                              │
│  Output: metric summary to stdout            │
└──────────────────────────────────────────────┘
```

### 4.3 Scoring Weights

| Metric | Weight | Rationale |
|--------|--------|-----------|
| `field_accuracy` | 0.30 | Core fields: vendor, PO#, payment terms |
| `amount_accuracy` | 0.25 | Financial amounts must be exact (subtotal, tax, total) |
| `line_item_accuracy` | 0.20 | Descriptions, quantities, unit prices |
| `date_accuracy` | 0.10 | Invoice date, due date |
| `vendor_accuracy` | 0.10 | Vendor name matching (multiple romanizations) |
| `exception_precision + recall` | 0.05 | Detecting duplicates, mismatches |

### 4.4 Ground Truth Strategy

**Phase 1 (Bootstrap):**
- English: 20+ invoices from public datasets (GokulRajaR/invoice-ocr-json, katanaml)
- Korean: 20-30 synthetic 세금계산서 generated from known field structure
- Japanese: 20-30 synthetic 適格請求書 generated from known field structure

**Phase 2 (Pilot clients):**
- Real invoices from first 3 pilot clients
- Manually labeled by human operators — becomes proprietary ground truth

**Phase 3 (Production):**
- Every human correction is stored as a new labeled example
- Ground truth set grows continuously, making the evaluation harness more rigorous over time

---

## 5. Data Pipeline

### 5.1 Full Pipeline Flow

```
INTAKE                    EXTRACT              TRANSLATE          PARSE FIELDS
─────────────────────    ───────────────     ──────────────     ──────────────
Email / Upload / API  →  ExtractorRegistry →  GeminiProvider →  InvoiceExtractor
(PDF, scan, HWPX,       resolve by ext       translate to       JSON-mode LLM call
 Excel, image)          → raw text/markdown   English            → InvoiceData

     MATCH                    EXCEPTION               REPORT
  ──────────────           ──────────────          ──────────────
  MatchingEngine     →     ExceptionDetector  →    ReportGenerator
  Invoice ↔ PO ↔           Flag anomalies         CSV/Excel/PDF
  Delivery Receipt                                 Exception summary
                                                   Audit trail
```

### 5.2 Step-by-Step Detail

**Step 1: Intake**
- Invoice arrives via file upload (API endpoint), email forwarding (future: email parser), or shared folder sync (future: Google Drive integration).
- MVP: API upload only.

**Step 2: File Extraction** (reuses existing Xenith extractors)
- `ExtractorRegistry.resolve(filename)` returns the appropriate extractor.
- Extractor produces `ExtractionResult` with raw text/markdown.
- For scanned PDFs and images, Mistral OCR handles the heavy lifting.

**Step 3: Translation** (reuses existing Xenith translation)
- If source language is Korean or Japanese, translate full text to English using `GeminiProvider.chat()`.
- Store both original and translated text in the `InvoiceData` for audit trail.
- Translation uses existing `build_messages()` from `prompts.py`.

**Step 4: Structured Field Extraction** (new)
- `InvoiceExtractor.extract_fields()` sends the raw text (plus translation if available) to the LLM with a JSON-mode prompt.
- The prompt (from `invoice/prompts.py`) includes:
  - Target JSON schema
  - Language-specific field label mappings
  - Few-shot examples
  - Chain-of-thought instructions
- Response is parsed and validated into `InvoiceData`.
- Optional verification pass: send extracted fields back to LLM to check against raw text.

**Step 5: Matching** (new)
- `MatchingEngine.match_invoice()` attempts to match the invoice against known POs and delivery receipts.
- Uses fuzzy matching (rapidfuzz) for vendor names and descriptions.
- MVP: PO matching only (no delivery receipt matching until clients provide receipt data).

**Step 6: Exception Detection** (new)
- `ExceptionDetector.detect()` runs rule-based checks:
  - Duplicate detection (same vendor + date + amount)
  - Amount mismatch against PO
  - Tax validation (Korean 10% VAT, Japanese 8%/10% consumption tax)
  - Date anomalies
  - Low extraction confidence
- Exceptions are flagged with severity levels.

**Step 7: Human Review** (UI, out of scope for backend architecture)
- Operator reviews flagged exceptions in a dashboard.
- Corrections are saved and feed back into the autoresearch loop.

**Step 8: Report Generation** (new)
- `ReportGenerator` produces:
  - CSV/Excel expense report (QuickBooks/Xero import-ready)
  - PDF summary report
  - Exception summary for management
  - Per-invoice audit trail

---

## 6. API Endpoints

All Invoice endpoints live under `/api/v1/invoice/` and follow the existing `SuccessResponse[T]` / `ErrorResponse` envelope pattern.

### 6.1 Invoice Processing

```
POST /api/v1/invoice/process
```
Upload and process a single invoice. Multipart form.

**Request:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `file` | File | Yes | PDF, image, HWPX, DOCX, Excel |
| `source_language` | string | No | Default: "auto" |
| `client_id` | string | No | For vendor pattern lookup (future) |

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice_id": "inv_abc123",
    "invoice": { /* InvoiceData */ },
    "match_result": { /* MatchResult or null */ },
    "exceptions": [ /* ExceptionFlag[] */ ],
    "processing_time_ms": 2340,
    "status": "needs_review"
  }
}
```

---

```
POST /api/v1/invoice/batch
```
Upload and process multiple invoices. Returns a batch ID for polling.

**Request:** Multipart form with multiple files.

**Response:**
```json
{
  "success": true,
  "data": {
    "batch_id": "batch_xyz789",
    "total_files": 15,
    "status": "processing"
  }
}
```

---

```
GET /api/v1/invoice/batch/{batch_id}
```
Poll batch processing status.

**Response:**
```json
{
  "success": true,
  "data": {
    "batch_id": "batch_xyz789",
    "total": 15,
    "completed": 12,
    "failed": 1,
    "status": "processing",
    "results": [ /* InvoiceProcessingResult[] for completed */ ]
  }
}
```

### 6.2 Invoice CRUD

```
GET    /api/v1/invoice/{invoice_id}           # Get processed invoice
PUT    /api/v1/invoice/{invoice_id}           # Update/correct extracted fields
DELETE /api/v1/invoice/{invoice_id}           # Delete invoice record
GET    /api/v1/invoice/                        # List invoices (paginated, filterable)
```

**Correction endpoint is critical for the self-improving loop.** When a human corrects extracted fields via PUT, the correction is stored and used to improve future extractions.

### 6.3 Matching

```
POST /api/v1/invoice/{invoice_id}/match
```
Manually trigger matching for an invoice against provided POs.

```
POST /api/v1/invoice/po
```
Upload purchase orders for matching.

```
GET /api/v1/invoice/po
```
List uploaded purchase orders.

### 6.4 Reports

```
POST /api/v1/invoice/report/expense
```
Generate expense report for a date range or set of invoices.

**Request:**
```json
{
  "invoice_ids": ["inv_abc123", "inv_def456"],
  "format": "xlsx",
  "date_range": {"start": "2026-03-01", "end": "2026-03-31"}
}
```

**Response:** File download (CSV, XLSX, or PDF).

```
POST /api/v1/invoice/report/exceptions
```
Generate exception summary report.

### 6.5 Health & Meta

```
GET /health                                    # Existing health check (shared)
GET /api/v1/invoice/stats                      # Processing statistics
GET /api/v1/invoice/formats                    # Supported input formats
```

---

## 7. Database / Storage Design

### 7.1 Technology Choice (MVP)

**SQLite + file storage** for MVP. Migrate to PostgreSQL when scaling beyond a single server.

Rationale:
- MVP is an ops service (Model A) with 3-10 clients. Single-digit concurrent users.
- SQLite avoids infrastructure overhead. The API server and database co-locate.
- File storage: local filesystem for MVP, S3-compatible for production.

### 7.2 Schema

```sql
-- Core invoice data
CREATE TABLE invoices (
    id TEXT PRIMARY KEY,              -- "inv_" + UUID
    client_id TEXT,                   -- Client/organization
    batch_id TEXT,                    -- Batch grouping (nullable)
    status TEXT NOT NULL DEFAULT 'processing',  -- processing, needs_review, approved, rejected

    -- Original file
    original_filename TEXT NOT NULL,
    original_format TEXT NOT NULL,    -- pdf, image, hwpx, docx
    original_file_path TEXT NOT NULL, -- Path to stored original

    -- Extracted data (JSON)
    extracted_data JSON NOT NULL,     -- Full InvoiceData as JSON
    raw_text TEXT,                    -- OCR/extracted text
    translated_text TEXT,             -- English translation (if source != English)

    -- Key fields (denormalized for querying)
    vendor_name TEXT,
    invoice_number TEXT,
    invoice_date DATE,
    due_date DATE,
    currency TEXT,
    subtotal REAL,
    tax REAL,
    total REAL,
    po_number TEXT,
    source_language TEXT,

    -- Processing metadata
    extraction_confidence REAL,
    processing_time_ms INTEGER,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Human corrections (feeds autoresearch loop)
CREATE TABLE corrections (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id),
    field_name TEXT NOT NULL,         -- Which field was corrected
    original_value TEXT,              -- What the LLM extracted
    corrected_value TEXT NOT NULL,    -- What the human corrected it to
    corrector TEXT,                   -- Who made the correction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor patterns (learned over time)
CREATE TABLE vendor_patterns (
    id TEXT PRIMARY KEY,
    vendor_name_normalized TEXT NOT NULL,  -- Canonical English name
    pattern TEXT NOT NULL,                 -- Regex or fuzzy match pattern
    language TEXT,                         -- ko, ja, en
    confidence REAL DEFAULT 1.0,
    examples JSON,                        -- List of known name variants
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vendor_name_normalized, pattern)
);

-- Purchase orders (for matching)
CREATE TABLE purchase_orders (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    po_number TEXT NOT NULL,
    vendor_name TEXT,
    total REAL,
    currency TEXT,
    line_items JSON,                  -- List of PO line items
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exception flags
CREATE TABLE exceptions (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id),
    type TEXT NOT NULL,               -- amount_mismatch, duplicate, etc.
    severity TEXT NOT NULL,           -- info, warning, critical
    message TEXT NOT NULL,
    details JSON,
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match results
CREATE TABLE match_results (
    id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES invoices(id),
    po_id TEXT REFERENCES purchase_orders(id),
    status TEXT NOT NULL,             -- matched, partial, unmatched
    confidence REAL,
    details JSON,                     -- Full MatchResult as JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Processing batches
CREATE TABLE batches (
    id TEXT PRIMARY KEY,
    client_id TEXT,
    total_files INTEGER NOT NULL,
    completed INTEGER DEFAULT 0,
    failed INTEGER DEFAULT 0,
    status TEXT DEFAULT 'processing', -- processing, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_vendor ON invoices(vendor_name);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_corrections_invoice ON corrections(invoice_id);
CREATE INDEX idx_exceptions_invoice ON exceptions(invoice_id);
CREATE INDEX idx_vendor_patterns_name ON vendor_patterns(vendor_name_normalized);
```

### 7.3 File Storage Layout

```
data/
├── invoices/
│   ├── {client_id}/
│   │   ├── {invoice_id}/
│   │   │   ├── original.pdf         # Original uploaded file
│   │   │   ├── extracted.json        # Raw extraction result
│   │   │   └── translated.txt        # Full English translation
│   │   └── ...
│   └── ...
├── reports/
│   ├── {client_id}/
│   │   ├── expense_2026-03.xlsx
│   │   └── ...
│   └── ...
└── ground_truth/                     # For autoresearch
    ├── invoices/
    └── labels/
```

---

## 8. Self-Improving Loop in Production

The autoresearch loop (Section 4) runs offline against labeled data. In production, a parallel feedback loop operates:

### 8.1 Correction → Ground Truth Pipeline

```
Human corrects field in UI
        │
        ▼
PUT /api/v1/invoice/{id}
        │
        ▼
Store correction in corrections table
        │
        ▼
When corrections accumulate (e.g., 20+ new corrections):
        │
        ▼
Export corrected invoices as new ground truth labels
        │
        ▼
Run autoresearch loop against expanded ground truth
        │
        ▼
If improved prompts found → deploy to production
```

### 8.2 Vendor Pattern Learning

```
Invoice processed → vendor name extracted
        │
        ▼
Fuzzy match against vendor_patterns table
        │
        ▼
If match found → use canonical name, boost confidence
If no match   → create new pattern entry (low confidence)
        │
        ▼
Human confirms/corrects vendor name
        │
        ▼
Update vendor_patterns: add variant, boost confidence
```

Over time, the system builds a proprietary database of vendor name variants per client. This is a significant switching cost — "Samsung" might appear as "삼성전자", "삼성전자(주)", "Samsung Electronics Co., Ltd.", "SAMSUNG ELEC", etc. The system learns all of these.

### 8.3 Prompt Versioning

```python
# Track which prompt version produced each extraction
class InvoiceData(BaseModel):
    ...
    prompt_version: str  # Git commit hash of prompts.py
```

This allows:
- A/B testing of prompt versions
- Rollback if a new prompt version degrades accuracy
- Correlation of accuracy metrics with prompt changes

---

## 9. MVP Tech Stack Decisions

### 9.1 What to Use

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **API framework** | FastAPI (existing) | Already built, async, fast |
| **LLM** | Gemini 2.5 Flash (existing) | Free tier, JSON mode support, fast |
| **OCR** | Mistral OCR (existing) | Already integrated, handles CJK well |
| **Database** | SQLite (via aiosqlite) | Zero-infra for MVP, sufficient for 10 clients |
| **File storage** | Local filesystem | Co-located with API server on Railway |
| **Fuzzy matching** | rapidfuzz | Fast, pure Python, no C deps headache |
| **Excel output** | openpyxl | Already a dep (used by python-docx ecosystem) |
| **Background tasks** | FastAPI BackgroundTasks | Simple, no Redis/Celery needed for MVP |
| **Deployment** | Railway (existing) | Same infra as Xenith Translator API |

### 9.2 What NOT to Build for MVP

| Skip | Reason | When to Add |
|------|--------|-------------|
| Email intake | Complexity, need email parsing | After 3 paying clients |
| QuickBooks/Xero API integration | OAuth flows, API maintenance | After 5 paying clients |
| Multi-tenant auth | MVP is ops service (you process for clients) | When building self-serve (Model B) |
| Real-time processing dashboard | Ops service clients just need reports | When building self-serve (Model B) |
| Delivery receipt matching | Clients rarely have structured receipt data | When first client requests it |
| Multi-currency conversion | Can hardcode current rates for MVP | When volume justifies exchange rate API |
| PostgreSQL | SQLite handles MVP volume | When concurrent users > 5 or data > 10GB |

### 9.3 New Dependencies

```
# Add to apps/api/requirements.txt
rapidfuzz>=3.0          # Fuzzy string matching
aiosqlite>=0.20         # Async SQLite
openpyxl>=3.1           # Excel file generation (may already be pulled in by python-docx)
```

All other dependencies already exist in the Xenith backend.

---

## 10. Module Layout

```
apps/api/app/
├── main.py                    # Add invoice registry init to lifespan
├── config.py                  # Add invoice-specific settings
├── dependencies.py            # Add invoice service dependency
├── schemas.py                 # Existing (unchanged)
├── prompts.py                 # Existing translation prompts (unchanged)
├── exceptions.py              # Add InvoiceProcessingError, MatchingError
│
├── extractors/                # Existing (unchanged, fully reused)
├── providers/                 # Existing (unchanged, fully reused)
├── converters/                # Existing (unchanged, mostly reused)
│
├── invoice/                   # NEW — all invoice-specific code
│   ├── __init__.py
│   ├── schemas.py             # InvoiceData, LineItem, MatchResult, ExceptionFlag
│   ├── prompts.py             # Invoice extraction prompts (autoresearch target)
│   ├── rules.json             # Matching/exception rules (autoresearch target)
│   ├── extraction.py          # InvoiceExtractor — raw text → InvoiceData
│   ├── matching.py            # MatchingEngine — invoice ↔ PO ↔ receipt
│   ├── exceptions.py          # ExceptionDetector — anomaly detection
│   ├── reports.py             # ReportGenerator — CSV/XLSX/PDF output
│   ├── service.py             # InvoiceService — orchestrates the full pipeline
│   └── db.py                  # Database access layer (aiosqlite)
│
├── routers/
│   ├── health.py              # Existing
│   ├── translate.py           # Existing
│   ├── convert.py             # Existing
│   ├── formats.py             # Existing
│   └── invoice.py             # NEW — all /api/v1/invoice/* endpoints
│
└── ap-autoresearch/           # Standalone experiment loop (not imported by API)
    ├── program.md
    ├── evaluate.py
    ├── extract.py
    ├── prompts.py
    ├── rules.json
    ├── ground_truth/
    └── results.tsv
```

### 10.1 Registration in `main.py`

The invoice module plugs into the existing lifespan pattern:

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    # ... existing registry setup ...

    # --- Init Invoice Service ---
    from .invoice.service import InvoiceService
    from .invoice.db import InvoiceDB

    invoice_db = await InvoiceDB.create(settings.invoice_db_path)
    invoice_service = InvoiceService(
        extractor_registry=extractor_registry,
        provider_registry=provider_registry,
        db=invoice_db,
    )
    set_invoice_service(invoice_service)

    log.info("startup.complete", invoice="enabled")
    yield

    await invoice_db.close()
    log.info("shutdown")
```

### 10.2 New Settings in `config.py`

```python
class Settings(BaseSettings):
    # ... existing settings ...

    # Invoice
    invoice_db_path: str = "data/invoice.db"
    invoice_file_storage_path: str = "data/invoices"
    invoice_max_batch_size: int = 50
    invoice_enable_translation: bool = True
```

---

## 11. Implementation Sequence

For the ops-service MVP (Model A):

1. **Invoice schemas + extraction** — `invoice/schemas.py`, `invoice/prompts.py`, `invoice/extraction.py`. Get InvoiceData out of PDFs.
2. **Database layer** — `invoice/db.py`. Store and retrieve invoices.
3. **API endpoints** — `routers/invoice.py`. Process, list, update.
4. **Exception detection** — `invoice/exceptions.py`. Flag duplicates, tax issues, low confidence.
5. **Report generation** — `invoice/reports.py`. CSV/Excel expense report output.
6. **Autoresearch setup** — `ap-autoresearch/` with synthetic ground truth, baseline evaluation.
7. **Matching engine** — `invoice/matching.py`. PO matching (requires client PO data).
8. **Self-improving loop** — Corrections → ground truth export → autoresearch.

Steps 1-5 are sufficient for MVP pilot with real clients. Steps 6-8 build the compounding moat.
