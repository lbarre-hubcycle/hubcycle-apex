"use client";

import { useMemo, useState } from "react";
import { PROFILES, PROFILE_MAP, mapPosition, topProfiles, bottomProfiles } from "@/lib/profiles";
import { PROFILE_INSIGHTS, bareName } from "@/lib/profile-insights";
import { teamDemand, demandTier, type TeamDemand } from "@/lib/team-demand";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { PrintButton, SectionTitle } from "@/components/ui";
import { TeamMap, type MapDot } from "@/components/charts";
import type { L10n, Person, ProfileId } from "@/lib/types";

/** Hoverable profile label with a definition tooltip. */
function ProfileLabel({ profile }: { profile: (typeof PROFILES)[number] }) {
  const { t, l } = useI18n();
  return (
    <div className="group relative inline-block">
      <span className="cursor-help text-sm font-semibold text-deep underline decoration-dotted decoration-deep/30 underline-offset-4">
        {profile.emoji} {l(profile.name)}
      </span>
      <div className="invisible absolute left-0 top-full z-30 mt-2 w-72 rounded-2xl border border-cloud bg-white p-4 opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
        <div className="text-sm font-semibold text-deep">
          {profile.emoji} {l(profile.name)}
        </div>
        <p className="mt-1 text-xs text-ink/70">{l(profile.tagline)}</p>
        <p className="mt-2 text-xs text-ink/70">{l(profile.teamContribution)}</p>
        <div className="mt-2 border-t border-cloud pt-2">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-deep/50">
            {t("report.strengths")}
          </div>
          <p className="text-xs text-ink/70">{l(profile.strengths[0])}</p>
          <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-coral/80">
            {t("report.watchouts")}
          </div>
          <p className="text-xs text-ink/70">{l(profile.watchouts[0])}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Table-Group-style team map: profiles as rows, two zone columns —
 * the natural zone (top-2 profiles, primary marked ★) and the stretch
 * zone (bottom-2 scores). Reads at a glance who carries what, and which
 * profiles nobody carries. Hover a profile name for its definition.
 */
function TeamMapGrid({ members }: { members: Person[]; l: (s: L10n) => string }) {
  const { t } = useI18n();
  const firstName = (p: Person) => p.name.split(" ")[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            <th className="w-52" />
            <th className="rounded-t-xl bg-deep px-3 py-2 text-center text-xs font-semibold text-white">
              {t("dyn.zoneNatural")}
            </th>
            <th className="rounded-t-xl bg-cloud px-3 py-2 text-center text-xs font-semibold text-ink/60">
              {t("dyn.zoneStretch")}
            </th>
          </tr>
        </thead>
        <tbody>
          {PROFILES.map((prof) => {
            const primaries = members.filter((m) => m.results!.primaryProfile === prof.id);
            const secondaries = members.filter(
              (m) =>
                m.results!.primaryProfile !== prof.id &&
                topProfiles(m.results!.profileScores).includes(prof.id)
            );
            const inStretch = members.filter((m) =>
              bottomProfiles(m.results!.profileScores).includes(prof.id)
            );
            const empty = primaries.length + secondaries.length === 0;
            return (
              <tr key={prof.id}>
                <td className="rounded-l-xl bg-cloud/40 px-3 py-2.5">
                  <ProfileLabel profile={prof} />
                </td>
                <td
                  className={`w-[38%] rounded-lg px-2 py-2.5 text-center align-middle text-[12px] leading-snug ${
                    empty ? "border border-dashed border-coral/40 bg-coral/5" : "bg-sky/20"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                    {primaries.map((m) => (
                      <span key={m.id} className="font-bold text-deep">
                        ★ {firstName(m)}
                      </span>
                    ))}
                    {secondaries.map((m) => (
                      <span key={m.id} className="text-ink/75">
                        {firstName(m)}
                      </span>
                    ))}
                    {empty ? <span className="text-xs font-semibold text-coral">—</span> : null}
                  </div>
                </td>
                <td className="w-[30%] rounded-lg bg-cloud/60 px-2 py-2.5 text-center align-middle text-[12px] leading-snug">
                  <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                    {inStretch.map((m) => (
                      <span key={m.id} className="text-ink/55">
                        {firstName(m)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
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

/** "“success factor” (Role title)" example string from the demand drivers. */
function exampleFor(td: TeamDemand, pid: ProfileId): L10n | null {
  const ds = td.drivers[pid];
  if (!ds.length) return null;
  return {
    en: ds.map((d) => `“${d.factor.en}” (${d.role.en})`).join(", "),
    fr: ds.map((d) => `« ${d.factor.fr} » (${d.role.fr})`).join(", "),
  };
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

  // Role-aware demand: which profiles this team's fiches de poste rely on.
  const td = teamDemand(members);

  // Strong representation: a profile in the natural zone of at least half
  // the team (min 2 people). A reliable strength — and a dynamic to watch:
  // a heavy focus on one role shapes how the whole team behaves.
  const repCounts = new Map<ProfileId, number>();
  for (const m of members)
    topProfiles(m.results!.profileScores).forEach((pid) =>
      repCounts.set(pid, (repCounts.get(pid) ?? 0) + 1)
    );
  const strong = [...repCounts.entries()]
    .filter(([, n]) => n >= Math.max(2, Math.ceil(members.length / 2)))
    .sort((a, b) => b[1] - a[1]);
  for (const [pid, n] of strong.slice(0, 3)) {
    const prof = PROFILE_MAP[pid];
    const name = bareName(prof.name);
    const ins = PROFILE_INSIGHTS[pid];
    const tier = td ? demandTier(td.demand[pid]) : null;
    const ex = td ? exampleFor(td, pid) : null;
    if (tier === "key" && ex) {
      insights.push({
        icon: prof.emoji,
        tone: "strength",
        text: {
          en: `The team is strongly represented in the “${name.en}” role (${n} of ${members.length}) — and that matches exactly what its roles require (e.g. ${ex.en}). A structural asset for this team. One watch-out at this concentration: ${ins.dominanceRisk.en.toLowerCase()}`,
          fr: `L’équipe est fortement représentée dans le rôle « ${name.fr} » (${n} sur ${members.length}) — et c’est exactement ce que ses postes exigent (p. ex. ${ex.fr}). Un atout structurel pour cette équipe. Un point de vigilance à cette concentration : ${ins.dominanceRisk.fr.charAt(0).toLowerCase()}${ins.dominanceRisk.fr.slice(1)}`,
        },
      });
    } else if (tier === "low") {
      insights.push({
        icon: prof.emoji,
        tone: "info",
        text: {
          en: `The team is strongly represented in the “${name.en}” role (${n} of ${members.length}), yet its current roles rarely rely on it. Energy may flow into work the roles don’t actually need — channel this strength toward cross-team topics, and watch: ${ins.dominanceRisk.en.toLowerCase()}`,
          fr: `L’équipe est fortement représentée dans le rôle « ${name.fr} » (${n} sur ${members.length}), alors que ses postes actuels y font peu appel. L’énergie peut se porter sur des travaux que les postes n’exigent pas — orientez cette force vers des sujets transverses, et attention : ${ins.dominanceRisk.fr.charAt(0).toLowerCase()}${ins.dominanceRisk.fr.slice(1)}`,
        },
      });
    } else {
      insights.push({
        icon: prof.emoji,
        tone: "strength",
        text: {
          en: `The team is strongly represented in the “${name.en}” role (${n} of ${members.length} members carry it naturally). ${prof.teamContribution.en} This strength is reliable — but a heavy focus on one role shapes the whole dynamic: ${ins.dominanceRisk.en.toLowerCase()}`,
          fr: `L’équipe est fortement représentée dans le rôle « ${name.fr} » (${n} membres sur ${members.length} le portent naturellement). ${prof.teamContribution.fr} Cette force est fiable — mais une forte concentration sur un rôle façonne toute la dynamique : ${ins.dominanceRisk.fr.charAt(0).toLowerCase()}${ins.dominanceRisk.fr.slice(1)}`,
        },
      });
    }
  }

  // Gaps: profiles in nobody's natural zone (top-2). Working-Genius-style
  // narrative: what the team will often fail to do, and what it may
  // over-focus on given the profiles it actually carries.
  const naturalCounts = new Map<ProfileId, number>();
  for (const m of members)
    topProfiles(m.results!.profileScores).forEach((pid) =>
      naturalCounts.set(pid, (naturalCounts.get(pid) ?? 0) + 1)
    );
  const carriedFocuses = [...naturalCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([pid]) => PROFILE_INSIGHTS[pid].focus);
  const gaps = PROFILES.filter((p) => !naturalCounts.has(p.id)).sort(
    (a, b) => (td ? td.demand[b.id] - td.demand[a.id] : 0)
  );
  for (const prof of gaps.slice(0, 4)) {
    const ins = PROFILE_INSIGHTS[prof.id];
    const name = bareName(prof.name);
    const tier = td ? demandTier(td.demand[prof.id]) : null;
    const ex = td ? exampleFor(td, prof.id) : null;
    if (tier === "key" && ex) {
      insights.push({
        icon: prof.emoji,
        tone: "risk",
        text: {
          en: `Critical gap for this team: nobody carries the “${name.en}” role naturally, yet the team's own roles depend on it — e.g. ${ex.en}. ${ins.absenceImpact.en} For this team, cover it explicitly or make it a priority in the next hire.`,
          fr: `Manque critique pour cette équipe : personne ne porte naturellement le rôle « ${name.fr} », alors que les postes de l’équipe en dépendent — p. ex. ${ex.fr}. ${ins.absenceImpact.fr} Pour cette équipe, couvrez-le explicitement ou faites-en une priorité du prochain recrutement.`,
        },
      });
    } else if (tier === "low") {
      insights.push({
        icon: prof.emoji,
        tone: "info",
        text: {
          en: `The “${name.en}” role is uncovered — but a minor gap here: this team's roles rarely rely on it. In a small organization, this is an acceptable trade-off; keep it in mind for cross-team topics rather than hiring.`,
          fr: `Le rôle « ${name.fr} » n’est pas couvert — mais c’est un manque mineur ici : les postes de cette équipe y font peu appel. Dans une petite organisation, c’est un arbitrage acceptable ; gardez-le en tête pour les sujets transverses plutôt que pour un recrutement.`,
        },
      });
    } else {
      const overfocus =
        carriedFocuses.length > 0
          ? {
              en: ` Without this role, the team may focus too much on ${carriedFocuses
                .map((f) => f.en)
                .join(", as well as ")} — while under-investing in ${ins.focus.en}.`,
              fr: ` Sans ce rôle, l’équipe peut trop se concentrer sur ${carriedFocuses
                .map((f) => f.fr)
                .join(", ainsi que ")} — en sous-investissant ${ins.focus.fr}.`,
            }
          : { en: "", fr: "" };
      insights.push({
        icon: prof.emoji,
        tone: "risk",
        text: {
          en: `The team is under-represented in the “${name.en}” role. ${ins.absenceImpact.en}${overfocus.en} Cover it consciously — assign it explicitly, or factor it into the next hire.`,
          fr: `L’équipe est sous-représentée dans le rôle « ${name.fr} ». ${ins.absenceImpact.fr}${overfocus.fr} À couvrir consciemment — en l’assignant explicitement, ou en l’intégrant au prochain recrutement.`,
        },
      });
    }
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
  const { db } = useAdminState();
  const [selected, setSelected] = useState<string>("all");

  const employees = useMemo(
    () => (db?.people ?? []).filter((p) => p.kind === "employee" && p.results),
    [db]
  );
  const members: Person[] =
    selected === "all"
      ? employees
      : employees.filter((p) => p.teamId === selected || p.functionalTeamId === selected);

  const scopeName =
    selected === "all" ? t("dyn.allHubcycle") : (db?.teams ?? []).find((tm) => tm.id === selected)?.name ?? "";

  // Profile coverage: how many members carry each profile in their natural
  // zone, plus how critical the profile is to this team's roles.
  const demand = useMemo(() => teamDemand(members), [members]);
  const coverage = PROFILES.map((prof) => {
    const n = members.filter((m) => topProfiles(m.results!.profileScores).includes(prof.id)).length;
    const tier = demand ? demandTier(demand.demand[prof.id]) : null;
    return { prof, n, tier };
  });

  const dots: MapDot[] = spreadDots(
    members.map((m) => ({
      ...mapPosition(m.results!.profileScores),
      label: m.name.split(" ")[0],
    }))
  );

  const insights = buildInsights(members);

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

      {/* Profile coverage — full width */}
      {members.length ? (
        <div className="print-page card mt-4">
          <h3 className="font-heading text-lg text-deep">{t("dyn.coverage")}</h3>
          <div className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-2">
            {coverage.map(({ prof, n, tier }) => (
              <div key={prof.id} className="flex items-center gap-3">
                <div className="w-44 shrink-0 truncate text-sm font-medium text-ink">
                  {prof.emoji} {l(prof.shortName)}
                </div>
                {tier ? (
                  <span
                    className={`w-28 shrink-0 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold ${
                      tier === "key"
                        ? "bg-coral/15 text-coral"
                        : tier === "mid"
                          ? "bg-deep/10 text-deep"
                          : "bg-cloud text-ink/45"
                    }`}
                  >
                    {t(tier === "key" ? "dyn.demandKey" : tier === "mid" ? "dyn.demandMid" : "dyn.demandLow")}
                  </span>
                ) : null}
                <div className="flex flex-1 items-center gap-1">
                  {Array.from({ length: Math.max(members.length, 1) }, (_, i) => (
                    <span
                      key={i}
                      className={`h-3 flex-1 rounded-full ${i < n ? "bg-deep" : "bg-cloud"}`}
                      style={{ maxWidth: 26 }}
                    />
                  ))}
                </div>
                <span
                  className={`w-20 shrink-0 text-right text-xs font-semibold ${
                    n === 0 ? "text-coral" : "text-deep"
                  }`}
                >
                  {n === 0 ? t("dyn.gap") : n}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink/40">{t("dyn.coverageHint")}</p>
        </div>
      ) : null}

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

      {/* Team positioning — full width */}
      {members.length ? (
        <div className="print-page card mt-4">
          <h3 className="font-heading text-lg text-deep">{t("dyn.scatter")}</h3>
          <div className="mx-auto mt-4 max-w-3xl">
            <TeamMap
              dots={dots}
              axisX={t("dyn.axisX")}
              axisY={t("dyn.axisY")}
              quadrants={["🎧 🎯", "⚡ 🏁", "📡 🌬️", "🔧 📊"]}
            />
          </div>
        </div>
      ) : null}

    </div>
  );
}
