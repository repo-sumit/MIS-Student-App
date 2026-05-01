"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Compass, HelpCircle, LanguagesIcon, Trophy, GraduationCap, ShieldCheck, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";

export default function LandingPage() {
  const { t } = useLocale();
  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand text-white text-[12px] font-bold">HPU</span>
          <div className="leading-none">
            <div className="text-[12px] font-bold text-ink">{t("app.name")}</div>
            <div className="text-[10.5px] text-ink-muted">{t("landing.eyebrow")}</div>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      <section className="relative px-5 pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 rounded-pill bg-brand-50 px-3 py-1 text-[11px] font-bold tracking-wider uppercase text-brand-400">
            <ShieldCheck size={12} /> Cycle 2026–27
          </span>
          <h1 className="text-[26px] font-bold leading-tight text-ink">
            {t("landing.title")}
          </h1>
          <p className="text-[14px] text-ink-muted leading-relaxed">{t("landing.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 space-y-2.5"
        >
          <Link href="/register" className="block">
            <Button block size="lg" trailingIcon={<ArrowRight size={16} />}>{t("landing.primaryCta")}</Button>
          </Link>
          <Link href="/login" className="block">
            <Button block size="lg" variant="outline">{t("landing.secondaryCta")}</Button>
          </Link>
        </motion.div>
      </section>

      <section className="px-5 pt-4 pb-3 space-y-2.5">
        <FeatureRow icon={<Compass size={18} />} title={t("landing.feature1Title")} body={t("landing.feature1Body")} />
        <FeatureRow icon={<GraduationCap size={18} />} title={t("landing.feature2Title")} body={t("landing.feature2Body")} />
        <FeatureRow icon={<ListChecks size={18} />} title={t("landing.feature3Title")} body={t("landing.feature3Body")} />
      </section>

      <section className="px-5 mt-2 mb-6">
        <div className="text-eyebrow mb-2">{t("landing.linksHeading")}</div>
        <Card padded={false} className="overflow-hidden">
          <QuickLinkRow href="/merit-lookup" icon={<Trophy size={16} />} label={t("landing.linkMerit")} />
          <Divider />
          <QuickLinkRow href="/dates" icon={<Calendar size={16} />} label={t("landing.linkDates")} />
          <Divider />
          <QuickLinkRow href="/how-it-works" icon={<Compass size={16} />} label={t("landing.linkHowItWorks")} />
          <Divider />
          <QuickLinkRow href="/language" icon={<LanguagesIcon size={16} />} label={t("landing.linkLanguage")} />
          <Divider />
          <QuickLinkRow href="/help" icon={<HelpCircle size={16} />} label={t("landing.linkHelp")} />
        </Card>
      </section>

      <footer className="mt-auto bg-surface-app px-5 py-4 text-center text-[11px] text-ink-subtle">
        {t("app.footer")}
      </footer>
    </div>
  );
}

function FeatureRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-card border border-line-subtle bg-surface px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-brand-50 text-brand">{icon}</div>
      <div>
        <div className="text-[13.5px] font-bold text-ink">{title}</div>
        <div className="text-[12.5px] text-ink-muted leading-snug">{body}</div>
      </div>
    </div>
  );
}

function QuickLinkRow({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3.5 hover:bg-line-subtle/60 transition-colors">
      <span className="flex h-8 w-8 items-center justify-center rounded-card bg-brand-50 text-brand">{icon}</span>
      <span className="flex-1 text-[14px] font-semibold text-ink">{label}</span>
      <ArrowRight size={16} className="text-ink-subtle" />
    </Link>
  );
}

function Divider() {
  return <div className="mx-4 h-px bg-line-subtle" />;
}
