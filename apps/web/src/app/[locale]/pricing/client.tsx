"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Check, Zap, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Plan definitions ───────────────────────────────────────────────────────

interface Plan {
  id: string;
  productId: string; // Polar product ID — set via env vars once XEN-12 is done
  name: string;
  price: string;
  priceNote: string;
  description: string;
  docs: string;
  overage: string | null;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline";
  cta: string;
  highlight?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    productId: "",
    name: "Free",
    price: "$0",
    priceNote: "forever",
    description: "For occasional use. No account required.",
    docs: "3 docs/day",
    overage: null,
    cta: "Start for free",
    features: [
      "3 document translations per day",
      "Unlimited text translation",
      "All input formats (PDF, DOCX, HWP, HWPX)",
      "20+ languages",
      "Files deleted immediately after processing",
    ],
  },
  {
    id: "credit_s",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREDIT_S ?? "",
    name: "Credit Pack S",
    price: "$5",
    priceNote: "one-time · 25 credits",
    description: "Pay once, use when you need it. Credits never expire.",
    docs: "25 docs",
    overage: null,
    cta: "Buy 25 credits",
    features: [
      "25 document credits",
      "Credits never expire",
      "All formats including HWP/HWPX",
      "Priority processing",
      "Email receipt",
    ],
  },
  {
    id: "credit_l",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_CREDIT_L ?? "",
    name: "Credit Pack L",
    price: "$15",
    priceNote: "one-time · 100 credits",
    description: "Best per-doc price for bulk work. Credits never expire.",
    docs: "100 docs",
    overage: null,
    badge: "Best per-doc value",
    badgeVariant: "secondary",
    cta: "Buy 100 credits",
    features: [
      "100 document credits ($0.15/doc)",
      "Credits never expire",
      "All formats including HWP/HWPX",
      "Priority processing",
      "Email receipt",
    ],
  },
  {
    id: "pro_monthly",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_MONTHLY ?? "",
    name: "Pro Monthly",
    price: "$9",
    priceNote: "/month",
    description: "50 docs included. Pay only for what you use beyond that.",
    docs: "50 docs/mo",
    overage: "$0.15/doc overage",
    cta: "Start Pro",
    features: [
      "50 document credits per month",
      "$0.15/doc metered overage",
      "All formats including HWP/HWPX",
      "Priority processing",
      "Billing portal (upgrade/downgrade/cancel)",
    ],
  },
  {
    id: "pro_annual",
    productId: process.env.NEXT_PUBLIC_POLAR_PRODUCT_PRO_ANNUAL ?? "",
    name: "Pro Annual",
    price: "$79",
    priceNote: "/year · $6.58/mo",
    description: "Two months free vs monthly. Best value for regular users.",
    docs: "50 docs/mo",
    overage: "$0.12/doc overage",
    badge: "Best value",
    badgeVariant: "default",
    cta: "Start Pro Annual",
    highlight: true,
    features: [
      "50 document credits per month",
      "$0.12/doc metered overage (save 20%)",
      "All formats including HWP/HWPX",
      "Priority processing",
      "Billing portal (upgrade/downgrade/cancel)",
    ],
  },
];

// ─── Usage calculator ────────────────────────────────────────────────────────

