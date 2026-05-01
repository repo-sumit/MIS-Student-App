"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, FileText, Trophy, Award, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/providers/locale-provider";
import { useEffectiveStudentStep } from "@/providers/use-effective-step";
import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import { formatINR } from "@/services/fee";
import { DEMO_BOF, DEMO_RANK } from "@/services/status";
import { useApplications } from "@/providers/applications-provider";

function StageWrapper({
  eyebrow,
  title,
  subtitle,
  tone = "brand",
  children
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tone?: "brand" | "success" | "warning";
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={
        "relative overflow-hidden rounded-hero p-5 text-white shadow-card " +
        (tone === "success"
          ? "bg-gradient-to-br from-success to-[#02953C]"
          : tone === "warning"
          ? "bg-gradient-to-br from-[#F8B200] to-[#D69300]"
          : "bg-gradient-to-br from-brand-500 to-brand-700")
      }
    >
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/10" />
      <div className="absolute -left-10 -bottom-12 h-36 w-36 rounded-full bg-white/10" />
      <div className="relative">
        {eyebrow && (
          <div className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-white/80">{eyebrow}</div>
        )}
        <h2 className="mt-1 text-[20px] font-bold leading-snug">{title}</h2>
        {subtitle && <p className="mt-1 text-[13.5px] text-white/85 leading-relaxed">{subtitle}</p>}
        {children}
      </div>
    </motion.div>
  );
}

