"use client";

import { useMemo } from "react";
import { useApplications } from "./applications-provider";
import { useProfile } from "./profile-provider";
import { useAllotmentBridge, useScrutinyBridge } from "./bridge-providers";
import { useDemoProgress } from "./demo-progress-provider";
import { getEffectiveStudentStep } from "@/services/status";
import { buildDemoAllocation } from "@/services/allocation";
import type { EffectiveStudentStep } from "@/domain/types";

export function useEffectiveStudentStep(): EffectiveStudentStep {
  const { list, applications } = useApplications();
  const { profile } = useProfile();
  const { allocations, merit } = useAllotmentBridge();
  const { scrutiny } = useScrutinyBridge();
  const { stage } = useDemoProgress();

  return useMemo(() => {
    const firstSubmitted = list.find((a) => a.status === "submitted");
    const courseId = firstSubmitted?.courseId;
    const realAllocation = courseId ? allocations[courseId] : undefined;
    const meritPublished = courseId ? merit[courseId] === true : false;
    const underScrutiny = courseId ? scrutiny[courseId]?.underReview === true : false;

    const baseEff = getEffectiveStudentStep({
      applications: list,
      profile,
      allocation: realAllocation,
      meritPublished,
      underScrutiny,
      demoStage: stage
    });

    // Synthesize allocation when demo forces allotted/admissionConfirmed without real one
    if (!realAllocation && (baseEff.step === "allotted" || baseEff.step === "admissionConfirmed") && firstSubmitted) {
      const demoAlloc = buildDemoAllocation({
        application: firstSubmitted,
        profile,
        forStep: baseEff.step
      });
      return { ...baseEff, firstAllocation: demoAlloc };
    }

    return baseEff;
  }, [applications, list, profile, allocations, merit, scrutiny, stage]);
}
