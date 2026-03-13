"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Bookmark, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { TranslatorWidget } from "@/components/translator-widget";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/ad-config";
import { useTranslatorStore } from "@/lib/store";

const BOOKMARKLET_CODE = `javascript:void(function(){var t=window.getSelection().toString();if(!t){t=document.body.innerText.substring(0,5000)}window.open('https://tryxenith.com/translate?text='+encodeURIComponent(t),'_blank')})()`;

function TranslatePageInner() {
  const searchParams = useSearchParams();
  const setSourceText = useTranslatorStore((s) => s.setSourceText);
  const setSourceLang = useTranslatorStore((s) => s.setSourceLang);
  const setTargetLang = useTranslatorStore((s) => s.setTargetLang);
  const setActiveTab = useTranslatorStore((s) => s.setActiveTab);

  useEffect(() => {
    const text = searchParams.get("text");
    const source = searchParams.get("source");
    const target = searchParams.get("target");
    if (text) {
      setSourceText(text);
      setActiveTab("text");
      if (source) setSourceLang(source);
      if (target) setTargetLang(target);
    }
  }, [searchParams, setSourceText, setSourceLang, setTargetLang, setActiveTab]);

  return null;
}

export function TranslatePageClient() {
  const [copied, setCopied] = useState(false);

  const handleCopyBookmarklet = async () => {
    try {
      await navigator.clipboard.writeText(BOOKMARKLET_CODE);
      setCopied(true);
      toast.success("Bookmarklet code copied! Create a new bookmark and paste this as the URL.");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to copy.");
    }
  };

  return (
    <motion.div
      className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Suspense>
        <TranslatePageInner />
      </Suspense>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Translate
        </h1>
        <p className="mt-1 text-muted-foreground">
          Translate text or files between 20+ languages. Native HWPX support.
        </p>
      </div>
      <div className="flex-1">
        <TranslatorWidget fullHeight />
      </div>

      {/* Bookmarklet install */}
      <div className="mt-8 rounded-lg border border-border/60 bg-muted/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Bookmark className="size-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Translate Any Page</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Translate text from any website in one click:
            </p>
            <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>
                1. Drag this link to your bookmark bar:{" "}
                <a
                  href={BOOKMARKLET_CODE}
                  onClick={(e) => e.preventDefault()}
                  className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary hover:underline"
                >
                  Translate with Xenith
                </a>
              </li>
              <li>2. On any webpage, select the text you want to translate (or select nothing for the full page)</li>
              <li>3. Click the bookmark — Xenith opens with your text ready to translate</li>
              <li>4. Pick your languages and hit Translate</li>
            </ol>
            <p className="mt-2 text-xs text-muted-foreground">
              Can&apos;t drag?{" "}
              <button
                onClick={handleCopyBookmarklet}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="inline size-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="inline size-3" /> Copy the code
                  </>
                )}
              </button>{" "}
              and paste it as a new bookmark URL.
            </p>
          </div>
        </div>
      </div>

      {/* Ad: below translator widget */}
      <div className="mt-6">
        <AdSlot
          slotId={AD_SLOTS.translateBelowWidget.slotId}
          format={AD_SLOTS.translateBelowWidget.format}
        />
      </div>
    </motion.div>
  );
}
