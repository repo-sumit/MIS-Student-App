"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Checkbox } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useApplications } from "@/providers/applications-provider";
import { useAllocation } from "@/providers/allocation-provider";
import { useToast } from "@/providers/toast-provider";
import { useMeta } from "@/providers/meta-provider";

export default function RegisterPage() {
  const { t } = useLocale();
  const { resetWithSeed } = useProfile();
  const { reset: resetApps } = useApplications();
  const { reset: resetAllot } = useAllocation();
  const { markRegistered, reset: resetMeta } = useMeta();
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

    resetApps();
    resetAllot();
    resetMeta();
    resetWithSeed({ email, mobile });
    markRegistered();

    toast.success("Account created", "Welcome to HPU Admission");
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 220);
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <HpuLogo size={28} />
            <span className="text-[13px] font-bold text-ink">{t("app.name")}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="app-container py-6 lg:py-12">
        <div className="form-container">
          <div className="mb-5">
            <h1 className="text-[24px] lg:text-[28px] font-bold text-ink">{t("register.title")}</h1>
            <p className="text-[13.5px] text-ink-muted leading-snug mt-1">{t("register.subtitle")}</p>
          </div>

          <Card padded>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Field label={t("register.email")} error={errors.email}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" invalid={!!errors.email} />
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
                  <Input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" autoComplete="new-password" invalid={!!errors.password} />
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
                <Input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" invalid={!!errors.confirm} />
              </Field>

              <div className="pt-1">
                <Checkbox checked={agree} onChange={setAgree} label={t("register.consent")} />
                {errors.agree && <p className="mt-1 text-[12px] font-medium text-danger-ink">{errors.agree}</p>}
              </div>

              <Button block size="lg" type="submit" loading={submitting}>{t("register.submit")}</Button>
            </form>
          </Card>

          <div className="mt-5 text-center text-[13px] text-ink-muted">
            <Link href="/login" className="font-semibold text-brand hover:underline">{t("register.loginInstead")}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
