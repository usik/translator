# AP Invoice Autoresearch — program.md

This is an autonomous research loop for improving invoice extraction and AP automation prompts. Inspired by [karpathy/autoresearch](https://github.com/karpathy/autoresearch).

---

## Concept

Instead of optimizing LLM training code (like Karpathy's version), we optimize **extraction prompts and matching rules** for invoice processing. The agent modifies prompts, runs evaluation against labeled invoices, and keeps changes that improve accuracy.

```
Human writes: program.md (this file) + labeled invoices (ground truth)
Agent modifies: prompts.py + rules.json
Agent runs:     python evaluate.py
Metric:         field_accuracy (higher is better)
```

---

## Setup

To set up a new experiment run:

1. **Agree on a run tag**: propose a tag based on today's date (e.g. `mar13`). The branch `autoresearch/<tag>` must not already exist.
2. **Create the branch**: `git checkout -b autoresearch/<tag>` from current main.
3. **Read the in-scope files**:
   - `program.md` — this file. Do not modify.
   - `evaluate.py` — fixed evaluation harness. Do not modify.
   - `prompts.py` — the file you modify. Contains all LLM prompts for extraction.
   - `rules.json` — the file you modify. Contains matching rules and exception detection config.
   - `ground_truth/` — labeled invoice data. Do not modify.
4. **Verify ground truth exists**: Check that `ground_truth/` contains at least 10 labeled invoices.
5. **Initialize results.tsv**: Create with header row. Baseline will be recorded after first run.
6. **Confirm and go**: Confirm setup looks good, then kick off experimentation.

---

## File Structure

```
ap-autoresearch/
├── program.md              # This file (read-only, human-edited)
├── evaluate.py             # Evaluation harness (read-only)
├── extract.py              # Extraction pipeline (read-only)
├── prompts.py              # LLM prompts (AGENT MODIFIES THIS)
├── rules.json              # Matching/exception rules (AGENT MODIFIES THIS)
├── ground_truth/           # Labeled invoices (read-only)
│   ├── invoices/           # Raw invoice files (PDF, image, HWPX)
│   └── labels/             # JSON files with correct extracted fields
├── results.tsv             # Experiment log (untracked)
└── run.log                 # Latest run output (untracked)
```

---

## Ground Truth Format

Each invoice in `ground_truth/invoices/` has a corresponding label in `ground_truth/labels/` with the same filename but `.json` extension.

Label format:
```json
{
  "invoice_id": "INV-2024-001",
  "vendor_name": "Samsung Electronics Co., Ltd.",
  "vendor_name_original": "삼성전자주식회사",
  "invoice_date": "2024-03-15",
  "due_date": "2024-04-15",
  "currency": "KRW",
  "subtotal": 1500000,
  "tax": 150000,
  "total": 1650000,
  "po_number": "PO-2024-0042",
  "payment_terms": "Net 30",
  "line_items": [
    {
      "description": "LED Display Panel 55-inch",
      "description_original": "LED 디스플레이 패널 55인치",
      "quantity": 10,
      "unit_price": 150000,
      "amount": 1500000
    }
  ],
  "language": "ko",
  "document_type": "invoice"
}
```

---

## Evaluation Metrics

`evaluate.py` scores extraction against ground truth and outputs:

```
---
field_accuracy:      0.7500
line_item_accuracy:  0.6000
amount_accuracy:     0.9000
date_accuracy:       0.8500
vendor_accuracy:     0.7000
exception_precision: 0.6000
exception_recall:    0.5000
overall_score:       0.7143
num_invoices:        20
num_correct_total:   85
num_fields_total:    120
```

**Primary metric: `overall_score`** (weighted average — higher is better).

Weights:
- field_accuracy: 0.30 (vendor, PO#, payment terms, etc.)
- line_item_accuracy: 0.20 (descriptions, quantities, unit prices)
- amount_accuracy: 0.25 (subtotal, tax, total — must be exact)
- date_accuracy: 0.10 (invoice date, due date)
- vendor_accuracy: 0.10 (vendor name matching)
- exception_precision + recall: 0.05 (detecting duplicates, mismatches)

---

## What You CAN Modify

### prompts.py
Everything is fair game:
- System prompts for field extraction
- Few-shot examples
- Chain-of-thought instructions
- Language-specific extraction hints (Korean, Japanese, English)
- Output format instructions (JSON schema)
- Multi-pass extraction strategies (extract once, verify, correct)
- Field-specific prompts (separate prompts for amounts vs. line items vs. vendor)

### rules.json
- Fuzzy matching thresholds for vendor names
- Date format patterns per language (Korean: 2024년 3월 15일, Japanese: 令和6年3月15日)
- Currency detection rules
- Duplicate detection rules (same vendor + date + amount = likely duplicate)
- Exception flagging thresholds (amount difference > X% = flag)
- PO matching rules

---

## What You CANNOT Modify

- `evaluate.py` — the scoring harness is fixed
- `extract.py` — the extraction pipeline is fixed (calls LLM with your prompts)
- `ground_truth/` — the labeled data is fixed
- `program.md` — this file is fixed
- Do NOT install new packages

---

## The Experiment Loop

LOOP FOREVER:

1. Look at the current state: branch, commit, recent results in results.tsv
2. Decide on an experiment: modify `prompts.py` and/or `rules.json`
3. `git commit -am "description of experiment"`
4. Run: `python evaluate.py > run.log 2>&1`
5. Read results: `grep "^overall_score:\|^field_accuracy:\|^amount_accuracy:" run.log`
6. If grep output is empty, the run crashed. Run `tail -n 50 run.log` to diagnose.
7. Record results in `results.tsv`
8. If `overall_score` improved → keep the commit, advance
9. If `overall_score` is equal or worse → `git reset --hard HEAD~1`, discard
10. Go to step 1

---

## Results TSV Format

Tab-separated, 6 columns:

```
commit	overall_score	field_accuracy	amount_accuracy	status	description
```

Example:
```
commit	overall_score	field_accuracy	amount_accuracy	status	description
a1b2c3d	0.7143	0.7500	0.9000	keep	baseline prompts
b2c3d4e	0.7500	0.7800	0.9200	keep	add Korean date format examples
c3d4e5f	0.7100	0.7200	0.8800	discard	switch to markdown output format
d4e5f6g	0.7650	0.8000	0.9200	keep	add few-shot Korean invoice example
e5f6g7h	0.0000	0.0000	0.0000	crash	invalid JSON in prompt template
```

---

## Experiment Ideas (Starting Points)

The agent should try these categories of improvements:

### Prompt Engineering
- Add few-shot examples for each language (Korean, Japanese, English)
- Add chain-of-thought: "First identify the language, then locate the total amount field..."
- Separate prompts per document section (header fields vs. line items vs. totals)
- Add explicit JSON schema with field descriptions
- Try different extraction orderings (amounts first, then vendor, then dates)

### Language-Specific
- Korean: Add common field label mappings (공급가액=subtotal, 세액=tax, 합계=total, 거래일자=date)
- Japanese: Add field label mappings (小計=subtotal, 税=tax, 合計=total, 請求日=date)
- Add currency detection hints (₩/원=KRW, ¥/円=JPY, $=USD)
- Handle mixed-language invoices (Korean vendor name + English product descriptions)

### Matching Rules
- Tune fuzzy matching threshold for vendor names (Korean vendor names have multiple romanizations)
- Add date format normalization patterns
- Add duplicate detection sensitivity
- Add PO number format patterns per vendor

### Robustness
- Handle scanned/rotated invoices (add prompt hints about OCR artifacts)
- Handle partial invoices (missing fields should return null, not hallucinate)
- Handle credit notes (negative amounts)
- Handle multi-page invoices

---

## Simplicity Criterion

All else being equal, simpler is better. A small accuracy improvement that adds 50 lines of complex prompt logic is not worth it. A simplification that maintains accuracy is always worth keeping.

---

## NEVER STOP

Once the experiment loop has begun, do NOT pause to ask the human if you should continue. The human might be asleep. You are autonomous. If you run out of ideas, re-read this file, look at which field types have the lowest accuracy, and focus experiments there. The loop runs until the human interrupts you.
