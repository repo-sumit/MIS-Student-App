"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Phone, Mail, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";

type Faq = { q: string; a: string };

export default function HelpPage() {
  const { t, tList } = useLocale();
  const faqs = tList("help.faqs") as Faq[];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="min-h-[100dvh] bg-white">
      <header className="border-b border-line-subtle">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="inline-flex h-10 items-center gap-1 rounded-pill px-2 text-[13px] font-semibold text-ink-muted hover:text-ink hover:bg-line-subtle">
            <ChevronLeft size={18} /> Home
          </Link>
          <div className="flex items-center gap-2">
            <HpuLogo size={26} />
            <span className="text-[13px] font-bold text-ink hidden sm:inline">{t("help.title")}</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="app-container py-6 lg:py-12">
        <div className="content-narrow">
          <h1 className="text-[24px] lg:text-[28px] font-bold text-ink">{t("help.title")}</h1>
          <p className="text-[13.5px] text-ink-muted mt-1 mb-5">{t("help.subtitle")}</p>

          <div className="grid gap-2.5 sm:grid-cols-2">
            <a href={`tel:${t("help.phone")}`}>
              <Card padded>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-card bg-success-subtle text-success">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-ink">{t("help.phoneTitle")}</div>
                    <div className="text-[12px] text-ink-muted truncate">{t("help.phoneSub")}</div>
                  </div>
                </div>
                <div className="mt-2 text-[14px] font-bold text-brand">{t("help.phone")}</div>
              </Card>
            </a>
            <a href={`mailto:${t("help.email")}`}>
              <Card padded>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-card bg-info-subtle text-info-ink">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold text-ink">{t("help.emailTitle")}</div>
                    <div className="text-[12px] text-ink-muted truncate">{t("help.email")}</div>
                  </div>
                </div>
              </Card>
            </a>
          </div>

          <h2 className="mt-7 mb-3 text-[14px] font-bold text-ink">{t("help.faqTitle")}</h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <Card key={i} padded={false} className="overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                >
                  <span className="flex-1 text-[14px] font-semibold text-ink">{f.q}</span>
                  <ChevronDown size={16} className={"transition-transform text-ink-muted " + (open === i ? "rotate-180" : "")} />
                </button>
                {open === i && (
                  <div className="px-4 pb-4 text-[13px] text-ink-muted leading-relaxed">{f.a}</div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
