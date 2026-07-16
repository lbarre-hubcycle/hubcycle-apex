"use client";

import Link from "next/link";
import { useState } from "react";
import { PROFILES } from "@/lib/profiles";
import { VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { DistBars, Scale5 } from "@/components/charts";
import type { L10n, Person } from "@/lib/types";

type Band = 0 | 1 | 2; // 0 = low, 1 = mid, 2 = high

/** Role fit (1–5, from role match overall): <3 low, 3–3.9 mid, ≥4 high — mirrors the talent-matrix rating scale. */
const roleBand = (overall: number): Band => (overall >= 4 ? 2 : overall >= 3 ? 1 : 0);
/** Culture fit (1–5): aligned with the culture bands — ≥3.7 strong+, 3.0–3.69 moderate, <3 stretch/misfit. */
const cultureBandIdx = (score: number): Band => (score >= 3.7 ? 2 : score >= 3 ? 1 : 0);

/** 9-box labels + recommended action, indexed [roleBand][cultureBand]. */
const CELL_GUIDE: { label: L10n; action: L10n }[][] = [
  // Low role fit
  [
    {
      label: { en: "Misfit", fr: "Misfit" },
      action: { en: "Act decisively — neither the seat nor the bus fits.", fr: "Agir sans tarder — ni le siège ni le bus ne conviennent." },
    },
    {
      label: { en: "Reassess fit", fr: "Adéquation à réévaluer" },
      action: { en: "Targeted plan with a clear timeline.", fr: "Plan ciblé avec une échéance claire." },
    },
    {
      label: { en: "Right bus, wrong seat", fr: "Bon bus, mauvais siège" },
      action: { en: "Strong culture carrier — explore another role.", fr: "Porte la culture — explorer un autre poste." },
    },
  ],
  // Mid role fit
  [
    {
      label: { en: "Watch closely", fr: "À suivre de près" },
      action: { en: "Coach explicitly on the values gap.", fr: "Coacher explicitement sur l’écart de valeurs." },
    },
    {
      label: { en: "Core team", fr: "Cœur d’équipe" },
      action: { en: "Develop steadily on both axes.", fr: "Développer progressivement sur les deux axes." },
    },
    {
      label: { en: "Culture carrier", fr: "Porteur·se de culture" },
      action: { en: "Invest in skills — high potential.", fr: "Investir en compétences — fort potentiel." },
    },
  ],
  // High role fit
  [
    {
      label: { en: "Skilled but misaligned", fr: "Compétent·e mais désaligné·e" },
      action: { en: "Culture risk to address head-on.", fr: "Risque culturel à traiter frontalement." },
    },
    {
      label: { en: "Strong performer", fr: "Performant·e" },
      action: { en: "Nurture alignment — almost there.", fr: "Cultiver l’alignement — presque au sommet." },
    },
    {
      label: { en: "Cornerstone", fr: "Pilier" },
      action: { en: "Retain, empower, make visible.", fr: "Fidéliser, responsabiliser, rendre visible." },
    },
  ],
];

/** Cell background by position: both-high celebrated, both-low flagged. */
function cellTone(role: Band, culture: Band): string {
  const sum = role + culture;
  if (role === 2 && culture === 2) return "bg-sky/40 border-sky";
  if (sum >= 3) return "bg-sky/15 border-cloud";
  if (role === 0 && culture === 0) return "bg-coral/15 border-coral/40";
  if (sum <= 1) return "bg-coral/5 border-coral/25";
  return "bg-cloud/40 border-cloud";
}

function TalentMatrix({ people, l }: { people: Person[]; l: (s: L10n) => string }) {
  const { t } = useI18n();
  const rated = people.filter((p) => p.results?.roleMatch);
  const unrated = people.filter((p) => !p.results?.roleMatch);

  const cellPeople = (role: Band, culture: Band) =>
    rated.filter(
      (p) =>
        roleBand(p.results!.roleMatch!.overall) === role &&
        cultureBandIdx(p.results!.cultureScore) === culture
    );

  const bandLabels = [t("insights.low"), t("insights.mid"), t("insights.high")];

  return (
    <div>
      <div className="flex gap-2">
        {/* Y axis label */}
        <div className="flex w-6 shrink-0 items-center justify-center">
          <span
            className="whitespace-nowrap text-[11px] font-semibold text-deep"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {t("insights.roleFit")} →
          </span>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-1.5">
            {/* Rows: high role fit on top */}
            {([2, 1, 0] as Band[]).map((role) => (
              <div key={role} className="contents">
                <div className="flex w-14 items-center justify-end pr-1 text-[10px] font-semibold uppercase text-deep/60">
                  {bandLabels[role]}
                </div>
                {([0, 1, 2] as Band[]).map((culture) => {
                  const guide = CELL_GUIDE[role][culture];
                  const members = cellPeople(role, culture);
                  return (
                    <div
                      key={culture}
                      className={`min-h-[92px] rounded-xl border p-2.5 ${cellTone(role, culture)}`}
                    >
                      <div className="text-[10px] font-bold uppercase tracking-wide text-deep/70">
                        {l(guide.label)}
                        {members.length ? (
                          <span className="ml-1 rounded-full bg-white/70 px-1.5 text-deep">
                            {members.length}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1.5 space-y-0.5 text-[11px] leading-snug">
                        {members.map((p) => (
                          <Link
                            key={p.id}
                            href={`/admin/people/${p.id}`}
                            className="block font-medium text-ink hover:text-coral"
                          >
                            {p.name.split(" ")[0]}
                            {p.kind === "candidate" ? (
                              <span className="ml-1 text-[9px] uppercase text-coral">cand.</span>
                            ) : null}
                          </Link>
                        ))}
                      </div>
                      {members.length ? (
                        <p className="mt-1.5 text-[10px] italic leading-snug text-ink/45">
                          {l(guide.action)}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* X band labels */}
            <div />
            {([0, 1, 2] as Band[]).map((c) => (
              <div key={c} className="pt-1 text-center text-[10px] font-semibold uppercase text-deep/60">
                {bandLabels[c]}
              </div>
            ))}
          </div>
          <div className="mt-1 text-center text-[11px] font-semibold text-deep">
            {t("insights.cultureFit")} →
          </div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-ink/45">
        {t("insights.matrixLegend")}
        {unrated.length ? ` ${unrated.length} ${t("insights.noRoleFit")}` : ""}
      </p>
    </div>
  );
}

export default function InsightsPage() {
  const { t, l } = useI18n();
  const { db } = useAdminState();
  const [selected, setSelected] = useState<string>("all");

  const all = (db?.people ?? []).filter((p) => p.results);
  const done = selected === "all" ? all : all.filter((p) => p.teamId === selected);
  const employees = done.filter((p) => p.kind === "employee");
  const candidates = done.filter((p) => p.kind === "candidate");

  const dist = PROFILES.map((prof) => ({
    label: `${prof.emoji} ${l(prof.shortName)}`,
    value: done.filter((p) => p.results!.primaryProfile === prof.id).length,
    color: prof.id === "driver" || prof.id === "pit-crew" ? "#FF684D" : "#A1D0DB",
  }));

  const avgValue = (vid: string) =>
    done.length
      ? Math.round(
          (done.reduce((s, p) => s + (p.results!.valueScores as Record<string, number>)[vid], 0) /
            done.length) *
            10
        ) / 10
      : 0;

  return (
    <div>
      <SectionTitle title={t("insights.title")} sub={t("insights.sub")} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSelected("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            selected === "all" ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
          }`}
        >
          {t("dyn.allHubcycle")}
        </button>
        {(db?.teams ?? []).map((team) => (
          <button
            key={team.id}
            onClick={() => setSelected(team.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              selected === team.id ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {done.length === 0 ? (
        <div className="card text-ink/40">{t("insights.none")}</div>
      ) : (
        <>
          <div className="card mb-4">
            <h3 className="font-heading text-lg text-deep">{t("insights.matrix")}</h3>
            <p className="mb-4 text-xs text-ink/50">{t("insights.matrixSub")}</p>
            <TalentMatrix people={done} l={l} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card">
              <h3 className="font-heading text-lg text-deep">{t("insights.profileDist")}</h3>
              <div className="mt-5">
                <DistBars data={dist} />
              </div>
              <p className="mt-3 text-xs text-ink/40">
                {employees.length} {t("common.employees").toLowerCase()} · {candidates.length}{" "}
                {t("common.candidates").toLowerCase()}
              </p>
            </div>
            <div className="card">
              <h3 className="font-heading text-lg text-deep">{t("insights.cultureAvg")}</h3>
              <div className="mt-4 divide-y divide-cloud/70">
                {VALUES.map((v) => (
                  <Scale5 key={v.id} label={l(v.name)} sublabel={l(v.scope)} value={avgValue(v.id)} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
