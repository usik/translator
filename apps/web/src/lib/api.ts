import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- Raw API functions ---

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<{ translated_text: string; detected_language?: string }> {
  const res = await fetch(`${API_URL}/api/v1/translate/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      source_lang: sourceLang === "auto" ? null : sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Translation failed" }));
    throw new Error(error.detail || "Translation failed");
  }

  return res.json();
}

export async function translateFile(
  file: File,
  sourceLang: string,
  targetLang: string,
  outputFormat?: string
): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("target_lang", targetLang);
  if (sourceLang && sourceLang !== "auto") {
    formData.append("source_lang", sourceLang);
  }
  if (outputFormat) {
    formData.append("output_format", outputFormat);
  }

  const res = await fetch(`${API_URL}/api/v1/translate`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "File translation failed" }));
    throw new Error(error.detail || "File translation failed");
  }

  return res.blob();
}

export async function convertFile(
  file: File,
  outputFormat: string
): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("output_format", outputFormat);

  const res = await fetch(`${API_URL}/api/v1/convert`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Conversion failed" }));
    throw new Error(error.detail || "Conversion failed");
  }

  return res.blob();
}

// --- TanStack Query Hooks ---

export function useTranslateText() {
  return useMutation({
    mutationFn: ({
      text,
      sourceLang,
      targetLang,
    }: {
      text: string;
      sourceLang: string;
      targetLang: string;
    }) => translateText(text, sourceLang, targetLang),
    onError: (error: Error) => {
      toast.error(error.message || "Translation failed. Please try again.");
    },
  });
}

export function useTranslateFile() {
  return useMutation({
    mutationFn: ({
      file,
      sourceLang,
      targetLang,
      outputFormat,
    }: {
      file: File;
      sourceLang: string;
      targetLang: string;
      outputFormat?: string;
    }) => translateFile(file, sourceLang, targetLang, outputFormat),
    onError: (error: Error) => {
      toast.error(error.message || "File translation failed. Please try again.");
    },
  });
}

export function useConvertFile() {
  return useMutation({
    mutationFn: ({
      file,
      outputFormat,
    }: {
      file: File;
      outputFormat: string;
    }) => convertFile(file, outputFormat),
    onError: (error: Error) => {
      toast.error(error.message || "Conversion failed. Please try again.");
    },
  });
}
