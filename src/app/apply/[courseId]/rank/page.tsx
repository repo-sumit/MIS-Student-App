"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { ApplyShell } from "@/components/apply/apply-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/providers/applications-provider";
import { useLocale } from "@/providers/locale-provider";
import { COLLEGES, COMBINATIONS, OFFERINGS } from "@/domain/fixtures";

export default function RankPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t, pick } = useLocale();
  const { applications, updatePreferences } = useApplications();
  const offering = OFFERINGS.find((o) => o.id === courseId);
  const draft = courseId ? applications[courseId] : undefined;
  const [items, setItems] = useState<{ combinationId: string; collegeId: string }[]>([]);

  useEffect(() => {
    if (draft) setItems(draft.preferences.map((p) => ({ combinationId: p.combinationId, collegeId: p.collegeId })));
  }, [draft?.courseId]);

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[idx], next[j]] = [next[j], next[idx]];
    setItems(next);
  }

  function remove(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function next() {
    if (!offering) return;
    updatePreferences(offering.id, items.map((s, i) => ({ ...s, rankOrder: i + 1 })));
    router.push(`/apply/${offering.id}/review`);
  }

  if (!offering) return null;

  return (
    <ApplyShell
      step={2}
      title={t("apply.rankTitle")}
      subtitle={t("apply.rankSubtitle")}
      footer={<Button block onClick={next} disabled={items.length === 0}>{t("common.continue")}</Button>}
    >
      <div className="space-y-2">
        {items.map((it, i) => {
          const combo = COMBINATIONS.find((c) => c.id === it.combinationId);
          const college = COLLEGES.find((c) => c.id === it.collegeId);
          if (!combo || !college) return null;
          return (
            <Card key={`${it.combinationId}-${it.collegeId}`} padded>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white text-[12px] font-bold">{t("apply.rankBadge", { n: i + 1 })}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{college.code}</div>
                  <div className="text-[13px] font-semibold text-ink truncate">{pick(combo.label)}</div>
                  <div className="text-[11.5px] text-ink-muted truncate">{pick(college.name)}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} aria-label={t("apply.moveUp")} className="flex h-7 w-7 items-center justify-center rounded-full bg-line-subtle text-ink hover:bg-brand-50 disabled:text-ink-disabled">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label={t("apply.moveDown")} className="flex h-7 w-7 items-center justify-center rounded-full bg-line-subtle text-ink hover:bg-brand-50 disabled:text-ink-disabled">
                    <ArrowDown size={14} />
                  </button>
                </div>
                <button onClick={() => remove(i)} aria-label={t("apply.removePref")} className="flex h-7 w-7 items-center justify-center rounded-full text-danger-ink hover:bg-danger-subtle">
                  <X size={14} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </ApplyShell>
  );
}
