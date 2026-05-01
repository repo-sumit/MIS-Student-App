"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Smartphone, ShieldCheck, Upload } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/providers/documents-provider";
import { useToast } from "@/providers/toast-provider";
import { useLocale } from "@/providers/locale-provider";
import type { DocType } from "@/domain/types";

const VALID: DocType[] = ["photo", "signature", "class10", "class12", "domicile", "category", "pwd", "sgc", "bank"];

export default function UploadDocPage() {
  const { docType } = useParams<{ docType: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { upload } = useDocuments();
  const toast = useToast();
  const [busy, setBusy] = useState<"none" | "digi" | "device">("none");
  const dt = (VALID.includes(docType as DocType) ? docType : "photo") as DocType;

  function fromDigi() {
    setBusy("digi");
    setTimeout(() => {
      upload(dt, { fileName: `digilocker-${dt}.pdf`, source: "digilocker", sizeKb: 184 });
      toast.success(t("documents.uploadSuccess"));
      router.push(`/documents/preview/${dt}`);
    }, 1400);
  }

  function fromDevice(file: File) {
    setBusy("device");
    setTimeout(() => {
      upload(dt, { fileName: file.name, source: "device", sizeKb: Math.max(40, Math.round(file.size / 1024)) });
      toast.success(t("documents.uploadSuccess"));
      router.push(`/documents/preview/${dt}`);
    }, 700);
  }

  return (
    <PageShell title={t(`documents.${dt}`)} showBack showTabs={false} size="medium" variant="compact">
      <Card padded>
        <CardTitle>{t("documents.uploadTitle")}</CardTitle>
        <CardSubtitle>{t(`documents.${dt}`)}</CardSubtitle>
      </Card>

      <button onClick={fromDigi} className="mt-3 block w-full text-left rounded-card border-[1.5px] border-brand bg-white px-4 py-4 hover:bg-brand-50/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50 text-brand"><ShieldCheck size={18} /></div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-ink">{t("documents.uploadDigilocker")}</div>
            <div className="text-[12px] text-ink-muted">{t("documents.uploadDigilockerSub")}</div>
          </div>
          {busy === "digi" && <Loader2 className="animate-spin text-brand" size={18} />}
        </div>
      </button>

      <label className="mt-2 block w-full text-left rounded-card border border-line bg-white px-4 py-4 hover:border-brand-200 cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-card bg-info-subtle text-info-ink"><Smartphone size={18} /></div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-ink">{t("documents.uploadDevice")}</div>
            <div className="text-[12px] text-ink-muted">{t("documents.uploadDeviceSub")}</div>
          </div>
          {busy === "device" ? <Loader2 className="animate-spin text-brand" size={18} /> : <Upload size={16} className="text-ink-muted" />}
        </div>
        <input
          type="file"
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) fromDevice(f);
          }}
        />
      </label>

      {busy === "digi" && (
        <Card padded className="mt-3">
          <div className="flex items-center gap-2 text-[13px] text-ink-muted">
            <Loader2 className="animate-spin text-brand" size={14} />
            {t("documents.fetching")}
          </div>
        </Card>
      )}
    </PageShell>
  );
}
