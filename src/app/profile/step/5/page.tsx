"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { ProfileStepShell } from "@/components/profile/step-shell";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";

export default function Step5() {
  const { t } = useLocale();
  const { profile, update } = useProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const valid =
    !!profile.bankHolder &&
    /^\d{6,18}$/.test(profile.bankAccount) &&
    /^[A-Z]{4}0[A-Z0-9]{6}$/.test(profile.ifsc) &&
    !!profile.bankName;

  function save() {
    const e: Record<string, string> = {};
    if (!profile.bankHolder) e.bankHolder = t("common.required");
    if (!/^\d{6,18}$/.test(profile.bankAccount)) e.bankAccount = "6–18 digits";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(profile.ifsc)) e.ifsc = "Format: ABCD0123456";
    if (!profile.bankName) e.bankName = t("common.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <ProfileStepShell
      stepNumber={5}
      title={t("profile.step5")}
      subtitle={t("profile.step5Sub")}
      isValid={valid}
      onSave={save}
    >
      <Card padded className="space-y-3">
        <Field label={t("profile.bankHolder")} error={errors.bankHolder}>
          <Input value={profile.bankHolder} onChange={(e) => update({ bankHolder: e.target.value })} />
        </Field>
        <Field label={t("profile.bankAccount")} error={errors.bankAccount}>
          <Input
            inputMode="numeric"
            value={profile.bankAccount}
            onChange={(e) => update({ bankAccount: e.target.value.replace(/\D/g, "").slice(0, 18) })}
          />
        </Field>
        <Field label={t("profile.ifsc")} error={errors.ifsc} hint="11 chars, e.g. PUNB0123456">
          <Input
            value={profile.ifsc}
            onChange={(e) => update({ ifsc: e.target.value.toUpperCase().slice(0, 11) })}
          />
        </Field>
        <Field label={t("profile.bankName")} error={errors.bankName}>
          <Input value={profile.bankName} onChange={(e) => update({ bankName: e.target.value })} />
        </Field>
      </Card>
    </ProfileStepShell>
  );
}
