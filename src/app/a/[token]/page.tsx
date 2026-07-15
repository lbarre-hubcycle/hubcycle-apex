"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LangToggle, Logo } from "@/components/ui";
import { SECTIONS } from "@/lib/questionnaire";
import type { Answers, Item } from "@/lib/types";

type Stage = "loading" | "invalid" | "welcome" | "quiz" | "submitting" | "done" | "already";

const PAGE_SIZE = 6;

interface QuizPage {
  sectionIdx: number;
  items: Item[];
}

export default function AssessmentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const { t, l, lang } = useI18n();
  const [stage, setStage] = useState<Stage>("loading");
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [pageIdx, setPageIdx] = useState(0);
  const [showError, setShowError] = useState(false);

  const pages: QuizPage[] = useMemo(() => {
    const out: QuizPage[] = [];
    SECTIONS.forEach((s, si) => {
      for (let i = 0; i < s.items.length; i += PAGE_SIZE) {
        out.push({ sectionIdx: si, items: s.items.slice(i, i + PAGE_SIZE) });
      }
    });
    return out;
  }, []);

  const answeredCount = Object.keys(answers).length;
  const totalItems = SECTIONS.reduce((n, s) => n + s.items.length, 0);

  useEffect(() => {
    fetch(`/api/assessment/${token}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { name: string; completed: boolean }) => {
        setName(d.name);
        setStage(d.completed ? "already" : "welcome");
      })
      .catch(() => setStage("invalid"));
  }, [token]);

  const page = pages[pageIdx];
  const pageComplete =
    page?.items.every((it) => {
      const a = answers[it.id];
      return it.kind === "pair" ? a === "a" || a === "b" : typeof a === "number";
    }) ?? false;

  async function next() {
    if (!pageComplete) {
      setShowError(true);
      return;
    }
    setShowError(false);
    if (pageIdx < pages.length - 1) {
      setPageIdx(pageIdx + 1);
      window.scrollTo({ top: 0 });
    } else {
      setStage("submitting");
      const res = await fetch(`/api/assessment/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, language: lang }),
      });
      setStage(res.ok ? "done" : "invalid");
    }
  }

  const shell = (content: React.ReactNode) => (
    <div className="min-h-screen bg-[#FBFBFB]">
      <header className="flex items-center justify-between border-b border-cloud bg-white px-5 py-4">
        <Logo />
        <LangToggle />
      </header>
      <main className="mx-auto max-w-2xl px-5 py-10">{content}</main>
    </div>
  );

  if (stage === "loading") return shell(<p className="text-ink/50">…</p>);

  if (stage === "invalid")
    return shell(<div className="card text-ink/70">{t("assess.invalid")}</div>);

  if (stage === "already" || stage === "done")
    return shell(
      <div className="card text-center">
        <div className="text-3xl">🏁</div>
        <h1 className="mt-3 text-2xl font-semibold text-deep">{t("assess.done.title")}</h1>
        <p className="mt-2 text-ink/60">{t("assess.done.body")}</p>
      </div>
    );

  if (stage === "welcome")
    return shell(
      <div className="card">
        <p className="text-sm font-semibold uppercase tracking-widest text-coral">Apex</p>
        <h1 className="mt-2 text-3xl font-semibold text-deep">
          {t("assess.welcome")} {name}
        </h1>
        <p className="mt-4 text-ink/70">{t("assess.intro1")}</p>
        <p className="mt-3 text-ink/70">{t("assess.intro2")}</p>
        <p className="mt-3 text-sm text-ink/50">{t("assess.privacy")}</p>
        <button className="btn-coral mt-8" onClick={() => setStage("quiz")}>
          {t("assess.start")}
        </button>
      </div>
    );

  if (stage === "submitting") return shell(<p className="text-ink/50">…</p>);

  const section = SECTIONS[page.sectionIdx];

  return shell(
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-deep/60">
          <span>{l(section.title)}</span>
          <span>
            {Math.min(answeredCount, totalItems)} / {totalItems}
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-cloud">
          <div
            className="h-1.5 rounded-full bg-coral transition-all"
            style={{ width: `${(answeredCount / totalItems) * 100}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-ink/60">{l(section.intro)}</p>
      </div>

      <div className="space-y-4">
        {page.items.map((it) =>
          it.kind === "pair" ? (
            <div key={it.id} className="card !p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {(["a", "b"] as const).map((side) => {
                  const stmt = side === "a" ? it.a : it.b;
                  const selected = answers[it.id] === side;
                  return (
                    <button
                      key={side}
                      onClick={() => setAnswers({ ...answers, [it.id]: side })}
                      className={`rounded-2xl border p-4 text-left text-sm transition-colors ${
                        selected
                          ? "border-deep bg-deep text-white"
                          : "border-cloud bg-white hover:border-deep/40"
                      }`}
                    >
                      {l(stmt.text)}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div key={it.id} className="card !p-4">
              <p className="text-sm font-medium text-ink">{l(it.text)}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="hidden w-24 text-[10px] text-ink/40 sm:block">{t("assess.likert1")}</span>
                <div className="flex flex-1 justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAnswers({ ...answers, [it.id]: v })}
                      className={`h-10 w-10 rounded-full border text-sm font-semibold transition-colors ${
                        answers[it.id] === v
                          ? "border-coral bg-coral text-white"
                          : "border-cloud bg-white text-deep hover:border-coral/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <span className="hidden w-24 text-right text-[10px] text-ink/40 sm:block">
                  {t("assess.likert5")}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {showError && !pageComplete ? (
        <p className="mt-4 text-sm font-medium text-coral">{t("assess.answerAll")}</p>
      ) : null}

      <div className="mt-6 flex items-center justify-between">
        <button
          className="btn-ghost"
          disabled={pageIdx === 0}
          style={{ visibility: pageIdx === 0 ? "hidden" : undefined }}
          onClick={() => {
            setPageIdx(Math.max(0, pageIdx - 1));
            window.scrollTo({ top: 0 });
          }}
        >
          {t("assess.back")}
        </button>
        <button className="btn-primary" onClick={next}>
          {pageIdx === pages.length - 1 ? t("assess.submit") : t("assess.next")}
        </button>
      </div>
    </div>
  );
}
