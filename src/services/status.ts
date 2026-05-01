import type { ProfileDraft } from "@/domain/types";

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

export function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `HPU/${year}/${seq}`;
}

export function generateRollNumber(collegeCode: string, rank: number): string {
  const year = new Date().getFullYear();
  return `${collegeCode}/${year}/${String(rank).padStart(4, "0")}`;
}
