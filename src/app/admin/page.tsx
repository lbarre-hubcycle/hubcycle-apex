"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";

export default function AdminDashboard() {
  const { t } = useI18n();
  const { db } = useAdminState();

  const completed = db?.people.filter((p) => p.results).length ?? 0;
  const pending = db ? db.people.length - completed : 0;
  const teams = db?.teams.length ?? 0;

  const sections = [
    { href: "/admin/recruit", key: "nav.recruit", desc: "section.recruit.desc", color: "bg-coral" },
    { href: "/admin/dynamics", key: "nav.dynamics", desc: "section.dynamics.desc", color: "bg-deep" },
    { href: "/admin/coach", key: "nav.coach", desc: "section.coach.desc", color: "bg-deep" },
    { href: "/admin/growth", key: "nav.growth", desc: "section.growth.desc", color: "bg-deep" },
    { href: "/admin/insights", key: "nav.insights", desc: "section.insights.desc", color: "bg-deep" },
  ] as const;

  return (
    <div>
      <SectionTitle title={t("dash.title")} sub={`Apex — ${t("tagline")}`} />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          [completed, t("dash.completed")],
          [pending, t("dash.pending")],
          [teams, t("dash.teams")],
        ].map(([n, label], i) => (
          <div key={i} className="card">
            <div className="text-4xl font-semibold text-deep">{n as number}</div>
            <div className="mt-1 text-sm text-ink/60">{label as string}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className={`rounded-blob ${s.color} p-6 text-white transition-opacity hover:opacity-90`}>
            <div className="font-heading text-xl">{t(s.key)}</div>
            <p className="mt-1 text-sm text-white/70">{t(s.desc)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
