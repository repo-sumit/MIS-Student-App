"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";
import type { Locale } from "@/domain/types";

const LANGUAGES: { value: Locale; native: string; latin: string }[] = [
  { value: "en", native: "English", latin: "English" },
  { value: "hi", native: "हिन्दी", latin: "Hindi" }
];

export default function LanguagePage() {
  const { locale, setLocale, t } = useLocale();
  const router = useRouter();
  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <HpuLogo size={26} />
            <span className="text-[13px] font-bold text-ink">{t("app.name")}</span>
          </Link>
        </div>
      </header>
      <main className="app-container py-6 lg:py-12">
        <div className="form-container">
          <h1 className="text-[24px] lg:text-[28px] font-bold text-ink">{t("language.title")}</h1>
          <p className="text-[13.5px] text-ink-muted mt-1 mb-5">{t("language.subtitle")}</p>

          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const selected = lang.value === locale;
              return (
                <button
                  key={lang.value}
                  onClick={() => setLocale(lang.value)}
                  className={
                    "flex w-full items-center justify-between rounded-card px-4 py-3 transition-colors border-[1.5px] " +
                    (selected ? "bg-[#ECFFE5] border-success" : "bg-white border-brand-400")
                  }
                >
                  <div className="text-left">
                    <div className={"text-[16px] font-semibold " + (lang.value === "hi" ? "font-devanagari" : "")}>
                      {lang.native}
                    </div>
                    <div className="text-[12px] text-ink-muted mt-0.5">{lang.latin}</div>
                  </div>
                  {selected && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            <Button block size="lg" onClick={() => router.push("/")}>{t("language.continue")}</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
