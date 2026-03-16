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

export default function ConvertPage() {
  return <ConvertPageClient />;
}
