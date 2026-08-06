"use client";

import { useMemo, useState } from "react";
import { FRAMEWORK_MAP, ROLE_EXPECTATIONS_MAP } from "@/data/competency-framework";
import { COMPETENCY_COACHING, competencyStyleScore, readTier } from "@/lib/competency-read";
import { ROLE_MAP } from "@/data/roles";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { GoalCard } from "@/components/goals";
import type { GoalKind, GoalStatus, Person } from "@/lib/types";

/**
 * Personal objectives & commitments (Cockpit). Performance goals commit to
 * the role's KPIs; development goals target a framework competency. The
 * form suggests both from the referential and the person's assessment
 * (development priorities → coaching levers). Managed by the person, their
 * manager(s) and HR.
 */
export default function GoalsPage() {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const { db, viewer, refresh } = useAdminState();

  const manageable = useMemo(() => {
    if (!db || !viewer) return [];
    return db.people.filter(
      (p) =>
        p.kind === "employee" &&
        (viewer.role === "hr" ||
          p.id === viewer.personId ||
          p.managerId === viewer.personId ||
          p.dottedManagerId === viewer.personId)
    );
  }, [db, viewer]);

  const [personId, setPersonId] = useState<string>("");
  const person: Person | undefined =
    manageable.find((p) => p.id === personId) ??
    manageable.find((p) => p.id === viewer?.personId) ??
    manageable[0];

  const [showForm, setShowForm] = useState(false);
  const [kind, setKind] = useState<GoalKind>("performance");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kpi, setKpi] = useState("");
  const [competency, setCompetency] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);

  const exp = person?.roleId ? ROLE_EXPECTATIONS_MAP[person.roleId] : undefined;
  const role = person?.roleId ? ROLE_MAP[person.roleId] : undefined;

  // KPI options from the role referential; competency options = role + core.
  const kpiOptions = exp ? [l(exp.keyKpi), ...exp.secondaryKpis.map((k) => l(k))] : [];
  const competencyOptions = [
    ...(exp?.competencies ?? []),
    ...["A1", "A2", "A3", "A4", "A5", "A6"],
  ];

  // Development suggestions: expected competencies the assessment reads as
  // opposite-register, each paired with its coaching lever.
  const devSuggestions = useMemo(() => {
    if (!person?.results || !exp) return [];
    return exp.competencies
      .map((code) => ({ code, score: competencyStyleScore(person.results!, code) }))
      .filter((s) => s.score !== null && readTier(s.score) === "opposite")
      .map(({ code }) => ({
        code,
        name: l(FRAMEWORK_MAP[code].name),
        lever: l(COMPETENCY_COACHING[code]),
      }));
  }, [person, exp, l]);

  function prefill(nextKind: GoalKind, nextTitle: string, opts?: { kpi?: string; competency?: string; description?: string }) {
    setShowForm(true);
    setKind(nextKind);
    setTitle(nextTitle);
    setKpi(opts?.kpi ?? "");
    setCompetency(opts?.competency ?? "");
    setDescription(opts?.description ?? "");
  }

  async function create() {
    if (!person || !title.trim() || saving) return;
    setSaving(true);
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId: person.id,
        kind,
        title,
        description: description || undefined,
        kpi: kind === "performance" ? kpi || undefined : undefined,
        competency: kind === "development" ? competency || undefined : undefined,
        targetDate: targetDate || undefined,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setTitle("");
      setDescription("");
      setKpi("");
      setCompetency("");
      setTargetDate("");
      setShowForm(false);
      await refresh();
    }
  }

  async function checkin(goalId: string, status: GoalStatus, progress: number, note: string) {
    if (!person) return;
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: person.id, goalId, checkin: { status, progress, note } }),
    });
    await refresh();
  }

  async function remove(goalId: string) {
    if (!person || !window.confirm(fr ? "Supprimer cet objectif ?" : "Delete this objective?")) return;
    await fetch(`/api/goals?personId=${person.id}&goalId=${goalId}`, { method: "DELETE" });
    await refresh();
  }

  const goals = person?.goals ?? [];
  const active = goals.filter((g) => g.status === "on-track" || g.status === "at-risk");
  const closed = goals.filter((g) => g.status === "done" || g.status === "dropped");

  return (
    <div>
      <SectionTitle
        title={fr ? "Objectifs personnels & engagements" : "Personal objectives & commitments"}
        sub={
          fr
            ? "Des engagements clairs, fixés ensemble : performance sur les KPIs du rôle, développement sur les compétences."
            : "Clear commitments, set together: performance on the role's KPIs, development on competencies."
        }
      />

      {manageable.length > 1 && person ? (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-deep/60">
            {fr ? "Objectifs de" : "Objectives of"}
          </span>
          <select
            value={person.id}
            onChange={(e) => setPersonId(e.target.value)}
            className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
          >
            {manageable.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.id === viewer?.personId ? (fr ? " (moi)" : " (me)") : ""}
              </option>
            ))}
          </select>
          {role ? <span className="text-xs text-ink/45">{l(role.title)}</span> : null}
        </div>
      ) : null}

      {!person ? (
        <div className="card text-ink/45">
          {fr
            ? "Votre compte n'est pas relié à un profil employé."
            : "Your account is not linked to an employee profile."}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Active objectives */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-heading text-lg text-deep">
                  {fr ? "En cours" : "Active"}{" "}
                  <span className="text-sm text-ink/40">({active.length})</span>
                </h3>
                <button onClick={() => setShowForm(!showForm)} className="btn-coral !px-4 !py-2 !text-sm">
                  {showForm ? (fr ? "Fermer" : "Close") : fr ? "+ Nouvel objectif" : "+ New objective"}
                </button>
              </div>

              {showForm ? (
                <div className="card mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setKind("performance")}
                      className={`rounded-2xl border p-3 text-left ${
                        kind === "performance" ? "border-coral bg-coral/5" : "border-deep/10 hover:bg-cloud"
                      }`}
                    >
                      <div className="text-sm font-semibold text-deep">🎯 Performance</div>
                      <div className="mt-0.5 text-[11px] text-ink/55">
                        {fr ? "Engagement sur un KPI du rôle" : "Commitment on a role KPI"}
                      </div>
                    </button>
                    <button
                      onClick={() => setKind("development")}
                      className={`rounded-2xl border p-3 text-left ${
                        kind === "development" ? "border-lavender bg-lavender/10" : "border-deep/10 hover:bg-cloud"
                      }`}
                    >
                      <div className="text-sm font-semibold text-deep">
                        🌱 {fr ? "Développement" : "Development"}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink/55">
                        {fr ? "Progression sur une compétence" : "Growth on a competency"}
                      </div>
                    </button>
                  </div>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    placeholder={
                      fr ? "L'objectif, formulé comme un résultat…" : "The objective, phrased as an outcome…"
                    }
                    className="mt-3 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-sm font-medium"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    maxLength={2000}
                    placeholder={fr ? "Comment on s'y prend (optionnel)…" : "How we get there (optional)…"}
                    className="mt-2 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-xs"
                  />

                  {kind === "performance" ? (
                    <>
                      <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-deep/60">
                        KPI
                      </label>
                      {kpiOptions.length ? (
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {kpiOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => setKpi(kpi === option ? "" : option)}
                              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                kpi === option
                                  ? "bg-deep text-white"
                                  : "border border-deep/15 text-deep/70 hover:bg-cloud"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      <input
                        value={kpi}
                        onChange={(e) => setKpi(e.target.value)}
                        maxLength={300}
                        placeholder={fr ? "…ou un KPI libre" : "…or a free-text KPI"}
                        className="mt-2 w-full rounded-xl border border-deep/15 bg-white px-3 py-2 text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-deep/60">
                        {fr ? "Compétence visée" : "Target competency"}
                      </label>
                      <select
                        value={competency}
                        onChange={(e) => setCompetency(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">{fr ? "Choisir…" : "Pick…"}</option>
                        {competencyOptions.map((code) => (
                          <option key={code} value={code}>
                            {code} · {l(FRAMEWORK_MAP[code].name)}
                          </option>
                        ))}
                      </select>
                    </>
                  )}

                  <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-deep/60">
                    {fr ? "Échéance (optionnel)" : "Due date (optional)"}
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="mt-1.5 rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
                  />

                  <div className="mt-4">
                    <button
                      onClick={() => void create()}
                      disabled={!title.trim() || saving}
                      className="btn-coral disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? "…" : fr ? "Créer l'objectif" : "Create objective"}
                    </button>
                  </div>
                </div>
              ) : null}

              {active.length === 0 && !showForm ? (
                <div className="card text-sm text-ink/45">
                  {fr
                    ? "Aucun objectif en cours — créez-en un, ou partez d'une suggestion à droite."
                    : "No active objectives — create one, or start from a suggestion on the right."}
                </div>
              ) : (
                <div className="space-y-3">
                  {active.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onCheckin={(s, p, n) => checkin(goal.id, s, p, n)}
                      onDelete={() => remove(goal.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {closed.length ? (
              <div>
                <h3 className="mb-3 font-heading text-lg text-deep">
                  {fr ? "Terminés" : "Closed"}{" "}
                  <span className="text-sm text-ink/40">({closed.length})</span>
                </h3>
                <div className="space-y-3">
                  {closed.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} onDelete={() => remove(goal.id)} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Suggestions */}
          <div className="space-y-4 self-start">
            {exp ? (
              <div className="card">
                <h3 className="font-heading text-base text-deep">
                  {fr ? "Suggestions — performance" : "Suggestions — performance"}
                </h3>
                <p className="mt-1 text-[11px] text-ink/50">
                  {fr ? "Les KPIs du rôle, prêts à devenir des engagements." : "The role's KPIs, ready to become commitments."}
                </p>
                <div className="mt-3 space-y-2">
                  {[l(exp.keyKpi), ...exp.secondaryKpis.map((k) => l(k))].map((option, i) => (
                    <button
                      key={option}
                      onClick={() => prefill("performance", option, { kpi: option })}
                      className="block w-full rounded-xl border border-deep/10 px-3 py-2 text-left text-xs text-ink/75 hover:bg-cloud"
                    >
                      {i === 0 ? "⭐ " : "＋ "}
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {devSuggestions.length ? (
              <div className="card">
                <h3 className="font-heading text-base text-deep">
                  {fr ? "Suggestions — développement" : "Suggestions — development"}
                </h3>
                <p className="mt-1 text-[11px] text-ink/50">
                  {fr
                    ? "Issues des priorités de développement du rapport, avec leur piste de coaching."
                    : "From the report's development priorities, with their coaching lever."}
                </p>
                <div className="mt-3 space-y-2">
                  {devSuggestions.map((s) => (
                    <button
                      key={s.code}
                      onClick={() =>
                        prefill("development", fr ? `Progresser sur ${s.name}` : `Grow on ${s.name}`, {
                          competency: s.code,
                          description: s.lever,
                        })
                      }
                      className="block w-full rounded-xl border border-lavender/40 bg-lavender/5 px-3 py-2 text-left text-xs hover:bg-lavender/15"
                    >
                      <span className="font-semibold text-deep">
                        ＋ {s.code} · {s.name}
                      </span>
                      <span className="mt-0.5 block text-ink/55">{s.lever}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
