import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
}

export function getAllPosts(locale: string): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const slugs = fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const posts = slugs
    .map((slug) => {
      const result = getPost(slug, locale);
      if (!result) return null;
      return result.meta;
    })
    .filter((p): p is PostMeta => p !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPost(
  slug: string,
  locale: string
): { meta: PostMeta; content: string } | null {
  const dir = path.join(BLOG_DIR, slug);
  if (!fs.existsSync(dir)) return null;

  let filePath = path.join(dir, `${locale}.mdx`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(dir, "en.mdx");
  }
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    meta: {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      updated: data.updated,
      author: data.author ?? "Xenith",
      category: data.category ?? "General",
      tags: data.tags ?? [],
      readingTime: stats.text,
    },
    content,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}
