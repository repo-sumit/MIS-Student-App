"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { ProfileStepShell } from "@/components/profile/step-shell";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";

export default function Step1() {
  const { t } = useLocale();
  const { profile, update } = useProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const valid = !!profile.fullName && !!profile.dob && /^[6-9]\d{9}$/.test(profile.mobile) && /^\S+@\S+\.\S+$/.test(profile.email);

  function save() {
    const e: Record<string, string> = {};
    if (!profile.fullName) e.fullName = t("common.required");
    if (!profile.fatherName) e.fatherName = t("common.required");
    if (!profile.motherName) e.motherName = t("common.required");
    if (!profile.dob) e.dob = t("common.required");
    if (!/^[6-9]\d{9}$/.test(profile.mobile)) e.mobile = t("register.errorMobile");
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) e.email = t("register.errorEmail");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <ProfileStepShell
      stepNumber={1}
      title={t("profile.step1")}
      subtitle={t("profile.step1Sub")}
      isValid={valid}
      onSave={save}
    >
      <Card padded className="space-y-3">
        <Field label={t("profile.fullName")} error={errors.fullName}>
          <Input value={profile.fullName} onChange={(e) => update({ fullName: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.fatherName")} error={errors.fatherName}>
            <Input value={profile.fatherName} onChange={(e) => update({ fatherName: e.target.value })} />
          </Field>
          <Field label={t("profile.motherName")} error={errors.motherName}>
            <Input value={profile.motherName} onChange={(e) => update({ motherName: e.target.value })} />
          </Field>
        </div>
        <Field label={t("profile.guardianName")} optional>
          <Input value={profile.guardianName || ""} onChange={(e) => update({ guardianName: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.dob")} error={errors.dob}>
            <Input type="date" value={profile.dob} onChange={(e) => update({ dob: e.target.value })} />
          </Field>
          <Field label={t("profile.gender")}>
            <Select value={profile.gender || ""} onChange={(e) => update({ gender: e.target.value as any })}>
              <option value="">{t("common.optional")}</option>
              <option value="male">{t("profile.male")}</option>
              <option value="female">{t("profile.female")}</option>
              <option value="other">{t("profile.other")}</option>
            </Select>
          </Field>
        </div>
        <Field label={t("profile.mobile")} error={errors.mobile}>
          <Input
            type="tel"
            inputMode="numeric"
            value={profile.mobile}
            onChange={(e) => update({ mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          />
        </Field>
        <Field label={t("profile.email")} error={errors.email}>
          <Input type="email" value={profile.email} onChange={(e) => update({ email: e.target.value })} />
        </Field>
        <Field label={t("profile.aadhaar")} optional hint="We mask everything except the last four digits.">
          <Input
            inputMode="numeric"
            placeholder="XXXX-XXXX-1234"
            value={profile.aadhaarMasked || ""}
            onChange={(e) => update({ aadhaarMasked: e.target.value.slice(0, 14) })}
          />
        </Field>
      </Card>
    </ProfileStepShell>
  );
}
