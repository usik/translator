"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TranslatorWidget } from "@/components/translator-widget";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/ad-config";
import { useTranslatorStore } from "@/lib/store";
import { translateSlugs } from "@/data/translate-slugs";

// ── Legacy inline configs kept for reference; replaced by translateSlugs ─────
// All slug data is now driven from @/data/translate-slugs.ts

type SlugConfig = {
  h1: string;
  subheading: string;
  sourceLang: string;
  targetLang: string;
  relatedLinks: Array<{ href: string; label: string }>;
  faqs: Array<{ q: string; a: string }>;
};

const slugConfigs: Record<string, SlugConfig> = {
  "hwpx-to-english": {
    h1: "HWPX to English Translator",
    subheading:
      "Translate Korean 한글 HWPX documents to English online — format preserved, no software required.",
    sourceLang: "ko",
    targetLang: "en",
    relatedLinks: [
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwp-translator", label: "HWP File Translator" },
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
      { href: "/convert/hwpx-to-docx", label: "Convert HWPX to DOCX" },
    ],
    faqs: [
      {
        q: "What is an HWPX file?",
        a: "HWPX is the modern XML-based format used by Hancom Office (한글), South Korea's most widely used word processor. It is commonly used in Korean government, education, and business documents.",
      },
      {
        q: "Can I translate HWPX files without installing Hancom Office?",
        a: "Yes. Xenith is the only online tool with native HWPX support. You can translate HWPX documents directly in your browser — no software installation required.",
      },
      {
        q: "Does Xenith preserve formatting when translating HWPX to English?",
        a: "Yes. Xenith uses a format-preserving pipeline that extracts text, translates it, and reconstructs the original document structure — keeping fonts, tables, and layout intact.",
      },
      {
        q: "Is HWPX translation free?",
        a: "Xenith offers free translation for text and documents. Upload your HWPX file and translate to English at no cost.",
      },
      {
        q: "What languages can I translate HWPX files into?",
        a: "Xenith supports 20+ languages including English, Japanese, Chinese, Spanish, French, German, and more.",
      },
    ],
  },
  "korean-document": {
    h1: "Korean Document Translation Online",
    subheading:
      "Upload any Korean document — HWP, HWPX, PDF, or DOCX — and get an accurate translation with your formatting intact.",
    sourceLang: "ko",
    targetLang: "en",
    relatedLinks: [
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/hwp-translator", label: "HWP File Translator" },
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
    ],
    faqs: [
      {
        q: "What Korean document formats does Xenith support?",
        a: "Xenith supports HWP, HWPX (한글), PDF, DOCX, TXT, and image files. It is the only online translator with native HWP/HWPX support.",
      },
      {
        q: "Will my document's formatting be preserved after translation?",
        a: "Yes. For HWPX and DOCX files, Xenith uses a format-preserving pipeline that maintains your original layout, tables, fonts, and styles after translation.",
      },
      {
        q: "Can I translate Korean government documents online?",
        a: "Yes. Korean government documents are typically in HWP or HWPX format. Xenith can open and translate these without any software installation.",
      },
      {
        q: "How accurate is Korean document translation?",
        a: "Xenith uses Gemini AI for translation, providing high-quality, context-aware translations for Korean documents.",
      },
      {
        q: "Is there a file size limit for Korean document translation?",
        a: "Xenith supports document uploads up to 50MB. For very large documents, splitting into sections may improve speed.",
      },
    ],
  },
  "hwp-translator": {
    h1: "HWP File Translator",
    subheading:
      "Translate Korean HWP documents online — no Hancom Office required, no formatting lost.",
    sourceLang: "ko",
    targetLang: "en",
    relatedLinks: [
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/convert/hwp-to-pdf", label: "Convert HWP to PDF" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
      { href: "/convert/hwpx-to-docx", label: "Convert HWPX to DOCX" },
    ],
    faqs: [
      {
        q: "What is an HWP file?",
        a: "HWP is the legacy binary format used by Hancom Office (한글), South Korea's most popular word processor. It has been used since the 1990s and remains common in Korean official and business documents.",
      },
      {
        q: "How do I translate an HWP file without Hancom Office?",
        a: "Upload your HWP file to Xenith. Our tool reads the HWP binary format natively and translates the content without requiring Hancom Office or any other software.",
      },
      {
        q: "What is the difference between HWP and HWPX?",
        a: "HWP is the older binary format while HWPX is the newer XML-based format for Hancom Office documents. Xenith supports both formats for translation and conversion.",
      },
      {
        q: "Can I translate old HWP documents from the 1990s and 2000s?",
        a: "Yes. Xenith supports the legacy HWP binary format used in older Korean documents, making it ideal for translating archived government and business files.",
      },
      {
        q: "What languages can I translate HWP files into?",
        a: "Xenith supports 20+ target languages including English, Japanese, Chinese, Spanish, French, and German.",
      },
    ],
  },
  "korean-to-english": {
    h1: "Korean to English Translation",
    subheading:
      "Translate Korean text and documents to English — supports HWP, HWPX, PDF, DOCX, and plain text.",
    sourceLang: "ko",
    targetLang: "en",
    relatedLinks: [
      { href: "/translate/korean-to-japanese", label: "Korean to Japanese" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/hwp-translator", label: "HWP File Translator" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
    ],
    faqs: [
      {
        q: "What file formats are supported for Korean to English translation?",
        a: "Xenith supports HWP, HWPX, PDF, DOCX, TXT, and images for Korean to English translation. It is the only translator with native HWP/HWPX file support.",
      },
      {
        q: "Is Korean to English translation free?",
        a: "Yes. Xenith offers free Korean to English translation for text and documents.",
      },
      {
        q: "How accurate is the Korean to English translation?",
        a: "Xenith uses Gemini AI, which provides high-quality, nuanced Korean to English translations, including formal document language, technical terms, and idiomatic expressions.",
      },
      {
        q: "Can I auto-detect the Korean language?",
        a: "Yes. Select 'Auto-detect' as the source language and Xenith will automatically identify Korean and translate it to English.",
      },
      {
        q: "Does Korean to English translation preserve document formatting?",
        a: "Yes. For HWPX and DOCX uploads, Xenith preserves tables, fonts, and layout structure during translation.",
      },
    ],
  },
  "korean-to-japanese": {
    h1: "Korean to Japanese Translation",
    subheading:
      "Translate Korean text and documents to Japanese — supports HWP, HWPX, PDF, DOCX, and plain text.",
    sourceLang: "ko",
    targetLang: "ja",
    relatedLinks: [
      { href: "/translate/korean-to-english", label: "Korean to English" },
      { href: "/translate/korean-document", label: "Korean Document Translation" },
      { href: "/translate/hwpx-to-english", label: "HWPX to English Translator" },
      { href: "/translate/hwp-translator", label: "HWP File Translator" },
      { href: "/convert/hwpx-to-pdf", label: "Convert HWPX to PDF" },
    ],
    faqs: [
      {
        q: "What file formats are supported for Korean to Japanese translation?",
        a: "Xenith supports HWP, HWPX, PDF, DOCX, TXT, and images for Korean to Japanese translation.",
      },
      {
        q: "Is Korean to Japanese translation free?",
        a: "Yes. Xenith offers free Korean to Japanese translation for text and documents.",
      },
      {
        q: "How accurate is Korean to Japanese translation?",
        a: "Xenith uses Gemini AI for translation, which handles Korean to Japanese particularly well given the grammatical similarities and shared loanwords between the two languages.",
      },
      {
        q: "Can I translate HWP files from Korean to Japanese?",
        a: "Yes. Xenith is the only online translator that can open HWP/HWPX files and translate them into Japanese with format preservation.",
      },
      {
        q: "Does Xenith support Japanese output for translated HWPX files?",
        a: "Yes. HWPX files can be translated to Japanese with full format preservation — tables, layouts, and styles are maintained.",
      },
    ],
  },
};

function FaqAccordion({ faqs }: { faqs: Array<{ q: string; a: string }> }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="divide-y divide-border">
      {faqs.map((faq, i) => (
        <div key={i} className="py-4">
          <button
            className="flex w-full items-start justify-between gap-4 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="text-sm font-medium leading-snug">{faq.q}</span>
            {openIndex === i ? (
              <ChevronUp className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            ) : (
              <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            )}
          </button>
          {openIndex === i && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function TranslateSlugClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Prefer shared data file; fall back to legacy inline configs
  const sharedData = translateSlugs[slug];
  const config: SlugConfig | undefined = sharedData
    ? {
        h1: sharedData.seo.en.h1,
        subheading: sharedData.seo.en.subheading,
        sourceLang: sharedData.sourceLang,
        targetLang: sharedData.targetLang,
        relatedLinks: sharedData.relatedLinks,
        faqs: sharedData.faqs,
      }
    : slugConfigs[slug];

  const setSourceLang = useTranslatorStore((s) => s.setSourceLang);
  const setTargetLang = useTranslatorStore((s) => s.setTargetLang);
  const setActiveTab = useTranslatorStore((s) => s.setActiveTab);

  React.useEffect(() => {
    if (config) {
      setSourceLang(config.sourceLang);
      setTargetLang(config.targetLang);
      setActiveTab(sharedData?.filesFocused ? "files" : "text");
    }
  }, [slug, config, sharedData, setSourceLang, setTargetLang, setActiveTab]);

  if (!config) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The translation tool &ldquo;{slug}&rdquo; does not exist.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/translate")}
        >
          <ArrowLeft className="size-4" />
          Back to Translate
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push("/translate")}
      >
        <ArrowLeft className="size-4" />
        All translators
      </Button>

      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{config.h1}</h1>
        <p className="mt-1 text-muted-foreground">{config.subheading}</p>
      </div>

      {/* Translator widget */}
      <TranslatorWidget fullHeight={false} />

      {/* Ad */}
      <div className="mt-6">
        <AdSlot
          slotId={AD_SLOTS.translateBelowWidget.slotId}
          format={AD_SLOTS.translateBelowWidget.format}
        />
      </div>

      {/* Related tools */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Related Tools
        </h2>
        <div className="flex flex-wrap gap-2">
          {config.relatedLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
        <FaqAccordion faqs={config.faqs} />
      </div>
    </motion.div>
  );
}
