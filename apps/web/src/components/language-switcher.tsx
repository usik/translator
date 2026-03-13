"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  ko: "KO",
  ja: "JA",
};

const localeNames: Record<Locale, string> = {
  en: "English",
  ko: "\ud55c\uad6d\uc5b4",
  ja: "\u65e5\u672c\u8a9e",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSwitcher");

  const handleLocaleChange = (newLocale: Locale | null) => {
    if (newLocale) {
      router.replace(pathname, { locale: newLocale });
    }
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger
        size="sm"
        className="gap-1.5 border-none bg-transparent px-2 shadow-none hover:bg-accent"
        aria-label={t("label")}
      >
        <Globe className="size-4" />
        <SelectValue placeholder={localeLabels[locale]} />
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false}>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            <span className="font-medium">{localeLabels[loc]}</span>
            <span className="text-muted-foreground">{localeNames[loc]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
