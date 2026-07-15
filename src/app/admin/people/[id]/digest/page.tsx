"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { PROFILE_MAP } from "@/lib/profiles";
import { useI18n } from "@/lib/i18n";
import { PrintButton } from "@/components/ui";
import { Disclaimer, ProfileHero, StrengthsWatchouts, WorkstyleBlock } from "@/components/report";
import type { Person } from "@/lib/types";

/**
 * Candidate digest — a shareable summary of personality and contribution
 * style ONLY. Deliberately excludes: culture alignment vs the Manifesto,
 * role success-factor ratings, and any team comparison.
 */
export default function DigestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, l, lang } = useI18n();
  const [person, setPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetch(`/api/people/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { person: Person }) => setPerson(d.person))
      .catch(() => setPerson(null));
  }, [id]);

  if (!person?.results) return <p className="text-ink/50">…</p>;

  const results = person.results;
  const primary = PROFILE_MAP[results.primaryProfile];
  const dateStr = person.completedAt
    ? new Date(person.completedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-6 flex items-center justify-between gap-3">
        <Link href={`/admin/people/${person.id}`} className="text-sm text-deep/60 hover:text-deep">
          ← {t("common.back")}
        </Link>
        <PrintButton label={t("report.downloadPdf")} />
      </div>

      <div className="print-page mb-4 rounded-blob bg-deep p-8 text-white">
        <div className="text-xs font-semibold uppercase tracking-widest text-sky">
          Apex · {t("report.digest")}
        </div>
        <h1 className="mt-2 font-heading text-3xl">{person.name}</h1>
        <p className="mt-1 text-sm text-white/70">{dateStr}</p>
      </div>

      <div className="no-print mb-4 rounded-2xl bg-sky/30 p-4 text-sm text-deep">
        {t("report.digestNote")}
      </div>

      <div className="space-y-4">
        <ProfileHero results={results} />
        <StrengthsWatchouts results={results} />
        <div className="print-page card">
          <h3 className="font-heading text-lg text-deep">{t("report.motivators")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink/80">
            {primary.motivators.map((m, i) => (
              <li key={i}>▲ {l(m)}</li>
            ))}
          </ul>
        </div>
        <WorkstyleBlock results={results} />
      </div>

      <Disclaimer />
    </div>
  );
}
