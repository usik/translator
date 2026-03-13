import type { Metadata } from "next";
import { HomePageClient } from "./home-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        ko: `${siteUrl}/ko`,
        ja: `${siteUrl}/ja`,
      },
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Xenith",
  url: siteUrl,
  description:
    "AI-powered translation for text and files. The only translator with native HWPX (\ud55c\uae00) support. 20+ languages, PDF, DOCX, HWPX, and OCR.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  softwareVersion: "1.0",
  inLanguage: ["en", "ko", "ja", "zh", "es", "fr", "de"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "HWPX (\ud55c\uae00) document translation and conversion",
    "PDF, DOCX, TXT file translation",
    "20+ language support",
    "OCR text extraction from images",
    "HWPX to PDF conversion",
    "PDF to DOCX conversion",
  ],
  screenshot: `${siteUrl}/og-image.png`,
  aggregateRating: undefined,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Xenith",
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
};

export default function HomePage() {
  // Remove undefined keys (like aggregateRating) before serializing
  const cleanJsonLd = JSON.parse(
    JSON.stringify(jsonLd, (_, v) => (v === undefined ? undefined : v))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <HomePageClient />
    </>
  );
}
