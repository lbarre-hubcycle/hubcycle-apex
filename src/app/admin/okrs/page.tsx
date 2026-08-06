"use client";

import { useMemo, useState } from "react";
import { BUDGET_LINES, BUDGET_MAP } from "@/data/budget";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import type { KeyResult, Okr, OkrText } from "@/lib/types";

/**
 * Company OKRs — one page per quarter, few objectives, measurable key
 * results owned by departments, tagged to budget lines, grounded in the
 * quarterly SWOT. Everyone sees them (alignment needs transparency);
 * HR shapes them; HR and managers check in.
 */

/** 0–100 progress; supports decreasing targets (burn, overdue invoices). */
function krProgress(kr: KeyResult): number {
  if (kr.target === kr.start) {
    return (kr.target >= kr.start ? kr.current >= kr.target : kr.current <= kr.target) ? 100 : 0;
  }
  return Math.min(100, Math.max(0, Math.round(((kr.current - kr.start) / (kr.target - kr.start)) * 100)));
}

const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1).replace(".", ","));

/** Fraction of the period already elapsed (0 before it starts, 1 after it ends). */
function elapsedFraction(period: string, now = new Date()): number {
  const year = Number(period.slice(0, 4));
  const q = period.includes("-Q") ? Number(period.slice(-1)) : null;
  const start = q ? new Date(year, (q - 1) * 3, 1) : new Date(year, 0, 1);
  const end = q ? new Date(year, q * 3, 1) : new Date(year + 1, 0, 1);
  return Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())));
}

export type KrStatus =
  | "done"
  | "missed"
  | "postponed"
  | "on-track"
  | "off-track"
  | "delayed"
  | "not-started";

/**
 * Status: an explicit closing outcome wins; otherwise progress compared to
 * how far into the period we are (a finished period with <100% = missed).
 */
function krStatus(kr: KeyResult, period: string): KrStatus {
  if (kr.outcome === "achieved") return "done";
  if (kr.outcome === "missed") return "missed";
  if (kr.outcome === "postponed") return "postponed";
  const p = krProgress(kr);
  if (p >= 100) return "done";
  const expected = elapsedFraction(period) * 100;
  if (expected >= 100) return "missed";
  if (expected === 0) return "not-started";
  const ratio = p / expected;
  if (ratio >= 0.85) return "on-track";
  if (ratio >= 0.5) return "off-track";
  return "delayed";
}

const STATUS_STYLE: Record<KrStatus, { fr: string; en: string; chip: string; dot: string }> = {
  done: { fr: "Atteint", en: "Achieved", chip: "bg-deep text-white", dot: "bg-deep" },
  missed: { fr: "Manqué", en: "Missed", chip: "bg-coral text-white", dot: "bg-coral" },
  postponed: { fr: "Reporté", en: "Postponed", chip: "bg-lavender/60 text-deep", dot: "bg-lavender" },
  "on-track": { fr: "En bonne voie", en: "On track", chip: "bg-sky/40 text-deep", dot: "bg-sky" },
  "off-track": { fr: "Off track", en: "Off track", chip: "bg-coral/15 text-coral", dot: "bg-coral/60" },
  delayed: { fr: "En retard", en: "Delayed", chip: "bg-coral/40 text-white", dot: "bg-coral/70" },
  "not-started": { fr: "À venir", en: "Not started", chip: "bg-cloud text-ink/50", dot: "bg-ink/20" },
};

const YEAR_VIEW = "2026";

