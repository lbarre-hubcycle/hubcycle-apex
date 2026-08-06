import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";
import type { KeyResult, Okr } from "@/lib/types";

/**
 * One-click seed of the SIMPLIFIED Q3 2026 proposal (HR only, only when the
 * period is empty). Derived from the company's own material: the P1–P4
 * priority buckets, the Q3 SWOT synthesis, the 44-row OKR tracker distilled
 * to 4 objectives / 15 key results, and the board-budget / Notion targets
 * (Billing 18 M€ — 3,1 done, 11,2 backlog; Booking 30 M€; SG5 50 M€).
 * Q3/Q4 focus: BILLING, and how each department moves it.
 */

const kr = (
  title: string,
  opts: Partial<Omit<KeyResult, "id" | "title" | "checkIns">> = {}
): KeyResult => ({
  id: newId(),
  title,
  start: 0,
  target: 100,
  current: 0,
  ...opts,
  checkIns: [],
});

function q3Seed(): Okr[] {
  const now = new Date().toISOString();
  return [
    {
      id: newId(),
      period: "2026-Q3",
      objective: "Livrer ce qui est vendu — le trimestre du billing",
      description:
        "SWOT : booking ≠ billing — 11,2 M€ de backlog non facturé, frictions de livraison et goulots documentaires. Chaque département contribue à transformer le carnet en factures.",
      keyResults: [
        kr("Billing YTD ≥ 10,5 M€ (cible budget Q3)", {
          team: "Sales", owner: "Samy", budgetTag: "billing", start: 3.1, target: 10.5, current: 3.1, unit: "M€",
          swot: "Billing à 3,1 M€ vs cible YTD 10,5 M€",
        }),
        kr("≥ 5 M€ du backlog de 11,2 M€ convertis en factures", {
          team: "Supply", owner: "Ludivine", budgetTag: "billing", target: 5, unit: "M€",
          swot: "Q2 powder book 100 % non facturé",
        }),
        kr("Taux de service livraison ≥ 93 %", {
          team: "Supply", owner: "Ludivine", target: 93, unit: "%",
          swot: "Slips de livraison, processus au cas par cas",
        }),
        kr("Brazil book facturé ≥ 1,5 M€, premières livraisons on-time & in-spec", {
          team: "Concentrates & Derivatives", owner: "Serge", budgetTag: "billing", target: 1.5, unit: "M€",
        }),
        kr("Cycle documentaire qualité (COA) divisé par 2", {
          team: "Quality", owner: "Adam", target: 50, unit: "%",
          swot: "Goulots labo/COA qui retardent la facturation",
        }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q3",
      objective: "Sécuriser le billing de 2027 : pipeline, repeat, nouvelles zones",
      description:
        "SWOT : concentration clients sévère et repeat faible. Le billing de demain se construit ce trimestre — en diversifiant.",
      keyResults: [
        kr("Pipeline créé ≥ 9,2 M€ (100 nouvelles opportunités stage 4 profil Hero)", {
          team: "Sales", owner: "Julien", budgetTag: "booking", target: 9.2, unit: "M€",
        }),
        kr("Repeat 2025 sécurisé ≥ 8,8 M€ YTD", {
          team: "Sales", owner: "Julien", budgetTag: "booking", target: 8.8, unit: "M€",
          swot: "Repeat faible, dépendance aux star sales",
        }),
        kr("Booking USA ≥ 1,5 M$", {
          team: "USA", owner: "Gustavo", budgetTag: "booking", target: 1.5, unit: "M$",
        }),
        kr("SG5 ≥ 5,1 M$ fin Q3 (stock prêt à vendre sur les héros)", {
          team: "Sourcing", owner: "Serge", budgetTag: "sourcing", target: 5.1, unit: "M$",
        }),
        kr("Diversification : ≤ 50 % du booking Spices sur les 2 comptes historiques", {
          team: "Spices", owner: "Julien", budgetTag: "booking", target: 50, unit: "%",
          swot: "~83 % du booking C&D sur 2 comptes Brésil",
        }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q3",
      objective: "Tenir le cash",
      description:
        "SWOT : cash et billing imprévisibles, fonctions finance mono-personne. La discipline cash conditionne tout le reste.",
      keyResults: [
        kr("0 facture client > 30 jours de retard", {
          team: "Finance", owner: "Richard", budgetTag: "cash", target: 0, start: 1, current: 1, unit: "#",
        }),
        kr("Burn YTD ≤ 2,0 M€", {
          team: "Finance", owner: "Richard", budgetTag: "cash", target: 2.0, unit: "M€",
        }),
        kr("EBITDA YTD ≥ −1,7 M€", {
          team: "Finance", owner: "Richard", budgetTag: "ebitda", target: -1.7, start: -2.4, current: -2.4, unit: "M€",
        }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q3",
      objective: "Solidifier les fondations : data & playbooks",
      description:
        "SWOT : pas de master data, données peu fiables, savoir-faire non industrialisé. Les moats se construisent maintenant.",
      keyResults: [
        kr("Spécification Master Data 100 % validée en ExCom", {
          team: "Tech", owner: "Ludivine", target: 100, unit: "%",
          swot: "Pas de MDM, données produit non gouvernées",
        }),
        kr("Playbook sourcing v1 adopté par l'équipe", {
          team: "Sourcing", owner: "Armand", target: 100, unit: "%",
        }),
        kr("Outil Available Quantity live et utilisé (données fournisseurs automatisées)", {
          team: "Sourcing", owner: "Armand", target: 100, unit: "%",
          swot: "Confiance faible dans les données sourcing",
        }),
      ],
      createdAt: now,
    },
  ];
}

export async function POST() {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await loadDb();
  const okrs = db.okrs ?? [];
  if (okrs.some((o) => o.period === "2026-Q3")) {
    return NextResponse.json({ error: "period not empty" }, { status: 400 });
  }
  const seeded = q3Seed();
  db.okrs = [...okrs, ...seeded];
  await saveDb(db);
  return NextResponse.json({ ok: true, count: seeded.length });
}
