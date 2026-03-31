# AP Automation — Strategy Doc

---

## Elevator Pitch

"We cut your AP/expense time in half — either as software or as an ops service with a small team + agents."

Focus: Korean and Japanese invoices/documents first, with English (US) support. Nobody else automates AP well for CJK languages.

---

## 1. The Problem

Accounts Payable (AP) is the process of receiving, verifying, and paying invoices. For businesses that deal with Korean or Japanese vendors, the pain is 2x:

1. **Language barrier** — invoices arrive in Korean/Japanese (PDF, scanned images, HWPX, Excel). Someone must translate before they can even start processing.
2. **Manual data entry** — vendor name, amount, date, line items, tax, currency — all typed by hand into accounting software.
3. **3-way matching** — each invoice must be matched to a Purchase Order (PO) and delivery receipt. Line items don't always match exactly.
4. **Exception handling** — wrong amounts, missing POs, duplicate invoices, currency discrepancies — all need human review.
5. **Multi-currency** — KRW/JPY/USD conversions, exchange rate discrepancies between invoice date and payment date.
6. **Compliance** — tax withholding rules differ by country (Korean VAT, Japanese consumption tax, US sales tax).

**Time cost**: Small teams spend 15-30 hours/month on AP. Companies with cross-border Korean/Japanese trade spend even more due to translation overhead.

---

## 2. Target Customers

### Tier 1: Primary (Korean/Japanese focus)

**A. US importers sourcing from Korea/Japan**
- E-commerce (K-beauty, K-food, J-beauty, electronics)
- Receive invoices, COAs, shipping docs in Korean/Japanese
- 10-200 invoices/month
- Currently: manual translation + manual entry, or expensive translation agencies

**B. Korean/Japanese companies with US operations**
- Korean companies expanding to the US (subsidiaries, branches)
- Internal docs in Korean, US accounting in English
- Need bilingual AP processing
- Currently: bilingual staff or outsourced bookkeeping

**C. Accounting firms serving Korean/Japanese clients**
- CPA firms in LA, NYC, NJ, Atlanta (large Korean-American communities)
- Handle AP for multiple Korean-owned businesses
- Process mixed Korean/English invoices daily
- Currently: bilingual bookkeepers (expensive, hard to hire)

### Tier 2: Secondary (English, broader market)

**D. Any SMB drowning in AP**
- 50-500 invoices/month
- Using QuickBooks/Xero but still doing manual entry
- No cross-border complexity, just volume

---

## 3. How It Works (The Autoresearch Loop)

```
┌─────────────────────────────────────────────────────────┐
│                    INGEST                                │
│  Invoice (PDF, scan, HWPX, email, Excel)                │
│  → OCR / text extraction / translation                  │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    EXTRACT                               │
│  LLM extracts structured fields:                        │
│  vendor, date, amount, currency, line items, tax, PO#   │
│  (Korean/Japanese → English + structured data)           │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    MATCH                                 │
│  Auto-match invoice to PO and delivery receipt          │
│  Flag exceptions: amount mismatch, missing PO,          │
│  duplicate, currency discrepancy                        │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    REVIEW                                │
│  Human reviews exceptions only                          │
│  Corrections feed back into the system                  │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    AUTORESEARCH (self-improving)         │
│  Every correction improves:                             │
│  - Extraction prompts (better field parsing)            │
│  - Matching rules (smarter fuzzy matching)              │
│  - Exception detection (fewer false positives)          │
│  - Vendor-specific patterns (learns each vendor's       │
│    invoice format over time)                            │
└──────────────────────┬──────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    OUTPUT                                │
│  - Clean expense report (CSV, Excel, PDF)               │
│  - QuickBooks/Xero import-ready format                  │
│  - Exception summary for management review              │
│  - Audit trail with original doc + translated version   │
└─────────────────────────────────────────────────────────┘
```

**The autoresearch angle**: Unlike static rule-based systems, the LLM prompts and matching rules improve with every batch. Metric: % of invoices processed without human correction. Goal: start at ~70%, reach 95%+ within 3 months per client.

---

## 4. Unfair Advantages

1. **Korean/Japanese document expertise** — Xenith already handles HWPX, Korean OCR, CJK translation. Nobody else in the AP space does this.
2. **Self-improving system** — autoresearch loop means accuracy improves over time, creating a compounding moat.
3. **Flexible delivery** — software for tech-savvy clients, ops service for everyone else. Competitors force you into one model.
4. **Low starting cost** — use Gemini Flash (free/cheap) for extraction + translation. No expensive OCR licenses needed.

---

## 5. Delivery Models

