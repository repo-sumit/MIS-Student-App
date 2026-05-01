"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/providers/locale-provider";
import type { NextAction } from "@/services/lifecycle";

const TONE_BG: Record<NextAction["tone"], string> = {
  brand: "from-brand-500 to-brand-700",
  success: "from-success to-[#02953C]",
  warning: "from-[#F8B200] to-[#D69300]",
  info: "from-[#4F86FF] to-[#345CCC]"
};

export function NextActionCard({ action }: { action: NextAction }) {
  const { t } = useLocale();
  return (
    <div className={"relative overflow-hidden rounded-hero p-5 sm:p-6 text-white shadow-card bg-gradient-to-br " + TONE_BG[action.tone]}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-white/10" />
      <div className="relative">
        <div className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-white/80">{t("dashboard.nextStep")}</div>
        <h2 className="mt-1 text-[20px] sm:text-[22px] font-bold leading-snug">{t(action.titleKey)}</h2>
        <p className="mt-1 text-[13.5px] text-white/85 leading-relaxed">{t(action.bodyKey)}</p>
        <div className="mt-4">
          <Link href={action.href}>
            <Button size="lg" className="!bg-white !text-ink hover:!bg-white/90" trailingIcon={<ArrowRight size={16} />}>
              {t(action.ctaKey)}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ApplicationSummaryCard({
  appNumber,
  courseTitle,
  collegeName,
  step
}: {
  appNumber?: string;
  courseTitle?: string;
  collegeName?: string;
  step: string;
}) {
  const { t } = useLocale();
  return (
    <Card padded>
      <div className="text-eyebrow">{t("dashboard.activeApplication")}</div>
      {appNumber ? (
        <>
          <div className="mt-1.5 text-[14px] font-bold text-ink truncate">{courseTitle || "—"}</div>
          <div className="text-[12px] text-ink-muted truncate">{collegeName || "—"}</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-card bg-line-subtle/60 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{t("applications.appNumber")}</div>
              <div className="text-[12.5px] font-bold text-ink truncate">{appNumber}</div>
            </div>
            <div className="rounded-card bg-line-subtle/60 px-3 py-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{t("dashboard.stageLabel")}</div>
              <div className="text-[12.5px] font-bold text-ink">{step}</div>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-1 text-[13px] text-ink-muted">{t("dashboard.noActiveApplication")}</p>
      )}
    </Card>
  );
}
