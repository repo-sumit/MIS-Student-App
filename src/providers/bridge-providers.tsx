"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { AllocationEntry } from "@/domain/types";
import { KEYS, readJSON, writeJSON } from "./storage";

type ScrutinyMap = Record<string, { underReview?: boolean; discrepancies?: { docType: string; reason: string }[] }>;

type ScrutinyCtx = {
  scrutiny: ScrutinyMap;
  setUnderScrutiny: (courseId: string, value: boolean) => void;
  raiseDiscrepancy: (courseId: string, docType: string, reason: string) => void;
  resolveDiscrepancy: (courseId: string) => void;
};

const ScrCtx = createContext<ScrutinyCtx | null>(null);

export function ScrutinyBridgeProvider({ children }: { children: React.ReactNode }) {
  const [scrutiny, setScrutiny] = useState<ScrutinyMap>({});

  useEffect(() => {
    setScrutiny(readJSON<ScrutinyMap>(KEYS.scrutiny, {}));
    const handler = (e: StorageEvent) => {
      if (e.key === KEYS.scrutiny) setScrutiny(readJSON<ScrutinyMap>(KEYS.scrutiny, {}));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persist = useCallback((next: ScrutinyMap) => writeJSON(KEYS.scrutiny, next), []);

  const setUnderScrutiny = useCallback((courseId: string, value: boolean) => {
    setScrutiny((curr) => {
      const next = { ...curr, [courseId]: { ...(curr[courseId] || {}), underReview: value } };
      persist(next);
      return next;
    });
  }, [persist]);

  const raiseDiscrepancy = useCallback((courseId: string, docType: string, reason: string) => {
    setScrutiny((curr) => {
      const existing = curr[courseId] || {};
      const list = [...(existing.discrepancies || []), { docType, reason }];
      const next = { ...curr, [courseId]: { ...existing, discrepancies: list } };
      persist(next);
      return next;
    });
  }, [persist]);

  const resolveDiscrepancy = useCallback((courseId: string) => {
    setScrutiny((curr) => {
      const existing = curr[courseId];
      if (!existing) return curr;
      const next = { ...curr, [courseId]: { ...existing, discrepancies: [] } };
      persist(next);
      return next;
    });
  }, [persist]);

  const value = useMemo(() => ({ scrutiny, setUnderScrutiny, raiseDiscrepancy, resolveDiscrepancy }), [scrutiny, setUnderScrutiny, raiseDiscrepancy, resolveDiscrepancy]);

  return <ScrCtx.Provider value={value}>{children}</ScrCtx.Provider>;
}

export function useScrutinyBridge() {
  const ctx = useContext(ScrCtx);
  if (!ctx) throw new Error("useScrutinyBridge must be used within ScrutinyBridgeProvider");
  return ctx;
}

type AllotMap = Record<string, AllocationEntry | undefined>;
type MeritMap = Record<string, boolean>;

type AllotmentCtx = {
  allocations: AllotMap;
  merit: MeritMap;
  setAllocation: (courseId: string, allocation: AllocationEntry | undefined) => void;
  publishMerit: (courseId: string, value: boolean) => void;
  respond: (courseId: string, status: AllocationEntry["status"]) => void;
  setRollNumber: (courseId: string, roll: string) => void;
};

const AlCtx = createContext<AllotmentCtx | null>(null);

export function AllotmentBridgeProvider({ children }: { children: React.ReactNode }) {
  const [allocations, setAllocations] = useState<AllotMap>({});
  const [merit, setMerit] = useState<MeritMap>({});

  useEffect(() => {
    setAllocations(readJSON<AllotMap>(KEYS.allocation, {}));
    setMerit(readJSON<MeritMap>(KEYS.merit, {}));
    const handler = (e: StorageEvent) => {
      if (e.key === KEYS.allocation) setAllocations(readJSON<AllotMap>(KEYS.allocation, {}));
      if (e.key === KEYS.merit) setMerit(readJSON<MeritMap>(KEYS.merit, {}));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persistAllot = useCallback((next: AllotMap) => writeJSON(KEYS.allocation, next), []);
  const persistMerit = useCallback((next: MeritMap) => writeJSON(KEYS.merit, next), []);

  const setAllocation = useCallback((courseId: string, allocation: AllocationEntry | undefined) => {
    setAllocations((curr) => {
      const next = { ...curr, [courseId]: allocation };
      persistAllot(next);
      return next;
    });
  }, [persistAllot]);

  const publishMerit = useCallback((courseId: string, value: boolean) => {
    setMerit((curr) => {
      const next = { ...curr, [courseId]: value };
      persistMerit(next);
      return next;
    });
  }, [persistMerit]);

  const respond = useCallback((courseId: string, status: AllocationEntry["status"]) => {
    setAllocations((curr) => {
      const existing = curr[courseId];
      if (!existing) return curr;
      const next = { ...curr, [courseId]: { ...existing, status, respondedAt: new Date().toISOString() } };
      persistAllot(next);
      return next;
    });
  }, [persistAllot]);

  const setRollNumber = useCallback((courseId: string, roll: string) => {
    setAllocations((curr) => {
      const existing = curr[courseId];
      if (!existing) return curr;
      const updated: AllocationEntry = { ...existing, rollNumber: roll, status: "admission_confirmed" };
      const next: AllotMap = { ...curr, [courseId]: updated };
      persistAllot(next);
      return next;
    });
  }, [persistAllot]);

  const value = useMemo(() => ({ allocations, merit, setAllocation, publishMerit, respond, setRollNumber }), [allocations, merit, setAllocation, publishMerit, respond, setRollNumber]);

  return <AlCtx.Provider value={value}>{children}</AlCtx.Provider>;
}

export function useAllotmentBridge() {
  const ctx = useContext(AlCtx);
  if (!ctx) throw new Error("useAllotmentBridge must be used within AllotmentBridgeProvider");
  return ctx;
}
