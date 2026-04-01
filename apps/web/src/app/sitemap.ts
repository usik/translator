import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/translate-slugs";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

const locales = ["en", "ko", "ja"] as const;

const conversionSlugs = [
  "hwpx-to-pdf",
  "hwpx-to-txt",
  "hwpx-to-docx",
  "hwp-to-pdf",
  "hwp-to-txt",
  "pdf-to-docx",
  "docx-to-pdf",
  "pdf-to-txt",
  "docx-to-txt",
  "image-to-txt",
];

const translateSlugs = getAllSlugs();

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

  const blogPostSlugs = ["invoice-feature", "file-converter"];
  const blogPostPages = blogPostSlugs.flatMap((slug) =>
    localeEntry(`/blog/${slug}`, "monthly", 0.6)
  );

  const conversionPages = conversionSlugs.flatMap((slug) =>
    localeEntry(`/convert/${slug}`, "monthly", 0.8)
  );

  const translateSlugPages = translateSlugs.flatMap((slug) =>
    localeEntry(`/translate/${slug}`, "monthly", 0.85)
  );

  return [...staticPages, ...blogPages, ...blogPostPages, ...conversionPages, ...translateSlugPages];
}
