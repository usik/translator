import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

const locales = ["en", "ko", "ja"] as const;

const conversionSlugs = [
  "hwpx-to-pdf",
  "hwpx-to-txt",
  "pdf-to-docx",
  "docx-to-pdf",
  "pdf-to-txt",
  "docx-to-txt",
  "image-to-txt",
];

function localeEntry(
  path: string,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}${path}`])
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    ...localeEntry("", "weekly", 1),
    ...localeEntry("/translate", "weekly", 0.9),
    ...localeEntry("/convert", "weekly", 0.9),
    ...localeEntry("/invoice", "weekly", 0.9),
    ...localeEntry("/privacy", "yearly", 0.3),
    ...localeEntry("/terms", "yearly", 0.3),
  ];

  const blogPages = localeEntry("/blog", "weekly", 0.7);

  const conversionPages = conversionSlugs.flatMap((slug) =>
    localeEntry(`/convert/${slug}`, "monthly", 0.8)
  );

  return [...staticPages, ...blogPages, ...conversionPages];
}
