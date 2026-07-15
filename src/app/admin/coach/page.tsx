"use client";

import { PROFILE_MAP } from "@/lib/profiles";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";

export default function CoachPage() {
  const { t, l } = useI18n();
  const { db } = useAdminState();

  const employees = (db?.people ?? []).filter((p) => p.kind === "employee" && p.results);

  return (
    <div>
      <SectionTitle title={t("coach.title")} sub={t("coach.sub")} />
      {employees.length === 0 ? (
        <div className="card text-ink/40">{t("insights.none")}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {employees.map((p) => {
            const prof = PROFILE_MAP[p.results!.primaryProfile];
            return (
              <div key={p.id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-heading text-lg text-deep">{p.name}</div>
                    <div className="text-sm text-ink/60">
                      {prof.emoji} {l(prof.name)} — {l(prof.tagline)}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                      {t("report.motivators")}
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                      {prof.motivators.map((m, i) => (
                        <li key={i}>▲ {l(m)}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                      {t("report.frustrations")}
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                      {prof.frustrations.map((m, i) => (
                        <li key={i}>▽ {l(m)}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                      {t("report.coachTips")}
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                      {prof.coachTips.map((m, i) => (
                        <li key={i}>→ {l(m)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
