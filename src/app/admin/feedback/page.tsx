"use client";

import { useMemo, useState } from "react";
import { VALUES } from "@/lib/culture";
import { FRAMEWORK_MAP, ROLE_EXPECTATIONS_MAP } from "@/data/competency-framework";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { FeedbackCard } from "@/components/feedback";
import type { FeedbackType, FeedbackVisibility } from "@/lib/types";

/**
 * Instant feedback (Leapsome-style). Two types: praise (tagged on Manifesto
 * values) and constructive (optionally tagged on the recipient's role
 * competencies). Anyone internal can give feedback to any employee and
 * choose who may read it: everyone, the employee only, or employee + manager.
 */
export default function FeedbackPage() {
  const { l, lang } = useI18n();
  const fr = lang === "fr";
  const { db, viewer, directory, wall, refresh } = useAdminState();

  const [toId, setToId] = useState("");
  const [type, setType] = useState<FeedbackType>("praise");
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [visibility, setVisibility] = useState<FeedbackVisibility>("all");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const recipients = useMemo(
    () => directory.filter((p) => p.id !== viewer?.personId),
    [directory, viewer]
  );
  const recipient = recipients.find((p) => p.id === toId);

  // Praise → the 7 Manifesto values. Constructive → the recipient's role
  // competencies first (their referential), then the shared core.
  const tagOptions = useMemo(() => {
    if (type === "praise") return VALUES.map((v) => ({ id: v.id as string, label: l(v.name) }));
    const roleCodes = recipient?.roleId
      ? (ROLE_EXPECTATIONS_MAP[recipient.roleId]?.competencies ?? [])
      : [];
    const core = ["A1", "A2", "A3", "A4", "A5", "A6"];
    return [...roleCodes, ...core].map((code) => ({
      id: code,
      label: `${code} · ${l(FRAMEWORK_MAP[code].name)}`,
    }));
  }, [type, recipient, l]);

  function switchType(next: FeedbackType) {
    setType(next);
    setTags([]);
    setVisibility(next === "praise" ? "all" : "recipient-manager");
  }

  async function send() {
    if (!toId || !message.trim() || sending) return;
    setSending(true);
    setError(false);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toPersonId: toId, type, message, tags, visibility }),
    });
    setSending(false);
    if (!res.ok) {
      setError(true);
      return;
    }
    setMessage("");
    setTags([]);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    await refresh();
  }

  const me = viewer?.personId ? db?.people.find((p) => p.id === viewer.personId) : undefined;
  const received = [...(me?.feedback ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const visibilityOptions: { id: FeedbackVisibility; label: string; hint: string }[] = [
    {
      id: "all",
      label: fr ? "Visible de tous" : "Visible to all",
      hint: fr ? "Publié sur le mur" : "Published on the wall",
    },
    {
      id: "recipient",
      label: fr ? "Employé uniquement" : "Employee only",
      hint: fr ? "Personne d'autre — pas même les RH" : "Nobody else — not even HR",
    },
    {
      id: "recipient-manager",
      label: fr ? "Employé + manager" : "Employee + manager",
      hint: fr ? "L'employé et son ou ses managers" : "The employee and their manager(s)",
    },
  ];

  return (
    <div>
      <SectionTitle
        title="Feedback"
        sub={
          fr
            ? "Un bravo ou un feedback constructif, à chaud, à n'importe qui — vous choisissez qui peut le lire."
            : "Praise or constructive feedback, in the moment, to anyone — you choose who can read it."
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Give feedback */}
        <div className="card self-start">
          <h3 className="font-heading text-lg text-deep">
            {fr ? "Donner un feedback" : "Give feedback"}
          </h3>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-deep/60">
            {fr ? "À" : "To"}
          </label>
          <select
            value={toId}
            onChange={(e) => {
              setToId(e.target.value);
              if (type === "constructive") setTags([]);
            }}
            className="mt-1.5 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">{fr ? "Choisir une personne…" : "Pick a person…"}</option>
            {recipients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => switchType("praise")}
              className={`rounded-2xl border p-3 text-left ${
                type === "praise" ? "border-sky bg-sky/15" : "border-deep/10 hover:bg-cloud"
              }`}
            >
              <div className="text-sm font-semibold text-deep">🙌 {fr ? "Bravo" : "Praise"}</div>
              <div className="mt-0.5 text-[11px] text-ink/55">
                {fr ? "Taggé sur les valeurs du Manifeste" : "Tagged on Manifesto values"}
              </div>
            </button>
            <button
              onClick={() => switchType("constructive")}
              className={`rounded-2xl border p-3 text-left ${
                type === "constructive"
                  ? "border-lavender bg-lavender/15"
                  : "border-deep/10 hover:bg-cloud"
              }`}
            >
              <div className="text-sm font-semibold text-deep">
                🧭 {fr ? "Constructif" : "Constructive"}
              </div>
              <div className="mt-0.5 text-[11px] text-ink/55">
                {fr ? "Taggé sur les compétences du rôle (optionnel)" : "Tagged on role competencies (optional)"}
              </div>
            </button>
          </div>

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-deep/60">
            {type === "praise"
              ? fr ? "Valeurs illustrées (optionnel)" : "Values shown (optional)"
              : fr ? "Compétences concernées (optionnel)" : "Competencies involved (optional)"}
          </label>
          {type === "constructive" && !recipient ? (
            <p className="mt-1.5 text-xs text-ink/45">
              {fr
                ? "Choisissez d'abord la personne pour voir les compétences de son rôle."
                : "Pick the person first to see their role's competencies."}
            </p>
          ) : (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tagOptions.map((opt) => {
                const on = tags.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setTags(on ? tags.filter((id) => id !== opt.id) : [...tags, opt.id])
                    }
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      on
                        ? "bg-deep text-white"
                        : "border border-deep/15 text-deep/70 hover:bg-cloud"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-deep/60">
            {fr ? "Message" : "Message"}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={
              type === "praise"
                ? fr
                  ? "Ce qui a été fait, et l'impact que ça a eu…"
                  : "What was done, and the impact it had…"
                : fr
                  ? "Factuel et bienveillant : la situation, l'effet observé, une suggestion…"
                  : "Factual and kind: the situation, the observed effect, a suggestion…"
            }
            className="mt-1.5 w-full rounded-xl border border-deep/15 bg-white px-3 py-2.5 text-sm"
          />

          <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-deep/60">
            {fr ? "Qui peut le lire ?" : "Who can read it?"}
          </label>
          <div className="mt-1.5 space-y-1.5">
            {visibilityOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm ${
                  visibility === opt.id ? "border-deep bg-deep/5" : "border-deep/10 hover:bg-cloud"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  checked={visibility === opt.id}
                  onChange={() => setVisibility(opt.id)}
                  className="accent-deep"
                />
                <span className="font-medium text-deep">{opt.label}</span>
                <span className="text-xs text-ink/45">{opt.hint}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={send}
              disabled={!toId || !message.trim() || sending}
              className="btn-coral disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? "…" : fr ? "Envoyer" : "Send"}
            </button>
            {sent ? (
              <span className="text-sm font-medium text-deep">
                ✓ {fr ? "Feedback envoyé" : "Feedback sent"}
              </span>
            ) : null}
            {error ? (
              <span className="text-sm font-medium text-coral">
                {fr ? "Échec de l'envoi — réessayez." : "Send failed — try again."}
              </span>
            ) : null}
          </div>
        </div>

        {/* Received */}
        <div className="card self-start">
          <h3 className="font-heading text-lg text-deep">
            {fr ? "Mon feedback reçu" : "My received feedback"}
          </h3>
          {!viewer?.personId ? (
            <p className="mt-3 text-sm text-ink/45">
              {fr
                ? "Votre compte n'est pas relié à un profil employé — le feedback reçu apparaîtra ici."
                : "Your account is not linked to an employee profile — received feedback will show here."}
            </p>
          ) : received.length === 0 ? (
            <p className="mt-3 text-sm text-ink/45">
              {fr ? "Rien pour l'instant." : "Nothing yet."}
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {received.map((item) => (
                <FeedbackCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Public wall */}
      <div className="mt-8">
        <h3 className="font-heading text-lg text-deep">
          {fr ? "Le mur — feedback public" : "The wall — public feedback"}
        </h3>
        {wall.length === 0 ? (
          <p className="mt-2 text-sm text-ink/45">
            {fr
              ? "Les feedbacks « visibles de tous » apparaissent ici pour toute l'équipe."
              : "Feedback marked \"visible to all\" shows up here for the whole team."}
          </p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {wall.map((item) => (
              <FeedbackCard
                key={item.id}
                item={item}
                toName={item.toName}
                onDelete={
                  viewer?.role === "hr" || viewer?.personId === item.fromId
                    ? async () => {
                        await fetch(
                          `/api/feedback?personId=${item.toId}&feedbackId=${item.id}`,
                          { method: "DELETE" }
                        );
                        await refresh();
                      }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
