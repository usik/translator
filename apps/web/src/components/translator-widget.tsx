"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { ArrowLeftRight, Loader2, FileCheck, Copy, Check } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslatorStore } from "@/lib/store";
import { useTranslateText, useTranslateFile } from "@/lib/api";
import { getLanguageName } from "@/lib/languages";
import {
  trackTextTranslate,
  trackFileTranslate,
  trackError,
  trackTabSwitch,
  trackFileSelect,
  trackLangChange,
  trackLangSwap,
  trackCopyTranslation,
  trackFormatPreserveToggle,
  trackOutputFormatChange,
} from "@/lib/analytics";

const MAX_CHARS = 5000;

const FORMAT_PRESERVE_EXTENSIONS = [".hwpx", ".docx"];

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
  const [preserveFormat, setPreserveFormat] = React.useState(true);
  const [detectedLanguage, setDetectedLanguage] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const locale = useLocale();

  const [isMac, setIsMac] = React.useState(false);
  React.useEffect(() => {
    setIsMac(/Mac/.test(navigator.userAgent));
  }, []);

  // Sync target language to page locale on mount
  React.useEffect(() => {
    setTargetLang(locale);
  }, [locale, setTargetLang]);

  const supportsFormatPreservation = selectedFile
    ? FORMAT_PRESERVE_EXTENSIONS.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      )
    : false;

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
          if (sourceLang === "auto" && data.detected_language) {
            setDetectedLanguage(data.detected_language);
          } else {
            setDetectedLanguage(null);
          }
          trackTextTranslate({
            source_lang: sourceLang,
            target_lang: targetLang,
            char_count: sourceText.length,
            had_auto_detect: sourceLang === "auto",
          });
        },
        onError: (error: Error) => {
          trackError("text_translate", { error_message: error.message });
        },
      }
    );
  };

  const handleFileTranslate = () => {
    if (!selectedFile) {
      toast.warning("Please select a file to translate.");
      return;
    }

    const shouldPreserve = preserveFormat && supportsFormatPreservation;
    fileTranslateMutation.mutate(
      { file: selectedFile, sourceLang, targetLang, outputFormat, preserveFormat: shouldPreserve },
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
          trackFileTranslate({
            source_lang: sourceLang,
            target_lang: targetLang,
            file_type: selectedFile.name.split(".").pop() || "unknown",
            file_size_kb: Math.round(selectedFile.size / 1024),
            output_format: outputFormat,
            preserve_format: shouldPreserve,
          });
        },
        onError: (error: Error) => {
          trackError("file_translate", {
            error_message: error.message,
            file_type: selectedFile?.name.split(".").pop() || "unknown",
          });
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleTranslate();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      trackCopyTranslation({ char_count: translatedText.length });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy to clipboard.");
    }
  };

  return (
    <div className={`w-full ${fullHeight ? "flex-1" : ""}`}>
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          trackTabSwitch({ from_tab: activeTab, to_tab: val });
          setActiveTab(val as "text" | "files");
        }}
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
                onValueChange={(val) => {
                  trackLangChange({ field: "source", from_lang: sourceLang, to_lang: val });
                  setSourceLang(val);
                  setDetectedLanguage(null);
                }}
                showAuto
                label="From"
              />
              {detectedLanguage && sourceLang === "auto" && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Detected: {getLanguageName(detectedLanguage)}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                trackLangSwap({ source_lang: sourceLang, target_lang: targetLang });
                swapLanguages();
              }}
              disabled={sourceLang === "auto"}
              aria-label="Swap languages"
              className="mb-px shrink-0"
            >
              <ArrowLeftRight className="size-4" />
            </Button>
            <div className="flex-1">
              <LanguageSelector
                value={targetLang}
                onValueChange={(val) => {
                  trackLangChange({ field: "target", from_lang: targetLang, to_lang: val });
                  setTargetLang(val);
                }}
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
                  aria-label="Source text to translate"
                  className={`min-h-[200px] resize-none ${fullHeight ? "lg:min-h-[400px]" : ""}`}
                />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {sourceText.length} / {MAX_CHARS}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {isMac ? "⌘" : "Ctrl"}+Enter to translate
                  </span>
                </div>
              </div>
            </div>

            {/* Target panel */}
            <div className="flex flex-col gap-2">
              {translateMutation.isPending ? (
                <div
                  className={`space-y-3 rounded-lg border border-input p-4 ${fullHeight ? "lg:min-h-[400px]" : "min-h-[200px]"}`}
                  role="status"
                  aria-label="Translating text"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <span className="sr-only">Translating your text, please wait...</span>
                </div>
              ) : (
                <div className="relative">
                  {translatedText && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleCopy}
                      aria-label="Copy translation to clipboard"
                      className="absolute right-2 top-2 z-10"
                    >
                      {copied ? (
                        <Check className="size-4 text-green-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  )}
                  <Textarea
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    readOnly
                    aria-label="Translation result"
                    aria-live="polite"
                    className={`min-h-[200px] resize-none bg-muted/30 ${fullHeight ? "lg:min-h-[400px]" : ""}`}
                  />
                  {translatedText && (
                    <div className="mt-1">
                      <span className="text-xs text-muted-foreground">
                        {translatedText.length} characters
                      </span>
                    </div>
                  )}
                </div>
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
              onClick={() => {
                trackLangSwap({ source_lang: sourceLang, target_lang: targetLang });
                swapLanguages();
              }}
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
          />

          {/* Preserve format toggle */}
          {supportsFormatPreservation && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
              <Checkbox
                id="preserve-format"
                checked={preserveFormat}
                onCheckedChange={(checked) => {
                  setPreserveFormat(checked === true);
                  trackFormatPreserveToggle({
                    enabled: checked === true,
                    file_type: selectedFile?.name.split(".").pop() || "unknown",
                  });
                }}
              />
              <label
                htmlFor="preserve-format"
                className="flex cursor-pointer items-center gap-1.5 text-sm font-medium"
              >
                <FileCheck className="size-3.5 text-primary" />
                Preserve original formatting
              </label>
              <span className="text-xs text-muted-foreground">
                — keeps headers, tables, and layout intact
              </span>
            </div>
          )}

          {/* Output format selector */}
          <div className="mt-4 flex items-end gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Output Format
              </span>
              <Select value={outputFormat} onValueChange={(val) => {
                if (val !== null) {
                  trackOutputFormatChange({
                    context: "translate",
                    from_format: outputFormat,
                    to_format: val,
                  });
                  setOutputFormat(val);
                }
              }}>
                <SelectTrigger className="w-[180px]" aria-label="Output file format">
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
