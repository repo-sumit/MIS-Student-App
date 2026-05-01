"use client";

import { useParams, useRouter } from "next/navigation";
import { ApplyShell } from "@/components/apply/apply-shell";
import { Card, CardDivider, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApplications } from "@/providers/applications-provider";
import { useProfile } from "@/providers/profile-provider";
import { useDocuments } from "@/providers/documents-provider";
import { useLocale } from "@/providers/locale-provider";
import { COLLEGES, COMBINATIONS, OFFERINGS } from "@/domain/fixtures";
import { applicationFee, formatINR } from "@/services/fee";

export default function ReviewPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t, pick } = useLocale();
  const { applications } = useApplications();
  const { profile } = useProfile();
  const { documents } = useDocuments();
  const draft = courseId ? applications[courseId] : undefined;
  const offering = OFFERINGS.find((o) => o.id === courseId);
  if (!draft || !offering) return null;

  const docCount = Object.keys(documents).length;

  return (
    <ApplyShell
      step={3}
      title={t("apply.reviewTitle")}
      subtitle={t("apply.reviewSubtitle")}
      footer={<Button block onClick={() => router.push(`/apply/${courseId}/declaration`)}>{t("common.continue")}</Button>}
    >
      <Card padded>
        <CardTitle>{t("apply.reviewProfile")}</CardTitle>
        <div className="mt-3 space-y-1.5 text-[13px]">
          <Row label={t("profile.fullName")} value={profile.fullName} />
          <Row label={t("profile.dob")} value={profile.dob} />
          <Row label={t("profile.mobile")} value={profile.mobile} />
          <Row label={t("profile.email")} value={profile.email} />
          <Row label={t("profile.district")} value={String(profile.district)} />
        </div>
        <CardDivider />
        <CardTitle>{t("apply.reviewClaims")}</CardTitle>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {profile.category && <Badge tone="brand">{t(`profile.${profile.category}`)}</Badge>}
          {profile.domicile === "hp" && <Badge tone="success">HP domicile</Badge>}
          {profile.isPwd && <Badge tone="info">PwD</Badge>}
          {profile.isSingleGirlChild && <Badge tone="info">SGC</Badge>}
        </div>
        <CardDivider />
        <CardTitle>{t("apply.reviewDocuments")}</CardTitle>
        <CardSubtitle>{docCount} of 5 minimum required</CardSubtitle>
        <CardDivider />
        <CardTitle>{t("apply.reviewPreferences")}</CardTitle>
        <ol className="mt-3 space-y-2">
          {draft.preferences.map((p) => {
            const c = COMBINATIONS.find((cc) => cc.id === p.combinationId);
            const col = COLLEGES.find((cc) => cc.id === p.collegeId);
            if (!c || !col) return null;
            return (
              <li key={`${p.combinationId}-${p.collegeId}`} className="flex items-center gap-3 rounded-card bg-line-subtle/60 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-white text-[11px] font-bold">{p.rankOrder}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink truncate">{pick(c.label)}</div>
                  <div className="text-[11.5px] text-ink-muted truncate">{pick(col.name)}</div>
                </div>
              </li>
            );
          })}
        </ol>
        <CardDivider />
        <CardTitle>{t("apply.reviewFee")}</CardTitle>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] text-ink-muted">{t("apply.submitTitle")}</span>
          <span className="text-[15px] font-bold text-ink">{formatINR(applicationFee())}</span>
        </div>
      </Card>
    </ApplyShell>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="font-semibold text-ink truncate max-w-[60%] text-right">{value || "—"}</span>
    </div>
  );
}
