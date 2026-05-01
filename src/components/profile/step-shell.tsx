"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useMeta } from "@/providers/meta-provider";
import { useToast } from "@/providers/toast-provider";
import { hasEnoughProfile } from "@/services/status";
import { cn } from "@/components/ui/cn";

const STEP_LABELS: { key: number; labelKey: string }[] = [
  { key: 1, labelKey: "profile.step1" },
  { key: 2, labelKey: "profile.step2" },
  { key: 3, labelKey: "profile.step3" },
  { key: 4, labelKey: "profile.step4" },
  { key: 5, labelKey: "profile.step5" }
];

export function ProfileStepShell({
  stepNumber,
  title,
  subtitle,
  isValid,
  onSave,
  children
}: {
  stepNumber: number;
  title: string;
  subtitle: string;
  isValid: boolean;
  onSave: () => boolean | void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const { profile, markStep } = useProfile();
  const { markProfileCompleted } = useMeta();
  const toast = useToast();

  function next() {
    const ok = onSave();
    if (ok === false) {
      toast.warn(t("profile.errorRequired"));
      return;
    }
    markStep(stepNumber);
    if (stepNumber === 5) {
      if (hasEnoughProfile(profile)) markProfileCompleted();
      toast.success(t("profile.completeToast"));
      router.push("/dashboard");
    } else {
      // The hasEnoughProfile check considers step 4 as the threshold; mark profile completed when reached.
      if (stepNumber === 4 && hasEnoughProfile({ ...profile, completedSteps: Array.from(new Set([...profile.completedSteps, stepNumber])) })) {
        markProfileCompleted();
      }
      toast.success(t("profile.savedToast"));
      router.push(`/profile/step/${stepNumber + 1}`);
    }
  }

  function back() {
    if (stepNumber === 1) router.push("/dashboard");
    else router.push(`/profile/step/${stepNumber - 1}`);
  }

  return (
    <div className="min-h-[100dvh] bg-surface-app/40">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <button onClick={back} className="inline-flex h-10 items-center gap-1 rounded-pill px-2 text-[13px] font-semibold text-ink-muted hover:text-ink hover:bg-line-subtle">
            <ChevronLeft size={18} /> {t("common.back")}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <HpuLogo size={26} />
            <span className="hidden md:inline text-[13.5px] font-bold text-ink">{t("profile.title")}</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="app-container py-3 lg:hidden">
          <Stepper current={stepNumber} total={5} />
        </div>
      </header>

      <main className="app-container py-5 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar progress on desktop */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-card bg-white ring-1 ring-line shadow-card p-4">
              <div className="text-eyebrow">{t("profile.title")}</div>
              <div className="mt-1 text-[14px] font-bold text-ink">{t("profile.stepLabel", { n: stepNumber })}</div>
              <ol className="mt-4 space-y-2">
                {STEP_LABELS.map((s) => {
                  const reached = s.key < stepNumber || profile.completedSteps.includes(s.key);
                  const active = s.key === stepNumber;
                  return (
                    <li key={s.key} className={cn("flex items-center gap-2 text-[13px] font-semibold", active ? "text-brand" : reached ? "text-ink" : "text-ink-subtle")}>
                      <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border", active ? "border-brand bg-brand text-white" : reached ? "border-success bg-success text-white" : "border-line bg-white text-ink-subtle")}>
                        {reached && !active ? <Check size={12} strokeWidth={3} /> : s.key}
                      </span>
                      <span className="truncate">{t(s.labelKey)}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </aside>

          <section className="lg:col-span-8 xl:col-span-9">
            <div className="form-container">
              <h1 className="text-[22px] lg:text-[26px] font-bold text-ink">{title}</h1>
              <p className="text-[13.5px] text-ink-muted mt-1">{subtitle}</p>
              <div className="mt-5 space-y-4">{children}</div>

              <div className="mt-6 flex items-center gap-2">
                <Button variant="secondary" onClick={back}>{t("common.back")}</Button>
                <Button block onClick={next} disabled={!isValid}>
                  {stepNumber === 5 ? t("common.done") : t("common.continue")}
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
