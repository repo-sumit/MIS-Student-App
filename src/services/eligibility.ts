import { OFFERINGS } from "@/domain/fixtures";
import type {
  CourseOffering,
  EligibilityVerdict,
  ProfileDraft
} from "@/domain/types";

export function evaluateOne(profile: ProfileDraft | null, offering: CourseOffering): EligibilityVerdict {
  const reasons: string[] = [];
  if (!profile || !profile.completedSteps.includes(3)) {
    return { status: "conditional", reasons: ["Complete academic details to confirm eligibility"] };
  }

  // Stream gate
  if (offering.stream !== "any") {
    if (offering.stream === "arts" && !["arts", "commerce", "science-pcm", "science-pcb"].includes(profile.stream)) {
      reasons.push("Open to all Class 12 streams");
    }
    if ((offering.stream === "science-pcm" || offering.stream === "science-pcb")) {
      if (profile.stream === "arts" || profile.stream === "commerce") {
        reasons.push("Class 12 Science background required");
        return { status: "not_eligible", reasons };
      }
      if (offering.stream === "science-pcm" && profile.stream !== "science-pcm") {
        reasons.push("PCM background required");
        return { status: "not_eligible", reasons };
      }
      if (offering.stream === "science-pcb" && profile.stream !== "science-pcb") {
        reasons.push("PCB background required");
        return { status: "not_eligible", reasons };
      }
    }
    if (offering.stream === "commerce" && profile.stream !== "commerce" && profile.stream !== "arts") {
      reasons.push("Commerce background preferred");
    }
  }

  // Marks gate
  const marks = parseFloat(profile.bestOfFive || "0");
  if (Number.isNaN(marks) || marks <= 0) {
    return { status: "conditional", reasons: ["Confirm best-of-five percentage in profile"] };
  }
  if (marks < offering.minMarks) {
    return { status: "not_eligible", reasons: [`Minimum ${offering.minMarks}% required (you have ${marks}%)`] };
  }
  if (marks - offering.minMarks < 5) {
    reasons.push(`Just above the ${offering.minMarks}% cutoff`);
  }

  // Result status
  if (profile.resultStatus === "compartment") {
    return { status: "conditional", reasons: ["Compartment result must be cleared before final admission"] };
  }
  if (profile.resultStatus === "awaited") {
    return { status: "conditional", reasons: ["Confirm result once Class 12 board declares"] };
  }

  // Domicile note (informational only)
  if (profile.domicile === "non-hp") {
    reasons.push("Non-HP domicile — limited seats apply");
  }

  return { status: "eligible", reasons };
}

export function evaluateAll(profile: ProfileDraft | null): { offering: CourseOffering; verdict: EligibilityVerdict }[] {
  return OFFERINGS.map((o) => ({ offering: o, verdict: evaluateOne(profile, o) }));
}

export function eligibleOfferings(profile: ProfileDraft | null) {
  return evaluateAll(profile).filter((e) => e.verdict.status !== "not_eligible");
}
