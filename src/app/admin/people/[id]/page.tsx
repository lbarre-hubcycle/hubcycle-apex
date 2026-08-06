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
import { commercialFit, commercialStyleOf, roleCommercialNeed } from "@/lib/commercial-style";
import { FRAMEWORK_MAP, ROLE_EXPECTATIONS_MAP } from "@/data/competency-framework";
import { Disclaimer, ProfileHero, StrengthsWatchouts, WorkstyleBlock } from "@/components/report";
import type { Person, ProfileId, Team } from "@/lib/types";

interface Payload {
  person: Person;
  people: Person[];
  teams: Team[];
}


/**
 * Hunting vs farming debrief: what the role's competency expectations
 * require (B1 / B2) versus the candidate's declared commercial style.
 * Full report only — never in the candidate digest.
 */
function CommercialStyleBlock({
  firstName,
  roleId,
  results,
}: {
  firstName: string;
  roleId: string;
  results: NonNullable<Person["results"]>;
}) {
  const { t, l, lang } = useI18n();
  const fr = lang === "fr";
  const need = roleCommercialNeed(roleId)!;
  const read = commercialStyleOf(results);
  const fit = commercialFit(need, read);
  const pos = Math.min(95, Math.max(5, 50 + read.delta / 2));

  const needTxt =
    need === "both"
      ? fr
        ? "les deux registres — ouvrir de nouveaux comptes (chasse, B1) et faire grandir l’existant (culture, B2)"
        : "both registers — opening new accounts (hunting, B1) and growing existing ones (farming, B2)"
      : need === "hunting"
        ? fr
          ? "un fort drive de conquête : prospection, qualification, closing (chasse, B1)"
          : "a strong new-business drive: prospecting, qualification, closing (hunting, B1)"
        : fr
          ? "un développement de comptes solide : satisfaction, rétention, upsell (culture, B2)"
          : "solid account development: satisfaction, retention, upsell (farming, B2)";

  const styleTxt =
    read.style === "hunter"
      ? fr
        ? "un profil de chasseur marqué"
        : "a marked hunter profile"
      : read.style === "farmer"
        ? fr
          ? "un profil de cultivateur marqué"
          : "a marked farmer profile"
        : fr
          ? "un profil équilibré entre chasse et culture"
          : "a balanced hunter-farmer profile";

  const verdict =
    fit === "match"
      ? fr
        ? "Alignement net entre le style déclaré et l’exigence commerciale du poste."
        : "Clear alignment between the declared style and the role's commercial requirement."
      : fit === "partial"
        ? fr
          ? "Alignement partiel : le registre le moins naturel demandera un étayage conscient (coaching, binôme, rituels de prospection ou de suivi de comptes)."
          : "Partial alignment: the less natural register will need conscious scaffolding (coaching, pairing, prospecting or account-review rituals)."
        : fr
          ? "Écart notable entre ce que le poste exige et le style déclaré — à explorer explicitement en entretien avant de conclure."
          : "Notable gap between what the role requires and the declared style — explore it explicitly in interview before concluding.";

  const questions =
    need === "farming"
      ? [
          fr
            ? "Racontez-moi comment vous avez fait grandir votre compte le plus stratégique : qu’avez-vous fait, sur quelle durée, avec quel résultat ?"
            : "Tell me how you grew your most strategic account: what did you do, over what period, with what result?",
        ]
      : need === "hunting"
        ? [
            fr
              ? "Racontez-moi le dernier compte que vous avez ouvert à partir de rien : votre démarche concrète, semaine par semaine, jusqu’à la signature."
              : "Tell me about the last account you opened from scratch: your concrete approach, week by week, up to signature.",
          ]
        : [
            fr
              ? "Sur votre dernier portefeuille : quelle part de votre temps entre ouvrir de nouveaux comptes et développer l’existant — et qu’est-ce qui vous a le plus réussi ?"
              : "On your last portfolio: how did you split your time between opening new accounts and growing existing ones — and which worked best for you?",
          ];

  return (
    <div className="print-page card">
      <h3 className="font-heading text-lg text-deep">
        {fr ? "Style commercial — chasse vs culture" : "Commercial style — hunting vs farming"}
      </h3>
      <p className="mt-1 text-xs text-ink/50">
        {fr
          ? "Lecture issue des préférences déclarées, croisée avec les compétences attendues du poste (référentiel)."
          : "Read from declared preferences, crossed with the role's expected competencies (referential)."}
      </p>

      <div className="mt-5">
        <div className="mb-1.5 flex justify-between text-xs font-semibold text-deep">
          <span>{fr ? "🌱 Culture (comptes)" : "🌱 Farming (accounts)"}</span>
          <span>{fr ? "🎯 Chasse (conquête)" : "🎯 Hunting (new business)"}</span>
        </div>
        <div className="relative h-3 rounded-full bg-gradient-to-r from-sky/60 via-cloud to-coral/50">
          <span
            className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-deep shadow"
            style={{ left: `${pos}%` }}
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Bar100 label={fr ? "Score conquête" : "Hunting score"} value={read.hunter} />
          <Bar100 label={fr ? "Score développement" : "Farming score"} value={read.farmer} />
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl p-4 text-sm leading-relaxed ${
          fit === "match" ? "bg-sky/20 text-ink/80" : fit === "partial" ? "bg-cloud/60 text-ink/80" : "border border-coral/30 bg-coral/5 text-ink/80"
        }`}
      >
        <p>
          {fr
            ? `Ce poste exige ${needTxt}. Les préférences déclarées de ${firstName} dessinent ${styleTxt} (conquête ${read.hunter}/100 · développement ${read.farmer}/100).`
            : `This role requires ${needTxt}. ${firstName}'s declared preferences show ${styleTxt} (hunting ${read.hunter}/100 · farming ${read.farmer}/100).`}
        </p>
        <p className="mt-2 font-medium">{verdict}</p>
        <p className="mt-2 text-xs text-ink/55">
          {fr ? "À poser en entretien : " : "To ask in interview: "}
          {questions[0]}
        </p>
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
            {t("report.openDigest")}
          </Link>
          <PrintButton label={t("report.downloadPdf")} />
        </div>
      </div>

      {/* Header */}
      <div className="print-page mb-4 rounded-blob bg-deep p-8 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-sky">
              Apex · {t("report.fullTitle")}
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
            </div>
          </div>
          <p className="mt-3 text-sm text-ink/60">{l(band.description)}</p>
          <div className="mt-5 divide-y divide-cloud/70">
            {VALUES.map((v) => {
              const score = results.valueScores[v.id];
              const insight =
                score > 3.5
                  ? { title: t("report.valueHigh"), why: v.highWhy, examples: v.highExamples, low: false }
                  : score < 2.7
                    ? { title: t("report.valueLow"), why: v.lowWhy, examples: v.lowExamples, low: true }
                    : null;
              return (
                <div key={v.id}>
                  <Scale5 label={l(v.name)} sublabel={l(v.scope)} value={score} />
                  {insight ? (
                    <div
                      className={`mb-4 rounded-xl p-3.5 text-xs leading-relaxed ${
                        insight.low ? "border border-coral/25 bg-coral/5" : "bg-cloud/50"
                      }`}
                    >
                      <div
                        className={`font-semibold uppercase tracking-wide ${
                          insight.low ? "text-coral" : "text-deep/70"
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

        {role && results && roleCommercialNeed(role.id) ? (
          <CommercialStyleBlock
            firstName={person.name.split(" ")[0]}
            roleId={role.id}
            results={results}
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
