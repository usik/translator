# AP Invoice Datasets & Field Structure Research

---

## 1. Available Datasets

### English Invoice Datasets
| Dataset | Size | Format | Link |
|---------|------|--------|------|
| GokulRajaR/invoice-ocr-json | Medium | Images + structured JSON (vendor, date, total, line items) | [HuggingFace](https://huggingface.co/datasets/GokulRajaR/invoice-ocr-json) |
| katanaml-org/invoices-donut-data-v1 | 500 invoices | Annotated, fine-tuning ready | [HuggingFace](https://huggingface.co/datasets/katanaml-org/invoices-donut-data-v1) |
| mychen76/invoices-and-receipts_ocr_v1 | Mixed | Invoices + receipts with OCR output | [HuggingFace](https://huggingface.co/datasets/mychen76/invoices-and-receipts_ocr_v1) |
| parsee-ai/invoices-example | Small | Sample invoices for LLM extraction eval | [HuggingFace](https://huggingface.co/datasets/parsee-ai/invoices-example) |

### Korean Datasets
| Dataset | Size | Format | Link |
|---------|------|--------|------|
| HumynLabs/Korean_Receipts_Dataset | Unknown | Korean retail receipts, high-res, anonymized | [HuggingFace](https://huggingface.co/datasets/HumynLabs/Korean_Receipts_Dataset) |
| KORIE benchmark | Unknown | Korean receipt detection + OCR + info extraction | [Paper](https://www.mdpi.com/2227-7390/14/1/187) |
| katanaml/cord (CORD) | ~1000 | Consolidated receipt dataset (includes Korean) | [HuggingFace](https://huggingface.co/datasets/katanaml/cord) |

### Japanese Datasets
| Dataset | Size | Format | Link |
|---------|------|--------|------|
| tmfi/japanese-invoice-dqa | 6 samples | DQA format with tagged entities (bank, account, amounts) | [HuggingFace](https://huggingface.co/datasets/tmfi/japanese-invoice-dqa) |
| Japanese-Mobile-Receipt-OCR-1.3K | 1,300 images | 34,727 text annotations, mobile receipt photos | [Paper](https://www.techrxiv.org/users/955537/articles/1324642-japanese-mobile-receipt-ocr-1-3k) |

### Gap
No public Korean or Japanese **invoice** dataset exists (only receipts). Invoices differ from receipts — they have PO numbers, payment terms, line items with quantities, tax breakdowns, and multi-page layouts.

---

## 2. Korean Tax Invoice (세금계산서) Field Structure

Korean e-Tax Invoices are XML-based, digitally signed with PKI, and transmitted to NTS (국세청) HomeTax. A 24-digit approval number is issued upon acceptance. Must be stored for 5 years.

### Mandatory Fields
| Korean | English | Notes |
|--------|---------|-------|
| 공급자의 사업자등록번호 | Supplier business registration number | 10-digit format: XXX-XX-XXXXX |
| 공급자 상호 | Supplier company name | |
| 공급받는자 사업자등록번호 | Buyer business registration number | Or 주민등록번호 if individual |
| 공급가액 | Supply value (subtotal) | Before VAT |
| 부가가치세액 | VAT amount | 10% of supply value |
| 작성일자 | Date of preparation | YYYY-MM-DD or YYYY년 MM월 DD일 |

### Optional Fields
| Korean | English |
|--------|---------|
| 공급자 주소 | Supplier address |
| 공급받는자 상호 | Buyer company name |
| 공급받는자 성명 | Buyer representative name |
| 공급받는자 주소 | Buyer address |
| 품목 | Item/service description |
| 단가 | Unit price |
| 수량 | Quantity |
| 공급일자 | Delivery/supply date |
| 비고 | Remarks |

### Common Additional Fields (seen in practice)
| Korean | English |
|--------|---------|
| 합계금액 | Total amount (subtotal + VAT) |
| 승인번호 | Approval number (24-digit, issued by NTS) |
| 이메일 | Email address |
| 업태 | Business type/category |
| 종목 | Business item/sector |
| 대표자 | Representative name |

### References
- [ABK Korea - Korean e-Tax Invoices](https://www.abk-korea.com/en/publications/korean-etax-invoices)
- [NTS English Forms](https://www.nts.go.kr/english/cm/cntnts/cntntsView.do?mi=10791&cntntsId=8664)
- [Bolta - South Korea e-Tax Invoice System](https://bolta.io/resources/south-korea-e-tax-invoice-system)

---

## 3. Japanese Qualified Invoice (適格請求書) Field Structure

Since October 1, 2023, Japan's Qualified Invoice System (インボイス制度 / 適格請求書等保存方式) requires registered businesses to issue qualified invoices for buyers to claim input tax credits.

### Required Fields
| Japanese | English | Notes |
|----------|---------|-------|
| 適格請求書発行事業者の氏名 | Issuer name | Company or individual |
| 登録番号 | Registration number | T + 13 digits (e.g., T1234567890123) |
| 取引年月日 | Transaction date | |
| 取引内容 | Transaction details | Item/service descriptions |
| 軽減税率の対象である旨 | Reduced tax rate indicator | Mark items at 8% vs standard 10% |
| 税率ごとの合計額 | Total per tax rate | Separate totals for 8% and 10% items |
| 税率ごとの消費税額 | Consumption tax per rate | |
| 書類の交付を受ける事業者の氏名 | Recipient name | |

### Common Additional Fields (seen in practice)
| Japanese | English |
|----------|---------|
| 請求書番号 | Invoice number |
| 支払期日 | Payment due date |
| 振込先 | Bank transfer details |
| 銀行名 | Bank name |
| 支店名 | Branch name |
| 口座番号 | Account number |
| 口座種類 | Account type (普通/当座) |
| 小計 | Subtotal |
| 合計 | Grand total |
| 備考 | Remarks |

### Tax Rate Categories
- **Standard rate**: 10% (標準税率)
- **Reduced rate**: 8% (軽減税率) — applies to food/beverages and newspaper subscriptions

### References
- [HLS Japan - Invoice System Guide](https://hls-global.jp/en/2023/05/17/introduction-to-the-new-japanese-invoice-system-implementation-qualified-invoice-issuers-2/)
- [Japan NTA - Invoice System](https://www.nta.go.jp/taxes/shiraberu/zeimokubetsu/shohi/keigenzeiritsu/invoice_about.htm)
- [EU-Japan Centre - Qualified Invoice System](https://www.eu-japan.eu/qualified-invoice-system)

---

## 4. Industry Benchmarks (2025-2026)

| Metric | Value |
|--------|-------|
| OCR-only accuracy | 85-95% (clean invoices) |
| AI + ML accuracy | ~99% (learns layouts) |
| Manual processing time | 10-30 min per invoice |
| AI processing time | 1-2 seconds per invoice |
| Best-in-class cost | $2.78 per invoice |
| Average cost | $12.88 per invoice |
| Full automation adoption | Only 8% of finance teams |
| Partial/manual | 60-64% of finance teams |

Source: [Parseur - AI Invoice Processing Benchmarks](https://parseur.com/blog/ai-invoice-processing-benchmarks)

---

## 5. Realistic Data Strategy

### Phase 1: Bootstrap (before pilot clients)
1. **English**: Use GokulRajaR/invoice-ocr-json or katanaml invoices as-is for English baseline
2. **Korean**: Generate 20-30 synthetic 세금계산서 using the known field structure above
3. **Japanese**: Generate 20-30 synthetic 適格請求書 using the known field structure above
4. Use Korean receipt dataset (HumynLabs) for OCR robustness testing

### Phase 2: Real data (from pilot clients)
1. Collect real invoices from first 3 pilot clients
2. Manually label correct extracted fields → becomes proprietary ground truth
3. This is the most valuable data — real-world layouts, scan quality, mixed languages

### Phase 3: Scale
1. Every human correction becomes training data
2. Autoresearch loop continuously improves prompts against growing ground truth set
3. Vendor-specific patterns accumulate (Samsung invoices always look like X, etc.)
