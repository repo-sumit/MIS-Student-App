"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { Stepper } from "@/components/ui/stepper";
import { useLocale } from "@/providers/locale-provider";
import { cn } from "@/components/ui/cn";

const APPLY_STEPS: { key: number; labelKey: string }[] = [
  { key: 1, labelKey: "apply.preferencesTitle" },
  { key: 2, labelKey: "apply.rankTitle" },
  { key: 3, labelKey: "apply.reviewTitle" },
  { key: 4, labelKey: "apply.declarationTitle" },
  { key: 5, labelKey: "apply.submitTitle" }
];

export function ApplyShell({
  step,
  total = 5,
  title,
  subtitle,
  children,
  footer
}: {
  step: number;
  total?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <div className="min-h-[100dvh] bg-surface-app/40">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <button onClick={() => router.back()} className="inline-flex h-10 items-center gap-1 rounded-pill px-2 text-[13px] font-semibold text-ink-muted hover:text-ink hover:bg-line-subtle">
            <ChevronLeft size={18} /> {t("common.back")}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <HpuLogo size={26} />
            <span className="hidden md:inline text-[13.5px] font-bold text-ink">{t("apply.hubTitle")}</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="app-container py-3 lg:hidden">
          <Stepper current={step} total={total} />
        </div>
      </header>

      <main className="app-container py-5 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card bg-white ring-1 ring-line shadow-card p-4">
              <div className="text-eyebrow">{t("apply.hubTitle")}</div>
              <div className="mt-1 text-[14px] font-bold text-ink">{t("common.step")} {step} {t("common.of")} {total}</div>
              <ol className="mt-4 space-y-2">
                {APPLY_STEPS.map((s) => {
                  const reached = s.key < step;
                  const active = s.key === step;
                  return (
                    <li key={s.key} className={cn("flex items-center gap-2 text-[13px] font-semibold", active ? "text-brand" : reached ? "text-ink" : "text-ink-subtle")}>
                      <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", active ? "border-brand bg-brand text-white" : reached ? "border-success bg-success text-white" : "border-line bg-white text-ink-subtle")}>
                        {reached ? <Check size={12} strokeWidth={3} /> : s.key}
                      </span>
                      {t(s.labelKey)}
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            <div className="form-container">
              <h1 className="text-[22px] lg:text-[26px] font-bold text-ink">{title}</h1>
              {subtitle && <p className="text-[13.5px] text-ink-muted mt-1">{subtitle}</p>}
              <div className="mt-5 space-y-3">{children}</div>
              {footer && <div className="mt-6">{footer}</div>}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
