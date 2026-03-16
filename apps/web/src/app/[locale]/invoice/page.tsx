import type { Metadata } from "next";
import { InvoicePageClient } from "./client";

const i18nMeta: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: "Invoice Processing - Upload & Translate Invoices",
    description:
      "Upload invoices in any language and get a structured expense report. Supports Korean 세금계산서, Japanese 適格請求書, and more. PDF, images, DOCX, HWP, HWPX.",
    ogTitle: "Invoice Processing",
    ogDescription:
      "AI-powered invoice extraction and expense report generation. Korean, Japanese, and Chinese invoice support.",
  },
  ko: {
    title: "청구서/인보이스 처리 - 업로드 및 번역",
    description:
      "모든 언어의 청구서를 업로드하고 구조화된 경비 보고서를 받으세요. 한국 세금계산서, 일본 適格請求書 등 지원. PDF, 이미지, DOCX, HWP, HWPX.",
    ogTitle: "청구서/인보이스 처리",
    ogDescription:
      "AI 기반 청구서 추출 및 경비 보고서 생성. 한국어, 일본어, 중국어 청구서 지원.",
  },
  ja: {
    title: "請求書処理 - アップロード＆翻訳",
    description:
      "あらゆる言語の請求書をアップロードして構造化された経費レポートを取得。韓国の세금계산서、日本の適格請求書などに対応。PDF、画像、DOCX、HWP、HWPX。",
    ogTitle: "請求書処理",
    ogDescription:
      "AI搭載の請求書抽出・経費レポート生成。韓国語、日本語、中国語の請求書に対応。",
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
      canonical: "/invoice",
      languages: {
        en: "/invoice",
        ko: "/invoice",
        ja: "/invoice",
      },
    },
  };
}

export default function InvoicePage() {
  return <InvoicePageClient />;
}
