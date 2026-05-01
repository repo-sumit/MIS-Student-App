"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Trophy, Search, Lock } from "lucide-react";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/shell/language-switcher";
import { useLocale } from "@/providers/locale-provider";
import { useEffectiveStudentStep } from "@/providers/use-effective-step";
import { COLLEGES, OFFERINGS } from "@/domain/fixtures";
import { DEMO_BOF, DEMO_RANK } from "@/services/status";

export default function MeritLookup() {
  const { t, pick } = useLocale();
  const { step, firstSubmittedCourseId, firstApplicationNumber } = useEffectiveStudentStep();
  const isUnlocked = step === "meritPublished" || step === "allotted" || step === "admissionConfirmed";

  const offering = firstSubmittedCourseId ? OFFERINGS.find((o) => o.id === firstSubmittedCourseId) : undefined;
  const college = offering ? COLLEGES.find((c) => c.id === offering.collegeId) : undefined;
  const [appNumber, setAppNumber] = useState("");
  const [matched, setMatched] = useState(false);
  const [searched, setSearched] = useState(false);

  function search(e: React.FormEvent) {
    e.preventDefault();
    setSearched(true);
    setMatched(!!firstApplicationNumber && appNumber.trim() === firstApplicationNumber);
  }

  return (
    <div className="app-shell flex min-h-[100dvh] flex-col bg-white">
      <header className="flex items-center justify-between px-3 pt-3 pb-2">
        <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-line-subtle">
          <ChevronLeft size={20} />
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="px-5 pt-2 pb-10">
        <h1 className="text-[22px] font-bold text-ink">{t("merit.title")}</h1>
        <p className="text-[13px] text-ink-muted mt-1 mb-5">{t("merit.subtitle")}</p>

        {!isUnlocked ? (
          <Card padded>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-card bg-warning-subtle text-warning"><Lock size={16} /></div>
              <div>
                <CardTitle>{t("merit.lockedTitle")}</CardTitle>
                <CardSubtitle>{t("merit.lockedBody")}</CardSubtitle>
              </div>
            </div>
          </Card>
        ) : (
          <>
            <Card padded>
              <form onSubmit={search} className="space-y-3">
                <Field label={t("merit.appNumber")}>
                  <Input
                    placeholder={firstApplicationNumber || "HPU/2026/123456"}
                    value={appNumber}
                    onChange={(e) => setAppNumber(e.target.value)}
                  />
                </Field>
                <Button type="submit" block size="lg" leadingIcon={<Search size={16} />}>{t("merit.search")}</Button>
              </form>
            </Card>

            {searched && matched && offering && college && (
              <Card padded className="mt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-card bg-success-subtle text-success">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <CardTitle>#{DEMO_RANK}</CardTitle>
                      <CardSubtitle>{t("merit.score")}: <strong className="text-ink">{DEMO_BOF}%</strong></CardSubtitle>
                    </div>
                  </div>
                  <Badge tone="success" dot>Published</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[12.5px]">
                  <div className="rounded-card bg-line-subtle/60 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-subtle">{t("merit.category")}</div>
                    <div className="font-bold text-ink capitalize">General</div>
                  </div>
                  <div className="rounded-card bg-line-subtle/60 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-subtle">{t("merit.course")}</div>
                    <div className="font-bold text-ink truncate">{offering.courseCode}</div>
                  </div>
                  <div className="col-span-2 rounded-card bg-line-subtle/60 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-subtle">{t("merit.firstPref")}</div>
                    <div className="font-bold text-ink truncate">{pick(college.name)}</div>
                  </div>
                </div>
              </Card>
            )}
            {searched && !matched && (
              <Card padded className="mt-4">
                <div className="text-[13px] text-ink-muted">{t("merit.noResult")}</div>
              </Card>
            )}
            {!searched && (
              <p className="mt-4 text-[12px] text-ink-subtle">{t("merit.demoNote")}</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
