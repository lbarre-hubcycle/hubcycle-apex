"use client";

import Link from "next/link";
import { PROFILE_MAP } from "@/lib/profiles";
import { VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { Scale5 } from "@/components/charts";

/**
 * Apex Growth — individual development view, inspired by the Ideal Team
 * Player: strengths to build on, the lowest culture value as a development
 * focus, and the primary profile's watch-outs as coaching ground.
 */
export default function GrowthPage() {
  const { t, l } = useI18n();
  const { db } = useAdminState();

  const employees = (db?.people ?? []).filter((p) => p.kind === "employee" && p.results);

  return (
    <div>
      <SectionTitle title={t("growth.title")} sub={t("growth.sub")} />
      {employees.length === 0 ? (
        <div className="card text-ink/40">{t("insights.none")}</div>
      ) : (
        <div className="space-y-4">
          {employees.map((p) => {
            const r = p.results!;
            const prof = PROFILE_MAP[r.primaryProfile];
            const sortedValues = [...VALUES].sort(
              (a, b) => r.valueScores[b.id] - r.valueScores[a.id]
            );
            const top = sortedValues.slice(0, 2);
            const focus = sortedValues[sortedValues.length - 1];
            return (
              <div key={p.id} className="card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-heading text-lg text-deep">{p.name}</div>
                    <div className="text-sm text-ink/60">
                      {prof.emoji} {l(prof.name)}
                    </div>
                  </div>
                  <Link href={`/admin/people/${p.id}`} className="btn-ghost !px-3 !py-1.5 !text-xs">
                    {t("recruit.viewReport")}
                  </Link>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-cloud/60 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                      {t("report.strengths")}
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                      {top.map((v) => (
                        <li key={v.id}>
                          ✓ {l(v.name)} — {r.valueScores[v.id].toFixed(1)}/5
                        </li>
                      ))}
                      <li>✓ {l(prof.strengths[0])}</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-coral/10 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-coral">
                      Focus
                    </div>
                    <div className="mt-2">
                      <Scale5 label={l(focus.name)} value={r.valueScores[focus.id]} />
                    </div>
                    <p className="mt-1 text-xs text-ink/60">{l(focus.summary)}</p>
                  </div>
                  <div className="rounded-2xl bg-cloud/60 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                      {t("report.coachTips")}
                    </div>
                    <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                      {prof.coachTips.slice(0, 2).map((m, i) => (
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
