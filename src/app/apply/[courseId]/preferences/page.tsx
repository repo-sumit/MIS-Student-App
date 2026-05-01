"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ApplyShell } from "@/components/apply/apply-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COLLEGES, COMBINATIONS, OFFERINGS } from "@/domain/fixtures";
import { useLocale } from "@/providers/locale-provider";
import { useApplications } from "@/providers/applications-provider";
import { useToast } from "@/providers/toast-provider";

export default function PreferencesPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t, pick } = useLocale();
  const { ensureDraft, applications, updatePreferences } = useApplications();
  const toast = useToast();
  const offering = OFFERINGS.find((o) => o.id === params.courseId);

  useEffect(() => {
    if (offering) ensureDraft(offering.id);
  }, [offering, ensureDraft]);

  const draft = offering ? applications[offering.id] : undefined;
  const max = offering?.maxPreferences ?? 3;

  // Build candidates: combinations × all colleges that offer this courseType
  const candidates = useMemo(() => {
    if (!offering) return [];
    const sameTypeOfferings = OFFERINGS.filter((o) => o.courseType === offering.courseType);
    const combos = offering.combinations.map((id) => COMBINATIONS.find((c) => c.id === id)).filter(Boolean) as typeof COMBINATIONS;
    const result: { key: string; combinationId: string; collegeId: string; combinationLabel: typeof combos[0]["label"]; collegeName: typeof COLLEGES[0]["name"]; collegeCode: string }[] = [];
    sameTypeOfferings.forEach((o) => {
      const college = COLLEGES.find((c) => c.id === o.collegeId);
      if (!college) return;
      combos.forEach((cb) => {
        if (!o.combinations.includes(cb.id)) return;
        result.push({
          key: `${cb.id}__${college.id}`,
          combinationId: cb.id,
          collegeId: college.id,
          combinationLabel: cb.label,
          collegeName: college.name,
          collegeCode: college.code
        });
      });
    });
    return result;
  }, [offering]);

  const [selected, setSelected] = useState<{ combinationId: string; collegeId: string }[]>([]);

  useEffect(() => {
    if (draft && draft.preferences.length > 0) {
      setSelected(draft.preferences.map((p) => ({ combinationId: p.combinationId, collegeId: p.collegeId })));
    }
  }, [draft?.courseId]);

  function toggle(c: { combinationId: string; collegeId: string }) {
    const exists = selected.find((s) => s.combinationId === c.combinationId && s.collegeId === c.collegeId);
    if (exists) {
      setSelected(selected.filter((s) => !(s.combinationId === c.combinationId && s.collegeId === c.collegeId)));
    } else {
      if (selected.length >= max) {
        toast.warn(`Maximum ${max} preferences`);
        return;
      }
      setSelected([...selected, c]);
    }
  }

  function next() {
    if (!offering) return;
    if (selected.length === 0) {
      toast.warn(t("apply.noPreferencesError"));
      return;
    }
    updatePreferences(offering.id, selected.map((s, i) => ({ ...s, rankOrder: i + 1 })));
    router.push(`/apply/${offering.id}/rank`);
  }

  if (!offering) return null;

  return (
    <ApplyShell
      step={1}
      title={t("apply.preferencesTitle")}
      subtitle={t("apply.preferencesSubtitle", { max })}
      footer={
        <div className="flex items-center gap-2">
          <Badge tone="brand" className="!normal-case !text-[12px] !tracking-normal !font-semibold">{t("apply.selectedCount", { n: selected.length, max })}</Badge>
          <Button block onClick={next} disabled={selected.length === 0}>{t("common.continue")}</Button>
        </div>
      }
    >
      <div className="space-y-2">
        {candidates.map((c) => {
          const isSel = !!selected.find((s) => s.combinationId === c.combinationId && s.collegeId === c.collegeId);
          const idx = selected.findIndex((s) => s.combinationId === c.combinationId && s.collegeId === c.collegeId);
          return (
            <button
              key={c.key}
              onClick={() => toggle(c)}
              className={
                "block w-full text-left rounded-card border-[1.5px] px-4 py-3 transition-colors " +
                (isSel ? "bg-[#ECFFE5] border-success" : "bg-white border-line hover:border-brand-200")
              }
            >
              <div className="flex items-center gap-3">
                <div className={
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold " +
                  (isSel ? "bg-success text-white" : "bg-line-subtle text-ink-muted")
                }>
                  {isSel ? <Check size={14} /> : c.collegeCode.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-ink-muted">{c.collegeCode}</div>
                  <div className="text-[13.5px] font-semibold text-ink truncate">{pick(c.combinationLabel)}</div>
                  <div className="text-[12px] text-ink-muted truncate">{pick(c.collegeName)}</div>
                </div>
                {isSel && idx >= 0 && (
                  <span className="text-[11px] font-bold text-success">#{idx + 1}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </ApplyShell>
  );
}
