"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LowCreditsBannerProps {
  creditsRemaining: number;
  threshold?: number;
}

export function LowCreditsBanner({ creditsRemaining, threshold = 5 }: LowCreditsBannerProps) {
  const locale = useLocale();
  const [dismissed, setDismissed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (dismissed || creditsRemaining > threshold) return null;

  const productId = process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREDIT_S ?? "";

  const handleTopUp = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <AlertTriangle className="size-4 text-yellow-600 dark:text-yellow-400 shrink-0" />
        <span className="text-yellow-800 dark:text-yellow-200">
          {creditsRemaining === 0
            ? "You have no credits remaining."
            : `Only ${creditsRemaining} credit${creditsRemaining === 1 ? "" : "s"} remaining.`}{" "}
          Top up to keep translating.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {productId && (
          <Button
            size="sm"
            variant="outline"
            className="border-yellow-600/40 text-yellow-800 hover:bg-yellow-500/20 dark:text-yellow-200"
            disabled={loading}
            onClick={handleTopUp}
          >
            {loading ? "…" : "Top up — $5"}
          </Button>
        )}
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
