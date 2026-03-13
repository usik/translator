# Autoresearch: Invoice Extraction Prompt Optimization

## Goal
Improve the accuracy of `app/invoice/prompts.py` by iteratively modifying the
Extractor Agent and Accountant Agent system prompts and evaluating against
ground truth invoice data.

## Constraints
- Only modify `app/invoice/prompts.py` — no changes to service.py, schemas.py, or other files
- Must maintain valid Python (importable module)
- Prompts must request JSON output matching InvoiceData schema
- Do not add external API calls or dependencies

## What to Optimize
1. **Field extraction accuracy** — vendor name, invoice number, dates, currency
2. **Amount accuracy** — subtotal, tax, total must exactly match ground truth
3. **Line item accuracy** — descriptions, quantities, unit prices
4. **CJK-specific hints** — Korean 세금계산서, Japanese 適格請求書, Chinese 发票 field labels
5. **Date format handling** — YYYY/MM/DD, YYYY年MM月DD日, etc. → ISO YYYY-MM-DD
6. **Vendor name romanization** — consistent handling across scripts

## Scoring Weights
| Metric              | Weight | Description                                |
|---------------------|--------|--------------------------------------------|
| amount_accuracy     | 0.30   | subtotal, tax, total exact match           |
| field_accuracy      | 0.25   | vendor, invoice#, dates, currency          |
| line_item_accuracy  | 0.25   | descriptions, quantities, unit prices      |
| vendor_accuracy     | 0.10   | vendor name matching (fuzzy for CJK)       |
| date_accuracy       | 0.10   | date parsing across formats                |

## Experiment Loop
```
1. Read this spec
2. Modify app/invoice/prompts.py
3. git commit -m "autoresearch: <description>"
4. Run: python evaluate.py
5. If score improved → keep; if worse → git reset --hard HEAD~1
6. Record result in results.tsv
7. GOTO 2
```

## Ground Truth Format
- `ground_truth/invoices/` — raw invoice files (PDF, PNG, JPG)
- `ground_truth/labels/` — JSON files matching invoice filenames
  - e.g., `invoice_001.pdf` → `invoice_001.json`
  - Label JSON matches InvoiceData schema exactly
