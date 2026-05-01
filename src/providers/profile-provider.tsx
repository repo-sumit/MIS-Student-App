"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ProfileDraft } from "@/domain/types";
import { KEYS, readJSON, writeJSON } from "./storage";
import { hasEnoughProfile } from "@/services/status";

const EMPTY: ProfileDraft = {
  fullName: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  dob: "",
  gender: undefined,
  mobile: "",
  email: "",
  aadhaarMasked: "",
  address: "",
  district: "",
  state: "Himachal Pradesh",
  pincode: "",
  board: "",
  passingYear: "",
  rollNumber: "",
  stream: "",
  bestOfFive: "",
  resultStatus: "",
  category: "",
  domicile: "",
  isSingleGirlChild: false,
  isPwd: false,
  bankHolder: "",
  bankAccount: "",
  ifsc: "",
  bankName: "",
  completedSteps: [],
  updatedAt: ""
};

type ProfileCtx = {
  profile: ProfileDraft;
  update: (patch: Partial<ProfileDraft>) => void;
  markStep: (n: number) => void;
  resetWithSeed: (seed: Partial<ProfileDraft>) => void;
  isComplete: boolean;
};

const Ctx = createContext<ProfileCtx | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileDraft>(EMPTY);

  useEffect(() => {
    const saved = readJSON<ProfileDraft | null>(KEYS.profile, null);
    if (saved) setProfile({ ...EMPTY, ...saved });
  }, []);

  const persist = useCallback((next: ProfileDraft) => {
    writeJSON(KEYS.profile, next);
  }, []);

  const update = useCallback(
    (patch: Partial<ProfileDraft>) => {
      setProfile((curr) => {
        const next = { ...curr, ...patch, updatedAt: new Date().toISOString() };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markStep = useCallback(
    (n: number) => {
      setProfile((curr) => {
        const set = new Set(curr.completedSteps);
        set.add(n);
        const next = { ...curr, completedSteps: Array.from(set).sort((a, b) => a - b), updatedAt: new Date().toISOString() };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const resetWithSeed = useCallback(
    (seed: Partial<ProfileDraft>) => {
      const next = { ...EMPTY, ...seed, updatedAt: new Date().toISOString() };
      setProfile(next);
      persist(next);
    },
    [persist]
  );

  const isComplete = hasEnoughProfile(profile);

  const value = useMemo(() => ({ profile, update, markStep, resetWithSeed, isComplete }), [profile, update, markStep, resetWithSeed, isComplete]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfile() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
