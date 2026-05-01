import type {
  AllocationEntry,
  ApplicationDraft,
  DemoStage,
  EffectiveStudentStep,
  ProfileDraft,
  StatusStep
} from "@/domain/types";

export const STATUS_STEP_ORDER: StatusStep[] = [
  "registered",
  "profileComplete",
  "submitted",
  "underScrutiny",
  "meritPublished",
  "allotted",
  "admissionConfirmed"
];

export const DEMO_STAGE_ORDER: DemoStage[] = [
  "submitted",
  "underScrutiny",
  "meritPublished",
  "allotted",
  "admissionConfirmed"
];

export function nextStageAfter(stage: DemoStage | StatusStep | undefined): DemoStage | undefined {
  if (!stage) return "submitted";
  const idx = DEMO_STAGE_ORDER.indexOf(stage as DemoStage);
  if (idx < 0) return "submitted";
  if (idx >= DEMO_STAGE_ORDER.length - 1) return undefined;
  return DEMO_STAGE_ORDER[idx + 1];
}

export function hasEnoughProfile(p: ProfileDraft | null | undefined): boolean {
  if (!p) return false;
  if (!p.fullName?.trim()) return false;
  if (!p.dob) return false;
  if (!p.mobile?.trim()) return false;
  if (!p.email?.trim()) return false;
  if (!p.address?.trim()) return false;
  if (!p.district) return false;
  if (!p.pincode?.trim()) return false;
  if (!p.board?.trim()) return false;
  if (!p.passingYear?.trim()) return false;
  if (!p.stream) return false;
  if (!p.bestOfFive?.trim()) return false;
  if (!p.category) return false;
  if (!p.domicile) return false;
  return p.completedSteps.includes(4);
}

export function isProfileFullyComplete(p: ProfileDraft | null | undefined): boolean {
  if (!p) return false;
  return hasEnoughProfile(p) && p.completedSteps.includes(5);
}

export function deriveRealStep(args: {
  applications: ApplicationDraft[];
  profile: ProfileDraft | null;
  allocation?: AllocationEntry | null;
  meritPublished?: boolean;
  underScrutiny?: boolean;
}): StatusStep {
  const { applications, profile, allocation, meritPublished, underScrutiny } = args;

  if (allocation?.status === "fee_paid" || allocation?.status === "admission_confirmed") {
    return "admissionConfirmed";
  }
  if (allocation && (allocation.status === "pending" || allocation.status === "freeze" || allocation.status === "float" || allocation.status === "decline" || allocation.status === "auto_cancelled")) {
    return "allotted";
  }
  if (meritPublished) return "meritPublished";
  if (underScrutiny) return "underScrutiny";

  const submitted = applications.find((a) => a.status === "submitted");
  if (submitted) return "submitted";

  if (hasEnoughProfile(profile)) return "profileComplete";
  return "registered";
}

export function getEffectiveStudentStep(args: {
  applications: ApplicationDraft[];
  profile: ProfileDraft | null;
  allocation?: AllocationEntry | null;
  meritPublished?: boolean;
  underScrutiny?: boolean;
  demoStage?: DemoStage;
}): EffectiveStudentStep {
  const realStep = deriveRealStep(args);
  const step = (args.demoStage ?? realStep) as StatusStep;
  const firstSubmitted = args.applications.find((a) => a.status === "submitted");
  return {
    realStep,
    step,
    isDemo: Boolean(args.demoStage),
    firstSubmittedCourseId: firstSubmitted?.courseId,
    firstApplicationNumber: firstSubmitted?.applicationNumber,
    firstAllocation: args.allocation ?? undefined,
    firstMeritPublished: args.meritPublished
  };
}

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `HPU/${year}/${seq}`;
}

export function generateRollNumber(collegeCode: string, rank: number): string {
  const year = new Date().getFullYear();
  return `${collegeCode}/${year}/${String(rank).padStart(4, "0")}`;
}

export const DEMO_RANK = 47;
export const DEMO_BOF = 87.4;
