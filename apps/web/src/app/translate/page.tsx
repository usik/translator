"use client";

import { TranslatorWidget } from "@/components/translator-widget";

export default function TranslatePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Translate
        </h1>
        <p className="mt-1 text-muted-foreground">
          Translate text or files between 20+ languages
        </p>
      </div>
      <div className="flex-1">
        <TranslatorWidget fullHeight />
      </div>
    </div>
  );
}
