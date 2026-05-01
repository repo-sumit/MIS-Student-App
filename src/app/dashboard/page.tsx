"use client";

import Link from "next/link";
import { FileText, GraduationCap, ListChecks, HelpCircle, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTracker } from "@/components/shell/status-tracker";
import { TimelineCard } from "@/components/shell/timeline-card";
import { NextActionCard, ApplicationSummaryCard } from "@/components/shell/next-action-card";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useEffectiveStudentStep } from "@/providers/use-effective-step";
import { useApplications } from "@/providers/applications-provider";
import { useAllocation } from "@/providers/allocation-provider";
import { useMeta } from "@/providers/meta-provider";
import { COLLEGES, OFFERINGS, RECENT_UPDATES } from "@/domain/fixtures";
import { getApplicationTimeline, getNextAction } from "@/services/lifecycle";

export default function Dashboard() {
  const { t, pick } = useLocale();
  const { profile } = useProfile();
  const { list, applications } = useApplications();
  const { allocations } = useAllocation();
  const { meta } = useMeta();
  const eff = useEffectiveStudentStep();

  const firstName = profile.fullName?.trim().split(" ")[0] || "";
  const greeting = firstName ? t("dashboard.greeting", { name: firstName }) : t("dashboard.guest");

  const focus = eff.firstApplication;
  const offering = focus ? OFFERINGS.find((o) => o.id === focus.courseId) : undefined;
  const college = offering ? COLLEGES.find((c) => c.id === offering.collegeId) : undefined;
  const allocation = focus ? allocations[focus.courseId] : undefined;

  const next = getNextAction({
    step: eff.step,
    applications: list,
    profile,
    allocations
  });

  const timeline = focus
    ? getApplicationTimeline({
        application: focus,
        registeredAt: meta.registeredAt,
        profileCompletedAt: meta.profileCompletedAt,
        allocation
      })
    : meta.registeredAt
    ? [
        ...(meta.registeredAt ? [{ kind: "registered" as const, at: meta.registeredAt }] : []),
        ...(meta.profileCompletedAt ? [{ kind: "profileCompleted" as const, at: meta.profileCompletedAt }] : [])
      ]
    : [];

  const showDiscrepancyBanner = list.some((a) => a.discrepancy && !a.discrepancyResolvedAt);
  const discCourseId = list.find((a) => a.discrepancy && !a.discrepancyResolvedAt)?.courseId;

  const subLabel = focus?.applicationNumber ? `App ${focus.applicationNumber}` : undefined;

  return (
    <PageShell size="dashboard">
      <div className="space-y-4 lg:space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-[26px] font-bold text-ink truncate">{greeting}</h1>
            <p className="text-[13px] sm:text-[14px] text-ink-muted">{t("dashboard.subgreeting")}</p>
          </div>
          <Badge tone="brand" dot className="shrink-0">{t(`stages.${eff.step}`)}</Badge>
        </div>

        {showDiscrepancyBanner && discCourseId && (
          <Card padded className="border-l-4 border-l-warning">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-card bg-warning-subtle text-warning">
                <AlertTriangle size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle>{t("dashboard.discrepancyTitle")}</CardTitle>
                <CardSubtitle>{t("dashboard.discrepancyBody", { count: 1 })}</CardSubtitle>
                <Link href={`/applications/${discCourseId}/issues`} className="mt-2 inline-block">
                  <Button size="sm" variant="primary">{t("dashboard.discrepancyCta")}</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Tracker */}
        <Card padded>
          <StatusTracker currentStep={eff.step} subLabel={subLabel} />
        </Card>

        {/* Two-column grid (desktop) */}
        <div className="dashboard-grid">
          <div className="lg:col-span-8 space-y-4 lg:space-y-6">
            <NextActionCard action={next} />

            {timeline.length > 0 && <TimelineCard entries={timeline} />}

            <div>
              <div className="text-eyebrow mb-2 px-1">{t("dashboard.quickLinksTitle")}</div>
              <div className="card-grid">
                <QuickTile href="/profile/step/4" icon={<FileText size={16} />} label={t("dashboard.qlDocuments")} />
                <QuickTile href="/discover" icon={<GraduationCap size={16} />} label={t("dashboard.qlEligibility")} />
                <QuickTile href="/applications" icon={<ListChecks size={16} />} label={t("dashboard.qlApplications")} />
                <QuickTile href="/help" icon={<HelpCircle size={16} />} label={t("dashboard.qlHelp")} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:space-y-6">
            <ApplicationSummaryCard
              appNumber={focus?.applicationNumber}
              courseTitle={offering ? pick(offering.name) : undefined}
              collegeName={college ? pick(college.name) : undefined}
              step={t(`stages.${eff.step}`)}
            />

            <div>
              <div className="text-eyebrow mb-2 px-1">{t("dashboard.updatesTitle")}</div>
              <div className="space-y-2">
                {RECENT_UPDATES.map((u) => (
                  <Card key={u.id} padded>
                    <div className="flex items-start gap-3">
                      <span
                        className={
                          "mt-1 inline-flex h-2 w-2 rounded-full " +
                          (u.tone === "success" ? "bg-success" : "bg-brand")
                        }
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-ink leading-snug">{t(u.titleKey)}</div>
                        <div className="text-[12px] text-ink-muted leading-snug">{t(u.bodyKey)}</div>
                      </div>
                      <div className="text-[11px] text-ink-subtle whitespace-nowrap">{u.when}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function QuickTile({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}>
      <Card padded className="hover:ring-brand-200 transition-shadow">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-card bg-brand-50 text-brand">{icon}</div>
          <div className="text-[13.5px] font-bold text-ink">{label}</div>
        </div>
      </Card>
    </Link>
  );
}
