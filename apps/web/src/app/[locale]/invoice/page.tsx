import type { Metadata } from "next";
import { InvoicePageClient } from "./client";

export const metadata: Metadata = {
  title: "Invoice Processing - 청구서/인보이스 처리 | Xenith",
  description:
    "Upload invoices in any language and get a structured expense report. Supports Korean 세금계산서, Japanese 適格請求書, and more. PDF, images, DOCX, HWPX.",
  openGraph: {
    title: "Invoice Processing | Xenith",
    description:
      "AI-powered invoice extraction and expense report generation. Korean, Japanese, and Chinese invoice support.",
  },
  alternates: {
    canonical: "/invoice",
    languages: {
      en: "/invoice",
      ko: "/invoice",
    },
  },
};

export default function InvoicePage() {
  return <InvoicePageClient />;
}
