import type { Metadata } from "next";
import { PricingPageClient } from "./client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

const i18nMeta: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  en: {
    title: "Pricing - Xenith Document Translation",
    description:
      "Simple, transparent pricing for Xenith. Free tier included. Credit packs from $5. Pro plans from $9/month with 50 docs/month and format-preserving HWP/HWPX translation.",
    ogTitle: "Xenith Pricing — Translate Korean Documents",
    ogDescription:
      "Free tier + credit packs + pro monthly/annual plans. The only translator with native HWP/HWPX support.",
  },
  ko: {
    title: "요금제 - Xenith 문서 번역",
    description:
      "Xenith의 간단하고 투명한 요금제. 무료 플랜 포함. $5부터 시작하는 크레딧 팩. 월 $9부터 시작하는 Pro 플랜으로 HWP/HWPX 번역 이용.",
    ogTitle: "Xenith 요금제 — 한국어 문서 번역",
    ogDescription:
      "무료 플랜 + 크레딧 팩 + 월정액/연간 Pro 플랜. HWP/HWPX를 기본 지원하는 유일한 번역기.",
  },
  ja: {
    title: "料金プラン - Xenith 文書翻訳",
    description:
      "Xenithのシンプルで透明な料金体系。無料プランあり。クレジットパックは$5から。月$9からのProプランでHWP/HWPX翻訳利用可能。",
    ogTitle: "Xenith 料金プラン — 韓国語文書翻訳",
    ogDescription:
      "無料プラン＋クレジットパック＋月額/年額Proプラン。HWP/HWPXをネイティブサポートする唯一の翻訳ツール。",
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
      canonical: `${siteUrl}/en/pricing`,
      languages: {
        en: `${siteUrl}/en/pricing`,
        ko: `${siteUrl}/ko/pricing`,
        ja: `${siteUrl}/ja/pricing`,
      },
    },
  };
}

// JSON-LD: PriceSpecification for all plans
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Xenith Pricing",
  url: `${siteUrl}/en/pricing`,
  description:
    "Pricing plans for Xenith — the only online document translation tool with native HWP and HWPX (한글) support.",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "Xenith",
    applicationCategory: "UtilitiesApplication",
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        description: "3 documents per day, text translation unlimited",
        price: "0",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Offer",
        name: "Credit Pack S",
        description: "25 document credits, never expire",
        price: "5",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "5",
          priceCurrency: "USD",
          unitText: "one-time",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: "25",
            unitText: "documents",
          },
        },
      },
      {
        "@type": "Offer",
        name: "Credit Pack L",
        description: "100 document credits, never expire",
        price: "15",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "15",
          priceCurrency: "USD",
          unitText: "one-time",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: "100",
            unitText: "documents",
          },
        },
      },
      {
        "@type": "Offer",
        name: "Pro Monthly",
        description: "50 documents/month, $0.15/doc overage, all formats",
        price: "9",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "9",
          priceCurrency: "USD",
          unitText: "month",
          billingDuration: {
            "@type": "QuantitativeValue",
            value: "1",
            unitCode: "MON",
          },
        },
      },
      {
        "@type": "Offer",
        name: "Pro Annual",
        description: "50 documents/month, $0.12/doc overage, all formats — best value",
        price: "79",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "79",
          priceCurrency: "USD",
          unitText: "year",
          billingDuration: {
            "@type": "QuantitativeValue",
            value: "1",
            unitCode: "ANN",
          },
        },
      },
    ],
  },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingPageClient />
    </>
  );
}
