import type { Metadata } from "next";
import { ConvertSlugClient } from "./client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xenith.app";

const seoData: Record<string, { title: string; description: string }> = {
  "hwpx-to-pdf": {
    title: "Convert HWPX to PDF Online - Korean 한글 Document Converter",
    description:
      "Convert HWPX (한글) files to PDF online for free. The only tool with native Korean document support. No software installation required.",
  },
  "hwpx-to-txt": {
    title: "Extract Text from HWPX - Korean 한글 Text Extractor",
    description:
      "Extract text from HWPX (한글) documents online for free. Read Korean government and business documents without installing Hancom Office software.",
  },
  "pdf-to-docx": {
    title: "Convert PDF to DOCX Online - Free PDF to Word Converter",
    description:
      "Convert PDF files to editable Word (DOCX) format online for free. Fast, accurate AI-powered conversion that preserves formatting and layout.",
  },
  "docx-to-pdf": {
    title: "Convert DOCX to PDF Online - Free Word to PDF Converter",
    description:
      "Convert Word (DOCX) documents to PDF format online for free. Preserve formatting, fonts, and layout with fast AI-powered conversion.",
  },
  "pdf-to-txt": {
    title: "Extract Text from PDF Online - Free PDF Text Extractor",
    description:
      "Extract text content from PDF files online for free. Powered by AI for accurate extraction from scanned documents, tables, and complex layouts.",
  },
  "docx-to-txt": {
    title: "Extract Text from DOCX Online - Free Word Text Extractor",
    description:
      "Extract plain text from Word (DOCX) documents online for free. Handles tables, paragraphs, headers, and complex document layouts accurately.",
  },
  "image-to-txt": {
    title: "Image to Text (OCR) Online - Free Image Text Extractor",
    description:
      "Extract text from images using AI-powered OCR. Supports PNG, JPG, WebP, BMP, and TIFF. Fast and accurate text recognition in 20+ languages.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = seoData[slug];

  if (!data) {
    return { title: "Conversion Tool" };
  }

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: `${data.title} | Xenith`,
      description: data.description,
    },
    alternates: {
      canonical: `/convert/${slug}`,
    },
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = seoData[slug];
  const breadcrumbTitle = data?.title.split(" - ")[0] || "Conversion Tool";
  const breadcrumbJsonLd = getBreadcrumbJsonLd(slug, breadcrumbTitle);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <ConvertSlugClient />
    </>
  );
}
