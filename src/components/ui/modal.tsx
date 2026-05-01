"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { cn } from "./cn";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  tone = "neutral",
  size = "md"
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  tone?: "neutral" | "danger" | "warning" | "success";
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sizeCls = size === "sm" ? "max-w-[320px]" : size === "lg" ? "max-w-[460px]" : "max-w-[400px]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-[2px] px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn("w-full bg-white rounded-sheet sm:rounded-card shadow-card overflow-hidden", sizeCls)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-5 pt-5">
              <div>
                {tone !== "neutral" && (
                  <div
                    className={cn(
                      "mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full",
                      tone === "danger" && "bg-danger-subtle text-danger",
                      tone === "warning" && "bg-warning-subtle text-warning",
                      tone === "success" && "bg-success-subtle text-success"
                    )}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  </div>
                )}
                {title && <h2 className="text-[16px] font-bold text-ink">{title}</h2>}
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-ink-muted hover:bg-line-subtle">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 text-[14px] text-ink-muted leading-relaxed">{children}</div>
            {footer && <div className="px-5 pb-5 pt-1 flex flex-col-reverse sm:flex-row gap-2 justify-end">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
