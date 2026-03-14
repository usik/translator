// ---------------------------------------------------------------------------
// Anonymous user & session IDs (no PII, no cookies)
// ---------------------------------------------------------------------------

function getAnonId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("xenith_anon_id");
  if (!id) {
    id = Math.random().toString(16).slice(2, 10);
    localStorage.setItem("xenith_anon_id", id);
  }
  return id;
}

let sessionId: string | undefined;
function getSessionId(): string {
  if (!sessionId) {
    sessionId = Math.random().toString(16).slice(2, 10);
  }
  return sessionId;
}

// ---------------------------------------------------------------------------
// Core tracker — fires to both Vercel Analytics and GA4
// ---------------------------------------------------------------------------

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;

  try {
    const common = {
      anon_id: getAnonId(),
      session_id: getSessionId(),
      locale: document.documentElement.lang || "en",
      page_path: window.location.pathname,
    };

    const merged = { ...common, ...params };

    // Vercel Analytics (lazy import to avoid SSR issues)
    import("@vercel/analytics").then(({ track }) => {
      track(name, merged);
    }).catch(() => {});

    // Google Analytics 4
    window.gtag?.("event", name, merged);
  } catch {
    // Fire-and-forget — never block the UI
  }
}

// ---------------------------------------------------------------------------
// Tier 1: Core feature events
// ---------------------------------------------------------------------------

export function trackTextTranslate(p: {
  source_lang: string;
  target_lang: string;
  char_count: number;
  had_auto_detect: boolean;
}) {
  trackEvent("feat_text_translate", p);
}

export function trackFileTranslate(p: {
  source_lang: string;
  target_lang: string;
  file_type: string;
  file_size_kb: number;
  output_format: string;
  preserve_format: boolean;
}) {
  trackEvent("feat_file_translate", p);
}

export function trackFileConvert(p: {
  conversion_type: string;
  file_type: string;
  file_size_kb: number;
}) {
  trackEvent("feat_file_convert", p);
}

export function trackInvoiceProcess(p: {
  file_count: number;
  output_format: string;
  total_size_kb: number;
}) {
  trackEvent("feat_invoice_process", p);
}

// Error events
export function trackError(
  feature: "text_translate" | "file_translate" | "file_convert" | "invoice_process",
  p: { error_message: string; file_type?: string }
) {
  trackEvent(`err_${feature}`, p);
}

// ---------------------------------------------------------------------------
// Tier 1: UI interaction events
// ---------------------------------------------------------------------------

export function trackTabSwitch(p: { from_tab: string; to_tab: string }) {
  trackEvent("ui_tab_switch", p);
}

export function trackFileSelect(p: { file_type: string; file_size_kb: number }) {
  trackEvent("ui_file_select", p);
}

// ---------------------------------------------------------------------------
// Tier 2: Detailed interaction events
// ---------------------------------------------------------------------------

export function trackLangChange(p: {
  field: "source" | "target";
  from_lang: string;
  to_lang: string;
}) {
  trackEvent("ui_lang_change", p);
}

export function trackLangSwap(p: {
  source_lang: string;
  target_lang: string;
}) {
  trackEvent("ui_lang_swap", p);
}

export function trackCopyTranslation(p: { char_count: number }) {
  trackEvent("ui_copy_translation", p);
}

export function trackFormatPreserveToggle(p: {
  enabled: boolean;
  file_type: string;
}) {
  trackEvent("ui_format_preserve_toggle", p);
}

export function trackOutputFormatChange(p: {
  context: "translate" | "invoice";
  from_format: string;
  to_format: string;
}) {
  trackEvent("ui_output_format_change", p);
}

export function trackConvertToolClick(p: { conversion_type: string }) {
  trackEvent("feat_convert_tool_click", p);
}

export function trackBlogCtaClick(p: { post_slug: string; cta_url: string }) {
  trackEvent("feat_blog_cta_click", p);
}

export function trackBookmarkletCopy() {
  trackEvent("ui_bookmarklet_copy");
}
