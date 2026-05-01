"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";
import { useToast } from "@/providers/toast-provider";
import { useProfile } from "@/providers/profile-provider";

export default function LoginPage() {
  const { t } = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { profile, resetWithSeed } = useProfile();
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
    toast.success("Signed in");
    setTimeout(() => router.push("/dashboard"), 220);
  }

  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <Link href="/" className="text-[13px] font-semibold text-ink-muted hover:text-ink">{t("common.back")}</Link>
        <LanguageSwitcher />
      </header>
      <main className="px-5 pt-2 pb-8">
        <div className="mb-5">
          <h1 className="text-[22px] font-bold text-ink">{t("login.title")}</h1>
          <p className="text-[13px] text-ink-muted leading-snug mt-1">{t("login.subtitle")}</p>
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

        <p className="mt-3 text-center text-[12px] text-ink-subtle">{t("login.demoNote")}</p>
        <div className="mt-6 text-center text-[13px] text-ink-muted">
          <Link href="/register" className="font-semibold text-brand hover:underline">{t("login.registerInstead")}</Link>
        </div>
      </main>
    </div>
  );
}
