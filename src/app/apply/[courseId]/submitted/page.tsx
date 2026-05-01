"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";

export default function SubmittedConfirmation() {
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useLocale();
  const { applications } = useApplications();
  const draft = courseId ? applications[courseId] : undefined;

  return (
    <PageShell title={t("apply.submittedTitle")} showBack showTabs={false} size="medium" variant="compact">
      <Card padded>
        <div className="flex flex-col items-center text-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle text-success">
            <CheckCircle2 size={28} />
          </div>
          <h2 className="mt-3 text-[20px] font-bold text-ink">{t("apply.submittedTitle")}</h2>
          <p className="text-[13.5px] text-ink-muted mt-1 max-w-[320px]">{t("apply.submittedBody")}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-card bg-line-subtle/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-subtle">{t("submitted.appNumber")}</div>
            <div className="text-[13px] font-bold text-ink truncate">{draft?.applicationNumber || "—"}</div>
          </div>
          <div className="rounded-card bg-line-subtle/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-subtle">{t("submitted.submittedAt")}</div>
            <div className="text-[13px] font-bold text-ink">{draft?.submittedAt ? new Date(draft.submittedAt).toLocaleDateString() : "—"}</div>
          </div>
        </div>
      </Card>

      <Card padded className="mt-3">
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/applications"><Button block variant="outline">{t("submitted.viewApp")}</Button></Link>
        <Link href="/dashboard"><Button block>{t("submitted.backHome")}</Button></Link>
      </div>
    </PageShell>
  );
}
