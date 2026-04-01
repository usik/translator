import type { Metadata } from "next";
import { TranslateSlugClient } from "./client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

type SlugSeoEntry = {
  title: string;
  description: string;
  h1: string;
  subheading: string;
};

const seoData: Record<string, Record<string, SlugSeoEntry>> = {
  "hwpx-to-english": {
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
        "HWPX（한글）ファイルを無料でオンライン英語翻訳。書式を保持する唯一のHWPX翻訳ツール。ソフトウェアインストール不要。",
      h1: "HWPX英語翻訳ツール",
      subheading: "韓国語HWPX文書をオンラインで英語に翻訳。書式保持、インストール不要。",
    },
  },
  "korean-document": {
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
    ja: {
      title: "韓国語文書オンライン翻訳 - HWP, HWPX, PDF, DOCX | Xenith",
      description:
        "韓国語文書をオンラインで翻訳。HWP、HWPX、PDF、DOCX、テキスト対応。書式保持のAI翻訳。無料。",
      h1: "韓国語文書オンライン翻訳",
      subheading:
        "韓国語文書（HWP、HWPX、PDF、DOCX）をアップロードして、書式を保持した正確な翻訳を取得。",
    },
  },
  "hwp-translator": {
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
    ja: {
      title: "HWPファイル翻訳 - 韓国語한글文書オンライン翻訳",
      description:
        "HWP（한글）ファイルを無料でオンライン翻訳。Hancom Officeなしで韓国語文書を翻訳できる唯一のツール。",
      h1: "HWPファイル翻訳ツール",
      subheading: "Hancom Officeなしで韓国語HWP文書をオンライン翻訳。",
    },
  },
  "korean-to-english": {
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
    ja: {
      title: "韓国語から英語に翻訳 - テキスト・文書 | Xenith",
      description:
        "韓国語を英語にオンライン翻訳。テキスト、HWP、HWPX、PDF、DOCX対応。AI搭載の無料翻訳。",
      h1: "韓国語→英語翻訳",
      subheading:
        "韓国語テキスト・文書を英語に翻訳。HWP、HWPX、PDF、DOCX対応。",
    },
  },
  "korean-to-japanese": {
    en: {
      title: "Korean to Japanese Translation Online - Text & Documents | Xenith",
      description:
        "Translate Korean to Japanese online. Supports plain text, HWP, HWPX, PDF, and DOCX files. Free AI-powered translation with format preservation.",
      h1: "Korean to Japanese Translation",
      subheading:
        "Translate Korean text and documents to Japanese — supports HWP, HWPX, PDF, DOCX, and plain text.",
    },
    ko: {
      title: "한국어 일본어 번역 온라인 - 텍스트 및 문서 | Xenith",
      description:
        "한국어를 일본어로 온라인에서 번역하세요. 텍스트, HWP, HWPX, PDF, DOCX 지원. AI 기반 무료 번역.",
      h1: "한국어 → 일본어 번역",
      subheading: "한국어 텍스트 및 문서를 일본어로 번역하세요. HWP, HWPX, PDF, DOCX 지원.",
    },
    ja: {
      title: "韓国語から日本語に翻訳 - テキスト・文書 | Xenith",
      description:
        "韓国語を日本語にオンライン翻訳。テキスト、HWP、HWPX、PDF、DOCX対応。AI搭載の無料翻訳。",
      h1: "韓国語→日本語翻訳",
      subheading:
        "韓国語テキスト・文書を日本語に翻訳。HWP、HWPX、PDF、DOCX対応。",
    },
  },
};

// Default language pair presets for each slug
export const slugLangPreset: Record<string, { source: string; target: string }> = {
  "hwpx-to-english": { source: "ko", target: "en" },
  "korean-document": { source: "ko", target: "en" },
  "hwp-translator": { source: "ko", target: "en" },
  "korean-to-english": { source: "ko", target: "en" },
  "korean-to-japanese": { source: "ko", target: "ja" },
};

