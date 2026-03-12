"use client";

import * as React from "react";
import { AD_CONFIG, FORMAT_MIN_HEIGHTS, type AdFormat } from "@/lib/ad-config";

/* ------------------------------------------------------------------ */
/* Global type augmentation so TS knows about the adsbygoogle array   */
/* ------------------------------------------------------------------ */
declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
export interface AdSlotProps {
  /** Google AdSense ad-unit slot ID */
  slotId: string;
  /** Layout format hint for AdSense */
  format?: AdFormat;
  /** Extra Tailwind / CSS classes on the outer wrapper */
  className?: string;
}

/**
 * Reusable AdSense ad-slot component.
 *
 * - Renders **nothing** when `AD_CONFIG.enabled` is false (no env var).
 * - Reserves a `min-height` based on `format` to prevent CLS.
 * - Pushes a new ad request on mount via `adsbygoogle.push({})`.
 * - Handles ad-blocker / network errors gracefully (hides the slot).
 */
export function AdSlot({ slotId, format = "auto", className }: AdSlotProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState(false);
  const pushed = React.useRef(false);

  const minHeight = FORMAT_MIN_HEIGHTS[format];

  React.useEffect(() => {
    // Nothing to do if ads are off, if we already pushed, or if there
    // was a previous error for this slot instance.
    if (!AD_CONFIG.enabled || pushed.current || error) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      // Ad-blocker or script-load failure -- hide the slot gracefully.
      console.warn(`[AdSlot] Failed to push ad for slot "${slotId}":`, err);
      setError(true);
    }
  }, [slotId, error]);

  // ---- Early exits ------------------------------------------------
  if (!AD_CONFIG.enabled) return null;
  if (error) return null;

  // ---- Render -----------------------------------------------------
  return (
    <div
      ref={containerRef}
      className={[
        "ad-slot-container overflow-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ minHeight }}
      aria-hidden="true"
      data-ad-slot={slotId}
    >
      {/* Skeleton / placeholder while AdSense fills the slot */}
      <div
        className="flex items-center justify-center rounded-md bg-muted/40 text-xs text-muted-foreground"
        style={{ minHeight }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight }}
          data-ad-client={AD_CONFIG.clientId}
          data-ad-slot={slotId}
          data-ad-format={format === "auto" ? "auto" : undefined}
          data-full-width-responsive={format === "horizontal" ? "true" : undefined}
        />
      </div>
    </div>
  );
}
