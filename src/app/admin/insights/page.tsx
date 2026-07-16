"use client";

import { useState } from "react";
import { PROFILES } from "@/lib/profiles";
import { VALUES } from "@/lib/culture";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";
import { DistBars, Scale5 } from "@/components/charts";

export default function InsightsPage() {
  const { t, l } = useI18n();
  const { db } = useAdminState();
  const [selected, setSelected] = useState<string>("all");

  const all = (db?.people ?? []).filter((p) => p.results);
  const done = selected === "all" ? all : all.filter((p) => p.teamId === selected);
  const employees = done.filter((p) => p.kind === "employee");
  const candidates = done.filter((p) => p.kind === "candidate");

  const dist = PROFILES.map((prof) => ({
    label: `${prof.emoji} ${l(prof.shortName)}`,
    value: done.filter((p) => p.results!.primaryProfile === prof.id).length,
    color: prof.id === "driver" || prof.id === "pit-crew" ? "#FF684D" : "#A1D0DB",
  }));

  const avgValue = (vid: string) =>
    done.length
      ? Math.round(
          (done.reduce((s, p) => s + (p.results!.valueScores as Record<string, number>)[vid], 0) /
            done.length) *
            10
        ) / 10
      : 0;

  return (
    <div>
      <SectionTitle title={t("insights.title")} sub={t("insights.sub")} />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSelected("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            selected === "all" ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
          }`}
        >
          {t("dyn.allHubcycle")}
        </button>
        {(db?.teams ?? []).map((team) => (
          <button
            key={team.id}
            onClick={() => setSelected(team.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              selected === team.id ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
            }`}
          >
            {team.name}
          </button>
        ))}
      </div>

      {done.length === 0 ? (
        <div className="card text-ink/40">{t("insights.none")}</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card">
            <h3 className="font-heading text-lg text-deep">{t("insights.profileDist")}</h3>
            <div className="mt-5">
              <DistBars data={dist} />
            </div>
            <p className="mt-3 text-xs text-ink/40">
              {employees.length} {t("common.employees").toLowerCase()} · {candidates.length}{" "}
              {t("common.candidates").toLowerCase()}
            </p>
          </div>
          <div className="card">
            <h3 className="font-heading text-lg text-deep">{t("insights.cultureAvg")}</h3>
            <div className="mt-4 divide-y divide-cloud/70">
              {VALUES.map((v) => (
                <Scale5 key={v.id} label={l(v.name)} sublabel={l(v.scope)} value={avgValue(v.id)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
