"use client";

import Link from "next/link";
import { ChevronLeft, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";

type DateItem = { label: string; date: string };

export default function DatesPage() {
  const { t, tList } = useLocale();
  const items = tList("dates.items") as DateItem[];
  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="inline-flex h-10 items-center gap-1 rounded-pill px-2 text-[13px] font-semibold text-ink-muted hover:text-ink hover:bg-line-subtle">
            <ChevronLeft size={18} /> Home
          </Link>
          <div className="flex items-center gap-2">
            <HpuLogo size={26} />
            <span className="text-[13px] font-bold text-ink hidden sm:inline">{t("dates.title")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="app-container py-6 lg:py-12">
        <div className="content-narrow">
          <h1 className="text-[24px] lg:text-[28px] font-bold text-ink">{t("dates.title")}</h1>
          <p className="text-[13.5px] text-ink-muted mt-1 mb-5">{t("dates.subtitle")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {items.map((it, i) => (
              <Card key={i} padded>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-brand-50 text-brand">
                    <CalendarDays size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13.5px] font-semibold text-ink">{it.label}</div>
                    <div className="text-[12.5px] font-bold text-brand mt-0.5">{it.date}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
