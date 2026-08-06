"use client";

import { PROFILE_MAP } from "@/lib/profiles";
import { VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { Scale5 } from "@/components/charts";
import { Disclaimer, ProfileHero, StrengthsWatchouts, WorkstyleBlock } from "@/components/report";

/**
 * Apex Me — the employee's own space: natural profile, strengths,
 * self-coaching and growth focus. Never shows comparisons with other people.
 */
export default function MePage() {
  const { t, l } = useI18n();
  const { db, viewer } = useAdminState();

  if (!db || !viewer) return <p className="text-ink/50">…</p>;

  const me = viewer.personId ? db.people.find((p) => p.id === viewer.personId) : undefined;

  if (!me) {
    return (
      <div>
        <SectionTitle title={t("me.title")} sub={t("me.sub")} />
        <div className="card text-ink/60">{t("me.notLinked")}</div>
      </div>
    );
  }

  if (!me.results) {
    return (
      <div>
        <SectionTitle title={t("me.title")} sub={t("me.sub")} />
        <div className="card text-ink/60">{t("me.noResults")}</div>
      </div>
    );
  }

  const r = me.results;
  const prof = PROFILE_MAP[r.primaryProfile];
  const sortedValues = [...VALUES].sort((a, b) => r.valueScores[b.id] - r.valueScores[a.id]);
  const focus = sortedValues[sortedValues.length - 1];

  return (
    <div className="mx-auto max-w-4xl">
      <SectionTitle title={`${t("me.title")} — ${me.name}`} sub={t("me.sub")} />
      <div className="space-y-4">
        <ProfileHero results={r} />
        <StrengthsWatchouts results={r} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card">
            <h3 className="font-heading text-lg text-deep">{t("report.motivators")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {prof.motivators.map((m, i) => (
                <li key={i}>▲ {l(m)}</li>
              ))}
            </ul>
            <h3 className="mt-5 font-heading text-lg text-deep">{t("report.frustrations")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              {prof.frustrations.map((m, i) => (
                <li key={i}>▽ {l(m)}</li>
              ))}
            </ul>
          </div>
          <div className="card border-coral/30">
            <h3 className="font-heading text-lg text-deep">{t("me.growthFocus")}</h3>
            <div className="mt-3">
              <Scale5 label={l(focus.name)} value={r.valueScores[focus.id]} />
            </div>
            <p className="mt-2 text-sm text-ink/70">{l(focus.summary)}</p>
            <p className="mt-4 text-xs text-ink/45">{t("me.growthHint")}</p>
          </div>
        </div>

        <WorkstyleBlock results={r} />
      </div>
      <Disclaimer />
    </div>
  );
}
