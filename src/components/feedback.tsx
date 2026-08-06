"use client";

import { VALUES } from "@/lib/culture";
import { FRAMEWORK_MAP } from "@/data/competency-framework";
import { useI18n } from "@/lib/i18n";
import type { FeedbackItem } from "@/lib/types";

const VALUE_MAP = Object.fromEntries(VALUES.map((v) => [v.id, v]));

export function tagLabel(tag: string, l: (s: { en: string; fr: string }) => string): string {
  const value = VALUE_MAP[tag];
  if (value) return l(value.name);
  const comp = FRAMEWORK_MAP[tag];
  if (comp) return `${tag} · ${l(comp.name)}`;
  return tag;
}

/** One feedback item. `toName` adds a recipient line (wall usage). */
export function FeedbackCard({
  item,
  toName,
  onDelete,
}: {
  item: FeedbackItem;
  toName?: string;
  onDelete?: () => void;
}) {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const praise = item.type === "praise";
  const date = new Date(item.createdAt).toLocaleDateString(fr ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const visibilityLabel =
    item.visibility === "all"
      ? fr ? "Visible de tous" : "Visible to all"
      : item.visibility === "recipient-manager"
        ? fr ? "Employé + manager" : "Employee + manager"
        : fr ? "Employé uniquement" : "Employee only";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        praise ? "border-sky/50 bg-sky/10" : "border-lavender/50 bg-lavender/10"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`rounded-full px-2.5 py-1 font-semibold ${
            praise ? "bg-sky/50 text-deep" : "bg-lavender/50 text-deep"
          }`}
        >
          {praise ? (fr ? "🙌 Bravo" : "🙌 Praise") : fr ? "🧭 Constructif" : "🧭 Constructive"}
        </span>
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-white/70 px-2 py-0.5 font-medium text-deep/70">
            {tagLabel(tag, l)}
          </span>
        ))}
      </div>
      <p className="mt-2.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{item.message}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/45">
        <span className="font-medium text-ink/60">
          {fr ? "De" : "From"} {item.fromName}
        </span>
        {toName ? (
          <span>
            → {fr ? "pour" : "for"} <span className="font-medium text-ink/60">{toName}</span>
          </span>
        ) : null}
        <span>· {date}</span>
        <span>· {visibilityLabel}</span>
        {onDelete ? (
          <button onClick={onDelete} className="ml-auto font-semibold text-coral/70 hover:text-coral">
            {fr ? "Supprimer" : "Delete"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
