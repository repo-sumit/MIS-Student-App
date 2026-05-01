import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import type {
  AllocationEntry,
  ApplicationDraft,
  Category,
  ProfileDraft
} from "@/domain/types";
import { feeBreakup } from "./fee";
import { DEMO_BOF, DEMO_RANK, generateRollNumber } from "./status";

function deriveDeadline(): string {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toISOString();
}

export function buildDemoAllocation(args: {
  application: ApplicationDraft | undefined;
  profile: ProfileDraft | null;
  forStep: "allotted" | "admissionConfirmed";
}): AllocationEntry | undefined {
  if (!args.application) return undefined;
  const top = args.application.preferences[0];
  const college = COLLEGES.find((c) => c.id === (top?.collegeId ?? args.application?.collegeId));
  const offering = OFFERINGS.find((o) => o.id === args.application?.courseId);
  if (!college || !offering) return undefined;

  const category: Category = (args.profile?.category as Category) || "general";
  const fee = offering.feeAmount;
  const breakup = feeBreakup(fee);
  const baseEntry: AllocationEntry = {
    rank: DEMO_RANK,
    bofPercentage: DEMO_BOF,
    category,
    offer: {
      courseId: offering.id,
      collegeId: college.id,
      collegeName: college.name,
      combinationLabel: undefined,
      feeAmount: fee
    },
    status: args.forStep === "admissionConfirmed" ? "admission_confirmed" : "pending",
    offeredAt: new Date().toISOString(),
    feeBreakup: breakup
  };

  if (args.forStep === "admissionConfirmed") {
    baseEntry.respondedAt = new Date().toISOString();
    baseEntry.rollNumber = generateRollNumber(college.code, DEMO_RANK);
  } else {
    // Add a deadline copy via offeredAt + 4 days; UI will compute display
    baseEntry.offeredAt = deriveDeadline();
  }
  return baseEntry;
}
