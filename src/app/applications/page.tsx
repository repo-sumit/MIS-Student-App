"use client";

import Link from "next/link";
import { ChevronRight, Clock } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";
import { useAllocation } from "@/providers/allocation-provider";
import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import { lifecycleOf } from "@/services/lifecycle";
import type { ApplicationLifecycle } from "@/domain/types";

const TONE: Record<ApplicationLifecycle, "neutral" | "info" | "success" | "warning" | "danger" | "brand"> = {
  draft: "neutral",
  submitted: "info",
  underScrutiny: "info",
  discrepancyRaised: "warning",
  discrepancyResolved: "info",
  verified: "success",
  conditionallyVerified: "warning",
  meritPublished: "brand",
  allotted: "success",
  feePaid: "success",
  admissionConfirmed: "success"
};

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

export default function ApplicationsPage() {
  const { t, pick } = useLocale();
  const { list } = useApplications();
  const { allocations } = useAllocation();

  if (list.length === 0) {
    return (
      <PageShell title={t("applications.title")} size="medium">
        <EmptyState
          title={t("applications.empty")}
          action={
            <Link href="/discover">
              <Button>{t("applications.emptyCta")}</Button>
            </Link>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell title={t("applications.title")} size="wide">
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-ink">{t("applications.title")}</h1>
            <p className="text-[13px] text-ink-muted">{t("applications.subtitle")}</p>
          </div>
          <Link href="/discover" className="hidden sm:inline-flex">
            <Button size="sm" variant="outline">{t("applications.emptyCta")}</Button>
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {list.map((app) => {
            const offering = OFFERINGS.find((o) => o.id === app.courseId);
            const college = offering ? COLLEGES.find((c) => c.id === offering.collegeId) : undefined;
            if (!offering || !college) return null;

            const life = lifecycleOf(app);
            const allocation = allocations[app.courseId];
            const lastUpdate = app.admissionConfirmedAt || app.feePaidAt || app.allocationCreatedAt || app.meritPublishedAt || app.verifiedAt || app.discrepancyResolvedAt || app.discrepancy?.raisedAt || app.scrutinyStartedAt || app.submittedAt;

            const cta = nextCtaFor(life, app.courseId, app.discrepancy?.docType);

            const sublineKey = (() => {
              if (life === "draft") return "applications.subline.draft";
              if (life === "submitted") return "applications.subline.submitted";
              if (life === "underScrutiny") return "applications.subline.underScrutiny";
              if (life === "discrepancyRaised") return "applications.subline.discrepancyRaised";
              if (life === "discrepancyResolved") return "applications.subline.discrepancyResolved";
              if (life === "verified" || life === "conditionallyVerified") return "applications.subline.verified";
              if (life === "meritPublished") return "applications.subline.meritPublished";
              if (life === "allotted") return "applications.subline.allotted";
              if (life === "feePaid") return "applications.subline.feePaid";
              if (life === "admissionConfirmed") return "applications.subline.admissionConfirmed";
              return null;
            })();

            return (
              <Card key={app.courseId} padded className="flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-brand-50 text-brand text-[12px] font-bold">{college.code}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
                        <div className="text-[14px] font-bold text-ink truncate">{pick(offering.name)}</div>
                        <div className="text-[12px] text-ink-muted truncate">{pick(college.name)}</div>
                      </div>
                      <Badge tone={TONE[life]} dot>{t(`appStatus.${life}`)}</Badge>
                    </div>
                    {app.applicationNumber && (
                      <div className="mt-1.5 text-[11.5px] text-ink-subtle font-medium">App {app.applicationNumber}</div>
                    )}
                  </div>
                </div>

                {sublineKey && (
                  <CardSubtitle className="mt-3">{t(sublineKey)}</CardSubtitle>
                )}

                {allocation?.rollNumber && (
                  <div className="mt-3 rounded-card bg-success-subtle/70 px-3 py-2 text-[12px] text-success-ink">
                    Roll number {allocation.rollNumber}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="text-[11.5px] text-ink-subtle inline-flex items-center gap-1">
                    <Clock size={12} /> {timeAgo(lastUpdate)}
                  </div>
                  <Link href={cta.href}>
                    <Button size="sm" variant={life === "discrepancyRaised" ? "primary" : "outline"} trailingIcon={<ChevronRight size={14} />}>
                      {t(cta.labelKey)}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function nextCtaFor(life: ApplicationLifecycle, courseId: string, docType?: string): { href: string; labelKey: string } {
  switch (life) {
    case "draft":
      return { href: `/apply/${courseId}/preferences`, labelKey: "applications.continue" };
    case "submitted":
    case "underScrutiny":
    case "discrepancyResolved":
    case "verified":
    case "conditionallyVerified":
      return { href: `/apply/${courseId}/submitted`, labelKey: "applications.view" };
    case "discrepancyRaised":
      return { href: docType ? `/documents/rejection/${docType}` : `/applications/${courseId}/issues`, labelKey: "applications.fix" };
    case "meritPublished":
      return { href: "/merit-lookup", labelKey: "applications.viewMerit" };
    case "allotted":
      return { href: `/allotment/${courseId}`, labelKey: "applications.viewAllotment" };
    case "feePaid":
    case "admissionConfirmed":
      return { href: `/payment/${courseId}`, labelKey: "applications.viewAdmission" };
    default:
      return { href: `/apply/${courseId}/submitted`, labelKey: "applications.view" };
  }
}
