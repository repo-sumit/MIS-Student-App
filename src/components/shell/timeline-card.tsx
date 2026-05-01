"use client";

import {
  Award,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  FileCheck,
  GraduationCap,
  Send,
  ShieldCheck,
  Trophy,
  UserCheck,
  Wallet
} from "lucide-react";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/providers/locale-provider";
import type { TimelineEntry, TimelineEntryKind } from "@/domain/types";

const ICONS: Record<TimelineEntryKind, React.ComponentType<{ size?: number }>> = {
  registered: UserCheck,
  profileCompleted: ClipboardCheck,
  applied: Send,
  submitted: Send,
  underScrutiny: ClipboardList,
  discrepancyRaised: AlertTriangle,
  discrepancyResolved: ShieldCheck,
  verified: FileCheck,
  meritPublished: Trophy,
  allotted: Award,
  feePaid: Wallet,
  admissionConfirmed: GraduationCap
};

const TONE: Record<TimelineEntryKind, string> = {
  registered: "bg-brand-50 text-brand",
  profileCompleted: "bg-brand-50 text-brand",
  applied: "bg-brand-50 text-brand",
  submitted: "bg-brand-50 text-brand",
  underScrutiny: "bg-info-subtle text-info-ink",
  discrepancyRaised: "bg-warning-subtle text-warning-ink",
  discrepancyResolved: "bg-success-subtle text-success-ink",
  verified: "bg-success-subtle text-success-ink",
  meritPublished: "bg-success-subtle text-success-ink",
  allotted: "bg-success-subtle text-success-ink",
  feePaid: "bg-success-subtle text-success-ink",
  admissionConfirmed: "bg-success-subtle text-success-ink"
};

export function TimelineCard({ entries, title, empty }: { entries: TimelineEntry[]; title?: string; empty?: string }) {
  const { t } = useLocale();
  if (entries.length === 0) {
    return (
      <Card padded>
        <CardTitle>{title || "Application timeline"}</CardTitle>
        <CardSubtitle>{empty || "Your timeline will appear here as you progress."}</CardSubtitle>
      </Card>
    );
  }

  return (
    <Card padded>
      <CardTitle>{title || "Application timeline"}</CardTitle>
      <ol className="mt-3 relative pl-3">
        <span className="absolute left-[15px] top-2 bottom-2 w-px bg-line-subtle" aria-hidden />
        {entries.map((e, i) => {
          const Icon = ICONS[e.kind];
          const tone = TONE[e.kind];
          const isLast = i === entries.length - 1;
          return (
            <li key={`${e.kind}-${e.at}-${i}`} className={"relative pl-9 " + (isLast ? "pb-0" : "pb-3")}>
              <span className={"absolute left-0 top-0.5 flex h-7 w-7 items-center justify-center rounded-full ring-2 ring-white " + tone}>
                <Icon size={13} />
              </span>
              <div className="text-[13px] font-semibold text-ink">{t(`timeline.${e.kind}`)}</div>
              <div className="text-[11.5px] text-ink-subtle">{new Date(e.at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</div>
              {e.meta?.reason && <div className="text-[12px] text-ink-muted mt-0.5 leading-snug">{e.meta.reason}</div>}
              {e.meta?.rollNumber && <div className="text-[12px] text-success-ink mt-0.5">Roll: {e.meta.rollNumber}</div>}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
