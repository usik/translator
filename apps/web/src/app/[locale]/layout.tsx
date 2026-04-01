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

const i18nMeta: Record<string, {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  keywords: string[];
}> = {
  en: {
    title: "Xenith - Translate Text, Files & Korean Documents",
    description:
      "AI-powered Korean document translation and file conversion. The only online tool with native HWP and HWPX (한글) support. Translate text, PDF, DOCX, HWP, and HWPX files between 20+ languages.",
    ogTitle: "Xenith - Translate Text, Files & Korean Documents (HWP/HWPX)",
    ogDescription:
      "The only online tool with native HWP and HWPX (한글) support. Translate and convert Korean documents, PDF, DOCX across 20+ languages.",
    twitterTitle: "Xenith - Translate Text, Files & Korean Documents (HWP/HWPX)",
    twitterDescription:
      "The only online tool with native HWP and HWPX (한글) support. Translate and convert Korean documents across 20+ languages.",
    keywords: [
      "translator",
      "HWP translator",
      "HWPX translator",
      "HWP to PDF",
      "HWP converter",
      "HWPX to PDF",
      "HWPX converter",
      "Korean document translation",
      "file translation",
      "PDF translator",
      "DOCX translator",
      "OCR translation",
      "AI translation",
      "Korean translator",
      "open HWP file online",
      "convert HWP file",
      "한글 번역",
      "한글 변환",
    ],
  },
  ko: {
    title: "Xenith - 텍스트, 파일 및 한국어 문서 번역기",
    description:
      "AI 기반 한국어 문서 번역 및 파일 변환 플랫폼. HWP와 HWPX(한글) 파일을 기본 지원하는 유일한 온라인 도구. PDF, DOCX, HWP, HWPX 파일을 20개 이상의 언어로 번역하세요.",
    ogTitle: "Xenith - 한글(HWP/HWPX) 문서 번역 및 변환",
    ogDescription:
      "HWP와 HWPX 파일을 기본 지원하는 유일한 온라인 번역기. 한국어 문서, PDF, DOCX를 20개 이상의 언어로 번역 및 변환.",
    twitterTitle: "Xenith - 한글(HWP/HWPX) 문서 번역 및 변환",
    twitterDescription:
      "HWP와 HWPX 파일을 기본 지원하는 유일한 온라인 번역기. 20개 이상의 언어 지원.",
    keywords: [
      "한글 번역",
      "한글 번역기",
      "HWP 번역",
      "HWPX 번역",
      "HWP PDF 변환",
      "한글 파일 변환기",
      "한국어 문서 번역",
      "한글 영어 번역",
      "공문서 번역",
      "한글 변환",
      "HWP 변환",
      "HWPX 변환",
      "한글 문서 영어 번역",
      "PDF 번역",
      "AI 번역",
      "OCR 번역",
      "Korean translator",
      "HWP to PDF",
    ],
  },
  ja: {
    title: "Xenith - テキスト・ファイル・韓国語文書の翻訳",
    description:
      "AI搭載の韓国語文書翻訳・ファイル変換プラットフォーム。HWPとHWPX（한글）ファイルをネイティブサポートする唯一のオンラインツール。PDF、DOCX、HWP、HWPXファイルを20以上の言語に翻訳。",
    ogTitle: "Xenith - 韓国語文書（HWP/HWPX）翻訳・変換ツール",
    ogDescription:
      "HWPとHWPXファイルをネイティブサポートする唯一のオンラインツール。韓国語文書、PDF、DOCXを20以上の言語に翻訳・変換。",
    twitterTitle: "Xenith - 韓国語文書（HWP/HWPX）翻訳・変換ツール",
    twitterDescription:
      "HWPとHWPXファイルをネイティブサポートする唯一のオンラインツール。20以上の言語に対応。",
    keywords: [
      "韓国語翻訳",
      "韓国語文書翻訳",
      "HWP翻訳",
      "HWPX翻訳",
      "HWP PDF変換",
      "韓国語ファイル変換",
      "ハングル翻訳",
      "ハングルファイル変換",
      "AI翻訳",
      "OCR翻訳",
      "PDF翻訳",
      "Korean translator",
      "HWP to PDF",
      "HWP converter",
      "한글 번역",
    ],
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
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: "%s | Xenith",
    },
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US",
      alternateLocale: ["en_US", "ko_KR", "ja_JP"].filter(
        (l) => l !== (locale === "ko" ? "ko_KR" : locale === "ja" ? "ja_JP" : "en_US")
      ),
      siteName: "Xenith",
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: `${siteUrl}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitterTitle,
      description: meta.twitterDescription,
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
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#4361EE" },
      { media: "(prefers-color-scheme: dark)", color: "#4361EE" },
    ],
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
