"use client";

export const KEYS = {
  profile: "hp-mis:profile-draft",
  applications: "hp-mis:applications",
  documents: "hp-mis:documents",
  locale: "hp-mis:locale",
  scrutiny: "hp-mis:scrutiny",
  merit: "hp-mis:merit",
  allocation: "hp-mis:allocation",
  demoStage: "hp-mis:student-demo-stage"
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function removeKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}
