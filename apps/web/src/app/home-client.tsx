"use client";

import {
  Zap,
  FileText,
  FileStack,
  Shield,
  FileOutput,
  FileInput,
  Image,
  FileType,
  FileCode,
  Globe,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TranslatorWidget } from "@/components/translator-widget";
import { ConvertCard } from "@/components/convert-card";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/ad-config";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

const features: Feature[] = [
  {
    icon: FileCode,
    title: "Native HWPX Support",
    description:
      "The only online translator with full HWPX (한글) support. Translate and convert Korean government and business documents seamlessly.",
    badge: "Exclusive",
  },
  {
    icon: Zap,
    title: "AI-Powered Translation",
    description:
      "Powered by Gemini 2.5 Flash for fast, accurate translation across 20+ languages.",
  },
  {
    icon: FileText,
    title: "Document Translation",
    description:
      "Translate HWPX and DOCX files with full format preservation — headers, tables, and styles stay intact. PDF and TXT supported via text extraction.",
    badge: "Format-Preserving",
  },
  {
    icon: Globe,
    title: "20+ Languages",
    description:
      "Korean, English, Japanese, Chinese, Spanish, French, German, and many more.",
  },
  {
    icon: FileStack,
    title: "Format Conversion",
    description:
      "Convert between PDF, DOCX, HWPX, and plain text. Extract text from images via OCR.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your files are automatically deleted after processing. No data is stored.",
  },
];

interface ConvertTool {
  icon: LucideIcon;
  title: string;
  description: string;
  slug: string;
}

const convertTools: ConvertTool[] = [
  {
    icon: FileCode,
    title: "HWPX to PDF",
    description: "Convert Korean 한글 documents to PDF",
    slug: "hwpx-to-pdf",
  },
  {
    icon: FileCode,
    title: "HWPX to Text",
    description: "Extract text from 한글 documents",
    slug: "hwpx-to-txt",
  },
  {
    icon: FileOutput,
    title: "PDF to DOCX",
    description: "Convert PDF to editable Word format",
    slug: "pdf-to-docx",
  },
  {
    icon: FileInput,
    title: "DOCX to PDF",
    description: "Convert Word documents to PDF",
    slug: "docx-to-pdf",
  },
  {
    icon: FileType,
    title: "PDF to Text",
    description: "Extract text content from PDFs",
    slug: "pdf-to-txt",
  },
  {
    icon: Image,
    title: "Image to Text",
    description: "Extract text from images (OCR)",
    slug: "image-to-txt",
  },
];

