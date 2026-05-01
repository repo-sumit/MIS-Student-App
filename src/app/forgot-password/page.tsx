"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <Link href="/login" className="text-[13px] font-semibold text-ink-muted hover:text-ink">{t("common.back")}</Link>
        <LanguageSwitcher />
      </header>
      <main className="px-5 pt-2 pb-8">
        {!done ? (
          <>
            <h1 className="text-[22px] font-bold text-ink">{t("forgot.title")}</h1>
            <p className="text-[13px] text-ink-muted leading-snug mt-1 mb-5">{t("forgot.subtitle")}</p>
            <Card padded>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                className="space-y-4"
              >
                <Field label={t("forgot.input")}>
                  <Input value={value} onChange={(e) => setValue(e.target.value)} required />
                </Field>
                <Button type="submit" block size="lg">{t("forgot.submit")}</Button>
              </form>
            </Card>
          </>
        ) : (
          <Card padded>
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-subtle text-success">
                <CheckCircle2 size={22} />
              </div>
              <h2 className="mt-3 text-[17px] font-bold text-ink">{t("forgot.successTitle")}</h2>
              <p className="mt-1 text-[13px] text-ink-muted leading-relaxed max-w-[300px]">{t("forgot.successBody")}</p>
              <Link href="/login" className="mt-4">
                <Button variant="primary">{t("login.title")}</Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
