"use client";

import { motion } from "framer-motion";
import { SiteHeader } from "./site-header";
import { BottomTabBar } from "./bottom-tab-bar";
import { cn } from "@/components/ui/cn";

export type PageShellSize = "narrow" | "medium" | "wide" | "dashboard";

const SIZE_CLASS: Record<PageShellSize, string> = {
  narrow: "form-container",
  medium: "content-narrow",
  wide: "content-wide",
  // dashboard uses the wide container; the inner grid handles the columns
  dashboard: "content-wide"
};

export function PageShell({
  title,
  showBack = false,
  showTabs = true,
  showHeader = true,
  size = "medium",
  children,
  className,
  variant = "auto",
  bare = false
}: {
  title?: React.ReactNode;
  showBack?: boolean;
  showTabs?: boolean;
  showHeader?: boolean;
  size?: PageShellSize;
  children: React.ReactNode;
  className?: string;
  variant?: "auto" | "compact";
  /** When true, renders content without the inner container — caller controls width entirely. */
  bare?: boolean;
}) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {showHeader && <SiteHeader title={title} showBack={showBack} variant={variant} />}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={cn("flex-1 w-full", showTabs && "has-tabbar")}
      >
        {bare ? (
          children
        ) : (
          <div className="app-container py-4 lg:py-8">
            <div className={cn(SIZE_CLASS[size], className)}>{children}</div>
          </div>
        )}
      </motion.main>
      {showTabs && <BottomTabBar />}
    </div>
  );
}
