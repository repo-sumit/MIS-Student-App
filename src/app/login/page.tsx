"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";
import { useToast } from "@/providers/toast-provider";
import { useProfile } from "@/providers/profile-provider";
import { useMeta } from "@/providers/meta-provider";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { profile, resetWithSeed } = useProfile();
  const { meta, markRegistered } = useMeta();
  const [email, setEmail] = useState(profile.email || "");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e: typeof errors = {};
    if (!email.trim()) e.email = t("register.errorEmail");
    if (!password.trim()) e.password = t("register.errorPassword");
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setBusy(true);
    if (!profile.email) resetWithSeed({ email });
    if (!meta.registeredAt) markRegistered();
    toast.success("Signed in");
    setTimeout(() => router.push("/dashboard"), 220);
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
            <h1 className="text-[24px] lg:text-[28px] font-bold text-ink">{t("login.title")}</h1>
            <p className="text-[13.5px] text-ink-muted leading-snug mt-1">{t("login.subtitle")}</p>
          </div>

          <Card padded>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <Field label={t("login.email")} error={errors.email}>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" />
              </Field>
              <Field label={t("login.password")} error={errors.password}>
                <div className="relative">
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} autoComplete="current-password" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-line-subtle">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-[12.5px] font-semibold text-brand hover:underline">{t("login.forgot")}</Link>
              </div>
              <Button type="submit" block size="lg" loading={busy}>{t("login.submit")}</Button>
            </form>
          </Card>

          <div className="mt-5 text-center text-[13px] text-ink-muted">
            <Link href="/register" className="font-semibold text-brand hover:underline">{t("login.registerInstead")}</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
