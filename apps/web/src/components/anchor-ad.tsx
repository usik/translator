"use client";

import { AdSlot } from "@/components/ad-slot";
import { AD_CONFIG, AD_SLOTS } from "@/lib/ad-config";

/**
 * Sticky bottom anchor ad rendered in the root layout.
 * Only visible when NEXT_PUBLIC_ADSENSE_CLIENT_ID is set.
 */
export function AnchorAd() {
  if (!AD_CONFIG.enabled) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <AdSlot
        slotId={AD_SLOTS.layoutAnchor.slotId}
        format={AD_SLOTS.layoutAnchor.format}
        className="mx-auto max-w-7xl"
      />
    </div>
  );
}
