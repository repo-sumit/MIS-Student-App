"use client";

import Link from "next/link";
import { ChevronLeft, UserCircle, Compass, ClipboardCheck, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";

export default function HowItWorks() {
  const { t } = useLocale();
  const steps = [
    { Icon: UserCircle, title: t("howItWorks.step1Title"), body: t("howItWorks.step1Body") },
    { Icon: Compass, title: t("howItWorks.step2Title"), body: t("howItWorks.step2Body") },
    { Icon: ClipboardCheck, title: t("howItWorks.step3Title"), body: t("howItWorks.step3Body") },
    { Icon: Award, title: t("howItWorks.step4Title"), body: t("howItWorks.step4Body") }
  ];
  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="inline-flex h-10 items-center gap-1 rounded-pill px-2 text-[13px] font-semibold text-ink-muted hover:text-ink hover:bg-line-subtle">
            <ChevronLeft size={18} /> Home
          </Link>
          <div className="flex items-center gap-2">
            <HpuLogo size={26} />
            <span className="text-[13px] font-bold text-ink hidden sm:inline">{t("howItWorks.title")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="app-container py-6 lg:py-12">
        <div className="content-narrow">
          <h1 className="text-[24px] lg:text-[28px] font-bold text-ink">{t("howItWorks.title")}</h1>
          <p className="text-[13.5px] text-ink-muted mt-1 mb-5">{t("howItWorks.subtitle")}</p>

          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i}>
                <Card padded>
                  <div className="flex gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50 text-brand">
                        <s.Icon size={18} />
                      </div>
                      <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white text-[10px] font-bold">{i + 1}</div>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-ink">{s.title}</div>
                      <p className="text-[13px] text-ink-muted leading-snug mt-0.5">{s.body}</p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>

          <Link href="/register" className="block mt-6">
            <Button block size="lg">{t("landing.primaryCta")}</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
