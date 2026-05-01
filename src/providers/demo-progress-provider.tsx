"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { DemoStage } from "@/domain/types";
import { KEYS, readJSON, writeJSON, removeKey } from "./storage";
import { DEMO_STAGE_ORDER, nextStageAfter } from "@/services/status";

type DemoCtx = {
  stage: DemoStage | undefined;
  setStage: (s: DemoStage | undefined) => void;
  reset: () => void;
  next: () => DemoStage | undefined;
  advance: () => void;
};

const Ctx = createContext<DemoCtx | null>(null);

export function DemoProgressProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStageState] = useState<DemoStage | undefined>(undefined);

  useEffect(() => {
    const saved = readJSON<DemoStage | null>(KEYS.demoStage, null);
    if (saved && DEMO_STAGE_ORDER.includes(saved as DemoStage)) {
      setStageState(saved as DemoStage);
    }
  }, []);

  const setStage = useCallback((s: DemoStage | undefined) => {
    if (!s) {
      removeKey(KEYS.demoStage);
      setStageState(undefined);
    } else {
      writeJSON(KEYS.demoStage, s);
      setStageState(s);
    }
  }, []);

  const reset = useCallback(() => {
    removeKey(KEYS.demoStage);
    setStageState(undefined);
  }, []);

  const next = useCallback(() => nextStageAfter(stage), [stage]);

  const advance = useCallback(() => {
    const n = nextStageAfter(stage);
    if (n) setStage(n);
  }, [stage, setStage]);

  const value = useMemo(() => ({ stage, setStage, reset, next, advance }), [stage, setStage, reset, next, advance]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemoProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemoProgress must be used within DemoProgressProvider");
  return ctx;
}
