"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`font-heading text-xl tracking-tight ${light ? "text-white" : "text-deep"}`}>
      apex<span className="text-coral">.</span>
    </span>
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

const NAV = [
  { href: "/admin/recruit", key: "nav.recruit" as const },
  { href: "/admin/dynamics", key: "nav.dynamics" as const },
  { href: "/admin/coach", key: "nav.coach" as const },
  { href: "/admin/growth", key: "nav.growth" as const },
  { href: "/admin/insights", key: "nav.insights" as const },
  { href: "/admin/methodology", key: "nav.methodology" as const },
];

export function AdminShell({ children, demoMode }: { children: React.ReactNode; demoMode?: boolean }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB]">
      <header className="no-print sticky top-0 z-20 border-b border-cloud bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
          <Link href="/admin">
            <Logo />
          </Link>
          <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                  pathname.startsWith(n.href)
                    ? "bg-deep text-white"
                    : "text-deep/70 hover:bg-cloud hover:text-deep"
                }`}
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>
          <LangToggle />
          <button onClick={logout} className="text-xs font-semibold text-deep/50 hover:text-deep">
            {t("nav.logout")}
          </button>
        </div>
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
