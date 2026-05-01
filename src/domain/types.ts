export type Locale = "en" | "hi";

export type Bilingual = { en: string; hi: string };

export type StatusStep =
  | "registered"
  | "profileComplete"
  | "submitted"
  | "underScrutiny"
  | "meritPublished"
  | "allotted"
  | "admissionConfirmed";

export type Stream = "arts" | "science-pcm" | "science-pcb" | "commerce" | "any";
export type CourseType = "BA" | "BSc" | "BCom" | "BCA" | "BBA";

export type Category = "general" | "obc" | "sc" | "st" | "ews";

export type ResultStatus = "passed" | "compartment" | "awaited";

export type CollegeType = "government" | "constituent" | "private";

export type District =
  | "Shimla"
  | "Kangra"
  | "Mandi"
  | "Solan"
  | "Kullu"
  | "Chamba"
  | "Una"
  | "Hamirpur"
  | "Bilaspur"
  | "Sirmaur"
  | "Kinnaur"
  | "Lahaul & Spiti";

export interface College {
  id: string;
  code: string;
  name: Bilingual;
  district: District;
  type: CollegeType;
  aishe: string;
  contactPhone: string;
  contactEmail: string;
  established: number;
}

export interface Combination {
  id: string;
  label: Bilingual;
  subjects: string[];
  stream: Stream;
}

export interface CourseOffering {
  id: string;
  collegeId: string;
  courseType: CourseType;
  courseCode: string;
  name: Bilingual;
  stream: Stream;
  durationYears: number;
  totalSeats: number;
  feeAmount: number;
  minMarks: number;
  combinations: string[];
  maxPreferences: number;
  description: Bilingual;
}

export interface ProfileDraft {
  fullName: string;
  fatherName: string;
  motherName: string;
  guardianName?: string;
  dob: string;
  gender?: "male" | "female" | "other";
  mobile: string;
  email: string;
  aadhaarMasked?: string;
  address: string;
  district: District | "";
  state: string;
  pincode: string;
  board: string;
  passingYear: string;
  rollNumber: string;
  stream: Stream | "";
  bestOfFive: string;
  resultStatus: ResultStatus | "";
  category: Category | "";
  domicile: "hp" | "non-hp" | "";
  isSingleGirlChild: boolean;
  isPwd: boolean;
  bankHolder: string;
  bankAccount: string;
  ifsc: string;
  bankName: string;
  completedSteps: number[];
  updatedAt: string;
}

export type Eligibility = "eligible" | "conditional" | "not_eligible";

export interface EligibilityVerdict {
  status: Eligibility;
  reasons: string[];
}

export type ScrutinyOutcome = "verified" | "discrepancy" | "conditional";

export type ApplicationLifecycle =
  | "draft"
  | "submitted"
  | "underScrutiny"
  | "discrepancyRaised"
  | "discrepancyResolved"
  | "verified"
  | "conditionallyVerified"
  | "meritPublished"
  | "allotted"
  | "feePaid"
  | "admissionConfirmed";

export interface PreferenceItem {
  combinationId: string;
  collegeId: string;
  rankOrder: number;
}

export interface DiscrepancyEntry {
  docType: DocType;
  reason: string;
  raisedAt: string;
  deadlineAt: string;
}

export interface ApplicationDraft {
  courseId: string;
  collegeId: string;
  courseType: CourseType;
  preferences: PreferenceItem[];
  declarationAccepted: boolean;
  status: "draft" | "submitted";
  submittedAt?: string;
  applicationNumber?: string;
  applicationFeePaid?: boolean;

  // Lifecycle timestamps (set by lifecycle engine)
  scrutinyStartedAt?: string;
  scrutinyOutcome?: ScrutinyOutcome;
  scrutinyOutcomeAt?: string;
  discrepancy?: DiscrepancyEntry;
  discrepancyResolvedAt?: string;
  verifiedAt?: string;
  meritPublishedAt?: string;
  meritViewedAt?: string;
  allocationCreatedAt?: string;
  feePaidAt?: string;
  admissionConfirmedAt?: string;
}

export interface AllocationEntry {
  rank: number;
  bofPercentage: number;
  category: Category;
  offer: {
    courseId: string;
    collegeId: string;
    collegeName: Bilingual;
    combinationLabel?: Bilingual;
    feeAmount: number;
  };
  status:
    | "pending"
    | "freeze"
    | "float"
    | "decline"
    | "auto_cancelled"
    | "fee_paid"
    | "admission_confirmed";
  offeredAt: string;
  respondedAt?: string;
  rollNumber?: string;
  feeBreakup?: { label: Bilingual; amount: number }[];
  responseDeadline?: string;
}

export type DocType =
  | "photo"
  | "signature"
  | "class10"
  | "class12"
  | "domicile"
  | "category"
  | "pwd"
  | "sgc"
  | "bank";

export interface DocumentEntry {
  type: DocType;
  fileName: string;
  uploadedAt: string;
  source: "device" | "digilocker";
  status: "uploaded" | "verified" | "rejected";
  rejectionReason?: string;
  sizeKb: number;
}

export interface EffectiveStudentStep {
  step: StatusStep;
  firstApplication?: ApplicationDraft;
  firstAllocation?: AllocationEntry;
  firstApplicationNumber?: string;
  firstSubmittedCourseId?: string;
}

export type TimelineEntryKind =
  | "registered"
  | "profileCompleted"
  | "submitted"
  | "underScrutiny"
  | "discrepancyRaised"
  | "discrepancyResolved"
  | "verified"
  | "meritPublished"
  | "allotted"
  | "feePaid"
  | "admissionConfirmed";

export interface TimelineEntry {
  kind: TimelineEntryKind;
  at: string;
  meta?: { docType?: DocType; reason?: string; collegeId?: string; rollNumber?: string };
}
