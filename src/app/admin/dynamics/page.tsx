"use client";

import { useMemo, useState } from "react";
import { PROFILES, PROFILE_MAP, mapPosition, topProfiles, bottomProfiles } from "@/lib/profiles";
import { ROLE_MAP } from "@/data/roles";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { PrintButton, SectionTitle } from "@/components/ui";
import { Bar100, TeamMap, type MapDot } from "@/components/charts";
import type { L10n, Person, ProfileId } from "@/lib/types";

/**
 * Table-Group-style team map: profiles as columns, two bands as rows —
 * the natural zone (top-2 profiles, primary marked ★) and the stretch
 * zone (bottom-2 scores). Reads at a glance who carries what, and which
 * profiles nobody carries.
 */
function TeamMapGrid({ members, l }: { members: Person[]; l: (s: L10n) => string }) {
  const { t } = useI18n();
  const firstName = (p: Person) => p.name.split(" ")[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            <th className="w-20" />
            {PROFILES.map((prof) => (
              <th key={prof.id} className="rounded-t-xl bg-deep px-1.5 py-2.5 text-center align-bottom">
                <div className="text-xl leading-none">{prof.emoji}</div>
                <div className="mt-1.5 text-[10px] font-semibold leading-tight text-white">
                  {l(prof.shortName)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="rounded-l-xl bg-sky/40 px-2 py-3 text-[10px] font-bold uppercase leading-tight tracking-wide text-deep">
              {t("dyn.zoneNatural")}
            </td>
            {PROFILES.map((prof) => {
              const primaries = members.filter((m) => m.results!.primaryProfile === prof.id);
              const secondaries = members.filter(
                (m) =>
                  m.results!.primaryProfile !== prof.id &&
                  topProfiles(m.results!.profileScores).includes(prof.id)
              );
              const empty = primaries.length + secondaries.length === 0;
              return (
                <td
                  key={prof.id}
                  className={`min-w-[72px] rounded-lg px-1.5 py-2.5 text-center align-top text-[11px] leading-snug ${
                    empty ? "border border-dashed border-coral/40 bg-coral/5" : "bg-sky/20"
                  }`}
                >
                  {primaries.map((m) => (
                    <div key={m.id} className="font-bold text-deep">
                      ★ {firstName(m)}
                    </div>
                  ))}
                  {secondaries.map((m) => (
                    <div key={m.id} className="text-ink/75">
                      {firstName(m)}
                    </div>
                  ))}
                  {empty ? <span className="text-xs font-semibold text-coral">—</span> : null}
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="rounded-l-xl bg-coral/15 px-2 py-3 text-[10px] font-bold uppercase leading-tight tracking-wide text-coral">
              {t("dyn.zoneStretch")}
            </td>
            {PROFILES.map((prof) => {
              const inStretch = members.filter((m) =>
                bottomProfiles(m.results!.profileScores).includes(prof.id)
              );
              return (
                <td
                  key={prof.id}
                  className="min-w-[72px] rounded-lg bg-cloud/60 px-1.5 py-2.5 text-center align-top text-[11px] leading-snug"
                >
                  {inStretch.map((m) => (
                    <div key={m.id} className="text-ink/55">
                      {firstName(m)}
                    </div>
                  ))}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[11px] text-ink/45">{t("dyn.gridLegend")}</p>
    </div>
  );
}

/** Deterministic collision fan-out so overlapping dots stay readable. */
function spreadDots(dots: MapDot[]): MapDot[] {
  const placed: MapDot[] = [];
  for (const d of dots) {
    let { x, y } = d;
    let k = 0;
    while (placed.some((p) => Math.hypot(p.x - x, p.y - y) < 0.055) && k < 12) {
      k++;
      x = d.x + 0.05 * Math.cos(k * 2.4) * Math.ceil(k / 2);
      y = d.y + 0.045 * Math.sin(k * 2.4) * Math.ceil(k / 2);
      x = Math.min(0.97, Math.max(0.03, x));
      y = Math.min(0.97, Math.max(0.03, y));
    }
    placed.push({ ...d, x, y });
  }
  return placed;
}

interface Insight {
  icon: string;
  tone: "strength" | "risk" | "info";
  text: L10n;
}

/** Auto-generated reading of the team, Table-Group style. */
function buildInsights(members: Person[]): Insight[] {
  const insights: Insight[] = [];
  if (members.length < 2) {
    insights.push({
      icon: "ℹ",
      tone: "info",
      text: {
        en: "At least two completed assessments are needed for a meaningful team reading.",
        fr: "Il faut au moins deux évaluations complétées pour une lecture d’équipe pertinente.",
      },
    });
    return insights;
  }

  // Center of gravity: most frequent primary profile.
  const primaryCount = new Map<ProfileId, Person[]>();
  for (const m of members) {
    const pid = m.results!.primaryProfile;
    primaryCount.set(pid, [...(primaryCount.get(pid) ?? []), m]);
  }
  const [topPid, topMembers] = [...primaryCount.entries()].sort((a, b) => b[1].length - a[1].length)[0];
  if (topMembers.length >= 2) {
    const prof = PROFILE_MAP[topPid];
    insights.push({
      icon: prof.emoji,
      tone: "strength",
      text: {
        en: `Center of gravity: ${topMembers.length} of ${members.length} members lead with ${prof.name.en}. ${prof.teamContribution.en} With several of them, this strength is reliable — and its watch-out (${prof.watchouts[0].en.toLowerCase()}) can become a collective blind spot.`,
        fr: `Centre de gravité : ${topMembers.length} membres sur ${members.length} ont ${prof.name.fr} comme profil principal. ${prof.teamContribution.fr} À plusieurs, cette force est fiable — et son point de vigilance (${prof.watchouts[0].fr.toLowerCase()}) peut devenir un angle mort collectif.`,
      },
    });
  }

  // Gaps: profiles in nobody's natural zone (top-2).
  const natural = new Set<ProfileId>();
  for (const m of members) topProfiles(m.results!.profileScores).forEach((pid) => natural.add(pid));
  const gaps = PROFILES.filter((p) => !natural.has(p.id));
  for (const prof of gaps.slice(0, 3)) {
    insights.push({
      icon: prof.emoji,
      tone: "risk",
      text: {
        en: `Nobody carries ${prof.name.en} naturally. The team may lack what this profile brings: ${prof.teamContribution.en.toLowerCase()} Cover it consciously — assign it explicitly, or factor it into the next hire.`,
        fr: `Personne ne porte naturellement ${prof.name.fr}. L’équipe peut manquer de ce que ce profil apporte : ${prof.teamContribution.fr.toLowerCase()} À couvrir consciemment — en l’assignant explicitement, ou en l’intégrant au prochain recrutement.`,
      },
    });
  }
  if (gaps.length === 0) {
    insights.push({
      icon: "✓",
      tone: "strength",
      text: {
        en: "Every profile sits in at least one member's natural zone — the team can cover all eight contributions without forcing anyone into a stretch zone.",
        fr: "Chaque profil est dans la zone naturelle d’au moins une personne — l’équipe peut couvrir les huit contributions sans forcer personne en zone d’effort.",
      },
    });
  }

  // Axis balance, based on primary-profile anchors.
  const action = members.filter((m) => PROFILE_MAP[m.results!.primaryProfile].mapX > 0.5);
  const people = members.filter((m) => PROFILE_MAP[m.results!.primaryProfile].mapY > 0.5);
  const share = (n: number) => n / members.length;
  if (share(action.length) >= 0.7) {
    insights.push({
      icon: "⚡",
      tone: "info",
      text: {
        en: `The team leans strongly toward action (${action.length}/${members.length}): delivery will be fast, but framing, anticipation and analysis need deliberate space — protect thinking time before committing.`,
        fr: `L’équipe penche fortement vers l’action (${action.length}/${members.length}) : la livraison sera rapide, mais le cadrage, l’anticipation et l’analyse demandent un espace délibéré — protégez le temps de réflexion avant de s’engager.`,
      },
    });
  } else if (share(action.length) <= 0.3) {
    insights.push({
      icon: "🔍",
      tone: "info",
      text: {
        en: `The team leans strongly toward reflection (${members.length - action.length}/${members.length}): analysis will be solid, but momentum can stall — set explicit decision deadlines and name an owner for execution.`,
        fr: `L’équipe penche fortement vers la réflexion (${members.length - action.length}/${members.length}) : l’analyse sera solide, mais l’élan peut retomber — fixez des échéances de décision explicites et un·e responsable de l’exécution.`,
      },
    });
  }
  if (share(people.length) >= 0.7) {
    insights.push({
      icon: "🤝",
      tone: "info",
      text: {
        en: `Strong people orientation (${people.length}/${members.length}): alignment and support come naturally; systems, process and measurement discipline may need explicit ownership.`,
        fr: `Forte orientation personnes (${people.length}/${members.length}) : l’alignement et le soutien sont naturels ; les systèmes, les processus et la discipline de mesure demandent un·e propriétaire explicite.`,
      },
    });
  } else if (share(people.length) <= 0.3) {
    insights.push({
      icon: "⚙️",
      tone: "info",
      text: {
        en: `Strong systems orientation (${members.length - people.length}/${members.length}): process and rigor come naturally; make space for the human side — recognition, alignment conversations, onboarding.`,
        fr: `Forte orientation systèmes (${members.length - people.length}/${members.length}) : les processus et la rigueur sont naturels ; ménagez la dimension humaine — reconnaissance, conversations d’alignement, intégration.`,
      },
    });
  }

  // Shared stretch zone: a profile in ≥ half the team's bottom-2.
  const stretchCount = new Map<ProfileId, number>();
  for (const m of members)
    bottomProfiles(m.results!.profileScores).forEach((pid) =>
      stretchCount.set(pid, (stretchCount.get(pid) ?? 0) + 1)
    );
  const sharedStretch = [...stretchCount.entries()]
    .filter(([, n]) => n >= Math.ceil(members.length / 2) && members.length >= 3)
    .sort((a, b) => b[1] - a[1]);
  for (const [pid, n] of sharedStretch.slice(0, 2)) {
    const prof = PROFILE_MAP[pid];
    insights.push({
      icon: "⚠",
      tone: "risk",
      text: {
        en: `${prof.name.en} sits in the stretch zone of ${n} of ${members.length} members: tasks that require it will drain the team. Rotate them explicitly rather than letting them fall on the same person.`,
        fr: `${prof.name.fr} est en zone d’effort pour ${n} membres sur ${members.length} : les tâches qui l’exigent fatigueront l’équipe. Faites-les tourner explicitement plutôt que de les laisser retomber sur la même personne.`,
      },
    });
  }

  return insights;
}

export default function DynamicsPage() {
  const { t, l } = useI18n();
  const { db, refresh } = useAdminState();
  const [selected, setSelected] = useState<string>("all");
  const [teamName, setTeamName] = useState("");

  const employees = useMemo(
    () => (db?.people ?? []).filter((p) => p.kind === "employee" && p.results),
    [db]
  );
  const members: Person[] =
    selected === "all" ? employees : employees.filter((p) => p.teamId === selected);

  const scopeName =
    selected === "all" ? t("dyn.allHubcycle") : (db?.teams ?? []).find((tm) => tm.id === selected)?.name ?? "";

  // Profile coverage: average score of members on each profile dimension.
  const coverage = PROFILES.map((prof) => {
    const avg = members.length
      ? Math.round(members.reduce((s, m) => s + m.results!.profileScores[prof.id], 0) / members.length)
      : 0;
    return { prof, avg };
  });

  const dots: MapDot[] = spreadDots(
    members.map((m) => ({
      ...mapPosition(m.results!.profileScores),
      label: m.name.split(" ")[0],
    }))
  );

  const insights = buildInsights(members);

  async function createTeam(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName }),
    });
    setTeamName("");
    await refresh();
  }

  async function assign(personId: string, teamId: string) {
    await fetch(`/api/people/${personId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId }),
    });
    await refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionTitle title={t("dyn.title")} sub={t("dyn.sub")} />
        <div className="no-print">
          <PrintButton label={t("dyn.download")} />
        </div>
      </div>

      <div className="no-print mb-6 flex flex-wrap items-center gap-3">
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
        <form onSubmit={createTeam} className="ml-auto flex items-center gap-2">
          <input
            className="input !w-44"
            placeholder={t("dyn.teamName")}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button className="btn-ghost" disabled={!teamName.trim()}>
            {t("dyn.create")}
          </button>
        </form>
      </div>

      {/* Table-Group-style team map */}
      <div className="print-page card">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-heading text-lg text-deep">
            {t("dyn.map")} — {scopeName}
          </h3>
          <p className="text-xs text-ink/50">
            {members.length} {t("dyn.members")}
          </p>
        </div>
        {members.length ? (
          <div className="mt-5">
            <TeamMapGrid members={members} l={l} />
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink/40">{t("dyn.noMembers")}</p>
        )}
      </div>

      {/* Insights */}
      {members.length ? (
        <div className="print-page card mt-4">
          <h3 className="font-heading text-lg text-deep">{t("dyn.insights")}</h3>
          <ul className="mt-4 space-y-3">
            {insights.map((ins, i) => (
              <li
                key={i}
                className={`flex gap-3 rounded-xl p-3.5 text-sm leading-relaxed ${
                  ins.tone === "risk"
                    ? "border border-coral/25 bg-coral/5 text-ink/80"
                    : ins.tone === "strength"
                      ? "bg-sky/20 text-ink/80"
                      : "bg-cloud/50 text-ink/75"
                }`}
              >
                <span className="shrink-0 text-base leading-none">{ins.icon}</span>
                <span>{l(ins.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Positioning scatter + coverage */}
      {members.length ? (
        <div className="print-page mt-4 grid gap-4 lg:grid-cols-5">
          <div className="card lg:col-span-3">
            <h3 className="font-heading text-lg text-deep">{t("dyn.scatter")}</h3>
            <div className="mt-4">
              <TeamMap
                dots={dots}
                axisX={t("dyn.axisX")}
                axisY={t("dyn.axisY")}
                quadrants={["🎧 🎯", "⚡ 🏁", "📡 🌬️", "🔧 📊"]}
              />
            </div>
          </div>
          <div className="card lg:col-span-2">
            <h3 className="font-heading text-lg text-deep">{t("dyn.coverage")}</h3>
            <div className="mt-4 space-y-3">
              {coverage.map(({ prof, avg }) => (
                <div key={prof.id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-ink">
                      {prof.emoji} {l(prof.name)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        avg >= 40 ? "bg-deep/10 text-deep" : "bg-coral/15 text-coral"
                      }`}
                    >
                      {avg >= 40 ? t("dyn.wellCovered") : t("dyn.gap")}
                    </span>
                  </div>
                  <Bar100 value={avg} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Members & team assignment */}
      <div className="no-print card mt-6 overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cloud text-left text-xs uppercase tracking-wide text-deep/60">
              <th className="px-5 py-3">{t("common.employees")}</th>
              <th className="px-5 py-3">{t("common.role")}</th>
              <th className="px-5 py-3">{t("report.profile")}</th>
              <th className="px-5 py-3">{t("common.team")}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((p) => {
              const role = p.roleId ? ROLE_MAP[p.roleId] : undefined;
              const primary = PROFILE_MAP[p.results!.primaryProfile];
              const secondary = PROFILE_MAP[p.results!.secondaryProfile];
              return (
                <tr key={p.id} className="border-b border-cloud/60">
                  <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-5 py-3 text-ink/70">{role ? l(role.title) : "—"}</td>
                  <td className="px-5 py-3">
                    <div>
                      {primary.emoji} {l(primary.name)}
                    </div>
                    <div className="text-xs text-ink/45">
                      {secondary.emoji} {l(secondary.name)}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="input !w-48 !py-1.5"
                      value={p.teamId ?? ""}
                      onChange={(e) => assign(p.id, e.target.value)}
                    >
                      <option value="">—</option>
                      {(db?.teams ?? []).map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
