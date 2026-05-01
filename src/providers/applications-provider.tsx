"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { ApplicationDraft, PreferenceItem } from "@/domain/types";
import { KEYS, readJSON, writeJSON } from "./storage";
import { generateApplicationNumber } from "@/services/status";
import { OFFERINGS } from "@/domain/fixtures";
import { maybeAdvanceLifecycle, resolveDiscrepancy } from "@/services/lifecycle";

type AppMap = Record<string, ApplicationDraft>;

type ApplicationsCtx = {
  applications: AppMap;
  list: ApplicationDraft[];
  ensureDraft: (courseId: string) => ApplicationDraft;
  updatePreferences: (courseId: string, prefs: PreferenceItem[]) => void;
  setDeclaration: (courseId: string, accepted: boolean) => void;
  submit: (courseId: string) => ApplicationDraft;
  resolveAppDiscrepancy: (courseId: string) => void;
  acknowledgeMerit: (courseId: string) => void;
  markAllocationCreated: (courseId: string) => void;
  markFeePaid: (courseId: string) => void;
  markAdmissionConfirmed: (courseId: string) => void;
  reset: () => void;
};

const Ctx = createContext<ApplicationsCtx | null>(null);

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<AppMap>({});

  useEffect(() => {
    setApplications(readJSON<AppMap>(KEYS.applications, {}));
  }, []);

  const persist = useCallback((next: AppMap) => writeJSON(KEYS.applications, next), []);

  const ensureDraft = useCallback(
    (courseId: string) => {
      const offering = OFFERINGS.find((o) => o.id === courseId);
      let result: ApplicationDraft | null = null;
      setApplications((curr) => {
        if (curr[courseId]) {
          result = curr[courseId];
          return curr;
        }
        if (!offering) return curr;
        const draft: ApplicationDraft = {
          courseId,
          collegeId: offering.collegeId,
          courseType: offering.courseType,
          preferences: [],
          declarationAccepted: false,
          status: "draft"
        };
        const next = { ...curr, [courseId]: draft };
        persist(next);
        result = draft;
        return next;
      });
      return result!;
    },
    [persist]
  );

  const updatePreferences = useCallback(
    (courseId: string, prefs: PreferenceItem[]) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const ranked = prefs.map((p, idx) => ({ ...p, rankOrder: idx + 1 }));
        const next = { ...curr, [courseId]: { ...existing, preferences: ranked } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setDeclaration = useCallback(
    (courseId: string, accepted: boolean) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const next = { ...curr, [courseId]: { ...existing, declarationAccepted: accepted } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const submit = useCallback(
    (courseId: string) => {
      let result: ApplicationDraft | null = null;
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const submitted: ApplicationDraft = {
          ...existing,
          status: "submitted",
          submittedAt: new Date().toISOString(),
          applicationNumber: existing.applicationNumber ?? generateApplicationNumber(),
          applicationFeePaid: true
        };
        const next = { ...curr, [courseId]: submitted };
        persist(next);
        result = submitted;
        return next;
      });
      return result!;
    },
    [persist]
  );

  const resolveAppDiscrepancy = useCallback(
    (courseId: string) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing || !existing.discrepancy) return curr;
        const updated = resolveDiscrepancy(existing);
        const next = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const acknowledgeMerit = useCallback(
    (courseId: string) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing || !existing.meritPublishedAt || existing.meritViewedAt) return curr;
        const updated: ApplicationDraft = { ...existing, meritViewedAt: new Date().toISOString() };
        const next = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markAllocationCreated = useCallback(
    (courseId: string) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing || existing.allocationCreatedAt) return curr;
        const updated: ApplicationDraft = { ...existing, allocationCreatedAt: new Date().toISOString() };
        const next = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markFeePaid = useCallback(
    (courseId: string) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const updated: ApplicationDraft = { ...existing, feePaidAt: new Date().toISOString() };
        const next = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const markAdmissionConfirmed = useCallback(
    (courseId: string) => {
      setApplications((curr) => {
        const existing = curr[courseId];
        if (!existing) return curr;
        const updated: ApplicationDraft = { ...existing, admissionConfirmedAt: new Date().toISOString() };
        const next = { ...curr, [courseId]: updated };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reset = useCallback(() => {
    setApplications({});
    writeJSON(KEYS.applications, {});
  }, []);

  // Auto-advance loop — runs every 4s on the client.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tick = () => {
      setApplications((curr) => {
        const list = Object.values(curr);
        if (list.length === 0) return curr;
        const { changes } = maybeAdvanceLifecycle({ applications: list, now: Date.now() });
        if (changes.length === 0) return curr;
        const next = { ...curr };
        changes.forEach((c) => {
          next[c.courseId] = c;
        });
        persist(next);
        return next;
      });
    };
    const id = window.setInterval(tick, 4000);
    // Run once immediately on mount.
    tick();
    return () => window.clearInterval(id);
  }, [persist]);

  const list = useMemo(() => Object.values(applications), [applications]);

  const value = useMemo(
    () => ({
      applications,
      list,
      ensureDraft,
      updatePreferences,
      setDeclaration,
      submit,
      resolveAppDiscrepancy,
      acknowledgeMerit,
      markAllocationCreated,
      markFeePaid,
      markAdmissionConfirmed,
      reset
    }),
    [
      applications,
      list,
      ensureDraft,
      updatePreferences,
      setDeclaration,
      submit,
      resolveAppDiscrepancy,
      acknowledgeMerit,
      markAllocationCreated,
      markFeePaid,
      markAdmissionConfirmed,
      reset
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApplications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
}
