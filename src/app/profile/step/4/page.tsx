"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Upload, CheckCircle2 } from "lucide-react";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Field, Select, Checkbox } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { ProfileStepShell } from "@/components/profile/step-shell";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useDocuments } from "@/providers/documents-provider";
import type { DocType } from "@/domain/types";

const REQUIRED_DOCS: DocType[] = ["photo", "signature", "class10", "class12", "domicile"];

export default function Step4() {
  const { t } = useLocale();
  const { profile, update } = useProfile();
  const { documents } = useDocuments();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const valid = !!profile.category && !!profile.domicile;

  function save() {
    const e: Record<string, string> = {};
    if (!profile.category) e.category = t("common.required");
    if (!profile.domicile) e.domicile = t("common.required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const allDocs: DocType[] = [
    ...REQUIRED_DOCS,
    ...(profile.category && profile.category !== "general" && profile.category !== "ews" ? ["category" as DocType] : []),
    ...(profile.category === "ews" ? ["category" as DocType] : []),
    ...(profile.isPwd ? ["pwd" as DocType] : []),
    ...(profile.isSingleGirlChild ? ["sgc" as DocType] : [])
  ];

  return (
    <ProfileStepShell
      stepNumber={4}
      title={t("profile.step4")}
      subtitle={t("profile.step4Sub")}
      isValid={valid}
      onSave={save}
    >
      <Card padded className="space-y-3">
        <Field label={t("profile.category")} error={errors.category}>
          <Select value={profile.category} onChange={(e) => update({ category: e.target.value as any })}>
            <option value="">{t("common.required")}</option>
            <option value="general">{t("profile.general")}</option>
            <option value="obc">{t("profile.obc")}</option>
            <option value="sc">{t("profile.sc")}</option>
            <option value="st">{t("profile.st")}</option>
            <option value="ews">{t("profile.ews")}</option>
          </Select>
        </Field>
        <Field label={t("profile.domicile")} error={errors.domicile}>
          <Select value={profile.domicile} onChange={(e) => update({ domicile: e.target.value as any })}>
            <option value="">{t("common.required")}</option>
            <option value="hp">{t("profile.domicileHp")}</option>
            <option value="non-hp">{t("profile.domicileNonHp")}</option>
          </Select>
        </Field>

        <div className="rounded-card bg-line-subtle/60 px-3 py-3 space-y-3">
          <Checkbox
            checked={profile.isSingleGirlChild}
            onChange={(v) => update({ isSingleGirlChild: v })}
            label={t("profile.isSgc")}
          />
          <Checkbox
            checked={profile.isPwd}
            onChange={(v) => update({ isPwd: v })}
            label={t("profile.isPwd")}
          />
        </div>
      </Card>

      <Card padded>
        <CardTitle>{t("profile.documentsTitle")}</CardTitle>
        <CardSubtitle>Upload before applying.</CardSubtitle>
        <div className="mt-3 space-y-2">
          {allDocs.map((dt) => {
            const doc = documents[dt];
            return (
              <Link key={dt} href={doc ? `/documents/preview/${dt}` : `/documents/upload/${dt}`} className="block">
                <div className="flex items-center gap-3 rounded-card border border-line-subtle bg-white px-3 py-2.5 hover:border-brand-200 transition-colors">
                  <div className={
                    "flex h-9 w-9 items-center justify-center rounded-card " +
                    (doc?.status === "verified" ? "bg-success-subtle text-success" : doc ? "bg-info-subtle text-info-ink" : "bg-line-subtle text-ink-muted")
                  }>
                    {doc ? <CheckCircle2 size={16} /> : <Upload size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink truncate">{t(`documents.${dt}`)}</div>
                    <div className="text-[11.5px] text-ink-muted truncate">
                      {doc ? doc.fileName : "Tap to upload"}
                    </div>
                  </div>
                  {doc ? <Badge tone={doc.status === "rejected" ? "danger" : doc.status === "verified" ? "success" : "info"} dot>{t(`documents.${doc.status}`)}</Badge> : <ChevronRight size={16} className="text-ink-subtle" />}
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </ProfileStepShell>
  );
}
