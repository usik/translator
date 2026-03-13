import type { Metadata } from "next";
import { TranslatePageClient } from "./client";

export const metadata: Metadata = {
  title: "Translate Text & Files - 텍스트 및 파일 번역",
  description:
    "Translate text, PDF, DOCX, and HWPX files between 20+ languages. The only translator with native Korean 한글 document support. 한글(HWPX) 파일을 포함한 텍스트, PDF, DOCX 문서를 20개 이상의 언어로 번역하세요.",
  openGraph: {
    title: "Translate Text & Files | Xenith",
    description:
      "AI-powered translation for text and documents. Native HWPX (한글) support. 20+ languages. AI 기반 한글 문서 번역기.",
  },
  alternates: {
    canonical: "/translate",
    languages: {
      'en': '/translate',
      'ko': '/translate',
    },
  },
};

export default function TranslatePage() {
  return <TranslatePageClient />;
}
