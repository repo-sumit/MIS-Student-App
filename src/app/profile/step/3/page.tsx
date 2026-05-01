"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { ProfileStepShell } from "@/components/profile/step-shell";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";

export default function Step3() {
  const { t } = useLocale();
  const { profile, update } = useProfile();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bof = parseFloat(profile.bestOfFive || "0");
  const valid =
    !!profile.board &&
    !!profile.passingYear &&
    !!profile.rollNumber &&
    !!profile.stream &&
    bof > 0 &&
    bof <= 100 &&
    !!profile.resultStatus;

  function save() {
    const e: Record<string, string> = {};
    if (!profile.board) e.board = t("common.required");
    if (!profile.passingYear) e.passingYear = t("common.required");
    if (!profile.rollNumber) e.rollNumber = t("common.required");
    if (!profile.stream) e.stream = t("common.required");
    if (!profile.bestOfFive || bof <= 0 || bof > 100) e.bestOfFive = "Enter 1-100";
    if (!profile.resultStatus) e.resultStatus = t("common.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <ProfileStepShell
      stepNumber={3}
      title={t("profile.step3")}
      subtitle={t("profile.step3Sub")}
      isValid={valid}
      onSave={save}
    >
      <Card padded className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.board")} error={errors.board}>
            <Select value={profile.board} onChange={(e) => update({ board: e.target.value })}>
              <option value="">{t("common.required")}</option>
              <option value="HPBOSE">HPBOSE</option>
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE / CISCE</option>
              <option value="OTHER">Other state board</option>
            </Select>
          </Field>
          <Field label={t("profile.passingYear")} error={errors.passingYear}>
            <Input
              inputMode="numeric"
              value={profile.passingYear}
              onChange={(e) => update({ passingYear: e.target.value.replace(/\D/g, "").slice(0, 4) })}
              placeholder="2026"
            />
          </Field>
        </div>
        <Field label={t("profile.rollNumber")} error={errors.rollNumber}>
          <Input value={profile.rollNumber} onChange={(e) => update({ rollNumber: e.target.value })} />
        </Field>
        <Field label={t("profile.stream")} error={errors.stream}>
          <Select value={profile.stream} onChange={(e) => update({ stream: e.target.value as any })}>
            <option value="">{t("common.required")}</option>
            <option value="arts">{t("profile.streamArts")}</option>
            <option value="science-pcm">{t("profile.streamPcm")}</option>
            <option value="science-pcb">{t("profile.streamPcb")}</option>
            <option value="commerce">{t("profile.streamCommerce")}</option>
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={t("profile.bestOfFive")} error={errors.bestOfFive} hint="Average of best five subjects">
            <Input
              inputMode="decimal"
              value={profile.bestOfFive}
              onChange={(e) => update({ bestOfFive: e.target.value })}
              placeholder="87.4"
            />
          </Field>
          <Field label={t("profile.resultStatus")} error={errors.resultStatus}>
            <Select value={profile.resultStatus} onChange={(e) => update({ resultStatus: e.target.value as any })}>
              <option value="">{t("common.required")}</option>
              <option value="passed">{t("profile.passed")}</option>
              <option value="compartment">{t("profile.compartment")}</option>
              <option value="awaited">{t("profile.awaited")}</option>
            </Select>
          </Field>
        </div>
      </Card>
    </ProfileStepShell>
  );
}
