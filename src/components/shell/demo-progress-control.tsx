"use client";

import { useState } from "react";
import { Sparkles, RotateCcw, ChevronRight } from "lucide-react";
import { useDemoProgress } from "@/providers/demo-progress-provider";
import { useEffectiveStudentStep } from "@/providers/use-effective-step";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useLocale } from "@/providers/locale-provider";
import { useToast } from "@/providers/toast-provider";
import { DEMO_STAGE_ORDER } from "@/services/status";
import type { DemoStage, StatusStep } from "@/domain/types";

const TRANSITION_MODE: Record<DemoStage, "toast" | "modal"> = {
  submitted: "toast",
  underScrutiny: "toast",
  meritPublished: "modal",
  allotted: "modal",
  admissionConfirmed: "modal"
};

const MODAL_COPY: Record<DemoStage, { title: string; body: string; confirm: string }> = {
  submitted: { title: "", body: "", confirm: "" },
  underScrutiny: { title: "", body: "", confirm: "" },
  meritPublished: { title: "Scrutiny completed", body: "Publish the provisional merit list now?", confirm: "Publish merit" },
  allotted: { title: "Seat available", body: "A seat is available in the student's first preference.", confirm: "Proceed with allotment" },
  admissionConfirmed: { title: "Mark fee received", body: "Confirm that the admission fee has been received and finalize admission.", confirm: "Mark fee received" }
};

const TOAST_COPY: Record<DemoStage, string> = {
  submitted: "Application submitted for this cycle.",
  underScrutiny: "Application moved to the college scrutiny queue.",
  meritPublished: "Merit list published.",
  allotted: "Seat offer sent.",
  admissionConfirmed: "Admission confirmed."
};

export function DemoProgressControl() {
  const { setStage, reset } = useDemoProgress();
  const { step: effective, isDemo } = useEffectiveStudentStep();
  const { t } = useLocale();
  const toast = useToast();
  const [modalStage, setModalStage] = useState<DemoStage | null>(null);

  const computedNext: DemoStage | undefined = (() => {
    const e = effective as StatusStep;
    const eIdx = DEMO_STAGE_ORDER.indexOf(e as DemoStage);
    if (eIdx >= 0) return DEMO_STAGE_ORDER[eIdx + 1];
    if (e === "registered" || e === "profileComplete") return "submitted";
    return undefined;
  })();

  const isComplete = effective === "admissionConfirmed";
  const stageLabel = (s: StatusStep) => t(`stages.${s}`);

  function trigger(target: DemoStage) {
    if (TRANSITION_MODE[target] === "modal") {
      setModalStage(target);
    } else {
      setStage(target);
      toast.success(TOAST_COPY[target]);
    }
  }

  return (
    <div className="rounded-card bg-white ring-1 ring-line shadow-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-eyebrow text-brand-400">
            <Sparkles size={12} className="text-brand" />
            {t("dashboard.operator.eyebrow")}
          </div>
          <p className="mt-1 text-[12.5px] text-ink-subtle leading-snug">{t("dashboard.operator.subtitle")}</p>
        </div>
        {isDemo && <Badge tone="brand" dot>{t("dashboard.operator.badge")}</Badge>}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-card bg-surface-app/70 px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{t("dashboard.operator.current")}</div>
          <div className="mt-0.5 text-[13px] font-bold text-ink">{stageLabel(effective)}</div>
        </div>
        <div className="rounded-card bg-surface-app/70 px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-subtle">{t("dashboard.operator.next")}</div>
          <div className="mt-0.5 text-[13px] font-bold text-ink">
            {isComplete ? "—" : computedNext ? stageLabel(computedNext) : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          block
          variant="primary"
          size="md"
          disabled={isComplete || !computedNext}
          onClick={() => computedNext && trigger(computedNext)}
          trailingIcon={<ChevronRight size={16} />}
        >
          {isComplete
            ? t("dashboard.operator.complete")
            : computedNext
            ? t("dashboard.operator.advance", { stage: stageLabel(computedNext) })
            : t("dashboard.operator.complete")}
        </Button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center gap-1.5 rounded-pill px-3 text-[12px] font-semibold text-ink-muted hover:bg-line-subtle"
        >
          <RotateCcw size={14} /> {t("dashboard.operator.reset")}
        </button>
      </div>

      <Modal
        open={modalStage !== null}
        onClose={() => setModalStage(null)}
        title={modalStage ? MODAL_COPY[modalStage].title : ""}
        tone="success"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalStage(null)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                if (modalStage) {
                  setStage(modalStage);
                  toast.success(TOAST_COPY[modalStage]);
                }
                setModalStage(null);
              }}
            >
              {modalStage ? MODAL_COPY[modalStage].confirm : ""}
            </Button>
          </>
        }
      >
        {modalStage ? MODAL_COPY[modalStage].body : null}
      </Modal>
    </div>
  );
}