### Model A: Ops Service ("Done for you")
- Client sends invoices (email, shared folder, upload portal)
- Your team (you + AI agents) processes them
- Client receives clean expense report + exception flags
- **Pricing**: $1,000-3,000/month depending on volume
- **Best for**: Tier 1 clients who want zero setup

### Model B: Software ("Self-serve")
- Client uploads invoices to web app
- AI processes automatically, flags exceptions
- Client reviews and exports
- **Pricing**: $200-500/month
- **Best for**: Tier 2 clients, tech-savvy teams

### Model C: Hybrid ("Software + ops backup")
- Client uses software for routine invoices
- Your team handles exceptions and complex docs
- **Pricing**: $500-1,000/month
- **Best for**: Tier 1 clients who want control but need support

**Start with Model A.** Learn the workflows, build the prompts, then productize into Model B.

---

## 6. MVP Scope (Model A — Ops Service)

### What you need to start
- [ ] Invoice intake: shared Google Drive folder or email forwarding
- [ ] Processing pipeline: Python script using Gemini Flash for OCR + extraction + translation
- [ ] Output template: Excel/CSV expense report template
- [ ] Exception flagging: simple rules (amount > threshold, missing PO, duplicate vendor+date+amount)
- [ ] Client dashboard: simple Notion page or Google Sheet showing processing status

### What you do NOT need to start
- No web app (use Google Drive + Sheets)
- No integrations (manual export to QuickBooks/Xero)
- No user auth, billing, onboarding flows
- No marketing site (sell through warm intros)

### Tech stack (reuse from Xenith)
- **Extraction**: Xenith's extractor registry (PDF, image OCR, HWPX, DOCX, Excel)
- **Translation**: Gemini Flash (already integrated)
- **Structured output**: LLM with JSON mode for field extraction
- **Matching**: Python fuzzy matching (fuzzywuzzy or rapidfuzz)
- **Autoresearch**: Log corrections → nightly prompt improvement loop

---

## 7. Pricing Context

| Competitor | What they do | Pricing | CJK support |
|-----------|-------------|---------|-------------|
| Dext (Receipt Bank) | Receipt/invoice scanning | $24-66/month | Poor |
| Expensify | Expense reports | $5-18/user/month | Poor |
| Bill.com | AP automation | $45-79/user/month | None |
| Tipalti | Global AP | $129+/month | Partial |
| Human bookkeeper | Manual AP | $2,000-5,000/month | If bilingual |
| Translation agency | Per-document | $30-50/document | Yes but slow |

**Your positioning**: Cheaper than a bilingual bookkeeper, smarter than Dext/Expensify for Korean/Japanese docs, faster than translation agencies.

---

## 8. Go-to-Market (First 90 Days)

### Month 1: Find 3 pilot clients
- **Where to find them**:
  - Korean CPA firms in LA/NYC (Google "Korean CPA Los Angeles")
  - Korean Chamber of Commerce (KOCHAM) events
  - LinkedIn: search "Korean importer" or "Japanese sourcing"
  - r/AmazonFBA, K-beauty Facebook groups (from Xenith strategy docs)
  - Your personal network
- **Offer**: Free pilot (2-4 weeks), process their invoices, show time savings
- **Goal**: Prove the workflow, learn edge cases

### Month 2: Refine and charge
- Fix issues from pilot
- Improve prompts based on corrections (autoresearch loop)
- Convert pilots to paid ($1,000-2,000/month)
- Document case study: "Client X reduced AP time from 20 hours/month to 8 hours/month"

### Month 3: Scale to 5-10 clients
- Referrals from pilot clients
- Cold outreach to CPA firms
- LinkedIn content: "How we process Korean invoices 3x faster with AI"
- Start building the self-serve software if demand warrants it

---

## 9. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Accuracy not good enough | Start with human review on everything; gradually reduce as prompts improve |
| Sensitive financial data | SOC 2 compliance roadmap, encrypted storage, auto-delete after processing (like Xenith) |
| Hard to get first clients | Free pilot removes risk; target your network first |
| Competitors add CJK support | They're focused on English market; your head start compounds with autoresearch |
| Client churn | Switching cost is high once your system learns their vendors' invoice patterns |

---

## 10. Connection to Xenith

This is NOT a pivot from Xenith — it's a vertical application of the same technology:

- **Xenith** = horizontal translation tool (anyone, any document)
- **AP Automation** = vertical solution (finance teams, invoices specifically)

Shared infrastructure:
- File extraction (PDF, HWPX, image OCR)
- Korean/Japanese translation (Gemini Flash)
- Document processing pipeline

Xenith continues as the free translation tool that drives awareness. AP Automation is the monetizable B2B product built on top.
