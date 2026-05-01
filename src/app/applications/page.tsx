"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";
import { useEffectiveStudentStep } from "@/providers/use-effective-step";
import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import type { RichApplicationStatus } from "@/domain/types";

const STATUS_TONE: Record<RichApplicationStatus, "neutral" | "info" | "success" | "warning" | "danger"> = {
  draft: "neutral",
  submitted: "info",
  underReview: "info",
  discrepancy: "warning",
  verified: "success",
  conditional: "warning",
  rejected: "danger"
};

function statusLabelKey(s: RichApplicationStatus) {
  return `applications.${s}`;
}

export default function ApplicationsPage() {
  const { t, pick } = useLocale();
  const { list } = useApplications();
  const { step, isDemo } = useEffectiveStudentStep();

  if (list.length === 0) {
    return (
      <PageShell title={t("applications.title")}>
        <EmptyState
          title={t("applications.empty")}
          action={
            <Link href="/discover"><Button>{t("applications.emptyCta")}</Button></Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell title={t("applications.title")}>
      <p className="text-[13px] text-ink-muted -mt-1 mb-2 px-1">{t("applications.subtitle")}</p>
      <div className="space-y-2.5">
        {list.map((app) => {
          const offering = OFFERINGS.find((o) => o.id === app.courseId);
          const college = offering ? COLLEGES.find((c) => c.id === offering.collegeId) : undefined;
          if (!offering || !college) return null;

          let rich: RichApplicationStatus = app.status === "draft" ? "draft" : "submitted";
          if (app.status === "submitted") {
            // Demo override applies after submission
            if (isDemo) {
              if (step === "underScrutiny") rich = "underReview";
              else if (step === "meritPublished") rich = "verified";
              else if (step === "allotted" || step === "admissionConfirmed") rich = "verified";
            }
            const discCount = app.discrepancies?.length || 0;
            if (!isDemo && discCount > 0) rich = "discrepancy";
          }

          const cta = (() => {
            if (rich === "draft") return { href: `/apply/${app.courseId}/preferences`, label: t("applications.continue") };
            if (rich === "discrepancy") return { href: `/applications/${app.courseId}/issues`, label: t("applications.fix") };
            if (step === "allotted" || step === "admissionConfirmed") return { href: `/allotment/${app.courseId}`, label: t("applications.viewAllotment") };
            return { href: `/apply/${app.courseId}/submitted`, label: t("applications.view") };
          })();

          return (
            <Card key={app.courseId} padded>
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-50 text-brand text-[12px] font-bold">{college.code}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
                      <div className="text-[14px] font-bold text-ink truncate">{pick(offering.name)}</div>
                      <div className="text-[12px] text-ink-muted truncate">{pick(college.name)}</div>
                    </div>
                    <Badge tone={STATUS_TONE[rich]} dot>{t(statusLabelKey(rich))}</Badge>
                  </div>
                  {app.applicationNumber && (
                    <div className="mt-1.5 text-[11.5px] text-ink-subtle">{t("applications.appNumber")} {app.applicationNumber}</div>
                  )}
                  {rich === "discrepancy" && app.discrepancies && (
                    <div className="mt-1 text-[12px] text-warning-ink font-semibold">
                      {app.discrepancies.length === 1
                        ? t("applications.discrepancyOpen", { n: app.discrepancies.length })
                        : t("applications.discrepancyOpenPlural", { n: app.discrepancies.length })}
                    </div>
                  )}
                  <div className="mt-2.5">
                    <Link href={cta.href}>
                      <Button block size="sm" variant={rich === "discrepancy" ? "primary" : "outline"} trailingIcon={<ChevronRight size={14} />}>{cta.label}</Button>
                    </Link>
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
