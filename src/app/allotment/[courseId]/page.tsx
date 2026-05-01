"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/shell/page-shell";
import { Card, CardDivider, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useLocale } from "@/providers/locale-provider";
import { useApplications } from "@/providers/applications-provider";
import { useAllocation } from "@/providers/allocation-provider";
import { useProfile } from "@/providers/profile-provider";
import { useToast } from "@/providers/toast-provider";
import { feeBreakup, formatINR } from "@/services/fee";
import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import { createAllocationEntry, lifecycleOf } from "@/services/lifecycle";

export default function AllotmentPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t, pick } = useLocale();
  const { applications, markAllocationCreated, acknowledgeMerit } = useApplications();
  const { allocations, setAllocation, respond } = useAllocation();
  const { profile } = useProfile();
  const toast = useToast();
  const [confirmDecline, setConfirmDecline] = useState(false);

  const application = courseId ? applications[courseId] : undefined;
  const allocation = courseId ? allocations[courseId] : undefined;
  const offering = OFFERINGS.find((o) => o.id === courseId);

  // Auto-create allocation when student arrives here after merit publication.
  useEffect(() => {
    if (!application || !courseId) return;
    if (allocation) return;
    const life = lifecycleOf(application);
    if (life === "meritPublished" || life === "verified" || life === "conditionallyVerified") {
      const entry = createAllocationEntry({ application, profile });
      if (entry) {
        setAllocation(courseId, entry);
        if (!application.meritViewedAt) acknowledgeMerit(courseId);
        markAllocationCreated(courseId);
      }
    }
  }, [application, allocation, courseId, profile, setAllocation, acknowledgeMerit, markAllocationCreated]);

  if (!offering) {
    return (
      <PageShell title={t("errors.notFoundTitle")} showBack showTabs={false} size="medium" variant="compact">
        <Card padded>
          <CardTitle>{t("errors.notFoundTitle")}</CardTitle>
          <CardSubtitle>{t("errors.notFoundBody")}</CardSubtitle>
        </Card>
      </PageShell>
    );
  }

  // Waiting state — submitted but no allocation yet.
  if (!allocation) {
    return (
      <PageShell title={t("allotment.waitingTitle")} showBack showTabs={false} size="medium" variant="compact">
        <Card padded>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-card bg-info-subtle text-info-ink"><AlertTriangle size={18} /></div>
            <div>
              <CardTitle>{t("allotment.waitingTitle")}</CardTitle>
              <CardSubtitle>{t("allotment.waitingBody")}</CardSubtitle>
            </div>
          </div>
        </Card>
      </PageShell>
    );
  }

  const college = COLLEGES.find((c) => c.id === allocation.offer.collegeId);
  const breakup = allocation.feeBreakup || feeBreakup(allocation.offer.feeAmount);
  const total = breakup.reduce((s, b) => s + b.amount, 0);

  function freeze() {
    if (!courseId) return;
    respond(courseId, "freeze");
    toast.success(t("allotment.frozenBanner"));
    router.push(`/payment/${courseId}`);
  }

  function float() {
    if (!courseId) return;
    respond(courseId, "float");
    toast.info(t("allotment.floatBanner"));
    router.push("/dashboard");
  }

  function decline() {
    if (!courseId) return;
    setConfirmDecline(false);
    respond(courseId, "decline");
    toast.warn(t("allotment.declineBanner"));
    router.push("/dashboard");
  }

  const banner = (() => {
    if (allocation.status === "freeze") return { tone: "success", text: t("allotment.frozenBanner") };
    if (allocation.status === "float") return { tone: "warning", text: t("allotment.floatBanner") };
    if (allocation.status === "decline" || allocation.status === "auto_cancelled") return { tone: "danger", text: t("allotment.declineBanner") };
    if (allocation.status === "fee_paid") return { tone: "success", text: t("allotment.feePaidBanner") };
    if (allocation.status === "admission_confirmed") return { tone: "success", text: t("allotment.confirmedBanner") };
    return null;
  })();

  return (
    <PageShell title={t("allotment.title")} showBack showTabs={false} size="medium" variant="compact">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-hero bg-gradient-to-br from-success to-[#02953C] text-white shadow-card p-5 sm:p-6"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] font-bold text-white/85">
            <Award size={12} /> {t("stages.allotted")}
          </div>
          <h1 className="mt-1 text-[22px] font-bold leading-snug">{t("allotment.title")}</h1>
          <p className="mt-1 text-[13.5px] text-white/85">{t("allotment.subtitle")}</p>
          <div className="mt-4 rounded-card bg-white/15 px-3 py-2.5 backdrop-blur">
            <div className="text-[10px] uppercase tracking-wider font-bold text-white/80">College</div>
            <div className="text-[15px] font-bold leading-snug">{pick(allocation.offer.collegeName)}</div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-[12px]">
            <div className="rounded-card bg-white/15 px-2.5 py-2 backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75">{t("allotment.rankLabel")}</div>
              <div className="font-bold">#{allocation.rank}</div>
            </div>
            <div className="rounded-card bg-white/15 px-2.5 py-2 backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75">{t("allotment.feeLabel")}</div>
              <div className="font-bold">{formatINR(allocation.offer.feeAmount)}</div>
            </div>
            <div className="rounded-card bg-white/15 px-2.5 py-2 backdrop-blur">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-white/75">{t("allotment.deadlineLabel")}</div>
              <div className="font-bold">4 days</div>
            </div>
          </div>
        </div>
      </motion.div>

      {banner && (
        <Card padded className={
          "mt-3 ring-1 " +
          (banner.tone === "success"
            ? "ring-success/20 bg-success-subtle"
            : banner.tone === "warning"
            ? "ring-warning/20 bg-warning-subtle"
            : "ring-danger/20 bg-danger-subtle")
        }>
          <div className={
            "text-[13px] font-semibold " +
            (banner.tone === "success" ? "text-success-ink" : banner.tone === "warning" ? "text-warning-ink" : "text-danger-ink")
          }>
            {banner.text}
          </div>
        </Card>
      )}

      <Card padded className="mt-3">
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
          <span className="text-[16px] font-bold text-ink">{formatINR(total)}</span>
        </div>
      </Card>

      {allocation.status === "pending" && (
        <div className="mt-3 space-y-2">
          <Button block size="lg" onClick={freeze} leadingIcon={<CheckCircle2 size={16} />}>{t("allotment.freeze")}</Button>
          <Button block variant="outline" onClick={float}>{t("allotment.float")}</Button>
          <Button block variant="ghost" onClick={() => setConfirmDecline(true)}>{t("allotment.decline")}</Button>
        </div>
      )}

      {allocation.status === "freeze" && courseId && (
        <Button block size="lg" className="mt-3" onClick={() => router.push(`/payment/${courseId}`)} trailingIcon={<ChevronRight size={16} />}>
          {t("payment.title")}
        </Button>
      )}

      <Modal
        open={confirmDecline}
        onClose={() => setConfirmDecline(false)}
        tone="danger"
        title={t("allotment.declineConfirmTitle")}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDecline(false)}>{t("allotment.declineNo")}</Button>
            <Button variant="danger" onClick={decline}>{t("allotment.declineYes")}</Button>
          </>
        }
      >
        {t("allotment.declineConfirmBody")}
      </Modal>
    </PageShell>
  );
}
