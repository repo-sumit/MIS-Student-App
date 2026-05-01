import { cn } from "./cn";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const toneCls: Record<Tone, string> = {
  neutral: "bg-line-subtle text-ink-muted",
  brand: "bg-brand-50 text-brand-400 ring-1 ring-brand-100",
  success: "bg-success-subtle text-success-ink",
  warning: "bg-warning-subtle text-warning-ink",
  danger: "bg-danger-subtle text-danger-ink",
  info: "bg-info-subtle text-info-ink"
};

export function Badge({
  children,
  tone = "neutral",
  dot,
  className
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] uppercase",
        toneCls[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", tone === "success" && "bg-success", tone === "warning" && "bg-warning", tone === "danger" && "bg-danger", tone === "brand" && "bg-brand", tone === "info" && "bg-brand-300", tone === "neutral" && "bg-ink-muted")} />}
      {children}
    </span>
  );
}
