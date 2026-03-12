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
  const setActiveTab = useTranslatorStore((s) => s.setActiveTab);

  useEffect(() => {
    const text = searchParams.get("text");
    if (text) {
      setSourceText(text);
      setActiveTab("text");
    }
  }, [searchParams, setSourceText, setActiveTab]);

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
            <p className="mt-0.5 text-xs text-muted-foreground">
              Drag this link to your bookmark bar:{" "}
              <a
                href={BOOKMARKLET_CODE}
                onClick={(e) => e.preventDefault()}
                className="font-medium text-primary hover:underline"
              >
                Translate with Xenith
              </a>{" "}
              — then click it on any page to translate selected Korean text. Or{" "}
              <button
                onClick={handleCopyBookmarklet}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {copied ? (
                  <>
                    <Check className="inline size-3" /> copied
                  </>
                ) : (
                  <>
                    <Copy className="inline size-3" /> copy the code
                  </>
                )}
              </button>{" "}
              and save it as a bookmark URL manually.
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
