"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useAdminState } from "@/lib/useAdminState";
import { SectionTitle } from "@/components/ui";

export default function AdminDashboard() {
  const { t } = useI18n();
  const { db, viewer } = useAdminState();
  const router = useRouter();

  useEffect(() => {
    if (viewer?.role === "employee") router.replace("/admin/me");
  }, [viewer, router]);

  const completed = db?.people.filter((p) => p.results).length ?? 0;
  const pending = db ? db.people.length - completed : 0;
  const teams = db?.teams.length ?? 0;

  const sections = [
    { href: "/admin/me", key: "nav.cockpit", desc: "section.cockpit.desc", color: "bg-deep", roles: ["hr", "manager", "employee"] },
    { href: "/admin/dynamics", key: "nav.crew", desc: "section.crew.desc", color: "bg-deep", roles: ["hr", "manager"] },
    { href: "/admin/insights", key: "nav.company", desc: "section.company.desc", color: "bg-deep", roles: ["hr"] },
    { href: "/admin/recruit", key: "nav.recruit", desc: "section.recruit.desc", color: "bg-coral", roles: ["hr", "recruiter"] },
    { href: "/admin/settings", key: "nav.settings", desc: "settings.sub", color: "bg-deep", roles: ["hr"] },
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
        {sections
          .filter((s) => !viewer || (s.roles as readonly string[]).includes(viewer.role))
          .map((s) => (
          <Link key={s.href} href={s.href} className={`rounded-blob ${s.color} p-6 text-white transition-opacity hover:opacity-90`}>
            <div className="font-heading text-xl">{t(s.key)}</div>
            <p className="mt-1 text-sm text-white/70">{t(s.desc)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
