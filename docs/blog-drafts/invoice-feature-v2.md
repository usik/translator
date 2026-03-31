# Xenith Invoice Feature — Blog Post (EN / KO / JA)

---

## SEO Metadata

### English
- **Title tag**: Translate & Extract Korean, Japanese, and Chinese Invoices Instantly | Xenith
- **Meta description**: Upload Korean 세금계산서, Japanese 適格請求書, or Chinese 发票 and get a structured, translated Excel report in seconds. Free, no account needed. Supports PDF, images, HWPX, DOCX, and batch ZIP uploads.
- **Keywords**: Korean invoice translation, Japanese invoice processing, CJK invoice OCR, 세금계산서 translation, 適格請求書 processing, invoice to Excel, foreign invoice data entry, invoice OCR, batch invoice processing, HWPX invoice

### Korean (한국어)
- **Title tag**: 세금계산서 자동 추출 & 번역 — 외국어 청구서를 엑셀로 변환 | Xenith
- **Meta description**: 한국어 세금계산서, 일본어 適格請求書, 중국어 발票를 업로드하면 번역된 엑셀 보고서가 자동으로 생성됩니다. 무료, 회원가입 불필요. PDF, 이미지, HWPX, DOCX, ZIP 일괄 처리 지원.
- **Keywords**: 세금계산서 번역, 외국어 세금계산서 처리, 청구서 OCR, 엑셀 변환, 세금계산서 엑셀, HWPX 인보이스, 청구서 자동 입력, 일괄 처리

### Japanese (日本語)
- **Title tag**: 適格請求書・韓国語請求書を自動翻訳＆データ抽出 | Xenith
- **Meta description**: 韓国語の세금계산서、日本語の適格請求書、中国語の发票をアップロードするだけで、翻訳済みのExcelレポートを自動生成。無料、アカウント不要。PDF・画像・HWPX・DOCX・ZIPバッチ処理対応。
- **Keywords**: 適格請求書 翻訳, 請求書 OCR, インボイス処理, エクセル変換, 韓国語 請求書 翻訳, 請求書データ抽出, バッチ処理, CJK請求書

---

# [English] Turn Any Foreign Invoice Into a Structured Report — Instantly

> **TL;DR**
>
> - Upload Korean 세금계산서, Japanese 適格請求書, or Chinese 增值税发票 in any file format — PDF, image, HWPX, DOCX, or a batch ZIP.
> - An AI extractor pulls every field (vendor, amounts, tax, line items) and a second AI accountant validates the math and tax rates.
> - Get a clean Excel or CSV report back in seconds. No account, no sign-up, currently free.
> - Xenith is the only invoice tool that supports HWPX (Korean 한글) files.
> - Batch processing: ZIP up a month of invoices and get one consolidated report.

