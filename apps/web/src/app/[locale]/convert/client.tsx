"use client";

import {
  FileOutput,
  FileType,
  FileInput,
  Image,
  FileCode,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
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
      staggerChildren: 0.06,
    },
  },
};

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
    icon: FileCode,
    title: "HWP to PDF",
    description: "Convert legacy 한글 (.hwp) to PDF",
    slug: "hwp-to-pdf",
  },
  {
    icon: FileCode,
    title: "HWP to Text",
    description: "Extract text from legacy 한글 (.hwp)",
    slug: "hwp-to-txt",
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
    description: "Convert Word documents to PDF format",
    slug: "docx-to-pdf",
  },
  {
    icon: FileType,
    title: "PDF to Text",
    description: "Extract text content from PDF files",
    slug: "pdf-to-txt",
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
    description: "Extract text from images using OCR",
    slug: "image-to-txt",
  },
];

export function ConvertPageClient() {
  return (
    <motion.div
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Conversion Tools
        </h1>
        <p className="mt-1 text-muted-foreground">
          Convert between file formats — including HWP &amp; HWPX (한글)
        </p>
      </div>
      <motion.div
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {convertTools.map((tool) => (
          <motion.div key={tool.slug} variants={fadeInUp} transition={{ duration: 0.25 }}>
            <ConvertCard
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
              slug={tool.slug}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Ad: below conversion tools grid */}
      <div className="mt-8">
        <AdSlot
          slotId={AD_SLOTS.convertBelowGrid.slotId}
          format={AD_SLOTS.convertBelowGrid.format}
        />
      </div>
    </motion.div>
  );
}
