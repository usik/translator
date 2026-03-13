"""
Scoring harness for invoice extraction autoresearch.

Usage:
    python evaluate.py [--verbose]

Compares extraction results against ground truth labels and computes
a weighted overall score.
"""
from __future__ import annotations

import argparse
import json
import sys
from difflib import SequenceMatcher
from pathlib import Path

from extract import extract_invoice

GROUND_TRUTH_DIR = Path(__file__).parent / "ground_truth"
INVOICES_DIR = GROUND_TRUTH_DIR / "invoices"
LABELS_DIR = GROUND_TRUTH_DIR / "labels"

# Scoring weights (must sum to 1.0)
WEIGHTS = {
    "amount_accuracy": 0.30,
    "field_accuracy": 0.25,
    "line_item_accuracy": 0.25,
    "vendor_accuracy": 0.10,
    "date_accuracy": 0.10,
}


def fuzzy_match(a: str | None, b: str | None) -> float:
    """Fuzzy string match ratio (0.0-1.0)."""
    if a is None and b is None:
        return 1.0
    if a is None or b is None:
        return 0.0
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()


def exact_number_match(a: float | None, b: float | None, tolerance: float = 0.01) -> float:
    """Check if two numbers match within tolerance."""
    if a is None and b is None:
        return 1.0
    if a is None or b is None:
        return 0.0
    return 1.0 if abs(a - b) <= tolerance else 0.0


def score_amounts(extracted: dict, label: dict) -> float:
    """Score subtotal, tax, total accuracy."""
    scores = []
    for field in ("subtotal", "tax", "total"):
        scores.append(exact_number_match(extracted.get(field), label.get(field)))
    return sum(scores) / len(scores) if scores else 0.0


def score_fields(extracted: dict, label: dict) -> float:
    """Score vendor, invoice number, dates, currency."""
    scores = []
    # Currency — exact match
    scores.append(1.0 if (extracted.get("currency") or "").upper() == (label.get("currency") or "").upper() else 0.0)
    # Invoice number — exact match (stripped)
    ext_num = (extracted.get("invoice_number") or "").strip()
    lab_num = (label.get("invoice_number") or "").strip()
    if ext_num or lab_num:
        scores.append(1.0 if ext_num == lab_num else 0.0)
    # Language
    scores.append(1.0 if (extracted.get("language") or "").lower() == (label.get("language") or "").lower() else 0.0)
    return sum(scores) / len(scores) if scores else 0.0


def score_line_items(extracted: dict, label: dict) -> float:
    """Score line item extraction accuracy."""
    ext_items = extracted.get("line_items", [])
    lab_items = label.get("line_items", [])
    if not lab_items:
        return 1.0 if not ext_items else 0.5  # No items expected

    if not ext_items:
        return 0.0

    # Match by index (simple approach)
    n = max(len(ext_items), len(lab_items))
    total = 0.0
    for i in range(n):
        if i >= len(ext_items) or i >= len(lab_items):
            continue  # Missing item = 0 score for that slot
        ext = ext_items[i]
        lab = lab_items[i]
        item_score = 0.0
        item_score += exact_number_match(ext.get("amount"), lab.get("amount")) * 0.4
        item_score += exact_number_match(ext.get("quantity"), lab.get("quantity")) * 0.2
        item_score += exact_number_match(ext.get("unit_price"), lab.get("unit_price")) * 0.2
        item_score += fuzzy_match(ext.get("description"), lab.get("description")) * 0.2
        total += item_score

    return total / n


def score_vendor(extracted: dict, label: dict) -> float:
    """Score vendor name accuracy (fuzzy for CJK romanization)."""
    scores = []
    scores.append(fuzzy_match(extracted.get("vendor_name"), label.get("vendor_name")))
    if label.get("vendor_name_original"):
        scores.append(fuzzy_match(extracted.get("vendor_name_original"), label.get("vendor_name_original")))
    return sum(scores) / len(scores) if scores else 0.0


def score_dates(extracted: dict, label: dict) -> float:
    """Score date extraction accuracy."""
    scores = []
    for field in ("invoice_date", "due_date"):
        ext_val = (extracted.get(field) or "").strip()
        lab_val = (label.get(field) or "").strip()
        if not lab_val:
            continue  # Don't penalize if ground truth has no date
        scores.append(1.0 if ext_val == lab_val else 0.0)
    return sum(scores) / len(scores) if scores else 1.0


def evaluate_single(extracted: dict, label: dict) -> dict[str, float]:
    """Evaluate a single invoice against its label."""
    return {
        "amount_accuracy": score_amounts(extracted, label),
        "field_accuracy": score_fields(extracted, label),
        "line_item_accuracy": score_line_items(extracted, label),
        "vendor_accuracy": score_vendor(extracted, label),
        "date_accuracy": score_dates(extracted, label),
    }


def compute_weighted_score(metrics: dict[str, float]) -> float:
    """Compute weighted overall score."""
    return sum(metrics[k] * WEIGHTS[k] for k in WEIGHTS)


def main():
    parser = argparse.ArgumentParser(description="Evaluate invoice extraction accuracy")
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args()

    if not INVOICES_DIR.exists() or not LABELS_DIR.exists():
        print("ERROR: ground_truth/invoices/ and ground_truth/labels/ must exist")
        sys.exit(1)

    invoice_files = sorted(INVOICES_DIR.iterdir())
    if not invoice_files:
        print("ERROR: No invoice files found in ground_truth/invoices/")
        sys.exit(1)

    all_scores: list[float] = []
    all_metrics: list[dict[str, float]] = []

    for invoice_file in invoice_files:
        label_file = LABELS_DIR / f"{invoice_file.stem}.json"
        if not label_file.exists():
            print(f"SKIP: No label for {invoice_file.name}")
            continue

        with open(label_file) as f:
            label = json.load(f)

        try:
            extracted = extract_invoice(invoice_file)
        except Exception as e:
            print(f"FAIL: {invoice_file.name} — {e}")
            all_scores.append(0.0)
            continue

        metrics = evaluate_single(extracted, label)
        weighted = compute_weighted_score(metrics)
        all_scores.append(weighted)
        all_metrics.append(metrics)

        if args.verbose:
            print(f"\n{invoice_file.name}: {weighted:.3f}")
            for k, v in metrics.items():
                print(f"  {k}: {v:.3f}")

    if not all_scores:
        print("No invoices evaluated")
        sys.exit(1)

    avg_score = sum(all_scores) / len(all_scores)
    print(f"\nOverall score: {avg_score:.4f} ({len(all_scores)} invoices)")

    if all_metrics:
        avg_metrics = {k: sum(m[k] for m in all_metrics) / len(all_metrics) for k in WEIGHTS}
        for k, v in avg_metrics.items():
            print(f"  {k}: {v:.3f} (weight: {WEIGHTS[k]})")


if __name__ == "__main__":
    main()
