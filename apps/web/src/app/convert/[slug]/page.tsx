"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDropzone } from "@/components/file-dropzone";
import { useConvertFile } from "@/lib/api";

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
    description: "Extract text from images using OCR technology.",
    acceptedFormats: ".png,.jpg,.jpeg,.webp,.bmp,.tiff",
    acceptLabel: "PNG, JPG, JPEG, WebP, BMP, TIFF",
    outputFormat: "txt",
  },
  "hwpx-to-txt": {
    title: "HWPX to Text",
    description: "Extract text from Korean HWPX documents.",
    acceptedFormats: ".hwpx",
    acceptLabel: "HWPX",
    outputFormat: "txt",
  },
  "hwpx-to-pdf": {
    title: "HWPX to PDF",
    description: "Convert Korean HWPX documents to PDF format.",
    acceptedFormats: ".hwpx",
    acceptLabel: "HWPX",
    outputFormat: "pdf",
  },
};

type Step = "upload" | "processing" | "download";

export default function ConvertSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const config = conversionConfigs[slug];

  const [step, setStep] = React.useState<Step>("upload");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = React.useState<string>("");

  const convertMutation = useConvertFile();

  // Clean up object URL on unmount
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
        },
        onError: () => {
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
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
          <CardTitle className="text-xl">{config.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </CardHeader>
        <CardContent>
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <FileDropzone
                onFileSelect={setSelectedFile}
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

          {/* Step 2: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <Loader2 className="size-10 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium">Converting your file...</p>
                <p className="text-sm text-muted-foreground">
                  This may take a moment
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Download */}
          {step === "download" && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <CheckCircle2 className="size-10 text-green-500" />
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
    </div>
  );
}
