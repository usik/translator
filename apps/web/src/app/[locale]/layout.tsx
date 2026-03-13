import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AnchorAd } from "@/components/anchor-ad";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Xenith - Translate Text, Files & Korean Documents",
      template: "%s | Xenith",
    },
    description:
      "AI-powered translation for text and files. The only translator with native HWPX (\ud55c\uae00) support. 20+ languages, PDF, DOCX, HWPX, and OCR.",
    keywords: [
      "translator",
      "HWPX translator",
      "\ud55c\uae00 \ubc88\uc5ed",
      "Korean document translation",
      "HWPX to PDF",
      "HWPX converter",
      "file translation",
      "PDF translator",
      "DOCX translator",
      "OCR translation",
      "AI translation",
      "Korean translator",
      "\ud55c\uae00 \ubcc0\ud658",
      "\ud55c\uae00 \ubc88\uc5ed\uae30",
      "HWPX \uc601\uc5b4 \ubc88\uc5ed",
      "\ud55c\uae00 \ud30c\uc77c \ubcc0\ud658\uae30",
      "\ud55c\uad6d\uc5b4 \ubb38\uc11c \ubc88\uc5ed",
      "\ud55c\uae00 PDF \ubcc0\ud658",
      "HWPX \ubcc0\ud658",
      "\ud55c\uae00 \ubb38\uc11c \uc601\uc5b4 \ubc88\uc5ed",
      "\uacf5\ubb38\uc11c \ubc88\uc5ed",
    ],
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: ["en_US", "ko_KR", "ja_JP"].filter(
        (l) => l !== (locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US")
      ),
      siteName: "Xenith",
      title: "Xenith - Translate Text, Files & Korean Documents",
      description:
        "The only online translator with native HWPX (\ud55c\uae00) support. Translate text, PDF, DOCX, and Korean documents across 20+ languages. \ud55c\uae00 \ubb38\uc11c \ubc88\uc5ed \ubc0f HWPX \ud30c\uc77c \ubcc0\ud658\uc744 \uc9c0\uc6d0\ud558\ub294 \uc720\uc77c\ud55c \uc628\ub77c\uc778 \ubc88\uc5ed\uae30.",
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: "Xenith - Translate Text, Files & Korean Documents",
      description:
        "The only online translator with native HWPX (\ud55c\uae00) support. 20+ languages, PDF, DOCX, HWPX, and OCR.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
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

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta
          name="naver-site-verification"
          content="2db42bf6b0c7c79a1d5a5b5fe27dc0fd57cf2515"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {/* Google AdSense -- only loaded when the publisher ID is configured */}
        {adsenseClientId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            {/* Sticky bottom anchor ad -- visible on every page */}
            <AnchorAd />
          </Providers>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
