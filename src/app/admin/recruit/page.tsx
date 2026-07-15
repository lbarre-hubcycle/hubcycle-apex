"use client";

import Link from "next/link";
import { useState } from "react";
import { ROLES, ROLE_MAP } from "@/data/roles";
import { PROFILE_MAP } from "@/lib/profiles";
import { CULTURE_BANDS } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import type { Person } from "@/lib/types";

export default function RecruitPage() {
  const { t, l } = useI18n();
  const { db, refresh } = useAdminState();
  const [form, setForm] = useState({ name: "", email: "", roleId: "", teamId: "", kind: "candidate" });
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", roleId: "", teamId: "", kind: "candidate" });
    setBusy(false);
    await refresh();
  }

  async function remove(id: string) {
    await fetch(`/api/people/${id}`, { method: "DELETE" });
    await refresh();
  }

  function copyLink(p: Person) {
    const url = `${window.location.origin}/a/${p.token}`;
    void navigator.clipboard.writeText(url);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const people = db?.people ?? [];

  return (
    <div>
      <SectionTitle title={t("recruit.title")} sub={t("recruit.sub")} />

      <form onSubmit={createInvite} className="card mb-8">
        <h2 className="mb-4 text-lg font-semibold text-deep">{t("recruit.invite")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label">{t("recruit.name")}</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">{t("recruit.email")}</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">{t("recruit.role")}</label>
            <select className="input" value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })}>
              <option value="">—</option>
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {l(r.title)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("recruit.team")}</label>
            <select className="input" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>
              <option value="">—</option>
              {(db?.teams ?? []).map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("recruit.kind")}</label>
            <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              <option value="candidate">{t("recruit.candidate")}</option>
              <option value="employee">{t("recruit.employee")}</option>
            </select>
          </div>
        </div>
        <button className="btn-coral mt-5" disabled={busy || !form.name}>
          {t("recruit.create")}
        </button>
      </form>

      <div className="card overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cloud text-left text-xs uppercase tracking-wide text-deep/60">
              <th className="px-5 py-3">{t("recruit.name")}</th>
              <th className="px-5 py-3">{t("recruit.kind")}</th>
              <th className="px-5 py-3">{t("common.role")}</th>
              <th className="px-5 py-3">{t("report.profile")}</th>
              <th className="px-5 py-3">{t("report.culture")}</th>
              <th className="px-5 py-3">{t("report.roleMatch")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {people.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-ink/40">
                  {t("recruit.none")}
                </td>
              </tr>
            ) : (
              people
                .slice()
                .reverse()
                .map((p) => {
                  const role = p.roleId ? ROLE_MAP[p.roleId] : undefined;
                  const band = p.results
                    ? CULTURE_BANDS.find((b) => b.id === p.results!.cultureBand)
                    : undefined;
                  return (
                    <tr key={p.id} className="border-b border-cloud/60">
                      <td className="px-5 py-3 font-medium text-ink">
                        {p.name}
                        {p.email ? <div className="text-xs text-ink/40">{p.email}</div> : null}
                      </td>
                      <td className="px-5 py-3 text-ink/70">
                        {p.kind === "candidate" ? t("recruit.candidate") : t("recruit.employee")}
                      </td>
                      <td className="px-5 py-3 text-ink/70">{role ? l(role.title) : "—"}</td>
                      <td className="px-5 py-3">
                        {p.results ? (
                          <span>
                            {PROFILE_MAP[p.results.primaryProfile].emoji}{" "}
                            {l(PROFILE_MAP[p.results.primaryProfile].name)}
                          </span>
                        ) : (
                          <span className="text-ink/40">{t("recruit.awaiting")}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {band ? (
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              p.results!.cultureScore >= 3.7
                                ? "bg-deep/10 text-deep"
                                : p.results!.cultureScore >= 3
                                  ? "bg-sky/40 text-deep"
                                  : "bg-coral/15 text-coral"
                            }`}
                          >
                            {l(band.label)} · {p.results!.cultureScore.toFixed(1)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3 font-semibold text-deep">
                        {p.results?.roleMatch ? `${p.results.roleMatch.overall.toFixed(1)} / 5` : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          {p.results ? (
                            <Link href={`/admin/people/${p.id}`} className="btn-primary !px-3 !py-1.5 !text-xs">
                              {t("recruit.viewReport")}
                            </Link>
                          ) : (
                            <button onClick={() => copyLink(p)} className="btn-ghost !px-3 !py-1.5 !text-xs">
                              {copiedId === p.id ? t("recruit.copied") : t("recruit.copyLink")}
                            </button>
                          )}
                          <button
                            onClick={() => remove(p.id)}
                            className="text-xs text-ink/30 hover:text-coral"
                            title={t("recruit.delete")}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
