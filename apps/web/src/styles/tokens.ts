/**
 * Xenith Design Tokens
 *
 * Brand: File format converter, text extraction, and translation tool.
 * Stack: Next.js 15, Tailwind CSS v4, shadcn/ui, Framer Motion.
 *
 * These tokens are the single source of truth for brand constants.
 * CSS custom properties in globals.css mirror these values.
 * Use these in JS/TS contexts (e.g. Framer Motion, canvas, OG images).
 */

// ---------------------------------------------------------------------------
// Brand metadata
// ---------------------------------------------------------------------------

export const brand = {
  name: "Xenith",
  tagline: "Translate Text, Files & Korean Documents",
  url: "https://tryxenith.com",
  assets: {
    icon: "/icon.svg",
    logo: "/logo.svg",
  },
} as const;

// ---------------------------------------------------------------------------
// Color palette
//
// Primary: Blue-Indigo — communicates trust, intelligence, and technology.
// Values are expressed in both oklch (for CSS) and hex (for non-CSS use).
// oklch is the native format used in Tailwind v4 / globals.css.
// ---------------------------------------------------------------------------

export const colors = {
  // Brand primary — blue-indigo
  primary: {
    50:  { oklch: "oklch(0.97 0.02 263)", hex: "#F0F1FF" },
    100: { oklch: "oklch(0.93 0.04 263)", hex: "#E0E3FF" },
    200: { oklch: "oklch(0.84 0.09 263)", hex: "#BBC1FA" },
    300: { oklch: "oklch(0.72 0.16 263)", hex: "#8D99F3" },
    400: { oklch: "oklch(0.63 0.21 263)", hex: "#6677EF" },
    /** Brand primary — used for --primary in globals.css */
    500: { oklch: "oklch(0.546 0.245 262.881)", hex: "#4361EE" },
    600: { oklch: "oklch(0.47 0.245 263)", hex: "#3450D5" },
    700: { oklch: "oklch(0.39 0.22 263)",  hex: "#2A3FB8" },
    800: { oklch: "oklch(0.31 0.18 263)",  hex: "#203090" },
    900: { oklch: "oklch(0.23 0.13 263)",  hex: "#172268" },
  },

  // Semantic colors
  success: { oklch: "oklch(0.65 0.18 150)", hex: "#22C55E" },
  warning: { oklch: "oklch(0.76 0.17 83)",  hex: "#F59E0B" },
  error:   { oklch: "oklch(0.58 0.245 27)", hex: "#EF4444" },

  // Neutral ramp (gray)
  neutral: {
    50:  { hex: "#FAFAFA" },
    100: { hex: "#F4F4F5" },
    200: { hex: "#E4E4E7" },
    300: { hex: "#D4D4D8" },
    400: { hex: "#A1A1AA" },
    500: { hex: "#71717A" },
    600: { hex: "#52525B" },
    700: { hex: "#3F3F46" },
    800: { hex: "#27272A" },
    900: { hex: "#18181B" },
  },

  white: "#FFFFFF",
  black: "#000000",
} as const;

// ---------------------------------------------------------------------------
// Typography
//
// Primary typeface: Inter (already loaded via next/font/google in layout.tsx).
// Using Inter variable font across all weights — no secondary typeface needed.
// Scale follows a Minor Third ratio (1.25×) for a professional, compact feel.
// ---------------------------------------------------------------------------

export const typography = {
  fontFamily: {
    sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
    mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
  },
  fontSize: {
    xs:   { size: "0.75rem",  lineHeight: "1rem"    }, // 12px — captions, labels
    sm:   { size: "0.875rem", lineHeight: "1.25rem" }, // 14px — secondary text
    base: { size: "1rem",     lineHeight: "1.5rem"  }, // 16px — body default
    lg:   { size: "1.125rem", lineHeight: "1.75rem" }, // 18px — large body
    xl:   { size: "1.25rem",  lineHeight: "1.75rem" }, // 20px — subheading
    "2xl":{ size: "1.5rem",   lineHeight: "2rem"    }, // 24px — h3
    "3xl":{ size: "1.875rem", lineHeight: "2.25rem" }, // 30px — h2
    "4xl":{ size: "2.25rem",  lineHeight: "2.5rem"  }, // 36px — h1
    "5xl":{ size: "3rem",     lineHeight: "1"       }, // 48px — hero
    "6xl":{ size: "3.75rem",  lineHeight: "1"       }, // 60px — display
  },
  fontWeight: {
    normal:   400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },
  letterSpacing: {
    tight:  "-0.025em", // Headings
    normal: "0em",
    wide:   "0.025em",  // Labels / caps
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing & Layout
// ---------------------------------------------------------------------------

export const layout = {
  maxWidth: "80rem",    // 1280px — max-w-7xl
  containerPadding: "1rem", // px-4, up to px-8 at lg
  borderRadius: {
    sm:   "0.375rem", // 6px
    md:   "0.5rem",   // 8px
    DEFAULT: "0.625rem", // 10px — --radius base
    lg:   "0.875rem", // 14px
    xl:   "1.125rem", // 18px
    "2xl":"1.375rem", // 22px
    full: "9999px",
  },
} as const;

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

export const animation = {
  duration: {
    fast:   150,  // ms — micro interactions
    normal: 250,  // ms — standard transitions
    slow:   400,  // ms — layout / page transitions
  },
  easing: {
    default:  [0.4, 0, 0.2, 1],   // ease-in-out
    enter:    [0, 0, 0.2, 1],     // ease-out
    exit:     [0.4, 0, 1, 1],     // ease-in
    spring:   { type: "spring", stiffness: 380, damping: 30 },
  },
} as const;

// ---------------------------------------------------------------------------
// Tailwind v4 theme extension reference
//
// Add the following to the @theme block in globals.css to expose brand colors
// as Tailwind utility classes (e.g. `bg-brand-500`, `text-brand-600`).
//
//   --color-brand-50:  #F0F1FF;
//   --color-brand-100: #E0E3FF;
//   --color-brand-200: #BBC1FA;
//   --color-brand-300: #8D99F3;
//   --color-brand-400: #6677EF;
//   --color-brand-500: #4361EE;   ← primary
//   --color-brand-600: #3450D5;
//   --color-brand-700: #2A3FB8;
//   --color-brand-800: #203090;
//   --color-brand-900: #172268;
// ---------------------------------------------------------------------------
