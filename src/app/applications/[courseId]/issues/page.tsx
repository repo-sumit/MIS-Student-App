"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AlertTriangle, ChevronRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";

export default function IssuesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { t } = useLocale();
  const { applications } = useApplications();
  const draft = courseId ? applications[courseId] : undefined;

  return (
    <PageShell title={t("applications.issuesTitle")} showBack showTabs={false} size="medium" variant="compact">
      <Card padded>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-warning-subtle text-warning">
            <AlertTriangle size={18} />
          </div>
          <div>
            <CardTitle>{t("applications.issuesTitle")}</CardTitle>
            <CardSubtitle>{t("applications.issuesSubtitle")}</CardSubtitle>
          </div>
        </div>
      </Card>

      {!draft?.discrepancy ? (
        <Card padded className="mt-3">
          <div className="flex items-center gap-2 text-success-ink">
            <CheckCircle2 size={16} />
            <span className="text-[13.5px] font-semibold">No open discrepancies for this application.</span>
          </div>
        </Card>
      ) : (
        <Card padded className="mt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{t(`documents.${draft.discrepancy.docType}`)}</div>
              <div className="text-[13px] font-semibold text-ink leading-snug">{draft.discrepancy.reason}</div>
              <div className="mt-1 text-[11.5px] text-ink-subtle">{t("documents.deadline")}: {new Date(draft.discrepancy.deadlineAt).toLocaleDateString()}</div>
            </div>
            <Link href={`/documents/rejection/${draft.discrepancy.docType}`}>
              <Button size="sm" variant="primary" trailingIcon={<ChevronRight size={14} />}>{t("documents.reupload")}</Button>
            </Link>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
