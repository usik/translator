"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          {t("tagline")}
        </p>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link
            href="/translate"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("translate")}
          </Link>
          <Link
            href="/convert"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("fileConverter")}
          </Link>
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("privacy")}
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("terms")}
          </Link>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfuPdbfsz69XeauhvQN_rsYUVNzj9RIcE5ryBDiCohphJ0a5w/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("feedback")}
          </a>
        </nav>
      </div>
    </footer>
  );
}
