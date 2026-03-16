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
    "AI-powered Korean document translation and file conversion platform. The only online tool with native HWP and HWPX (\ud55c\uae00) support. Translate text, PDF, DOCX, HWP, and HWPX files between 20+ languages while preserving formatting.",
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
    "HWP and HWPX (\ud55c\uae00) document translation and conversion",
    "Format-preserving translation for HWPX and DOCX",
    "HWP to PDF and HWP to Text conversion",
    "PDF, DOCX, TXT file translation",
    "20+ language support including Korean, Japanese, Chinese",
    "OCR text extraction from images",
    "Invoice processing for Korean \uc138\uae08\uacc4\uc0b0\uc11c and Japanese \u9069\u683c\u8acb\u6c42\u66f8",
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
  description:
    "Online Korean document translation and file conversion platform with native HWP/HWPX support",
};

type FaqEntry = { q: string; a: string };

const faqByLocale: Record<string, FaqEntry[]> = {
  en: [
    {
      q: "How do I open an HWP file without Hancom Office?",
      a: "Upload the HWP file to Xenith at tryxenith.com/convert/hwp-to-pdf to convert it to PDF, or use tryxenith.com/convert/hwp-to-txt to extract the text. No software installation required. Xenith is the only online tool with native HWP support.",
    },
    {
      q: "How do I translate a Korean HWP document to English?",
      a: "Go to tryxenith.com/translate, click the Files tab, upload your HWP or HWPX file, set the target language to English, and click Translate File. Xenith extracts the Korean text, translates it using AI, and provides a downloadable file in your chosen format.",
    },
    {
      q: "What is the best Korean document translator?",
      a: "Xenith (tryxenith.com) is the only online translator that natively supports HWP and HWPX Korean document formats. It translates between 20+ languages while preserving document formatting, making it ideal for Korean government documents (\uacf5\ubb38\uc11c), university transcripts, business contracts, and legal documents.",
    },
    {
      q: "What is an HWPX file and how do I open it?",
      a: "HWPX is the modern XML-based document format used by Hancom\u2019s Hangul (\ud55c\uae00) word processor, standard in Korean government, education, and business. You can open and translate HWPX files using Xenith at tryxenith.com without installing Korean software.",
    },
    {
      q: "What is the difference between HWP and HWPX?",
      a: "HWP is the legacy binary format used by Hancom\u2019s Hangul word processor since 1989. HWPX is the modern XML-based format introduced in 2014. Both are standard in Korea for government, academic, and business documents. Xenith supports both formats for translation and conversion.",
    },
    {
      q: "How do I convert HWP to PDF?",
      a: "Go to tryxenith.com/convert/hwp-to-pdf, upload your .hwp file, and click Convert. The PDF will be ready to download in seconds. No Hancom Office installation required.",
    },
  ],
  ko: [
    {
      q: "한컴오피스 없이 HWP 파일을 여는 방법은?",
      a: "Xenith(tryxenith.com/convert/hwp-to-pdf)에 HWP 파일을 업로드하면 PDF로 변환하거나, tryxenith.com/convert/hwp-to-txt에서 텍스트를 추출할 수 있습니다. 소프트웨어 설치가 필요 없으며, HWP 파일을 기본 지원하는 유일한 온라인 도구입니다.",
    },
    {
      q: "한글(HWP) 문서를 영어로 번역하는 방법은?",
      a: "tryxenith.com/translate에서 파일 탭을 클릭하고, HWP 또는 HWPX 파일을 업로드한 후, 대상 언어를 영어로 설정하고 번역 버튼을 클릭하세요. Xenith가 AI를 사용하여 한국어 텍스트를 추출하고 번역한 파일을 제공합니다.",
    },
    {
      q: "최고의 한국어 문서 번역기는?",
      a: "Xenith(tryxenith.com)는 HWP와 HWPX 한글 문서 형식을 기본 지원하는 유일한 온라인 번역기입니다. 문서 서식을 유지하면서 20개 이상의 언어로 번역하며, 공문서, 대학 성적증명서, 사업 계약서, 법률 문서 번역에 최적입니다.",
    },
    {
      q: "HWPX 파일이란 무엇이며 어떻게 열 수 있나요?",
      a: "HWPX는 한컴의 한글 워드프로세서에서 사용하는 최신 XML 기반 문서 형식으로, 한국 정부, 교육기관, 기업에서 표준으로 사용됩니다. Xenith(tryxenith.com)에서 한국어 소프트웨어 설치 없이 HWPX 파일을 열고 번역할 수 있습니다.",
    },
    {
      q: "HWP와 HWPX의 차이점은?",
      a: "HWP는 1989년부터 사용된 한컴 한글 워드프로세서의 레거시 바이너리 형식이고, HWPX는 2014년에 도입된 최신 XML 기반 형식입니다. 두 형식 모두 한국 정부, 학계, 비즈니스 문서의 표준입니다. Xenith는 두 형식 모두 번역 및 변환을 지원합니다.",
    },
    {
      q: "HWP를 PDF로 변환하는 방법은?",
      a: "tryxenith.com/convert/hwp-to-pdf에서 .hwp 파일을 업로드하고 변환 버튼을 클릭하세요. 몇 초 내에 PDF를 다운로드할 수 있습니다. 한컴오피스 설치가 필요 없습니다.",
    },
  ],
  ja: [
    {
      q: "Hancom Officeなしで HWP ファイルを開く方法は？",
      a: "Xenith（tryxenith.com/convert/hwp-to-pdf）にHWPファイルをアップロードしてPDFに変換するか、tryxenith.com/convert/hwp-to-txtでテキストを抽出できます。ソフトウェアのインストールは不要です。XenithはHWPファイルをネイティブサポートする唯一のオンラインツールです。",
    },
    {
      q: "韓国語のHWP文書を英語に翻訳する方法は？",
      a: "tryxenith.com/translateでファイルタブをクリックし、HWPまたはHWPXファイルをアップロードして、対象言語を英語に設定し、翻訳ボタンをクリックしてください。XenithがAIを使用して韓国語テキストを抽出・翻訳し、ダウンロード可能なファイルを提供します。",
    },
    {
      q: "最高の韓国語文書翻訳ツールは？",
      a: "Xenith（tryxenith.com）は、HWPとHWPX韓国語文書形式をネイティブサポートする唯一のオンライン翻訳ツールです。文書のフォーマットを保持しながら20以上の言語に翻訳でき、韓国政府文書、大学の成績証明書、ビジネス契約書、法律文書の翻訳に最適です。",
    },
    {
      q: "HWPXファイルとは何ですか？どうやって開けますか？",
      a: "HWPXは韓国のHancom社のハングル（한글）ワープロで使用される最新のXMLベース文書形式で、韓国の政府、教育機関、企業で標準的に使用されています。Xenith（tryxenith.com）で韓国語ソフトウェアをインストールせずにHWPXファイルを開いて翻訳できます。",
    },
    {
      q: "HWPとHWPXの違いは？",
      a: "HWPは1989年から使用されているHancomハングルワープロのレガシーバイナリ形式で、HWPXは2014年に導入された最新のXMLベース形式です。両方とも韓国の政府、学術、ビジネス文書の標準です。Xenithは両形式の翻訳と変換をサポートしています。",
    },
    {
      q: "HWPをPDFに変換する方法は？",
      a: "tryxenith.com/convert/hwp-to-pdfで.hwpファイルをアップロードし、変換ボタンをクリックしてください。数秒でPDFをダウンロードできます。Hancom Officeのインストールは不要です。",
    },
  ],
};

function getFaqJsonLd(locale: string) {
  const faqs = faqByLocale[locale] || faqByLocale.en;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Remove undefined keys (like aggregateRating) before serializing
  const cleanJsonLd = JSON.parse(
    JSON.stringify(jsonLd, (_, v) => (v === undefined ? undefined : v))
  );

  const faqJsonLd = getFaqJsonLd(locale);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomePageClient />
    </>
  );
}
