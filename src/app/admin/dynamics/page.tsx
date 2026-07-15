"use client";

import { useMemo, useState } from "react";
import { PROFILES, PROFILE_MAP } from "@/lib/profiles";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { Bar100, TeamMap, type MapDot } from "@/components/charts";
import type { Person, ProfileId } from "@/lib/types";

function mapPosition(scores: Record<ProfileId, number>): { x: number; y: number } {
  let x = 0, y = 0, total = 0;
  for (const [pid, score] of Object.entries(scores)) {
    const def = PROFILE_MAP[pid as ProfileId];
    const w = Math.max(score, 1);
    x += def.mapX * w;
    y += def.mapY * w;
    total += w;
  }
  return { x: x / total, y: y / total };
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

  // Profile coverage: average score of members on each profile dimension.
  const coverage = PROFILES.map((prof) => {
    const avg = members.length
      ? Math.round(members.reduce((s, m) => s + m.results!.profileScores[prof.id], 0) / members.length)
      : 0;
    return { prof, avg };
  });

  const dots: MapDot[] = members.map((m) => ({
    ...mapPosition(m.results!.profileScores),
    label: m.name.split(" ")[0],
  }));

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
      <SectionTitle title={t("dyn.title")} sub={t("dyn.sub")} />

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

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="card lg:col-span-3">
          <h3 className="font-heading text-lg text-deep">{t("dyn.map")}</h3>
          <p className="text-xs text-ink/50">
            {members.length} {t("dyn.members")}
          </p>
          {members.length ? (
            <div className="mt-4">
              <TeamMap
                dots={dots}
                axisX={t("dyn.axisX")}
                axisY={t("dyn.axisY")}
                quadrants={["🎧 🎯", "⚡ 🏁", "📡 🌬️", "🔧 📊"]}
              />
            </div>
          ) : (
            <p className="mt-6 text-sm text-ink/40">{t("dyn.noMembers")}</p>
          )}
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

      {/* Members & team assignment */}
      <div className="card mt-6 overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cloud text-left text-xs uppercase tracking-wide text-deep/60">
              <th className="px-5 py-3">{t("common.employees")}</th>
              <th className="px-5 py-3">{t("report.profile")}</th>
              <th className="px-5 py-3">{t("common.team")}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((p) => (
              <tr key={p.id} className="border-b border-cloud/60">
                <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                <td className="px-5 py-3">
                  {PROFILE_MAP[p.results!.primaryProfile].emoji}{" "}
                  {l(PROFILE_MAP[p.results!.primaryProfile].name)}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
