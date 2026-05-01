"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/components/ui/cn";

export function MobileHeader({
  title,
  showBack = false,
  rightSlot,
  variant = "default"
}: {
  title?: React.ReactNode;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
  variant?: "default" | "transparent";
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center gap-2 px-3 h-14 backdrop-blur-md",
        variant === "transparent" ? "bg-transparent" : "bg-white/90 border-b border-line-subtle"
      )}
    >
      {showBack ? (
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-line-subtle"
        >
          <ChevronLeft size={20} />
        </button>
      ) : (
        <div className="flex items-center gap-2 pl-1">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white text-[12px] font-bold">HPU</span>
          <span className="text-[13px] font-semibold text-ink leading-none">Admission</span>
        </div>
      )}
      <div className="flex-1 text-center px-2">
        {title && <h1 className="text-[15px] font-bold text-ink truncate">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        {rightSlot}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
