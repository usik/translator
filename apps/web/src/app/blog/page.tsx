import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Xenith",
  description:
    "Guides, tutorials, and tips for translating Korean documents, HWPX files, and more. 한글 문서 번역 가이드 및 팁.",
  openGraph: {
    title: "Blog — Xenith",
    description:
      "Guides and tutorials for Korean document translation. 한글 문서 번역 가이드.",
  },
  alternates: {
    languages: {
      en: "/blog",
      ko: "/blog",
    },
  },
};

const posts = [
  {
    slug: "how-to-translate-hwpx-files",
    title: "How to Translate HWPX Files Online (Without Installing Hancom Office)",
    titleKo: "한글(HWPX) 파일 온라인 번역 방법 (한컴오피스 설치 없이)",
    description:
      "Step-by-step guide to translating Korean HWPX documents to English with formatting preserved.",
    date: "2026-03-12",
    tags: ["HWPX", "한글", "Translation", "Guide"],
  },
];

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Guides, tutorials, and tips for translating Korean documents.
      </p>
      <p className="text-sm text-muted-foreground">
        한글 문서 번역에 관한 가이드와 팁을 제공합니다.
      </p>

      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group rounded-lg border border-border p-6 transition-colors hover:border-primary/40 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <time className="text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{post.titleKo}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="mt-6 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          More posts coming soon. Have a topic suggestion?{" "}
          <a
            href="https://forms.gle/PLACEHOLDER"
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
