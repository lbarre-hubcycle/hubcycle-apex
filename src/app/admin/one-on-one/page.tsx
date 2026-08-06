"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PROFILE_MAP } from "@/lib/profiles";
import { ROLE_MAP } from "@/data/roles";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { FeedbackCard } from "@/components/feedback";
import { STATUS_META } from "@/components/goals";
import type { OneOnOne, Person } from "@/lib/types";

/**
 * 1-2-1 meetings between an employee and one of their managers: shared
 * notes, a shared to-do list, and a context panel (profile coaching tips,
 * active objectives, recent feedback) so the conversation starts informed.
 * Notes are visible to the two participants only — enforced server-side.
 */

interface Pair {
  employeeId: string;
  partnerId: string;
  label: string;
}

export default function OneOnOnePage() {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const { db, viewer, directory, refresh } = useAdminState();

  const nameOf = (id: string) => directory.find((d) => d.id === id)?.name ?? "?";

  const pairs = useMemo<Pair[]>(() => {
    if (!db || !viewer?.personId) return [];
    const me = viewer.personId;
    const asManager: Pair[] = db.people
      .filter((p) => p.kind === "employee" && (p.managerId === me || p.dottedManagerId === me))
      .map((p) => ({ employeeId: p.id, partnerId: me, label: p.name }));
    const self = db.people.find((p) => p.id === me);
    const asEmployee: Pair[] = self
      ? ([self.managerId, self.dottedManagerId].filter(Boolean) as string[]).map((mid) => ({
          employeeId: me,
          partnerId: mid,
          label: fr ? `Moi, avec ${nameOf(mid)}` : `Me, with ${nameOf(mid)}`,
        }))
      : [];
    return [...asEmployee, ...asManager];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, viewer, directory, fr]);

  const [pairKey, setPairKey] = useState("");
  const pair = pairs.find((p) => `${p.employeeId}:${p.partnerId}` === pairKey) ?? pairs[0];
  const employee: Person | undefined = db?.people.find((p) => p.id === pair?.employeeId);

  const meetings = useMemo(
    () =>
      (employee?.oneOnOnes ?? [])
        .filter((m) => m.withId === pair?.partnerId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [employee, pair]
  );

  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [todoDraft, setTodoDraft] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);

  async function createMeeting() {
    if (!pair || creating) return;
    setCreating(true);
    await fetch("/api/one-on-ones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: pair.employeeId, withId: pair.partnerId }),
    });
    setCreating(false);
    await refresh();
  }

  async function patch(meetingId: string, payload: Record<string, unknown>) {
    if (!pair) return;
    await fetch("/api/one-on-ones", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: pair.employeeId, meetingId, ...payload }),
    });
    await refresh();
  }

  async function removeMeeting(meetingId: string) {
    if (!pair || !window.confirm(fr ? "Supprimer ce 1-2-1 ?" : "Delete this 1-2-1?")) return;
    await fetch(`/api/one-on-ones?personId=${pair.employeeId}&meetingId=${meetingId}`, {
      method: "DELETE",
    });
    await refresh();
  }

  const activeGoals = (employee?.goals ?? []).filter(
    (g) => g.status === "on-track" || g.status === "at-risk"
  );
  const recentFeedback = [...(employee?.feedback ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);
  const profile = employee?.results ? PROFILE_MAP[employee.results.primaryProfile] : undefined;
  const role = employee?.roleId ? ROLE_MAP[employee.roleId] : undefined;

  const meetingDate = (m: OneOnOne) =>
    new Date(m.date).toLocaleDateString(fr ? "fr-FR" : "en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div>
      <SectionTitle
        title="1-2-1"
        sub={
          fr
            ? "Notes partagées et actions de vos points réguliers — visibles uniquement par vous deux."
            : "Shared notes and actions from your regular check-ins — visible only to the two of you."
        }
      />

      {!viewer?.personId ? (
        <div className="card text-ink/45">
          {fr
            ? "Votre compte n'est pas relié à un profil employé."
            : "Your account is not linked to an employee profile."}
        </div>
      ) : pairs.length === 0 ? (
        <div className="card text-ink/45">
          {fr
            ? "Aucun binôme 1-2-1 : il faut un manager assigné (Admin) ou des personnes qui vous reportent."
            : "No 1-2-1 pair yet: you need an assigned manager (Admin) or people reporting to you."}
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-deep/60">
              {fr ? "Binôme" : "Pair"}
            </span>
            <select
              value={pair ? `${pair.employeeId}:${pair.partnerId}` : ""}
              onChange={(e) => setPairKey(e.target.value)}
              className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
            >
              {pairs.map((p) => (
                <option key={`${p.employeeId}:${p.partnerId}`} value={`${p.employeeId}:${p.partnerId}`}>
                  {p.label}
                </option>
              ))}
            </select>
            <button onClick={() => void createMeeting()} disabled={creating} className="btn-coral !px-4 !py-2 !text-sm">
              {creating ? "…" : fr ? "+ Nouveau 1-2-1" : "+ New 1-2-1"}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Meetings */}
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="card text-sm text-ink/45">
                  {fr
                    ? "Pas encore de 1-2-1 pour ce binôme — créez le premier."
                    : "No 1-2-1 for this pair yet — create the first one."}
                </div>
              ) : (
                meetings.map((m) => {
                  const draft = notesDraft[m.id];
                  const dirty = draft !== undefined && draft !== (m.sharedNotes ?? "");
                  return (
                    <div key={m.id} className="card">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base capitalize text-deep">{meetingDate(m)}</h3>
                        <button
                          onClick={() => void removeMeeting(m.id)}
                          className="ml-auto text-[11px] font-semibold text-coral/60 hover:text-coral"
                        >
                          {fr ? "Supprimer" : "Delete"}
                        </button>
                      </div>

                      <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-deep/60">
                        {fr ? "Notes partagées" : "Shared notes"}
                      </label>
                      <textarea
                        value={draft ?? m.sharedNotes ?? ""}
                        onChange={(e) => setNotesDraft({ ...notesDraft, [m.id]: e.target.value })}
                        rows={4}
                        placeholder={
                          fr
                            ? "Sujets abordés, décisions, points d'attention…"
                            : "Topics covered, decisions, watch points…"
                        }
                        className="mt-1.5 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-sm"
                      />
                      {dirty ? (
                        <button
                          onClick={() => {
                            void patch(m.id, { sharedNotes: draft });
                          }}
                          className="btn-coral mt-2 !px-4 !py-1.5 !text-xs"
                        >
                          {fr ? "Enregistrer les notes" : "Save notes"}
                        </button>
                      ) : null}

                      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-deep/60">
                        {fr ? "Actions" : "Actions"}
                      </label>
                      <div className="mt-1.5 space-y-1.5">
                        {m.todos.map((todo) => (
                          <div key={todo.id} className="flex items-center gap-2.5 rounded-xl bg-cloud/40 px-3 py-2">
                            <input
                              type="checkbox"
                              checked={todo.done}
                              onChange={() => void patch(m.id, { toggleTodo: todo.id })}
                              className="h-4 w-4 accent-deep"
                            />
                            <span
                              className={`flex-1 text-sm ${
                                todo.done ? "text-ink/40 line-through" : "text-ink/85"
                              }`}
                            >
                              {todo.goalId ? (
                                <span
                                  className="mr-1.5"
                                  title={fr ? "Engagement d'un objectif" : "Objective commitment"}
                                >
                                  🎯
                                </span>
                              ) : null}
                              {todo.text}
                            </span>
                            {todo.assigneeId ? (
                              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-deep/60">
                                {nameOf(todo.assigneeId).split(" ")[0]}
                              </span>
                            ) : null}
                            <button
                              onClick={() => void patch(m.id, { removeTodo: todo.id })}
                              className="text-ink/30 hover:text-coral"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <input
                          value={todoDraft[m.id] ?? ""}
                          onChange={(e) => setTodoDraft({ ...todoDraft, [m.id]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && (todoDraft[m.id] ?? "").trim()) {
                              void patch(m.id, { addTodo: { text: todoDraft[m.id] } });
                              setTodoDraft({ ...todoDraft, [m.id]: "" });
                            }
                          }}
                          maxLength={500}
                          placeholder={fr ? "Ajouter une action (Entrée)…" : "Add an action (Enter)…"}
                          className="flex-1 rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Context panel */}
            {employee ? (
              <div className="space-y-4 self-start">
                <div className="card">
                  <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                    {fr ? "Contexte" : "Context"} — {employee.name.split(" ")[0]}
                  </div>
                  {role ? <div className="mt-1 text-xs text-ink/50">{l(role.title)}</div> : null}
                  {profile && employee.results ? (
                    <>
                      <div className="mt-3 text-sm font-semibold text-deep">
                        {profile.emoji} {l(profile.name)}
                      </div>
                      <ul className="mt-2 space-y-1.5 text-xs text-ink/70">
                        {profile.coachTips.slice(0, 2).map((tip, i) => (
                          <li key={i}>→ {l(tip)}</li>
                        ))}
                      </ul>
                      <Link
                        href={`/admin/people/${employee.id}`}
                        className="mt-3 inline-block text-xs font-semibold text-deep/60 hover:text-deep"
                      >
                        {fr ? "Voir le rapport complet →" : "Open the full report →"}
                      </Link>
                    </>
                  ) : (
                    <p className="mt-2 text-xs text-ink/45">
                      {fr ? "Pas encore de résultats d'évaluation." : "No assessment results yet."}
                    </p>
                  )}
                </div>

                <div className="card">
                  <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                    {fr ? "Objectifs en cours" : "Active objectives"}
                  </div>
                  {activeGoals.length ? (
                    <div className="mt-2.5 space-y-2.5">
                      {activeGoals.map((g) => (
                        <div key={g.id}>
                          <div className="flex items-baseline justify-between gap-2 text-xs">
                            <span className="font-medium text-ink/80">{g.title}</span>
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[g.status].chip}`}
                            >
                              {fr ? STATUS_META[g.status].fr : STATUS_META[g.status].en}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-cloud">
                            <div
                              className={`h-full rounded-full ${STATUS_META[g.status].bar}`}
                              style={{ width: `${g.progress}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-ink/45">
                      {fr ? "Aucun objectif en cours." : "No active objectives."}
                    </p>
                  )}
                  <Link
                    href="/admin/goals"
                    className="mt-3 inline-block text-xs font-semibold text-deep/60 hover:text-deep"
                  >
                    {fr ? "Gérer les objectifs →" : "Manage objectives →"}
                  </Link>
                </div>

                <div className="card">
                  <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                    {fr ? "Feedback récent" : "Recent feedback"}
                  </div>
                  {recentFeedback.length ? (
                    <div className="mt-2.5 space-y-2.5">
                      {recentFeedback.map((item) => (
                        <FeedbackCard key={item.id} item={item} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-ink/45">
                      {fr ? "Aucun feedback visible." : "No visible feedback."}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
