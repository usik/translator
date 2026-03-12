"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { languages } from "@/lib/languages";

interface LanguageSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  showAuto?: boolean;
  label?: string;
}

export function LanguageSelector({
  value,
  onValueChange,
  showAuto = false,
  label,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
      )}
      <Select value={value} onValueChange={(val) => { if (val !== null) onValueChange(val); }}>
        <SelectTrigger className="w-full min-w-[160px]" aria-label={label ? `${label} language` : "Select language"}>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {showAuto && (
            <SelectGroup>
              <SelectItem value="auto">
                <span className="flex items-center gap-2">
                  <span>Detect Language</span>
                  <span className="text-xs text-muted-foreground">Auto</span>
                </span>
              </SelectItem>
              <SelectSeparator />
            </SelectGroup>
          )}
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {lang.nativeName}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