[Try it free at tryxenith.com/invoice ->](https://tryxenith.com/invoice)

---

## Table of Contents

- [The problem no one has solved](#the-problem-no-one-has-solved)
- [What Xenith Invoice does](#what-xenith-invoice-does)
- [How to use it](#how-to-use-it)
- [What you get in the report](#what-you-get-in-the-report)
- [Supported invoice types and languages](#supported-invoice-types-and-languages)
- [Batch processing](#batch-processing)
- [Privacy and security](#privacy-and-security)
- [Pricing](#pricing)
- [Roadmap](#roadmap)
- [FAQ](#frequently-asked-questions)

---

## The problem no one has solved

If your company does business across Asia, you know the pain. A stack of Korean 세금계산서 arrives from a vendor in Seoul. A Japanese supplier sends 適格請求書 in PDF. A Chinese partner emails 增值税发票 as scanned images.

Now your accounting team needs to get all of that into a spreadsheet. The options are not great.

- **Manual data entry.** Someone stares at characters they cannot read and types numbers one field at a time.
- **Hire a native speaker.** Companies routinely hire bilingual staff specifically to read foreign receipts.
- **Use OCR tools that don't understand CJK.** Most invoice OCR tools were built for English documents. They can read characters, but they do not understand the structure of a Korean tax invoice or the required fields of a Japanese qualified invoice.

> **📊 By the numbers:**
>
> - Industry average cost: **$15 per invoice** and **14.6 days** of processing time.
> - **86%** of small and medium businesses still enter invoice data manually.
> - **39%** of those invoices contain errors.
> - The AI invoice processing market is projected to reach **$47 billion by 2034**.

> **💬 What real users are saying:**
>
> *"We hired a bilingual staff member specifically to read Korean and Japanese receipts. It's a full-time job just during month-end close."*
> — SAP Concur community forum

For CJK documents specifically, there has been no good answer. Until now.

---

## What Xenith Invoice does

Xenith takes your foreign invoices — in any format, in any language — and returns a clean, structured expense report. Here is what happens under the hood:

**1. OCR extraction.** Your file is read using Mistral's document OCR. This works on PDFs, scanned images (JPG, PNG), HWPX (Korean 한글 format), and DOCX files.

**2. AI field extraction (Extractor Agent).** A specialized AI agent reads the OCR output and extracts every structured field: vendor name (translated and in the original script), invoice number, date, due date, currency, subtotal, tax, total, and every line item with description, quantity, unit price, and amount.

**3. Validation (Accountant Agent).** A second AI agent — acting as a senior CPA — reviews every extracted invoice. It cross-checks the math, verifies tax rates (10% VAT for Korean invoices, 8% or 10% consumption tax for Japanese invoices), detects potential duplicates, and flags anomalies.

**4. Report generation.** The validated data is compiled into an Excel workbook (or CSV) and returned to you as a download.

> **⚡ Key takeaway:** The entire process takes seconds, not days.

---

## How to use it

### Step 1 — Go to tryxenith.com/invoice

No account required. No sign-up. Just open the page.

### Step 2 — Upload your invoice files

Drag and drop files into the upload zone, or click to browse. You can upload:

- **PDF** files (native or scanned)
- **Images** — JPG, PNG (photographed or scanned invoices)
- **HWPX** — Korean 한글 documents (Xenith is the only tool that supports this)
- **DOCX** — Word documents
- **ZIP** — A zip archive containing multiple invoices of any supported type

Each file can be up to 20 MB. Upload as many files as you need.

### Step 3 — Select your output format

Choose between:

- **Excel (.xlsx)** — Includes an Invoices sheet and a separate Flags sheet highlighting validation issues. Recommended for most users.
- **CSV (.csv)** — A flat file with one row per invoice. Good for importing into other systems.

### Step 4 — Click "Generate Report"

Xenith processes every file in parallel. You will see a loading indicator while the AI agents work. When processing completes, your report downloads automatically.

---

## What you get in the report

### Invoices sheet

Each row is one invoice with the following columns:

| Column | Description |
|--------|-------------|
| **File** | Original filename (e.g., `invoice_march_2026.pdf`) |
| **Vendor** | Vendor name, translated to English (e.g., "Seoul Tech Solutions") |
| **Vendor (Original)** | Vendor name in original script (e.g., "서울테크솔루션") |
| **Invoice #** | Invoice or receipt number |
| **Date** | Invoice date in ISO format (YYYY-MM-DD) |
| **Due Date** | Payment due date, if present |
| **Currency** | 3-letter ISO code (KRW, JPY, USD, EUR, CNY, etc.) |
| **Subtotal** | Amount before tax |
| **Tax** | Tax amount |
| **Total** | Total amount |
| **Language** | Detected invoice language (ko, ja, zh, en, etc.) |
| **Confidence** | AI confidence score (0.0 to 1.0) |
| **Notes** | Accountant agent notes — corrections, concerns, or context |

### Flags sheet (Excel only)

Each row is a validation issue:

| Column | Description |
|--------|-------------|
| **Invoice #** | Index of the flagged invoice |
| **File** | Source filename |
| **Vendor** | Vendor name |
| **Type** | `math_error`, `tax_mismatch`, `duplicate`, `anomaly`, or `low_confidence` |
| **Severity** | `critical` (red), `warning` (yellow), or `info` |
| **Message** | Human-readable description of the issue |

Critical flags are highlighted in red. Warnings are highlighted in yellow. This gives your accounting team immediate visibility into which invoices need a second look.

> **Ready to see it in action?** Upload your first invoice and get a structured report in seconds — no sign-up required.
>
> [Try Xenith Invoice free ->](https://tryxenith.com/invoice)

---

## 📄 Supported invoice types and languages

### Invoice types

- **Korean 세금계산서** (Tax Invoice) — Extracts 공급자, 공급받는자, 공급가액, 세액, 합계, 품목, 사업자등록번호, and all line items. Validates 10% VAT rate.
- **Japanese 適格請求書** (Qualified Invoice) — Extracts 発行者, 取引日, 品名, 数量, 単価, 金額, 消費税, 合計, 登録番号. Validates 8%/10% consumption tax rates.
- **Chinese 增值税发票** (VAT Invoice) — Extracts 销售方, 购买方, 金额, 税额, 价税合计.
- **General invoices and receipts** — Any standard invoice or receipt in any language.

### File formats

PDF, JPG, PNG, DOCX, HWPX, and ZIP archives.

> **💡 Only on Xenith:**
>
> HWPX support is unique to Xenith. Korean government agencies, legal firms, and businesses commonly use 한글 (HWP/HWPX) for official documents including tax invoices. **No other invoice processing tool can read this format.**

---

## Batch processing

Got a month's worth of invoices from multiple vendors? Put them all in a ZIP file. Xenith unpacks the archive, processes each supported file in parallel, and returns a single consolidated report with every invoice on one sheet.

This is particularly useful for:

- Monthly expense reconciliation across multiple APAC vendors
- Audit preparation — process an entire quarter's invoices in one batch
- Travel expense reports with receipts in multiple languages

---

## 🔒 Privacy and security

> **🛡️ Your data stays yours:**
>
> - **No storage.** Files are processed in memory and never written to disk.
> - **Encrypted transit.** All uploads use TLS encryption.
> - **Auto-deleted.** Files are purged from memory as soon as your report is generated.
> - **No account required.** We do not collect your email or any personal information.

---

## Pricing

**Xenith Invoice is currently free.** No account needed. No usage limits beyond rate limiting (10 requests per minute).

We plan to introduce per-invoice pricing in the future — not per-seat subscriptions. When we do, we expect pricing around **$0.50–1.00 per invoice**, which is still a fraction of the $15 industry average for manual processing.

---

## 🗺️ Roadmap

The following features are in active development. Here is what is coming:

| Feature | Status | Target |
|---------|--------|--------|
| **QuickBooks and Xero integration** — Push extracted invoices directly into your accounting software as bills | Planned | Q3 2026 |
| **Korean 세금계산서 compliance validation** — Full NTS requirements, business registration number verification | In development | Q2 2026 |
| **Japanese 適格請求書 compliance validation** — JCT registration number verification and itemized tax rate validation | In development | Q2 2026 |
| **Chinese 增值税发票 validation** — VAT type detection and required field checks | Planned | Q3 2026 |
| **Duplicate detection across batches** — Fuzzy matching across languages and time periods | Planned | Q3 2026 |
| **Auto-categorization** — GL code prediction based on vendor and line item descriptions | Planned | Q4 2026 |
| **Email inbox integration** — Forward invoices to a dedicated email address for automatic processing | Planned | Q4 2026 |

Want to influence the roadmap? [Let us know what matters most](mailto:support@tryxenith.com).

---

## Frequently Asked Questions

### What file formats does Xenith Invoice support?

Xenith Invoice supports PDF (native and scanned), JPG, PNG, DOCX, HWPX (Korean 한글 format), and ZIP archives containing any combination of these formats. HWPX support is unique to Xenith — no other invoice tool can read Korean 한글 files.

### Is Xenith Invoice free?

Yes, Xenith Invoice is currently completely free. No account creation or sign-up is required. The only limit is rate limiting at 10 requests per minute. We plan to introduce per-invoice pricing in the future at approximately $0.50–1.00 per invoice.

### How accurate is the AI extraction?

Xenith uses a two-agent system: an Extractor Agent pulls structured fields from the OCR output, and an Accountant Agent validates the math, tax rates, and consistency. Each invoice receives a confidence score (0.0–1.0), and any issues are flagged on a dedicated Flags sheet so your team knows exactly which invoices need review.

### Does Xenith store my invoice files?

No. Files are processed entirely in memory and never written to disk. All uploads use TLS encryption, and files are purged from memory as soon as your report is generated. No account or personal information is required.

### Can I process multiple invoices at once?

Yes. You can upload multiple files individually, or put them all in a ZIP archive. Xenith unpacks the archive, processes every supported file in parallel, and returns a single consolidated Excel or CSV report with all invoices on one sheet.

### What languages are supported?

Xenith supports invoices in any language, with specialized extraction for Korean (세금계산서), Japanese (適格請求書), and Chinese (增值税发票). The AI extractor translates vendor names and field labels to English while preserving the original script in a separate column.

---

## Start processing your invoices today

Stop spending hours on manual data entry for foreign invoices. Xenith turns any CJK invoice into a structured, validated Excel report in seconds.

**No account. No sign-up. Free.**

[**Start processing invoices at tryxenith.com/invoice ->**](https://tryxenith.com/invoice)

---
---

# [한국어] 외국어 세금계산서, 엑셀 보고서로 즉시 변환

> **TL;DR (핵심 요약)**
>
> - 한국어 세금계산서, 일본어 適格請求書, 중국어 增值税发票를 PDF, 이미지, HWPX, DOCX, ZIP 등 어떤 형식으로든 업로드하세요.
> - AI 추출기가 모든 필드(공급자, 금액, 세액, 품목)를 추출하고, 두 번째 AI 회계사가 산술과 세율을 검증합니다.
> - 깔끔한 엑셀 또는 CSV 보고서를 수 초 만에 받아보세요. 계정 불필요, 현재 무료.
> - Xenith는 HWPX(한글) 파일을 지원하는 유일한 인보이스 도구입니다.
> - 일괄 처리: 한 달치 청구서를 ZIP으로 묶어 업로드하면 하나의 통합 보고서로 받을 수 있습니다.

[tryxenith.com/invoice에서 무료로 사용해 보세요 ->](https://tryxenith.com/invoice)

---

## 목차

- [아직 아무도 해결하지 못한 문제](#아직-아무도-해결하지-못한-문제)
- [Xenith Invoice가 하는 일](#xenith-invoice가-하는-일)
- [사용 방법](#사용-방법)
- [보고서에 포함되는 항목](#보고서에-포함되는-항목)
- [HWPX 지원 — Xenith만의 차별점](#hwpx-지원--xenith만의-차별점)
- [일괄 처리 (배치)](#일괄-처리-배치)
- [개인정보 및 보안](#개인정보-및-보안)
- [가격](#가격)
- [로드맵](#로드맵)
- [자주 묻는 질문](#자주-묻는-질문)

---

## 아직 아무도 해결하지 못한 문제

해외 거래처와 일하다 보면 피할 수 없는 문제가 있습니다. 일본 거래처에서 適格請求書가 PDF로 도착하고, 중국 파트너가 增值税发票를 스캔 이미지로 보내옵니다.

반대로, 한국어 세금계산서를 해외 본사에 보고해야 하는 상황도 있습니다. 이 모든 서류를 엑셀 한 장에 정리해야 하는 건 경리팀의 몫입니다.

현실적인 선택지는 제한적입니다:

- **수작업 입력.** 읽을 수 없는 외국어를 보면서 숫자를 하나하나 옮겨 적습니다.
- **원어민 채용.** 외국어 영수증을 읽기 위해 이중 언어 직원을 별도로 고용하는 회사가 적지 않습니다.
- **한글(HWPX)을 지원하지 않는 OCR 도구.** 대부분의 인보이스 OCR 도구는 영문 문서 기준으로 만들어져 있습니다. 한국어 세금계산서의 구조나 필수 항목을 이해하지 못합니다.

> **📊 숫자로 보는 현실:**
>
> - 업계 평균 청구서 1건당 처리 비용: **$15**, 처리 기간: **14.6일**
> - 중소기업의 **86%**가 여전히 청구서를 수작업으로 입력
> - 입력된 청구서의 **39%**에 오류 포함
> - AI 인보이스 처리 시장은 2034년까지 **470억 달러** 규모로 성장 전망

> **💬 현장의 목소리:**
>
> *"APAC 영수증 처리를 위한 자동화 솔루션이 없어서 원어민을 고용하고 있습니다."*
> — SAP Concur 커뮤니티 포럼

CJK(한중일) 문서에 대한 제대로 된 솔루션은 없었습니다. 지금까지는.

---

## Xenith Invoice가 하는 일

Xenith는 어떤 형식, 어떤 언어의 청구서든 받아서 깔끔한 엑셀 보고서로 변환합니다. 내부적으로 다음 과정이 진행됩니다:

**1. OCR 추출.** Mistral 문서 OCR을 사용하여 파일을 읽습니다. PDF, 스캔 이미지(JPG, PNG), HWPX(한글 파일), DOCX 모두 지원합니다.

**2. AI 필드 추출 (Extractor Agent).** 전문 AI 에이전트가 OCR 결과를 분석하여 모든 구조화된 필드를 추출합니다. 공급자명(번역 + 원문), 세금계산서 번호, 발행일, 만기일, 통화, 공급가액, 세액, 합계, 그리고 각 품목의 품명, 수량, 단가, 금액까지.

**3. 검증 (Accountant Agent).** 두 번째 AI 에이전트가 공인회계사 역할로 모든 청구서를 검토합니다. 산술 검증, 세율 확인(한국 세금계산서 10% VAT, 일본 適格請求書 8%/10% 소비세), 중복 감지, 이상치 플래그 처리를 수행합니다.

**4. 보고서 생성.** 검증된 데이터가 Excel 또는 CSV 파일로 컴파일되어 다운로드됩니다.

> **⚡ 핵심:** 전체 과정이 수 초 안에 완료됩니다. 수 일이 아닙니다.

---

## 사용 방법

### 1단계 — tryxenith.com/invoice 접속

회원가입 불필요. 계정 생성 없이 바로 사용할 수 있습니다.

### 2단계 — 청구서 파일 업로드

파일을 드래그 앤 드롭하거나 클릭하여 선택합니다. 지원 형식:

- **PDF** — 텍스트 기반 또는 스캔된 PDF
- **이미지** — JPG, PNG (촬영하거나 스캔한 청구서)
- **HWPX** — 한글 문서 (Xenith만 지원하는 형식)
- **DOCX** — Word 문서
- **ZIP** — 여러 청구서를 담은 압축 파일

파일당 최대 20MB. 필요한 만큼 업로드하세요.

### 3단계 — 출력 형식 선택

- **Excel (.xlsx)** — 인보이스 시트와 검증 플래그 시트가 포함됩니다. 대부분의 사용자에게 추천합니다.
- **CSV (.csv)** — 청구서당 한 행의 플랫 파일. 다른 시스템으로 가져올 때 유용합니다.

### 4단계 — "보고서 생성" 클릭

Xenith가 모든 파일을 병렬로 처리합니다. AI 에이전트가 작업하는 동안 로딩 표시가 나타나고, 처리가 완료되면 보고서가 자동으로 다운로드됩니다.

---

## 보고서에 포함되는 항목

### 인보이스 시트

각 행이 하나의 청구서이며, 다음 열이 포함됩니다:

| 열 | 설명 |
|---|------|
| **File** | 원본 파일명 |
| **Vendor** | 공급자명 (영문 번역) |
| **Vendor (Original)** | 공급자명 (원문, 예: 서울테크솔루션) |
| **Invoice #** | 세금계산서/청구서 번호 |
| **Date** | 발행일 (YYYY-MM-DD) |
| **Due Date** | 지급 기한 |
| **Currency** | 통화 코드 (KRW, JPY, USD 등) |
| **Subtotal** | 공급가액 |
| **Tax** | 세액 |
| **Total** | 합계 금액 |
| **Language** | 감지된 언어 (ko, ja, zh, en 등) |
| **Confidence** | AI 신뢰도 점수 (0.0~1.0) |
| **Notes** | 회계사 에이전트 메모 — 수정 사항, 우려 사항 등 |

### 플래그 시트 (Excel 전용)

| 열 | 설명 |
|---|------|
| **Type** | `math_error` (산술 오류), `tax_mismatch` (세율 불일치), `duplicate` (중복 의심), `anomaly` (이상치), `low_confidence` (낮은 신뢰도) |
| **Severity** | `critical` (빨간색), `warning` (노란색), `info` (정보) |
| **Message** | 문제에 대한 설명 |

> **직접 확인해 보세요.** 첫 번째 청구서를 업로드하고 수 초 만에 구조화된 보고서를 받아보세요 — 회원가입 불필요.
>
> [Xenith Invoice 무료 사용하기 ->](https://tryxenith.com/invoice)

---

## 💡 HWPX 지원 — Xenith만의 차별점

> **이것은 Xenith만 가능합니다:**
>
> 한국 정부 기관, 법률 사무소, 기업에서 공식 문서에 한글(HWP/HWPX)을 널리 사용합니다. 세금계산서도 HWPX로 작성되는 경우가 적지 않습니다. **다른 어떤 인보이스 처리 도구도 이 형식을 지원하지 않습니다.**

Xenith는 HWPX 파일에서 직접 텍스트를 추출하므로 별도의 변환 과정 없이 바로 처리할 수 있습니다.

---

## 일괄 처리 (배치)

한 달치 청구서가 쌓여 있다면 ZIP 파일 하나에 담아 업로드하세요. Xenith가 압축을 풀고, 지원되는 모든 파일을 병렬로 처리한 후, 하나의 통합 보고서로 반환합니다.

활용 사례:

- 여러 APAC 거래처의 월별 경비 정산
- 감사 준비 — 분기별 청구서를 한 번에 처리
- 여러 언어가 섞인 출장 경비 보고서

---

## 🔒 개인정보 및 보안

> **🛡️ 고객의 데이터는 고객의 것입니다:**
>
> - **파일 미저장.** 파일은 메모리에서만 처리되며 디스크에 기록되지 않습니다.
> - **암호화 전송.** 모든 업로드에 TLS 암호화가 적용됩니다.
> - **자동 삭제.** 보고서 생성 즉시 메모리에서 파일이 삭제됩니다.
> - **계정 불필요.** 이메일이나 개인 정보를 수집하지 않습니다.

---

## 가격

**Xenith Invoice는 현재 무료입니다.** 계정 없이, 사용량 제한 없이 이용할 수 있습니다(분당 10건 요청 제한).

향후 청구서 건당 과금 모델을 도입할 예정이며, 건당 **$0.50~1.00** 수준이 될 것으로 예상합니다. 수작업 처리 비용 $15와 비교하면 극히 일부입니다.

---

## 🗺️ 로드맵

다음 기능은 활발히 개발 중입니다:

| 기능 | 상태 | 목표 시기 |
|------|------|-----------|
| **QuickBooks / Xero 연동** — 추출된 청구서를 회계 소프트웨어에 직접 전송 | 계획됨 | 2026년 Q3 |
| **세금계산서 규정 준수 검증** — 사업자등록번호 확인, 필수 항목 검증, 국세청 기준 준수 | 개발 중 | 2026년 Q2 |
| **適格請求書 규정 준수 검증** — JCT 등록번호 확인, 항목별 세율 검증 | 개발 중 | 2026년 Q2 |
| **增值税发票 검증** — VAT 유형 감지 및 필수 항목 검증 | 계획됨 | 2026년 Q3 |
| **배치 간 중복 감지** — 언어와 기간을 넘나드는 퍼지 매칭 | 계획됨 | 2026년 Q3 |
| **자동 분류** — 거래처 및 품목 기반 GL 코드 예측 | 계획됨 | 2026년 Q4 |
| **이메일 연동** — 전용 이메일 주소로 청구서를 전달하면 자동 처리 | 계획됨 | 2026년 Q4 |

로드맵에 의견을 반영하고 싶다면? [가장 중요한 기능을 알려주세요](mailto:support@tryxenith.com).

---

## 자주 묻는 질문

### Xenith Invoice는 어떤 파일 형식을 지원하나요?

PDF(텍스트 기반 및 스캔), JPG, PNG, DOCX, HWPX(한글 형식), 그리고 이러한 형식을 조합한 ZIP 아카이브를 지원합니다. HWPX 지원은 Xenith만의 고유한 기능입니다. 다른 어떤 인보이스 도구도 한글 파일을 읽을 수 없습니다.

### Xenith Invoice는 무료인가요?

네, 현재 완전 무료입니다. 계정 생성이나 가입이 필요하지 않습니다. 유일한 제한은 분당 10건의 요청 제한입니다. 향후 건당 약 $0.50~1.00 수준의 과금 모델을 도입할 예정입니다.

### AI 추출 정확도는 어느 정도인가요?

Xenith는 이중 에이전트 시스템을 사용합니다. 추출 에이전트(Extractor Agent)가 OCR 결과에서 구조화된 필드를 추출하고, 회계 에이전트(Accountant Agent)가 산술, 세율, 일관성을 검증합니다. 각 청구서에 신뢰도 점수(0.0~1.0)가 부여되며, 문제가 있는 항목은 별도의 플래그 시트에 표시됩니다.

### Xenith가 제 청구서 파일을 저장하나요?

아니요. 파일은 전적으로 메모리에서 처리되며 디스크에 기록되지 않습니다. 모든 업로드에 TLS 암호화가 적용되고, 보고서 생성이 완료되면 즉시 메모리에서 삭제됩니다. 계정이나 개인 정보는 필요하지 않습니다.

### 여러 청구서를 한꺼번에 처리할 수 있나요?

네. 개별 파일을 여러 개 업로드하거나, 모든 파일을 ZIP 아카이브에 담아 업로드할 수 있습니다. Xenith가 아카이브를 풀고, 지원되는 모든 파일을 병렬로 처리한 후, 모든 청구서가 하나의 시트에 포함된 통합 Excel 또는 CSV 보고서를 반환합니다.

### 어떤 언어를 지원하나요?

Xenith는 모든 언어의 청구서를 지원하며, 한국어(세금계산서), 일본어(適格請求書), 중국어(增值税发票)에 대해 특화된 추출을 제공합니다. AI 추출기가 공급자명과 필드 라벨을 영어로 번역하면서 원문은 별도 열에 보존합니다.

---

## 지금 바로 시작하세요

외국어 청구서에 수시간을 낭비하지 마세요. Xenith는 어떤 CJK 청구서든 수 초 만에 구조화되고 검증된 엑셀 보고서로 변환합니다.

**계정 불필요. 회원가입 불필요. 무료.**

[**tryxenith.com/invoice에서 청구서 처리 시작하기 ->**](https://tryxenith.com/invoice)

---
---

# [日本語] 外国語の請求書を一瞬で構造化レポートに変換

> **TL;DR（要点まとめ）**
>
> - 韓国語の세금계산서、日本語の適格請求書、中国語の增值税发票を、PDF・画像・HWPX・DOCX・ZIPなど、どの形式でもアップロード可能。
> - AI抽出エージェントがすべてのフィールド（取引先、金額、税額、明細）を抽出し、2つ目のAI会計士が計算と税率を検証。
> - 整理されたExcelまたはCSVレポートが数秒で完成。アカウント不要、現在無料。
> - Xenithは、HWPX（韓国の한글）ファイルに対応する唯一の請求書ツール。
> - バッチ処理：1か月分の請求書をZIPにまとめてアップロードすれば、1つの統合レポートに。

[tryxenith.com/invoiceで無料で試す ->](https://tryxenith.com/invoice)

---

## 目次

- [誰も解決できなかった問題](#誰も解決できなかった問題)
- [Xenith Invoiceができること](#xenith-invoiceができること)
- [使い方](#使い方)
- [レポートに含まれる内容](#レポートに含まれる内容)
- [適格請求書（インボイス制度）への対応](#適格請求書インボイス制度への対応)
- [バッチ処理](#バッチ処理)
- [プライバシーとセキュリティ](#プライバシーとセキュリティ)
- [料金](#料金)
- [ロードマップ](#ロードマップ)
- [よくある質問](#よくある質問)

---

## 誰も解決できなかった問題

アジア圏と取引のある企業なら、この苦労を知っているはずです。韓国の取引先から세금계산서がPDFで届く。中国のパートナーが增值税发票をスキャン画像で送ってくる。

あるいは、自社の適格請求書を海外本社に報告する必要がある。これらすべてを一つのスプレッドシートにまとめるのは、経理チームの仕事です。

現実的な選択肢は限られています：

- **手入力。** 読めない外国語を見ながら、一つずつ数字を打ち込む。
- **ネイティブスピーカーの雇用。** 外国語のレシートを読むためだけにバイリンガルスタッフを雇う企業は少なくありません。
- **CJKを理解しないOCRツール。** ほとんどの請求書OCRツールは英語の文書向けに作られています。韓国の税務請求書の構造や適格請求書の必須項目を理解していません。

> **📊 数字で見る現実：**
>
> - 業界平均の処理コスト：請求書1件あたり **$15（約2,200円）**、処理期間 **14.6日**
> - 中小企業の **86%** が未だに請求書データを手入力
> - 入力された請求書の **39%** にエラーが含まれる
> - AI請求書処理市場は2034年までに **470億ドル** 規模に成長予測

> **💬 現場の声：**
>
> *"APACの領収書処理を自動化するソリューションがないため、ネイティブスピーカーを雇っています。"*
> — SAP Concurコミュニティフォーラム

CJK（日中韓）文書に特化したソリューションはこれまでありませんでした。今日までは。

---

## Xenith Invoiceができること

Xenithは、あらゆる形式・あらゆる言語の請求書を受け取り、整理されたExcelレポートを返します。内部では以下の処理が行われます：

**1. OCR抽出。** MistralのドキュメントOCRでファイルを読み取ります。PDF、スキャン画像（JPG、PNG）、HWPX（韓国の한글形式）、DOCXに対応しています。

**2. AIフィールド抽出（Extractor Agent）。** 専門AIエージェントがOCR結果を分析し、すべての構造化フィールドを抽出します。取引先名（翻訳+原文）、請求書番号、発行日、支払期日、通貨、小計、税額、合計、そして各明細項目の品名・数量・単価・金額まで。

**3. 検証（Accountant Agent）。** 2つ目のAIエージェントが公認会計士の役割で、すべての請求書をレビューします。計算検証、税率確認（韓国の세금계산서は10% VAT、日本の適格請求書は8%/10%消費税）、重複検知、異常値のフラグ付けを実行します。

**4. レポート生成。** 検証済みデータがExcelワークブック（またはCSV）にまとめられ、ダウンロードとして返されます。

> **⚡ ポイント：** 全プロセスが数秒で完了します。数日ではありません。

---

## 使い方

### ステップ1 — tryxenith.com/invoice にアクセス

アカウント作成不要。登録なしですぐに使えます。

### ステップ2 — 請求書ファイルをアップロード

ファイルをドラッグ＆ドロップするか、クリックして選択します。対応形式：

- **PDF** — テキストベースまたはスキャンPDF
- **画像** — JPG、PNG（撮影またはスキャンした請求書）
- **HWPX** — 韓国の한글文書（Xenithのみ対応）
- **DOCX** — Word文書
- **ZIP** — 複数の請求書を含むZIPアーカイブ

ファイルサイズは最大20MB。必要な分だけアップロードできます。

### ステップ3 — 出力形式を選択

- **Excel (.xlsx)** — 請求書シートと検証フラグシートが含まれます。ほとんどのユーザーにおすすめです。
- **CSV (.csv)** — 請求書1件につき1行のフラットファイル。他のシステムへのインポートに便利です。

### ステップ4 — 「レポート生成」をクリック

Xenithがすべてのファイルを並列処理します。AIエージェントが作業中はローディング表示が出ます。処理が完了すると、レポートが自動的にダウンロードされます。

---

## レポートに含まれる内容

### 請求書シート

各行が1つの請求書で、以下の列が含まれます：

| 列 | 説明 |
|---|------|
| **File** | 元のファイル名 |
| **Vendor** | 取引先名（英語翻訳） |
| **Vendor (Original)** | 取引先名（原文、例：서울테크솔루션） |
| **Invoice #** | 請求書番号 |
| **Date** | 発行日（YYYY-MM-DD） |
| **Due Date** | 支払期日 |
| **Currency** | 通貨コード（JPY、KRW、USD等） |
| **Subtotal** | 税抜金額 |
| **Tax** | 税額 |
| **Total** | 合計金額 |
| **Language** | 検出された言語（ja、ko、zh、en等） |
| **Confidence** | AI信頼度スコア（0.0〜1.0） |
| **Notes** | 会計士エージェントのメモ — 修正事項、懸念点など |

### フラグシート（Excelのみ）

| 列 | 説明 |
|---|------|
| **Type** | `math_error`（計算エラー）、`tax_mismatch`（税率不一致）、`duplicate`（重複疑い）、`anomaly`（異常値）、`low_confidence`（低信頼度） |
| **Severity** | `critical`（赤）、`warning`（黄）、`info`（情報） |
| **Message** | 問題の説明 |

> **実際に試してみましょう。** 最初の請求書をアップロードして、数秒で構造化レポートを受け取ってください — アカウント不要。
>
> [Xenith Invoiceを無料で使う ->](https://tryxenith.com/invoice)

---

## 📄 適格請求書（インボイス制度）への対応

2023年10月に開始されたインボイス制度により、適格請求書の正確な処理がこれまで以上に重要になっています。

Xenithは適格請求書から以下のフィールドを自動抽出します：

- 発行者名（翻訳+原文）
- 登録番号
- 取引日
- 品名・数量・単価・金額（各明細行）
- 消費税（8%/10%の税率別に検証）
- 合計金額

> **💡 Xenithだけの機能：**
>
> 計算検証により、税率の適用ミスや合計金額の不一致を自動的にフラグ付けします。HWPX形式の請求書に対応しているのはXenithだけです。

---

## バッチ処理

1か月分の請求書が溜まっているなら、ZIPファイルにまとめてアップロードしてください。Xenithがアーカイブを展開し、対応するすべてのファイルを並列処理した後、1つの統合レポートとして返します。

活用例：

- 複数のAPAC取引先からの月次経費精算
- 監査準備 — 四半期分の請求書を一括処理
- 複数言語が混在する出張経費レポート

---

## 🔒 プライバシーとセキュリティ

> **🛡️ お客様のデータはお客様のものです：**
>
> - **ファイル非保存。** ファイルはメモリ上でのみ処理され、ディスクに書き込まれません。
> - **暗号化通信。** すべてのアップロードにTLS暗号化を適用。
> - **自動削除。** レポート生成完了と同時にメモリからファイルを削除。
> - **アカウント不要。** メールアドレスや個人情報の収集は一切ありません。

---

## 料金

**Xenith Invoiceは現在無料です。** アカウント不要、使用量制限なし（レート制限：1分あたり10リクエスト）。

将来的には請求書単位の従量課金モデルを導入予定です。1件あたり **$0.50〜1.00** 程度を想定しており、手作業の処理コスト$15と比較するとごくわずかです。

---

## 🗺️ ロードマップ

以下の機能は現在開発中です：

| 機能 | ステータス | 目標時期 |
|------|-----------|----------|
| **QuickBooks / Xero連携** — 抽出した請求書データを会計ソフトに直接プッシュ | 計画中 | 2026年Q3 |
| **適格請求書コンプライアンス検証** — JCT登録番号の検証、必須項目チェック、項目別税率の検証 | 開発中 | 2026年Q2 |
| **韓国 세금계산서 コンプライアンス検証** — 事業者登録番号の検証、必須項目チェック | 開発中 | 2026年Q2 |
| **中国 增值税发票 検証** — VAT種別の検出、必須項目チェック | 計画中 | 2026年Q3 |
| **バッチ間重複検出** — 言語と期間を横断するファジーマッチング | 計画中 | 2026年Q3 |
| **自動分類** — 取引先・明細内容に基づくGL勘定科目コードの予測 | 計画中 | 2026年Q4 |
| **メール連携** — 専用メールアドレスに請求書を転送するだけで自動処理 | 計画中 | 2026年Q4 |

ロードマップにご意見をお聞かせください。[最も重要な機能を教えてください](mailto:support@tryxenith.com)。

---

## よくある質問

### Xenith Invoiceはどのファイル形式に対応していますか？

PDF（テキストベースおよびスキャン）、JPG、PNG、DOCX、HWPX（韓国の한글形式）、およびこれらの形式を含むZIPアーカイブに対応しています。HWPX対応はXenith独自の機能です。他の請求書ツールでは韓国の한글ファイルを読み取ることはできません。

### Xenith Invoiceは無料ですか？

はい、現在完全無料です。アカウント作成や登録は不要です。唯一の制限は、1分あたり10リクエストのレート制限のみです。将来的には1件あたり約$0.50〜1.00の従量課金モデルを導入予定です。

### AIの抽出精度はどの程度ですか？

Xenithは2つのエージェントシステムを採用しています。抽出エージェント（Extractor Agent）がOCR結果から構造化フィールドを抽出し、会計エージェント（Accountant Agent）が計算、税率、整合性を検証します。各請求書に信頼度スコア（0.0〜1.0）が付与され、問題のある項目は専用のフラグシートに表示されます。

### Xenithは請求書ファイルを保存しますか？

いいえ。ファイルはすべてメモリ上でのみ処理され、ディスクには一切書き込まれません。すべてのアップロードにTLS暗号化が適用され、レポート生成完了と同時にメモリから削除されます。アカウントや個人情報は不要です。

### 複数の請求書を一度に処理できますか？

はい。個別のファイルを複数アップロードするか、すべてのファイルをZIPアーカイブにまとめてアップロードできます。Xenithがアーカイブを展開し、対応するすべてのファイルを並列処理した後、すべての請求書が1つのシートにまとまったExcelまたはCSVレポートを返します。

### 対応言語は？

Xenithはすべての言語の請求書に対応しており、韓国語（세금계산서）、日本語（適格請求書）、中国語（增值税发票）に特化した抽出機能を備えています。AI抽出エージェントが取引先名やフィールドラベルを英語に翻訳しつつ、原文は別の列に保持します。

---

## 今すぐ請求書処理を始めましょう

外国語の請求書に何時間もかけるのはやめましょう。XenithはあらゆるCJK請求書を、数秒で構造化・検証済みのExcelレポートに変換します。

**アカウント不要。登録不要。無料。**

[**tryxenith.com/invoiceで請求書処理を開始 ->**](https://tryxenith.com/invoice)
