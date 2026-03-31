# Xenith Pricing Research (March 2026)

## Current Status: FREE — monetize after user traction

## Greg Eisenberg Framework (Steps 21-22)
- Per-task pricing, NOT per-seat subscriptions
- Free: text translation + file conversion (acquisition funnel)
- Paid: invoices + document translation (pay per use)
- "Complete this workflow for me — it's worth $200 every time you do it."

## Our API Costs Per Operation

| Feature | Our Cost | Cost Driver |
|---------|----------|-------------|
| Text translation (short) | $0.0006 | Gemini output |
| Text translation (long) | $0.003 | Gemini output |
| PDF translation /page | $0.004 | Mistral OCR + Gemini |
| DOCX/HWPX translation /page | $0.002 | Gemini only (local extraction) |
| Image translation | $0.0024 | Mistral OCR + Gemini |
| Invoice processing /invoice | $0.005 | Mistral OCR + 2x Gemini |
| HWPX/DOCX to PDF | $0.00 | Local (weasyprint) |
| PDF/Image to Text (OCR) | $0.002 | Mistral OCR |

## Future Per-Task Pricing (when ready)

| Feature | Price | Our Cost | Margin |
|---------|-------|----------|--------|
| Invoice processing | $0.50-1.00/invoice | $0.005 | 100-200x |
| Document translation | $0.50-1.00/doc | $0.01-0.02 | 25-100x |
| Image translation | $0.25/image | $0.0024 | 100x |
| File conversion | Free | $0.00 | Funnel |
| Text translation | Free | $0.0006 | Funnel |

## Competitor Pricing Reference

### Invoice Processing
- AWS Textract: $0.01/page
- Google Document AI: $0.01/page
- Mindee: $0.04-0.10/page (250 free/mo)
- Veryfi: $0.08-0.16/doc ($500/mo min)
- Docsumo: $0.30/page
- Parseur: $0.10-0.39/doc
- Manual processing: $12-20/invoice

### File Conversion
- Smallpdf: $12/mo
- iLovePDF: $7/mo
- PDF2Go: $6-8/mo
- CloudConvert: credit-based ($8+/mo)
- Adobe Acrobat: $13-20/mo

### Human Korean Translation
- $25-39/page (no one handles HWPX natively)

## Key Insights
1. Gemini 2.5 Flash is absurdly cheap — 10-30x cheaper than API competitors
2. HWPX is zero-cost moat (local extraction, no competitor supports it)
3. Free file conversion drives adoption (costs us $0.00)
4. Invoice batch processing scales well (accountant agent amortizes)
5. Text translation as funnel costs <$0.01/user/day

## API Pricing (what we pay)
- Gemini 2.5 Flash: $0.30/1M input, $2.50/1M output (free tier: 250 RPD)
- Mistral OCR: $0.002/page
