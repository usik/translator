# Xenith Invoice — Product Plan

> Cross-border CJK invoice processing: translate, extract, match, pay.

---

## 1. Product Positioning

### The Xenith Platform

Xenith is a platform of document intelligence services for businesses operating across CJK (Korean, Japanese, Chinese) and English language boundaries. Each service shares core infrastructure — file extraction, CJK translation, and document processing — but serves a distinct job-to-be-done.

| Service | Job-to-be-done | Status |
|---------|---------------|--------|
| **Xenith Translate** | "I need this Korean/Japanese document in English, with formatting preserved." | Live (tryxenith.com) |
| **Xenith Invoice** | "I need these Korean/Japanese invoices processed, matched, and ready for payment." | Planned |

This mirrors how DeepL started as a translation engine and expanded into DeepL Write (editing) and DeepL API (developer tools). Each product reinforces the others, but can stand alone.

### Competitive Position

Xenith Invoice occupies a gap no one else fills:

```
                          CJK Language Support
                     Low ◄─────────────────► High
                      │                        │
    Low Cost ─────────┤  Dext, Expensify       │
                      │  (English-only,        │
                      │   poor CJK OCR)        │
                      │                        │
                      ├────────────────────────┤
                      │                        │  ← Xenith Invoice
                      │                        │    (CJK-native, AI-powered,
                      │                        │     affordable)
                      ├────────────────────────┤
    High Cost ────────┤  Bill.com, Tipalti     │  Bilingual bookkeeper
                      │  (no CJK support)      │  ($2K-5K/month)
                      │                        │
```

**One-liner**: Cheaper than a bilingual bookkeeper, smarter than Dext or Expensify for Korean/Japanese documents, faster than translation agencies.

### Why Not Just a Feature of Xenith Translate?

Invoice processing is a *workflow*, not a *translation*. It requires:
- Structured field extraction (vendor, amounts, dates, line items)
- 3-way matching (invoice ↔ PO ↔ delivery receipt)
- Exception detection (duplicates, mismatches, missing POs)
- Accounting-system-ready output (QuickBooks/Xero format)
- Compliance awareness (Korean VAT, Japanese consumption tax)

Translation is one step in this workflow. Xenith Translate handles the horizontal use case (any document, any person). Xenith Invoice handles the vertical use case (invoices, finance teams).

---

## 2. User Personas

### Persona A: The K-Beauty Importer (Primary)

**Name**: Sarah, Operations Manager at a 15-person K-beauty e-commerce company in LA.

- Receives 40-80 invoices/month from Korean suppliers, all in Korean (PDF, scanned images)
- Currently: bilingual office manager manually translates fields, types into QuickBooks
- Pain: 20+ hours/month on invoice processing; office manager is a bottleneck and flight risk
- Budget: Currently paying $4K/month for the bilingual office manager's time on AP tasks
- Willingness to pay: $1,000-2,000/month for automation that handles 80%+ of invoices

### Persona B: The Korean CPA Firm (Primary)

**Name**: James, Managing Partner at a 5-person Korean-American CPA firm in NYC.

- Handles AP/bookkeeping for 20+ Korean-owned businesses
- Processes 200-500 mixed Korean/English invoices per month across clients
- Currently: 2 bilingual bookkeepers ($55K/year each) doing manual data entry
- Pain: Can't scale — adding clients means hiring more bilingual staff (scarce and expensive)
- Budget: $110K/year in bookkeeper salary for AP-adjacent work
- Willingness to pay: $2,000-3,000/month if it lets them handle 2x clients without new hires

### Persona C: The Korean Subsidiary CFO (Secondary)

**Name**: Min-su, CFO of a Korean manufacturer's US subsidiary in Atlanta.

- Receives invoices from Korean HQ and local US vendors
- Must reconcile Korean-language internal documents with US GAAP accounting
- Currently: Outsourced to a bilingual accounting firm ($5K/month)
- Pain: Slow turnaround (1-2 weeks), errors in translation, no visibility into process
- Willingness to pay: $1,500-2,500/month for faster, more accurate processing

### Persona D: The English-Only SMB (Tertiary — later)

**Name**: Mike, Owner of a 30-person construction company.

- 100+ invoices/month, all in English
- Currently: Office admin manually enters into QuickBooks
- No cross-border complexity, just volume
- *Not the initial target* — pursue only after CJK moat is established

---

## 3. MVP Scope

### v1: Ops Service (Month 1-3) — "Done for You"

The MVP is a *service*, not software. You + AI agents process invoices on behalf of clients.

