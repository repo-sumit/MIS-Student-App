import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import type {
  AllocationEntry,
  ApplicationDraft,
  ApplicationLifecycle,
  Category,
  DocType,
  EffectiveStudentStep,
  ProfileDraft,
  ScrutinyOutcome,
  StatusStep,
  TimelineEntry
} from "@/domain/types";
import { feeBreakup } from "./fee";
import { generateRollNumber, hasEnoughProfile } from "./status";

export const STATUS_STEP_ORDER: StatusStep[] = [
  "registered",
  "profileComplete",
  "submitted",
  "underScrutiny",
  "meritPublished",
  "allotted",
  "admissionConfirmed"
];

// --- Timing for the local progression engine (ms) ---
export const TIMINGS = {
  /** Time after submission until scrutiny visibly starts. */
  scrutinyStartDelayMs: 6_000,
  /** Time from scrutinyStartedAt until an outcome is decided. */
  scrutinyOutcomeDelayMs: 14_000,
  /** Time from verifiedAt until merit is published for the application. */
  meritPublishDelayMs: 8_000
};

// --- Deterministic scrutiny outcome ---
function fingerprint(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h;
}

const POSSIBLE_DISCREPANCY_DOCS: DocType[] = ["class12", "domicile", "photo", "category"];
const DISCREPANCY_REASONS: Record<DocType, string> = {
  class12: "Class 12 marksheet image is unclear. Please upload a sharper copy.",
  domicile: "Domicile certificate name does not match the profile. Re-upload the correct document.",
  photo: "Profile photo does not meet specifications. Upload a recent passport-size photograph.",
  category: "Category certificate validity has expired. Upload an in-date certificate.",
  signature: "Signature is illegible. Upload a clearer signature image.",
  class10: "Class 10 certificate scan is incomplete. Upload all pages.",
  pwd: "PwD certificate authority is not recognised. Upload the verified copy.",
  sgc: "Single girl child declaration is missing the seal. Upload the attested copy.",
  bank: "Bank passbook image is blurred. Upload a clearer version."
};

export function pickScrutinyOutcome(applicationNumber: string): ScrutinyOutcome {
  const bucket = fingerprint(applicationNumber) % 100;
  if (bucket < 70) return "verified";
  if (bucket < 90) return "discrepancy";
  return "conditional";
}

export function pickDiscrepancyDoc(applicationNumber: string): DocType {
  const idx = fingerprint(applicationNumber + "doc") % POSSIBLE_DISCREPANCY_DOCS.length;
  return POSSIBLE_DISCREPANCY_DOCS[idx];
}

// --- Lifecycle helpers ---

export function lifecycleOf(app: ApplicationDraft | undefined): ApplicationLifecycle {
  if (!app) return "draft";
  if (app.status === "draft") return "draft";
  if (app.admissionConfirmedAt) return "admissionConfirmed";
  if (app.feePaidAt) return "feePaid";
  if (app.allocationCreatedAt) return "allotted";
  if (app.meritPublishedAt) return "meritPublished";
  if (app.verifiedAt && app.scrutinyOutcome === "conditional") return "conditionallyVerified";
  if (app.verifiedAt) return "verified";
  if (app.discrepancyResolvedAt) return "discrepancyResolved";
  if (app.discrepancy) return "discrepancyRaised";
  if (app.scrutinyStartedAt) return "underScrutiny";
  if (app.submittedAt) return "submitted";
  return "draft";
}

export function deriveMajorTrackerStep(args: {
  profile: ProfileDraft | null;
  applications: ApplicationDraft[];
  allocations: Record<string, AllocationEntry | undefined>;
}): StatusStep {
  const { profile, applications, allocations } = args;
  const submitted = applications.filter((a) => a.status === "submitted");

  // Look at the most-progressed application
  const lifecycles = submitted.map((app) => ({ app, life: lifecycleOf(app) }));

  const isAdmissionConfirmed = lifecycles.some((x) => x.life === "admissionConfirmed");
  if (isAdmissionConfirmed) return "admissionConfirmed";

  const isAllotted = lifecycles.some((x) => x.life === "allotted" || x.life === "feePaid");
  if (isAllotted) return "allotted";

  const merit = lifecycles.some((x) => x.life === "meritPublished");
  if (merit) return "meritPublished";

  const isUnderReview = lifecycles.some((x) =>
    ["underScrutiny", "discrepancyRaised", "discrepancyResolved", "verified", "conditionallyVerified"].includes(x.life)
  );
  if (isUnderReview) return "underScrutiny";

  if (submitted.length > 0) return "submitted";

  if (hasEnoughProfile(profile)) return "profileComplete";
  return "registered";
}

