"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle, CardDivider } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import { useLocale } from "@/providers/locale-provider";
import { formatINR } from "@/services/fee";

export default function CollegeDetail() {
  const params = useParams<{ collegeId: string }>();
  const router = useRouter();
  const { t, pick } = useLocale();
  const college = COLLEGES.find((c) => c.id === params.collegeId);
  if (!college) {
    return (
      <PageShell title="College">
        <Card padded>
          <CardTitle>{t("errors.notFoundTitle")}</CardTitle>
          <CardSubtitle>{t("errors.notFoundBody")}</CardSubtitle>
        </Card>
      </PageShell>
    );
  }
  const offerings = OFFERINGS.filter((o) => o.collegeId === college.id);
  return (
    <PageShell title={college.code} showBack>
      <div className="space-y-3">
        <Card padded>
          <Badge tone="brand" dot>{t("college.type")}: {college.type}</Badge>
          <h2 className="mt-2 text-[18px] font-bold text-ink leading-snug">{pick(college.name)}</h2>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-muted">
            <MapPin size={12} /> {college.district}, Himachal Pradesh
          </div>
          <CardDivider />
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <Info label={t("college.established")} value={String(college.established)} />
            <Info label={t("college.aishe")} value={college.aishe} />
          </div>
        </Card>

        <Card padded>
          <CardTitle>{t("college.contact")}</CardTitle>
          <div className="mt-3 space-y-2.5">
            <a href={`tel:${college.contactPhone}`} className="flex items-center gap-3 text-[13px] text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-card bg-brand-50 text-brand"><Phone size={14} /></span>
              {college.contactPhone}
            </a>
            <a href={`mailto:${college.contactEmail}`} className="flex items-center gap-3 text-[13px] text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-card bg-info-subtle text-info-ink"><Mail size={14} /></span>
              {college.contactEmail}
            </a>
          </div>
        </Card>

        <div className="text-eyebrow px-1">{t("college.courses")}</div>
        <div className="space-y-2">
          {offerings.map((o) => (
            <Card key={o.id} padded>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{o.courseCode}</div>
                  <div className="text-[14px] font-bold text-ink truncate">{pick(o.name)}</div>
                  <div className="text-[11.5px] text-ink-muted truncate">{formatINR(o.feeAmount)} · {o.totalSeats} seats · min {o.minMarks}%</div>
                </div>
                <Link href={`/discover/course/${o.id}`}>
                  <Button size="sm" variant="ghost" trailingIcon={<ChevronRight size={14} />}>{t("common.viewDetails")}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card bg-line-subtle/60 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-subtle">{label}</div>
      <div className="font-semibold text-ink">{value}</div>
    </div>
  );
}
