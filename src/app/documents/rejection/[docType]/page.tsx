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
import type { DocType } from "@/domain/types";

export default function RejectionPage() {
  const { docType } = useParams<{ docType: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { documents, upload } = useDocuments();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const dt = docType as DocType;
  const doc = documents[dt];
  const reason = doc?.rejectionReason || "Document is unclear or incomplete. Please re-upload a clear copy.";

  function reuploadDigi() {
    setBusy(true);
    setTimeout(() => {
      upload(dt, { fileName: `digilocker-${dt}-v2.pdf`, source: "digilocker", sizeKb: 192 });
      toast.success(t("documents.fixSuccess"));
      router.push(`/documents/preview/${dt}`);
    }, 1100);
  }

  return (
    <PageShell title={t("documents.rejectionTitle")} showBack showTabs={false}>
      <div className="space-y-3">
        <Card padded className="border-l-4 border-l-danger">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-danger-subtle text-danger"><AlertTriangle size={18} /></div>
            <div className="min-w-0">
              <CardTitle>{t(`documents.${dt}`)}</CardTitle>
              <CardSubtitle>{t("documents.rejectionSubtitle")}</CardSubtitle>
              <div className="mt-2 rounded-card bg-danger-subtle/70 px-3 py-2 text-[12.5px] text-danger-ink leading-snug">
                {reason}
              </div>
              <div className="mt-2 text-[11.5px] text-ink-subtle">{t("documents.deadline")}: 7 days</div>
            </div>
          </div>
        </Card>

        <Card padded>
          <div className="space-y-2">
            <Button block size="lg" loading={busy} leadingIcon={<Upload size={16} />} onClick={reuploadDigi}>{t("documents.reupload")}</Button>
            <Button block variant="outline" onClick={() => router.push(`/documents/upload/${dt}`)}>Upload from device</Button>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
