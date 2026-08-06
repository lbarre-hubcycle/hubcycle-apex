"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ROLE_MAP } from "@/data/roles";
import { PROFILE_MAP, PROFILES, topProfiles } from "@/lib/profiles";
import { CULTURE_BANDS } from "@/lib/culture";
import { commercialStyleOf, roleCommercialNeed } from "@/lib/commercial-style";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import type { Person, ProfileId } from "@/lib/types";

/**
 * Side-by-side candidate comparison for one role: Fit poste (role match),
 * Fit culture (Manifesto alignment) and Fit team (complementarity with the
 * comparison team). Decision-support for HR and recruiters.
 */

/** 1–5 complementarity: covers team gaps (+), duplicates a dominant profile (−). */
function teamFit(candidate: Person, employees: Person[]): { score: number; note: "fills" | "neutral" | "duplicates" } | null {
  const teamIds = [candidate.teamId, candidate.functionalTeamId].filter(Boolean) as string[];
  if (!teamIds.length || !candidate.results) return null;
  const members = employees.filter(
    (p) => p.results && teamIds.some((tid) => p.teamId === tid || p.functionalTeamId === tid)
  );
  if (!members.length) return null;

  const naturalCount = new Map<ProfileId, number>();
  for (const m of members)
    topProfiles(m.results!.profileScores).forEach((pid) =>
      naturalCount.set(pid, (naturalCount.get(pid) ?? 0) + 1)
    );
  const gaps = PROFILES.filter((p) => !naturalCount.has(p.id)).map((p) => p.id);
  const dominant = new Set(
    [...naturalCount.entries()]
      .filter(([, n]) => n >= Math.max(2, Math.ceil(members.length / 2)))
      .map(([pid]) => pid)
  );
  const candidateNatural = topProfiles(candidate.results.profileScores);
  const covered = candidateNatural.filter((pid) => gaps.includes(pid)).length;
  const duplicates = dominant.has(candidate.results.primaryProfile);
  const score = Math.min(5, Math.max(1, 3 + Math.min(2, covered) - (duplicates ? 1 : 0)));
  const note = covered > 0 ? "fills" : duplicates ? "duplicates" : "neutral";
  return { score, note };
}