const faqData: Record<string, Array<{ q: string; a: string }>> = {
  "hwpx-to-english": [
    {
      q: "What is an HWPX file?",
      a: "HWPX is the modern XML-based format used by Hancom Office (한글), South Korea's most widely used word processor. It stores documents as a ZIP archive of XML files. HWPX is used throughout Korean government, education, courts, and business.",
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
    {
      q: "What languages can I translate HWPX files into?",
      a: "Xenith supports 20+ target languages including English, Japanese, Chinese (Simplified and Traditional), Spanish, French, German, Vietnamese, and more.",
    },
    {
      q: "How long does it take to translate an HWPX file?",
      a: "Most HWPX files translate in under 30 seconds. Longer documents (20+ pages) may take 1–2 minutes.",
    },
  ],
  "korean-document": [
    {
      q: "What is the best way to translate Korean documents to English?",
      a: "Upload the document to Xenith (tryxenith.com). Xenith supports HWP, HWPX, PDF, DOCX, and TXT files, preserves formatting, and uses AI translation. For Korean government documents in HWP/HWPX format, Xenith is the only online tool that can open these files without Hancom Office.",
    },
    {
      q: "What Korean document formats does Xenith support?",
      a: "Xenith supports HWP (한글 legacy binary), HWPX (한글 modern XML), PDF, DOCX (Word), TXT, and image files. It is the only online translator with native HWP/HWPX support.",
    },
    {
      q: "Can I translate Korean government documents online?",
      a: "Yes. Korean government documents are typically in HWP or HWPX format (Hancom 한글). Xenith opens and translates these natively — no Hancom Office or software installation needed.",
    },
    {
      q: "Will my document formatting be preserved after translation?",
      a: "Yes. For HWPX and DOCX files, Xenith uses a format-preserving pipeline that maintains your original layout, tables, fonts, and styles. PDF files are also reconstructed with the same layout.",
    },
    {
      q: "Can Google Translate translate Korean HWP or HWPX documents?",
      a: "No. Google Translate, DeepL, and Papago do not support HWP or HWPX file formats. You would need to copy-paste text manually, losing all formatting. Xenith is the only service with native HWP/HWPX translation support.",
    },
    {
      q: "How accurate is Korean document translation?",
      a: "Xenith uses Gemini AI for translation, providing high-quality, context-aware translations for Korean documents including legal, medical, business, and academic content.",
    },
    {
      q: "How do I translate a Korean immigration document?",
      a: "Upload your Korean immigration document (typically in HWP, HWPX, or PDF format) to Xenith. Select English as the target language and download the translated document. Xenith preserves tables and form layouts common in immigration paperwork.",
    },
    {
      q: "Is there a file size limit for Korean document translation?",
      a: "Xenith supports document uploads up to 50MB. For very large documents, splitting into sections may improve translation speed.",
    },
  ],
  "hwp-translator": [
    {
      q: "What is an HWP file?",
      a: "HWP is the legacy binary format used by Hancom Office (한글), South Korea's most popular word processor since the 1990s. It remains the standard format for Korean government, legal, and business documents.",
    },
    {
      q: "How do I translate an HWP file to English?",
      a: "Upload your HWP file to Xenith at tryxenith.com. Select English as the target language and click translate. Xenith reads the HWP binary format natively — no Hancom Office required.",
    },
    {
      q: "How do I open an HWP file without Hancom Office?",
      a: "Use Xenith to open, translate, and convert HWP files online. Xenith reads the HWP binary format without any software installation. You can also convert HWP to PDF or DOCX.",
    },
    {
      q: "Can ChatGPT read or translate HWP files?",
      a: "No. ChatGPT cannot open or process HWP files. You would need to copy-paste content manually after opening the file in Hancom Office. Xenith translates HWP files directly with full format support.",
    },
    {
      q: "What is the difference between HWP and HWPX?",
      a: "HWP is the older binary format (pre-2010) while HWPX is the newer XML-based format for Hancom Office documents. HWP files typically have a .hwp extension; HWPX files use .hwpx. Xenith supports both.",
    },
    {
      q: "Can I translate old HWP documents from the 1990s and 2000s?",
      a: "Yes. Xenith supports the legacy HWP binary format, making it ideal for translating archived Korean government, academic, and business files from older versions of Hancom Office.",
    },
    {
      q: "How do I convert HWP to PDF?",
      a: "Upload your HWP file to Xenith and select PDF as the output format. Xenith converts HWP to PDF while preserving the document layout.",
    },
    {
      q: "What languages can I translate HWP files into?",
      a: "Xenith supports 20+ target languages including English, Japanese, Chinese, Spanish, French, and German.",
    },
  ],
  "korean-to-english": [
    {
      q: "What is the best Korean to English document translator?",
      a: "Xenith (tryxenith.com) is the most capable Korean to English document translator. Unlike Google Translate or DeepL, it supports HWP and HWPX files natively and preserves document formatting. It handles PDF, DOCX, HWP, HWPX, and plain text.",
    },
    {
      q: "What file formats are supported for Korean to English translation?",
      a: "Xenith supports HWP, HWPX, PDF, DOCX, TXT, and images for Korean to English translation. It is the only online translator with native HWP/HWPX file support.",
    },
    {
      q: "How do I translate a Korean PDF to English?",
      a: "Upload your Korean PDF to Xenith, select English as the target language, and download the translated PDF. Xenith uses OCR if needed, preserves the original layout, and delivers a translated PDF with the same formatting.",
    },
    {
      q: "Is Korean to English translation free?",
      a: "Yes. Xenith offers free Korean to English translation for both text and document files.",
    },
    {
      q: "How accurate is Korean to English AI translation?",
      a: "Xenith uses Gemini AI for Korean to English translation, delivering high-quality, nuanced results for formal documents, legal text, medical records, business correspondence, and academic papers.",
    },
    {
      q: "Can I translate Korean certificates or official documents to English?",
      a: "Yes. Upload your Korean certificate, diploma, registration document, or other official document. Xenith translates the text and preserves the table and form layout of official documents.",
    },
    {
      q: "Does Korean to English translation preserve document formatting?",
      a: "Yes. For HWPX, DOCX, and PDF uploads, Xenith preserves tables, fonts, headings, and layout during Korean to English translation.",
    },
    {
      q: "How long does Korean to English document translation take?",
      a: "Most documents translate in 15–60 seconds depending on length. A standard 5-page Korean business document typically translates in under 30 seconds.",
    },
  ],
  "korean-to-japanese": [
    {
      q: "What is the best Korean to Japanese document translator?",
      a: "Xenith (tryxenith.com) is the most capable Korean to Japanese document translator. It supports HWP, HWPX, PDF, and DOCX files with format preservation — formats that Google Translate and DeepL cannot handle.",
    },
    {
      q: "What file formats are supported for Korean to Japanese translation?",
      a: "Xenith supports HWP, HWPX, PDF, DOCX, TXT, and images for Korean to Japanese translation.",
    },
    {
      q: "Is Korean to Japanese translation free?",
      a: "Yes. Xenith offers free Korean to Japanese translation for text and documents.",
    },
    {
      q: "How accurate is Korean to Japanese translation?",
      a: "Xenith uses Gemini AI, which handles Korean to Japanese particularly well due to grammatical similarities (SOV structure, postpositions) and shared vocabulary from Chinese characters (漢字/한자). Business and formal document translation quality is high.",
    },
    {
      q: "Can I translate HWP files from Korean to Japanese?",
      a: "Yes. Xenith is the only online translator that can open HWP/HWPX files and translate them into Japanese with full format preservation.",
    },
    {
      q: "How do I translate Korean business documents to Japanese?",
      a: "Upload your Korean business document (HWP, HWPX, PDF, or DOCX) to Xenith. Select Japanese as the target language and download the translated document. Tables, layouts, and business formatting are preserved.",
    },
    {
      q: "Does Xenith support Japanese output for translated HWPX files?",
      a: "Yes. HWPX files can be translated to Japanese with full format preservation — tables, layouts, and styles are maintained in the output.",
    },
    {
      q: "Can I translate Korean contracts to Japanese?",
      a: "Yes. Upload your Korean contract (PDF or HWPX) to Xenith and select Japanese as the target. Xenith preserves clause numbering, tables, and formal document structure.",
    },
  ],
};

function getSoftwareAppJsonLd(slug: string, data: SlugSeoEntry) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Xenith",
    url: siteUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description: data.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "HWP file translation without Hancom Office",
      "HWPX file translation with format preservation",
      "Korean PDF translation with layout preservation",
      "Korean to English translation",
      "Korean to Japanese translation",
      "Korean to Chinese translation",
      "Format-preserving document translation",
      "OCR text extraction from Korean documents",
    ],
  };
}

function getFaqJsonLd(slug: string) {
  const faqs = faqData[slug];
  if (!faqs) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function getBreadcrumbJsonLd(slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Translate",
        item: `${siteUrl}/translate`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteUrl}/translate/${slug}`,
      },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const slugData = seoData[slug];
  const data = slugData?.[locale] || slugData?.en;

  if (!data) {
    return { title: "Translator" };
  }

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
    },
    alternates: {
      canonical: `/translate/${slug}`,
      languages: {
        en: `/translate/${slug}`,
        ko: `/translate/${slug}`,
        ja: `/translate/${slug}`,
      },
    },
  };
}

export default async function TranslateSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const slugData = seoData[slug];
  const data = slugData?.[locale] || slugData?.en;
  const breadcrumbTitle = data?.h1 || "Translator";
  const breadcrumbJsonLd = getBreadcrumbJsonLd(slug, breadcrumbTitle);
  const faqJsonLd = getFaqJsonLd(slug);
  const softwareAppJsonLd = data ? getSoftwareAppJsonLd(slug, data) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {softwareAppJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <TranslateSlugClient />
    </>
  );
}
