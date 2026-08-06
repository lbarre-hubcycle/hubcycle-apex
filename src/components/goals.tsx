"use client";

import { useState } from "react";
import { FRAMEWORK_MAP } from "@/data/competency-framework";
import { useI18n } from "@/lib/i18n";
import type { Goal, GoalStatus } from "@/lib/types";

export const STATUS_META: Record<
  GoalStatus,
  { fr: string; en: string; chip: string; bar: string }
> = {
  "on-track": { fr: "En bonne voie", en: "On track", chip: "bg-sky/40 text-deep", bar: "bg-deep" },
  "at-risk": { fr: "À risque", en: "At risk", chip: "bg-coral/15 text-coral", bar: "bg-coral" },
  done: { fr: "Atteint", en: "Done", chip: "bg-deep text-white", bar: "bg-deep" },
  dropped: { fr: "Abandonné", en: "Dropped", chip: "bg-cloud text-ink/50", bar: "bg-ink/25" },
};

/** One objective. `onCheckin`/`onDelete` enable the interactive controls. */
export function GoalCard({
  goal,
  onCheckin,
  onDelete,
}: {
  goal: Goal;
  onCheckin?: (status: GoalStatus, progress: number, note: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<GoalStatus>(goal.status);
  const [progress, setProgress] = useState(goal.progress);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const meta = STATUS_META[goal.status];
  const perf = goal.kind === "performance";
  const closed = goal.status === "done" || goal.status === "dropped";
  const target = goal.targetDate
    ? new Date(goal.targetDate).toLocaleDateString(fr ? "fr-FR" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  async function submitCheckin() {
    if (!onCheckin || busy) return;
    setBusy(true);
    await onCheckin(status, progress, note);
    setBusy(false);
    setNote("");
    setOpen(false);
  }

  return (
    <div className={`rounded-2xl border border-cloud/80 bg-white p-4 ${closed ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            perf ? "bg-coral/10 text-coral" : "bg-lavender/40 text-deep"
          }`}
        >
          {perf ? (fr ? "🎯 Performance" : "🎯 Performance") : fr ? "🌱 Développement" : "🌱 Development"}
        </span>
        {goal.competency && FRAMEWORK_MAP[goal.competency] ? (
          <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-medium text-ink/60">
            {goal.competency} · {l(FRAMEWORK_MAP[goal.competency].name)}
          </span>
        ) : null}
        {goal.kpi ? (
          <span className="rounded-full bg-cloud px-2 py-0.5 text-[11px] font-medium text-ink/60">
            KPI : {goal.kpi}
          </span>
        ) : null}
        <span className={`ml-auto rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.chip}`}>
          {fr ? meta.fr : meta.en}
        </span>
      </div>

      <div className="mt-2 text-sm font-semibold text-ink">{goal.title}</div>
      {goal.description ? (
        <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-ink/60">
          {goal.description}
        </p>
      ) : null}

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-cloud">
          <div className={`h-full rounded-full ${meta.bar}`} style={{ width: `${goal.progress}%` }} />
        </div>
        <span className="w-9 text-right text-xs font-semibold text-deep">{goal.progress}%</span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/45">
        {target ? <span>🗓 {fr ? "Échéance" : "Due"} {target}</span> : null}
        <span>
          {goal.checkins.length} {fr ? "check-in(s)" : "check-in(s)"}
        </span>
        <span>
          · {fr ? "créé par" : "created by"} {goal.createdByName}
        </span>
        {onCheckin && !closed ? (
          <button
            onClick={() => setOpen(!open)}
            className="ml-auto font-semibold text-deep/70 hover:text-deep"
          >
            {open ? (fr ? "Fermer" : "Close") : fr ? "Check-in" : "Check-in"}
          </button>
        ) : null}
        {onDelete ? (
          <button
            onClick={() => void onDelete()}
            className={`font-semibold text-coral/60 hover:text-coral ${onCheckin && !closed ? "" : "ml-auto"}`}
          >
            {fr ? "Supprimer" : "Delete"}
          </button>
        ) : null}
      </div>

      {open && onCheckin ? (
        <div className="mt-3 rounded-xl bg-cloud/40 p-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(STATUS_META) as GoalStatus[]).map((statusId) => (
              <button
                key={statusId}
                onClick={() => setStatus(statusId)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === statusId
                    ? "bg-deep text-white"
                    : "border border-deep/15 text-deep/70 hover:bg-white"
                }`}
              >
                {fr ? STATUS_META[statusId].fr : STATUS_META[statusId].en}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="flex-1 accent-deep"
            />
            <span className="w-9 text-right text-xs font-semibold text-deep">{progress}%</span>
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1000}
            placeholder={fr ? "Note (optionnel) — quoi de neuf ?" : "Note (optional) — what's new?"}
            className="mt-2.5 w-full rounded-xl border border-deep/15 bg-white px-3 py-2 text-xs"
          />
          <button
            onClick={() => void submitCheckin()}
            disabled={busy}
            className="btn-coral mt-2.5 !px-4 !py-1.5 !text-xs disabled:opacity-40"
          >
            {busy ? "…" : fr ? "Enregistrer" : "Save"}
          </button>
        </div>
      ) : null}

      {goal.checkins.length > 0 && open ? (
        <div className="mt-3 space-y-1.5 border-t border-cloud/70 pt-3">
          {[...goal.checkins].reverse().map((checkin, i) => (
            <div key={i} className="flex flex-wrap items-baseline gap-x-2 text-[11px] text-ink/55">
              <span className="font-medium text-ink/70">
                {new Date(checkin.date).toLocaleDateString(fr ? "fr-FR" : "en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span>
                {fr ? STATUS_META[checkin.status].fr : STATUS_META[checkin.status].en} ·{" "}
                {checkin.progress}%
              </span>
              {checkin.note ? <span className="text-ink/45">— {checkin.note}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
