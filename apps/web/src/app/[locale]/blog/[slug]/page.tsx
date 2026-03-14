import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPost, getAllSlugs } from "@/lib/blog";
import { mdxComponents } from "@/components/blog/mdx-components";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

const locales = ["en", "ko", "ja"] as const;

export function generateStaticParams() {
  return getAllSlugs().flatMap((slug) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = getPost(slug, locale);
  if (!result) return {};

  const { meta } = result;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

  return {
    title: `${meta.title} | Xenith Blog`,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.date,
      modifiedTime: meta.updated,
      authors: [meta.author],
      tags: meta.tags,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/blog/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}/blog/${slug}`])
      ),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const result = getPost(slug, locale);
  if (!result) notFound();

  const { meta, content } = result;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.updated ?? meta.date,
    author: {
      "@type": "Person",
      name: meta.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Xenith",
      url: "https://tryxenith.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tryxenith.com/${locale}/blog/${slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      {/* Back link */}
      <Link
        href={`/${locale}/blog`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Blog</span>
      </Link>

      {/* Category badge */}
      <div className="mt-4">
        <Badge variant="secondary">{meta.category}</Badge>
      </div>

      {/* Title */}
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        {meta.title}
      </h1>

      {/* Meta line */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground border-b border-border pb-6 mb-8">
        <span>{meta.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">·</span>
        <span>{meta.readingTime}</span>
      </div>

      {/* MDX content */}
      <div className="prose dark:prose-invert">
        <MDXRemote
          source={content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </div>

      {/* Tags */}
      <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-6">
        {meta.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
