import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Xenith &mdash; Your files are automatically deleted after processing.
        </p>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link
            href="/translate"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Translate
          </Link>
          <Link
            href="/convert"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Convert
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
