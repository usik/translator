import type { Metadata } from "next";
import { ConvertPageClient } from "./client";

const i18nMeta: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: "File Conversion Tools - HWP, HWPX, PDF, DOCX, OCR",
    description:
      "Convert between HWP, HWPX, PDF, DOCX, and text formats. Extract text from images with OCR. The only tool with native Korean 한글 (HWP/HWPX) support.",
    ogTitle: "File Conversion Tools (HWP/HWPX)",
    ogDescription:
      "Convert HWP to PDF, HWPX to PDF, PDF to DOCX, extract text from images. Native Korean document support.",
  },
  ko: {
    title: "파일 변환 도구 - HWP, HWPX, PDF, DOCX, OCR",
    description:
      "HWP, HWPX, PDF, DOCX 및 텍스트 형식 간 변환. OCR로 이미지에서 텍스트 추출. 한글(HWP/HWPX)을 기본 지원하는 유일한 도구.",
    ogTitle: "파일 변환 도구 (HWP/HWPX)",
    ogDescription:
      "HWP PDF 변환, HWPX PDF 변환, PDF DOCX 변환, 이미지 텍스트 추출. 한글 문서 기본 지원.",
  },
  ja: {
    title: "ファイル変換ツール - HWP, HWPX, PDF, DOCX, OCR",
    description:
      "HWP、HWPX、PDF、DOCX、テキスト形式間の変換。OCRで画像からテキスト抽出。韓国語한글（HWP/HWPX）をネイティブサポートする唯一のツール。",
    ogTitle: "ファイル変換ツール（HWP/HWPX）",
    ogDescription:
      "HWP→PDF、HWPX→PDF、PDF→DOCX変換、画像テキスト抽出。韓国語文書ネイティブサポート。",
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
      canonical: "/convert",
      languages: {
        en: "/convert",
        ko: "/convert",
        ja: "/convert",
      },
    },
  };
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Xenith — File Conversion Tools",
  url: `${siteUrl}/convert`,
  description:
    "Convert between HWP, HWPX, PDF, DOCX, and text formats online for free. Extract text from images with AI-powered OCR. The only tool with native Korean 한글 (HWP/HWPX) support.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "HWP to PDF conversion (Korean 한글 legacy format)",
    "HWPX to PDF conversion (Korean 한글 modern format)",
    "PDF to DOCX conversion",
    "DOCX to PDF conversion",
    "Image to text (OCR) in 20+ languages",
    "No software installation required",
  ],
};

export default function ConvertPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConvertPageClient />
    </>
  );
}
