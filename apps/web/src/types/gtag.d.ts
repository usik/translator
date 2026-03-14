interface GtagEventParams {
  [key: string]: string | number | boolean | undefined;
}

interface Window {
  gtag?: (
    command: "event" | "config" | "js",
    targetOrName: string | Date,
    params?: GtagEventParams
  ) => void;
  dataLayer?: unknown[];
}
