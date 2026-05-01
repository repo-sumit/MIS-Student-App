"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { KEYS, readJSON, writeJSON } from "./storage";

interface AccountMeta {
  registeredAt?: string;
  profileCompletedAt?: string;
}

type MetaCtx = {
  meta: AccountMeta;
  markRegistered: () => void;
  markProfileCompleted: () => void;
  reset: () => void;
};

const Ctx = createContext<MetaCtx | null>(null);

export function MetaProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<AccountMeta>({});

  useEffect(() => {
    setMeta(readJSON<AccountMeta>(KEYS.meta, {}));
  }, []);

  const persist = useCallback((next: AccountMeta) => writeJSON(KEYS.meta, next), []);

  const markRegistered = useCallback(() => {
    setMeta((curr) => {
      if (curr.registeredAt) return curr;
      const next = { ...curr, registeredAt: new Date().toISOString() };
      persist(next);
      return next;
    });
  }, [persist]);

  const markProfileCompleted = useCallback(() => {
    setMeta((curr) => {
      if (curr.profileCompletedAt) return curr;
      const next = { ...curr, profileCompletedAt: new Date().toISOString() };
      persist(next);
      return next;
    });
  }, [persist]);

  const reset = useCallback(() => {
    setMeta({});
    persist({});
  }, [persist]);

  const value = useMemo(() => ({ meta, markRegistered, markProfileCompleted, reset }), [meta, markRegistered, markProfileCompleted, reset]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMeta() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useMeta must be used within MetaProvider");
  return ctx;
}
