"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { useLocale } from "@/providers/locale-provider";
import { useApplications } from "@/providers/applications-provider";
import { useProfile } from "@/providers/profile-provider";
import { eligibleOfferings } from "@/services/eligibility";
import { COLLEGES } from "@/domain/fixtures";
import { applicationFee, formatINR } from "@/services/fee";
import { hasEnoughProfile } from "@/services/status";

export default function ApplyHub() {
  const { t, pick } = useLocale();
  const { profile } = useProfile();
  const { list, applications } = useApplications();
  const eligible = eligibleOfferings(profile);
  const profileReady = hasEnoughProfile(profile);

  if (!profileReady) {
    return (
      <PageShell title={t("apply.hubTitle")}>
        <EmptyState
          title={t("apply.noEligible")}
          action={
            <Link href="/profile/step/1">
              <Button>{t("dashboard.stage.registered.cta")}</Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell title={t("apply.hubTitle")}>
      <p className="text-[13px] text-ink-muted -mt-1 mb-2 px-1">{t("apply.hubSubtitle")}</p>
      <div className="space-y-2.5">
        {eligible.map(({ offering }) => {
          const college = COLLEGES.find((c) => c.id === offering.collegeId)!;
          const draft = applications[offering.id];
          const submitted = draft?.status === "submitted";
          const prefCount = draft?.preferences.length || 0;
          return (
            <Card key={offering.id} padded>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-50 text-brand text-[12px] font-bold">
                  {college.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
                      <div className="text-[14px] font-bold text-ink truncate">{pick(offering.name)}</div>
                      <div className="text-[12px] text-ink-muted truncate">{pick(college.name)}</div>
                    </div>
                    {submitted ? <Badge tone="success" dot>{t("apply.submitted")}</Badge> : draft ? <Badge tone="info">{t("apply.draft")}</Badge> : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded-pill bg-line-subtle px-2 py-0.5 text-ink-muted">{t("apply.preferences", { n: prefCount, max: offering.maxPreferences })}</span>
                    <span className="rounded-pill bg-line-subtle px-2 py-0.5 text-ink-muted">{t("apply.fee", { amount: formatINR(applicationFee()) })}</span>
                  </div>
                  <div className="mt-2.5">
                    {submitted ? (
                      <Link href={`/apply/${offering.id}/submitted`}>
                        <Button block size="sm" variant="outline" trailingIcon={<ChevronRight size={14} />}>{t("apply.viewSubmitted")}</Button>
                      </Link>
                    ) : draft ? (
                      <Link href={`/apply/${offering.id}/preferences`}>
                        <Button block size="sm" trailingIcon={<ChevronRight size={14} />}>{t("apply.continueDraft")}</Button>
                      </Link>
                    ) : (
                      <Link href={`/apply/${offering.id}/preferences`}>
                        <Button block size="sm" trailingIcon={<ChevronRight size={14} />}>{t("apply.startApply")}</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
