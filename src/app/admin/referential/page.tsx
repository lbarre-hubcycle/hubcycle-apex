"use client";

import { useState } from "react";
import {
  FAMILY_LABELS,
  FRAMEWORK,
  FRAMEWORK_MAP,
  ROLE_EXPECTATIONS,
  type CompetencyFamily,
} from "@/data/competency-framework";
import { ROLE_MAP } from "@/data/roles";
import { useI18n } from "@/lib/i18n";
import { SectionTitle } from "@/components/ui";

const LEVEL_LABELS = {
  junior: { en: "Junior", fr: "Junior" },
  mid: { en: "Mid", fr: "Confirmé" },
  senior: { en: "Senior", fr: "Senior" },
} as const;

/** The validated competency & KPI referential (read-only v1). */
export default function ReferentialPage() {
  const { t, l, lang } = useI18n();
  const fr = lang === "fr";
  const [tab, setTab] = useState<"competencies" | "roles">("competencies");
  const families: CompetencyFamily[] = ["core", "functional", "leadership"];

  return (
    <div>
      <SectionTitle title={t("ref.title")} sub={t("ref.sub")} />

      <div className="mb-6 flex gap-2">
        {(["competencies", "roles"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === v ? "bg-deep text-white" : "border border-deep/20 text-deep hover:bg-cloud"
            }`}
          >
            {v === "competencies" ? t("ref.tabCompetencies") : t("ref.tabRoles")}
          </button>
        ))}
      </div>

      {tab === "competencies" ? (
        <div className="space-y-8">
          {families.map((family) => (
            <div key={family}>
              <h2 className="mb-3 font-heading text-xl text-deep">{l(FAMILY_LABELS[family])}</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {FRAMEWORK.filter((c) => c.family === family).map((c) => (
                  <div key={c.code} className="card">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="mr-2 rounded-full bg-deep/10 px-2 py-0.5 text-xs font-bold text-deep">
                          {c.code}
                        </span>
                        <span className="font-heading text-base text-deep">{l(c.name)}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-ink/70">{l(c.oneLiner)}</p>
                    <p className="mt-2 text-xs text-ink/45">
                      <strong>{fr ? "Mesure" : "Measured by"} :</strong> {l(c.measuredBy)}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {(["junior", "mid", "senior"] as const).map((lvl) => (
                        <div key={lvl} className="rounded-xl bg-cloud/50 p-2.5">
                          <div className="text-[10px] font-bold uppercase tracking-wide text-deep/60">
                            {l(LEVEL_LABELS[lvl])}
                          </div>
                          <p className="mt-1 text-xs leading-snug text-ink/75">{l(c.levels[lvl])}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-x-auto !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cloud text-left text-xs uppercase tracking-wide text-deep/60">
                <th className="px-5 py-3">{t("common.role")}</th>
                <th className="px-5 py-3">{fr ? "Niveau" : "Level"}</th>
                <th className="px-5 py-3">{t("ref.keyKpi")}</th>
                <th className="px-5 py-3">{t("ref.secondaryKpis")}</th>
                <th className="px-5 py-3">{t("ref.competencies")}</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_EXPECTATIONS.map((r) => {
                const role = ROLE_MAP[r.roleId];
                if (!role) return null;
                return (
                  <tr key={r.roleId} className="border-b border-cloud/60 align-top">
                    <td className="px-5 py-3 font-medium text-ink">{l(role.title)}</td>
                    <td className="px-5 py-3 text-ink/60">{l(LEVEL_LABELS[r.level])}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-coral/10 px-2.5 py-1 text-xs font-semibold text-coral">
                        {l(r.keyKpi)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-ink/70">
                      {r.secondaryKpis.map((k, i) => (
                        <div key={i}>• {l(k)}</div>
                      ))}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {r.competencies.map((code) => (
                          <span
                            key={code}
                            title={l(FRAMEWORK_MAP[code].name)}
                            className="cursor-help rounded-full bg-deep/10 px-2 py-0.5 text-[11px] font-semibold text-deep"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-ink/40">{t("ref.coreNote")}</p>
        </div>
      )}
    </div>
  );
}
