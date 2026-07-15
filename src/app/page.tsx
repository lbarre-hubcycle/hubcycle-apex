"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LangToggle, Logo } from "@/components/ui";
import { PROFILES } from "@/lib/profiles";

export default function Home() {
  const { t, l } = useI18n();

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <LangToggle />
          <Link href="/admin" className="btn-ghost text-sm">
            {t("home.admin")}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral">
          Apex — {t("tagline")}
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-deep">
          {t("home.title")}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink/70">{t("home.sub")}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/admin" className="btn-primary">
            {t("home.admin")}
          </Link>
          <span className="text-sm text-ink/50">{t("home.invitedHint")}</span>
        </div>
      </section>

      <section className="border-t border-cloud bg-[#FBFBFB] py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILES.map((p) => (
              <div key={p.id} className="card">
                <div className="text-2xl">{p.emoji}</div>
                <div className="mt-2 font-heading text-lg text-deep">{l(p.name)}</div>
                <p className="mt-1 text-sm text-ink/60">{l(p.tagline)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-3 lg:grid-cols-5">
        {(
          [
            ["nav.recruit", "section.recruit.desc"],
            ["nav.dynamics", "section.dynamics.desc"],
            ["nav.coach", "section.coach.desc"],
            ["nav.growth", "section.growth.desc"],
            ["nav.insights", "section.insights.desc"],
          ] as const
        ).map(([k, d]) => (
          <div key={k} className="rounded-blob bg-deep p-5 text-white">
            <div className="font-heading">{t(k)}</div>
            <p className="mt-1 text-sm text-white/70">{t(d)}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-cloud py-8 text-center text-xs text-ink/40">
        Apex, the Performance Intelligence Platform by Hubcycle
      </footer>
    </div>
  );
}
