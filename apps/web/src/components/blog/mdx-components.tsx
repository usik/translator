import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import React from "react";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u3000-\u9fff\uac00-\ud7af-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function Heading({
  as: Tag,
  children,
  ...props
}: {
  as: "h1" | "h2" | "h3" | "h4";
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const text =
    typeof children === "string"
      ? children
      : React.Children.toArray(children)
          .map((c) => (typeof c === "string" ? c : ""))
          .join("");
  const id = slugify(text);
  return (
    <Tag id={id} {...props}>
      <a href={`#${id}`} className="no-underline hover:underline">
        {children}
      </a>
    </Tag>
  );
}

function isCallout(children: React.ReactNode): {
  type: string;
  color: string;
  bg: string;
} | null {
  const text = React.Children.toArray(children)
    .map((c) => {
      if (typeof c === "string") return c;
      if (React.isValidElement(c)) {
        const props = c.props as Record<string, unknown>;
        if (typeof props?.children === "string") return props.children;
      }
      return "";
    })
    .join("");

  if (text.includes("TL;DR"))
    return {
      type: "tldr",
      color: "border-primary",
      bg: "bg-primary/5 dark:bg-primary/10",
    };
  if (text.includes("\u{1F4CA}"))
    return {
      type: "stats",
      color: "border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    };
  if (text.includes("\u{1F4AC}"))
    return {
      type: "quote",
      color: "border-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    };
  if (text.includes("\u26A1"))
    return {
      type: "key",
      color: "border-yellow-500",
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
    };
  if (text.includes("\u{1F6E1}\uFE0F"))
    return {
      type: "security",
      color: "border-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
    };
  if (text.includes("\u{1F4A1}"))
    return {
      type: "tip",
      color: "border-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    };
  return null;
}

export const mdxComponents: MDXComponents = {
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,

  blockquote: ({ children, ...props }) => {
    const callout = isCallout(children);
    if (callout) {
      return (
        <aside
          className={`my-6 rounded-lg border-l-4 ${callout.color} ${callout.bg} p-4 not-prose`}
          {...props}
        >
          <div className="prose dark:prose-invert prose-sm max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </aside>
      );
    }
    return (
      <blockquote
        className="my-6 border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground"
        {...props}
      >
        {children}
      </blockquote>
    );
  },

  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/50 text-left" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }) => (
    <th className="border-b border-border px-3 py-2 font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border-b border-border px-3 py-2" {...props}>
      {children}
    </td>
  ),

  a: ({ href, children, ...props }) => {
    if (!href) return <span {...props}>{children}</span>;
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
          {...props}
        >
          {children}
          <svg
            className="ml-1 inline-block size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
          </svg>
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </Link>
    );
  },

  pre: ({ children, ...props }) => (
    <pre
      className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => {
    const isInline = typeof children === "string" && !children.includes("\n");
    if (isInline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },

  hr: () => <hr className="my-8 border-border" />,

  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),

  p: ({ children, ...props }) => {
    // Detect standalone CTA links (paragraph with only a link child)
    const childArray = React.Children.toArray(children);
    if (childArray.length === 1 && React.isValidElement(childArray[0])) {
      const child = childArray[0] as React.ReactElement<{
        href?: string;
        children?: React.ReactNode;
      }>;
      if (child.props?.href?.startsWith("http")) {
        const text =
          typeof child.props.children === "string"
            ? child.props.children
            : "";
        if (text.includes("->") || text.includes("→")) {
          return (
            <p className="my-6" {...props}>
              <a
                href={child.props.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-primary/90"
              >
                {text.replace(/\s*->\s*/g, " ").replace(/\s*→\s*/g, " ")}
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </p>
          );
        }
      }
    }
    return <p {...props}>{children}</p>;
  },

  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
};