export function getEffectiveStudentStep(args: {
  profile: ProfileDraft | null;
  applications: ApplicationDraft[];
  allocations: Record<string, AllocationEntry | undefined>;
}): EffectiveStudentStep {
  const step = deriveMajorTrackerStep(args);
  const firstSubmitted = args.applications.find((a) => a.status === "submitted");
  const firstAllocation = firstSubmitted ? args.allocations[firstSubmitted.courseId] : undefined;
  return {
    step,
    firstApplication: firstSubmitted,
    firstApplicationNumber: firstSubmitted?.applicationNumber,
    firstSubmittedCourseId: firstSubmitted?.courseId,
    firstAllocation
  };
}

// --- Auto-advance engine ---

export function maybeAdvanceLifecycle(args: {
  applications: ApplicationDraft[];
  now: number;
}): { changes: ApplicationDraft[] } {
  const { applications, now } = args;
  const out: ApplicationDraft[] = [];

  applications.forEach((app) => {
    if (app.status !== "submitted") return;
    let next: ApplicationDraft = app;
    let dirty = false;

    // submitted → underScrutiny
    if (next.submittedAt && !next.scrutinyStartedAt) {
      const ts = new Date(next.submittedAt).getTime();
      if (now - ts >= TIMINGS.scrutinyStartDelayMs) {
        next = { ...next, scrutinyStartedAt: new Date().toISOString() };
        dirty = true;
      }
    }

    // underScrutiny → outcome
    if (next.scrutinyStartedAt && !next.scrutinyOutcome && next.applicationNumber) {
      const ts = new Date(next.scrutinyStartedAt).getTime();
      if (now - ts >= TIMINGS.scrutinyOutcomeDelayMs) {
        const outcome = pickScrutinyOutcome(next.applicationNumber);
        if (outcome === "discrepancy") {
          const doc = pickDiscrepancyDoc(next.applicationNumber);
          const deadline = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
          next = {
            ...next,
            scrutinyOutcome: outcome,
            scrutinyOutcomeAt: new Date().toISOString(),
            discrepancy: {
              docType: doc,
              reason: DISCREPANCY_REASONS[doc],
              raisedAt: new Date().toISOString(),
              deadlineAt: deadline
            }
          };
        } else if (outcome === "verified") {
          next = {
            ...next,
            scrutinyOutcome: outcome,
            scrutinyOutcomeAt: new Date().toISOString(),
            verifiedAt: new Date().toISOString()
          };
        } else {
          // conditional
          next = {
            ...next,
            scrutinyOutcome: outcome,
            scrutinyOutcomeAt: new Date().toISOString(),
            verifiedAt: new Date().toISOString()
          };
        }
        dirty = true;
      }
    }

    // verified (or conditional) → meritPublished
    if (next.verifiedAt && !next.meritPublishedAt) {
      const ts = new Date(next.verifiedAt).getTime();
      if (now - ts >= TIMINGS.meritPublishDelayMs) {
        next = { ...next, meritPublishedAt: new Date().toISOString() };
        dirty = true;
      }
    }

    if (dirty) out.push(next);
  });

  return { changes: out };
}

export function resolveDiscrepancy(app: ApplicationDraft, now = Date.now()): ApplicationDraft {
  const updated: ApplicationDraft = {
    ...app,
    discrepancyResolvedAt: new Date(now).toISOString(),
    discrepancy: undefined,
    // Treat resolution as moving to verified after a short window — done immediately for clarity
    verifiedAt: new Date(now).toISOString()
  };
  return updated;
}

// --- Allocation creation ---

export const DEMO_RANK_DEFAULT = 47;
export const DEMO_BOF_DEFAULT = 87.4;

