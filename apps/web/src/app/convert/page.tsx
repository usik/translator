import type { Metadata } from "next";
import { ConvertPageClient } from "./client";

export const metadata: Metadata = {
  title: "File Conversion Tools - HWPX, PDF, DOCX, OCR | 파일 변환 도구",
  description:
    "Convert between HWPX, PDF, DOCX, and text formats. Extract text from images with OCR. The only tool with native Korean 한글 (HWPX) support. 한글 파일 변환기 - HWPX, PDF, DOCX 변환 및 OCR 텍스트 추출을 지원합니다.",
  openGraph: {
    title: "File Conversion Tools | Xenith",
    description:
      "Convert HWPX to PDF, PDF to DOCX, extract text from images. Native Korean document support. 한글 PDF 변환, HWPX 변환 도구.",
  },
  alternates: {
    canonical: "/convert",
    languages: {
      'en': '/convert',
      'ko': '/convert',
    },
  },
};

export default function ConvertPage() {
  return <ConvertPageClient />;
}
