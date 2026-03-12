import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Xenith - Translate Text, Files & Korean Documents",
    template: "%s | Xenith",
  },
  description:
    "AI-powered translation for text and files. The only translator with native HWPX (한글) support. 20+ languages, PDF, DOCX, HWPX, and OCR.",
  keywords: [
    "translator",
    "HWPX translator",
    "한글 번역",
    "Korean document translation",
    "HWPX to PDF",
    "HWPX converter",
    "file translation",
    "PDF translator",
    "DOCX translator",
    "OCR translation",
    "AI translation",
    "Korean translator",
    "한글 변환",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ko_KR",
    siteName: "Xenith",
    title: "Xenith - Translate Text, Files & Korean Documents",
    description:
      "The only online translator with native HWPX (한글) support. Translate text, PDF, DOCX, and Korean documents across 20+ languages.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Xenith - Translate Text, Files & Korean Documents",
    description:
      "The only online translator with native HWPX (한글) support. 20+ languages, PDF, DOCX, HWPX, and OCR.",
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
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          {/* Sticky bottom anchor ad -- visible on every page */}
          <AnchorAd />
        </Providers>
      </body>
    </html>
  );
}
