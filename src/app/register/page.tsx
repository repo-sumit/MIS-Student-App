"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Checkbox } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useApplications } from "@/providers/applications-provider";
import { useDemoProgress } from "@/providers/demo-progress-provider";
import { useAllotmentBridge, useScrutinyBridge } from "@/providers/bridge-providers";
import { useToast } from "@/providers/toast-provider";

export default function RegisterPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { resetWithSeed } = useProfile();
  const { reset: resetApps } = useApplications();
  const { reset: resetDemo } = useDemoProgress();
  const allotment = useAllotmentBridge();
  const scrutiny = useScrutinyBridge();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t("register.errorEmail");
    if (!/^[6-9]\d{9}$/.test(mobile)) e.mobile = t("register.errorMobile");
    if (password.length < 6) e.password = t("register.errorPassword");
    if (password !== confirm) e.confirm = t("register.errorMatch");
    if (!agree) e.agree = t("register.errorConsent");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // Reset prior state
    resetApps();
    resetDemo();
    Object.keys(allotment.allocations).forEach((k) => allotment.setAllocation(k, undefined));
    Object.keys(allotment.merit).forEach((k) => allotment.publishMerit(k, false));
    Object.keys(scrutiny.scrutiny).forEach((k) => scrutiny.setUnderScrutiny(k, false));

    resetWithSeed({ email, mobile });
    toast.success("Account created", "Welcome to HPU Admission");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 220);
  }

  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <Link href="/" className="text-[13px] font-semibold text-ink-muted hover:text-ink">{t("common.back")}</Link>
        <LanguageSwitcher />
      </header>
      <main className="px-5 pt-2 pb-8">
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-ink">{t("register.title")}</h1>
          <p className="text-[13px] text-ink-muted leading-snug mt-1">{t("register.subtitle")}</p>
        </div>

        <Card padded className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Field label={t("register.email")} error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                invalid={!!errors.email}
              />
            </Field>
            <Field label={t("register.mobile")} hint={t("register.mobileHint")} error={errors.mobile}>
              <Input
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="98XXXXXXXX"
                autoComplete="tel"
                invalid={!!errors.mobile}
              />
            </Field>
            <Field label={t("register.password")} hint={!errors.password ? t("register.passwordHint") : undefined} error={errors.password}>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoComplete="new-password"
                  invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-line-subtle"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Field label={t("register.confirmPassword")} error={errors.confirm}>
              <Input
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                invalid={!!errors.confirm}
              />
            </Field>

            <div className="pt-1">
              <Checkbox checked={agree} onChange={setAgree} label={t("register.consent")} />
              {errors.agree && <p className="mt-1 text-[12px] font-medium text-danger-ink">{errors.agree}</p>}
            </div>

            <Button block size="lg" type="submit" loading={submitting}>
              {t("register.submit")}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center text-[13px] text-ink-muted">
          <Link href="/login" className="font-semibold text-brand hover:underline">{t("register.loginInstead")}</Link>
        </div>
      </main>
    </div>
  );
}
