"use client";

import { useLocale } from "@/providers/locale-provider";
import { SegmentedControl } from "@/components/ui/segmented";

export function LanguageSwitcher({ size = "sm" }: { size?: "sm" | "md" }) {
  const { locale, setLocale } = useLocale();
  return (
    <SegmentedControl
      size={size}
      value={locale}
      onChange={(v) => setLocale(v)}
      options={[
        { value: "en", label: "EN" },
        { value: "hi", label: "हिं" }
      ]}
    />
  );
}
