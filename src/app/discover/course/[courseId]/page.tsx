"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Users, Clock, GraduationCap, BadgeIndianRupee, Layers } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardDivider, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COLLEGES, COMBINATIONS, OFFERINGS } from "@/domain/fixtures";
import { useLocale } from "@/providers/locale-provider";
import { formatINR } from "@/services/fee";
import { useProfile } from "@/providers/profile-provider";
import { evaluateOne } from "@/services/eligibility";

export default function CourseDetail() {
  const params = useParams<{ courseId: string }>();
  const { t, pick } = useLocale();
  const { profile } = useProfile();
  const offering = OFFERINGS.find((o) => o.id === params.courseId);
  if (!offering) {
    return (
      <PageShell title={t("errors.notFoundTitle")} showBack>
        <Card padded>
          <CardTitle>{t("errors.notFoundTitle")}</CardTitle>
          <CardSubtitle>{t("errors.notFoundBody")}</CardSubtitle>
        </Card>
      </PageShell>
    );
  }
  const college = COLLEGES.find((c) => c.id === offering.collegeId)!;
  const verdict = evaluateOne(profile, offering);
  const combos = offering.combinations.map((id) => COMBINATIONS.find((c) => c.id === id)).filter(Boolean) as typeof COMBINATIONS;

  return (
    <PageShell title={offering.courseCode} showBack>
      <div className="space-y-3">
        <Card padded>
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-50 text-brand text-[12px] font-bold">{college.code}</div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
              <div className="text-[16px] font-bold text-ink leading-snug">{pick(offering.name)}</div>
              <div className="text-[12px] text-ink-muted truncate">{pick(college.name)} · {college.district}</div>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-ink-muted leading-relaxed">{pick(offering.description)}</p>
          {verdict.reasons.length > 0 && (
            <>
              <CardDivider />
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone={verdict.status === "eligible" ? "success" : verdict.status === "conditional" ? "warning" : "danger"} dot>
                  {t(`discover.${verdict.status === "not_eligible" ? "notEligible" : verdict.status}`)}
                </Badge>
                <span className="text-[12px] text-ink-muted">{verdict.reasons[0]}</span>
              </div>
            </>
          )}
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Stat icon={<Clock size={14} />} label={t("course.duration")} value={t("course.years", { n: offering.durationYears })} />
          <Stat icon={<Users size={14} />} label={t("course.totalSeats")} value={String(offering.totalSeats)} />
          <Stat icon={<GraduationCap size={14} />} label={t("course.minMarks")} value={`${offering.minMarks}%`} />
          <Stat icon={<BadgeIndianRupee size={14} />} label={t("course.feeAnnual")} value={formatINR(offering.feeAmount)} />
        </div>

        <Card padded>
          <CardTitle>{t("course.combinations")}</CardTitle>
          <div className="mt-3 space-y-2">
            {combos.map((c) => (
              <div key={c.id} className="rounded-card bg-line-subtle/60 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-brand" />
                  <span className="text-[13px] font-semibold text-ink">{pick(c.label)}</span>
                </div>
                <div className="mt-1 text-[11.5px] text-ink-muted">{c.subjects.join(" · ")}</div>
              </div>
            ))}
          </div>
        </Card>

        {verdict.status !== "not_eligible" ? (
          <Link href={`/apply/${offering.id}/preferences`} className="block">
            <Button block size="lg">{t("course.applyCta")}</Button>
          </Link>
        ) : (
          <Button block size="lg" disabled>{t("discover.notEligible")}</Button>
        )}
      </div>
    </PageShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card padded>
      <div className="flex items-center gap-2 text-ink-muted text-[11px] font-semibold uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-[15px] font-bold text-ink">{value}</div>
    </Card>
  );
}
