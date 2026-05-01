"use client";

import { cn } from "./cn";
import { useLocale } from "@/providers/locale-provider";

export function Stepper({
  current,
  total,
  className
}: {
  current: number;
  total: number;
  className?: string;
}) {
  const { t } = useLocale();
  const pct = Math.min(100, Math.round(((current - 1) / Math.max(1, total - 1)) * 100));
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{t("common.step")} {current}/{total}</span>
        <span className="text-[11px] text-ink-subtle">{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line-subtle overflow-hidden">
        <div
          className="h-full bg-brand transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
