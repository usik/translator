"use client";

import {
  FileOutput,
  FileType,
  FileInput,
  Image,
  FileCode,
  type LucideIcon,
} from "lucide-react";
import { ConvertCard } from "@/components/convert-card";

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
    icon: FileType,
    title: "DOCX to Text",
    description: "Extract text from Word documents",
    slug: "docx-to-txt",
  },
  {
    icon: Image,
    title: "Image to Text",
    description: "Extract text from images using OCR technology",
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
    description: "Convert Korean HWPX documents to PDF format",
    slug: "hwpx-to-pdf",
  },
];

export default function ConvertPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Conversion Tools
        </h1>
        <p className="mt-1 text-muted-foreground">
          Convert between file formats with ease
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}