export function createAllocationEntry(args: {
  application: ApplicationDraft;
  profile: ProfileDraft | null;
}): AllocationEntry | undefined {
  const { application, profile } = args;
  const top = application.preferences[0];
  const college = COLLEGES.find((c) => c.id === (top?.collegeId ?? application.collegeId));
  const offering = OFFERINGS.find((o) => o.id === application.courseId);
  if (!college || !offering) return undefined;

  const rank = DEMO_RANK_DEFAULT;
  const bof = profile?.bestOfFive ? Number(profile.bestOfFive) || DEMO_BOF_DEFAULT : DEMO_BOF_DEFAULT;
  const category: Category = (profile?.category as Category) || "general";
  const fee = offering.feeAmount;

  const responseDeadline = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString();

  return {
    rank,
    bofPercentage: bof,
    category,
    offer: {
      courseId: offering.id,
      collegeId: college.id,
      collegeName: college.name,
      feeAmount: fee
    },
    status: "pending",
    offeredAt: new Date().toISOString(),
    feeBreakup: feeBreakup(fee),
    responseDeadline
  };
}

export function buildAdmissionConfirmation(args: {
  allocation: AllocationEntry;
  collegeCode: string;
}): AllocationEntry {
  const roll = args.allocation.rollNumber || generateRollNumber(args.collegeCode, args.allocation.rank);
  return {
    ...args.allocation,
    status: "admission_confirmed",
    rollNumber: roll
  };
}

// --- Application timeline ---

export function getApplicationTimeline(args: {
  application: ApplicationDraft;
  registeredAt?: string;
  profileCompletedAt?: string;
  allocation?: AllocationEntry;
}): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  const { application, registeredAt, profileCompletedAt, allocation } = args;

  if (registeredAt) entries.push({ kind: "registered", at: registeredAt });
  if (profileCompletedAt) entries.push({ kind: "profileCompleted", at: profileCompletedAt });
  if (application.submittedAt) entries.push({ kind: "submitted", at: application.submittedAt });
  if (application.scrutinyStartedAt) entries.push({ kind: "underScrutiny", at: application.scrutinyStartedAt });
  if (application.discrepancy) {
    entries.push({
      kind: "discrepancyRaised",
      at: application.discrepancy.raisedAt,
      meta: { docType: application.discrepancy.docType, reason: application.discrepancy.reason }
    });
  }
  if (application.discrepancyResolvedAt) entries.push({ kind: "discrepancyResolved", at: application.discrepancyResolvedAt });
  if (application.verifiedAt) entries.push({ kind: "verified", at: application.verifiedAt });
  if (application.meritPublishedAt) entries.push({ kind: "meritPublished", at: application.meritPublishedAt });
  if (application.allocationCreatedAt) entries.push({ kind: "allotted", at: application.allocationCreatedAt });
  if (application.feePaidAt) entries.push({ kind: "feePaid", at: application.feePaidAt });
  if (application.admissionConfirmedAt) entries.push({ kind: "admissionConfirmed", at: application.admissionConfirmedAt });
  // Surface roll number for confirmed entry
  const last = entries[entries.length - 1];
  if (last && last.kind === "admissionConfirmed" && allocation?.rollNumber) {
    last.meta = { ...(last.meta || {}), rollNumber: allocation.rollNumber, collegeId: allocation.offer.collegeId };
  }
  return entries.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

// --- Next action recommendation ---

export type NextActionId =
  | "completeProfile"
  | "discoverCourses"
  | "reviewApplication"
  | "trackScrutiny"
  | "viewReviewStatus"
  | "fixDocument"
  | "checkMerit"
  | "viewMerit"
  | "respondToOffer"
  | "payAdmissionFee"
  | "viewConfirmation"
  | "downloadAdmissionLetter";

export interface NextAction {
  id: NextActionId;
  titleKey: string;
  bodyKey: string;
  ctaKey: string;
  href: string;
  tone: "brand" | "warning" | "success" | "info";
}

