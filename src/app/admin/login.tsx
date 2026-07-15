"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { LangToggle, Logo } from "@/components/ui";

export function Login() {
  const { t } = useI18n();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    setBusy(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBFB]">
      <header className="flex items-center justify-between border-b border-cloud bg-white px-5 py-4">
        <Logo />
        <LangToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-5">
        <form onSubmit={submit} className="card w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-deep">{t("login.title")}</h1>
          <p className="mt-1 text-sm text-ink/50">{t("login.note")}</p>
          <label className="label mt-6">{t("login.code")}</label>
          <input
            type="password"
            className="input"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          {error ? <p className="mt-2 text-sm text-coral">{t("login.error")}</p> : null}
          <button className="btn-primary mt-5 w-full" disabled={busy || !code}>
            {t("login.submit")}
          </button>
        </form>
      </main>
    </div>
  );
}
