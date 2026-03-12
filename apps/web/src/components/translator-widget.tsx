"use client";

import * as React from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageSelector } from "@/components/language-selector";
import { FileDropzone } from "@/components/file-dropzone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslatorStore } from "@/lib/store";
import { useTranslateText, useTranslateFile } from "@/lib/api";

const MAX_CHARS = 5000;

const outputFormats = [
  { value: "txt", label: "Text (.txt)" },
  { value: "docx", label: "Word (.docx)" },
  { value: "pdf", label: "PDF (.pdf)" },
];

export function TranslatorWidget({ fullHeight = false }: { fullHeight?: boolean }) {
  const {
    sourceLang,
    targetLang,
    sourceText,
    translatedText,
    activeTab,
    setSourceLang,
    setTargetLang,
    setSourceText,
    setTranslatedText,
    swapLanguages,
    setActiveTab,
  } = useTranslatorStore();

  const translateMutation = useTranslateText();
  const fileTranslateMutation = useTranslateFile();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [outputFormat, setOutputFormat] = React.useState("txt");

  const handleTranslate = () => {
    if (!sourceText.trim()) {
      toast.warning("Please enter some text to translate.");
      return;
    }
    if (targetLang === sourceLang && sourceLang !== "auto") {
      toast.warning("Source and target languages are the same.");
      return;
    }

    translateMutation.mutate(
      { text: sourceText, sourceLang, targetLang },
      {
        onSuccess: (data) => {
          setTranslatedText(data.translated_text);
        },
      }
    );
  };

  const handleFileTranslate = () => {
    if (!selectedFile) {
      toast.warning("Please select a file to translate.");
      return;
    }

    fileTranslateMutation.mutate(
      { file: selectedFile, sourceLang, targetLang, outputFormat },
      {
        onSuccess: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `translated_${selectedFile.name.replace(/\.[^.]+$/, "")}.${outputFormat}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("File translated and downloaded successfully!");
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleTranslate();
    }
  };

  return (
    <div className={`w-full ${fullHeight ? "flex-1" : ""}`}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "text" | "files")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          {/* Language selector row */}
          <div className="mb-3 flex items-end gap-2">
            <div className="flex-1">
              <LanguageSelector
                value={sourceLang}
                onValueChange={setSourceLang}
                showAuto
                label="From"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={swapLanguages}
              disabled={sourceLang === "auto"}
              aria-label="Swap languages"
              className="mb-px shrink-0"
            >
              <ArrowLeftRight className="size-4" />
            </Button>
            <div className="flex-1">
              <LanguageSelector
                value={targetLang}
                onValueChange={setTargetLang}
                label="To"
              />
            </div>
          </div>

          {/* Text panels */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Source panel */}
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Textarea
                  placeholder="Enter text to translate..."
                  value={sourceText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) {
                      setSourceText(e.target.value);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className={`min-h-[200px] resize-none ${fullHeight ? "lg:min-h-[400px]" : ""}`}
                />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {sourceText.length} / {MAX_CHARS}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Ctrl+Enter to translate
                  </span>
                </div>
              </div>
            </div>

            {/* Target panel */}
            <div className="flex flex-col gap-2">
              {translateMutation.isPending ? (
                <div className={`space-y-3 rounded-lg border border-input p-4 ${fullHeight ? "lg:min-h-[400px]" : "min-h-[200px]"}`}>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : (
                <Textarea
                  placeholder="Translation will appear here..."
                  value={translatedText}
                  readOnly
                  className={`min-h-[200px] resize-none bg-muted/30 ${fullHeight ? "lg:min-h-[400px]" : ""}`}
                />
              )}
            </div>
          </div>

          {/* Translate button */}
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleTranslate}
              disabled={translateMutation.isPending || !sourceText.trim()}
              size="lg"
              className="min-w-[140px]"
            >
              {translateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="files">
          {/* Language selector row */}
          <div className="mb-3 flex items-end gap-2">
            <div className="flex-1">
              <LanguageSelector
                value={sourceLang}
                onValueChange={setSourceLang}
                showAuto
                label="From"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={swapLanguages}
              disabled={sourceLang === "auto"}
              aria-label="Swap languages"
              className="mb-px shrink-0"
            >
              <ArrowLeftRight className="size-4" />
            </Button>
            <div className="flex-1">
              <LanguageSelector
                value={targetLang}
                onValueChange={setTargetLang}
                label="To"
              />
            </div>
          </div>

          {/* File dropzone */}
          <FileDropzone
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            onClear={() => setSelectedFile(null)}
          />

          {/* Output format selector */}
          <div className="mt-4 flex items-end gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Output Format
              </span>
              <Select value={outputFormat} onValueChange={(val) => { if (val !== null) setOutputFormat(val); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {outputFormats.map((fmt) => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleFileTranslate}
              disabled={fileTranslateMutation.isPending || !selectedFile}
              size="lg"
              className="min-w-[160px]"
            >
              {fileTranslateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate File"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