export function HomePageClient() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            className="mb-10 text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <FileCode className="size-4" aria-hidden="true" />
              The only translator with native HWPX support
            </motion.div>
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              Translate{" "}
              <span className="text-primary">Anything</span>
            </motion.h1>
            <motion.p
              className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              AI-powered translation for text, documents, and Korean 한글 files.
              20+ languages. PDF, DOCX, HWPX, and more.
            </motion.p>
          </motion.div>

          {/* Functional translator in hero */}
          <motion.div
            className="mx-auto max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="min-h-[360px] rounded-xl border border-border/50 bg-card p-4 shadow-lg sm:min-h-[400px] sm:p-6">
              <TranslatorWidget />
            </div>
          </motion.div>
        </div>
      </section>

      {/* HWPX Callout */}
      <section className="border-t border-border/40 bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            transition={{ duration: 0.4 }}
          >
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <FileCode className="size-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Format-Preserving Translation
              </h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Xenith is the only online tool that translates HWPX (한글) and DOCX
                files while perfectly preserving their original formatting — headers,
                tables, styles, and layout stay intact. No other translator supports
                HWPX, the standard format for Korean government and legal documents.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-center gap-2">
              <Badge variant="default">HWPX — Exclusive</Badge>
              <Badge variant="secondary">DOCX</Badge>
              <Badge variant="secondary">Translate</Badge>
              <Badge variant="secondary">Extract</Badge>
              <Badge variant="secondary">Convert</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Format Preservation Showcase */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="mb-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="outline" className="mb-3">
              Before &amp; After
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              See It In Action
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
              Your document structure stays pixel-perfect. Headers, tables,
              formatting — everything is preserved exactly as the original.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto max-w-5xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeIn}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Tabs defaultValue="hwpx">
              <div className="mb-6 flex justify-center">
                <TabsList>
                  <TabsTrigger value="hwpx">
                    <FileCode className="size-4" />
                    HWPX (한글)
                  </TabsTrigger>
                  <TabsTrigger value="docx">
                    <FileText className="size-4" />
                    DOCX
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* HWPX Example */}
              <TabsContent value="hwpx">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                  {/* Original Korean Document */}
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-4 py-2.5">
                      <FileCode className="size-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        공문서_양식.hwpx
                      </span>
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        원본 (Korean)
                      </Badge>
                    </div>
                    {/* Document content */}
                    <div className="space-y-3 p-5">
                      {/* Header */}
                      <div className="border-b-2 border-foreground/20 pb-2 text-center">
                        <p className="font-serif text-lg font-bold text-foreground">
                          대한민국 정부 공문서
                        </p>
                        <p className="mt-1 font-serif text-xs text-muted-foreground">
                          문서번호: GOV-2025-00412
                        </p>
                      </div>
                      {/* Body text */}
                      <div className="space-y-2">
                        <p className="font-serif text-sm leading-relaxed text-foreground/80">
                          <span className="font-semibold">제목:</span> 2025년 예산안
                          검토 요청
                        </p>
                        <p className="font-serif text-xs leading-relaxed text-foreground/70">
                          상기 건에 대하여 아래와 같이 검토를 요청드립니다. 본 문서는
                          관련 법령에 따라 작성되었으며, 첨부된 자료를 참고하여 주시기
                          바랍니다.
                        </p>
                      </div>
                      {/* Table */}
                      <div className="overflow-hidden rounded border border-border/60">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-muted/60">
                              <th className="border-r border-border/40 px-3 py-1.5 text-left font-semibold text-foreground/80">
                                항목
                              </th>
                              <th className="border-r border-border/40 px-3 py-1.5 text-right font-semibold text-foreground/80">
                                금액 (원)
                              </th>
                              <th className="px-3 py-1.5 text-left font-semibold text-foreground/80">
                                비고
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-border/40">
                              <td className="border-r border-border/40 px-3 py-1.5 text-foreground/70">
                                인건비
                              </td>
                              <td className="border-r border-border/40 px-3 py-1.5 text-right font-mono text-foreground/70">
                                450,000,000
                              </td>
                              <td className="px-3 py-1.5 text-foreground/70">
                                전년 대비 5% 증가
                              </td>
                            </tr>
                            <tr className="border-t border-border/40">
                              <td className="border-r border-border/40 px-3 py-1.5 text-foreground/70">
                                운영비
                              </td>
                              <td className="border-r border-border/40 px-3 py-1.5 text-right font-mono text-foreground/70">
                                120,000,000
                              </td>
                              <td className="px-3 py-1.5 text-foreground/70">
                                시설 유지보수 포함
                              </td>
                            </tr>
                            <tr className="border-t border-border/40 bg-muted/30">
                              <td className="border-r border-border/40 px-3 py-1.5 font-semibold text-foreground/80">
                                합계
                              </td>
                              <td className="border-r border-border/40 px-3 py-1.5 text-right font-mono font-semibold text-foreground/80">
                                570,000,000
                              </td>
                              <td className="px-3 py-1.5" />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Footer */}
                      <div className="border-t border-border/30 pt-2 text-right">
                        <p className="font-serif text-xs text-muted-foreground">
                          2025년 3월 10일
                        </p>
                        <p className="font-serif text-xs font-medium text-foreground/70">
                          기획재정부 장관
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <ArrowRight className="size-5 text-primary max-md:rotate-90" />
                    </div>
                  </div>

                  {/* Translated English Document */}
                  <div className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-md ring-1 ring-primary/10">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/[0.04] px-4 py-2.5">
                      <FileCode className="size-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        공문서_양식_translated.hwpx
                      </span>
                      <Badge variant="default" className="ml-auto text-[10px]">
                        Translated (English)
                      </Badge>
                    </div>
                    {/* Document content */}
                    <div className="space-y-3 p-5">
                      {/* Header */}
                      <div className="border-b-2 border-foreground/20 pb-2 text-center">
                        <p className="font-serif text-lg font-bold text-foreground">
                          Republic of Korea Official Document
                        </p>
                        <p className="mt-1 font-serif text-xs text-muted-foreground">
                          Document No: GOV-2025-00412
                        </p>
                      </div>
                      {/* Body text */}
                      <div className="space-y-2">
                        <p className="font-serif text-sm leading-relaxed text-foreground/80">
                          <span className="font-semibold">Subject:</span> Request for
                          2025 Budget Review
                        </p>
                        <p className="font-serif text-xs leading-relaxed text-foreground/70">
                          We hereby request a review of the above matter as described
                          below. This document has been prepared in accordance with
                          relevant regulations. Please refer to the attached materials.
                        </p>
                      </div>
                      {/* Table */}
                      <div className="overflow-hidden rounded border border-border/60">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-muted/60">
                              <th className="border-r border-border/40 px-3 py-1.5 text-left font-semibold text-foreground/80">
                                Item
                              </th>
                              <th className="border-r border-border/40 px-3 py-1.5 text-right font-semibold text-foreground/80">
                                Amount (KRW)
                              </th>
                              <th className="px-3 py-1.5 text-left font-semibold text-foreground/80">
                                Notes
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-border/40">
                              <td className="border-r border-border/40 px-3 py-1.5 text-foreground/70">
                                Personnel
                              </td>
                              <td className="border-r border-border/40 px-3 py-1.5 text-right font-mono text-foreground/70">
                                450,000,000
                              </td>
                              <td className="px-3 py-1.5 text-foreground/70">
                                5% increase from prior year
                              </td>
                            </tr>
                            <tr className="border-t border-border/40">
                              <td className="border-r border-border/40 px-3 py-1.5 text-foreground/70">
                                Operations
                              </td>
                              <td className="border-r border-border/40 px-3 py-1.5 text-right font-mono text-foreground/70">
                                120,000,000
                              </td>
                              <td className="px-3 py-1.5 text-foreground/70">
                                Includes facility maintenance
                              </td>
                            </tr>
                            <tr className="border-t border-border/40 bg-muted/30">
                              <td className="border-r border-border/40 px-3 py-1.5 font-semibold text-foreground/80">
                                Total
                              </td>
                              <td className="border-r border-border/40 px-3 py-1.5 text-right font-mono font-semibold text-foreground/80">
                                570,000,000
                              </td>
                              <td className="px-3 py-1.5" />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Footer */}
                      <div className="border-t border-border/30 pt-2 text-right">
                        <p className="font-serif text-xs text-muted-foreground">
                          March 10, 2025
                        </p>
                        <p className="font-serif text-xs font-medium text-foreground/70">
                          Minister of Economy and Finance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Headers, tables, dates, and document structure are perfectly
                  preserved in the translated HWPX file.
                </p>
              </TabsContent>

              {/* DOCX Example */}
              <TabsContent value="docx">
                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr]">
                  {/* Original Korean Document */}
                  <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-md">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-4 py-2.5">
                      <FileText className="size-4 text-blue-600" />
                      <span className="text-xs font-medium text-muted-foreground">
                        프로젝트_제안서.docx
                      </span>
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        원본 (Korean)
                      </Badge>
                    </div>
                    {/* Document content */}
                    <div className="space-y-3 p-5">
                      {/* Title */}
                      <div className="pb-1">
                        <p className="text-base font-bold text-foreground">
                          AI 기반 문서 번역 시스템 제안서
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          작성자: 김유식 | 부서: 개발팀 | 날짜: 2025.03.01
                        </p>
                      </div>
                      {/* Styled section */}
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-primary/90">
                          1. 프로젝트 개요
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/70">
                          본 제안서는 AI 기술을 활용한 자동 문서 번역 시스템의 개발
                          및 도입을 제안합니다. 기존 번역 도구의 한계를 극복하고,{" "}
                          <span className="font-semibold text-foreground/90">
                            문서 서식을 완벽하게 보존
                          </span>
                          하는 것이 핵심 목표입니다.
                        </p>
                      </div>
                      {/* Bullet list */}
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-primary/90">
                          2. 핵심 기능
                        </p>
                        <ul className="space-y-1 pl-4 text-xs text-foreground/70">
                          <li className="flex gap-1.5">
                            <span className="text-primary/60">&#8226;</span>
                            HWPX/DOCX 서식 보존 번역
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-primary/60">&#8226;</span>
                            20개 이상 언어 지원
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-primary/60">&#8226;</span>
                            표, 머리글, 스타일 자동 감지
                          </li>
                        </ul>
                      </div>
                      {/* Highlighted box */}
                      <div className="rounded-md border border-primary/20 bg-primary/[0.04] px-3 py-2">
                        <p className="text-[11px] font-medium text-primary/80">
                          참고: 본 시스템은 기밀 문서 처리 시 자동 삭제 기능을
                          포함합니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                      <ArrowRight className="size-5 text-primary max-md:rotate-90" />
                    </div>
                  </div>

                  {/* Translated English Document */}
                  <div className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-md ring-1 ring-primary/10">
                    {/* Title bar */}
                    <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/[0.04] px-4 py-2.5">
                      <FileText className="size-4 text-blue-600" />
                      <span className="text-xs font-medium text-muted-foreground">
                        프로젝트_제안서_translated.docx
                      </span>
                      <Badge variant="default" className="ml-auto text-[10px]">
                        Translated (English)
                      </Badge>
                    </div>
                    {/* Document content */}
                    <div className="space-y-3 p-5">
                      {/* Title */}
                      <div className="pb-1">
                        <p className="text-base font-bold text-foreground">
                          AI-Based Document Translation System Proposal
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Author: Yusik Kim | Dept: Development | Date: 2025.03.01
                        </p>
                      </div>
                      {/* Styled section */}
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-primary/90">
                          1. Project Overview
                        </p>
                        <p className="text-xs leading-relaxed text-foreground/70">
                          This proposal suggests the development and implementation of
                          an automated document translation system utilizing AI
                          technology. The core objective is to overcome the limitations
                          of existing translation tools and{" "}
                          <span className="font-semibold text-foreground/90">
                            perfectly preserve document formatting
                          </span>
                          .
                        </p>
                      </div>
                      {/* Bullet list */}
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-primary/90">
                          2. Key Features
                        </p>
                        <ul className="space-y-1 pl-4 text-xs text-foreground/70">
                          <li className="flex gap-1.5">
                            <span className="text-primary/60">&#8226;</span>
                            Format-preserving HWPX/DOCX translation
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-primary/60">&#8226;</span>
                            Support for 20+ languages
                          </li>
                          <li className="flex gap-1.5">
                            <span className="text-primary/60">&#8226;</span>
                            Automatic detection of tables, headers, and styles
                          </li>
                        </ul>
                      </div>
                      {/* Highlighted box */}
                      <div className="rounded-md border border-primary/20 bg-primary/[0.04] px-3 py-2">
                        <p className="text-[11px] font-medium text-primary/80">
                          Note: This system includes automatic deletion for
                          confidential document processing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Bold text, numbered sections, bullet lists, and callout boxes are
                  all preserved in the translated DOCX file.
                </p>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* Ad: between hero/callout and features sections */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <AdSlot
          slotId={AD_SLOTS.homeBetweenSections.slotId}
          format={AD_SLOTS.homeBetweenSections.format}
        />
      </div>

      {/* Features Grid */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            Why Xenith?
          </motion.h2>
          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <feature.icon className="size-5" aria-hidden="true" />
                      </div>
                      {feature.badge && (
                        <Badge variant="default" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Conversion Tools Preview */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.h2
            className="mb-2 text-center text-2xl font-semibold tracking-tight sm:text-3xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            transition={{ duration: 0.3 }}
          >
            Conversion Tools
          </motion.h2>
          <motion.p
            className="mb-8 text-center text-muted-foreground"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeInUp}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            Convert between file formats — including HWPX
          </motion.p>
          <motion.div
            className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {convertTools.map((tool) => (
              <motion.div key={tool.slug} variants={fadeInUp} transition={{ duration: 0.3 }}>
                <ConvertCard
                  icon={tool.icon}
                  title={tool.title}
                  description={tool.description}
                  slug={tool.slug}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Message */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <Shield className="size-5 text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Your files are automatically deleted after processing. We never
              store your data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
