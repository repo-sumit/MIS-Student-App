"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { DocType, DocumentEntry } from "@/domain/types";
import { KEYS, readJSON, writeJSON } from "./storage";

type DocMap = Partial<Record<DocType, DocumentEntry>>;

type DocsCtx = {
  documents: DocMap;
  upload: (type: DocType, entry: Omit<DocumentEntry, "type" | "uploadedAt" | "status">) => void;
  reject: (type: DocType, reason: string) => void;
  clear: (type: DocType) => void;
};

const Ctx = createContext<DocsCtx | null>(null);

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<DocMap>({});

  useEffect(() => {
    const saved = readJSON<DocMap>(KEYS.documents, {});
    setDocuments(saved);
  }, []);

  const persist = useCallback((next: DocMap) => writeJSON(KEYS.documents, next), []);

  const upload = useCallback(
    (type: DocType, entry: Omit<DocumentEntry, "type" | "uploadedAt" | "status">) => {
      setDocuments((curr) => {
        const next: DocMap = {
          ...curr,
          [type]: {
            ...entry,
            type,
            status: "uploaded",
            uploadedAt: new Date().toISOString()
          }
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const reject = useCallback(
    (type: DocType, reason: string) => {
      setDocuments((curr) => {
        const existing = curr[type];
        if (!existing) return curr;
        const next: DocMap = { ...curr, [type]: { ...existing, status: "rejected", rejectionReason: reason } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const clear = useCallback(
    (type: DocType) => {
      setDocuments((curr) => {
        const next = { ...curr };
        delete next[type];
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const value = useMemo(() => ({ documents, upload, reject, clear }), [documents, upload, reject, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDocuments() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDocuments must be used within DocumentsProvider");
  return ctx;
}