export default function OkrsPage() {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const { db, viewer, okrs, refresh } = useAdminState();
  const isHr = viewer?.role === "hr";
  const canCheckIn = viewer?.role === "hr" || viewer?.role === "manager";
  const tx = (v: OkrText | undefined) => (v === undefined ? "" : typeof v === "string" ? v : l(v));

  const periods = useMemo(() => {
    const set = new Set(okrs.map((o) => o.period).filter((p) => p.includes("-Q")));
    set.add("2026-Q3");
    set.add("2026-Q4");
    return [...set].sort();
  }, [okrs]);
  const [period, setPeriod] = useState("2026-Q3");
  const yearView = period === YEAR_VIEW;
  const list = okrs.filter((o) => o.period === period);
  const yearOkrs = useMemo(
    () =>
      okrs
        .filter((o) => o.period.startsWith(YEAR_VIEW))
        .sort((a, b) => a.period.localeCompare(b.period)),
    [okrs]
  );

  // Individual objectives aligned to a KR (viewer-scoped people).
  const alignedCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of db?.people ?? []) {
      for (const g of p.goals ?? []) {
        if (g.okrId) counts.set(g.okrId, (counts.get(g.okrId) ?? 0) + 1);
      }
    }
    return counts;
  }, [db]);

  const allKrs = list.flatMap((o) => o.keyResults);
  const overall = allKrs.length
    ? Math.round(allKrs.reduce((s, kr) => s + krProgress(kr), 0) / allKrs.length)
    : 0;

  const [newObjective, setNewObjective] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [busy, setBusy] = useState(false);

  async function api(method: "POST" | "PATCH" | "DELETE", payload?: object, query = "") {
    setBusy(true);
    const res = await fetch(`/api/okrs${query}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });
    setBusy(false);
    if (res.ok) await refresh();
    return res.ok;
  }

  async function seed() {
    setBusy(true);
    const res = await fetch("/api/okrs/seed", { method: "POST" });
    setBusy(false);
    if (res.ok) await refresh();
  }

  const SEED_PERIODS = ["2026", "2026-Q1", "2026-Q2", "2026-Q3"];
  const seedMissing = SEED_PERIODS.filter((p) => !okrs.some((o) => o.period === p));

  return (
    <div>
      <SectionTitle
        title="OKRs Hubcycle"
        sub={
          fr
            ? "Peu d'objectifs, des résultats mesurables, revus chaque mois — définis après le SWOT du trimestre."
            : "Few objectives, measurable results, reviewed monthly — set after the quarter's SWOT."
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              period === p ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
            }`}
          >
            {p.replace("-", " ")}
          </button>
        ))}
        <button
          onClick={() => setPeriod(YEAR_VIEW)}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            yearView ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
          }`}
        >
          {fr ? "2026 · Année" : "2026 · Year"}
        </button>
        {!yearView && list.length ? (
          <span className="ml-auto rounded-full bg-deep px-4 py-2 text-sm font-bold text-white">
            {fr ? "Avancement" : "Progress"} · {overall}%
          </span>
        ) : null}
      </div>

      {/* Methodology guardrails */}
      <div className="mb-6 rounded-2xl bg-sky/15 px-4 py-3 text-xs leading-relaxed text-deep">
        {fr ? (
          <>
            <span className="font-semibold">La méthode :</span> max 4 objectifs par trimestre, 3 à 5
            résultats clés chacun — des <span className="font-semibold">résultats mesurables</span>,
            pas des listes de tâches. Chaque KR a un département responsable, se rattache au budget
            quand il bouge une ligne, et cite le constat SWOT qui le justifie. Q3–Q4 2026 : priorité
            au <span className="font-semibold">billing</span>.
          </>
        ) : (
          <>
            <span className="font-semibold">The method:</span> max 4 objectives per quarter, 3–5 key
            results each — <span className="font-semibold">measurable outcomes</span>, not task
            lists. Every KR has an owning department, tags the budget line it moves, and cites the
            SWOT finding behind it. Q3–Q4 2026: <span className="font-semibold">billing</span> first.
          </>
        )}
      </div>

      {isHr && seedMissing.length ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-coral/25 bg-coral/5 px-4 py-3">
          <span className="text-xs text-ink/70">
            {fr
              ? `Proposition 2026 simplifiée disponible (${seedMissing.join(", ")}) — annuel + trimestres, avec les résultats réels Q1-Q2.`
              : `Simplified 2026 proposal available (${seedMissing.join(", ")}) — annual + quarters, with actual Q1-Q2 results.`}
          </span>
          <button onClick={() => void seed()} disabled={busy} className="btn-coral !px-4 !py-2 !text-xs">
            {busy ? "…" : fr ? "Charger" : "Load"}
          </button>
        </div>
      ) : null}

      {yearView ? (
        <YearView okrs={yearOkrs} fr={fr} tx={tx} />
      ) : list.length === 0 ? (
        <div className="card">
          <p className="text-sm text-ink/50">
            {fr ? "Aucun OKR pour cette période." : "No OKRs for this period."}
          </p>
          {isHr ? (
            <button onClick={() => setShowNew(true)} className="btn-ghost mt-4">
              {fr ? "+ Objectif vierge" : "+ Blank objective"}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="space-y-5">
          {list.map((okr) => (
            <ObjectiveCard
              key={okr.id}
              okr={okr}
              isHr={!!isHr}
              canCheckIn={!!canCheckIn}
              busy={busy}
              api={api}
              aligned={alignedCount}
              fr={fr}
              l={l}
              tx={tx}
            />
          ))}
          {isHr && list.length < 4 ? (
            <button onClick={() => setShowNew(!showNew)} className="btn-ghost">
              {fr ? "+ Ajouter un objectif" : "+ Add an objective"}
            </button>
          ) : null}
        </div>
      )}

      {isHr && showNew ? (
        <div className="card mt-4 max-w-2xl">
          <h3 className="font-heading text-base text-deep">
            {fr ? "Nouvel objectif" : "New objective"} — {period.replace("-", " ")}
          </h3>
          <input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            maxLength={300}
            placeholder={fr ? "Qualitatif et mémorable…" : "Qualitative and memorable…"}
            className="mt-3 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-sm font-medium"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
            maxLength={1000}
            placeholder={fr ? "Pourquoi maintenant — constat SWOT…" : "Why now — SWOT finding…"}
            className="mt-2 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-xs"
          />
          <button
            onClick={async () => {
              if (await api("POST", { period, objective: newObjective, description: newDescription })) {
                setNewObjective("");
                setNewDescription("");
                setShowNew(false);
              }
            }}
            disabled={!newObjective.trim() || busy}
            className="btn-coral mt-3 disabled:opacity-40"
          >
            {fr ? "Créer" : "Create"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Annual follow-up: every quarter side by side, with a status summary. */
function YearView({
  okrs,
  fr,
  tx,
}: {
  okrs: Okr[];
  fr: boolean;
  tx: (v: OkrText | undefined) => string;
}) {
  // The four retrospective questions: set / achieved / missed / postponed
  // (everything else is simply "in progress").
  const bucketOf = (s: KrStatus) =>
    s === "done" ? "achieved" : s === "missed" ? "missed" : s === "postponed" ? "postponed" : "inProgress";
  const allKrs = okrs.flatMap((o) => o.keyResults.map((k) => ({ kr: k, period: o.period })));
  const totals = { set: allKrs.length, achieved: 0, missed: 0, postponed: 0, inProgress: 0 };
  for (const { kr, period } of allKrs) totals[bucketOf(krStatus(kr, period))]++;
  const quarters = [...new Set(okrs.map((o) => o.period))].sort();
  const qLabel = (q: string) =>
    q.includes("-Q") ? q.replace("-", " ") : `${q} · ${fr ? "Annuel" : "Annual"}`;

  if (!okrs.length) {
    return (
      <div className="card text-sm text-ink/50">
        {fr ? "Aucun OKR 2026 pour l'instant." : "No 2026 OKRs yet."}
      </div>
    );
  }

  const TILES: { key: keyof typeof totals; fr: string; en: string; chip: string }[] = [
    { key: "set", fr: "Fixés", en: "Set", chip: "bg-deep/10 text-deep" },
    { key: "achieved", fr: "Atteints", en: "Achieved", chip: STATUS_STYLE.done.chip },
    { key: "missed", fr: "Manqués", en: "Missed", chip: STATUS_STYLE.missed.chip },
    { key: "postponed", fr: "Reportés", en: "Postponed", chip: STATUS_STYLE.postponed.chip },
    { key: "inProgress", fr: "En cours", en: "In progress", chip: STATUS_STYLE["on-track"].chip },
  ];

  return (
    <div className="space-y-6">
      {/* What did we set / achieve / miss / postpone */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {TILES.map((t) => (
          <div key={t.key} className="card !p-4 text-center">
            <div className="text-2xl font-bold text-deep">{totals[t.key]}</div>
            <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${t.chip}`}>
              {fr ? t.fr : t.en}
            </span>
          </div>
        ))}
      </div>

      {quarters.map((q) => {
        const qOkrs = okrs.filter((o) => o.period === q);
        const qKrs = qOkrs.flatMap((o) => o.keyResults);
        const qProgress = qKrs.length
          ? Math.round(qKrs.reduce((s, k) => s + krProgress(k), 0) / qKrs.length)
          : 0;
        const qTotals = { set: qKrs.length, achieved: 0, missed: 0, postponed: 0, inProgress: 0 };
        for (const k of qKrs) qTotals[bucketOf(krStatus(k, q))]++;
        return (
          <div key={q} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-lg text-deep">{qLabel(q)}</h3>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                <span className="rounded-full bg-deep/10 px-2 py-0.5 text-deep">
                  {qTotals.set} {fr ? "fixés" : "set"}
                </span>
                <span className={`rounded-full px-2 py-0.5 ${STATUS_STYLE.done.chip}`}>
                  {qTotals.achieved} {fr ? "atteints" : "achieved"}
                </span>
                <span className={`rounded-full px-2 py-0.5 ${STATUS_STYLE.missed.chip}`}>
                  {qTotals.missed} {fr ? "manqués" : "missed"}
                </span>
                <span className={`rounded-full px-2 py-0.5 ${STATUS_STYLE.postponed.chip}`}>
                  {qTotals.postponed} {fr ? "reportés" : "postponed"}
                </span>
                {qTotals.inProgress ? (
                  <span className={`rounded-full px-2 py-0.5 ${STATUS_STYLE["on-track"].chip}`}>
                    {qTotals.inProgress} {fr ? "en cours" : "in progress"}
                  </span>
                ) : null}
                <span className="rounded-full bg-deep px-2 py-0.5 text-white">{qProgress}%</span>
              </div>
            </div>
            <div className="mt-3 space-y-4">
              {qOkrs.map((o) => (
                <div key={o.id}>
                  <div className="text-sm font-semibold text-ink">{tx(o.objective)}</div>
                  <div className="mt-1.5 space-y-1">
                    {o.keyResults.map((k) => {
                      const s = krStatus(k, o.period);
                      return (
                        <div key={k.id} className="flex items-center gap-2 text-xs">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_STYLE[s].dot}`} />
                          <span className="min-w-0 flex-1 truncate text-ink/70" title={tx(k.title)}>
                            {k.team ? <span className="font-medium text-deep/60">{k.team} · </span> : null}
                            {tx(k.title)}
                          </span>
                          <span className="w-9 shrink-0 text-right font-semibold text-deep">
                            {krProgress(k)}%
                          </span>
                          <span className={`w-24 shrink-0 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold ${STATUS_STYLE[s].chip}`}>
                            {fr ? STATUS_STYLE[s].fr : STATUS_STYLE[s].en}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ObjectiveCard({
  okr,
  isHr,
  canCheckIn,
  busy,
  api,
  aligned,
  fr,
  l,
  tx,
}: {
  okr: Okr;
  isHr: boolean;
  canCheckIn: boolean;
  busy: boolean;
  api: (m: "POST" | "PATCH" | "DELETE", p?: object, q?: string) => Promise<boolean>;
  aligned: Map<string, number>;
  fr: boolean;
  l: (s: { en: string; fr: string }) => string;
  tx: (v: OkrText | undefined) => string;
}) {
  const [showKrForm, setShowKrForm] = useState(false);
  const [checkinKr, setCheckinKr] = useState<string | null>(null);
  const [checkinValue, setCheckinValue] = useState("");
  const [checkinNote, setCheckinNote] = useState("");
  const [kr, setKr] = useState({ title: "", team: "", owner: "", budgetTag: "", swot: "", start: "0", target: "100", unit: "%" });

  const progress = okr.keyResults.length
    ? Math.round(okr.keyResults.reduce((s, k) => s + krProgress(k), 0) / okr.keyResults.length)
    : 0;

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-lg text-deep">{tx(okr.objective)}</h3>
          {okr.description ? <p className="mt-1 text-xs text-ink/55">{tx(okr.description)}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-deep/10 px-3 py-1.5 text-sm font-bold text-deep">{progress}%</span>
          {isHr ? (
            <button
              onClick={() => {
                if (window.confirm(fr ? "Supprimer cet objectif et ses KRs ?" : "Delete this objective and its KRs?")) {
                  void api("DELETE", undefined, `?okrId=${okr.id}`);
                }
              }}
              className="text-xs font-semibold text-coral/60 hover:text-coral"
            >
              {fr ? "Supprimer" : "Delete"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {okr.keyResults.map((k) => {
          const p = krProgress(k);
          const budget = k.budgetTag ? BUDGET_MAP[k.budgetTag] : undefined;
          const nAligned = aligned.get(k.id) ?? 0;
          return (
            <div key={k.id} className="rounded-2xl border border-cloud/80 bg-white p-3.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {k.team ? (
                  <span className="rounded-full bg-deep/10 px-2 py-0.5 font-semibold text-deep">{k.team}</span>
                ) : null}
                {k.owner ? <span className="text-ink/50">{k.owner}</span> : null}
                {budget ? (
                  <span
                    className="rounded-full bg-coral/10 px-2 py-0.5 font-semibold text-coral"
                    title={`${fr ? "Budget 2026" : "2026 budget"}: ${budget.annualTarget}`}
                  >
                    💶 {l(budget.label)} · {budget.annualTarget}
                  </span>
                ) : null}
                {nAligned ? (
                  <span className="rounded-full bg-lavender/40 px-2 py-0.5 font-semibold text-deep">
                    {nAligned} {fr ? "obj. individuel(s)" : "individual obj."}
                  </span>
                ) : null}
                {isHr ? (
                  <button
                    onClick={() => void api("PATCH", { okrId: okr.id, removeKrId: k.id })}
                    className="ml-auto text-ink/30 hover:text-coral"
                  >
                    ×
                  </button>
                ) : null}
              </div>
              <div className="mt-1.5 text-sm font-medium text-ink">{tx(k.title)}</div>
              {k.swot ? (
                <div className="mt-1 text-[11px] italic text-ink/45">SWOT : {tx(k.swot)}</div>
              ) : null}
              <div className="mt-2 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cloud">
                  <div
                    className={`h-full rounded-full ${p >= 70 ? "bg-deep" : p >= 35 ? "bg-sky" : "bg-coral"}`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-deep">
                  {fmt(k.current)} / {fmt(k.target)}
                  {k.unit ? ` ${k.unit}` : ""}
                </span>
                {canCheckIn ? (
                  <button
                    onClick={() => {
                      setCheckinKr(checkinKr === k.id ? null : k.id);
                      setCheckinValue(String(k.current));
                      setCheckinNote("");
                    }}
                    className="text-xs font-semibold text-deep/60 hover:text-deep"
                  >
                    Check-in
                  </button>
                ) : null}
              </div>
              {isHr && elapsedFraction(okr.period) >= 1 ? (
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-ink/40">{fr ? "Clôture :" : "Closing:"}</span>
                  {(["achieved", "missed", "postponed"] as const).map((outcome) => (
                    <button
                      key={outcome}
                      onClick={() =>
                        void api("PATCH", {
                          okrId: okr.id,
                          setOutcome: { krId: k.id, outcome: k.outcome === outcome ? null : outcome },
                        })
                      }
                      className={`rounded-full px-2.5 py-1 font-semibold ${
                        k.outcome === outcome
                          ? STATUS_STYLE[outcome === "achieved" ? "done" : outcome].chip
                          : "border border-deep/15 text-deep/60 hover:bg-cloud"
                      }`}
                    >
                      {outcome === "achieved"
                        ? fr ? "Atteint" : "Achieved"
                        : outcome === "missed"
                          ? fr ? "Manqué" : "Missed"
                          : fr ? "Reporté" : "Postponed"}
                    </button>
                  ))}
                </div>
              ) : null}
              {checkinKr === k.id ? (
                <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl bg-cloud/40 p-2.5">
                  <input
                    type="number"
                    step="any"
                    value={checkinValue}
                    onChange={(e) => setCheckinValue(e.target.value)}
                    className="w-24 rounded-lg border border-deep/15 px-2.5 py-1.5 text-sm"
                  />
                  <span className="text-xs text-ink/50">{k.unit}</span>
                  <input
                    value={checkinNote}
                    onChange={(e) => setCheckinNote(e.target.value)}
                    maxLength={500}
                    placeholder={fr ? "Note (optionnel)" : "Note (optional)"}
                    className="min-w-0 flex-1 rounded-lg border border-deep/15 px-2.5 py-1.5 text-xs"
                  />
                  <button
                    onClick={async () => {
                      const value = Number(checkinValue.replace(",", "."));
                      if (!isFinite(value)) return;
                      if (await api("PATCH", { okrId: okr.id, checkIn: { krId: k.id, value, note: checkinNote } })) {
                        setCheckinKr(null);
                      }
                    }}
                    disabled={busy}
                    className="btn-coral !px-3 !py-1.5 !text-xs disabled:opacity-40"
                  >
                    OK
                  </button>
                </div>
              ) : null}
              {k.checkIns.length && checkinKr === k.id ? (
                <div className="mt-2 space-y-1 pl-1 text-[11px] text-ink/50">
                  {[...k.checkIns].reverse().slice(0, 4).map((c, i) => (
                    <div key={i}>
                      {new Date(c.date).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "short" })} ·{" "}
                      {fmt(c.value)}
                      {k.unit ? ` ${k.unit}` : ""} · {c.byName}
                      {c.note ? ` — ${c.note}` : ""}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {isHr && okr.keyResults.length < 5 ? (
        <button onClick={() => setShowKrForm(!showKrForm)} className="mt-3 text-xs font-semibold text-deep/60 hover:text-deep">
          {showKrForm ? (fr ? "Fermer" : "Close") : fr ? "+ Résultat clé" : "+ Key result"}
        </button>
      ) : null}
      {isHr && showKrForm ? (
        <div className="mt-2 rounded-2xl bg-cloud/40 p-3.5">
          <input
            value={kr.title}
            onChange={(e) => setKr({ ...kr, title: e.target.value })}
            maxLength={300}
            placeholder={fr ? "Résultat mesurable (pas une tâche)…" : "Measurable result (not a task)…"}
            className="w-full rounded-xl border border-deep/15 bg-white px-3 py-2 text-sm"
          />
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input value={kr.team} onChange={(e) => setKr({ ...kr, team: e.target.value })} maxLength={60}
              placeholder={fr ? "Département (Supply, Finance…)" : "Department"} className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-xs" />
            <input value={kr.owner} onChange={(e) => setKr({ ...kr, owner: e.target.value })} maxLength={60}
              placeholder={fr ? "Responsable" : "Owner"} className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-xs" />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select value={kr.budgetTag} onChange={(e) => setKr({ ...kr, budgetTag: e.target.value })}
              className="rounded-xl border border-deep/15 bg-white px-3 py-2 text-xs">
              <option value="">{fr ? "Ligne budget (optionnel)" : "Budget line (optional)"}</option>
              {BUDGET_LINES.map((b) => (
                <option key={b.id} value={b.id}>{l(b.label)} · {b.annualTarget}</option>
              ))}
            </select>
            <input value={kr.start} onChange={(e) => setKr({ ...kr, start: e.target.value })} type="number" step="any"
              placeholder={fr ? "Départ" : "Start"} title={fr ? "Départ" : "Start"} className="w-20 rounded-xl border border-deep/15 bg-white px-2.5 py-2 text-xs" />
            <span className="text-xs text-ink/40">→</span>
            <input value={kr.target} onChange={(e) => setKr({ ...kr, target: e.target.value })} type="number" step="any"
              placeholder={fr ? "Cible" : "Target"} title={fr ? "Cible" : "Target"} className="w-20 rounded-xl border border-deep/15 bg-white px-2.5 py-2 text-xs" />
            <input value={kr.unit} onChange={(e) => setKr({ ...kr, unit: e.target.value })} maxLength={10}
              placeholder={fr ? "Unité" : "Unit"} className="w-16 rounded-xl border border-deep/15 bg-white px-2.5 py-2 text-xs" />
          </div>
          <input value={kr.swot} onChange={(e) => setKr({ ...kr, swot: e.target.value })} maxLength={500}
            placeholder={fr ? "Constat SWOT qui justifie ce KR (optionnel)" : "SWOT finding behind this KR (optional)"}
            className="mt-2 w-full rounded-xl border border-deep/15 bg-white px-3 py-2 text-xs" />
          <button
            onClick={async () => {
              const payload = {
                okrId: okr.id,
                addKr: {
                  ...kr,
                  start: Number(kr.start) || 0,
                  target: Number(kr.target) || 0,
                  current: Number(kr.start) || 0,
                },
              };
              if (await api("PATCH", payload)) {
                setKr({ title: "", team: "", owner: "", budgetTag: "", swot: "", start: "0", target: "100", unit: "%" });
                setShowKrForm(false);
              }
            }}
            disabled={!kr.title.trim() || busy}
            className="btn-coral mt-3 !px-4 !py-2 !text-xs disabled:opacity-40"
          >
            {fr ? "Ajouter" : "Add"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
