"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ROLE_MAP } from "@/data/roles";
import { PROFILE_MAP, synergyNote } from "@/lib/profiles";
import { COMPETENCY_MAP } from "@/lib/competencies";
import { CULTURE_BANDS, VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { PrintButton } from "@/components/ui";
import { Scale5, TeamMap, type MapDot } from "@/components/charts";
import { Disclaimer, ProfileHero, StrengthsWatchouts, WorkstyleBlock } from "@/components/report";
import type { Person, ProfileId, Team } from "@/lib/types";

interface Payload {
  person: Person;
  people: Person[];
  teams: Team[];
}

/** Position on the team map = score-weighted average of profile anchors. */
function mapPosition(scores: Record<ProfileId, number>): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let total = 0;
  for (const [pid, score] of Object.entries(scores)) {
    const def = PROFILE_MAP[pid as ProfileId];
    const w = Math.max(score, 1);
    x += def.mapX * w;
    y += def.mapY * w;
    total += w;
  }
  return { x: x / total, y: y / total };
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
    ? people.filter((p) => p.teamId === team.id && p.results && p.id !== person.id && p.kind === "employee")
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
            {VALUES.map((v) => (
              <Scale5 key={v.id} label={l(v.name)} sublabel={l(v.scope)} value={results.valueScores[v.id]} />
            ))}
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
