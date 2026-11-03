# Blog Post Formatting Guide (2025-2026)

A concrete, research-backed guide for formatting Xenith blog posts that rank well, read well, and convert. Every recommendation below is drawn from analysis of top-performing SaaS blogs (Stripe, Vercel, Linear, Notion, Grammarly, Hotjar) and the latest SEO/AI search research.

---

## Table of Contents

1. [The 14-Element Post Structure](#1-the-14-element-post-structure)
2. [Hero / Intro Section](#2-hero--intro-section)
3. [TL;DR and Key Takeaways](#3-tldr-and-key-takeaways)
4. [Heading Hierarchy](#4-heading-hierarchy)
5. [Paragraph and Readability Rules](#5-paragraph-and-readability-rules)
6. [Callout and Highlight Boxes](#6-callout-and-highlight-boxes)
7. [Visual Separators](#7-visual-separators)
8. [FAQ Section (SEO Schema)](#8-faq-section-seo-schema)
9. [CTA Placement Strategy](#9-cta-placement-strategy)
10. [Table of Contents Component](#10-table-of-contents-component)
11. [Images and Visual Rhythm](#11-images-and-visual-rhythm)
12. [Mobile-First Formatting](#12-mobile-first-formatting)
13. [Dark Mode Considerations](#13-dark-mode-considerations)
14. [Before / After Examples](#14-before--after-examples)

---

## 1. The 14-Element Post Structure

Modern blog posts in 2026 follow a specific 14-element sequence. The biggest shift from older formats: **the summary goes at the top, not the bottom.** AI search engines extract answers top-down, and content grounding plateaus at roughly 540 words -- if your direct answer is not in the first section, you lose to pages that put it there.

```
1.  H1 headline (contains target keyword, phrased as natural-language query)
2.  Category badge / pill (e.g., "Guide", "Tutorial", "Case Study")
3.  Meta line: author name + avatar, publish date, read time, "last updated" date
4.  Feature image / hero visual (900x600px min, optimized WebP)
5.  TL;DR section (80-100 words or 3-5 bullet points)
6.  Table of Contents (auto-generated, for posts > 1,000 words)
7.  Introduction paragraph (hook + relevance + thesis)
8.  Main body: H2/H3 sections with interleaved visuals
9.  Inline CTA (roughly halfway through, visually distinct)
10. FAQ section (question-based H3s with concise answers)
11. Conclusion with primary CTA
12. Author bio with Person schema
13. Related posts (text-only links, no thumbnails)
14. JSON-LD structured data (Article + FAQPage schema)
```

---

## 2. Hero / Intro Section

The hero section is the first 5 seconds of your post. It determines whether readers stay or bounce.

### Pattern: Modern Blog Hero

```html
<article class="blog-post">
  <!-- Category badge -->
  <div class="flex items-center gap-3 mb-4">
    <span class="inline-flex items-center px-3 py-1 rounded-full
                 text-xs font-medium tracking-wide uppercase
                 bg-blue-50 text-blue-700
                 dark:bg-blue-900/30 dark:text-blue-300">
      Guide
    </span>
    <span class="text-sm text-gray-500 dark:text-gray-400">
      8 min read
    </span>
  </div>

  <!-- H1 Headline -->
  <h1 class="text-4xl sm:text-5xl font-bold tracking-tight
             text-gray-900 dark:text-white leading-[1.1] mb-6">
    How to Translate HWPX Documents
    Without Losing Formatting
  </h1>

  <!-- Subtitle / deck -->
  <p class="text-xl text-gray-600 dark:text-gray-300
            leading-relaxed max-w-2xl mb-8">
    Korean government and university documents use the HWPX format.
    Here is how to translate them while preserving every table,
    header, and footnote.
  </p>

  <!-- Meta line -->
  <div class="flex items-center gap-4 text-sm text-gray-500
              dark:text-gray-400 mb-8 pb-8
              border-b border-gray-200 dark:border-gray-700">
    <img src="/authors/yusik.jpg" alt="Yusik Kim"
         class="w-10 h-10 rounded-full" />
    <div>
      <span class="font-medium text-gray-900 dark:text-white">
        Yusik Kim
      </span>
      <span class="mx-2">&middot;</span>
      <time datetime="2026-03-14">March 14, 2026</time>
      <span class="mx-2">&middot;</span>
      <span>Updated March 14, 2026</span>
    </div>
  </div>

  <!-- Feature image -->
  <figure class="mb-12 rounded-xl overflow-hidden border
                 border-gray-200 dark:border-gray-700">
    <img src="/blog/hwpx-guide/hero.webp"
         alt="Screenshot of a translated HWPX document"
         class="w-full" loading="eager" />
    <figcaption class="px-4 py-2 text-sm text-gray-500
                       dark:text-gray-400 bg-gray-50
                       dark:bg-gray-800/50">
      A Korean government form translated to English with
      formatting preserved.
    </figcaption>
  </figure>
</article>
```

### Key Principles

- **Badge/pill** before the headline signals content type instantly (Guide, Tutorial, Comparison, Case Study)
- **Headline**: 50-70 characters, phrased as a question or "how-to" for featured snippet eligibility
- **Subtitle/deck**: 1-2 sentences max, restates the value proposition in plain language
- **Meta line**: Author photo + name + date + read time builds trust; "last updated" date signals freshness
- **Hero image**: Full-width, rounded corners, with a descriptive caption -- never decorative stock photos

---

## 3. TL;DR and Key Takeaways

Place the TL;DR **immediately after the hero image, before the introduction.** This is the single biggest structural change in 2026 blog formatting. AI engines extract answers top-down. Readers who find their answer immediately are more likely to stay and read the full piece.

### Pattern: TL;DR Box

```html
<aside class="my-8 p-6 rounded-xl
              bg-gradient-to-br from-blue-50 to-indigo-50
              dark:from-blue-950/40 dark:to-indigo-950/40
              border border-blue-200 dark:border-blue-800">
  <div class="flex items-center gap-2 mb-3">
    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400"
         fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h2 class="text-sm font-semibold uppercase tracking-wider
               text-blue-800 dark:text-blue-300">
      TL;DR
    </h2>
  </div>
  <ul class="space-y-2 text-gray-700 dark:text-gray-300">
    <li class="flex gap-2">
      <span class="text-blue-500 mt-1 flex-shrink-0">&bull;</span>
      <span>HWPX files are the Korean standard for government and
            academic documents.</span>
    </li>
    <li class="flex gap-2">
      <span class="text-blue-500 mt-1 flex-shrink-0">&bull;</span>
      <span>Xenith translates them while preserving all formatting --
            tables, headers, footnotes.</span>
    </li>
    <li class="flex gap-2">
      <span class="text-blue-500 mt-1 flex-shrink-0">&bull;</span>
      <span>Upload your file and get a translated HWPX back in
            under 60 seconds.</span>
    </li>
  </ul>
</aside>
```

### Tailwind Component (React/Next.js)

```tsx
interface TLDRProps {
  points: string[];
}

function TLDR({ points }: TLDRProps) {
  return (
    <aside className="my-8 p-6 rounded-xl
      bg-gradient-to-br from-blue-50 to-indigo-50
      dark:from-blue-950/40 dark:to-indigo-950/40
      border border-blue-200 dark:border-blue-800">
      <h2 className="text-sm font-semibold uppercase tracking-wider
        text-blue-800 dark:text-blue-300 mb-3">
        TL;DR
      </h2>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-blue-500 mt-1 flex-shrink-0">
              &bull;
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

### Guidelines

- **Length**: 80-100 words or 3-5 bullet points
- **Placement**: After hero, before introduction
- **Tone**: Direct, factual -- answer the headline's question
- **Do not** repeat the TL;DR verbatim in the conclusion

---

## 4. Heading Hierarchy

Heading structure is critical for both SEO and AI retrieval. AI models rely on headings to identify topics, questions, and answers within a page.

### Rules

| Rule | Detail |
|------|--------|
| One H1 per page | The blog post title only |
| H2 for major sections | Introduce a new H2 every 300-500 words |
| H3 for subsections | Break down H2 topics into specifics |
| H4 for supporting detail | Examples, edge cases, notes |
| Never skip levels | Do not jump from H2 to H4 |
| Question-based headings | Use "How", "What", "Why" in H2/H3 for featured snippet eligibility |
| Keywords in headings | Place primary/secondary keywords naturally in H2-H3 tags |

### Pattern: Heading Styles (Tailwind)

```css
/* H1 - Page title only */
.blog-h1 {
  @apply text-4xl sm:text-5xl font-bold tracking-tight
         text-gray-900 dark:text-white leading-[1.1];
}

/* H2 - Major section */
.blog-h2 {
  @apply text-2xl sm:text-3xl font-bold tracking-tight
         text-gray-900 dark:text-white leading-tight
         mt-16 mb-6;
}

/* H3 - Subsection */
.blog-h3 {
  @apply text-xl sm:text-2xl font-semibold
         text-gray-900 dark:text-white leading-snug
         mt-10 mb-4;
}

/* H4 - Detail/example */
.blog-h4 {
  @apply text-lg font-semibold
         text-gray-800 dark:text-gray-200 leading-snug
         mt-8 mb-3;
}
```

### Spacing Rhythm

Generous vertical spacing between sections creates "breathing room" and signals topic changes. The pattern from top SaaS blogs:

- **Before H2**: `mt-16` (64px) -- a major visual break
- **Before H3**: `mt-10` (40px) -- a moderate break
- **Before H4**: `mt-8` (32px) -- a minor break
- **After all headings**: `mb-4` to `mb-6` -- tight coupling to the content they introduce

---

## 5. Paragraph and Readability Rules

### Core Rules

1. **2-3 sentences per paragraph maximum.** On mobile, even 4 sentences feels like a wall.
2. **One idea per paragraph.** If you introduce a second concept, start a new paragraph.
3. **50-75 characters per line** on desktop (WCAG 1.4.8 Level AAA max: 80 characters). Use `max-w-prose` or `max-w-2xl` in Tailwind.
4. **Line height: 1.6-1.75** for body text. Use `leading-relaxed` (1.625) or `leading-loose` (2.0).
5. **Font size: 18px minimum** for body text. 16px is the absolute floor.
6. **Active voice.** "Xenith translates your file" not "Your file is translated by Xenith."
7. **Bold strategically.** Bold only key terms, conclusions, and data points. Never bold entire sentences. Limit to 2-3 highlights per section.
8. **Convert 3+ items into a list.** If you are listing three or more things in a sentence, break them into bullets or numbered items.

### Pattern: Body Text Container

```html
<div class="prose prose-lg dark:prose-invert
            max-w-prose mx-auto
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-p:leading-relaxed
            prose-a:text-blue-600 dark:prose-a:text-blue-400
            prose-a:underline prose-a:underline-offset-2
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-headings:scroll-mt-20">
  <!-- Blog content rendered from MDX here -->
</div>
```

### Reading Level

Target a Flesch-Kincaid reading level of grade 7-9. Tools like Hemingway Editor help. AI search engines prefer content that is clear and direct over content that is verbose and academic.

---

## 6. Callout and Highlight Boxes

Callout boxes draw attention to critical information, tips, warnings, and key quotes. They break up long text and provide visual anchoring points as readers scroll.

### Five Callout Types

Use consistent callout types across all posts:

#### 1. Info / Note (blue)

```html
<aside class="my-6 p-5 rounded-lg
              bg-blue-50 dark:bg-blue-950/30
              border-l-4 border-blue-500
              text-gray-700 dark:text-gray-300">
  <p class="font-semibold text-blue-800 dark:text-blue-300 mb-1">
    Note
  </p>
  <p>HWPX is the XML-based successor to HWP, introduced by Hancom
     in 2014. Most Korean government agencies now require this
     format.</p>
</aside>
```

#### 2. Tip / Pro Tip (green)

```html
<aside class="my-6 p-5 rounded-lg
              bg-green-50 dark:bg-green-950/30
              border-l-4 border-green-500
              text-gray-700 dark:text-gray-300">
  <p class="font-semibold text-green-800 dark:text-green-300 mb-1">
    Pro Tip
  </p>
  <p>For best results, upload the original HWPX file rather than
     a PDF export. The original preserves all structural metadata
     that Xenith uses for format-aware translation.</p>
</aside>
```

#### 3. Warning / Caution (amber)

```html
<aside class="my-6 p-5 rounded-lg
              bg-amber-50 dark:bg-amber-950/30
              border-l-4 border-amber-500
              text-gray-700 dark:text-gray-300">
  <p class="font-semibold text-amber-800 dark:text-amber-300 mb-1">
    Warning
  </p>
  <p>PDF translation does not preserve formatting. If you need
     format preservation, use the original HWPX or DOCX source
     file.</p>
</aside>
```

#### 4. Important / Critical (red)

```html
<aside class="my-6 p-5 rounded-lg
              bg-red-50 dark:bg-red-950/30
              border-l-4 border-red-500
              text-gray-700 dark:text-gray-300">
  <p class="font-semibold text-red-800 dark:text-red-300 mb-1">
    Important
  </p>
  <p>Never share documents containing personal information
     (resident registration numbers, passport IDs) through
     unencrypted channels.</p>
</aside>
```

#### 5. Quote / Highlight (purple)

```html
<aside class="my-6 p-5 rounded-lg
              bg-purple-50 dark:bg-purple-950/30
              border-l-4 border-purple-500
              text-gray-700 dark:text-gray-300">
  <p class="font-semibold text-purple-800 dark:text-purple-300 mb-1">
    Key Insight
  </p>
  <p>"Format-preserving translation saves our immigration team
     roughly 4 hours per document compared to manual re-formatting."</p>
  <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">
    -- Korean Immigration Services case study
  </p>
</aside>
```

### React Component

```tsx
type CalloutType = "note" | "tip" | "warning" | "important" | "quote";

const calloutStyles: Record<CalloutType, {
  bg: string; border: string; title: string; titleColor: string;
}> = {
  note: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-500",
    title: "Note",
    titleColor: "text-blue-800 dark:text-blue-300",
  },
  tip: {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-500",
    title: "Pro Tip",
    titleColor: "text-green-800 dark:text-green-300",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-500",
    title: "Warning",
    titleColor: "text-amber-800 dark:text-amber-300",
  },
  important: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-500",
    title: "Important",
    titleColor: "text-red-800 dark:text-red-300",
  },
  quote: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-500",
    title: "Key Insight",
    titleColor: "text-purple-800 dark:text-purple-300",
  },
};

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

function Callout({ type, children }: CalloutProps) {
  const s = calloutStyles[type];
  return (
    <aside className={`my-6 p-5 rounded-lg border-l-4
      ${s.bg} ${s.border}
      text-gray-700 dark:text-gray-300`}>
      <p className={`font-semibold mb-1 ${s.titleColor}`}>
        {s.title}
      </p>
      <div>{children}</div>
    </aside>
  );
}
```

---

## 7. Visual Separators

Modern design favors **subtle separation** over heavy horizontal rules. Use spacing, color shifts, and lightweight dividers.

### Preferred Techniques (ranked by subtlety)

#### 1. Whitespace only (preferred for section breaks within an H2)

```html
<div class="my-12"></div>
<!-- Or simply use generous mt-16 on H2 headings -->
```

#### 2. Thin line (for major topic transitions)

```html
<hr class="my-16 border-t border-gray-200 dark:border-gray-700" />
```

#### 3. Decorative dot separator (for stylistic breaks)

```html
<div class="my-12 flex justify-center gap-2 text-gray-300
            dark:text-gray-600" aria-hidden="true">
  <span>&bull;</span>
  <span>&bull;</span>
  <span>&bull;</span>
</div>
```

#### 4. Gradient fade (for premium/editorial feel)

```html
<div class="my-16 h-px
            bg-gradient-to-r from-transparent
            via-gray-300 dark:via-gray-600
            to-transparent">
</div>
```

#### 5. Card break (for a section that should feel like its own module)

```html
<div class="my-12 p-8 rounded-2xl
            bg-gray-50 dark:bg-gray-800/50
            border border-gray-200 dark:border-gray-700">
  <!-- Self-contained content block: comparison table, code
       example, embedded demo -->
</div>
```

### Guidelines

- Do **not** use `<hr>` between every section -- it creates visual noise
- Use the gradient fade or dot separator sparingly (max 2-3 per post)
- Between H2 sections, the `mt-16` spacing on headings is usually sufficient
- Reserve card breaks for interactive or reference content (tables, code blocks, embedded tools)

---

## 8. FAQ Section (SEO Schema)

FAQ sections serve double duty: they capture long-tail keyword traffic and qualify for Google's rich results (20-40% higher CTR). Pages with FAQPage schema achieve a citation rate of 41% in AI search vs. 15% without it.

### HTML Structure

```html
<section class="my-16">
  <h2 class="text-2xl sm:text-3xl font-bold tracking-tight
             text-gray-900 dark:text-white mb-8">
    Frequently Asked Questions
  </h2>

  <div class="space-y-6">
    <details class="group rounded-lg border border-gray-200
                    dark:border-gray-700 overflow-hidden">
      <summary class="flex items-center justify-between
                      cursor-pointer p-5
                      bg-white dark:bg-gray-800
                      hover:bg-gray-50 dark:hover:bg-gray-750
                      font-medium text-gray-900 dark:text-white">
        <span>What is an HWPX file?</span>
        <svg class="w-5 h-5 text-gray-500 transition-transform
                    group-open:rotate-180"
             fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div class="p-5 pt-0 text-gray-600 dark:text-gray-300
                  leading-relaxed">
        <p>HWPX is an XML-based document format created by Hancom,
           the dominant office suite in South Korea. It is the
           standard format for Korean government forms, university
           documents, and legal contracts. Unlike HWP (its binary
           predecessor), HWPX files can be parsed and manipulated
           programmatically.</p>
      </div>
    </details>

    <details class="group rounded-lg border border-gray-200
                    dark:border-gray-700 overflow-hidden">
      <summary class="flex items-center justify-between
                      cursor-pointer p-5
                      bg-white dark:bg-gray-800
                      hover:bg-gray-50 dark:hover:bg-gray-750
                      font-medium text-gray-900 dark:text-white">
        <span>Can I translate HWPX files without losing formatting?</span>
        <svg class="w-5 h-5 text-gray-500 transition-transform
                    group-open:rotate-180"
             fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div class="p-5 pt-0 text-gray-600 dark:text-gray-300
                  leading-relaxed">
        <p>Yes. Xenith extracts the document's structural metadata
           (tables, headers, footnotes, styles), translates only the
           text content, then reassembles the file in the original
           HWPX format. The output preserves all formatting.</p>
      </div>
    </details>
  </div>
</section>
```

### JSON-LD Schema (place in `<head>` or `<script>` tag)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an HWPX file?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "HWPX is an XML-based document format created by Hancom, the dominant office suite in South Korea. It is the standard format for Korean government forms, university documents, and legal contracts."
      }
    },
    {
      "@type": "Question",
      "name": "Can I translate HWPX files without losing formatting?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Xenith extracts the document's structural metadata (tables, headers, footnotes, styles), translates only the text content, then reassembles the file in the original HWPX format. The output preserves all formatting."
      }
    }
  ]
}
</script>
```

### Article Schema

Every post should also include `Article` or `BlogPosting` schema:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How to Translate HWPX Documents Without Losing Formatting",
  "description": "A step-by-step guide to translating Korean HWPX files while preserving all document formatting.",
  "image": "https://tryxenith.com/blog/hwpx-guide/hero.webp",
  "author": {
    "@type": "Person",
    "name": "Yusik Kim",
    "url": "https://tryxenith.com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Xenith",
    "logo": {
      "@type": "ImageObject",
      "url": "https://tryxenith.com/logo.png"
    }
  },
  "datePublished": "2026-03-14",
  "dateModified": "2026-03-14"
}
</script>
```

### FAQ Formatting Rules

- 5-8 questions per post (too many dilutes the signal)
- Answers: 40-60 words each (the sweet spot for featured snippet extraction)
- Use question-based headings (mirrors how people search)
- Place the FAQ section near the bottom, before the conclusion

---

## 9. CTA Placement Strategy

Research shows CTAs placed above the fold outperform below-fold CTAs by 304%. Centered CTAs get 682% more clicks than left-aligned. Reducing to a single primary CTA per context increased conversions by 266%.

### The 3-CTA Framework

For a typical 2,000-word blog post, use exactly three CTAs at different positions with escalating intent:

#### Position 1: After TL;DR (Low Friction)

```html
<!-- Subtle text CTA, low commitment -->
<p class="my-6 text-center">
  <a href="/translate"
     class="inline-flex items-center gap-2
            text-blue-600 dark:text-blue-400
            font-medium hover:underline
            underline-offset-2">
    Try translating a document free
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24"
         stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </a>
</p>
```

#### Position 2: Mid-Article (Medium Friction)

Place roughly halfway through the post, inside a visually distinct card:

```html
<div class="my-12 p-8 rounded-2xl text-center
            bg-gradient-to-br from-blue-50 to-indigo-50
            dark:from-blue-950/30 dark:to-indigo-950/30
            border border-blue-200 dark:border-blue-800">
  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
    See format-preserving translation in action
  </h3>
  <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
    Upload any HWPX or DOCX file and get a translated version back
    with all formatting intact.
  </p>
  <a href="/translate"
     class="inline-flex items-center justify-center
            px-6 py-3 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            transition-colors">
    Translate a Document Free
  </a>
  <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
    No sign-up required. 5 free translations per month.
  </p>
</div>
```

#### Position 3: End of Post (High Friction)

The conclusion CTA can ask for more -- sign-ups, demos, sharing:

```html
<div class="my-16 p-8 rounded-2xl
            bg-gray-900 dark:bg-white/5
            text-center">
  <h3 class="text-2xl font-bold text-white mb-3">
    Ready to translate your Korean documents?
  </h3>
  <p class="text-gray-300 mb-6 max-w-lg mx-auto">
    Xenith is the only translator that supports HWPX files with
    full format preservation. Try it today.
  </p>
  <div class="flex flex-col sm:flex-row gap-3 justify-center">
    <a href="/translate"
       class="inline-flex items-center justify-center
              px-6 py-3 rounded-lg
              bg-blue-600 hover:bg-blue-700
              text-white font-medium transition-colors">
      Start Translating
    </a>
    <a href="/pricing"
       class="inline-flex items-center justify-center
              px-6 py-3 rounded-lg
              border border-gray-600 hover:border-gray-400
              text-gray-300 hover:text-white
              font-medium transition-colors">
      View Pricing
    </a>
  </div>
</div>
```

### CTA Design Rules

| Rule | Why |
|------|-----|
| One primary CTA per section | Reducing choices increased conversions by 266% |
| Center-align CTAs | 682% more clicks than left-aligned |
| Use contrasting colors | CTA must visually "pop" from surrounding content |
| Add social proof near CTAs | Testimonials or trust signals near CTAs boost conversions |
| Secondary CTAs use ghost buttons | Text links or bordered buttons, never competing with the primary |
| Include a friction reducer | "No sign-up required", "Free", "Takes 30 seconds" |

---

## 10. Table of Contents Component

For posts over 1,000 words, a table of contents is essential. On desktop, use a **sticky left sidebar**. On mobile, show an **expandable ToC at the top** of the post.

### Desktop: Sticky Sidebar ToC

```html
<nav class="hidden lg:block sticky top-24
            w-56 shrink-0 self-start
            text-sm text-gray-500 dark:text-gray-400">
  <p class="font-semibold text-gray-900 dark:text-white
            uppercase tracking-wider text-xs mb-4">
    On this page
  </p>
  <ul class="space-y-2 border-l border-gray-200
             dark:border-gray-700">
    <li>
      <a href="#what-is-hwpx"
         class="block pl-4 py-1 -ml-px
                border-l-2 border-transparent
                hover:border-blue-500
                hover:text-gray-900 dark:hover:text-white
                transition-colors
                [&.active]:border-blue-500
                [&.active]:text-blue-600
                dark:[&.active]:text-blue-400">
        What is HWPX?
      </a>
    </li>
    <li>
      <a href="#how-translation-works"
         class="block pl-4 py-1 -ml-px
                border-l-2 border-transparent
                hover:border-blue-500
                hover:text-gray-900 dark:hover:text-white
                transition-colors">
        How Translation Works
      </a>
    </li>
    <!-- More items... -->
  </ul>
</nav>
```

### Mobile: Expandable ToC

```html
<details class="lg:hidden my-6 rounded-lg border
                border-gray-200 dark:border-gray-700
                overflow-hidden">
  <summary class="flex items-center justify-between
                  p-4 cursor-pointer
                  bg-gray-50 dark:bg-gray-800
                  font-medium text-gray-900 dark:text-white
                  text-sm">
    <span>Table of Contents</span>
    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24"
         stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round"
            stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <ul class="p-4 pt-0 space-y-2 text-sm
             text-gray-600 dark:text-gray-300">
    <li><a href="#what-is-hwpx" class="hover:text-blue-600">
      What is HWPX?
    </a></li>
    <li><a href="#how-translation-works" class="hover:text-blue-600">
      How Translation Works
    </a></li>
  </ul>
</details>
```

### Active Section Highlighting

Use Intersection Observer to highlight the currently visible section in the sidebar ToC:

```tsx
useEffect(() => {
  const headings = document.querySelectorAll("h2[id], h3[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = document.querySelector(
          `nav a[href="#${entry.target.id}"]`
        );
        if (entry.isIntersecting) {
          document
            .querySelectorAll("nav a.active")
            .forEach((a) => a.classList.remove("active"));
          link?.classList.add("active");
        }
      });
    },
    { rootMargin: "-20% 0px -80% 0px" }
  );
  headings.forEach((h) => observer.observe(h));
  return () => observer.disconnect();
}, []);
```

---

## 11. Images and Visual Rhythm

### Placement Rules

- **One image every 300-400 words** for long-form content
- Place images **directly after** the heading or key point they illustrate (never before)
- Every image needs **descriptive, keyword-optimized alt text**
- Use **WebP** format with `loading="lazy"` for all images below the fold
- Hero image uses `loading="eager"` and should be `<900KB`

### Image Container Pattern

```html
<figure class="my-8 rounded-xl overflow-hidden
               border border-gray-200 dark:border-gray-700">
  <img src="/blog/post-slug/comparison.webp"
       alt="Side-by-side comparison of original Korean HWPX
            document and its English translation showing preserved
            table formatting"
       class="w-full"
       loading="lazy"
       width="1200" height="675" />
  <figcaption class="px-4 py-3 text-sm
                     text-gray-500 dark:text-gray-400
                     bg-gray-50 dark:bg-gray-800/50
                     border-t border-gray-200
                     dark:border-gray-700">
    The original Korean document (left) and its English translation
    (right). Note the preserved table structure and cell alignment.
  </figcaption>
</figure>
```

### Image Types by Purpose

| Type | When to Use | Format |
|------|-------------|--------|
| Screenshots | Product demos, before/after | WebP, full-width |
| Diagrams | Architecture, workflows | SVG preferred |
| Charts | Data, comparisons | SVG or high-res WebP |
| Code screenshots | Syntax-highlighted blocks | Use actual `<code>` blocks instead when possible |
| Photos | Team, office, events | WebP, cropped to 16:9 |

---

## 12. Mobile-First Formatting

Over 60% of blog traffic comes from mobile devices. Google uses mobile-first indexing, meaning your mobile version determines search rankings for all devices.

### Mobile-Specific Rules

| Element | Desktop | Mobile |
|---------|---------|--------|
| Body font size | 18px | 16px minimum |
| Paragraph length | 2-4 sentences | 1-3 sentences |
| Line height | 1.6 | 1.7 (more space between lines) |
| Line length | 50-75 characters | Full width with 16-24px padding |
| H1 size | 48px (`text-5xl`) | 30px (`text-3xl`) |
| H2 size | 30px (`text-3xl`) | 24px (`text-2xl`) |
| Images | Full width | Full width, `aspect-ratio` set to prevent layout shift |
| Tables | Standard | Horizontally scrollable wrapper |
| Code blocks | Standard | Horizontally scrollable, 14px font |
| ToC | Sticky sidebar | Expandable `<details>` at top |
| CTAs | Inline | Full-width buttons, larger tap targets (min 44x44px) |

### Responsive Table Pattern

```html
<div class="my-8 -mx-4 sm:mx-0 overflow-x-auto">
  <div class="inline-block min-w-full align-middle">
    <table class="min-w-full text-sm">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th class="px-4 py-3 text-left font-semibold
                     text-gray-900 dark:text-white">
            Format
          </th>
          <th class="px-4 py-3 text-left font-semibold
                     text-gray-900 dark:text-white">
            Preserves Layout
          </th>
          <th class="px-4 py-3 text-left font-semibold
                     text-gray-900 dark:text-white">
            Supported
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr>
          <td class="px-4 py-3 whitespace-nowrap">HWPX</td>
          <td class="px-4 py-3">Yes</td>
          <td class="px-4 py-3">Yes</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Touch-Friendly CTA Pattern

```html
<a href="/translate"
   class="block w-full sm:w-auto sm:inline-flex
          items-center justify-center
          px-6 py-4 sm:py-3
          rounded-xl sm:rounded-lg
          bg-blue-600 hover:bg-blue-700
          active:bg-blue-800
          text-white font-medium text-center
          transition-colors
          min-h-[44px]">
  Start Translating Free
</a>
```

---

## 13. Dark Mode Considerations

Dark mode is not just "invert the colors." It requires intentional design decisions.

### Key Principles

1. **Never use pure black (`#000`).** Use `gray-900` (`#111827`) or `gray-950` (`#030712`) as the darkest background.
2. **Reduce text contrast slightly.** Body text should be `gray-300` (`#D1D5DB`), not pure white. Pure white on dark backgrounds causes eye strain.
3. **Use lower opacity for backgrounds.** Colored backgrounds (callouts, cards) should use opacity: `bg-blue-950/30` not `bg-blue-900`.
4. **Elevate with lighter shades, not shadows.** In dark mode, shadows are invisible. Use slightly lighter backgrounds to create depth (`gray-800` on `gray-900`).
5. **Borders become critical.** Where light mode can rely on shadows for separation, dark mode needs explicit borders (`border-gray-700`).
6. **Images may need adjustment.** Consider adding a subtle dark overlay or using images with transparent backgrounds.

### Dark Mode Color Reference

```
Background layers:
  Page:    gray-950 (#030712)
  Card:    gray-900 (#111827)
  Raised:  gray-800 (#1F2937)

Text:
  Heading: white
  Body:    gray-300 (#D1D5DB)
  Muted:   gray-400 (#9CA3AF)
  Caption: gray-500 (#6B7280)

Borders:  gray-700 (#374151)
Links:    blue-400 (#60A5FA)
```

---

## 14. Before / After Examples

### Example A: Opening Paragraph

**BEFORE (old-school blog format):**

```
In this blog post, we will be discussing the topic of HWPX file
translation. HWPX files are commonly used in South Korea for
government and academic purposes. They are created using the Hancom
Office suite, which is the dominant office productivity software in
Korea. Many people who need to translate Korean documents encounter
HWPX files and struggle with maintaining the formatting during
translation. In this comprehensive guide, we will cover everything
you need to know about translating HWPX files while keeping the
original formatting intact. We will discuss what HWPX files are,
why formatting matters, and how Xenith solves this problem.
```

**Problems:** Wall of text. Buries the answer. Passive voice. No visual structure. Verbose filler ("In this blog post, we will be discussing...").

**AFTER (2026 format):**

```html
<!-- TL;DR box at top -->
<aside class="tldr-box">
  <strong>TL;DR:</strong> HWPX files are Korea's standard document
  format. Xenith translates them in under 60 seconds while
  preserving every table, header, and footnote.
</aside>

<!-- Clean intro -->
<p>
  <strong>HWPX is the format Korean government agencies use for
  official documents.</strong> If you have ever received a form from
  a Korean university, immigration office, or business partner, it
  was probably an HWPX file.
</p>

<p>
  The problem: translating HWPX to English destroys the formatting.
  Tables collapse. Headers vanish. Footnotes disappear.
</p>

<p>
  Xenith solves this. Upload your HWPX file, choose your target
  language, and get back a translated HWPX with all formatting
  intact.
</p>
```

**Why it works:**
- TL;DR at the top answers the question immediately
- Short paragraphs (1-2 sentences each)
- Bold lead sentence anchors each paragraph
- Active voice throughout
- Problem-solution structure
- No filler phrases

---

### Example B: Feature Description

**BEFORE:**

```
Our platform offers format-preserving translation capabilities for
various document types. The system works by first extracting the
structured content from the uploaded document, then sending the text
for translation while maintaining the structural metadata, and
finally reassembling the translated text back into the original
document format. This process ensures that the translated document
looks exactly like the original, with all tables, headers, footers,
and formatting preserved. Currently, we support HWPX and DOCX file
formats for format-preserving translation.
```

**AFTER:**

```html
<h2>How Format-Preserving Translation Works</h2>

<p>
  Xenith translates your document in three steps:
</p>

<ol class="space-y-4 my-6">
  <li class="flex gap-3">
    <span class="flex-shrink-0 w-8 h-8 rounded-full
                 bg-blue-100 dark:bg-blue-900/40
                 text-blue-700 dark:text-blue-300
                 font-bold flex items-center justify-center
                 text-sm">
      1
    </span>
    <div>
      <strong>Extract</strong> -- The document's structure is
      separated from its text. Tables, headers, footnotes, and
      styles are preserved as metadata.
    </div>
  </li>
  <li class="flex gap-3">
    <span class="flex-shrink-0 w-8 h-8 rounded-full
                 bg-blue-100 dark:bg-blue-900/40
                 text-blue-700 dark:text-blue-300
                 font-bold flex items-center justify-center
                 text-sm">
      2
    </span>
    <div>
      <strong>Translate</strong> -- Only the text content goes
      through the translation engine. Structural metadata stays
      untouched.
    </div>
  </li>
  <li class="flex gap-3">
    <span class="flex-shrink-0 w-8 h-8 rounded-full
                 bg-blue-100 dark:bg-blue-900/40
                 text-blue-700 dark:text-blue-300
                 font-bold flex items-center justify-center
                 text-sm">
      3
    </span>
    <div>
      <strong>Reassemble</strong> -- The translated text is placed
      back into the original structure. You get a perfectly
      formatted document in your target language.
    </div>
  </li>
</ol>

<aside class="callout-tip">
  <strong>Pro Tip:</strong> Upload the original HWPX or DOCX
  source file -- not a PDF export. The original contains structural
  metadata that makes format preservation possible.
</aside>

<table>
  <thead>
    <tr>
      <th>Format</th>
      <th>Preserves Layout</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>HWPX</td><td>Yes</td><td>Fully supported</td></tr>
    <tr><td>DOCX</td><td>Yes</td><td>Fully supported</td></tr>
    <tr><td>PDF</td><td>No</td><td>Text-only translation</td></tr>
  </tbody>
</table>
```

**Why it works:**
- Clear heading signals the topic
- Numbered steps with visual indicators break down the process
- Bold lead words let scanners grasp each step at a glance
- Pro tip callout adds practical value
- Comparison table provides at-a-glance reference
- Every element can be extracted by AI search engines

---

### Example C: FAQ Item

**BEFORE:**

```
Q: What file formats do you support?
A: We support HWPX, DOCX, PDF, and plain text files for
translation. For HWPX and DOCX files, we offer format-preserving
translation which means the translated document will maintain the
same formatting as the original.
```

**AFTER:**

```html
<details class="faq-item">
  <summary>
    <h3>What file formats does Xenith support?</h3>
  </summary>
  <div>
    <p>Xenith supports four file formats:</p>
    <ul>
      <li>
        <strong>HWPX</strong> -- Full format preservation
        (tables, headers, footnotes)
      </li>
      <li>
        <strong>DOCX</strong> -- Full format preservation
      </li>
      <li>
        <strong>PDF</strong> -- Text extraction and translation
        (formatting not preserved)
      </li>
      <li>
        <strong>Plain text</strong> -- Direct translation
      </li>
    </ul>
  </div>
</details>
```

**Why it works:**
- Uses `<details>` for progressive disclosure (reduces visual overwhelm)
- H3 inside `<summary>` is accessible and SEO-friendly
- List format makes scanning instant
- Bold format names anchor each item
- Pairs with FAQPage JSON-LD schema for rich results

---

## Quick Reference Checklist

Use this checklist before publishing any blog post:

- [ ] H1 contains target keyword, phrased as natural-language query
- [ ] Category badge and meta line (author, date, read time) visible
- [ ] Feature image is optimized WebP, < 900KB, with descriptive alt text
- [ ] TL;DR section present after hero, before introduction (3-5 bullets)
- [ ] Table of contents present for posts > 1,000 words
- [ ] H2 every 300-500 words; H3 for subsections; no skipped levels
- [ ] Paragraphs are 2-3 sentences max
- [ ] Body text is 18px with 1.6+ line height and max-width of 65ch
- [ ] Bold used sparingly (2-3 per section, key terms only)
- [ ] One image every 300-400 words with alt text
- [ ] 3+ items in prose converted to bullet/numbered lists
- [ ] Three CTAs placed: after TL;DR, mid-article, end of post
- [ ] FAQ section with 5-8 questions near the bottom
- [ ] FAQPage + BlogPosting JSON-LD schema in page head
- [ ] All callout boxes use consistent type system (note/tip/warning/important/quote)
- [ ] Tested on mobile: paragraphs short, tables scrollable, CTAs full-width
- [ ] Dark mode renders correctly with proper contrast
- [ ] Author bio with linked credentials at the bottom
- [ ] Internal links: roughly 1 per 100-200 words
- [ ] `datePublished` and `dateModified` in schema and visible on page

---

## Sources

This guide was compiled from the following research:

- [What Does an Ideal Blog Post Look Like in 2026? (SEO + AI Guide)](https://rebeccavandenberg.com/what-does-an-ideal-blog-post-look-like-in-2026-seo-ai-guide/)
- [How Does Blog Formatting Improve Content SEO in 2026?](https://www.clickrank.ai/seo-blog-formatting/)
- [SEO Friendly Blog Post Tips - Yoast](https://yoast.com/seo-friendly-blog-post/)
- [The SaaS Blog Design Template We Use To Lift Conversions](https://www.poweredbysearch.com/blog/b2b-saas-blog-design/)
- [10 Best SaaS Blog Design Examples](https://www.webstacks.com/blog/saas-blog-design-examples)
- [Blog Post Structure: Complete Guide for 2026](https://koanthic.com/en/blog-post-structure/)
- [The Perfect Blog Post Structure - Surfer SEO](https://surferseo.com/blog/perfect-blog-post-structure/)
- [The Ultimate Blog Formatting Style Guide - Content Whale](https://content-whale.com/blog/blog-formatting-style-guide/)
- [CTA Placement Strategies That Boost Conversions](https://avintivmedia.com/blog/cta-placement-strategies-that-work/)
- [CTA Best Practices to Increase Conversions](https://www.dashclicks.com/blog/cta-best-practices)
- [25 New Call to Action Statistics in 2026](https://wisernotify.com/blog/call-to-action-stats/)
- [Schema Markup in 2026: Critical for SERP Visibility](https://almcorp.com/blog/schema-markup-detailed-guide-2026-serp-visibility/)
- [FAQ Schema for AI Answers](https://www.getpassionfruit.com/blog/faq-schema-for-ai-answers)
- [FAQ Structured Data - Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [LLM-Optimized Content Structures: Tables, FAQs & Snippets](https://www.averi.ai/how-to/llm%E2%80%91optimized-content-structures-tables-faqs-snippets)
- [Why TL;DR and Key Points Matter in Content Writing Today](https://mayapillaiwrites.com/why-tldr-in-content/)
- [What Is TL;DR in SEO? Importance for AI Search](https://www.docommunication.io/blog/tldr-section-in-seo)
- [Mobile-First Responsive Design Best Practices 2025](https://www.letsgroto.com/blog/mobile-first-responsive-design-best-practices)
- [Mobile Website Design Best Practices for 2025](https://www.webstacks.com/blog/mobile-website-design-best-practices)
- [Dark Mode UI Design: Best Practices - LogRocket](https://blog.logrocket.com/ux-design/dark-mode-ui-design-best-practices-and-examples/)
- [Dark Mode Design Best Practices in 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- [Visual Dividers in User Interfaces - Tubik Studio](https://blog.tubikstudio.com/visual-dividers-user-interface/)
- [CSS Tip: Creating Styled Boxes for Notes, Warnings, Examples](https://www.madcapsoftware.com/blog/css-tip-creating-styled-boxes-notes-warnings-examples-tips/)
- [25 Callout Section Design Examples](https://www.subframe.com/tips/callout-section-design-examples)
- [How Stripe Designs Beautiful Websites](https://ekam.co/blog/how-stripe-designs-beautiful-websites)
- [How Stripe Builds Interactive Docs with Markdoc](https://stripe.com/blog/markdoc)
- [12 Modern Website Design Trends for 2025](https://www.webstacks.com/blog/modern-website-design)
- [Content Readability in SEO: 2026 Insights](https://wellows.com/blog/content-readability-in-seo/)
