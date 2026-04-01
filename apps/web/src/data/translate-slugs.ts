/**
 * Single source of truth for all /translate/[slug] pages.
 * Imported by both page.tsx (server) and client.tsx (client).
 */

export type SlugLocale = {
  title: string;
  description: string;
  h1: string;
  subheading: string;
};

export type TranslateSlugData = {
  seo: { en: SlugLocale; ko?: SlugLocale; ja?: SlugLocale };
  sourceLang: string;
  targetLang: string;
  filesFocused: boolean;
  relatedLinks: Array<{ href: string; label: string }>;
  faqs: Array<{ q: string; a: string }>;
};

export const translateSlugs: Record<string, TranslateSlugData> = {
  // ── Existing editorial slugs ─────────────────────────────────────────────

  "hwpx-to-english": {
    seo: {
      en: {
        title: "HWPX to English Translator Online - Free Korean 한글 Document Translation",
        description:
          "Translate HWPX (한글) files to English online for free. The only translator with native HWPX support that preserves your document formatting. No software needed.",
        h1: "HWPX to English Translator",
        subheading:
          "Translate Korean 한글 HWPX documents to English online — format preserved, no software required.",
      },
      ko: {
        title: "HWPX 영어 번역기 - 한글 문서 영어 번역 온라인",
        description:
          "한글(HWPX) 파일을 온라인에서 무료로 영어로 번역하세요. 서식을 유지하는 유일한 HWPX 번역기. 소프트웨어 설치 불필요.",
        h1: "HWPX 영어 번역기",
        subheading: "한글 HWPX 문서를 온라인에서 영어로 번역하세요. 서식 유지, 설치 불필요.",
      },
      ja: {
        title: "HWPX英語翻訳 - 韓国語한글文書オンライン翻訳",
        description:
          "HWPX（한글）ファイルを無料でオンライン英語翻訳。書式を保持する唯一のHWPX翻訳ツール。",
        h1: "HWPX英語翻訳ツール",
        subheading: "韓国語HWPX文書をオンラインで英語に翻訳。書式保持、インストール不要。",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwp-translator", label: "HWP File Translator" },
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
      { href: "/convert/hwpx-to-docx", label: "Convert HWPX to DOCX" },
    ],
    faqs: [
      {
        q: "What is an HWPX file?",
        a: "HWPX is the modern XML-based format used by Hancom Office (한글), South Korea's most widely used word processor. It stores documents as a ZIP archive of XML files and is standard in Korean government, courts, and business.",
      },
      {
        q: "Can I translate HWPX files without installing Hancom Office?",
        a: "Yes. Xenith is the only online tool with native HWPX support. Upload your .hwpx file and translate it to English directly in your browser — no software installation required.",
      },
      {
        q: "Can ChatGPT or Google Translate open HWPX files?",
        a: "No. Neither ChatGPT, Google Translate, DeepL, nor Papago can open or translate HWPX files. Xenith is currently the only AI translation service with native HWPX format support.",
      },
      {
        q: "Does Xenith preserve formatting when translating HWPX to English?",
        a: "Yes. Xenith uses a format-preserving pipeline that extracts text, translates it with AI, and reconstructs the original document structure — keeping tables, fonts, headings, and layout intact.",
      },
      {
        q: "How do I open an HWPX file on Windows or Mac without Hancom Office?",
        a: "Upload the file to Xenith at tryxenith.com. Xenith reads the HWPX format natively and lets you translate or convert it to PDF or DOCX — no Hancom Office license required.",
      },
      {
        q: "Is HWPX translation free?",
        a: "Yes. Xenith offers free HWPX to English translation. Upload your file and get a translated document at no cost.",
      },
    ],
  },

  "korean-document": {
    seo: {
      en: {
        title: "Korean Document Translation Online - HWP, HWPX, PDF, DOCX | Xenith",
        description:
          "Translate Korean documents online. Supports HWP, HWPX, PDF, DOCX, and plain text. AI-powered translation with format preservation. Free to use.",
        h1: "Korean Document Translation Online",
        subheading:
          "Upload any Korean document — HWP, HWPX, PDF, or DOCX — and get an accurate translation with your formatting intact.",
      },
      ko: {
        title: "한국어 문서 번역 온라인 - HWP, HWPX, PDF, DOCX | Xenith",
        description:
          "한국어 문서를 온라인에서 번역하세요. HWP, HWPX, PDF, DOCX, 텍스트 지원. AI 기반 번역으로 서식 유지. 무료 사용.",
        h1: "한국어 문서 온라인 번역",
        subheading:
          "한국어 문서(HWP, HWPX, PDF, DOCX)를 업로드하고 서식을 유지한 정확한 번역을 받으세요.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/hwp-translator", label: "HWP File Translator" },
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
    ],
    faqs: [
      {
        q: "What is the best way to translate Korean documents to English?",
        a: "Upload the document to Xenith (tryxenith.com). Xenith supports HWP, HWPX, PDF, DOCX, and TXT, preserves formatting, and uses AI translation. For Korean government documents in HWP/HWPX format, Xenith is the only online tool that can open these files without Hancom Office.",
      },
      {
        q: "What Korean document formats does Xenith support?",
        a: "Xenith supports HWP (한글 legacy binary), HWPX (한글 modern XML), PDF, DOCX (Word), TXT, and image files. It is the only online translator with native HWP/HWPX support.",
      },
      {
        q: "Can Google Translate translate Korean HWP or HWPX documents?",
        a: "No. Google Translate, DeepL, and Papago do not support HWP or HWPX file formats. Xenith is the only service with native HWP/HWPX translation support.",
      },
      {
        q: "Can I translate Korean government documents online?",
        a: "Yes. Korean government documents are typically in HWP or HWPX format. Xenith opens and translates these natively — no Hancom Office installation needed.",
      },
      {
        q: "How do I translate a Korean immigration document?",
        a: "Upload your Korean immigration document (typically HWP, HWPX, or PDF) to Xenith. Select English as the target language and download the translated document. Xenith preserves tables and form layouts common in immigration paperwork.",
      },
      {
        q: "Is there a file size limit for Korean document translation?",
        a: "Xenith supports document uploads up to 50MB. For very large documents, splitting into sections may improve speed.",
      },
    ],
  },

  "hwp-translator": {
    seo: {
      en: {
        title: "HWP File Translator Online - Free Korean 한글 HWP Translation",
        description:
          "Translate HWP (한글) files online for free. The only translator with native HWP binary format support. Translate Korean HWP documents without Hancom Office.",
        h1: "HWP File Translator",
        subheading:
          "Translate Korean HWP documents online — no Hancom Office required, no formatting lost.",
      },
      ko: {
        title: "HWP 파일 번역기 - 한글 문서 온라인 번역",
        description:
          "HWP(한글) 파일을 온라인에서 무료로 번역하세요. 한컴오피스 없이 한글 문서를 번역. HWP 바이너리 형식을 기본 지원하는 유일한 번역기.",
        h1: "HWP 파일 번역기",
        subheading: "한컴오피스 없이 한글 HWP 문서를 온라인에서 번역하세요.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/convert/hwp-to-pdf", label: "Convert HWP to PDF" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
      { href: "/convert/hwpx-to-docx", label: "Convert HWPX to DOCX" },
    ],
    faqs: [
      {
        q: "What is an HWP file?",
        a: "HWP is the legacy binary format used by Hancom Office (한글), South Korea's most popular word processor since the 1990s. It remains the standard for Korean government, legal, and business documents.",
      },
      {
        q: "How do I translate an HWP file to English?",
        a: "Upload your HWP file to Xenith at tryxenith.com. Select English as the target language and click translate. Xenith reads the HWP binary format natively — no Hancom Office required.",
      },
      {
        q: "Can ChatGPT read or translate HWP files?",
        a: "No. ChatGPT cannot open or process HWP files. Xenith translates HWP files directly with full format support and no software installation.",
      },
      {
        q: "What is the difference between HWP and HWPX?",
        a: "HWP is the older binary format (pre-2010) while HWPX is the newer XML-based format for Hancom Office. Both use the .hwp or .hwpx extension. Xenith supports both formats.",
      },
      {
        q: "How do I convert HWP to PDF?",
        a: "Upload your HWP file to Xenith and select PDF as the output format. Xenith converts HWP to PDF while preserving the document layout.",
      },
      {
        q: "Can I translate old HWP documents from the 1990s and 2000s?",
        a: "Yes. Xenith supports the legacy HWP binary format, making it ideal for translating archived Korean government, academic, and business files.",
      },
    ],
  },

  "korean-to-english": {
    seo: {
      en: {
        title: "Korean to English Translation Online - Text & Documents | Xenith",
        description:
          "Translate Korean to English online. Supports plain text, HWP, HWPX, PDF, and DOCX files. Free AI-powered translation with format preservation.",
        h1: "Korean to English Translation",
        subheading:
          "Translate Korean text and documents to English — supports HWP, HWPX, PDF, DOCX, and plain text.",
      },
      ko: {
        title: "한국어 영어 번역 온라인 - 텍스트 및 문서 | Xenith",
        description:
          "한국어를 영어로 온라인에서 번역하세요. 텍스트, HWP, HWPX, PDF, DOCX 지원. AI 기반 무료 번역.",
        h1: "한국어 → 영어 번역",
        subheading: "한국어 텍스트 및 문서를 영어로 번역하세요. HWP, HWPX, PDF, DOCX 지원.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: false,
    relatedLinks: [
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/translate/korean-to-chinese", label: "Korean to Chinese" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/translate-korean-invoice", label: "Korean Invoice Translation" },
    ],
    faqs: [
      {
        q: "What is the best Korean to English document translator?",
        a: "Xenith (tryxenith.com) is the most capable Korean to English document translator. Unlike Google Translate or DeepL, it supports HWP and HWPX files natively and preserves document formatting.",
      },
      {
        q: "How do I translate a Korean PDF to English?",
        a: "Upload your Korean PDF to Xenith, select English as the target language, and download the translated PDF. Xenith uses OCR if needed, preserves the original layout, and delivers a formatted translated PDF.",
      },
      {
        q: "Is Korean to English translation free?",
        a: "Yes. Xenith offers free Korean to English translation for both text and document files.",
      },
      {
        q: "How accurate is Korean to English AI translation?",
        a: "Xenith uses Gemini AI for Korean to English translation, delivering high-quality results for formal documents, legal text, medical records, business correspondence, and academic papers.",
      },
      {
        q: "Can I translate Korean certificates or official documents to English?",
        a: "Yes. Upload your Korean certificate, diploma, or official document. Xenith translates the text and preserves tables and form layouts.",
      },
      {
        q: "How long does Korean to English document translation take?",
        a: "Most documents translate in 15–60 seconds. A standard 5-page Korean business document typically translates in under 30 seconds.",
      },
    ],
  },

  "korean-to-japanese": {
    seo: {
      en: {
        title: "Korean to Japanese Translation Online - Text & Documents | Xenith",
        description:
          "Translate Korean to Japanese online. Supports plain text, HWP, HWPX, PDF, and DOCX files. Free AI-powered translation with format preservation.",
        h1: "Korean to Japanese Translation",
        subheading:
          "Translate Korean text and documents to Japanese — supports HWP, HWPX, PDF, DOCX, and plain text.",
      },
      ja: {
        title: "韓国語から日本語に翻訳 - テキスト・文書 | Xenith",
        description:
          "韓国語を日本語にオンライン翻訳。HWP、HWPX、PDF、DOCX対応。書式保持のAI翻訳。",
        h1: "韓国語→日本語翻訳",
        subheading: "韓国語テキスト・文書を日本語に翻訳。HWP、HWPX、PDF、DOCX対応。",
      },
    },
    sourceLang: "ko",
    targetLang: "ja",
    filesFocused: false,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-to-chinese", label: "Korean to Chinese" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/hwpx-to-japanese", label: "HWPX to Japanese" },
    ],
    faqs: [
      {
        q: "What is the best Korean to Japanese document translator?",
        a: "Xenith (tryxenith.com) supports HWP, HWPX, PDF, and DOCX files with format preservation — formats that Google Translate and DeepL cannot handle.",
      },
      {
        q: "How accurate is Korean to Japanese translation?",
        a: "Xenith uses Gemini AI, which handles Korean to Japanese well due to grammatical similarities (SOV structure, postpositions) and shared Chinese character vocabulary (漢字/한자).",
      },
      {
        q: "Can I translate HWP files from Korean to Japanese?",
        a: "Yes. Xenith is the only online translator that can open HWP/HWPX files and translate them into Japanese with full format preservation.",
      },
      {
        q: "Is Korean to Japanese translation free?",
        a: "Yes. Xenith offers free Korean to Japanese translation for text and documents.",
      },
      {
        q: "Can I translate Korean contracts to Japanese?",
        a: "Yes. Upload your Korean contract (PDF or HWPX) to Xenith and select Japanese as the target. Clause numbering, tables, and formal structure are preserved.",
      },
    ],
  },

  // ── Programmatic: Language pairs ─────────────────────────────────────────

  "korean-to-chinese": {
    seo: {
      en: {
        title: "Korean to Chinese Translation Online - Text & Documents | Xenith",
        description:
          "Translate Korean to Chinese (Simplified) online. Supports HWP, HWPX, PDF, DOCX, and plain text. Free AI translation with format preservation.",
        h1: "Korean to Chinese Translation",
        subheading:
          "Translate Korean text and documents to Chinese — supports HWP, HWPX, PDF, DOCX, and plain text.",
      },
    },
    sourceLang: "ko",
    targetLang: "zh",
    filesFocused: false,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwpx-to-english", label: "HWPX to English" },
    ],
    faqs: [
      {
        q: "Can I translate Korean HWP or HWPX files to Chinese?",
        a: "Yes. Xenith is the only online translator that natively opens HWP and HWPX files and translates them to Chinese with format preservation.",
      },
      {
        q: "Does Xenith support Simplified and Traditional Chinese output?",
        a: "Yes. Xenith supports both Simplified Chinese (zh-CN) and Traditional Chinese (zh-TW) as translation targets.",
      },
      {
        q: "Is Korean to Chinese translation free?",
        a: "Yes. Upload Korean text or documents and translate to Chinese for free on Xenith.",
      },
      {
        q: "How accurate is Korean to Chinese AI translation?",
        a: "Xenith uses Gemini AI, which provides high-quality Korean to Chinese translation including business, legal, and technical terminology.",
      },
      {
        q: "Can I translate Korean business documents to Chinese?",
        a: "Yes. Upload your Korean business document (HWP, HWPX, PDF, or DOCX) and select Chinese as the target. Xenith preserves tables, layouts, and formatting.",
      },
    ],
  },

  "korean-to-vietnamese": {
    seo: {
      en: {
        title: "Korean to Vietnamese Translation Online - Documents & Text | Xenith",
        description:
          "Translate Korean to Vietnamese online for free. Supports HWP, HWPX, PDF, DOCX. AI translation with format preservation. Used by Korean factories and Vietnamese workers.",
        h1: "Korean to Vietnamese Translation",
        subheading:
          "Translate Korean documents and text to Vietnamese — HWP, HWPX, PDF, and DOCX supported.",
      },
    },
    sourceLang: "ko",
    targetLang: "vi",
    filesFocused: false,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/korean-to-chinese", label: "Korean to Chinese" },
    ],
    faqs: [
      {
        q: "Can I translate Korean work contracts to Vietnamese?",
        a: "Yes. Upload your Korean work contract (PDF or HWPX) to Xenith and select Vietnamese as the target. Table layouts and clause numbering are preserved.",
      },
      {
        q: "Is Korean to Vietnamese translation free?",
        a: "Yes. Xenith offers free Korean to Vietnamese translation for text and documents.",
      },
      {
        q: "Can Xenith translate Korean factory safety manuals to Vietnamese?",
        a: "Yes. Upload Korean workplace documents in HWP, HWPX, or PDF format and download a Vietnamese translation with the original layout intact.",
      },
      {
        q: "Does Xenith support HWP to Vietnamese translation?",
        a: "Yes. Xenith is the only online tool that can open HWP/HWPX files and translate them to Vietnamese without Hancom Office.",
      },
    ],
  },

  "english-to-korean": {
    seo: {
      en: {
        title: "English to Korean Translation Online - Text & Documents | Xenith",
        description:
          "Translate English to Korean online. Supports PDF, DOCX, and plain text. Free AI-powered translation with format preservation.",
        h1: "English to Korean Translation",
        subheading:
          "Translate English text and documents to Korean — PDF, DOCX, and plain text supported.",
      },
    },
    sourceLang: "en",
    targetLang: "ko",
    filesFocused: false,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/japanese-to-korean", label: "Japanese to Korean" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
    ],
    faqs: [
      {
        q: "Can I translate English PDF documents to Korean?",
        a: "Yes. Upload your English PDF to Xenith, select Korean as the target language, and download the translated PDF with the original layout preserved.",
      },
      {
        q: "Is English to Korean translation free?",
        a: "Yes. Xenith offers free English to Korean translation for text and documents.",
      },
      {
        q: "How accurate is English to Korean AI translation?",
        a: "Xenith uses Gemini AI for English to Korean translation, producing natural Korean text including formal (존댓말) and informal register where appropriate.",
      },
      {
        q: "Can I translate English contracts to Korean?",
        a: "Yes. Upload your English contract as a PDF or DOCX and select Korean. Xenith preserves clause structure and table formatting.",
      },
    ],
  },

  "japanese-to-korean": {
    seo: {
      en: {
        title: "Japanese to Korean Translation Online - Text & Documents | Xenith",
        description:
          "Translate Japanese to Korean online. Supports PDF, DOCX, and plain text. Free AI translation. Used for business documents, contracts, and official papers.",
        h1: "Japanese to Korean Translation",
        subheading:
          "Translate Japanese text and documents to Korean — PDF, DOCX, and plain text supported.",
      },
    },
    sourceLang: "ja",
    targetLang: "ko",
    filesFocused: false,
    relatedLinks: [
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/english-to-korean", label: "English to Korean" },
    ],
    faqs: [
      {
        q: "Can I translate Japanese documents to Korean online?",
        a: "Yes. Upload a Japanese PDF or DOCX to Xenith, select Korean, and download the translated document with preserved formatting.",
      },
      {
        q: "Is Japanese to Korean translation accurate?",
        a: "Yes. Gemini AI handles Japanese to Korean well — both languages share SOV grammar and extensive Chinese-character vocabulary (漢字/한자), which improves translation quality for business and legal text.",
      },
      {
        q: "Is Japanese to Korean translation free?",
        a: "Yes. Xenith offers free Japanese to Korean translation.",
      },
    ],
  },

  // ── Programmatic: Format-specific ────────────────────────────────────────

  "translate-korean-pdf": {
    seo: {
      en: {
        title: "Translate Korean PDF to English Online - Free | Xenith",
        description:
          "Translate Korean PDF documents to English online for free. OCR support, format preservation, and AI translation. Download a translated PDF with the same layout.",
        h1: "Translate Korean PDF to English",
        subheading:
          "Upload a Korean PDF and get a translated English PDF — same layout, tables, and formatting preserved.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/translate-korean-invoice", label: "Korean Invoice Translation" },
      { href: "/convert/pdf-to-docx", label: "PDF to DOCX" },
    ],
    faqs: [
      {
        q: "How do I translate a Korean PDF to English?",
        a: "Upload your Korean PDF to Xenith at tryxenith.com. Select English as the target language. Xenith extracts the text (using OCR if needed), translates it with AI, and delivers a translated PDF with the same layout.",
      },
      {
        q: "Does Xenith preserve formatting when translating Korean PDFs?",
        a: "Yes. Xenith reconstructs the translated document with the same layout — tables, headings, columns, and page structure are preserved in the output PDF.",
      },
      {
        q: "Can Xenith translate scanned Korean PDFs?",
        a: "Yes. Xenith uses OCR (optical character recognition) to extract text from scanned Korean PDFs before translation.",
      },
      {
        q: "Is Korean PDF to English translation free?",
        a: "Yes. Upload your Korean PDF and translate it to English for free.",
      },
      {
        q: "How long does it take to translate a Korean PDF?",
        a: "Most Korean PDFs translate in 15–60 seconds. A 10-page document typically takes under 45 seconds.",
      },
    ],
  },

  "hwpx-to-japanese": {
    seo: {
      en: {
        title: "HWPX to Japanese Translator Online - Korean 한글 Document Translation",
        description:
          "Translate HWPX (한글) files to Japanese online. The only translator with native HWPX support. Format preserved, no Hancom Office required.",
        h1: "HWPX to Japanese Translator",
        subheading:
          "Translate Korean 한글 HWPX documents to Japanese online — format preserved, no software required.",
      },
      ja: {
        title: "HWPX日本語翻訳 - 韓国語한글文書オンライン翻訳",
        description:
          "HWPX（한글）ファイルを無料で日本語翻訳。書式を保持する唯一のHWPX翻訳ツール。",
        h1: "HWPX日本語翻訳",
        subheading: "韓国語HWPX文書をオンラインで日本語翻訳。",
      },
    },
    sourceLang: "ko",
    targetLang: "ja",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/hwpx-to-english", label: "HWPX to English" },
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
    ],
    faqs: [
      {
        q: "Can I translate HWPX files to Japanese without Hancom Office?",
        a: "Yes. Xenith is the only online tool with native HWPX support. Upload your file and translate to Japanese directly in your browser.",
      },
      {
        q: "Does Xenith preserve HWPX formatting when translating to Japanese?",
        a: "Yes. Tables, fonts, headings, and layout are preserved in the translated output.",
      },
      {
        q: "Is HWPX to Japanese translation free?",
        a: "Yes. Upload your HWPX file and translate to Japanese at no cost.",
      },
    ],
  },

  // ── Programmatic: Document-type specific ─────────────────────────────────

  "translate-korean-invoice": {
    seo: {
      en: {
        title: "Korean Invoice Translation to English Online - Free | Xenith",
        description:
          "Translate Korean invoices (세금계산서) to English online. Preserves table layout, line items, and tax breakdowns. Used by Korean businesses for international clients.",
        h1: "Korean Invoice Translation",
        subheading:
          "Translate Korean invoices (세금계산서) to English — table layout, line items, and amounts preserved.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/translate-korean-pdf", label: "Translate Korean PDF" },
      { href: "/translate/translate-korean-contract", label: "Korean Contract Translation" },
      { href: "/invoice", label: "Invoice Processing Tool" },
    ],
    faqs: [
      {
        q: "How do I translate a Korean invoice to English?",
        a: "Upload your Korean invoice (PDF, HWPX, or image) to Xenith. Select English as the target. Xenith translates the text and preserves the table layout — line items, amounts, tax breakdowns, and company details stay in place.",
      },
      {
        q: "What is a 세금계산서 (Korean tax invoice)?",
        a: "A 세금계산서 is a Korean tax invoice issued under the Korean VAT system. It includes the seller's business registration number (사업자등록번호), supply value (공급가액), VAT amount (세액), and total. Xenith translates all fields to English while preserving the table structure.",
      },
      {
        q: "Can Xenith translate Korean invoices in HWP or HWPX format?",
        a: "Yes. Many Korean invoices are created in Hancom Office (HWP/HWPX). Xenith is the only online translator that can open and translate these files without Hancom Office installed.",
      },
      {
        q: "Does Xenith preserve the table and number formatting in Korean invoices?",
        a: "Yes. Xenith's format-preserving pipeline keeps tables, columns, amounts, and layout intact. Numbers and currency values are not altered during translation.",
      },
      {
        q: "Is Korean invoice translation free?",
        a: "Yes. Upload your Korean invoice and translate to English for free.",
      },
    ],
  },

  "translate-korean-contract": {
    seo: {
      en: {
        title: "Korean Contract Translation to English Online - Free | Xenith",
        description:
          "Translate Korean contracts and legal documents to English online. Preserves clause numbering, tables, and formal document structure. PDF, HWPX, and DOCX supported.",
        h1: "Korean Contract Translation",
        subheading:
          "Translate Korean legal contracts to English — clause numbering, tables, and structure preserved.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/translate-korean-pdf", label: "Translate Korean PDF" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/translate-korean-certificate", label: "Korean Certificate Translation" },
    ],
    faqs: [
      {
        q: "How do I translate a Korean contract to English?",
        a: "Upload your Korean contract (PDF, HWPX, or DOCX) to Xenith. Select English as the target. Xenith translates the legal text and preserves clause numbering, indentation, and table formatting.",
      },
      {
        q: "Are Korean contracts typically in HWP or PDF format?",
        a: "Korean contracts are most commonly in HWPX (Hancom 한글) or PDF format. Xenith supports both, with full format preservation for HWPX files.",
      },
      {
        q: "How accurate is Korean legal document translation?",
        a: "Xenith uses Gemini AI, which handles Korean legal terminology (계약서, 을, 갑, 특약사항) accurately. For legally binding translations, professional human review is recommended.",
      },
      {
        q: "Is Korean contract translation free?",
        a: "Yes. Upload your Korean contract and translate it to English for free.",
      },
    ],
  },

  "translate-korean-certificate": {
    seo: {
      en: {
        title: "Korean Certificate Translation to English Online - Free | Xenith",
        description:
          "Translate Korean certificates, diplomas, and official documents to English online. Preserves form layout. Supports PDF, HWPX, and image files.",
        h1: "Korean Certificate Translation",
        subheading:
          "Translate Korean certificates and official documents to English — form layout and seals preserved.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-immigration-document", label: "Korean Immigration Documents" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
    ],
    faqs: [
      {
        q: "How do I translate a Korean certificate to English?",
        a: "Upload your Korean certificate (PDF or image) to Xenith and select English. Xenith extracts and translates the text while preserving the form layout.",
      },
      {
        q: "What types of Korean certificates can Xenith translate?",
        a: "Xenith can translate graduation certificates (졸업증명서), academic transcripts (성적증명서), business registration certificates (사업자등록증), family relationship certificates (가족관계증명서), and other official Korean documents.",
      },
      {
        q: "Can I translate a Korean diploma to English for university applications?",
        a: "Yes. Upload your Korean diploma or transcript as a PDF and download an English translation. Note: for official certified translations required by institutions, professional translation services may be needed.",
      },
      {
        q: "Is Korean certificate translation free?",
        a: "Yes. Translate Korean certificates to English for free on Xenith.",
      },
    ],
  },

  "korean-immigration-document": {
    seo: {
      en: {
        title: "Korean Immigration Document Translation to English - Free | Xenith",
        description:
          "Translate Korean immigration documents to English online. Supports Korean residency cards, family certificates, registration documents. PDF, HWPX, and HWP supported.",
        h1: "Korean Immigration Document Translation",
        subheading:
          "Translate Korean immigration and residency documents to English — forms, tables, and layout preserved.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/translate-korean-certificate", label: "Korean Certificate Translation" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
    ],
    faqs: [
      {
        q: "What Korean immigration documents can Xenith translate?",
        a: "Xenith can translate alien registration certificates (외국인등록증), family relationship certificates (가족관계증명서), residency documents, visa applications, and other Korean government forms.",
      },
      {
        q: "Can I translate Korean government forms from HWP or HWPX to English?",
        a: "Yes. Korean government documents are typically in HWP or HWPX format. Xenith is the only online tool that can open and translate these files without Hancom Office.",
      },
      {
        q: "How do I translate Korean immigration documents for a US visa or green card application?",
        a: "Upload your Korean document (PDF, HWP, or HWPX) to Xenith and select English. Download the translated document. For USCIS submissions, a certified human translation may be additionally required.",
      },
      {
        q: "Is Korean immigration document translation free?",
        a: "Yes. Translate Korean immigration documents to English for free on Xenith.",
      },
    ],
  },

  "korean-medical-translation": {
    seo: {
      en: {
        title: "Korean Medical Document Translation to English Online - Free | Xenith",
        description:
          "Translate Korean medical records, diagnosis letters, and health documents to English. Preserves formatting. PDF, HWPX, and DOCX supported.",
        h1: "Korean Medical Document Translation",
        subheading:
          "Translate Korean medical records and health documents to English — layout and terminology preserved.",
      },
    },
    sourceLang: "ko",
    targetLang: "en",
    filesFocused: true,
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/translate-korean-certificate", label: "Korean Certificate Translation" },
    ],
    faqs: [
      {
        q: "What Korean medical documents can Xenith translate?",
        a: "Xenith can translate Korean diagnosis letters (진단서), medical records (의무기록), health checkup results (건강검진결과), prescriptions (처방전), and hospital discharge summaries.",
      },
      {
        q: "How does Xenith handle Korean medical terminology?",
        a: "Xenith uses Gemini AI trained on medical text in Korean and English. It accurately translates Korean medical terms including ICD diagnoses, drug names, and clinical terminology. For clinical use, professional medical review is recommended.",
      },
      {
        q: "Can I translate Korean medical records for insurance claims abroad?",
        a: "Yes. Upload your Korean medical records as a PDF or HWPX and download an English translation. Note: for official insurance submissions, certified translation may be required.",
      },
      {
        q: "Is Korean medical document translation free?",
        a: "Yes. Translate Korean medical documents to English for free on Xenith.",
      },
    ],
  },
};

export function getAllSlugs(): string[] {
  return Object.keys(translateSlugs);
}

export function getSlugData(slug: string): TranslateSlugData | undefined {
  return translateSlugs[slug];
}

/** Slugs that should default to the files tab (not text tab) */
export function isFilesFocused(slug: string): boolean {
  return translateSlugs[slug]?.filesFocused ?? false;
}