export default function ComparePage() {
  const { t, l, lang } = useI18n();
  const fr = lang === "fr";
  const { db } = useAdminState();
  const [roleId, setRoleId] = useState<string>("");

  const candidates = useMemo(
    () => (db?.people ?? []).filter((p) => p.kind === "candidate" && p.results),
    [db]
  );
  const employees = useMemo(
    () => (db?.people ?? []).filter((p) => p.kind === "employee"),
    [db]
  );
  const rolesWithCandidates = useMemo(() => {
    const ids = [...new Set(candidates.map((c) => c.roleId).filter(Boolean))] as string[];
    return ids.map((id) => ROLE_MAP[id]).filter(Boolean);
  }, [candidates]);

  const activeRole = roleId || rolesWithCandidates[0]?.id || "";
  const rows = candidates
    .filter((c) => c.roleId === activeRole)
    .map((c) => ({
      c,
      fit: c.results!.roleMatch?.overall ?? null,
      culture: c.results!.cultureScore,
      band: CULTURE_BANDS.find((b) => b.id === c.results!.cultureBand)!,
      team: teamFit(c, employees),
      commercial: roleCommercialNeed(activeRole) ? commercialStyleOf(c.results!) : null,
    }))
    .sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0));

  const best = {
    fit: Math.max(...rows.map((r) => r.fit ?? 0), 0),
    culture: Math.max(...rows.map((r) => r.culture), 0),
    team: Math.max(...rows.map((r) => r.team?.score ?? 0), 0),
  };

  const hl = (v: number | null | undefined, top: number) =>
    v != null && v === top && rows.length > 1 ? "font-bold text-deep" : "text-ink/80";

  return (
    <div>
      <SectionTitle
        title={fr ? "Comparateur de candidats" : "Candidate comparison"}
        sub={
          fr
            ? "Les candidats d'un même poste, côte à côte : fit poste, fit culture, fit team."
            : "Candidates for the same role, side by side: role fit, culture fit, team fit."
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {rolesWithCandidates.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoleId(r.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              activeRole === r.id ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
            }`}
          >
            {l(r.title)}
            <span className="ml-1.5 opacity-60">
              {candidates.filter((c) => c.roleId === r.id).length}
            </span>
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card text-ink/45">
          {fr
            ? "Aucun candidat avec résultats pour ce poste."
            : "No candidates with results for this role."}
        </div>
      ) : (
        <div className="card overflow-x-auto !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cloud text-left text-xs uppercase tracking-wide text-deep/60">
                <th className="px-5 py-3">{t("recruit.name")}</th>
                <th className="px-5 py-3">{t("report.profile")}</th>
                <th className="px-5 py-3">{fr ? "Fit poste" : "Role fit"}</th>
                <th className="px-5 py-3">{fr ? "Fit culture" : "Culture fit"}</th>
                <th className="px-5 py-3">{fr ? "Fit team" : "Team fit"}</th>
                {roleCommercialNeed(activeRole) ? (
                  <th className="px-5 py-3">{fr ? "Style commercial" : "Commercial style"}</th>
                ) : null}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map(({ c, fit, culture, band, team, commercial }) => {
                const prof = PROFILE_MAP[c.results!.primaryProfile];
                return (
                  <tr key={c.id} className="border-b border-cloud/60 align-middle">
                    <td className="px-5 py-4 font-medium text-ink">{c.name}</td>
                    <td className="px-5 py-4 text-ink/75">
                      {prof.emoji} {l(prof.shortName)}
                    </td>
                    <td className={`px-5 py-4 ${hl(fit, best.fit)}`}>
                      {fit != null ? `${fit.toFixed(1)} / 5` : "—"}
                    </td>
                    <td className={`px-5 py-4 ${hl(culture, best.culture)}`}>
                      {culture.toFixed(1)} / 5
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          culture >= 3.7
                            ? "bg-deep/10 text-deep"
                            : culture >= 3
                              ? "bg-sky/40 text-deep"
                              : "bg-coral/15 text-coral"
                        }`}
                      >
                        {l(band.label)}
                      </span>
                    </td>
                    <td className={`px-5 py-4 ${hl(team?.score, best.team)}`}>
                      {team ? (
                        <>
                          {team.score} / 5
                          <span
                            className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              team.note === "fills"
                                ? "bg-sky/40 text-deep"
                                : team.note === "duplicates"
                                  ? "bg-coral/15 text-coral"
                                  : "bg-cloud text-ink/55"
                            }`}
                          >
                            {team.note === "fills"
                              ? fr ? "Complète l'équipe" : "Fills a gap"
                              : team.note === "duplicates"
                                ? fr ? "Renforce une dominante" : "Duplicates a strength"
                                : fr ? "Neutre" : "Neutral"}
                          </span>
                        </>
                      ) : (
                        <span className="text-ink/35">{fr ? "— (pas d'équipe)" : "— (no team)"}</span>
                      )}
                    </td>
                    {roleCommercialNeed(activeRole) ? (
                      <td className="px-5 py-4 text-xs text-ink/70">
                        {commercial
                          ? commercial.style === "hunter"
                            ? fr ? "🎯 Chasseur" : "🎯 Hunter"
                            : commercial.style === "farmer"
                              ? fr ? "🌱 Cultivateur" : "🌱 Farmer"
                              : fr ? "⚖️ Équilibré" : "⚖️ Balanced"
                          : "—"}
                      </td>
                    ) : null}
                    <td className="px-5 py-4 text-right">
                      <Link href={`/admin/people/${c.id}`} className="btn-ghost !px-3 !py-1.5 !text-xs">
                        {t("recruit.viewReport")}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-ink/40">
            {fr
              ? "Fit team = complémentarité avec l'équipe de comparaison (couvre-t-il un profil manquant, ou renforce-t-il une dominante ?). Les scores sont des aides à la décision, jamais des verdicts."
              : "Team fit = complementarity with the comparison team (fills a missing profile, or duplicates a dominant one?). Scores support the decision — they never make it."}
          </p>
        </div>
      )}
    </div>
  );
}
