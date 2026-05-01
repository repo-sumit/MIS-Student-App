"use client";

export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      {icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand">
          {icon}
        </div>
      )}
      <div className="text-[15px] font-bold text-ink">{title}</div>
      {description && <div className="text-[13px] text-ink-muted mt-1 max-w-[260px] leading-snug">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
