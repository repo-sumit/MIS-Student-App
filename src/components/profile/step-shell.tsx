"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useToast } from "@/providers/toast-provider";

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
  const { markStep } = useProfile();
  const toast = useToast();

  function next() {
    const ok = onSave();
    if (ok === false) {
      toast.warn(t("profile.errorRequired"));
      return;
    }
    markStep(stepNumber);
    if (stepNumber === 5) {
      toast.success(t("profile.completeToast"));
      router.push("/dashboard");
    } else {
      toast.success(t("profile.savedToast"));
      router.push(`/profile/step/${stepNumber + 1}`);
    }
  }

  function back() {
    if (stepNumber === 1) router.push("/dashboard");
    else router.push(`/profile/step/${stepNumber - 1}`);
  }

  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-surface-app">
      <header className="sticky top-0 z-30 bg-white border-b border-line-subtle">
        <div className="flex items-center justify-between px-3 pt-3">
          <button onClick={back} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-line-subtle">
            <ChevronLeft size={20} />
          </button>
          <div className="text-[12px] font-semibold text-ink-muted">{t("profile.stepLabel", { n: stepNumber })}</div>
          <LanguageSwitcher />
        </div>
        <div className="px-4 pb-3 pt-1">
          <Stepper current={stepNumber} total={5} />
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28">
        <h1 className="text-[20px] font-bold text-ink">{title}</h1>
        <p className="text-[13px] text-ink-muted mt-0.5">{subtitle}</p>
        <div className="mt-4 space-y-4">{children}</div>
      </main>

      <footer className="sticky bottom-0 bg-white border-t border-line-subtle px-4 py-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={back}>{t("common.back")}</Button>
          <Button block onClick={next} disabled={!isValid}>
            {stepNumber === 5 ? t("common.done") : t("common.continue")}
          </Button>
        </div>
      </footer>
    </div>
  );
}
