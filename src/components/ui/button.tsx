"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  block?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-600 active:bg-brand-700 disabled:bg-brand-200 disabled:text-white",
  secondary: "bg-line-subtle text-ink hover:bg-line disabled:bg-line-subtle disabled:text-ink-disabled",
  ghost: "bg-transparent text-brand hover:bg-brand-50 disabled:text-ink-disabled",
  outline: "bg-white text-brand border border-brand-400 hover:bg-brand-50 disabled:text-ink-disabled disabled:border-line",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40",
  success: "bg-success text-white hover:bg-success/90 disabled:bg-success/40"
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px] font-semibold",
  md: "h-11 px-4 text-[14px] font-semibold",
  lg: "h-12 px-5 text-[15px] font-semibold"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading, block, leadingIcon, trailingIcon, className, children, disabled, type = "button", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-pill transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed",
        block && "w-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leadingIcon}
      <span className="truncate">{children}</span>
      {!loading && trailingIcon}
    </button>
  );
});
