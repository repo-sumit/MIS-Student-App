"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, RefreshCw } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { useDocuments } from "@/providers/documents-provider";
import { useLocale } from "@/providers/locale-provider";
import type { DocType } from "@/domain/types";

export default function PreviewDocPage() {
  const { docType } = useParams<{ docType: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { documents, clear } = useDocuments();
  const [confirm, setConfirm] = useState(false);
  const dt = docType as DocType;
  const doc = documents[dt];
  if (!doc) {
    return (
      <PageShell title={t("documents.preview")} showBack showTabs={false} size="medium" variant="compact">
        <Card padded>
          <CardTitle>{t("documents.uploadTitle")}</CardTitle>
          <CardSubtitle>This document hasn't been uploaded yet.</CardSubtitle>
          <Button className="mt-3" onClick={() => router.push(`/documents/upload/${dt}`)}>{t("documents.uploadTitle")}</Button>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell title={t("documents.previewTitle")} showBack showTabs={false} size="medium" variant="compact">
      <Card padded>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-card bg-brand-50 text-brand"><FileText size={20} /></div>
            <div>
              <CardTitle>{t(`documents.${dt}`)}</CardTitle>
              <CardSubtitle>{doc.fileName}</CardSubtitle>
              <div className="mt-1 text-[12px] text-ink-subtle">{doc.sizeKb} KB · {doc.source === "digilocker" ? "DigiLocker" : "Device"}</div>
            </div>
          </div>
          <Badge tone={doc.status === "rejected" ? "danger" : doc.status === "verified" ? "success" : "info"} dot>
            {t(`documents.${doc.status}`)}
          </Badge>
        </div>
      </Card>

      <div className="mt-3 aspect-[3/4] rounded-card bg-line-subtle/70 ring-1 ring-line flex items-center justify-center text-ink-subtle text-[13px]">
        Document preview
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="outline" leadingIcon={<RefreshCw size={14} />} onClick={() => setConfirm(true)}>{t("documents.replace")}</Button>
        <Button onClick={() => router.push("/profile/step/4")}>{t("common.continue")}</Button>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={t("documents.replaceConfirm")}
        tone="warning"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>{t("common.cancel")}</Button>
            <Button variant="primary" onClick={() => { clear(dt); router.push(`/documents/upload/${dt}`); }}>{t("documents.replace")}</Button>
          </>
        }
      >
        Replacing will remove the current upload before you upload the new one.
      </Modal>
    </PageShell>
  );
}
