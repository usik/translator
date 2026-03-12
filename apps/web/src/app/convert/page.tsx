import type { Metadata } from "next";
import { ConvertPageClient } from "./client";

export const metadata: Metadata = {
  title: "File Conversion Tools - HWPX, PDF, DOCX, OCR",
  description:
    "Convert between HWPX, PDF, DOCX, and text formats. Extract text from images with OCR. The only tool with native Korean 한글 (HWPX) support.",
  openGraph: {
    title: "File Conversion Tools | Xenith",
    description:
      "Convert HWPX to PDF, PDF to DOCX, extract text from images. Native Korean document support.",
  },
  alternates: {
    canonical: "/convert",
  },
};

export default function ConvertPage() {
  return <ConvertPageClient />;
}
