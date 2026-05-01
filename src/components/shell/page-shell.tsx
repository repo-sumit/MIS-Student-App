"use client";

import { motion } from "framer-motion";
import { MobileHeader } from "./mobile-header";
import { BottomTabBar } from "./bottom-tab-bar";

export function PageShell({
  title,
  showBack = false,
  showTabs = true,
  rightSlot,
  children,
  className,
  contained = true
}: {
  title?: React.ReactNode;
  showBack?: boolean;
  showTabs?: boolean;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contained?: boolean;
}) {
  return (
    <div className="app-shell flex flex-col min-h-[100dvh]">
      <MobileHeader title={title} showBack={showBack} rightSlot={rightSlot} />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={"flex-1 " + (contained ? "px-4 pb-24 pt-3 bg-surface-app" : "")}
      >
        {className ? <div className={className}>{children}</div> : children}
      </motion.main>
      {showTabs && <BottomTabBar />}
    </div>
  );
}
