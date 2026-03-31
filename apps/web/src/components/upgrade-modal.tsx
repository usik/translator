"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  reason?: "daily_limit" | "low_credits";
}

const PLANS = [
  {
    id: "credit_s",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREDIT_S ?? "",
    name: "Credit Pack S",
    price: "$5",
    detail: "25 docs · never expire",
  },
  {
    id: "credit_l",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREDIT_L ?? "",
    name: "Credit Pack L",
    price: "$15",
    detail: "100 docs · best value",
    recommended: true,
  },
  {
    id: "pro_monthly",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_MONTHLY ?? "",
    name: "Pro Monthly",
    price: "$9/mo",
    detail: "50 docs/mo + overage",
  },
];

export function UpgradeModal({ open, onClose, reason = "daily_limit" }: UpgradeModalProps) {
  const locale = useLocale();
  const [loading, setLoading] = React.useState<string | null>(null);

  if (!open) return null;

  const headline =
    reason === "daily_limit"
      ? "You've used your 3 free docs today"
      : "Running low on credits";

  const sub =
    reason === "daily_limit"
      ? "Upgrade to keep translating — credits never expire."
      : "Top up your credits to keep translating without interruption.";

  const handleCheckout = async (productId: string, planId: string) => {
    if (!productId) return;
    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, locale }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">{headline}</h2>
          </div>
          <p className="mb-6 text-sm text-muted-foreground">{sub}</p>

          <div className="space-y-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  plan.recommended ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    {plan.name}
                    {plan.recommended && (
                      <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        Popular
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{plan.detail}</p>
                </div>
                <Button
                  size="sm"
                  variant={plan.recommended ? "default" : "outline"}
                  disabled={!plan.productId || loading === plan.id}
                  onClick={() => handleCheckout(plan.productId, plan.id)}
                >
                  {loading === plan.id ? "…" : plan.price}
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Payments secured by{" "}
            <a
              href="https://polar.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Polar
            </a>
            . Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
