import type { Metadata } from "next";
import { ConvertSlugClient } from "./client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

const seoData: Record<string, Record<string, { title: string; description: string }>> = {
  "hwpx-to-pdf": {
    en: {
      title: "Convert HWPX to PDF Online - Korean 한글 Document Converter | 한글 PDF 변환",
      description: "Convert HWPX (한글) files to PDF online for free. The only tool with native Korean document support. No software installation required.",
    },
    ko: {
      title: "HWPX를 PDF로 변환 - 한글 문서 변환기",
      description: "한글(HWPX) 파일을 PDF로 무료 변환. 소프트웨어 설치 없이 온라인에서 바로 변환하세요. 한글 파일을 기본 지원하는 유일한 온라인 도구.",
    },
    ja: {
      title: "HWPXをPDFに変換 - 韓国語한글文書変換",
      description: "HWPX（한글）ファイルを無料でPDFにオンライン変換。ソフトウェアのインストール不要。韓国語文書をネイティブサポートする唯一のツール。",
    },
  },
  "hwpx-to-txt": {
    en: {
      title: "Extract Text from HWPX - Korean 한글 Text Extractor | 한글 텍스트 추출",
      description: "Extract text from HWPX (한글) documents online for free. Read Korean government and business documents without installing Hancom Office software.",
    },
    ko: {
      title: "HWPX에서 텍스트 추출 - 한글 텍스트 추출기",
      description: "한글(HWPX) 문서에서 텍스트를 무료로 추출하세요. 한컴오피스 설치 없이 공문서를 읽을 수 있습니다.",
    },
    ja: {
      title: "HWPXからテキスト抽出 - 韓国語한글テキスト抽出",
      description: "HWPX（한글）文書から無料でテキストを抽出。Hancom Officeのインストール不要で韓国語文書を読めます。",
    },
  },
  "hwp-to-pdf": {
    en: {
      title: "Convert HWP to PDF Online - Korean 한글 Document Converter | 한글 PDF 변환",
      description: "Convert legacy HWP (한글) binary files to PDF online for free. The only tool with native Korean HWP document support.",
    },
    ko: {
      title: "HWP를 PDF로 변환 - 한글 파일 PDF 변환기",
      description: "한글 파일(.hwp)을 PDF로 무료 변환하세요. 한컴오피스 없이 온라인에서 바로 변환. HWP 파일을 기본 지원하는 유일한 온라인 도구.",
    },
    ja: {
      title: "HWPをPDFに変換 - 韓国語한글文書変換",
      description: "レガシーHWP（한글）ファイルを無料でPDFにオンライン変換。HWPファイルをネイティブサポートする唯一のオンラインツール。",
    },
  },
  "hwp-to-txt": {
    en: {
      title: "Extract Text from HWP - Korean 한글 Text Extractor | 한글 텍스트 추출",
      description: "Extract text from legacy HWP (한글) binary documents online for free. Read Korean government and business documents without installing Hancom Office.",
    },
    ko: {
      title: "HWP에서 텍스트 추출 - 한글 텍스트 추출기",
      description: "한글 문서(.hwp)에서 텍스트를 무료로 추출하세요. 한컴오피스 설치 없이 공문서와 비즈니스 문서를 읽을 수 있습니다.",
    },
    ja: {
      title: "HWPからテキスト抽出 - 韓国語한글テキスト抽出",
      description: "レガシーHWP（한글）文書から無料でテキストを抽出。Hancom Officeなしで韓国政府・ビジネス文書を読めます。",
    },
  },
  "pdf-to-docx": {
    en: {
      title: "Convert PDF to DOCX Online - Free PDF to Word Converter",
      description: "Convert PDF files to editable Word (DOCX) format online for free. Fast, accurate AI-powered conversion that preserves formatting and layout.",
    },
    ko: {
      title: "PDF를 DOCX로 변환 - 무료 PDF to Word 변환기",
      description: "PDF 파일을 편집 가능한 Word(DOCX) 형식으로 무료 변환. AI 기반의 빠르고 정확한 변환으로 서식과 레이아웃을 유지합니다.",
    },
    ja: {
      title: "PDFをDOCXに変換 - 無料PDF to Word変換",
      description: "PDFファイルを編集可能なWord（DOCX）形式に無料でオンライン変換。AI搭載の高速・高精度変換でフォーマットとレイアウトを保持。",
    },
  },
  "docx-to-pdf": {
    en: {
      title: "Convert DOCX to PDF Online - Free Word to PDF Converter",
      description: "Convert Word (DOCX) documents to PDF format online for free. Preserve formatting, fonts, and layout with fast AI-powered conversion.",
    },
    ko: {
      title: "DOCX를 PDF로 변환 - 무료 Word to PDF 변환기",
      description: "Word(DOCX) 문서를 PDF 형식으로 무료 변환. AI 기반 변환으로 서식, 글꼴, 레이아웃을 유지합니다.",
    },
    ja: {
      title: "DOCXをPDFに変換 - 無料Word to PDF変換",
      description: "Word（DOCX）文書を無料でPDFにオンライン変換。AI搭載の変換でフォーマット、フォント、レイアウトを保持。",
    },
  },
  "pdf-to-txt": {
    en: {
      title: "Extract Text from PDF Online - Free PDF Text Extractor",
      description: "Extract text content from PDF files online for free. Powered by AI for accurate extraction from scanned documents, tables, and complex layouts.",
    },
    ko: {
      title: "PDF에서 텍스트 추출 - 무료 PDF 텍스트 추출기",
      description: "PDF 파일에서 텍스트를 무료로 추출. AI 기반으로 스캔 문서, 표, 복잡한 레이아웃에서도 정확하게 추출합니다.",
    },
    ja: {
      title: "PDFからテキスト抽出 - 無料PDFテキスト抽出",
      description: "PDFファイルから無料でテキストを抽出。AI搭載でスキャン文書、表、複雑なレイアウトからも正確に抽出。",
    },
  },
  "docx-to-txt": {
    en: {
      title: "Extract Text from DOCX Online - Free Word Text Extractor",
      description: "Extract plain text from Word (DOCX) documents online for free. Handles tables, paragraphs, headers, and complex document layouts accurately.",
    },
    ko: {
      title: "DOCX에서 텍스트 추출 - 무료 Word 텍스트 추출기",
      description: "Word(DOCX) 문서에서 텍스트를 무료로 추출. 표, 단락, 머리글 및 복잡한 문서 레이아웃을 정확하게 처리합니다.",
    },
    ja: {
      title: "DOCXからテキスト抽出 - 無料Wordテキスト抽出",
      description: "Word（DOCX）文書から無料でテキストを抽出。表、段落、ヘッダー、複雑なレイアウトを正確に処理。",
    },
  },
  "image-to-txt": {
    en: {
      title: "Image to Text (OCR) Online - Free Image Text Extractor",
      description: "Extract text from images using AI-powered OCR. Supports PNG, JPG, WebP, BMP, and TIFF. Fast and accurate text recognition in 20+ languages.",
    },
    ko: {
      title: "이미지에서 텍스트 추출 (OCR) - 무료 이미지 텍스트 추출기",
      description: "AI 기반 OCR로 이미지에서 텍스트를 추출. PNG, JPG, WebP, BMP, TIFF 지원. 20개 이상의 언어에서 빠르고 정확한 텍스트 인식.",
    },
    ja: {
      title: "画像からテキスト抽出（OCR） - 無料画像テキスト抽出",
      description: "AI搭載OCRで画像からテキストを抽出。PNG、JPG、WebP、BMP、TIFFに対応。20以上の言語で高速・高精度なテキスト認識。",
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const slugData = seoData[slug];
  const data = slugData?.[locale] || slugData?.en;

  if (!data) {
    return { title: "Conversion Tool" };
  }

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
    },
    alternates: {
      canonical: `/convert/${slug}`,
      languages: {
        en: `/convert/${slug}`,
        ko: `/convert/${slug}`,
        ja: `/convert/${slug}`,
      },
    },
  };
}

