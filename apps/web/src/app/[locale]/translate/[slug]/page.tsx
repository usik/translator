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
      a: "HWPX is the modern XML-based format used by Hancom Office (한글), South Korea's most widely used word processor. It is commonly used in Korean government, education, and business documents.",
    },
    {
      q: "Can I translate HWPX files without installing Hancom Office?",
      a: "Yes. Xenith is the only online tool with native HWPX support. You can translate HWPX documents directly in your browser — no software installation required.",
    },
    {
      q: "Does Xenith preserve formatting when translating HWPX to English?",
      a: "Yes. Xenith uses a format-preserving pipeline that extracts text, translates it, and reconstructs the original document structure — keeping fonts, tables, and layout intact.",
    },
    {
      q: "Is HWPX translation free?",
      a: "Xenith offers free translation for text and documents. Upload your HWPX file and translate to English at no cost.",
    },
    {
      q: "What languages can I translate HWPX files into?",
      a: "Xenith supports 20+ languages including English, Japanese, Chinese, Spanish, French, German, and more.",
    },
  ],
  "korean-document": [
    {
      q: "What Korean document formats does Xenith support?",
      a: "Xenith supports HWP, HWPX (한글), PDF, DOCX, TXT, and image files. It is the only online translator with native HWP/HWPX support.",
    },
    {
      q: "Will my document's formatting be preserved after translation?",
      a: "Yes. For HWPX and DOCX files, Xenith uses a format-preserving pipeline that maintains your original layout, tables, fonts, and styles after translation.",
    },
    {
      q: "Can I translate Korean government documents online?",
      a: "Yes. Korean government documents are typically in HWP or HWPX format. Xenith can open and translate these without any software installation.",
    },
    {
      q: "How accurate is Korean document translation?",
      a: "Xenith uses Gemini AI for translation, providing high-quality, context-aware translations for Korean documents.",
    },
    {
      q: "Is there a file size limit for Korean document translation?",
      a: "Xenith supports document uploads up to 50MB. For very large documents, splitting into sections may improve speed.",
    },
  ],
  "hwp-translator": [
    {
      q: "What is an HWP file?",
      a: "HWP is the legacy binary format used by Hancom Office (한글), South Korea's most popular word processor. It has been used since the 1990s and remains common in Korean official and business documents.",
    },
    {
      q: "How do I translate an HWP file without Hancom Office?",
      a: "Upload your HWP file to Xenith. Our tool reads the HWP binary format natively and translates the content without requiring Hancom Office or any other software.",
    },
    {
      q: "What is the difference between HWP and HWPX?",
      a: "HWP is the older binary format while HWPX is the newer XML-based format for Hancom Office documents. Xenith supports both formats for translation and conversion.",
    },
    {
      q: "Can I translate old HWP documents from the 1990s and 2000s?",
      a: "Yes. Xenith supports the legacy HWP binary format used in older Korean documents, making it ideal for translating archived government and business files.",
    },
    {
      q: "What languages can I translate HWP files into?",
      a: "Xenith supports 20+ target languages including English, Japanese, Chinese, Spanish, French, and German.",
    },
  ],
  "korean-to-english": [
    {
      q: "What file formats are supported for Korean to English translation?",
      a: "Xenith supports HWP, HWPX, PDF, DOCX, TXT, and images for Korean to English translation. It is the only translator with native HWP/HWPX file support.",
    },
    {
      q: "Is Korean to English translation free?",
      a: "Yes. Xenith offers free Korean to English translation for text and documents.",
    },
    {
      q: "How accurate is the Korean to English translation?",
      a: "Xenith uses Gemini AI, which provides high-quality, nuanced Korean to English translations, including formal document language, technical terms, and idiomatic expressions.",
    },
    {
      q: "Can I auto-detect the Korean language?",
      a: "Yes. Select 'Auto-detect' as the source language and Xenith will automatically identify Korean and translate it to English.",
    },
    {
      q: "Does Korean to English translation preserve document formatting?",
      a: "Yes. For HWPX and DOCX uploads, Xenith preserves tables, fonts, and layout structure during translation.",
    },
  ],
  "korean-to-japanese": [
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
      a: "Xenith uses Gemini AI for translation, which handles Korean to Japanese particularly well given the grammatical similarities and shared loanwords between the two languages.",
    },
    {
      q: "Can I translate HWP files from Korean to Japanese?",
      a: "Yes. Xenith is the only online translator that can open HWP/HWPX files and translate them into Japanese with format preservation.",
    },
    {
      q: "Does Xenith support Japanese output for translated HWPX files?",
      a: "Yes. HWPX files can be translated to Japanese with full format preservation — tables, layouts, and styles are maintained.",
    },
  ],
};

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
