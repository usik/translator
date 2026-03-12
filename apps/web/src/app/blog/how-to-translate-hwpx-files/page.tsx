import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Translate HWPX Files Online (Without Hancom Office)",
  description:
    "Step-by-step guide to translating Korean HWPX (한글) documents to English online for free, with formatting preserved. No Hancom Office installation needed.",
  keywords: [
    "translate hwpx",
    "hwpx translator",
    "hwpx to english",
    "한글 파일 번역",
    "HWPX 영어 번역",
    "한글 번역기",
    "translate hwp file",
    "korean document translation",
    "한글 문서 영어 번역",
    "hwpx online translator",
  ],
  openGraph: {
    title: "How to Translate HWPX Files Online (Without Hancom Office)",
    description:
      "Free step-by-step guide to translating Korean HWPX documents with formatting preserved. 한글 파일 영어 번역 가이드.",
    type: "article",
  },
  alternates: {
    languages: {
      en: "/blog/how-to-translate-hwpx-files",
      ko: "/blog/how-to-translate-hwpx-files",
    },
  },
};

export default function HwpxTranslationGuide() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Blog
      </Link>

      <header className="mb-10">
        <time className="text-sm text-muted-foreground">March 12, 2026</time>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          How to Translate HWPX Files Online (Without Installing Hancom Office)
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          한글(HWPX) 파일을 온라인에서 무료로 영어 번역하는 방법 — 한컴오피스 설치 불필요
        </p>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          If you&apos;ve ever received a <strong>.hwpx file</strong> from a Korean
          government office, university, or employer, you know the frustration.
          HWPX is the standard document format in South Korea — used for everything
          from immigration forms to business contracts — but almost no tool outside
          Korea can open it, let alone translate it.
        </p>
        <p>
          Google Translate doesn&apos;t support HWPX. DeepL doesn&apos;t either. Papago
          only handles text, not files. And manually copy-pasting text out of
          Hancom Office destroys all the formatting — tables, headers, stamps,
          and layout all break.
        </p>
        <p>
          This guide shows you how to translate HWPX files to English (or any of
          20+ languages) online, for free, while keeping the original document
          formatting intact.
        </p>

        <h2>What Is an HWPX File?</h2>
        <p>
          HWPX is the modern file format created by{" "}
          <strong>Hancom Office (한컴오피스)</strong>, Korea&apos;s dominant word
          processor. Think of it as Korea&apos;s equivalent of .docx for Microsoft
          Word.
        </p>
        <p>
          Every Korean government agency, court, school, and most businesses use
          Hancom Office. That means official documents — residency certificates
          (주민등록등본), family relation certificates (가족관계증명서), tax
          documents (납세증명서), transcripts, and contracts — are almost always
          in HWPX format.
        </p>
        <p>
          The older format was .hwp (binary). The newer .hwpx is XML-based
          (similar to how .docx replaced .doc). Both are uniquely Korean formats
          that most international software cannot handle.
        </p>

        <h2>Why Existing Translators Fail with HWPX</h2>
        <ul>
          <li>
            <strong>Google Translate</strong> — Supports PDF, DOCX, and plain
            text. Does not recognize HWPX files at all.
          </li>
          <li>
            <strong>DeepL</strong> — Same limitation. No HWPX support.
          </li>
          <li>
            <strong>Papago (Naver)</strong> — Translates text only. Cannot process
            document files.
          </li>
          <li>
            <strong>Manual copy-paste</strong> — You can install Hancom Office,
            open the file, select all text, and paste into a translator. But this
            destroys all formatting: tables collapse, headers disappear, and the
            document layout is lost. For official documents where formatting
            matters, this is unacceptable.
          </li>
        </ul>

        <h2>How to Translate HWPX Files with Xenith (Step by Step)</h2>
        <p>
          <Link href="/" className="text-primary hover:underline">
            Xenith
          </Link>{" "}
          is currently the only online translator that natively supports HWPX
          files with format preservation. Here&apos;s how to use it:
        </p>

        <h3>Step 1: Go to tryxenith.com</h3>
        <p>
          Open{" "}
          <Link href="/translate" className="text-primary hover:underline">
            tryxenith.com/translate
          </Link>{" "}
          in your browser. No account or signup needed.
        </p>

        <h3>Step 2: Switch to the Files Tab</h3>
        <p>
          Click the <strong>&quot;Files&quot;</strong> tab at the top of the translator
          widget.
        </p>

        <h3>Step 3: Upload Your HWPX File</h3>
        <p>
          Drag and drop your .hwpx file onto the upload area, or click to browse.
          Files up to 20MB are supported.
        </p>

        <h3>Step 4: Select Languages</h3>
        <p>
          Set the source language to <strong>Korean</strong> (or leave it on
          &quot;Detect Language&quot; — Xenith auto-detects Korean). Choose your target
          language — English, Japanese, Chinese, Spanish, French, German, and
          15+ more are available.
        </p>

        <h3>Step 5: Enable Format Preservation</h3>
        <p>
          When you upload an HWPX or DOCX file, a{" "}
          <strong>&quot;Preserve original formatting&quot;</strong> checkbox appears
          automatically. Keep it checked to retain tables, headers, and layout
          in the translated output.
        </p>

        <h3>Step 6: Translate and Download</h3>
        <p>
          Click <strong>&quot;Translate File&quot;</strong>. Processing typically takes
          10-30 seconds depending on document length. The translated file
          downloads automatically with the original formatting intact.
        </p>

        <h2>Common Use Cases</h2>

        <h3>Immigration Documents (이민 서류)</h3>
        <p>
          Visa applications for the US, UK, Canada, and Australia often require
          translated Korean documents: birth certificates, marriage certificates,
          criminal background checks, employment verification letters. These are
          almost always issued in HWPX format by Korean government offices.
        </p>

        <h3>University Applications (대학 지원)</h3>
        <p>
          Korean students applying to international universities need translated
          transcripts, recommendation letters, and academic records. University
          registrar offices typically issue these in HWPX.
        </p>

        <h3>Business Contracts (비즈니스 계약서)</h3>
        <p>
          Foreign companies working with Korean partners frequently receive
          contracts, proposals, and reports in HWPX format. Quick translation
          helps teams understand document contents before engaging professional
          legal translators.
        </p>

        <h3>Government Forms (공문서)</h3>
        <p>
          Tax certificates, business registration documents, and official
          correspondence from Korean government agencies all use HWPX. Whether
          you need these for international compliance or personal understanding,
          Xenith handles them directly.
        </p>

        <h2>HWPX to PDF Conversion</h2>
        <p>
          Even if you don&apos;t need translation, Xenith can convert HWPX files to
          PDF — useful when you need to share a Korean document with someone
          who doesn&apos;t have Hancom Office installed.
        </p>
        <p>
          Use the{" "}
          <Link href="/convert/hwpx-to-pdf" className="text-primary hover:underline">
            HWPX to PDF converter
          </Link>{" "}
          for instant, free conversion.
        </p>

        <h2>Privacy and Security</h2>
        <p>
          All uploaded files are processed in memory and{" "}
          <strong>automatically deleted immediately</strong> after translation.
          Nothing is stored on our servers. No account is required, and no
          personal data is collected. Read our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>

        <h2>Important Note on Translation Accuracy</h2>
        <p>
          Xenith uses AI-powered translation (Gemini 2.5 Flash). While the
          quality is high for general documents, we recommend having critical
          legal or official translations reviewed by a professional human
          translator. Xenith is an excellent first-pass tool that saves hours
          of manual work, but it should not be the sole basis for legally
          binding translations.
        </p>

        <hr />

        <p>
          Ready to translate your HWPX files?{" "}
          <Link href="/translate" className="text-primary hover:underline">
            Try Xenith for free →
          </Link>
        </p>

        <p className="text-sm text-muted-foreground">
          한글(HWPX) 파일 번역이 필요하신가요?{" "}
          <Link href="/translate" className="text-primary hover:underline">
            Xenith에서 무료로 번역해보세요 →
          </Link>
        </p>
      </div>
    </article>
  );
}
