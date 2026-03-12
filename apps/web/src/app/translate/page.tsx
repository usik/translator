import type { Metadata } from "next";
import { TranslatePageClient } from "./client";

export const metadata: Metadata = {
  title: "Translate Text & Files",
  description:
    "Translate text, PDF, DOCX, and HWPX files between 20+ languages. The only translator with native Korean 한글 document support.",
  openGraph: {
    title: "Translate Text & Files | Xenith",
    description:
      "AI-powered translation for text and documents. Native HWPX (한글) support. 20+ languages.",
  },
  alternates: {
    canonical: "/translate",
  },
};

export default function TranslatePage() {
  return <TranslatePageClient />;
}
