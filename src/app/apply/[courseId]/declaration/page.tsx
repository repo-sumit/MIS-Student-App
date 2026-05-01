"use client";

import { useParams, useRouter } from "next/navigation";
import { ApplyShell } from "@/components/apply/apply-shell";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/field";
import { useApplications } from "@/providers/applications-provider";
import { useProfile } from "@/providers/profile-provider";
import { useLocale } from "@/providers/locale-provider";
import { useToast } from "@/providers/toast-provider";

export default function DeclarationPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const { t } = useLocale();
  const { applications, setDeclaration } = useApplications();
  const { profile } = useProfile();
  const toast = useToast();
  const draft = courseId ? applications[courseId] : undefined;
  if (!draft) return null;
  const accepted = draft.declarationAccepted;

  return (
    <ApplyShell
      step={4}
      title={t("apply.declarationTitle")}
      footer={
        <Button
          block
          disabled={!accepted}
          onClick={() => {
            if (!accepted) {
              toast.warn(t("apply.needDeclaration"));
              return;
            }
            router.push(`/apply/${courseId}/submit`);
          }}
        >
          {t("apply.declarationCta")}
        </Button>
      }
    >
      <Card padded>
        <CardTitle>{t("apply.declarationTitle")}</CardTitle>
        <p className="mt-3 text-[13px] text-ink-muted leading-relaxed">
          {t("apply.declarationBody", { name: profile.fullName || "the applicant" })}
        </p>
        <div className="mt-4 rounded-card bg-line-subtle/60 px-3 py-3">
          <Checkbox
            checked={accepted}
            onChange={(v) => courseId && setDeclaration(courseId, v)}
            label={t("apply.declarationCheckbox")}
          />
        </div>
      </Card>
    </ApplyShell>
  );
}
