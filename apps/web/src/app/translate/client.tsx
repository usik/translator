"use client";

import { motion } from "framer-motion";
import { TranslatorWidget } from "@/components/translator-widget";
import { AdSlot } from "@/components/ad-slot";
import { AD_SLOTS } from "@/lib/ad-config";

export function TranslatePageClient() {
  return (
    <motion.div
      className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
