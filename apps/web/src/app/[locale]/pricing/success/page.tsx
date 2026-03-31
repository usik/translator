import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Purchase Complete — Xenith",
  robots: { index: false },
};

export default function PricingSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <CheckCircle className="mb-6 size-16 text-primary" />
      <h1 className="mb-3 text-3xl font-bold">You&apos;re all set!</h1>
      <p className="mb-8 max-w-sm text-muted-foreground">
        Your credits have been added to your account. Start translating right away.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/translate" className={cn(buttonVariants({ variant: "default" }))}>
          Translate a document
        </Link>
        <Link href="/pricing" className={cn(buttonVariants({ variant: "outline" }))}>
          View pricing
        </Link>
      </div>
    </div>
  );
}
