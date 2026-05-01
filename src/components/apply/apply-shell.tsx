"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { Stepper } from "@/components/ui/stepper";

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
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-surface-app">
      <header className="sticky top-0 z-30 bg-white border-b border-line-subtle">
        <div className="flex items-center justify-between px-3 pt-3">
          <button onClick={() => router.back()} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-line-subtle">
            <ChevronLeft size={20} />
          </button>
          <div className="text-[12px] font-semibold text-ink-muted">Application</div>
          <LanguageSwitcher />
        </div>
        <div className="px-4 pb-3 pt-1">
          <Stepper current={step} total={total} />
        </div>
      </header>
      <main className="flex-1 px-4 pt-4 pb-32">
        <h1 className="text-[20px] font-bold text-ink">{title}</h1>
        {subtitle && <p className="text-[13px] text-ink-muted mt-0.5">{subtitle}</p>}
        <div className="mt-4 space-y-3">{children}</div>
      </main>
      {footer && (
        <footer className="sticky bottom-0 bg-white border-t border-line-subtle px-4 py-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          {footer}
        </footer>
      )}
    </div>
  );
}
