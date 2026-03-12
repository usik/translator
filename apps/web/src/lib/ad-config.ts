/**
 * Centralized Google AdSense configuration.
 *
 * Ads are gated behind the NEXT_PUBLIC_ADSENSE_CLIENT_ID env var.
 * When the variable is unset (local dev, preview deployments, etc.)
 * every AdSlot component renders nothing and the AdSense script is
 * never loaded --- zero runtime cost and zero CLS.
 *
 * Slot IDs use placeholder "xxxx" values. Replace them with real
 * ad-unit IDs from the AdSense dashboard before going live.
 */

export type AdFormat = "horizontal" | "rectangle" | "auto";

export interface AdSlotDefinition {
  /** Human-readable name for debugging / analytics */
  name: string;
  /** Google AdSense ad-unit slot ID */
  slotId: string;
  /** Layout hint sent to AdSense via data-ad-format */
  format: AdFormat;
  /** Minimum height (px) reserved to prevent Cumulative Layout Shift */
  minHeight: number;
}

/**
 * Minimum heights per format.
 * These match common AdSense rendered sizes so the reserved space
 * closely approximates the final ad, minimising CLS.
 */
export const FORMAT_MIN_HEIGHTS: Record<AdFormat, number> = {
  horizontal: 90, // leaderboard-class (728x90, responsive)
  rectangle: 250, // medium-rectangle (300x250, responsive)
  auto: 100, // Google picks; 100 px is a safe floor
};

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";

export const AD_CONFIG = {
  /** Master kill-switch: ads are disabled when no client ID is set */
  enabled: clientId.length > 0,
  /** Full AdSense publisher ID, e.g. "ca-pub-1234567890" */
  clientId,
} as const;

// ---------------------------------------------------------------------------
// Named slot definitions
// ---------------------------------------------------------------------------

export const AD_SLOTS = {
  /** Sticky anchor ad pinned to the bottom of every page (layout-level) */
  layoutAnchor: {
    name: "layout-anchor",
    slotId: "xxxx-layout-anchor",
    format: "horizontal",
    minHeight: FORMAT_MIN_HEIGHTS.horizontal,
  },

  /** Below the translator widget on /translate */
  translateBelowWidget: {
    name: "translate-below-widget",
    slotId: "xxxx-translate-below-widget",
    format: "horizontal",
    minHeight: FORMAT_MIN_HEIGHTS.horizontal,
  },

  /** Below the conversion-tools grid on /convert */
  convertBelowGrid: {
    name: "convert-below-grid",
    slotId: "xxxx-convert-below-grid",
    format: "horizontal",
    minHeight: FORMAT_MIN_HEIGHTS.horizontal,
  },

  /** Below the individual conversion card on /convert/[slug] */
  convertSlugBelowCard: {
    name: "convert-slug-below-card",
    slotId: "xxxx-convert-slug-below-card",
    format: "rectangle",
    minHeight: FORMAT_MIN_HEIGHTS.rectangle,
  },

  /** Between the hero and features sections on the home page */
  homeBetweenSections: {
    name: "home-between-sections",
    slotId: "xxxx-home-between-sections",
    format: "horizontal",
    minHeight: FORMAT_MIN_HEIGHTS.horizontal,
  },
} as const satisfies Record<string, AdSlotDefinition>;
