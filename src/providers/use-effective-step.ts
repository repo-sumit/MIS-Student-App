"use client";

import { useMemo } from "react";
import { useApplications } from "./applications-provider";
import { useProfile } from "./profile-provider";
import { useAllocation } from "./allocation-provider";
import { getEffectiveStudentStep } from "@/services/lifecycle";
import type { EffectiveStudentStep } from "@/domain/types";

export function useEffectiveStudentStep(): EffectiveStudentStep {
  const { list, applications } = useApplications();
  const { profile } = useProfile();
  const { allocations } = useAllocation();

  return useMemo(
    () => getEffectiveStudentStep({ profile, applications: list, allocations }),
    [list, applications, profile, allocations]
  );
}
