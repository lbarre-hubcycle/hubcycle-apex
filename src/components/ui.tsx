"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-baseline gap-1.5">
      <span className={`font-heading text-xl tracking-tight ${light ? "text-white" : "text-deep"}`}>
        apex<span className="text-coral">.</span>
      </span>
      <span className={`text-xs font-medium ${light ? "text-white/70" : "text-deep/50"}`}>
        by Hubcycle
      </span>
    </Link>
  );
}

export function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-deep/15 p-0.5 text-xs font-semibold">
      {(["en", "fr"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === l ? "bg-deep text-white" : "text-deep/60 hover:text-deep"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export type ShellViewer = { role: "hr" | "manager" | "recruiter" | "employee"; name: string; legacy: boolean };

type Role = ShellViewer["role"];
const ALL: Role[] = ["hr", "manager", "recruiter", "employee"];

/** Audience-based structure: Cockpit (me) / My Crew (team) / Hubcycle (company) / Recruit / Admin. */
const GROUPS: {
  id: string;
  key: "nav.cockpit" | "nav.crew" | "nav.company" | "nav.recruit" | "nav.settings";
  items: { href: string; key: "nav.me" | "nav.dynamics" | "nav.coach" | "nav.growth" | "nav.insights" | "nav.referential" | "nav.methodology" | "nav.recruit" | "nav.compare" | "nav.settings"; roles: Role[] }[];
}[] = [
  {
    id: "cockpit",
    key: "nav.cockpit",
    items: [{ href: "/admin/me", key: "nav.me", roles: ["hr", "manager", "employee"] }],
  },
  {
    id: "crew",
    key: "nav.crew",
    items: [
      { href: "/admin/dynamics", key: "nav.dynamics", roles: ["hr", "manager"] },
      { href: "/admin/coach", key: "nav.coach", roles: ["hr", "manager"] },
      { href: "/admin/growth", key: "nav.growth", roles: ["hr", "manager"] },
    ],
  },
  {
    id: "company",
    key: "nav.company",
    items: [
      { href: "/admin/insights", key: "nav.insights", roles: ["hr"] },
      { href: "/admin/referential", key: "nav.referential", roles: ALL },
      { href: "/admin/methodology", key: "nav.methodology", roles: ALL },
    ],
  },
  {
    id: "recruit",
    key: "nav.recruit",
    items: [
      { href: "/admin/recruit", key: "nav.recruit", roles: ["hr", "recruiter"] },
      { href: "/admin/recruit/compare", key: "nav.compare", roles: ["hr", "recruiter"] },
    ],
  },
  {
    id: "admin",
    key: "nav.settings",
    items: [{ href: "/admin/settings", key: "nav.settings", roles: ["hr"] }],
  },
];

export function AdminShell({
  children,
  demoMode,
  viewer,
}: {
  children: React.ReactNode;
  demoMode?: boolean;
  viewer: ShellViewer;
}) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const groups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((i) => i.roles.includes(viewer.role)),
  })).filter((g) => g.items.length > 0);
  const activeGroup = groups.find((g) => g.items.some((i) => pathname.startsWith(i.href)));

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    const { signOut } = await import("next-auth/react");
    await signOut({ redirect: false }).catch(() => {});
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <header className="no-print sticky top-0 z-20 border-b border-cloud bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
          <Logo />
          <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm">
            {groups.map((g) => (
              <Link
                key={g.id}
                href={g.items[0].href}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                  activeGroup?.id === g.id
                    ? "bg-deep text-white"
                    : "text-deep/70 hover:bg-cloud hover:text-deep"
                }`}
              >
                {t(g.key)}
              </Link>
            ))}
          </nav>
          <span className="hidden text-xs text-ink/45 sm:inline">
            {viewer.name}
            {viewer.legacy ? " · code" : ""}
          </span>
          <LangToggle />
          <button onClick={logout} className="text-xs font-semibold text-deep/50 hover:text-deep">
            {t("nav.logout")}
          </button>
        </div>
        {activeGroup && activeGroup.items.length > 1 ? (
          <div className="border-t border-cloud/70 bg-white/70">
            <div className="mx-auto flex max-w-6xl items-center gap-1 px-5 py-1.5 text-xs">
              {activeGroup.items.map((i) => (
                <Link
                  key={i.href}
                  href={i.href}
                  className={`rounded-full px-3 py-1 font-medium transition-colors ${
                    pathname.startsWith(i.href)
                      ? "bg-sky/50 text-deep"
                      : "text-ink/55 hover:bg-cloud hover:text-deep"
                  }`}
                >
                  {t(i.key)}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {demoMode ? (
          <div className="bg-coral/10 px-5 py-1.5 text-center text-xs font-medium text-coral">
            {t("common.demo")}
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}

export function PrintButton({ label }: { label: string }) {
  return (
    <button onClick={() => window.print()} className="btn-coral no-print">
      {label}
    </button>
  );
}

export function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-semibold text-deep">{title}</h1>
      {sub ? <p className="mt-1 text-ink/60">{sub}</p> : null}
    </div>
  );
}
