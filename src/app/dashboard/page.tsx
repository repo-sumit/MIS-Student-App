"use client";

import Link from "next/link";
import { FileText, GraduationCap, ListChecks, HelpCircle, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTracker } from "@/components/shell/status-tracker";
import { DemoProgressControl } from "@/components/shell/demo-progress-control";
import {
  AllotmentView,
  ConfirmedView,
  MeritView,
  PreSubmittedView,
  ScrutinyView,
  SubmittedView
} from "@/components/shell/stage-views";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { useEffectiveStudentStep } from "@/providers/use-effective-step";
import { useApplications } from "@/providers/applications-provider";
import { useScrutinyBridge } from "@/providers/bridge-providers";
import { RECENT_UPDATES } from "@/domain/fixtures";

export default function Dashboard() {
  const { t, tList, locale } = useLocale();
  const { profile } = useProfile();
  const { step, isDemo, firstSubmittedCourseId } = useEffectiveStudentStep();
  const { applications } = useApplications();
  const { scrutiny } = useScrutinyBridge();

  const firstName = profile.fullName?.trim().split(" ")[0] || "";
  const greeting = firstName ? t("dashboard.greeting", { name: firstName }) : t("dashboard.guest");

  // Discrepancies (real-flow only, suppressed during demo)
  const realDiscCount = !isDemo
    ? Object.values(scrutiny).reduce((sum, s) => sum + (s?.discrepancies?.length || 0), 0)
    : 0;
  const firstDiscCourse = Object.entries(scrutiny).find(([, s]) => (s?.discrepancies || []).length > 0)?.[0];

  function StageContent() {
    if (step === "submitted") return <SubmittedView />;
    if (step === "underScrutiny") return <ScrutinyView />;
    if (step === "meritPublished") return <MeritView />;
    if (step === "allotted") return <AllotmentView />;
    if (step === "admissionConfirmed") return <ConfirmedView />;
    return <PreSubmittedView />;
  }

  return (
    <PageShell>
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <h1 className="text-[22px] font-bold text-ink">{greeting}</h1>
            <Badge tone={isDemo ? "brand" : "neutral"} dot={isDemo}>{t(`stages.${step}`)}</Badge>
          </div>
          <p className="text-[13px] text-ink-muted">{t("dashboard.subgreeting")}</p>
        </div>

        <Card padded>
          <StatusTracker currentStep={step} />
        </Card>

        {realDiscCount > 0 && firstDiscCourse && (
          <Card padded className="border-l-4 border-l-warning">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-card bg-warning-subtle text-warning"><AlertTriangle size={16} /></div>
              <div className="flex-1">
                <CardTitle>{t("dashboard.discrepancyTitle")}</CardTitle>
                <CardSubtitle>
                  {realDiscCount === 1 ? t("dashboard.discrepancyBody", { count: realDiscCount }) : t("dashboard.discrepancyBodyPlural", { count: realDiscCount })}
                </CardSubtitle>
                <Link href={`/applications/${firstDiscCourse}/issues`} className="mt-2 inline-block">
                  <Button size="sm" variant="primary">{t("dashboard.discrepancyCta")}</Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <StageContent />

        <DemoProgressControl />

        <div>
          <div className="text-eyebrow mb-2 px-1">{t("dashboard.quickLinksTitle")}</div>
          <div className="grid grid-cols-2 gap-2.5">
            <QuickTile href="/profile/step/4" icon={<FileText size={16} />} label={t("dashboard.qlDocuments")} />
            <QuickTile href="/discover" icon={<GraduationCap size={16} />} label={t("dashboard.qlEligibility")} />
            <QuickTile href="/applications" icon={<ListChecks size={16} />} label={t("dashboard.qlApplications")} />
            <QuickTile href="/help" icon={<HelpCircle size={16} />} label={t("dashboard.qlHelp")} />
          </div>
        </div>

        <div>
          <div className="text-eyebrow mb-2 px-1">{t("dashboard.updatesTitle")}</div>
          <div className="space-y-2">
            {RECENT_UPDATES.map((u) => (
              <Card key={u.id} padded>
                <div className="flex items-start gap-3">
                  <span className={
                    "mt-1 inline-flex h-2 w-2 rounded-full " +
                    (u.tone === "success" ? "bg-success" : "bg-brand")
                  } />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-ink leading-snug">{t(u.titleKey)}</div>
                    <div className="text-[12.5px] text-ink-muted leading-snug">{t(u.bodyKey)}</div>
                  </div>
                  <div className="text-[11px] text-ink-subtle whitespace-nowrap">{u.when}</div>
                </div>
              </Card>
            ))}
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
          <div className="text-[13px] font-bold text-ink">{label}</div>
        </div>
      </Card>
    </Link>
  );
}
