"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";
import { useScrutinyBridge } from "@/providers/bridge-providers";
import { useToast } from "@/providers/toast-provider";

export default function IssuesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { applications } = useApplications();
  const { scrutiny, resolveDiscrepancy } = useScrutinyBridge();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const draft = courseId ? applications[courseId] : undefined;
  const issues = courseId ? scrutiny[courseId]?.discrepancies || [] : [];

  function resubmit() {
    if (!courseId) return;
    setBusy(true);
    setTimeout(() => {
      resolveDiscrepancy(courseId);
      toast.success(t("applications.issuesSuccess"));
      setBusy(false);
      router.push("/dashboard");
    }, 900);
  }

  return (
    <PageShell title={t("applications.issuesTitle")} showBack showTabs={false}>
      <Card padded>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-warning-subtle text-warning"><AlertTriangle size={18} /></div>
          <div>
            <CardTitle>{t("applications.issuesTitle")}</CardTitle>
            <CardSubtitle>{t("applications.issuesSubtitle")}</CardSubtitle>
          </div>
        </div>
      </Card>

      {issues.length === 0 ? (
        <Card padded className="mt-3">
          <div className="flex items-center gap-2 text-success-ink">
            <CheckCircle2 size={16} />
            <span className="text-[13.5px] font-semibold">No open discrepancies.</span>
          </div>
        </Card>
      ) : (
        <div className="mt-3 space-y-2">
          {issues.map((d, i) => (
            <Card key={i} padded>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{t(`documents.${d.docType}`)}</div>
                  <div className="text-[13px] font-semibold text-ink leading-snug">{d.reason}</div>
                </div>
                <Link href={`/documents/rejection/${d.docType}`}>
                  <Button size="sm" variant="outline" trailingIcon={<ChevronRight size={14} />}>{t("documents.reupload")}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {issues.length > 0 && (
        <div className="mt-4">
          <Button block size="lg" loading={busy} onClick={resubmit}>{t("applications.issuesResubmit")}</Button>
        </div>
      )}
    </PageShell>
  );
}
