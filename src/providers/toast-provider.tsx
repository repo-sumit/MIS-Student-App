"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

type ToastTone = "success" | "info" | "warning" | "error";

type ToastEntry = {
  id: string;
  tone: ToastTone;
  title: string;
  description?: string;
};

type ToastCtx = {
  show: (toast: Omit<ToastEntry, "id">) => void;
  success: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warn: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

const iconFor: Record<ToastTone, React.ComponentType<{ size?: number; className?: string }>> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle
};

const colorFor: Record<ToastTone, { bg: string; ring: string; ink: string; icon: string }> = {
  success: { bg: "bg-success-subtle", ring: "ring-success/30", ink: "text-success-ink", icon: "text-success" },
  info: { bg: "bg-info-subtle", ring: "ring-info/30", ink: "text-info-ink", icon: "text-brand" },
  warning: { bg: "bg-warning-subtle", ring: "ring-warning/30", ink: "text-warning-ink", icon: "text-warning" },
  error: { bg: "bg-danger-subtle", ring: "ring-danger/30", ink: "text-danger-ink", icon: "text-danger" }
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((curr) => curr.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((t: Omit<ToastEntry, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((curr) => [...curr, { ...t, id }]);
    window.setTimeout(() => remove(id), 4200);
  }, [remove]);

  const value = useMemo<ToastCtx>(
    () => ({
      show,
      success: (title, description) => show({ tone: "success", title, description }),
      info: (title, description) => show({ tone: "info", title, description }),
      warn: (title, description) => show({ tone: "warning", title, description }),
      error: (title, description) => show({ tone: "error", title, description })
    }),
    [show]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[200] flex flex-col items-center px-4 pt-3">
        <div className="w-full max-w-shell">
          <AnimatePresence initial={false}>
            {toasts.map((t) => {
              const Icon = iconFor[t.tone];
              const c = colorFor[t.tone];
              return (
                <motion.div
                  key={t.id}
                  initial={{ y: -20, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -16, opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className={`pointer-events-auto mb-2 flex items-start gap-3 rounded-card ring-1 ${c.bg} ${c.ring} px-4 py-3 shadow-card`}
                >
                  <Icon size={20} className={c.icon} />
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold ${c.ink}`}>{t.title}</div>
                    {t.description ? (
                      <div className={`text-[13px] mt-0.5 ${c.ink} opacity-90`}>{t.description}</div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => remove(t.id)}
                    aria-label="Dismiss"
                    className={`rounded-full p-1 ${c.ink} hover:bg-white/40`}
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
