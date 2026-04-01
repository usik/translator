import type { Metadata } from "next";
import { TranslateSlugClient } from "./client";
import { getAllSlugs, getSlugData } from "@/data/translate-slugs";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

function getSoftwareAppJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Xenith",
    url: siteUrl,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "HWP file translation without Hancom Office",
      "HWPX file translation with format preservation",
      "Korean PDF translation with layout preservation",
      "Korean to English translation",
      "Korean to Japanese translation",
      "Korean to Chinese translation",
      "Format-preserving document translation",
    ],
  };
}

function getFaqJsonLd(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

function getBreadcrumbJsonLd(slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Translate", item: `${siteUrl}/translate` },
      { "@type": "ListItem", position: 3, name: title, item: `${siteUrl}/translate/${slug}` },
    ],
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = getSlugData(slug);
  if (!data) return { title: "Translator" };

  const seo = data.seo[locale as "en" | "ko" | "ja"] ?? data.seo.en;

  return {
    title: seo.title,
    description: seo.description,
    openGraph: { title: seo.title, description: seo.description },
    alternates: {
      canonical: `/translate/${slug}`,
      languages: { en: `/translate/${slug}`, ko: `/translate/${slug}`, ja: `/translate/${slug}` },
    },
  };
}

export default async function TranslateSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = getSlugData(slug);

  if (!data) {
    return <TranslateSlugClient />;
  }

  const seo = data.seo[locale as "en" | "ko" | "ja"] ?? data.seo.en;
  const breadcrumbJsonLd = getBreadcrumbJsonLd(slug, seo.h1);
  const faqJsonLd = data.faqs.length > 0 ? getFaqJsonLd(data.faqs) : null;
  const softwareAppJsonLd = getSoftwareAppJsonLd(seo.description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <TranslateSlugClient />
    </>
  );
}
