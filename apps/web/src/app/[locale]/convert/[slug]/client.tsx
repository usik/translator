"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileDropzone } from "@/components/file-dropzone";
import { useConvertFile } from "@/lib/api";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/ad-config";
import { trackFileConvert, trackError, trackFileSelect } from "@/lib/analytics";

interface ConversionConfig {
  title: string;
  description: string;
  acceptedFormats: string;
  acceptLabel: string;
  outputFormat: string;
}

const conversionConfigs: Record<string, ConversionConfig> = {
  "pdf-to-docx": {
    title: "PDF to DOCX",
    description: "Convert your PDF documents to editable Word format.",
    acceptedFormats: ".pdf",
    acceptLabel: "PDF",
    outputFormat: "docx",
  },
  "pdf-to-txt": {
    title: "PDF to Text",
    description: "Extract text content from PDF files.",
    acceptedFormats: ".pdf",
    acceptLabel: "PDF",
    outputFormat: "txt",
  },
  "docx-to-pdf": {
    title: "DOCX to PDF",
    description: "Convert Word documents to PDF format.",
    acceptedFormats: ".docx",
    acceptLabel: "DOCX",
    outputFormat: "pdf",
  },
  "docx-to-txt": {
    title: "DOCX to Text",
    description: "Extract text from Word documents.",
    acceptedFormats: ".docx",
    acceptLabel: "DOCX",
    outputFormat: "txt",
  },
  "image-to-txt": {
    title: "Image to Text (OCR)",
    description: "Extract text from images using AI-powered OCR.",
    acceptedFormats: ".png,.jpg,.jpeg,.webp,.bmp,.tiff",
    acceptLabel: "PNG, JPG, JPEG, WebP, BMP, TIFF",
    outputFormat: "txt",
  },
  "hwpx-to-txt": {
    title: "HWPX to Text",
    description:
      "Extract text from Korean HWPX (한글) documents. No Hancom Office required.",
    acceptedFormats: ".hwpx",
    acceptLabel: "HWPX",
    outputFormat: "txt",
  },
  "hwpx-to-pdf": {
    title: "HWPX to PDF",
    description:
      "Convert Korean HWPX (한글) documents to universally readable PDF format.",
    acceptedFormats: ".hwpx",
    acceptLabel: "HWPX",
    outputFormat: "pdf",
  },
  "hwp-to-txt": {
    title: "HWP to Text",
    description:
      "Extract text from legacy HWP (한글) binary documents. No Hancom Office required.",
    acceptedFormats: ".hwp",
    acceptLabel: "HWP",
    outputFormat: "txt",
  },
  "hwp-to-pdf": {
    title: "HWP to PDF",
    description:
      "Convert legacy HWP (한글) binary documents to universally readable PDF format.",
    acceptedFormats: ".hwp",
    acceptLabel: "HWP",
    outputFormat: "pdf",
  },
};

type Step = "upload" | "processing" | "download";

export function ConvertSlugClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const config = conversionConfigs[slug];

  const [step, setStep] = React.useState<Step>("upload");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = React.useState<string>("");

  const convertMutation = useConvertFile();

  React.useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  if (!config) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Conversion not found</h1>
        <p className="mt-2 text-muted-foreground">
          The conversion type &ldquo;{slug}&rdquo; is not supported.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/convert")}
        >
          <ArrowLeft className="size-4" />
          Back to conversions
        </Button>
      </div>
    );
  }

  const handleConvert = () => {
    if (!selectedFile) return;

    setStep("processing");
    convertMutation.mutate(
      { file: selectedFile, outputFormat: config.outputFormat },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          const filename = `${selectedFile.name.replace(/\.[^.]+$/, "")}.${config.outputFormat}`;
          setDownloadUrl(url);
          setDownloadFilename(filename);
          setStep("download");
          toast.success("File converted successfully!");
          trackFileConvert({
            conversion_type: slug,
            file_type: selectedFile.name.split(".").pop() || "unknown",
            file_size_kb: Math.round(selectedFile.size / 1024),
          });
        },
        onError: (error: Error) => {
          trackError("file_convert", {
            error_message: error.message,
            file_type: selectedFile?.name.split(".").pop() || "unknown",
          });
          setStep("upload");
        },
      }
    );
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
    }
    setSelectedFile(null);
    setDownloadUrl(null);
    setDownloadFilename("");
    setStep("upload");
  };

  return (
    <motion.div
      className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.push("/convert")}
      >
        <ArrowLeft className="size-4" />
        All conversions
      </Button>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-medium leading-snug" data-slot="card-title">
            {config.title}
          </h1>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </CardHeader>
        <CardContent>
          {step === "upload" && (
            <div className="space-y-4">
              <FileDropzone
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  if (file) {
                    trackFileSelect({
                      file_type: file.name.split(".").pop() || "unknown",
                      file_size_kb: Math.round(file.size / 1024),
                    });
                  }
                }}
                selectedFile={selectedFile}
                onClear={() => setSelectedFile(null)}
                accept={config.acceptedFormats}
                acceptLabel={config.acceptLabel}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleConvert}
                  disabled={!selectedFile}
                  size="lg"
                >
                  Convert
                </Button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
              <Loader2 className="size-10 animate-spin text-primary" aria-hidden="true" />
              <div className="text-center">
                <p className="font-medium">Converting your file...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a moment
                </p>
              </div>
            </div>
          )}

          {step === "download" && (
            <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-live="polite">
              <CheckCircle2 className="size-10 text-green-500" aria-hidden="true" />
              <div className="text-center">
                <p className="font-medium">Conversion complete!</p>
                <p className="text-sm text-muted-foreground">
                  {downloadFilename}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDownload} size="lg">
                  <Download className="size-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleReset} size="lg">
                  Convert Another
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ad: below the conversion card */}
      <div className="mt-6">
        <AdSlot
          slotId={AD_SLOTS.convertSlugBelowCard.slotId}
          format={AD_SLOTS.convertSlugBelowCard.format}
        />
      </div>
    </motion.div>
  );
}
