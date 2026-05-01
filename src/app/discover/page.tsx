"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented";
import { EmptyState } from "@/components/ui/empty";
import { useLocale } from "@/providers/locale-provider";
import { useProfile } from "@/providers/profile-provider";
import { COLLEGES, DISTRICTS, HP_DISTANCE_MOCK } from "@/domain/fixtures";
import { evaluateAll } from "@/services/eligibility";
import { formatINR } from "@/services/fee";

type EligFilter = "all" | "eligible" | "conditional";
type StreamFilter = "all" | "arts" | "science-pcm" | "science-pcb" | "commerce";

export default function Discover() {
  const { t, pick } = useLocale();
  const { profile } = useProfile();
  const [q, setQ] = useState("");
  const [district, setDistrict] = useState<string>("all");
  const [stream, setStream] = useState<StreamFilter>("all");
  const [eligibility, setEligibility] = useState<EligFilter>("all");

  const evaluations = useMemo(() => evaluateAll(profile), [profile]);

  const items = useMemo(() => {
    return evaluations.filter(({ offering, verdict }) => {
      const college = COLLEGES.find((c) => c.id === offering.collegeId);
      if (!college) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        const hay = [college.name.en, college.name.hi, college.code, offering.courseCode, offering.name.en, offering.name.hi].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      if (district !== "all" && college.district !== district) return false;
      if (stream !== "all" && offering.stream !== stream && offering.stream !== "any") return false;
      if (eligibility === "eligible" && verdict.status !== "eligible") return false;
      if (eligibility === "conditional" && verdict.status !== "conditional") return false;
      return true;
    });
  }, [evaluations, q, district, stream, eligibility]);

  return (
    <PageShell title={t("discover.title")}>
      <div className="space-y-3">
        <p className="text-[12.5px] text-ink-muted px-1 -mt-1">{t("discover.subtitle", { count: COLLEGES.length })}</p>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("discover.search")}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4 pb-1">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="rounded-pill bg-white border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink shrink-0"
          >
            <option value="all">{t("discover.filterDistrict")}: {t("discover.all")}</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={stream}
            onChange={(e) => setStream(e.target.value as any)}
            className="rounded-pill bg-white border border-line px-3 py-1.5 text-[12.5px] font-semibold text-ink shrink-0"
          >
            <option value="all">{t("discover.filterStream")}: {t("discover.all")}</option>
            <option value="arts">Arts</option>
            <option value="science-pcm">Science (PCM)</option>
            <option value="science-pcb">Science (PCB)</option>
            <option value="commerce">Commerce</option>
          </select>
        </div>

        <SegmentedControl
          value={eligibility}
          onChange={(v) => setEligibility(v)}
          options={[
            { value: "all", label: t("discover.all") },
            { value: "eligible", label: t("discover.eligible") },
            { value: "conditional", label: t("discover.conditional") }
          ]}
        />

        {items.length === 0 ? (
          <EmptyState
            title={t("discover.noResults")}
            description="Try widening the filters."
            action={<Button onClick={() => { setQ(""); setDistrict("all"); setStream("all"); setEligibility("all"); }}>Reset</Button>}
          />
        ) : (
          <div className="space-y-2.5">
            {items.map(({ offering, verdict }) => {
              const college = COLLEGES.find((c) => c.id === offering.collegeId)!;
              const dist = HP_DISTANCE_MOCK[college.district] ?? 0;
              return (
                <Card key={offering.id} padded>
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-brand-50 text-brand text-[12px] font-bold">
                      {college.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{offering.courseCode}</div>
                          <div className="text-[14px] font-bold text-ink truncate">{pick(offering.name)}</div>
                          <div className="text-[12px] text-ink-muted truncate">{pick(college.name)}</div>
                        </div>
                        {verdict.status === "eligible" ? (
                          <Badge tone="success" dot>{t("discover.eligible")}</Badge>
                        ) : verdict.status === "conditional" ? (
                          <Badge tone="warning" dot>{t("discover.conditional")}</Badge>
                        ) : (
                          <Badge tone="danger" dot>{t("discover.notEligible")}</Badge>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                        <span className="inline-flex items-center gap-1 rounded-pill bg-line-subtle px-2 py-0.5 text-ink-muted">
                          <MapPin size={10} /> {college.district} · {t("discover.distance", { km: dist })}
                        </span>
                        <span className="inline-flex items-center rounded-pill bg-line-subtle px-2 py-0.5 text-ink-muted">{t("discover.seats", { count: offering.totalSeats })}</span>
                        <span className="inline-flex items-center rounded-pill bg-line-subtle px-2 py-0.5 text-ink-muted">{t("discover.fee", { amount: formatINR(offering.feeAmount) })}</span>
                        <span className="inline-flex items-center rounded-pill bg-line-subtle px-2 py-0.5 text-ink-muted">{t("discover.minMarks", { marks: offering.minMarks })}</span>
                      </div>
                      {verdict.reasons.length > 0 && (
                        <div className="mt-2 text-[11.5px] text-ink-muted leading-snug">
                          {verdict.reasons.slice(0, 2).join(" · ")}
                        </div>
                      )}
                      <div className="mt-2.5 flex gap-2">
                        <Link href={`/discover/course/${offering.id}`} className="flex-1">
                          <Button block size="sm" variant="outline">{t("discover.viewCourse")}</Button>
                        </Link>
                        {verdict.status !== "not_eligible" && (
                          <Link href={`/apply/${offering.id}/preferences`} className="flex-1">
                            <Button block size="sm">{t("discover.apply")}</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