export function SubmittedView() {
  const { t, pick } = useLocale();
  const { firstApplicationNumber, firstSubmittedCourseId } = useEffectiveStudentStep();
  const { applications } = useApplications();
  const offering = firstSubmittedCourseId ? OFFERINGS.find((o) => o.id === firstSubmittedCourseId) : undefined;
  const college = offering ? COLLEGES.find((c) => c.id === offering.collegeId) : undefined;
  const submittedAt = firstSubmittedCourseId ? applications[firstSubmittedCourseId]?.submittedAt : undefined;

  return (
    <div className="space-y-3">
      <StageWrapper eyebrow={t("stages.submitted")} title={t("submitted.title")} subtitle={t("submitted.body")}>
        <div className="mt-4 flex items-end justify-between gap-3 rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">{t("submitted.appNumber")}</div>
            <div className="font-bold tracking-wider text-[15px]">{firstApplicationNumber || "—"}</div>
          </div>
          {submittedAt && (
            <div className="text-right">
              <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">{t("submitted.submittedAt")}</div>
              <div className="text-[12.5px] font-semibold">{new Date(submittedAt).toLocaleDateString()}</div>
            </div>
          )}
        </div>
      </StageWrapper>

      <Card>
        <CardTitle>{t("submitted.nextTitle")}</CardTitle>
        <ol className="mt-3 space-y-3">
          {[t("submitted.next1"), t("submitted.next2"), t("submitted.next3"), t("submitted.next4")].map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand text-[11px] font-bold">{i + 1}</span>
              <span className="text-[13px] text-ink-muted leading-snug">{line}</span>
            </li>
          ))}
        </ol>
      </Card>

      {offering && college && (
        <Card padded>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-card bg-brand-50 text-brand"><FileText size={16} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
              <div className="text-[14px] font-bold text-ink truncate">{pick(offering.name)}</div>
              <div className="text-[12px] text-ink-muted truncate">{pick(college.name)}</div>
            </div>
            <Link href="/applications">
              <Button size="sm" variant="ghost" trailingIcon={<ChevronRight size={14} />}>{t("submitted.viewApp")}</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

export function ScrutinyView() {
  const { t, tList } = useLocale();
  const items = tList("scrutiny.items") as string[];
  return (
    <div className="space-y-3">
      <StageWrapper
        eyebrow={t("stages.underScrutiny")}
        title={t("scrutiny.title")}
        subtitle={t("scrutiny.body")}
        tone="brand"
      >
        <div className="mt-3 inline-flex items-center gap-2 rounded-pill bg-white/15 px-3 py-1 text-[11.5px] font-semibold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          {t("scrutiny.expected")}
        </div>
      </StageWrapper>

      <Card>
        <CardTitle>{t("scrutiny.checklist")}</CardTitle>
        <ul className="mt-3 space-y-2.5">
          {items.map((it, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={"mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full " + (i < 2 ? "bg-success-subtle text-success" : "bg-line-subtle text-ink-subtle")}>
                {i < 2 ? <CheckCircle2 size={13} /> : <ClipboardList size={12} />}
              </span>
              <span className="text-[13px] text-ink-muted leading-snug">{it}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function MeritView() {
  const { t, pick } = useLocale();
  const { firstSubmittedCourseId } = useEffectiveStudentStep();
  const offering = firstSubmittedCourseId ? OFFERINGS.find((o) => o.id === firstSubmittedCourseId) : undefined;
  const college = offering ? COLLEGES.find((c) => c.id === offering.collegeId) : undefined;
  return (
    <div className="space-y-3">
      <StageWrapper eyebrow={t("stages.meritPublished")} title={t("merit.publishedTitle")} subtitle={t("merit.publishedBody")} tone="brand">
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">{t("merit.rankCard")}</div>
            <div className="text-[22px] font-bold">#{DEMO_RANK}</div>
          </div>
          <div className="rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">{t("merit.scoreCard")}</div>
            <div className="text-[22px] font-bold">{DEMO_BOF}%</div>
          </div>
        </div>
      </StageWrapper>

      {offering && college && (
        <Card>
          <CardTitle>{t("merit.courseCard")}</CardTitle>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
              <div className="text-[14px] font-bold text-ink truncate">{pick(offering.name)}</div>
              <div className="text-[12px] text-ink-muted truncate">{pick(college.name)}</div>
            </div>
            <Badge tone="success" dot>{t("stages.meritPublished")}</Badge>
          </div>
        </Card>
      )}
    </div>
  );
}

export function AllotmentView() {
  const { t, pick } = useLocale();
  const { firstAllocation, firstSubmittedCourseId } = useEffectiveStudentStep();
  if (!firstAllocation || !firstSubmittedCourseId) return null;
  return (
    <StageWrapper
      eyebrow={t("stages.allotted")}
      title={t("allotment.title")}
      subtitle={t("allotment.subtitle")}
      tone="success"
    >
      <div className="mt-4 space-y-2">
        <div className="rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
          <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">College</div>
          <div className="text-[15px] font-bold">{pick(firstAllocation.offer.collegeName)}</div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[12px]">
          <div className="rounded-card bg-white/15 px-2.5 py-2 backdrop-blur">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-white/70">{t("allotment.rankLabel")}</div>
            <div className="font-bold">#{firstAllocation.rank}</div>
          </div>
          <div className="rounded-card bg-white/15 px-2.5 py-2 backdrop-blur">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-white/70">{t("allotment.feeLabel")}</div>
            <div className="font-bold">{formatINR(firstAllocation.offer.feeAmount)}</div>
          </div>
          <div className="rounded-card bg-white/15 px-2.5 py-2 backdrop-blur">
            <div className="text-[10px] font-semibold tracking-wider uppercase text-white/70">{t("allotment.categoryLabel")}</div>
            <div className="font-bold capitalize">{firstAllocation.category}</div>
          </div>
        </div>
        <Link href={`/allotment/${firstSubmittedCourseId}`}>
          <Button block variant="primary" size="lg" className="!bg-white !text-ink hover:!bg-white/90 mt-2">
            {t("allotment.freeze")} →
          </Button>
        </Link>
      </div>
    </StageWrapper>
  );
}

export function ConfirmedView() {
  const { t, pick } = useLocale();
  const { firstAllocation, firstSubmittedCourseId } = useEffectiveStudentStep();
  if (!firstAllocation) return null;
  return (
    <div className="space-y-3">
      <StageWrapper
        eyebrow={t("stages.admissionConfirmed")}
        title={t("payment.successTitle")}
        subtitle={t("payment.successBody", { college: pick(firstAllocation.offer.collegeName) })}
        tone="success"
      >
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">{t("payment.rollNumber")}</div>
            <div className="text-[15px] font-bold tracking-wider">{firstAllocation.rollNumber || "—"}</div>
          </div>
          <div className="rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
            <div className="text-[10px] font-bold tracking-wider uppercase text-white/75">Fee paid</div>
            <div className="text-[15px] font-bold">{formatINR(firstAllocation.offer.feeAmount)}</div>
          </div>
        </div>
      </StageWrapper>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Orientation</CardTitle>
            <CardSubtitle>{t("payment.orientation")}</CardSubtitle>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50 text-brand"><Award size={18} /></div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" leadingIcon={<FileText size={14} />}>{t("payment.downloadReceipt")}</Button>
        <Button variant="outline" leadingIcon={<Trophy size={14} />}>{t("payment.downloadLetter")}</Button>
      </div>
      {firstSubmittedCourseId && (
        <Link href={`/payment/${firstSubmittedCourseId}`} className="block">
          <Button variant="ghost" block trailingIcon={<ChevronRight size={14} />}>View admission</Button>
        </Link>
      )}
    </div>
  );
}

export function PreSubmittedView() {
  const { t } = useLocale();
  const { step } = useEffectiveStudentStep();
  if (step === "registered") {
    return (
      <Card padded>
        <Badge tone="warning" dot>{t("dashboard.stage.registered.eyebrow")}</Badge>
        <h2 className="mt-2 text-[18px] font-bold text-ink leading-snug">{t("dashboard.stage.registered.title")}</h2>
        <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">{t("dashboard.stage.registered.body")}</p>
        <Link href="/profile/step/1" className="block mt-3">
          <Button block size="lg">{t("dashboard.stage.registered.cta")}</Button>
        </Link>
      </Card>
    );
  }
  return (
    <Card padded>
      <Badge tone="success" dot>{t("dashboard.stage.profileComplete.eyebrow")}</Badge>
      <h2 className="mt-2 text-[18px] font-bold text-ink leading-snug">{t("dashboard.stage.profileComplete.title")}</h2>
      <p className="mt-1 text-[13px] text-ink-muted leading-relaxed">{t("dashboard.stage.profileComplete.body")}</p>
      <Link href="/discover" className="block mt-3">
        <Button block size="lg">{t("dashboard.stage.profileComplete.cta")}</Button>
      </Link>
    </Card>
  );
}
