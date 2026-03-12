# Document Parse Feature — Design Doc

## Overview

Replicate [Upstage Document Parse](https://www.upstage.ai/products/document-parse) for free. Users upload a PDF or image, and get structured Markdown or HTML output with tables, headings, and layout preserved — powered by Gemini 2.5 Flash vision (free tier).

Upstage charges $0.01/page. We offer it free.

---

## User Flow

1. User visits `/parse`
2. Uploads a PDF or image (PNG, JPG, WebP, BMP, TIFF, GIF)
3. Selects output format: **Markdown** (default) or **HTML**
4. Clicks "Parse Document"
5. Sees extracted structured content in a code block
6. Can **copy** to clipboard or **download** as `.md` / `.html`

---

## Backend

### New Endpoint

```
POST /api/v1/parse
Content-Type: multipart/form-data
```

**Form fields:**
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `file` | UploadFile | required | PDF or image file |
| `output_format` | string | `"markdown"` | `"markdown"` or `"html"` |

**Response:**
```json
{
  "success": true,
  "data": {
    "content": "# Document Title\n\n| Col A | Col B |\n|-------|-------|\n| 1     | 2     |",
    "format": "markdown",
    "page_count": 3,
    "metadata": {
      "processing_time_ms": 1234
    }
  }
}
```

### Implementation

**New file:** `app/routers/parse.py`

**Approach:**
- **Images:** Base64 encode → send to Gemini 2.5 Flash via OpenAI-compatible API as multimodal message
- **PDFs:** Use `pymupdf` (PyMuPDF) to render each page as PNG at 150 DPI → send all page images to Gemini

**Gemini multimodal call** (using existing `GeminiProvider._client` which is `AsyncOpenAI`):
```python
content_parts = [{"type": "text", "text": PROMPT}]
for img_b64, mime in page_images:
    content_parts.append({
        "type": "image_url",
        "image_url": {"url": f"data:{mime};base64,{img_b64}"}
    })

response = await client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": content_parts}],
    max_tokens=16000,
)
```

**Prompts:**

*Markdown prompt:*
> You are a document parser. Extract ALL content from this document and return it as well-structured Markdown.
> Rules: Preserve text exactly, reproduce tables as Markdown tables, use proper heading levels, preserve lists, describe charts in blockquotes, preserve emphasis, do NOT add commentary, separate pages with `---`.

*HTML prompt:*
> Same rules but output semantic HTML (`<table>`, `<h1>`–`<h6>`, `<ul>/<ol>`, `<strong>/<em>`, `<hr />`). No `<html>/<head>/<body>` wrappers.

**Constraints:**
- Rate limit: 15 requests/minute
- Max file size: 20MB (from `settings.max_file_size_mb`)
- PDF page cap: first 20 pages (Gemini context limit)
- Supported extensions: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.tiff`, `.gif`
- Use `asyncio.to_thread` for synchronous PyMuPDF rendering

**New dependency:** `pymupdf>=1.24` in `pyproject.toml`

**Changes to `main.py`:** Import and include `parse.router`

### Error Cases

| Status | Condition |
|--------|-----------|
| 400 | Unsupported file type |
| 413 | File exceeds size limit |
| 502 | Gemini API error |
| 503 | Gemini provider not configured |

---

## Frontend

### New Files

| File | Purpose |
|------|---------|
| `src/app/parse/page.tsx` | Server component with SEO metadata |
| `src/app/parse/client.tsx` | Client component with upload/parse/results UI |

### API Layer (`src/lib/api.ts`)

Add `parseDocument()` function and `useParseDocument()` TanStack Query hook.

### Page Design (`/parse`)

```
┌─────────────────────────────────────────┐
│  Document Parser                        │
│  Extract structured text from PDFs      │
│  and images using AI.                   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │   Drop your file here or click    │  │
│  │   PDF, PNG, JPG, WebP (max 20MB) │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Output:  [Markdown]  [HTML]            │
│                                         │
│  [ ████████ Parse Document ████████ ]   │
│                                         │
│  ┌─ Result ─────────── [Copy] [DL] ─┐  │
│  │ # Document Title                  │  │
│  │                                   │  │
│  │ | Col A | Col B |                 │  │
│  │ |-------|-------|                 │  │
│  │ | 1     | 2     |                 │  │
│  │ ...                               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Navigation Updates

| File | Change |
|------|--------|
| `navbar.tsx` | Add `{ href: "/parse", label: "Parse" }` to navLinks |
| `footer.tsx` | Add Parse link between Convert and Privacy |
| `sitemap.ts` | Add `/parse` entry (priority 0.8) |
| `convert/client.tsx` | Add "Document Parser" card linking to `/parse` |

### SEO Metadata

```
Title: "Document Parser - Extract Text from PDF & Images | 문서 파싱"
Description: "Free AI-powered document parser. Extract structured text,
tables, and content from PDFs and images as Markdown or HTML.
무료 AI 문서 파서 - PDF, 이미지에서 텍스트와 표를 추출합니다."
```

---

## File Changes Summary

### Backend (apps/api)
| Action | File |
|--------|------|
| Edit | `pyproject.toml` — add `pymupdf>=1.24` |
| Create | `app/routers/parse.py` — new parse endpoint |
| Edit | `app/main.py` — import + include parse router |

### Frontend (apps/web)
| Action | File |
|--------|------|
| Edit | `src/lib/api.ts` — add `parseDocument` + `useParseDocument` |
| Create | `src/app/parse/page.tsx` — server component + metadata |
| Create | `src/app/parse/client.tsx` — client UI |
| Edit | `src/components/navbar.tsx` — add Parse link |
| Edit | `src/components/footer.tsx` — add Parse link |
| Edit | `src/app/sitemap.ts` — add /parse |
| Edit | `src/app/convert/client.tsx` — add Document Parser card |

### Deployment
- `uv sync` on Railway to install pymupdf
- No new env vars needed (uses existing `GEMINI_API_KEY`)
- Dockerfile may need no changes (pymupdf is pure Python wheels)

---

## Cost Analysis

| Provider | Cost |
|----------|------|
| Upstage | $0.01/page |
| Xenith (Gemini 2.5 Flash free tier) | $0.00 |
| Gemini 2.5 Flash paid tier (if free tier exhausted) | ~$0.0001/page |

Free tier limits: 1500 RPD / 1M TPD on Gemini 2.5 Flash.
