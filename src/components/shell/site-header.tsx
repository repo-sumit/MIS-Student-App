"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { HpuLogo } from "./hpu-logo";
import { useLocale } from "@/providers/locale-provider";
import { cn } from "@/components/ui/cn";

const NAV_LINKS: { href: string; key: string }[] = [
  { href: "/dashboard", key: "tabs.home" },
  { href: "/discover", key: "tabs.apply" },
  { href: "/applications", key: "tabs.applications" },
  { href: "/dates", key: "landing.linkDates" },
  { href: "/help", key: "landing.linkHelp" }
];

export function SiteHeader({
  title,
  showBack = false,
  variant = "auto"
}: {
  title?: React.ReactNode;
  showBack?: boolean;
  /** "auto" picks compact mobile vs. desktop horizontal nav. "compact" forces mobile-style across all sizes (used during multi-step forms). */
  variant?: "auto" | "compact";
}) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const { t } = useLocale();
  const desktopNavVisible = variant === "auto";

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-line-subtle">
      <div className="app-container flex items-center gap-3 h-14 lg:h-16">
        {/* Left cluster: back button OR logo */}
        {showBack ? (
          <button
            onClick={() => router.back()}
            aria-label="Back"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-line-subtle"
          >
            <ChevronLeft size={20} />
          </button>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <HpuLogo size={28} className="lg:hidden" />
            <HpuLogo size={32} className="hidden lg:inline-flex" />
            <span className="hidden md:flex flex-col leading-none">
              <span className="text-[13.5px] font-bold text-ink">HPU Admission</span>
              <span className="text-[10.5px] text-ink-muted">Higher Education, HP</span>
            </span>
          </Link>
        )}

        {/* Center: title on mobile, nav on desktop */}
        <div className="flex-1 min-w-0 flex items-center justify-center md:justify-start">
          {desktopNavVisible ? (
            <>
              {title && <h1 className="md:hidden text-[15px] font-bold text-ink truncate">{title}</h1>}
              <nav className="hidden md:flex items-center gap-1 md:ml-6">
                {NAV_LINKS.map((l) => {
                  const active = pathname === l.href || pathname.startsWith(l.href + "/");
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={cn(
                        "rounded-pill px-3 py-1.5 text-[13px] font-semibold transition-colors",
                        active ? "bg-brand-50 text-brand" : "text-ink-muted hover:text-ink hover:bg-line-subtle"
                      )}
                    >
                      {t(l.key)}
                    </Link>
                  );
                })}
              </nav>
            </>
          ) : (
            title && <h1 className="text-[15px] font-bold text-ink truncate">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
