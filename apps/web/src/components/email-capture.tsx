"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface EmailCaptureProps {
  source: string; // "invoice" | "translate" | "convert"
  onDismiss?: () => void;
}

export function EmailCapture({ source, onDismiss }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
    // Remember dismissal for this session
    try { sessionStorage.setItem("xenith_email_dismissed", "1"); } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/v1/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      if (res.ok) {
        setStatus("done");
        try { sessionStorage.setItem("xenith_email_captured", "1"); } catch {}
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="relative mt-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4"
        >
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>

          {status === "done" ? (
            <div className="flex items-center gap-2.5 text-sm">
              <CheckCircle2 className="size-5 shrink-0 text-primary" />
              <span>
                <span className="font-medium">You&apos;re in!</span> We&apos;ll send you updates on new features.
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="size-4 shrink-0 text-primary" />
                <p className="text-sm font-medium">Get notified of new features</p>
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 min-w-0 rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={status === "loading"}
                  className="shrink-0 gap-1"
                >
                  {status === "loading" ? "..." : (
                    <>Notify me <ArrowRight className="size-3" /></>
                  )}
                </Button>
              </form>
              {status === "error" && (
                <p className="mt-1.5 text-xs text-destructive">Something went wrong. Try again.</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">No spam. Unsubscribe any time.</p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
