"use client";

import Link from "next/link";
import { ChevronLeft, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";

type DateItem = { label: string; date: string };

export default function DatesPage() {
  const { t, tList } = useLocale();
  const items = tList("dates.items") as DateItem[];
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-3 pt-3 pb-2">
        <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-line-subtle">
          <ChevronLeft size={20} />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="px-5 pt-2 pb-10">
        <h1 className="text-[22px] font-bold text-ink">{t("dates.title")}</h1>
        <p className="text-[13px] text-ink-muted mt-1 mb-5">{t("dates.subtitle")}</p>
        <div className="space-y-2.5">
          {items.map((it, i) => (
            <Card key={i} padded>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-brand-50 text-brand">
                  <CalendarDays size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-[13.5px] font-semibold text-ink">{it.label}</div>
                </div>
                <div className="text-[12.5px] font-bold text-ink shrink-0">{it.date}</div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
