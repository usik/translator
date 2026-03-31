# Xenith Invoice — Feature Roadmap & Market Research

## Strategic Thesis

Invoice processing is Xenith's highest-potential moat. No tool handles Korean 세금계산서 / Japanese 適格請求書 / Chinese 发票 natively with translation + structured extraction. SAP Concur has "not found a comprehensive solution" for APAC receipts. Companies hire native speakers as a workaround. We solve this with Gemini + Mistral OCR at $0.005/invoice.

## Market Validation

- AP automation market: **$3B+ growing at 12.5% CAGR**
- AI invoice processing: **$2.8B → $47.1B by 2034 (32.6% CAGR)**
- Manual invoice cost: **$15/invoice, 14.6 days processing time**
- **86% of SMEs** still manually enter invoice data
- **39% of invoices** contain errors
- **No dominant solution** for CJK invoice translation

## Key User Quotes (Reddit, forums, enterprise)

> "We have not found a comprehensive solution that translates foreign receipts. APAC is the biggest concern. Companies hire native Chinese speakers specifically to read receipts." — SAP Concur Community

> "My job is nothing but entering invoices. I hate it so much." — r/Accounting

> "I just need clean rows in a spreadsheet." — HackerNews (ParsePoint creator)

> "All it takes is getting one receipt wrong to lose all trust in OCR reliability." — Expensify blog

## Pricing Model (Greg Eisenberg: per-task, not per-seat)

| Feature | Price | Our Cost | Margin |
|---------|-------|----------|--------|
| Invoice → structured data + translation | $0.50-2.00/invoice | $0.005 | 100-400x |
| Invoice → QuickBooks/Xero push | $0.25-1.00/invoice | $0.005 | 50-200x |
| Tax compliance validation (KR/JP) | $0.10-0.50/invoice | $0.001 | 100-500x |
| Document translation | $0.50-1.00/doc | $0.01-0.02 | 25-100x |
| File conversion | Free | $0.00 | Funnel |
| Text translation | Free | $0.0006 | Funnel |

**Current status: FREE until we have user traction.**

---

## Feature Build Order

### Phase 1: Core (DONE)
- [x] Multilingual OCR extraction (Mistral)
- [x] AI field extraction (Gemini — Extractor Agent)
- [x] Math validation + anomaly detection (Gemini — Accountant Agent)
- [x] Excel/CSV report generation
- [x] Batch processing (zip upload)
- [x] Frontend invoice page (en/ko/ja)

### Phase 2: Stickiness — Accounting Integration (NEXT)
- [ ] QuickBooks Online export (via Apideck unified API)
- [ ] Xero export (via Apideck)
- [ ] FreshBooks / Sage / NetSuite (via Apideck — same integration)
- [ ] One-click push: extracted invoice → bill in accounting software
- [ ] GL code suggestions based on vendor/category

### Phase 3: Compliance Moat
- [ ] Korean 세금계산서 full compliance validation
  - Business registration number validation
  - Required field checks (공급자, 공급받는자, 공급가액, 세액)
  - VAT rate verification (10%)
  - NTS-compatible XML output (future)
- [ ] Japanese 適格請求書 validation
  - JCT registration number check
  - Itemized tax rates (8%/10%)
  - Required field presence
- [ ] Chinese 增值税发票 validation
  - VAT type detection (special vs general)
  - Required field checks

### Phase 4: Intelligence
- [ ] Duplicate invoice detection (fuzzy matching across languages)
- [ ] Vendor pattern learning (remember recurring vendor formats)
- [ ] Auto-categorization / GL code prediction
- [ ] Multi-currency conversion with rate tracking

### Phase 5: Automation
- [ ] Email inbox integration (Gmail/Outlook → auto-extract)
- [ ] Webhook/API for programmatic access
- [ ] Lightweight approval workflows (Slack notifications)
- [ ] 3-way matching (invoice ↔ PO ↔ receipt) — lightweight version

---

## Competitor Landscape

### Direct (API-level)
| Tool | CJK Support | Per-Invoice Cost | Our Advantage |
|------|-------------|-----------------|---------------|
| AWS Textract | Characters only, no translation | $0.01/page | We translate + understand fields |
| Google Document AI | Characters only | $0.01/page | Same |
| Mindee | No CJK specialization | $0.04-0.10/page | CJK native + translation |
| Veryfi | Limited | $0.08-0.16/doc | 10x cheaper + CJK |

### Adjacent (full apps)
| Tool | CJK Support | Price | Our Advantage |
|------|-------------|-------|---------------|
| Bill.com | No | $45-79/user/mo | Per-task pricing, CJK native |
| Expensify | No CJK translation | $5-9/user/mo | We actually translate receipts |
| SAP Concur | No (they admitted it) | $8+/user/mo | We fill their exact gap |
| Dext | Limited | $25+/mo | Better OCR + translation |

### No one does this:
- HWPX invoice support ($0 cost — local extraction)
- Korean 세금계산서 → English structured report
- Japanese 適格請求書 → English structured report
- Cross-language duplicate detection

---

## Key Insights

1. **"Partial automation trap"** — 48% of companies see NO cost savings from AP tools. Bar is low.
2. **Simple beats complex** — ParsePoint (invoice→Excel) and Expensent (auto-forward) got the most traction. Don't overbuild.
3. **Basis raised $100M at $1.15B** for AI accounting agents. Market is hot.
4. **QuickBooks/Xero integration** is the #1 feature that converts users to paying customers.
5. **Compliance is a moat** — once they rely on you for Korean/Japanese tax validation, switching cost is enormous.
6. **VLMs replacing OCR** — building on Gemini (multimodal LLM) is the right technical bet.

---

## Sources

See full research in:
- `docs/pricing-research.md` — cost breakdowns and competitor pricing
- `docs/greg-eisenberg-saas-framework.md` — 30-step SaaS framework
- `docs/xenith-invoice-market-research.md` — market research
- `docs/ap-automation-strategy.md` — AP automation strategy