export function getNextAction(args: {
  step: StatusStep;
  applications: ApplicationDraft[];
  profile: ProfileDraft | null;
  allocations: Record<string, AllocationEntry | undefined>;
}): NextAction {
  const { step, applications, profile, allocations } = args;

  if (step === "registered") {
    return {
      id: "completeProfile",
      titleKey: "next.completeProfile.title",
      bodyKey: "next.completeProfile.body",
      ctaKey: "next.completeProfile.cta",
      href: "/profile/step/1",
      tone: "brand"
    };
  }

  if (step === "profileComplete") {
    return {
      id: "discoverCourses",
      titleKey: "next.discoverCourses.title",
      bodyKey: "next.discoverCourses.body",
      ctaKey: "next.discoverCourses.cta",
      href: "/discover",
      tone: "brand"
    };
  }

  // Pick first submitted application for context
  const focus = applications.find((a) => a.status === "submitted");

  if (step === "submitted" && focus) {
    return {
      id: "trackScrutiny",
      titleKey: "next.trackScrutiny.title",
      bodyKey: "next.trackScrutiny.body",
      ctaKey: "next.trackScrutiny.cta",
      href: `/applications`,
      tone: "info"
    };
  }

  if (step === "underScrutiny" && focus) {
    if (focus.discrepancy) {
      return {
        id: "fixDocument",
        titleKey: "next.fixDocument.title",
        bodyKey: "next.fixDocument.body",
        ctaKey: "next.fixDocument.cta",
        href: `/documents/rejection/${focus.discrepancy.docType}`,
        tone: "warning"
      };
    }
    return {
      id: "viewReviewStatus",
      titleKey: "next.trackScrutiny.title",
      bodyKey: "next.trackScrutiny.body",
      ctaKey: "next.trackScrutiny.cta",
      href: "/applications",
      tone: "info"
    };
  }

  if (step === "meritPublished" && focus) {
    if (!focus.meritViewedAt) {
      return {
        id: "checkMerit",
        titleKey: "next.checkMerit.title",
        bodyKey: "next.checkMerit.body",
        ctaKey: "next.checkMerit.cta",
        href: `/merit-lookup`,
        tone: "success"
      };
    }
    return {
      id: "respondToOffer",
      titleKey: "next.respondToOffer.title",
      bodyKey: "next.respondToOffer.body",
      ctaKey: "next.respondToOffer.cta",
      href: `/allotment/${focus.courseId}`,
      tone: "success"
    };
  }

  if (step === "allotted" && focus) {
    const alloc = allocations[focus.courseId];
    if (alloc?.status === "float") {
      return {
        id: "trackScrutiny",
        titleKey: "next.floatPending.title",
        bodyKey: "next.floatPending.body",
        ctaKey: "next.floatPending.cta",
        href: "/applications",
        tone: "info"
      };
    }
    if (alloc?.status === "decline" || alloc?.status === "auto_cancelled") {
      return {
        id: "discoverCourses",
        titleKey: "next.declined.title",
        bodyKey: "next.declined.body",
        ctaKey: "next.declined.cta",
        href: "/discover",
        tone: "warning"
      };
    }
    if (alloc?.status === "freeze") {
      return {
        id: "payAdmissionFee",
        titleKey: "next.payAdmissionFee.title",
        bodyKey: "next.payAdmissionFee.body",
        ctaKey: "next.payAdmissionFee.cta",
        href: `/payment/${focus.courseId}`,
        tone: "success"
      };
    }
    // pending or no allocation status yet
    return {
      id: "respondToOffer",
      titleKey: "next.respondToOffer.title",
      bodyKey: "next.respondToOffer.body",
      ctaKey: "next.respondToOffer.cta",
      href: `/allotment/${focus.courseId}`,
      tone: "success"
    };
  }

  if (step === "admissionConfirmed" && focus) {
    return {
      id: "downloadAdmissionLetter",
      titleKey: "next.downloadAdmissionLetter.title",
      bodyKey: "next.downloadAdmissionLetter.body",
      ctaKey: "next.downloadAdmissionLetter.cta",
      href: `/payment/${focus.courseId}`,
      tone: "success"
    };
  }

  return {
    id: "discoverCourses",
    titleKey: "next.discoverCourses.title",
    bodyKey: "next.discoverCourses.body",
    ctaKey: "next.discoverCourses.cta",
    href: "/discover",
    tone: "brand"
  };
}