function UsageCalculator() {
  const [docsPerMonth, setDocsPerMonth] = React.useState(10);

  const recommendedPlan = React.useMemo(() => {
    if (docsPerMonth <= 3) return { name: "Free", cost: "$0", note: "3 docs/day = ~90/month" };
    if (docsPerMonth <= 25) {
      const creditCost = Math.ceil(docsPerMonth / 25) * 5;
      const proCost = 9;
      return creditCost <= proCost
        ? { name: "Credit Pack S", cost: `$${creditCost}`, note: "credits never expire" }
        : { name: "Pro Monthly", cost: `$${proCost}`, note: "50 docs included" };
    }
    if (docsPerMonth <= 50) return { name: "Pro Monthly", cost: "$9", note: "50 docs included" };
    const overage = (docsPerMonth - 50) * 0.15;
    const totalMonthly = 9 + overage;
    const totalAnnual = 79 / 12 + (docsPerMonth - 50) * 0.12;
    return totalAnnual < totalMonthly
      ? { name: "Pro Annual", cost: `~$${(totalAnnual).toFixed(2)}/mo`, note: "$79/yr billed annually" }
      : { name: "Pro Monthly", cost: `~$${totalMonthly.toFixed(2)}/mo`, note: `$9 + $${overage.toFixed(2)} overage` };
  }, [docsPerMonth]);

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-base font-semibold">Usage calculator</h3>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Docs per month</span>
          <span className="font-mono font-semibold">{docsPerMonth}</span>
        </div>
        <input
          type="range"
          min={1}
          max={200}
          value={docsPerMonth}
          onChange={(e) => setDocsPerMonth(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
          aria-label="Documents per month"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>50</span>
          <span>100</span>
          <span>200</span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Recommended plan</p>
          <p className="font-semibold">{recommendedPlan.name}</p>
          <p className="text-xs text-muted-foreground">{recommendedPlan.note}</p>
        </div>
        <p className="text-2xl font-bold text-primary">{recommendedPlan.cost}</p>
      </div>
    </div>
  );
}

// ─── Plan card ───────────────────────────────────────────────────────────────

function PlanCard({ plan, onCheckout }: { plan: Plan; onCheckout: (plan: Plan) => void }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-card p-6 transition-shadow hover:shadow-md",
        plan.highlight
          ? "border-primary shadow-sm ring-1 ring-primary"
          : "border-border"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant={plan.badgeVariant ?? "default"} className="text-xs">
            {plan.badge}
          </Badge>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mb-4">
        <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
        <span className="ml-1 text-sm text-muted-foreground">{plan.priceNote}</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          <Package className="mr-1 size-3" />
          {plan.docs}
        </Badge>
        {plan.overage && (
          <Badge variant="outline" className="text-xs">
            <Zap className="mr-1 size-3" />
            {plan.overage}
          </Badge>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        variant={plan.highlight ? "default" : "outline"}
        className="w-full"
        onClick={() => onCheckout(plan)}
        disabled={plan.id !== "free" && !plan.productId}
      >
        {plan.cta}
      </Button>

      {plan.id !== "free" && !plan.productId && (
        <p className="mt-2 text-center text-xs text-muted-foreground">Coming soon</p>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function PricingPageClient() {
  const router = useRouter();
  const locale = useLocale();

  const handleCheckout = async (plan: Plan) => {
    if (plan.id === "free") {
      router.push(`/${locale}/translate`);
      return;
    }

    if (!plan.productId) return;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: plan.productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // fall through — checkout will surface error via Polar
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">
          <Star className="mr-1 size-3" />
          Simple pricing
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Pay only for what you use
        </h1>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">
          Free tier for everyone. Credit packs for occasional users. Pro plans for teams and heavy use.
          All plans include HWP/HWPX support — the only translator that does.
        </p>
      </div>

      {/* Plans grid */}
      <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onCheckout={handleCheckout} />
        ))}
      </div>

      {/* Usage calculator */}
      <div className="mb-16 grid gap-8 lg:grid-cols-2">
        <UsageCalculator />
        <div className="flex flex-col justify-center">
          <h2 className="mb-4 text-2xl font-bold">Not sure which plan?</h2>
          <p className="mb-4 text-muted-foreground">
            Use the calculator to find your best plan based on how many documents you translate per month.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              Credit packs never expire — buy once, use any time
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              Pro plans include metered overage — no hard cutoffs
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              Cancel or downgrade any time from the billing portal
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ / Trust */}
      <div className="rounded-xl border border-border bg-card p-8">
        <h2 className="mb-6 text-xl font-semibold">Common questions</h2>
        <dl className="grid gap-6 sm:grid-cols-2">
          {[
            {
              q: "What counts as a document?",
              a: "Each file upload counts as one document: one HWP, HWPX, PDF, or DOCX file. Text translation is always free and unlimited.",
            },
            {
              q: "Do credits expire?",
              a: "No. Credit packs (S and L) never expire. Pro plan monthly credits reset each billing period.",
            },
            {
              q: "What happens if I hit my free limit?",
              a: "After 3 docs/day on the free tier, you'll be prompted to upgrade. Your uploaded file is held for 10 minutes while you complete checkout.",
            },
            {
              q: "Which formats are included?",
              a: "All plans include PDF, DOCX, TXT, and image (OCR). HWP and HWPX (한글) are included on all paid plans and on the free tier.",
            },
            {
              q: "How does billing work?",
              a: "Payments are processed by Polar (polar.sh). You can manage your subscription, view invoices, and cancel anytime from the billing portal.",
            },
            {
              q: "Is my data private?",
              a: "Yes. Files are deleted immediately after processing. We never store document contents. See our Privacy Policy for details.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <dt className="mb-1 font-medium">{q}</dt>
              <dd className="text-sm text-muted-foreground">{a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
