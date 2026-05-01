"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import en from "@/i18n/en.json";
import hi from "@/i18n/hi.json";
import type { Locale, Bilingual } from "@/domain/types";
import { KEYS, readJSON, writeJSON } from "./storage";

type Dict = typeof en;

type LocaleCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tList: (key: string) => any[];
  pick: (b: Bilingual) => string;
};

const dictionaries: Record<Locale, Dict> = { en, hi: hi as unknown as Dict };

const LocaleContext = createContext<LocaleCtx | null>(null);

function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = readJSON<Locale | null>(KEYS.locale, null);
    if (saved === "en" || saved === "hi") setLocaleState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    writeJSON(KEYS.locale, l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const value = getByPath(dictionaries[locale], key);
      if (typeof value === "string") return interpolate(value, vars);
      const fallback = getByPath(dictionaries.en, key);
      if (typeof fallback === "string") return interpolate(fallback, vars);
      return key;
    },
    [locale]
  );

  const tList = useCallback(
    (key: string) => {
      const value = getByPath(dictionaries[locale], key);
      if (Array.isArray(value)) return value;
      const fallback = getByPath(dictionaries.en, key);
      return Array.isArray(fallback) ? fallback : [];
    },
    [locale]
  );

  const pick = useCallback((b: Bilingual) => (locale === "hi" ? b.hi : b.en), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t, tList, pick }), [locale, setLocale, t, tList, pick]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
