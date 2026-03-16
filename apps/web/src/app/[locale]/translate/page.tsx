import type { Metadata } from "next";
import { TranslatePageClient } from "./client";

const i18nMeta: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: "Translate Text & Files - HWP, HWPX, PDF, DOCX",
    description:
      "Translate text, HWP, HWPX, PDF, and DOCX files between 20+ languages. The only translator with native Korean 한글 document support.",
    ogTitle: "Translate Text & Files (HWP/HWPX)",
    ogDescription:
      "AI-powered translation for text and documents. Native HWP & HWPX (한글) support. 20+ languages.",
  },
  ko: {
    title: "텍스트 및 파일 번역 - HWP, HWPX, PDF, DOCX",
    description:
      "한글(HWP/HWPX) 파일을 포함한 텍스트, PDF, DOCX 문서를 20개 이상의 언어로 번역하세요. 한글 문서를 기본 지원하는 유일한 번역기.",
    ogTitle: "텍스트 및 파일 번역 (HWP/HWPX)",
    ogDescription:
      "AI 기반 텍스트 및 문서 번역. 한글(HWP/HWPX) 기본 지원. 20개 이상의 언어.",
  },
  ja: {
    title: "テキスト・ファイル翻訳 - HWP, HWPX, PDF, DOCX",
    description:
      "テキスト、HWP、HWPX、PDF、DOCXファイルを20以上の言語に翻訳。韓国語한글文書をネイティブサポートする唯一の翻訳ツール。",
    ogTitle: "テキスト・ファイル翻訳（HWP/HWPX）",
    ogDescription:
      "AI搭載のテキスト・文書翻訳。HWP・HWPX（한글）ネイティブサポート。20以上の言語対応。",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = i18nMeta[locale] || i18nMeta.en;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
    alternates: {
      canonical: "/translate",
      languages: {
        en: "/translate",
        ko: "/translate",
        ja: "/translate",
      },
    },
  };
}

export default function TranslatePage() {
  return <TranslatePageClient />;
}