type HowToEntry = { name: string; steps: string[] };

const howToByLocale: Record<string, Record<string, HowToEntry>> = {
  en: {
    "hwp-to-pdf": {
      name: "How to Convert HWP to PDF Online",
      steps: [
        "Go to tryxenith.com/convert/hwp-to-pdf",
        "Upload your .hwp (Korean \ud55c\uae00) file by clicking or dragging",
        "Click the Convert button",
        "Download the converted PDF file",
      ],
    },
    "hwp-to-txt": {
      name: "How to Extract Text from an HWP File",
      steps: [
        "Go to tryxenith.com/convert/hwp-to-txt",
        "Upload your .hwp (Korean \ud55c\uae00) file by clicking or dragging",
        "Click the Convert button",
        "Download the extracted text file",
      ],
    },
    "hwpx-to-pdf": {
      name: "How to Convert HWPX to PDF Online",
      steps: [
        "Go to tryxenith.com/convert/hwpx-to-pdf",
        "Upload your .hwpx (Korean \ud55c\uae00) file by clicking or dragging",
        "Click the Convert button",
        "Download the converted PDF file",
      ],
    },
    "hwpx-to-txt": {
      name: "How to Extract Text from an HWPX File",
      steps: [
        "Go to tryxenith.com/convert/hwpx-to-txt",
        "Upload your .hwpx (Korean \ud55c\uae00) file by clicking or dragging",
        "Click the Convert button",
        "Download the extracted text file",
      ],
    },
    "pdf-to-docx": {
      name: "How to Convert PDF to Word (DOCX) Online",
      steps: [
        "Go to tryxenith.com/convert/pdf-to-docx",
        "Upload your PDF file by clicking or dragging",
        "Click the Convert button",
        "Download the editable Word (DOCX) file",
      ],
    },
    "docx-to-pdf": {
      name: "How to Convert Word (DOCX) to PDF Online",
      steps: [
        "Go to tryxenith.com/convert/docx-to-pdf",
        "Upload your Word document by clicking or dragging",
        "Click the Convert button",
        "Download the PDF file",
      ],
    },
    "image-to-txt": {
      name: "How to Extract Text from an Image (OCR)",
      steps: [
        "Go to tryxenith.com/convert/image-to-txt",
        "Upload your image (PNG, JPG, WebP, BMP, or TIFF)",
        "Click the Convert button",
        "Download the extracted text file",
      ],
    },
  },
  ko: {
    "hwp-to-pdf": {
      name: "HWP를 PDF로 변환하는 방법",
      steps: [
        "tryxenith.com/convert/hwp-to-pdf에 접속",
        ".hwp(한글) 파일을 클릭하거나 드래그하여 업로드",
        "변환 버튼 클릭",
        "변환된 PDF 파일 다운로드",
      ],
    },
    "hwp-to-txt": {
      name: "HWP 파일에서 텍스트를 추출하는 방법",
      steps: [
        "tryxenith.com/convert/hwp-to-txt에 접속",
        ".hwp(한글) 파일을 클릭하거나 드래그하여 업로드",
        "변환 버튼 클릭",
        "추출된 텍스트 파일 다운로드",
      ],
    },
    "hwpx-to-pdf": {
      name: "HWPX를 PDF로 변환하는 방법",
      steps: [
        "tryxenith.com/convert/hwpx-to-pdf에 접속",
        ".hwpx(한글) 파일을 클릭하거나 드래그하여 업로드",
        "변환 버튼 클릭",
        "변환된 PDF 파일 다운로드",
      ],
    },
    "hwpx-to-txt": {
      name: "HWPX 파일에서 텍스트를 추출하는 방법",
      steps: [
        "tryxenith.com/convert/hwpx-to-txt에 접속",
        ".hwpx(한글) 파일을 클릭하거나 드래그하여 업로드",
        "변환 버튼 클릭",
        "추출된 텍스트 파일 다운로드",
      ],
    },
    "pdf-to-docx": {
      name: "PDF를 Word(DOCX)로 변환하는 방법",
      steps: [
        "tryxenith.com/convert/pdf-to-docx에 접속",
        "PDF 파일을 클릭하거나 드래그하여 업로드",
        "변환 버튼 클릭",
        "편집 가능한 Word(DOCX) 파일 다운로드",
      ],
    },
    "docx-to-pdf": {
      name: "Word(DOCX)를 PDF로 변환하는 방법",
      steps: [
        "tryxenith.com/convert/docx-to-pdf에 접속",
        "Word 문서를 클릭하거나 드래그하여 업로드",
        "변환 버튼 클릭",
        "PDF 파일 다운로드",
      ],
    },
    "image-to-txt": {
      name: "이미지에서 텍스트를 추출하는 방법 (OCR)",
      steps: [
        "tryxenith.com/convert/image-to-txt에 접속",
        "이미지(PNG, JPG, WebP, BMP, TIFF)를 업로드",
        "변환 버튼 클릭",
        "추출된 텍스트 파일 다운로드",
      ],
    },
  },
  ja: {
    "hwp-to-pdf": {
      name: "HWPをPDFに変換する方法",
      steps: [
        "tryxenith.com/convert/hwp-to-pdfにアクセス",
        ".hwp（한글）ファイルをクリックまたはドラッグしてアップロード",
        "変換ボタンをクリック",
        "変換されたPDFファイルをダウンロード",
      ],
    },
    "hwp-to-txt": {
      name: "HWPファイルからテキストを抽出する方法",
      steps: [
        "tryxenith.com/convert/hwp-to-txtにアクセス",
        ".hwp（한글）ファイルをクリックまたはドラッグしてアップロード",
        "変換ボタンをクリック",
        "抽出されたテキストファイルをダウンロード",
      ],
    },
    "hwpx-to-pdf": {
      name: "HWPXをPDFに変換する方法",
      steps: [
        "tryxenith.com/convert/hwpx-to-pdfにアクセス",
        ".hwpx（한글）ファイルをクリックまたはドラッグしてアップロード",
        "変換ボタンをクリック",
        "変換されたPDFファイルをダウンロード",
      ],
    },
    "hwpx-to-txt": {
      name: "HWPXファイルからテキストを抽出する方法",
      steps: [
        "tryxenith.com/convert/hwpx-to-txtにアクセス",
        ".hwpx（한글）ファイルをクリックまたはドラッグしてアップロード",
        "変換ボタンをクリック",
        "抽出されたテキストファイルをダウンロード",
      ],
    },
    "pdf-to-docx": {
      name: "PDFをWord（DOCX）に変換する方法",
      steps: [
        "tryxenith.com/convert/pdf-to-docxにアクセス",
        "PDFファイルをクリックまたはドラッグしてアップロード",
        "変換ボタンをクリック",
        "編集可能なWord（DOCX）ファイルをダウンロード",
      ],
    },
    "docx-to-pdf": {
      name: "Word（DOCX）をPDFに変換する方法",
      steps: [
        "tryxenith.com/convert/docx-to-pdfにアクセス",
        "Word文書をクリックまたはドラッグしてアップロード",
        "変換ボタンをクリック",
        "PDFファイルをダウンロード",
      ],
    },
    "image-to-txt": {
      name: "画像からテキストを抽出する方法（OCR）",
      steps: [
        "tryxenith.com/convert/image-to-txtにアクセス",
        "画像（PNG、JPG、WebP、BMP、TIFF）をアップロード",
        "変換ボタンをクリック",
        "抽出されたテキストファイルをダウンロード",
      ],
    },
  },
};

function getHowToJsonLd(slug: string, locale: string) {
  const localeData = howToByLocale[locale] || howToByLocale.en;
  const data = localeData[slug];
  if (!data) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    step: data.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
    tool: { "@type": "HowToTool", name: "Xenith (tryxenith.com)" },
    supply: [],
    totalTime: "PT1M",
  };
}

function getBreadcrumbJsonLd(slug: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Conversion Tools",
        item: `${siteUrl}/convert`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteUrl}/convert/${slug}`,
      },
    ],
  };
}

export default async function ConvertSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const slugData = seoData[slug];
  const data = slugData?.[locale] || slugData?.en;
  const breadcrumbTitle = data?.title.split(" - ")[0] || "Conversion Tool";
  const breadcrumbJsonLd = getBreadcrumbJsonLd(slug, breadcrumbTitle);
  const howToJsonLd = getHowToJsonLd(slug, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToJsonLd),
          }}
        />
      )}
      <ConvertSlugClient />
    </>
  );
}
