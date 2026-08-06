"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useI18n } from "@/lib/i18n";
import { LangToggle, Logo } from "@/components/ui";

export function Login({ ssoEnabled, devMode }: { ssoEnabled: boolean; devMode: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showLegacy, setShowLegacy] = useState(!ssoEnabled && !devMode);

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError(true);
  }

  async function submitDev(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await signIn("dev", { email: devEmail, redirect: false });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFB]">
      <header className="flex items-center justify-between border-b border-cloud bg-white px-5 py-4">
        <Logo />
        <LangToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5">
        <div className="card w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-deep">{t("login.title")}</h1>
          <p className="mt-1 text-sm text-ink/50">{t("login.ssoNote")}</p>

          {ssoEnabled ? (
            <button
              onClick={() => signIn("google")}
              className="btn-primary mt-6 w-full"
              disabled={busy}
            >
              {t("login.sso")}
            </button>
          ) : null}

          {devMode ? (
            <form onSubmit={submitDev} className="mt-4">
              <label className="label">Dev login (email)</label>
              <input
                className="input"
                type="email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="prenom@hubcycled.com"
              />
              <button className="btn-ghost mt-3 w-full" disabled={busy || !devEmail}>
                Dev sign-in
              </button>
            </form>
          ) : null}

          {showLegacy ? (
            <form onSubmit={submitCode} className="mt-5 border-t border-cloud pt-5">
              <label className="label">{t("login.code")}</label>
              <input
                type="password"
                className="input"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
              />
              {error ? <p className="mt-2 text-sm text-coral">{t("login.error")}</p> : null}
              <button className="btn-primary mt-4 w-full" disabled={busy || !code}>
                {t("login.submit")}
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowLegacy(true)}
              className="mt-5 w-full text-center text-xs text-ink/40 hover:text-deep"
            >
              {t("login.legacy")}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
