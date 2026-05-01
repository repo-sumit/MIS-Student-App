"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Upload } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/providers/locale-provider";
import { useDocuments } from "@/providers/documents-provider";
import { useToast } from "@/providers/toast-provider";
import { useApplications } from "@/providers/applications-provider";
import type { DocType } from "@/domain/types";

export default function RejectionPage() {
  const { docType } = useParams<{ docType: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { documents, upload } = useDocuments();
  const { list, resolveAppDiscrepancy } = useApplications();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const dt = docType as DocType;
  const doc = documents[dt];

  // Find any application with an open discrepancy on this docType
  const targetApp = list.find((a) => a.discrepancy?.docType === dt && !a.discrepancyResolvedAt);
  const reason = targetApp?.discrepancy?.reason || doc?.rejectionReason || "Document is unclear or incomplete. Please re-upload a clear copy.";
  const deadline = targetApp?.discrepancy?.deadlineAt;

  function reuploadDigi() {
    setBusy(true);
    setTimeout(() => {
      upload(dt, { fileName: `digilocker-${dt}-v2.pdf`, source: "digilocker", sizeKb: 192 });
      if (targetApp) resolveAppDiscrepancy(targetApp.courseId);
      toast.success(t("documents.fixSuccess"));
      router.push("/applications");
    }, 1100);
  }

  function reuploadDevice() {
    setBusy(true);
    setTimeout(() => {
      upload(dt, { fileName: `device-${dt}-v2.jpg`, source: "device", sizeKb: 220 });
      if (targetApp) resolveAppDiscrepancy(targetApp.courseId);
      toast.success(t("documents.fixSuccess"));
      router.push("/applications");
    }, 800);
  }

  return (
    <PageShell title={t("documents.rejectionTitle")} showBack showTabs={false} size="medium" variant="compact">
      <Card padded className="border-l-4 border-l-danger">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-danger-subtle text-danger">
            <AlertTriangle size={18} />
          </div>
          <div className="min-w-0">
            <CardTitle>{t(`documents.${dt}`)}</CardTitle>
            <CardSubtitle>{t("documents.rejectionSubtitle")}</CardSubtitle>
            <div className="mt-2 rounded-card bg-danger-subtle/70 px-3 py-2 text-[12.5px] text-danger-ink leading-snug">{reason}</div>
            {deadline && <div className="mt-2 text-[11.5px] text-ink-subtle">{t("documents.deadline")}: {new Date(deadline).toLocaleDateString()}</div>}
          </div>
        </div>
      </Card>

      <Card padded className="mt-3">
        <div className="space-y-2">
          <Button block size="lg" loading={busy} leadingIcon={<Upload size={16} />} onClick={reuploadDigi}>{t("documents.reupload")}</Button>
          <Button block variant="outline" loading={busy} onClick={reuploadDevice}>Upload from device</Button>
        </div>
      </Card>
    </PageShell>
  );
}
