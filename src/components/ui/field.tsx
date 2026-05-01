"use client";

import { forwardRef, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export function FieldLabel({
  htmlFor,
  children,
  optional,
  className
}: {
  htmlFor?: string;
  children: React.ReactNode;
  optional?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("block text-[13px] font-semibold text-ink mb-1.5", className)}>
      {children}
      {optional && <span className="ml-1 text-[11px] font-medium text-ink-subtle">(optional)</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-[12px] font-medium text-danger-ink">{children}</p>;
}

export function FieldHint({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="mt-1 text-[12px] text-ink-subtle">{children}</p>;
}

export function Field({
  label,
  htmlFor,
  optional,
  error,
  hint,
  children
}: {
  label?: string;
  htmlFor?: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {label && <FieldLabel htmlFor={htmlFor} optional={optional}>{label}</FieldLabel>}
      {children}
      {error ? <FieldError>{error}</FieldError> : <FieldHint>{hint}</FieldHint>}
    </div>
  );
}

const inputBase =
  "w-full h-12 rounded-pill border border-line bg-white px-4 text-[14px] text-ink placeholder:text-ink-subtle outline-none transition-colors focus:border-brand-400 focus:shadow-focus disabled:bg-line-subtle disabled:text-ink-disabled";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(function Input(
  { className, invalid, ...rest },
  ref
) {
  return <input ref={ref} className={cn(inputBase, invalid && "border-danger", className)} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }>(function Select(
  { className, invalid, children, ...rest },
  ref
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          inputBase,
          "appearance-none pr-10 bg-white",
          invalid && "border-danger",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(function Textarea(
  { className, invalid, rows = 3, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-card border border-line bg-white px-4 py-3 text-[14px] text-ink placeholder:text-ink-subtle outline-none transition-colors focus:border-brand-400 focus:shadow-focus",
        invalid && "border-danger",
        className
      )}
      {...rest}
    />
  );
});

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  id
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <label className={cn("flex items-start gap-3 cursor-pointer select-none", disabled && "opacity-60 cursor-not-allowed")}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line bg-white transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-brand/40",
          checked && "bg-brand border-brand"
        )}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="text-[13.5px] text-ink leading-snug">
        <span className="block">{label}</span>
        {description && <span className="block text-ink-subtle text-[12px] mt-0.5">{description}</span>}
      </span>
    </label>
  );
}
