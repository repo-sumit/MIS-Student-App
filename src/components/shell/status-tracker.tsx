"use client";

import { Check } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { STATUS_STEP_ORDER } from "@/services/status";
import type { StatusStep } from "@/domain/types";
import { cn } from "@/components/ui/cn";

const SHORT_LABEL: Record<StatusStep, { en: string; hi: string }> = {
  registered: { en: "Register", hi: "पंजीकरण" },
  profileComplete: { en: "Profile", hi: "प्रोफ़ाइल" },
  submitted: { en: "Apply", hi: "आवेदन" },
  underScrutiny: { en: "Scrutiny", hi: "जाँच" },
  meritPublished: { en: "Merit", hi: "मेधा" },
  allotted: { en: "Allotted", hi: "आवंटन" },
  admissionConfirmed: { en: "Confirmed", hi: "पुष्ट" }
};

export function StatusTracker({ currentStep }: { currentStep: StatusStep }) {
  const { locale } = useLocale();
  const idx = STATUS_STEP_ORDER.indexOf(currentStep);

  return (
    <div className="px-1 py-1">
      <div className="relative">
        <div className="absolute inset-x-3 top-3.5 h-0.5 bg-line" />
        <div
          className="absolute left-3 top-3.5 h-0.5 bg-brand transition-all duration-700"
          style={{ width: `calc(${(idx / (STATUS_STEP_ORDER.length - 1)) * 100}% - 12px)` }}
        />
        <ol className="relative grid grid-cols-7 gap-1">
          {STATUS_STEP_ORDER.map((step, i) => {
            const reached = i <= idx;
            const isCurrent = i === idx;
            const label = SHORT_LABEL[step][locale];
            return (
              <li key={step} className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all",
                    reached ? "bg-brand text-white" : "bg-white border border-line text-ink-subtle",
                    isCurrent && "ring-4 ring-brand/15"
                  )}
                >
                  {i < idx ? <Check size={13} strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-[9.5px] leading-tight font-semibold text-center w-full", reached ? "text-ink" : "text-ink-subtle")}>
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
