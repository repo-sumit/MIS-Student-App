"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ProfileStepShell } from "@/components/profile/step-shell";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { DISTRICTS } from "@/domain/fixtures";

export default function Step2() {
  const { t } = useLocale();
  const { profile, update } = useProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const valid = !!profile.address && !!profile.district && /^\d{6}$/.test(profile.pincode);

  function save() {
    const e: Record<string, string> = {};
    if (!profile.address) e.address = t("common.required");
    if (!profile.district) e.district = t("common.required");
    if (!/^\d{6}$/.test(profile.pincode)) e.pincode = t("common.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <ProfileStepShell
      stepNumber={2}
      title={t("profile.step2")}
      subtitle={t("profile.step2Sub")}
      isValid={valid}
      onSave={save}
    >
      <Card padded className="space-y-3">
        <Field label={t("profile.address")} error={errors.address}>
          <Textarea
            rows={3}
            value={profile.address}
            onChange={(e) => update({ address: e.target.value })}
            placeholder="House / village / town"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.district")} error={errors.district}>
            <Select value={profile.district} onChange={(e) => update({ district: e.target.value as any })}>
              <option value="">{t("common.required")}</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label={t("profile.pincode")} error={errors.pincode}>
            <Input
              inputMode="numeric"
              value={profile.pincode}
              onChange={(e) => update({ pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
            />
          </Field>
        </div>
        <Field label={t("profile.state")}>
          <Input value={profile.state} onChange={(e) => update({ state: e.target.value })} />
        </Field>
      </Card>
    </ProfileStepShell>
  );
}
