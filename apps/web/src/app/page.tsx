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
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslatorWidget } from "@/components/translator-widget";
import { ConvertCard } from "@/components/convert-card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Fast Translation",
    description:
      "Powered by advanced AI models for near-instant translation across 20+ languages.",
  },
  {
    icon: FileText,
    title: "File Support",
    description:
      "Translate entire documents - PDF, DOCX, TXT, and more - with formatting preserved.",
  },
  {
    icon: FileStack,
    title: "Multiple Formats",
    description:
      "Convert between file formats: PDF to DOCX, images to text via OCR, and more.",
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
    icon: FileOutput,
    title: "PDF to DOCX",
    description: "Convert PDF documents to editable Word format",
    slug: "pdf-to-docx",
  },
  {
    icon: FileType,
    title: "PDF to Text",
    description: "Extract text content from PDF files",
    slug: "pdf-to-txt",
  },
  {
    icon: FileInput,
    title: "DOCX to PDF",
    description: "Convert Word documents to PDF format",
    slug: "docx-to-pdf",
  },
  {
    icon: Image,
    title: "Image to Text",
    description: "Extract text from images using OCR",
    slug: "image-to-txt",
  },
  {
    icon: FileCode,
    title: "HWPX to Text",
    description: "Extract text from Korean HWPX documents",
    slug: "hwpx-to-txt",
  },
  {
    icon: FileOutput,
    title: "HWPX to PDF",
    description: "Convert Korean HWPX documents to PDF",
    slug: "hwpx-to-pdf",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Translate{" "}
              <span className="text-primary">Anything</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Fast, accurate translation for text and files. Support for 20+
              languages and multiple file formats.
            </p>
          </div>

          {/* Functional translator in hero */}
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-border/50 bg-card p-4 shadow-lg sm:p-6">
              <TranslatorWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Why TransLate?
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conversion Tools Preview */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            Conversion Tools
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            Convert between file formats with ease
          </p>
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {convertTools.map((tool) => (
              <ConvertCard
                key={tool.slug}
                icon={tool.icon}
                title={tool.title}
                description={tool.description}
                slug={tool.slug}
              />
            ))}
          </div>
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
