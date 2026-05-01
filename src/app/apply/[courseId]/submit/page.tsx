"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { ApplyShell } from "@/components/apply/apply-shell";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";
import { applicationFee, formatINR } from "@/services/fee";

type Stage = "confirm" | "processing" | "success" | "failure" | "pending";

export default function SubmitPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { applications, submit } = useApplications();
  const [stage, setStage] = useState<Stage>("confirm");
  const draft = courseId ? applications[courseId] : undefined;

  function pay() {
    setStage("processing");
    setTimeout(() => {
      const r = Math.random();
      if (r < 0.85) {
        if (courseId) submit(courseId);
        setStage("success");
      } else if (r < 0.95) {
        setStage("pending");
      } else {
        setStage("failure");
      }
    }, 1200);
  }

  useEffect(() => {
    if (stage === "success" && courseId) {
      const id = setTimeout(() => router.push(`/apply/${courseId}/submitted`), 1100);
      return () => clearTimeout(id);
    }
  }, [stage, courseId, router]);

  if (!draft) return null;

  return (
    <ApplyShell step={5} title={t("apply.submitTitle")} subtitle={t("apply.submitSubtitle")}>
      <AnimatePresence mode="wait">
        {stage === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card padded>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50 text-brand"><ShieldCheck size={18} /></div>
                <div className="min-w-0 flex-1">
                  <CardTitle>{t("payment.secure")}</CardTitle>
                  <CardSubtitle>State payment gateway</CardSubtitle>
                </div>
              </div>
              <div className="mt-4 rounded-card bg-line-subtle/60 px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-ink-muted">{t("apply.reviewFee")}</span>
                  <span className="text-[18px] font-bold text-ink">{formatINR(applicationFee())}</span>
                </div>
              </div>
              <Button block size="lg" className="mt-4" onClick={pay}>
                {t("payment.pay", { amount: formatINR(applicationFee()) })}
              </Button>
            </Card>
          </motion.div>
        )}

        {stage === "processing" && (
          <motion.div key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card padded>
              <div className="flex flex-col items-center text-center py-6">
                <Loader2 className="animate-spin text-brand" size={28} />
                <h2 className="mt-3 text-[16px] font-bold text-ink">{t("apply.submitProcessing")}</h2>
                <p className="text-[12.5px] text-ink-muted mt-1">Do not close this page.</p>
              </div>
            </Card>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card padded>
              <div className="flex flex-col items-center text-center py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle text-success">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="mt-3 text-[18px] font-bold text-ink">{t("apply.submitSuccess")}</h2>
                <p className="text-[12.5px] text-ink-muted mt-1">Redirecting…</p>
              </div>
            </Card>
          </motion.div>
        )}

        {stage === "failure" && (
          <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card padded>
              <div className="flex flex-col items-center text-center py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-subtle text-danger">
                  <XCircle size={28} />
                </div>
                <h2 className="mt-3 text-[16px] font-bold text-ink">{t("apply.submitFailureTitle")}</h2>
                <p className="text-[12.5px] text-ink-muted mt-1 max-w-[280px]">{t("apply.submitFailureBody")}</p>
                <Button className="mt-4" onClick={() => setStage("confirm")}>{t("apply.tryAgain")}</Button>
              </div>
            </Card>
          </motion.div>
        )}

        {stage === "pending" && (
          <motion.div key="pend" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card padded>
              <div className="flex flex-col items-center text-center py-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-subtle text-warning">
                  <AlertTriangle size={28} />
                </div>
                <h2 className="mt-3 text-[16px] font-bold text-ink">{t("apply.submitPendingTitle")}</h2>
                <p className="text-[12.5px] text-ink-muted mt-1 max-w-[280px]">{t("apply.submitPendingBody")}</p>
                <Button className="mt-4" onClick={() => setStage("confirm")}>{t("apply.tryAgain")}</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </ApplyShell>
  );
}
