"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileEdit, ListChecks, User } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { useLocale } from "@/providers/locale-provider";

export function BottomTabBar() {
  const pathname = usePathname() || "";
  const { t } = useLocale();
  const items = [
    { href: "/dashboard", label: t("tabs.home"), icon: Home, match: ["/dashboard"] },
    { href: "/apply", label: t("tabs.apply"), icon: FileEdit, match: ["/apply", "/discover"] },
    { href: "/applications", label: t("tabs.applications"), icon: ListChecks, match: ["/applications", "/allotment", "/payment"] },
    { href: "/profile/step/1", label: t("tabs.profile"), icon: User, match: ["/profile"] }
  ];
  return (
    <nav
      className="sticky bottom-0 z-40 mt-auto bg-white/95 backdrop-blur-md border-t border-line-subtle"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.match.some((m) => pathname.startsWith(m));
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold",
                  active ? "text-brand" : "text-ink-muted hover:text-ink"
                )}
              >
                <span className={cn("flex h-7 w-12 items-center justify-center rounded-pill transition-colors", active ? "bg-brand-50" : "bg-transparent")}>
                  <Icon size={18} />
                </span>
                <span className="leading-none">{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
