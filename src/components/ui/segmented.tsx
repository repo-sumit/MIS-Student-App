"use client";

import { cn } from "./cn";

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  size = "md",
  className
}: {
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-pill bg-line-subtle p-1",
        size === "sm" ? "text-[12px]" : "text-[13px]",
        className
      )}
      role="tablist"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-pill font-semibold transition-colors",
              size === "sm" ? "px-3 py-1" : "px-4 py-1.5",
              active ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
