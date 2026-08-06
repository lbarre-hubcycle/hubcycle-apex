"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ROLE_MAP } from "@/data/roles";
import { PROFILE_MAP, mapPosition, synergyNote } from "@/lib/profiles";
import { COMPETENCY_MAP } from "@/lib/competencies";
import { CULTURE_BANDS, VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { PrintButton } from "@/components/ui";
import { Scale5, TeamMap, type MapDot } from "@/components/charts";
import { Bar100 } from "@/components/charts";
import { commercialStyleOf, roleCommercialNeed } from "@/lib/commercial-style";
import { COMPETENCY_COACHING, COMPETENCY_READS, competencyStyleScore, readTier } from "@/lib/competency-read";
import { FRAMEWORK_MAP, ROLE_EXPECTATIONS_MAP } from "@/data/competency-framework";
import { Disclaimer, ProfileHero, StrengthsWatchouts, WorkstyleBlock } from "@/components/report";
import type { Person, ProfileId, Team } from "@/lib/types";

interface Payload {
  person: Person;
  people: Person[];
  teams: Team[];
}


/**
 * Expected-competencies debrief, generalized to every role: for each
 * competency the role's referential expects, does the declared style
 * demonstrate it — or lean toward the opposite register? Knowledge
 * competencies (e.g. B7) are flagged for interview, never fake-scored.
 * Tone differs by audience: evaluative hypotheses + interview questions
 * for candidates; development priorities + coaching levers for employees.
 * Full report only — never in the candidate digest.
 */
function ExpectedCompetenciesBlock({
  firstName,
  roleId,
  results,
  employee,
}: {
  firstName: string;
  roleId: string;
  results: NonNullable<Person["results"]>;
  employee: boolean;
}) {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const exp = ROLE_EXPECTATIONS_MAP[roleId];
  if (!exp) return null;

  const need = roleCommercialNeed(roleId);
  const gauge = need ? commercialStyleOf(results) : null;
  const gaugePos = gauge ? Math.min(95, Math.max(5, 50 + gauge.delta / 2)) : 50;

  const tierChip = (tier: "demonstrated" | "present" | "opposite" | "interview") => {
    const styles = {
      demonstrated: "bg-sky/40 text-deep",
      present: "bg-cloud text-ink/60",
      opposite: employee ? "bg-lavender/40 text-deep" : "bg-coral/15 text-coral",
      interview: "bg-lavender/40 text-deep",
    } as const;
    const labels = employee
      ? ({
          demonstrated: fr ? "Force d'appui" : "Strength to lean on",
          present: fr ? "Présent, à consolider" : "Present, to consolidate",
          opposite: fr ? "Priorité de développement" : "Development priority",
          interview: fr ? "À évaluer sur le terrain" : "Assess on the job",
        } as const)
      : ({
          demonstrated: fr ? "Style aligné" : "Style aligned",
          present: fr ? "Présent, à confirmer" : "Present, to confirm",
          opposite: fr ? "Registre opposé" : "Opposite register",
          interview: fr ? "À évaluer en entretien" : "Assess in interview",
        } as const);
    return (
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[tier]}`}>
        {labels[tier]}
      </span>
    );
  };

  const rows = exp.competencies.map((code) => {
    const def = FRAMEWORK_MAP[code];
    const read = COMPETENCY_READS[code];
    const score = competencyStyleScore(results, code);
    const tier = score === null ? ("interview" as const) : readTier(score);
    return { code, def, read, score, tier };
  });

  const coreRows = ["A1", "A2", "A3", "A4", "A5", "A6"].map((code) => {
    const score = competencyStyleScore(results, code)!;
    return { code, def: FRAMEWORK_MAP[code], score, tier: readTier(score) };
  });

  return (
    <div className="print-page card">
      <h3 className="font-heading text-lg text-deep">
        {employee
          ? fr
            ? "Compétences du poste — forces d'appui et priorités de développement"
            : "The role's competencies — strengths to lean on and development priorities"
          : fr
            ? "Compétences attendues du poste — le style les démontre-t-il ?"
            : "The role's expected competencies — does the style demonstrate them?"}
      </h3>
      <p className="mt-1 text-xs text-ink/50">
        {employee
          ? fr
            ? `Lecture des préférences déclarées de ${firstName} au regard du référentiel du poste. Un registre différent n'est pas un jugement : c'est un axe de développement à travailler ensemble.`
            : `${firstName}'s declared preferences read against the role's referential. A different register is not a judgment: it is a development focus to work on together.`
          : fr
            ? `Lecture des préférences déclarées de ${firstName} au regard du référentiel du poste. Un style opposé n'est pas un verdict : c'est un point à explorer en entretien.`
            : `${firstName}'s declared preferences read against the role's referential. An opposite register is not a verdict: it is a point to explore in interview.`}
      </p>

      {gauge && need ? (
        <div className="mt-5 rounded-2xl bg-cloud/40 p-4">
          <div className="mb-1.5 flex justify-between text-xs font-semibold text-deep">
            <span>{fr ? "🌱 Culture (comptes)" : "🌱 Farming (accounts)"}</span>
            <span>{fr ? "🎯 Chasse (conquête)" : "🎯 Hunting (new business)"}</span>
          </div>
          <div className="relative h-3 rounded-full bg-gradient-to-r from-sky/60 via-cloud to-coral/50">
            <span
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-deep shadow"
              style={{ left: `${gaugePos}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-ink/50">
            {fr
              ? `Le poste attend ${need === "both" ? "les deux registres commerciaux (B1 + B2)" : need === "hunting" ? "surtout la conquête (B1)" : "surtout le développement de comptes (B2)"} · conquête ${gauge.hunter}/100 · développement ${gauge.farmer}/100.`
              : `The role expects ${need === "both" ? "both commercial registers (B1 + B2)" : need === "hunting" ? "mostly hunting (B1)" : "mostly account development (B2)"} · hunting ${gauge.hunter}/100 · farming ${gauge.farmer}/100.`}
          </p>
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {rows.map(({ code, def, read, score, tier }) => (
          <div
            key={code}
            className={`rounded-2xl border p-3.5 ${
              tier === "opposite"
                ? employee
                  ? "border-lavender/60 bg-lavender/10"
                  : "border-coral/30 bg-coral/5"
                : "border-cloud/80 bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-deep/10 px-2 py-0.5 text-xs font-bold text-deep">{code}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{l(def.name)}</span>
              {tierChip(tier)}
            </div>
            {score !== null ? (
              <div className="mt-2">
                <Bar100 value={score} />
              </div>
            ) : null}
            {tier === "opposite" ? (
              <p className="mt-2 text-sm text-ink/75">
                {employee
                  ? fr ? "Registre naturel différent : " : "Different natural register: "
                  : fr ? "Registre opposé observé : " : "Opposite register observed: "}
                {l(read.opposite)}.
              </p>
            ) : null}
            {tier === "opposite" || tier === "interview" ? (
              <p className="mt-1.5 text-xs text-ink/55">
                {employee
                  ? <>{fr ? "Piste de coaching : " : "Coaching lever: "}{l(COMPETENCY_COACHING[code])}</>
                  : <>{fr ? "À poser en entretien : " : "To ask in interview: "}{l(read.question)}</>}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
          {fr ? "Socle (attendu de tous)" : "Core (expected of everyone)"}
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {coreRows.map(({ code, def, score, tier }) => (
            <div key={code} className="flex items-center gap-2 rounded-xl bg-cloud/40 px-3 py-2">
              <span className="text-[10px] font-bold text-deep/60">{code}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-ink/75">{l(def.name)}</span>
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  tier === "demonstrated" ? "bg-deep" : tier === "present" ? "bg-sky" : "bg-coral"
                }`}
                title={`${score}/100`}
              />
              <span className="w-7 text-right text-xs font-semibold text-deep">{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, l, lang } = useI18n();
  const [data, setData] = useState<Payload | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setMissing(true));
  }, [id]);

  async function convertToEmployee() {
    if (!data || !window.confirm(t("recruit.convertConfirm"))) return;
    await fetch(`/api/people/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "employee" }),
    });
    const res = await fetch(`/api/people/${id}`);
    if (res.ok) setData(await res.json());
  }

  if (missing) return <p className="text-ink/50">—</p>;
  if (!data) return <p className="text-ink/50">…</p>;

  const { person, people, teams } = data;
  const role = person.roleId ? ROLE_MAP[person.roleId] : undefined;
  const results = person.results;

  if (!results) {
    return (
      <div>
        <Link href="/admin/recruit" className="text-sm text-deep/60 hover:text-deep">
          ← {t("common.back")}
        </Link>
        <div className="card mt-4">{t("report.notCompleted")}</div>
      </div>
    );
  }

  const primary = PROFILE_MAP[results.primaryProfile];
  const band = CULTURE_BANDS.find((b) => b.id === results.cultureBand)!;
  const isEmployee = person.kind === "employee";
  const fr = lang === "fr";
  const team = person.teamId ? teams.find((tm) => tm.id === person.teamId) : undefined;
  const teammates = team
    ? people.filter(
        (p) =>
          (p.teamId === team.id || p.functionalTeamId === team.id) &&
          p.results &&
          p.id !== person.id &&
          p.kind === "employee"
      )
    : [];

  // Team complementarity: profiles the team lacks vs what this person brings.
  const teamProfileTotals: Partial<Record<ProfileId, number>> = {};
  for (const mate of teammates) {
    for (const [pid, score] of Object.entries(mate.results!.profileScores)) {
      teamProfileTotals[pid as ProfileId] = (teamProfileTotals[pid as ProfileId] ?? 0) + score;
    }
  }
  const sortedTeamProfiles = Object.entries(teamProfileTotals).sort((a, b) => b[1]! - a[1]!);
  const teamTopProfile = sortedTeamProfiles[0]?.[0] as ProfileId | undefined;
  const teamGapProfile = sortedTeamProfiles.length
    ? (sortedTeamProfiles[sortedTeamProfiles.length - 1][0] as ProfileId)
    : undefined;
  const bringsGap = teamGapProfile
    ? results.profileScores[teamGapProfile] >= 50
    : false;
  const synergy = teamTopProfile ? synergyNote(results.primaryProfile, teamTopProfile) : null;

  const dots: MapDot[] = [
    ...teammates.map((m) => ({
      ...mapPosition(m.results!.profileScores),
      label: m.name.split(" ")[0],
    })),
    { ...mapPosition(results.profileScores), label: person.name.split(" ")[0], highlight: true },
  ];

  const dateStr = person.completedAt
    ? new Date(person.completedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/recruit" className="text-sm text-deep/60 hover:text-deep">
          ← {t("common.back")}
        </Link>
        <div className="flex gap-3">
          {person.kind === "candidate" ? (
            <button onClick={convertToEmployee} className="btn-ghost">
              {t("recruit.convert")}
            </button>
          ) : null}
          <Link href={`/admin/people/${person.id}/digest`} className="btn-ghost">
            {person.kind === "employee"
              ? fr ? "Ouvrir la synthèse" : "Open summary"
              : t("report.openDigest")}
          </Link>
          <PrintButton label={t("report.downloadPdf")} />
        </div>
      </div>

      {/* Header */}
      <div className="print-page mb-4 rounded-blob bg-deep p-8 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-sky">
              Apex · {isEmployee ? t("report.fullTitleEmployee") : t("report.fullTitle")}
            </div>
            <h1 className="mt-2 font-heading text-3xl">{person.name}</h1>
            <p className="mt-1 text-sm text-white/70">
              {role ? `${t("common.role")}: ${l(role.title)}` : null}
              {team ? ` · ${t("common.team")}: ${team.name}` : null}
              {dateStr ? ` · ${dateStr}` : null}
            </p>
          </div>
          <span className="rounded-full bg-coral px-3 py-1.5 text-xs font-semibold">
            {t("report.confidential")}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <ProfileHero results={results} />

        {/* Culture alignment */}
        <div className="print-page card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-heading text-lg text-deep">{t("report.culture")}</h3>
              <p className="text-xs text-ink/50">{t("report.cultureVs")}</p>
            </div>
            <div className="text-right">
              {isEmployee ? (
                <span className="rounded-full bg-deep/10 px-4 py-2 text-sm font-bold text-deep">
                  {fr ? "Manifeste" : "Manifesto"} · {results.cultureScore.toFixed(1)} / 5
                </span>
              ) : (
                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    results.cultureScore >= 3.7
                      ? "bg-deep text-white"
                      : results.cultureScore >= 3
                        ? "bg-sky text-deep"
                        : "bg-coral text-white"
                  }`}
                >
                  {l(band.label)} · {results.cultureScore.toFixed(1)} / 5
                </span>
              )}
            </div>
          </div>
          <p className="mt-3 text-sm text-ink/60">
            {isEmployee
              ? fr
                ? "Lecture de l'alignement déclaré avec le Manifeste — un point de départ pour les conversations de développement, pas une note."
                : "A read of declared alignment with the Manifesto — a starting point for development conversations, not a grade."
              : l(band.description)}
          </p>
          <div className="mt-5 divide-y divide-cloud/70">
            {VALUES.map((v) => {
              const score = results.valueScores[v.id];
              const insight =
                score > 3.5
                  ? { title: t("report.valueHigh"), why: v.highWhy, examples: v.highExamples, low: false }
                  : score < 2.7
                    ? {
                        title: isEmployee ? t("report.valueGrowth") : t("report.valueLow"),
                        why: v.lowWhy,
                        examples: v.lowExamples,
                        low: true,
                      }
                    : null;
              return (
                <div key={v.id}>
                  <Scale5 label={l(v.name)} sublabel={l(v.scope)} value={score} />
                  {insight ? (
                    <div
                      className={`mb-4 rounded-xl p-3.5 text-xs leading-relaxed ${
                        insight.low
                          ? isEmployee
                            ? "border border-lavender/50 bg-lavender/10"
                            : "border border-coral/25 bg-coral/5"
                          : "bg-cloud/50"
                      }`}
                    >
                      <div
                        className={`font-semibold uppercase tracking-wide ${
                          insight.low ? (isEmployee ? "text-deep/70" : "text-coral") : "text-deep/70"
                        }`}
                      >
                        {insight.title}
                      </div>
                      <p className="mt-1.5 text-ink/70">{l(insight.why)}</p>
                      <ul className="mt-2 space-y-1 text-ink/70">
                        {insight.examples.map((ex, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span className={insight.low ? "text-coral" : "text-deep/50"}>•</span>
                            {l(ex)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Role match */}
        {results.roleMatch && role ? (
          <div className="print-page card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-lg text-deep">
                  {t("report.roleMatch")} — {l(role.title)}
                </h3>
                <p className="text-xs text-ink/50">
                  {t("report.roleVs")}
                  {role.derived ? " *" : ""}
                  {isEmployee
                    ? fr
                      ? " · lu en développement : les écarts sont des priorités de travail, pas une évaluation"
                      : " · read for development: gaps are priorities to work on, not an appraisal"
                    : ""}
                </p>
                {ROLE_EXPECTATIONS_MAP[role.id] ? (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="rounded-full bg-deep/10 px-2 py-0.5 font-semibold text-deep">
                      {lang === "fr" ? "Niveau attendu" : "Expected level"}:{" "}
                      {ROLE_EXPECTATIONS_MAP[role.id].level === "junior"
                        ? "Junior"
                        : ROLE_EXPECTATIONS_MAP[role.id].level === "mid"
                          ? lang === "fr" ? "Confirmé" : "Mid"
                          : "Senior"}
                    </span>
                    <span className="rounded-full bg-coral/10 px-2 py-0.5 font-semibold text-coral">
                      {t("ref.keyKpi")}: {l(ROLE_EXPECTATIONS_MAP[role.id].keyKpi)}
                    </span>
                    {ROLE_EXPECTATIONS_MAP[role.id].competencies.map((code) => (
                      <span
                        key={code}
                        title={l(FRAMEWORK_MAP[code].name)}
                        className="cursor-help rounded-full bg-cloud px-2 py-0.5 font-semibold text-ink/60"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <span className="rounded-full bg-deep px-4 py-2 text-sm font-bold text-white">
                {t("common.overall")} · {results.roleMatch.overall.toFixed(1)} / 5
              </span>
            </div>
            <div className="mt-5 divide-y divide-cloud/70">
              {results.roleMatch.factors.map((f, i) => (
                <Scale5
                  key={i}
                  label={l(f.label)}
                  sublabel={l(COMPETENCY_MAP[f.competency].name)}
                  value={f.rating}
                />
              ))}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-cloud/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-deep/70">
                  {t("report.asContributor")}
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                  {results.roleMatch.factors
                    .filter((f) => f.rating >= 4)
                    .slice(0, 3)
                    .map((f, i) => (
                      <li key={i}>✓ {l(f.label)}</li>
                    ))}
                  {results.roleMatch.factors
                    .filter((f) => f.rating <= 2)
                    .slice(0, 2)
                    .map((f, i) => (
                      <li key={`w${i}`} className="text-coral">
                        ⚠ {l(f.label)}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-cloud/60 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-deep/70">
                  {t("report.asTeamFit")}
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-ink/80">
                  <li>
                    {primary.emoji} {l(primary.teamContribution)}
                  </li>
                  {synergy ? <li>◆ {l(synergy)}</li> : null}
                  {teamGapProfile && bringsGap ? (
                    <li>
                      ✓ {PROFILE_MAP[teamGapProfile].emoji} {l(PROFILE_MAP[teamGapProfile].teamContribution)}
                    </li>
                  ) : null}
                  <li className="text-coral">⚠ {l(primary.watchouts[0])}</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {role && results && ROLE_EXPECTATIONS_MAP[role.id] ? (
          <ExpectedCompetenciesBlock
            firstName={person.name.split(" ")[0]}
            roleId={role.id}
            results={results}
            employee={person.kind === "employee"}
          />
        ) : null}

        <StrengthsWatchouts results={results} />

        {/* Team dynamics */}
        {team ? (
          <div className="print-page card">
            <h3 className="font-heading text-lg text-deep">
              {t("report.teamFit")} — {team.name}
            </h3>
            {teammates.length ? (
              <div className="mt-4">
                <TeamMap
                  dots={dots}
                  axisX={t("dyn.axisX")}
                  axisY={t("dyn.axisY")}
                  quadrants={[
                    `${PROFILE_MAP["race-engineer"].emoji} ${PROFILE_MAP["team-principal"].emoji}`,
                    `${PROFILE_MAP["pit-crew"].emoji} ${PROFILE_MAP.driver.emoji}`,
                    `${PROFILE_MAP.telemetry.emoji} ${PROFILE_MAP.aerodynamicist.emoji}`,
                    `${PROFILE_MAP["chief-mechanic"].emoji}`,
                  ]}
                />
                <p className="mt-2 text-xs text-ink/40">{t("dyn.candidateOverlay")}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink/50">{t("dyn.noMembers")}</p>
            )}
          </div>
        ) : null}

        {/* Coaching (employees) */}
        {person.kind === "employee" ? (
          <div className="print-page grid gap-4 md:grid-cols-3">
            <div className="card">
              <h3 className="font-heading text-base text-deep">{t("report.motivators")}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/80">
                {primary.motivators.map((m, i) => (
                  <li key={i}>▲ {l(m)}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-heading text-base text-deep">{t("report.frustrations")}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/80">
                {primary.frustrations.map((m, i) => (
                  <li key={i}>▽ {l(m)}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-heading text-base text-deep">{t("report.coachTips")}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink/80">
                {primary.coachTips.map((m, i) => (
                  <li key={i}>→ {l(m)}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        <WorkstyleBlock results={results} />
      </div>

      <Disclaimer />
    </div>
  );
}
