import { cn } from "./cn";

export function Card({ children, className, padded = true, as: Tag = "div", ...rest }: { children: React.ReactNode; className?: string; padded?: boolean; as?: any } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Tag
      className={cn(
        "bg-surface rounded-card ring-1 ring-line shadow-card",
        padded && "p-4",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-[15px] font-bold tracking-tight text-ink", className)}>{children}</h3>;
}

export function CardSubtitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-[13px] text-ink-muted leading-snug", className)}>{children}</p>;
}

export function CardDivider() {
  return <div className="my-3 h-px bg-line-subtle" />;
}
