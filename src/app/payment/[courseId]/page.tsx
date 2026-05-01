"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShieldCheck, FileText, Trophy, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardDivider, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/providers/locale-provider";
import { useApplications } from "@/providers/applications-provider";
import { useAllocation } from "@/providers/allocation-provider";
import { useToast } from "@/providers/toast-provider";
import { COLLEGES } from "@/domain/fixtures";
import { feeBreakup, formatINR } from "@/services/fee";
import { generateRollNumber } from "@/services/status";

type Stage = "confirm" | "paying" | "success";

export default function PaymentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t, pick } = useLocale();
  const { allocations, setAllocation, setRollNumber } = useAllocation();
  const { markFeePaid, markAdmissionConfirmed } = useApplications();
  const toast = useToast();
  const allocation = courseId ? allocations[courseId] : undefined;
  const initialStage: Stage = allocation?.status === "admission_confirmed" || allocation?.status === "fee_paid" ? "success" : "confirm";
  const [stage, setStage] = useState<Stage>(initialStage);

  if (!allocation || !courseId) {
    return (
      <PageShell title={t("payment.title")} showBack size="medium" variant="compact" showTabs={false}>
        <Card padded>
          <CardTitle>{t("allotment.waitingTitle")}</CardTitle>
          <CardSubtitle>{t("allotment.waitingBody")}</CardSubtitle>
        </Card>
      </PageShell>
    );
  }
  const college = COLLEGES.find((c) => c.id === allocation.offer.collegeId);
  const breakup = allocation.feeBreakup || feeBreakup(allocation.offer.feeAmount);
  const total = breakup.reduce((s, b) => s + b.amount, 0);

  function pay() {
    setStage("paying");
    setTimeout(() => {
      if (college && courseId) {
        const roll = allocation?.rollNumber || generateRollNumber(college.code, allocation!.rank);
        setAllocation(courseId, { ...allocation!, status: "fee_paid", feeBreakup: breakup, rollNumber: roll });
        setRollNumber(courseId, roll);
        markFeePaid(courseId);
        markAdmissionConfirmed(courseId);
      }
      toast.success(t("payment.successTitle"));
      setStage("success");
    }, 1100);
  }

  return (
    <PageShell title={t("payment.title")} showBack showTabs={false} size="medium" variant="compact">
      <AnimatePresence mode="wait">
        {stage === "confirm" && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <Card padded>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-card bg-brand-50 text-brand"><ShieldCheck size={18} /></div>
                <div className="min-w-0">
                  <CardTitle>{college ? pick(college.name) : t("payment.title")}</CardTitle>
                  <CardSubtitle>{t("payment.secure")}</CardSubtitle>
                </div>
              </div>
            </Card>

            <Card padded>
              <CardTitle>{t("payment.feeBreakup")}</CardTitle>
              <ul className="mt-3 divide-y divide-line-subtle">
                {breakup.map((b, i) => (
                  <li key={i} className="py-2 flex items-center justify-between text-[13px]">
                    <span className="text-ink-muted">{pick(b.label)}</span>
                    <span className="font-semibold text-ink">{formatINR(b.amount)}</span>
                  </li>
                ))}
              </ul>
              <CardDivider />
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-ink">{t("payment.total")}</span>
                <span className="text-[18px] font-bold text-ink">{formatINR(total)}</span>
              </div>
            </Card>

            <Button block size="lg" onClick={pay}>{t("payment.pay", { amount: formatINR(total) })}</Button>
          </motion.div>
        )}

        {stage === "paying" && (
          <motion.div key="paying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-12">
            <div className="flex flex-col items-center text-center">
              <Loader2 className="animate-spin text-brand" size={32} />
              <h2 className="mt-3 text-[16px] font-bold text-ink">{t("payment.processing")}</h2>
              <p className="text-[12.5px] text-ink-muted mt-1">{t("payment.secure")}</p>
            </div>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
            <div className="relative overflow-hidden rounded-hero bg-gradient-to-br from-success to-[#02953C] text-white shadow-card p-5">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
              <Trophy size={28} className="text-white" />
              <h1 className="mt-3 text-[22px] font-bold leading-tight">{t("payment.successTitle")}</h1>
              <p className="mt-1 text-[13.5px] text-white/85">{t("payment.successBody", { college: college ? pick(college.name) : "" })}</p>
              <div className="mt-4 rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
                <div className="text-[10px] font-bold uppercase tracking-wider text-white/80">{t("payment.rollNumber")}</div>
                <div className="text-[18px] font-bold tracking-wider">{allocation.rollNumber || "—"}</div>
              </div>
            </div>

            <Card padded>
              <CardTitle>What's next</CardTitle>
              <CardSubtitle>{t("payment.orientation")}</CardSubtitle>
            </Card>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                leadingIcon={<FileText size={14} />}
                onClick={() => toast.info(t("payment.downloadReceipt"), "A signed copy will be sent to your registered email.")}
              >
                {t("payment.downloadReceipt")}
              </Button>
              <Button
                variant="outline"
                leadingIcon={<Trophy size={14} />}
                onClick={() => toast.info(t("payment.downloadLetter"), "A signed copy will be sent to your registered email.")}
              >
                {t("payment.downloadLetter")}
              </Button>
            </div>
            <Link href="/dashboard"><Button block leadingIcon={<ChevronLeft size={14} />}>{t("payment.back")}</Button></Link>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
