"use client";

import { useMemo, useState } from "react";
import { FRAMEWORK_MAP, ROLE_EXPECTATIONS_MAP } from "@/data/competency-framework";
import { ROLE_MAP } from "@/data/roles";
import { VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { STATUS_META } from "@/components/goals";
import type { PerformanceReview, Person, ReviewRating } from "@/lib/types";

/**
 * Performance review (cycle-based): objectives snapshot + competency and
 * Manifesto ratings (self & manager, 1–4 vs the role's expectations) + summary.
 * The employee's and the manager's sides stay hidden from each other until
 * submitted / shared — enforced server-side.
 */

const SCALE: { value: number; fr: string; en: string }[] = [
  { value: 1, fr: "En construction", en: "Developing" },
  { value: 2, fr: "Proche des attentes", en: "Approaching" },
  { value: 3, fr: "Conforme aux attentes", en: "Meets expectations" },
  { value: 4, fr: "Dépasse les attentes", en: "Exceeds" },
];

const CYCLE = "2026-S2";

export default function ReviewPage() {
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

  const [personId, setPersonId] = useState("");
  const person: Person | undefined =
    manageable.find((p) => p.id === personId) ??
    manageable.find((p) => p.id === viewer?.personId) ??
    manageable[0];

  const isSelf = !!viewer?.personId && viewer.personId === person?.id;
  const isMgr =
    viewer?.role === "hr" ||
    (!!viewer?.personId &&
      !!person &&
      (person.managerId === viewer.personId || person.dottedManagerId === viewer.personId));

  const reviews = useMemo(
    () => [...(person?.reviews ?? [])].sort((a, b) => b.cycle.localeCompare(a.cycle)),
    [person]
  );
  const [reviewId, setReviewId] = useState("");
  const review = reviews.find((r) => r.id === reviewId) ?? reviews[0];

  const [busy, setBusy] = useState(false);
  async function patch(payload: object) {
    if (!person || !review) return;
    setBusy(true);
    await fetch("/api/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: person.id, reviewId: review.id, ...payload }),
    });
    setBusy(false);
    await refresh();
  }

  async function createReview() {
    if (!person) return;
    setBusy(true);
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: person.id, cycle: CYCLE }),
    });
    setBusy(false);
    await refresh();
  }

  const role = person?.roleId ? ROLE_MAP[person.roleId] : undefined;
  const exp = person?.roleId ? ROLE_EXPECTATIONS_MAP[person.roleId] : undefined;
  const competencyCodes = [
    ...(exp?.competencies ?? []),
    ...["A1", "A2", "A3", "A4", "A5", "A6"],
  ];
  const locked = review?.status === "done";
  const canRateSelf = isSelf && !locked && review?.status === "self";
  const canRateMgr = isMgr && !locked;

  const statusLabel: Record<string, { fr: string; en: string; chip: string }> = {
    self: { fr: "Auto-évaluation en cours", en: "Self-assessment in progress", chip: "bg-sky/40 text-deep" },
    manager: { fr: "Évaluation manager en cours", en: "Manager assessment in progress", chip: "bg-lavender/50 text-deep" },
    shared: { fr: "Partagée — à discuter", en: "Shared — to discuss", chip: "bg-coral/15 text-coral" },
    done: { fr: "Clôturée", en: "Completed", chip: "bg-deep text-white" },
  };

  return (
    <div>
      <SectionTitle
        title={fr ? "Revue de performance" : "Performance review"}
        sub={
          fr
            ? "Objectifs, compétences et culture — auto-évaluation puis évaluation manager, sur un même référentiel."
            : "Objectives, competencies and culture — self-assessment then manager assessment, on one shared referential."
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {manageable.length > 1 && person ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-wide text-deep/60">
              {fr ? "Revue de" : "Review of"}
            </span>
            <select
              value={person.id}
              onChange={(e) => {
                setPersonId(e.target.value);
                setReviewId("");
              }}
              className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
            >
              {manageable.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                  {p.id === viewer?.personId ? (fr ? " (moi)" : " (me)") : ""}
                </option>
              ))}
            </select>
          </>
        ) : null}
        {role ? <span className="text-xs text-ink/45">{l(role.title)}</span> : null}
        {reviews.length > 1 ? (
          <select
            value={review?.id ?? ""}
            onChange={(e) => setReviewId(e.target.value)}
            className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
          >
            {reviews.map((r) => (
              <option key={r.id} value={r.id}>
                {r.cycle}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {!person ? (
        <div className="card text-ink/45">
          {fr ? "Votre compte n'est pas relié à un profil employé." : "Your account is not linked to an employee profile."}
        </div>
      ) : !review ? (
        <div className="card">
          <p className="text-sm text-ink/50">
            {fr
              ? `Aucune revue pour ${person.name.split(" ")[0]}.`
              : `No review for ${person.name.split(" ")[0]} yet.`}
          </p>
          {isMgr ? (
            <button onClick={() => void createReview()} disabled={busy} className="btn-coral mt-4">
              {busy ? "…" : fr ? `Lancer la revue ${CYCLE}` : `Start the ${CYCLE} review`}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Status + actions */}
          <div className="card flex flex-wrap items-center gap-3">
            <span className="font-heading text-lg text-deep">{review.cycle}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusLabel[review.status].chip}`}
            >
              {fr ? statusLabel[review.status].fr : statusLabel[review.status].en}
            </span>
            <span className="text-xs text-ink/45">
              {fr ? "Évaluateur" : "Reviewer"} : {review.reviewerName}
            </span>
            <div className="ml-auto flex flex-wrap gap-2">
              {isSelf && review.status === "self" ? (
                <button onClick={() => void patch({ transition: "submit-self" })} disabled={busy} className="btn-coral !px-4 !py-2 !text-xs">
                  {fr ? "Soumettre mon auto-évaluation" : "Submit my self-assessment"}
                </button>
              ) : null}
              {isMgr && (review.status === "self" || review.status === "manager") ? (
                <button onClick={() => void patch({ transition: "share" })} disabled={busy} className="btn-coral !px-4 !py-2 !text-xs">
                  {fr ? "Partager avec l'employé·e" : "Share with the employee"}
                </button>
              ) : null}
              {isSelf && review.status === "shared" ? (
                <button onClick={() => void patch({ transition: "done" })} disabled={busy} className="btn-coral !px-4 !py-2 !text-xs">
                  {fr ? "J'en ai pris connaissance" : "Acknowledge"}
                </button>
              ) : null}
              {viewer?.role === "hr" && (review.status === "manager" || review.status === "shared") ? (
                <button onClick={() => void patch({ transition: "reopen" })} disabled={busy} className="btn-ghost !px-3 !py-2 !text-xs">
                  {fr ? "Rouvrir" : "Reopen"}
                </button>
              ) : null}
            </div>
          </div>

          {/* Scale legend */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink/55">
            {SCALE.map((s) => (
              <span key={s.value} className="rounded-full bg-cloud px-2.5 py-1">
                <span className="font-bold text-deep">{s.value}</span> · {fr ? s.fr : s.en}
              </span>
            ))}
            <span className="italic">
              {fr ? "…par rapport aux attentes du rôle" : "…relative to the role's expectations"}
              {exp ? ` (${exp.level === "junior" ? "Junior" : exp.level === "mid" ? fr ? "Confirmé" : "Mid" : "Senior"})` : ""}
            </span>
          </div>

          {/* Objectives snapshot */}
          <div className="card">
            <h3 className="font-heading text-base text-deep">
              {fr ? "Objectifs de la période" : "Objectives of the period"}
            </h3>
            {(person.goals ?? []).length ? (
              <div className="mt-3 space-y-1.5">
                {(person.goals ?? []).map((g) => (
                  <div key={g.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_META[g.status].chip}`}
                    >
                      {fr ? STATUS_META[g.status].fr : STATUS_META[g.status].en}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-ink/80">{g.title}</span>
                    <span className="text-xs font-semibold text-deep">{g.progress}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink/45">{fr ? "Aucun objectif enregistré." : "No objectives recorded."}</p>
            )}
            <CommentPair
              fr={fr}
              selfText={review.objectivesComment?.self}
              managerText={review.objectivesComment?.manager}
              canSelf={canRateSelf}
              canMgr={canRateMgr}
              onSave={(side, text) => patch({ objectivesComment: { side, text } })}
            />
          </div>

          {/* Competencies */}
          <div className="card">
            <h3 className="font-heading text-base text-deep">
              {fr ? "Compétences du référentiel" : "Framework competencies"}
            </h3>
            <div className="mt-3 space-y-3">
              {competencyCodes.map((code) => (
                <RatingRow
                  key={code}
                  label={`${code} · ${l(FRAMEWORK_MAP[code].name)}`}
                  anchor={exp ? l(FRAMEWORK_MAP[code].levels[exp.level]) : undefined}
                  rating={review.competencies[code] ?? {}}
                  fr={fr}
                  canSelf={canRateSelf}
                  canMgr={canRateMgr}
                  onRate={(side, rating) => patch({ rating: { kind: "competency", key: code, side, rating } })}
                  onNote={(side, note) => patch({ rating: { kind: "competency", key: code, side, note } })}
                />
              ))}
            </div>
          </div>

          {/* Manifesto values */}
          <div className="card">
            <h3 className="font-heading text-base text-deep">
              {fr ? "Culture — le Manifeste" : "Culture — the Manifesto"}
            </h3>
            <div className="mt-3 space-y-3">
              {VALUES.map((v) => (
                <RatingRow
                  key={v.id}
                  label={l(v.name)}
                  anchor={l(v.scope)}
                  rating={review.values[v.id] ?? {}}
                  fr={fr}
                  canSelf={canRateSelf}
                  canMgr={canRateMgr}
                  onRate={(side, rating) => patch({ rating: { kind: "value", key: v.id, side, rating } })}
                  onNote={(side, note) => patch({ rating: { kind: "value", key: v.id, side, note } })}
                />
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="card">
            <h3 className="font-heading text-base text-deep">{fr ? "Synthèse" : "Summary"}</h3>
            <CommentPair
              fr={fr}
              selfText={review.summary?.self}
              managerText={review.summary?.manager}
              canSelf={canRateSelf}
              canMgr={canRateMgr}
              onSave={(side, text) => patch({ summary: { side, text } })}
            />
            {(isMgr || review.status === "shared" || review.status === "done") &&
            (canRateMgr || review.summary?.overall) ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-deep/60">
                  {fr ? "Évaluation globale" : "Overall rating"}
                </span>
                {SCALE.map((s) => (
                  <button
                    key={s.value}
                    disabled={!canRateMgr}
                    onClick={() => void patch({ overall: s.value })}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      review.summary?.overall === s.value
                        ? "bg-deep text-white"
                        : canRateMgr
                          ? "border border-deep/15 text-deep/70 hover:bg-cloud"
                          : "border border-deep/10 text-deep/30"
                    }`}
                  >
                    {s.value} · {fr ? s.fr : s.en}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

/** One competency/value row: anchor text + self and manager rating lines. */
function RatingRow({
  label,
  anchor,
  rating,
  fr,
  canSelf,
  canMgr,
  onRate,
  onNote,
}: {
  label: string;
  anchor?: string;
  rating: ReviewRating;
  fr: boolean;
  canSelf: boolean;
  canMgr: boolean;
  onRate: (side: "self" | "manager", value: number) => void;
  onNote: (side: "self" | "manager", note: string) => void;
}) {
  const line = (side: "self" | "manager") => {
    const value = side === "self" ? rating.self : rating.manager;
    const note = side === "self" ? rating.selfNote : rating.managerNote;
    const editable = side === "self" ? canSelf : canMgr;
    if (!editable && value === undefined && !note) return null;
    return (
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
        <span className="w-24 shrink-0 text-[11px] font-semibold text-deep/50">
          {side === "self" ? (fr ? "Auto-éval." : "Self") : "Manager"}
        </span>
        {[1, 2, 3, 4].map((v) => (
          <button
            key={v}
            disabled={!editable}
            onClick={() => onRate(side, v)}
            className={`h-7 w-7 rounded-full text-xs font-bold ${
              value === v
                ? side === "self"
                  ? "bg-sky text-deep"
                  : "bg-deep text-white"
                : editable
                  ? "border border-deep/15 text-deep/60 hover:bg-cloud"
                  : "border border-deep/10 text-deep/25"
            }`}
          >
            {v}
          </button>
        ))}
        {editable ? (
          <input
            defaultValue={note ?? ""}
            onBlur={(e) => {
              if (e.target.value !== (note ?? "")) onNote(side, e.target.value);
            }}
            maxLength={1000}
            placeholder={fr ? "Commentaire (optionnel)…" : "Comment (optional)…"}
            className="min-w-0 flex-1 rounded-lg border border-deep/10 px-2.5 py-1.5 text-xs"
          />
        ) : note ? (
          <span className="min-w-0 flex-1 text-xs text-ink/60">{note}</span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-cloud/80 bg-white p-3">
      <div className="text-sm font-semibold text-ink">{label}</div>
      {anchor ? <div className="mt-0.5 text-[11px] italic text-ink/45">{anchor}</div> : null}
      {line("self")}
      {line("manager")}
    </div>
  );
}

/** Self + manager comment blocks with dirty-save. */
function CommentPair({
  fr,
  selfText,
  managerText,
  canSelf,
  canMgr,
  onSave,
}: {
  fr: boolean;
  selfText?: string;
  managerText?: string;
  canSelf: boolean;
  canMgr: boolean;
  onSave: (side: "self" | "manager", text: string) => void;
}) {
  const [drafts, setDrafts] = useState<{ self?: string; manager?: string }>({});
  const block = (side: "self" | "manager") => {
    const saved = side === "self" ? selfText : managerText;
    const editable = side === "self" ? canSelf : canMgr;
    const draft = drafts[side];
    if (!editable && !saved) return null;
    return (
      <div className="mt-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-deep/60">
          {side === "self" ? (fr ? "Commentaire de l'employé·e" : "Employee comment") : fr ? "Commentaire du manager" : "Manager comment"}
        </div>
        {editable ? (
          <>
            <textarea
              value={draft ?? saved ?? ""}
              onChange={(e) => setDrafts({ ...drafts, [side]: e.target.value })}
              rows={3}
              maxLength={3000}
              className="mt-1.5 w-full rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
            />
            {draft !== undefined && draft !== (saved ?? "") ? (
              <button
                onClick={() => {
                  onSave(side, draft);
                  setDrafts({ ...drafts, [side]: undefined });
                }}
                className="btn-coral mt-1.5 !px-3 !py-1.5 !text-xs"
              >
                {fr ? "Enregistrer" : "Save"}
              </button>
            ) : null}
          </>
        ) : (
          <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink/75">{saved}</p>
        )}
      </div>
    );
  };
  return (
    <>
      {block("self")}
      {block("manager")}
    </>
  );
}