**Included in v1:**

| Capability | How It Works |
|-----------|-------------|
| **Invoice intake** | Client forwards invoices to a dedicated email address or uploads to a shared Google Drive folder |
| **OCR + extraction** | Gemini Flash extracts structured fields (vendor, date, amount, currency, line items, tax, PO#) from PDF, scanned images, HWPX, Excel |
| **Translation** | Korean/Japanese fields translated to English (reuse Xenith Translate pipeline) |
| **Structured output** | Clean CSV/Excel expense report, one row per invoice, QuickBooks/Xero import-ready |
| **Exception flagging** | Duplicate detection (same vendor + date + amount), missing fields, amount anomalies |
| **Status tracking** | Shared Google Sheet or Notion board showing processing status per invoice |
| **Human review** | You personally review every output before delivering to client (quality gate) |

**NOT included in v1:**

| Deferred to Later | Reason |
|-------------------|--------|
| 3-way PO matching | Requires client to share PO data; adds complexity to onboarding |
| Accounting software integration | Manual CSV import is good enough for v1 |
| Self-serve web app | No UI needed; Google Drive + email + Sheets is the interface |
| User auth / billing / onboarding | Use Stripe invoicing or manual billing |
| Multi-currency conversion | Note the currency; let the client handle FX |
| Approval workflows | Clients manage approvals in their existing tools |

### v2: Hybrid Service + Software (Month 4-6)

| New Capability | Description |
|---------------|-------------|
| **Upload portal** | Simple web UI (on tryxenith.com/invoice) for drag-and-drop invoice upload |
| **Automatic processing** | Invoices processed without manual trigger; human reviews exceptions only |
| **3-way PO matching** | Client provides PO list (CSV upload); system matches invoices to POs |
| **Client dashboard** | Real-time view of processing status, exception queue, monthly summary |
| **QuickBooks Online integration** | Direct push of processed invoices into QBO |

### v3: Full Self-Serve Platform (Month 7-12)

| New Capability | Description |
|---------------|-------------|
| **Email forwarding auto-ingest** | Forward invoices@clientname.xenith.com → auto-processed |
| **Xero integration** | In addition to QuickBooks |
| **Approval workflows** | Route exceptions to designated approvers via email/Slack |
| **Vendor intelligence** | Per-vendor accuracy dashboard, learned patterns, format memory |
| **Multi-currency with FX rates** | Automatic conversion at invoice-date rate |
| **Audit trail** | Original doc + translated version + extracted data, linked and exportable |
| **API access** | For clients who want to integrate into their own systems |

---

## 4. Feature Prioritization

Using ICE scoring (Impact, Confidence, Ease — each 1-10):

| Feature | Impact | Confidence | Ease | ICE Score | Phase |
|---------|--------|-----------|------|-----------|-------|
| Korean invoice extraction (세금계산서) | 10 | 9 | 8 | 720 | v1 |
| Japanese invoice extraction (適格請求書) | 9 | 8 | 7 | 504 | v1 |
| CJK → English translation of fields | 10 | 10 | 9 | 900 | v1 |
| CSV/Excel export (QBO-ready) | 9 | 10 | 9 | 810 | v1 |
| Duplicate detection | 7 | 8 | 9 | 504 | v1 |
| Exception flagging | 8 | 7 | 8 | 448 | v1 |
| Autoresearch improvement loop | 9 | 7 | 6 | 378 | v1-v2 |
| Upload portal (web UI) | 7 | 9 | 6 | 378 | v2 |
| 3-way PO matching | 8 | 6 | 5 | 240 | v2 |
| QuickBooks integration | 8 | 8 | 5 | 320 | v2 |
| Client dashboard | 6 | 8 | 5 | 240 | v2 |
| Xero integration | 6 | 8 | 4 | 192 | v3 |
| Approval workflows | 5 | 7 | 4 | 140 | v3 |
| Multi-currency FX | 5 | 8 | 5 | 200 | v3 |
| API access | 4 | 7 | 4 | 112 | v3 |

---

## 5. Delivery Models

### Phase 1: Ops Service (v1)

**"Done for you"** — You are the product.

- Client sends invoices (email or Google Drive)
- You + AI agents process them
- Client receives clean expense report + exception flags within 24 hours (next business day)
- Target: 3-5 clients, 50-200 invoices/month each
- Your time commitment: ~10-15 hours/week (scales as prompts improve)

**Why start here:**
- Zero engineering required beyond what Xenith already has
- Learn real edge cases (weird scans, handwritten notes, mixed-language invoices)
- Build the autoresearch ground truth dataset from real data
- Every correction makes the system better (compounding moat)
- Revenue from day 1

### Phase 2: Hybrid (v2)

**"Software + ops backup"** — Clients interact with a web UI for routine invoices; your team handles exceptions and complex documents.

- Client uploads via web portal or email forwarding
- AI processes automatically (target: 80%+ without human intervention)
- Exceptions routed to your team for review
- Client sees real-time dashboard
- Target: 5-15 clients

### Phase 3: Self-Serve (v3)

**"Software only"** — Full automation with human review only for the hardest exceptions.

- Client signs up on tryxenith.com/invoice
- Self-serve onboarding (connect QuickBooks, upload PO list, forward email)
- AI processes 95%+ automatically
- Your team only involved for escalations
- Target: 50+ clients, long-tail SMBs

### The Key Insight

Each phase is not a replacement — it is an additional tier. When v3 launches, all three models coexist:

| Tier | Model | Price | Target |
|------|-------|-------|--------|
| Premium | Ops Service | $2,000-3,000/mo | CPA firms, enterprises |
| Standard | Hybrid | $500-1,000/mo | Mid-market importers |
| Starter | Self-Serve | $200-500/mo | Small businesses |

---

## 6. Pricing Strategy

### v1 Pricing (Ops Service)

| Plan | Volume | Monthly Price | Per-Invoice Cost |
|------|--------|--------------|------------------|
| Starter | Up to 50 invoices/mo | $1,000/mo | $20/invoice |
| Growth | 51-150 invoices/mo | $2,000/mo | ~$13-20/invoice |
| Scale | 151-300 invoices/mo | $3,000/mo | ~$10-20/invoice |

**Anchoring**: Position against the cost of a bilingual bookkeeper ($4K-5K/month) and per-document translation agencies ($30-50/doc). At $2,000/month for 100 invoices, you are:
- 50-60% cheaper than a bilingual bookkeeper
- 60-70% cheaper than translation agency + manual entry
- Delivered next business day, not 1-2 weeks

**Pilot offer**: First month free for the first 3 clients. Process up to 50 invoices at no charge. If they see value, convert to paid.

### v2-v3 Pricing Evolution

As automation improves, shift toward per-invoice and outcome-based pricing:

| Model | Price | When |
|-------|-------|------|
| Monthly retainer (ops) | $1,000-3,000/mo | v1 (now) |
| Per-invoice (self-serve) | $3-8/invoice | v2-v3 |
| Outcome-based | % of time saved or flat fee per successful match | v3+ |

Per-invoice pricing undercuts incumbents and scales with usage. At $5/invoice, a client processing 100 invoices/month pays $500/month — affordable for SMBs, and your marginal cost per invoice (Gemini Flash API) is under $0.10.

---

## 7. Go-to-Market (First 90 Days)

### Month 1: Find 3 Pilot Clients (Days 1-30)

**Objective**: Secure 3 free pilot clients, process their invoices, prove the value.

| Week | Action |
|------|--------|
| 1 | Identify 20 target prospects: Korean CPA firms in LA/NYC/NJ, K-beauty importers, Korean Chamber of Commerce (KOCHAM) members. Use Google Maps, LinkedIn, KOCHAM directories. |
| 2 | Cold outreach: personalized email/LinkedIn message to each prospect. Offer: "We'll process your Korean invoices for free for 4 weeks. No setup, no commitment." Lead with the pain: "Are your bilingual bookkeepers spending 20+ hours/month on invoice translation and data entry?" |
| 3 | Onboard first pilots. Collect invoices via shared Google Drive or email forward. Process manually with AI assistance. Document every edge case. |
| 4 | Deliver first batch of processed invoices. Collect feedback. Begin autoresearch loop — label corrections as ground truth. |

**Channels:**
- Personal network (warm intros first — highest conversion)
- Korean CPA firm directories (Google "Korean CPA Los Angeles" / "Korean CPA New York")
- KOCHAM (Korean Chamber of Commerce) member lists and events
- LinkedIn outreach targeting "accounts payable" + "Korean" or "Japanese"
- Reddit: r/AmazonFBA, r/ecommerce (K-beauty/J-beauty importers)
- K-beauty / K-food Facebook groups and trade forums

### Month 2: Refine and Convert (Days 31-60)

**Objective**: Fix issues from pilots, improve accuracy, convert pilots to paid.

| Week | Action |
|------|--------|
| 5-6 | Analyze pilot results: track field extraction accuracy per language, identify most common errors. Run autoresearch experiments to improve prompts. Target: 80%+ accuracy on Korean 세금계산서, 75%+ on Japanese 適格請求書. |
| 7 | Present results to pilot clients: "We processed X invoices in Y hours vs your previous Z hours. Here's your accuracy report." |
| 8 | Convert pilots to paid plans ($1,000-2,000/month). Offer 20% discount for 3-month commitment. Collect testimonial / case study from most enthusiastic client. |

**Content creation begins:**
- Write 1 LinkedIn post per week (process demos, CJK invoice tips, client results)
- Create lead magnet: "Korean Tax Invoice (세금계산서) Field Guide for US Businesses" (PDF)
- Publish on tryxenith.com/blog for SEO

### Month 3: Scale to 5-10 Clients (Days 61-90)

**Objective**: Grow to 5-10 paying clients through referrals and outreach.

| Week | Action |
|------|--------|
| 9-10 | Ask pilot clients for referrals (CPA firms typically know other CPA firms and businesses). Offer referral incentive: 1 month free for each referral that converts. |
| 11 | Expand cold outreach to second tier: Japanese importers, Japanese CPA firms, Korean subsidiaries of US companies. |
| 12 | Evaluate demand signal: if 5+ clients and growing waitlist → begin building v2 (web upload portal). If demand is slow → double down on content and outreach. |

**Metrics to track by end of Month 3:**
- Number of paying clients
- Monthly recurring revenue (MRR)
- Invoices processed per month
- Average field extraction accuracy (overall and by language)
- Client time savings (self-reported)
- Autoresearch improvement rate (accuracy gain per week)

---

## 8. Xenith Translate as a Funnel for Xenith Invoice

### The Funnel

```
    ┌──────────────────────────────────────────┐
    │          Xenith Translate (Free)          │
    │   "Translate any document instantly"      │
    │                                           │
    │   Users: anyone translating CJK docs      │
    │   Volume: high (free tool drives traffic)  │
    └─────────────────┬────────────────────────┘
                      │
              Signal detection:
              - User uploads invoices
              - User uploads repeatedly
              - User processes Korean/Japanese
              - User is a business (domain email)
                      │
                      ▼
    ┌──────────────────────────────────────────┐
    │       Upsell Touchpoint                   │
    │   "Processing invoices frequently?        │
    │    Xenith Invoice extracts fields,        │
    │    matches POs, and exports to            │
    │    QuickBooks — automatically."           │
    └─────────────────┬────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────────┐
    │        Xenith Invoice (Paid)              │
    │   "Your Korean/Japanese invoices,         │
    │    processed and payment-ready."          │
    └──────────────────────────────────────────┘
```

### How to Detect Invoice Users in Xenith Translate

Even before building explicit detection, look for these behavioral signals:

1. **File type**: User uploads scanned PDFs or images that look like invoices
2. **Repetition**: Same user translates multiple similar documents (batch processing pattern)
3. **Language pairs**: Korean → English or Japanese → English (business corridors)
4. **Business email domains**: Users with @company.com emails (vs. @gmail.com)
5. **Content keywords**: Extracted text contains invoice-related terms (금액, 세금, 공급가액, 請求書, 消費税)

### Funnel Tactics

| Tactic | When | How |
|--------|------|-----|
| **In-app banner** | After a user translates 3+ documents that appear to be invoices | "Looks like you're translating invoices. Xenith Invoice can extract the data and export to QuickBooks automatically." |
| **Email nurture** | After signup, if user matches business profile | Drip sequence: (1) Welcome, (2) "Did you know Xenith also handles invoice processing?", (3) Case study, (4) Free trial offer |
| **Blog/SEO crossover** | Always | Blog posts targeting "translate Korean invoice" also mention Xenith Invoice as the next step |
| **Shared account** | When Xenith Invoice launches | Single Xenith account for both Translate and Invoice — reduce friction |

### Why This Funnel Works

- **Xenith Translate is free** — it removes all barriers to entry and drives volume
- **Translate users who process invoices are pre-qualified** — they already have the pain (CJK documents) and have chosen Xenith to solve part of it
- **Upgrade is natural** — "You're already translating these invoices manually. Let us do the rest."
- **Shared technology** — the extraction and translation pipeline is literally the same code, so the upgrade path is seamless for both the user and the engineering team

---

## 9. Success Metrics

### Month 3 Targets

| Metric | Target |
|--------|--------|
| Paying clients | 3-5 |
| MRR | $3,000-10,000 |
| Invoices processed/month | 150-500 |
| Korean extraction accuracy | 80%+ |
| Japanese extraction accuracy | 75%+ |
| Client time savings | 50%+ reduction in AP hours |

### Month 6 Targets

| Metric | Target |
|--------|--------|
| Paying clients | 8-15 |
| MRR | $10,000-30,000 |
| Invoices processed/month | 500-2,000 |
| Korean extraction accuracy | 90%+ |
| Japanese extraction accuracy | 85%+ |
| Auto-processed (no human review) | 80%+ |
| v2 web portal | Live |

### Month 12 Targets

| Metric | Target |
|--------|--------|
| Paying clients | 30-50 |
| MRR | $30,000-75,000 |
| Invoices processed/month | 3,000-10,000 |
| Extraction accuracy (all languages) | 95%+ |
| Auto-processed (no human review) | 90%+ |
| v3 self-serve | Live |
| QuickBooks integration | Live |

---

## 10. Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Extraction accuracy too low to be useful** | High | Start with 100% human review; use autoresearch loop to improve. Even at 70% accuracy, you save time on the mechanical work. |
| **Hard to find first clients** | High | Free pilot removes all risk. Target personal network first. Korean CPA community is tight-knit — one referral unlocks many. |
| **Sensitive financial data liability** | High | Process invoices only (not bank statements or SSNs). Auto-delete after processing. Build toward SOC 2 compliance. Use encrypted storage. |
| **Client expects 100% accuracy** | Medium | Set expectations: "AI handles 80%+, you review exceptions." Frame as augmentation, not replacement. |
| **Competitors add CJK support** | Medium | Your head start compounds — autoresearch means you get better every week. Vendor-specific patterns create switching costs. |
| **Scope creep into full accounting** | Medium | Stay focused on AP invoice processing. Do not build bookkeeping, tax filing, or payroll. Adjacent expansion only after core is profitable. |
| **Gemini Flash quality degrades or pricing changes** | Low | Architecture supports multiple LLM providers (already in Xenith's ProviderRegistry). Can swap to Claude, GPT-4o, or Mistral. |

---

## 11. Technical Architecture (Shared with Xenith Translate)

Xenith Invoice reuses the existing monorepo and backend infrastructure:

```
apps/
├── web/                    # Next.js frontend (tryxenith.com)
│   ├── (translate)/        # Existing translation pages
│   └── (invoice)/          # NEW: Invoice processing pages (v2+)
│
├── api/                    # FastAPI backend
│   ├── extractors/         # REUSE: PDF, image, HWPX, DOCX, Excel extraction
│   ├── providers/          # REUSE: Gemini Flash, translation providers
│   ├── converters/         # REUSE: Format conversion
│   └── invoice/            # NEW: Invoice-specific logic
│       ├── extract.py      # Structured field extraction (LLM + JSON mode)
│       ├── match.py        # PO matching, duplicate detection
│       ├── export.py       # CSV/Excel/QBO export
│       └── prompts.py      # Invoice extraction prompts (autoresearch target)
```

**Key reuse from Xenith Translate:**
- ExtractorRegistry (PDF, image OCR, HWPX, DOCX, Excel)
- ProviderRegistry (Gemini Flash, with fallback to other LLMs)
- CJK translation pipeline
- File upload and processing infrastructure

**New components for Invoice:**
- Structured field extraction (JSON mode output)
- Matching engine (fuzzy vendor matching, PO matching)
- Exception detection rules
- Export formatters (CSV, Excel, QBO/Xero format)
- Autoresearch evaluation loop

---

## Summary: The Playbook

1. **Now**: Xenith Translate is live and free. It builds brand, traffic, and CJK document expertise.
2. **Month 1-3**: Launch Xenith Invoice as an ops service. Find 3-5 pilot clients through Korean CPA firms and importers. Process their invoices manually with AI assistance. Learn edge cases. Build ground truth data.
3. **Month 4-6**: Improve accuracy via autoresearch. Build web upload portal. Convert to hybrid model. Scale to 10-15 clients at $1K-3K/month.
4. **Month 7-12**: Launch self-serve platform. Add QuickBooks/Xero integration. Move to per-invoice pricing. Scale to 30-50 clients.
5. **Year 2+**: Expand into adjacent workflows (AR, expense reports, vendor management). Become the default financial operations layer for CJK cross-border businesses.

The moat deepens with every invoice processed: better prompts, more vendor patterns, higher accuracy. Competitors cannot replicate accumulated intelligence.
