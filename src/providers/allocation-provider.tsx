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

type AllotMap = Record<string, AllocationEntry | undefined>;

type AllocationCtx = {
  allocations: AllotMap;
  setAllocation: (courseId: string, allocation: AllocationEntry | undefined) => void;
  respond: (courseId: string, status: AllocationEntry["status"]) => void;
  setRollNumber: (courseId: string, roll: string) => void;
  reset: () => void;
};

const Ctx = createContext<AllocationCtx | null>(null);

export function AllocationProvider({ children }: { children: React.ReactNode }) {
  const [allocations, setAllocations] = useState<AllotMap>({});

  useEffect(() => {
    setAllocations(readJSON<AllotMap>(KEYS.allocation, {}));
    const handler = (e: StorageEvent) => {
      if (e.key === KEYS.allocation) setAllocations(readJSON<AllotMap>(KEYS.allocation, {}));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const persist = useCallback((next: AllotMap) => writeJSON(KEYS.allocation, next), []);

  const setAllocation = useCallback(
    (courseId: string, allocation: AllocationEntry | undefined) => {
      setAllocations((curr) => {
        const next = { ...curr, [courseId]: allocation };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const respond = useCallback(
    (courseId: string, status: AllocationEntry["status"]) => {
      setAllocations((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const updated: AllocationEntry = { ...existing, status, respondedAt: new Date().toISOString() };
        const next: AllotMap = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setRollNumber = useCallback(
    (courseId: string, roll: string) => {
      setAllocations((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const updated: AllocationEntry = { ...existing, rollNumber: roll, status: "admission_confirmed" };
        const next: AllotMap = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setAllocations({});
    writeJSON(KEYS.allocation, {});
  }, []);

  const value = useMemo(() => ({ allocations, setAllocation, respond, setRollNumber, reset }), [allocations, setAllocation, respond, setRollNumber, reset]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAllocation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAllocation must be used within AllocationProvider");
  return ctx;
}
