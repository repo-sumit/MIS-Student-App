"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Compass,
  HelpCircle,
  Languages as LanguagesIcon,
  Trophy,
  GraduationCap,
  ShieldCheck,
  ListChecks,
  Award,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { HpuLogo } from "@/components/shell/hpu-logo";
import { useLocale } from "@/providers/locale-provider";

export default function LandingPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-[100dvh] bg-white">
      {/* Header */}
      <header className="border-b border-line-subtle bg-white/85 backdrop-blur-md sticky top-0 z-30">
        <div className="app-container flex items-center justify-between h-14 lg:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <HpuLogo size={28} className="lg:hidden" />
            <HpuLogo size={32} className="hidden lg:inline-flex" />
            <div className="leading-none">
              <div className="text-[13px] lg:text-[14px] font-bold text-ink">{t("app.name")}</div>
              <div className="text-[10.5px] lg:text-[11px] text-ink-muted">{t("landing.eyebrow")}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden md:inline-flex h-9 items-center rounded-pill px-3 text-[13px] font-semibold text-ink-muted hover:text-ink hover:bg-line-subtle">
              {t("login.title")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="app-container py-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-7 space-y-5"
          >
            <span className="inline-flex items-center gap-2 rounded-pill bg-brand-50 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-brand-400">
              <ShieldCheck size={12} /> Cycle 2026–27
            </span>
            <h1 className="text-[28px] sm:text-[32px] lg:text-[40px] xl:text-[44px] font-bold leading-[1.12] tracking-tight text-ink">
              {t("landing.title")}
            </h1>
            <p className="text-[14.5px] lg:text-[16px] text-ink-muted leading-relaxed max-w-[560px]">
              {t("landing.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <Link href="/register" className="sm:flex-none">
                <Button size="lg" trailingIcon={<ArrowRight size={16} />} className="w-full sm:w-auto">
                  {t("landing.primaryCta")}
                </Button>
              </Link>
              <Link href="/login" className="sm:flex-none">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t("landing.secondaryCta")}
                </Button>
              </Link>
            </div>
            <div className="pt-3 flex items-center gap-4 text-[12.5px] text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Bilingual EN / हिन्दी</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> 12 districts</span>
              <span className="hidden sm:inline-flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> DigiLocker ready</span>
            </div>
          </motion.div>

          {/* Lifecycle preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-4 lg:-inset-6 rounded-hero bg-gradient-to-br from-brand-50 to-brand-100/50 blur-xl opacity-70" />
              <Card padded className="relative shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <HpuLogo size={28} />
                    <span className="text-[12.5px] font-bold text-ink">Your admission journey</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-brand-400 bg-brand-50 rounded-pill px-2 py-0.5">Live</span>
                </div>
                <ul className="space-y-2.5">
                  {[
                    { Icon: GraduationCap, title: "Register and complete profile", body: "Five quick sections with autosave." },
                    { Icon: Compass, title: "Discover eligible courses", body: "Live eligibility against 12 colleges." },
                    { Icon: ListChecks, title: "Apply and rank preferences", body: "Up to 6 BA / 3 BSc preferences." },
                    { Icon: Trophy, title: "View merit and respond", body: "Freeze, float, or decline your offer." },
                    { Icon: Award, title: "Pay fee and confirm admission", body: "Roll number issued on success." }
                  ].map(({ Icon, title, body }, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-card bg-line-subtle/60 px-3 py-2">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-brand text-[10.5px] font-bold ring-1 ring-line">
                        {i + 1}
                      </span>
                      <span>
                        <span className="block text-[13px] font-semibold text-ink">{title}</span>
                        <span className="block text-[11.5px] text-ink-muted leading-snug">{body}</span>
                      </span>
                      <Icon size={16} className="ml-auto text-ink-muted shrink-0 mt-1" />
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why this app */}
      <section className="app-container pb-10 lg:pb-16">
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureRow icon={<Compass size={18} />} title={t("landing.feature1Title")} body={t("landing.feature1Body")} />
          <FeatureRow icon={<GraduationCap size={18} />} title={t("landing.feature2Title")} body={t("landing.feature2Body")} />
          <FeatureRow icon={<ListChecks size={18} />} title={t("landing.feature3Title")} body={t("landing.feature3Body")} />
        </div>
      </section>

      {/* Quick links */}
      <section className="app-container pb-12 lg:pb-20">
        <div className="text-eyebrow mb-3">{t("landing.linksHeading")}</div>
        <Card padded={false} className="overflow-hidden">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x lg:divide-x divide-line-subtle">
            <QuickLinkRow href="/merit-lookup" icon={<Trophy size={16} />} label={t("landing.linkMerit")} />
            <QuickLinkRow href="/dates" icon={<Calendar size={16} />} label={t("landing.linkDates")} />
            <QuickLinkRow href="/how-it-works" icon={<Compass size={16} />} label={t("landing.linkHowItWorks")} />
            <QuickLinkRow href="/language" icon={<LanguagesIcon size={16} />} label={t("landing.linkLanguage")} />
            <QuickLinkRow href="/help" icon={<HelpCircle size={16} />} label={t("landing.linkHelp")} />
          </div>
        </Card>
      </section>

      <footer className="bg-surface-app/60 border-t border-line-subtle">
        <div className="app-container py-5 text-center text-[12px] text-ink-subtle">
          {t("app.footer")}
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card padded className="h-full">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-brand-50 text-brand">{icon}</div>
        <div>
          <div className="text-[13.5px] font-bold text-ink">{title}</div>
          <div className="text-[12.5px] text-ink-muted leading-snug">{body}</div>
        </div>
      </div>
    </Card>
  );
}

function QuickLinkRow({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3.5 hover:bg-line-subtle/60 transition-colors">
      <span className="flex h-8 w-8 items-center justify-center rounded-card bg-brand-50 text-brand">{icon}</span>
      <span className="flex-1 text-[13.5px] font-semibold text-ink">{label}</span>
      <ArrowRight size={14} className="text-ink-subtle" />
    </Link>
  );
}
