"use client";

import { PROFILE_MAP, PROFILES } from "@/lib/profiles";
import { FACETS } from "@/lib/competencies";
import { useI18n } from "@/lib/i18n";
import { Bar100, RadarChart } from "@/components/charts";
import type { Results } from "@/lib/types";

/** Blocks shared by the full report and the candidate digest. */

export function ProfileHero({ results }: { results: Results }) {
  const { t, l } = useI18n();
  const primary = PROFILE_MAP[results.primaryProfile];
  const secondary = PROFILE_MAP[results.secondaryProfile];

  return (
    <div className="print-page card">
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-coral">
            {t("report.profile")}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-4xl">{primary.emoji}</span>
            <div>
              <div className="font-heading text-2xl text-deep">{l(primary.name)}</div>
              <div className="text-sm text-ink/60">{l(primary.tagline)}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">{l(primary.overview)}</p>
          <div className="mt-5 rounded-2xl bg-cloud/60 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
              {t("report.secondary")}
            </div>
            <div className="mt-1 text-sm font-medium text-ink">
              {secondary.emoji} {l(secondary.name)} — {l(secondary.tagline)}
            </div>
          </div>
        </div>
        <div className="w-full max-w-sm">
          <RadarChart
            labels={PROFILES.map((p) => l(p.shortName))}
            values={PROFILES.map((p) => results.profileScores[p.id])}
          />
        </div>
      </div>
    </div>
  );
}

export function StrengthsWatchouts({ results }: { results: Results }) {
  const { t, l } = useI18n();
  const primary = PROFILE_MAP[results.primaryProfile];
  const secondary = PROFILE_MAP[results.secondaryProfile];

  return (
    <div className="print-page grid gap-4 md:grid-cols-2">
      <div className="card">
        <h3 className="font-heading text-lg text-deep">{t("report.strengths")}</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink/80">
          {[...primary.strengths, secondary.strengths[0]].map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-deep">●</span>
              {l(s)}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="font-heading text-lg text-deep">{t("report.watchouts")}</h3>
        <ul className="mt-3 space-y-2 text-sm text-ink/80">
          {[...primary.watchouts, secondary.watchouts[0]].map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-coral">●</span>
              {l(s)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WorkstyleBlock({ results }: { results: Results }) {
  const { t, l } = useI18n();
  return (
    <div className="print-page card">
      <h3 className="font-heading text-lg text-deep">{t("report.workstyle")}</h3>
      <div className="mt-4 space-y-2.5">
        {FACETS.map((f) => (
          <Bar100 key={f.id} label={l(f.name)} value={results.facetScores[f.id]} />
        ))}
      </div>
    </div>
  );
}

export function Disclaimer() {
  const { t } = useI18n();
  return <p className="mt-6 text-xs leading-relaxed text-ink/40">{t("report.hypothesis")}</p>;
}
