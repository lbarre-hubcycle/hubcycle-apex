"use client";

import { useEffect, useState } from "react";
import { ROLE_MAP } from "@/data/roles";
import { PROFILE_MAP } from "@/lib/profiles";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";

/** Inline-editable name: click, type, Enter (or blur) to save. */
function NameCell({ name, onSave }: { name: string; onSave: (name: string) => void }) {
  const [value, setValue] = useState(name);
  useEffect(() => setValue(name), [name]);
  const commit = () => {
    const v = value.trim();
    if (v && v !== name) onSave(v);
    else setValue(name);
  };
  return (
    <input
      className="w-40 rounded-lg border border-transparent bg-transparent px-2 py-1 font-medium text-ink outline-none transition-colors hover:border-deep/20 focus:border-deep focus:bg-white"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") setValue(name);
      }}
    />
  );
}

/** Admin panel: teams, team assignment and manager assignment. */
export default function SettingsPage() {
  const { t, l } = useI18n();
  const { db, refresh } = useAdminState();
  const [teamName, setTeamName] = useState("");

  const people = db?.people ?? [];
  const teams = db?.teams ?? [];
  const employees = people.filter((p) => p.kind === "employee");

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

  async function deleteTeam(id: string) {
    if (!window.confirm(t("settings.deleteTeamConfirm"))) return;
    await fetch("/api/teams", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await refresh();
  }

  async function patchPerson(id: string, patch: Record<string, string>) {
    await fetch(`/api/people/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    await refresh();
  }

  return (
    <div>
      <SectionTitle title={t("settings.title")} sub={t("settings.sub")} />

      {/* Teams */}
      <div className="card mb-6">
        <h3 className="font-heading text-lg text-deep">{t("settings.teams")}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {teams.length === 0 ? (
            <p className="text-sm text-ink/40">{t("settings.noTeams")}</p>
          ) : (
            teams.map((team) => {
              const count = people.filter((p) => p.teamId === team.id || p.functionalTeamId === team.id).length;
              return (
                <span
                  key={team.id}
                  className="inline-flex items-center gap-2 rounded-full border border-deep/15 py-1.5 pl-4 pr-2 text-sm"
                >
                  <span className="font-semibold text-deep">{team.name}</span>
                  <span className="text-xs text-ink/45">
                    {count} {t("settings.membersCount")}
                  </span>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="rounded-full px-1.5 text-ink/30 hover:text-coral"
                    title={t("settings.deleteTeam")}
                  >
                    ✕
                  </button>
                </span>
              );
            })
          )}
        </div>
        <form onSubmit={createTeam} className="mt-4 flex items-center gap-2">
          <input
            className="input !w-56"
            placeholder={t("dyn.teamName")}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button className="btn-primary" disabled={!teamName.trim()}>
            {t("dyn.create")}
          </button>
        </form>
      </div>

      {/* Team & manager assignment */}
      <div className="card overflow-x-auto !p-0">
        <div className="px-5 pt-5">
          <h3 className="font-heading text-lg text-deep">{t("settings.people")}</h3>
          <p className="mt-1 text-xs text-ink/45">{t("settings.renameHint")}</p>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-cloud text-left text-xs uppercase tracking-wide text-deep/60">
              <th className="px-5 py-3">{t("recruit.name")}</th>
              <th className="px-5 py-3">{t("settings.email")}</th>
              <th className="px-5 py-3">{t("settings.access")}</th>
              <th className="px-5 py-3">{t("recruit.kind")}</th>
              <th className="px-5 py-3">{t("common.role")}</th>
              <th className="px-5 py-3">{t("report.profile")}</th>
              <th className="px-5 py-3">{t("settings.teamBusiness")}</th>
              <th className="px-5 py-3">{t("settings.teamFunctional")}</th>
              <th className="px-5 py-3">{t("settings.managerDirect")}</th>
              <th className="px-5 py-3">{t("settings.managerDotted")}</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => {
              const role = p.roleId ? ROLE_MAP[p.roleId] : undefined;
              const primary = p.results ? PROFILE_MAP[p.results.primaryProfile] : undefined;
              return (
                <tr key={p.id} className="border-b border-cloud/60">
                  <td className="px-5 py-3 font-medium text-ink">
                    <NameCell name={p.name} onSave={(name) => patchPerson(p.id, { name })} />
                  </td>
                  <td className="px-5 py-3">
                    <NameCell name={p.email ?? ""} onSave={(email) => patchPerson(p.id, { email })} />
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="input !w-36 !py-1.5"
                      value={p.userRole ?? ""}
                      onChange={(e) => patchPerson(p.id, { userRole: e.target.value })}
                    >
                      <option value="">{t("role.employee")} (auto)</option>
                      <option value="employee">{t("role.employee")}</option>
                      <option value="manager">{t("role.manager")}</option>
                      <option value="recruiter">{t("role.recruiter")}</option>
                      <option value="hr">{t("role.hr")}</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 text-ink/60">
                    {p.kind === "candidate" ? t("recruit.candidate") : t("recruit.employee")}
                  </td>
                  <td className="px-5 py-3 text-ink/70">{role ? l(role.title) : "—"}</td>
                  <td className="px-5 py-3 text-ink/70">
                    {primary ? `${primary.emoji} ${l(primary.shortName)}` : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="input !w-40 !py-1.5"
                      value={p.teamId ?? ""}
                      onChange={(e) => patchPerson(p.id, { teamId: e.target.value })}
                    >
                      <option value="">—</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="input !w-40 !py-1.5"
                      value={p.functionalTeamId ?? ""}
                      onChange={(e) => patchPerson(p.id, { functionalTeamId: e.target.value })}
                    >
                      <option value="">—</option>
                      {teams
                        .filter((team) => team.id !== p.teamId)
                        .map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="input !w-44 !py-1.5"
                      value={p.managerId ?? ""}
                      onChange={(e) => patchPerson(p.id, { managerId: e.target.value })}
                    >
                      <option value="">—</option>
                      {employees
                        .filter((m) => m.id !== p.id)
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      className="input !w-44 !py-1.5"
                      value={p.dottedManagerId ?? ""}
                      onChange={(e) => patchPerson(p.id, { dottedManagerId: e.target.value })}
                    >
                      <option value="">—</option>
                      {employees
                        .filter((m) => m.id !== p.id && m.id !== p.managerId)
                        .map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
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
