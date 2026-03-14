import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Blog — Xenith",
    ko: "블로그 — Xenith",
    ja: "ブログ — Xenith",
  };
  const descriptions: Record<string, string> = {
    en: "Guides, tutorials, and tips for translating Korean documents, HWPX files, and more.",
    ko: "한글 문서 번역 가이드 및 팁. HWPX 파일 변환, 세금계산서 처리 등.",
    ja: "韓国語ドキュメント翻訳のガイドとヒント。HWPXファイル変換、請求書処理など。",
  };

  return {
    title: titles[locale] ?? titles.en,
    description: descriptions[locale] ?? descriptions.en,
    openGraph: {
      title: titles[locale] ?? titles.en,
      description: descriptions[locale] ?? descriptions.en,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/blog`,
      languages: Object.fromEntries(
        ["en", "ko", "ja"].map((l) => [l, `${siteUrl}/${l}/blog`])
      ),
    },
  };
}

const subtitles: Record<string, { title: string; subtitle: string }> = {
  en: {
    title: "Blog",
    subtitle: "Guides, tutorials, and tips for translating Korean documents.",
  },
  ko: {
    title: "블로그",
    subtitle: "한글 문서 번역에 관한 가이드와 팁을 제공합니다.",
  },
  ja: {
    title: "ブログ",
    subtitle: "韓国語ドキュメント翻訳のガイドとヒント。",
  },
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = getAllPosts(locale);
  const t = subtitles[locale] ?? subtitles.en;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">{t.subtitle}</p>

      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-lg border border-border p-6 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <time className="text-xs text-muted-foreground">
                    {new Date(post.date).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    · {post.readingTime}
                  </span>
                </div>
              </div>
              <ArrowRight className="mt-6 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </article>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="mt-12 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        </div>
      )}

      <div className="mt-12 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          More posts coming soon. Have a topic suggestion?{" "}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfuPdbfsz69XeauhvQN_rsYUVNzj9RIcE5ryBDiCohphJ0a5w/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Let us know
          </a>
          .
        </p>
      </div>
    </section>
  );
}
