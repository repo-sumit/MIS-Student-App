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

type AppMap = Record<string, ApplicationDraft>;

type ApplicationsCtx = {
  applications: AppMap;
  list: ApplicationDraft[];
  ensureDraft: (courseId: string) => ApplicationDraft;
  updatePreferences: (courseId: string, prefs: PreferenceItem[]) => void;
  setDeclaration: (courseId: string, accepted: boolean) => void;
  submit: (courseId: string) => ApplicationDraft;
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
          applicationFeePaid: true,
          baseStatus: "submitted"
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

  const reset = useCallback(() => {
    setApplications({});
    writeJSON(KEYS.applications, {});
  }, []);

  const list = useMemo(() => Object.values(applications), [applications]);

  const value = useMemo(
    () => ({ applications, list, ensureDraft, updatePreferences, setDeclaration, submit, reset }),
    [applications, list, ensureDraft, updatePreferences, setDeclaration, submit, reset]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApplications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider");
  return ctx;
}
