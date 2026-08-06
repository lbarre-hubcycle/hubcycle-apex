import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";
import type { KeyResult, Okr, OkrText } from "@/lib/types";

/**
 * One-click seed of the SIMPLIFIED Q3 2026 proposal (HR only, only when the
 * period is empty). Derived from the company's own material: the P1–P4
 * priority buckets, the Q3 SWOT synthesis, the 44-row OKR tracker distilled
 * to 4 objectives / 15 key results, and the board-budget / Notion targets
 * (Billing 18 M€ — 3,1 done, 11,2 backlog; Booking 30 M€; SG5 50 M€).
 * Q3/Q4 focus: BILLING, and how each department moves it. Bilingual.
 */

const kr = (
  title: OkrText,
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
      objective: {
        fr: "Livrer ce qui est vendu — le trimestre du billing",
        en: "Deliver what was sold — the billing quarter",
      },
      description: {
        fr: "SWOT : booking ≠ billing — 11,2 M€ de backlog non facturé, frictions de livraison et goulots documentaires. Chaque département contribue à transformer le carnet en factures.",
        en: "SWOT: booking ≠ billing — €11.2M unbilled backlog, delivery friction and documentation bottlenecks. Every department helps turn the book into invoices.",
      },
      keyResults: [
        kr(
          { fr: "Billing YTD ≥ 10,5 M€ (cible budget Q3)", en: "Billing YTD ≥ €10.5M (Q3 budget target)" },
          {
            team: "Sales", owner: "Samy", budgetTag: "billing", start: 3.1, target: 10.5, current: 3.1, unit: "M€",
            swot: { fr: "Billing à 3,1 M€ vs cible YTD 10,5 M€", en: "Billing at €3.1M vs €10.5M YTD target" },
          }
        ),
        kr(
          { fr: "≥ 5 M€ du backlog de 11,2 M€ convertis en factures", en: "≥ €5M of the €11.2M backlog converted to invoices" },
          {
            team: "Supply", owner: "Ludivine", budgetTag: "billing", target: 5, unit: "M€",
            swot: { fr: "Q2 powder book 100 % non facturé", en: "Q2 powder book 100% unbilled" },
          }
        ),
        kr(
          { fr: "Taux de service livraison ≥ 93 %", en: "Delivery service rate ≥ 93%" },
          {
            team: "Supply", owner: "Ludivine", target: 93, unit: "%",
            swot: { fr: "Slips de livraison, processus au cas par cas", en: "Delivery slips, case-by-case processes" },
          }
        ),
        kr(
          {
            fr: "Brazil book facturé ≥ 1,5 M€, premières livraisons on-time & in-spec",
            en: "Brazil book billed ≥ €1.5M, first deliveries on-time & in-spec",
          },
          { team: "Concentrates & Derivatives", owner: "Serge", budgetTag: "billing", target: 1.5, unit: "M€" }
        ),
        kr(
          { fr: "Cycle documentaire qualité (COA) divisé par 2", en: "Quality documentation cycle (COA) halved" },
          {
            team: "Quality", owner: "Adam", target: 50, unit: "%",
            swot: { fr: "Goulots labo/COA qui retardent la facturation", en: "Lab/COA bottlenecks delaying billing" },
          }
        ),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q3",
      objective: {
        fr: "Sécuriser le billing de 2027 : pipeline, repeat, nouvelles zones",
        en: "Secure 2027 billing: pipeline, repeat, new regions",
      },
      description: {
        fr: "SWOT : concentration clients sévère et repeat faible. Le billing de demain se construit ce trimestre — en diversifiant.",
        en: "SWOT: severe client concentration and weak repeat. Tomorrow's billing is built this quarter — by diversifying.",
      },
      keyResults: [
        kr(
          {
            fr: "Pipeline créé ≥ 9,2 M€ (100 nouvelles opportunités stage 4 profil Hero)",
            en: "Pipeline created ≥ €9.2M (100 new stage-4 opportunities, Hero profile)",
          },
          { team: "Sales", owner: "Julien", budgetTag: "booking", target: 9.2, unit: "M€" }
        ),
        kr(
          { fr: "Repeat 2025 sécurisé ≥ 8,8 M€ YTD", en: "2025 repeat secured ≥ €8.8M YTD" },
          {
            team: "Sales", owner: "Julien", budgetTag: "booking", target: 8.8, unit: "M€",
            swot: { fr: "Repeat faible, dépendance aux star sales", en: "Weak repeat, reliance on star sales" },
          }
        ),
        kr(
          { fr: "Booking USA ≥ 1,5 M$", en: "USA booking ≥ $1.5M" },
          { team: "USA", owner: "Gustavo", budgetTag: "booking", target: 1.5, unit: "M$" }
        ),
        kr(
          { fr: "SG5 ≥ 5,1 M$ fin Q3 (stock prêt à vendre sur les héros)", en: "SG5 ≥ $5.1M by end of Q3 (sellable stock on hero materials)" },
          { team: "Sourcing", owner: "Serge", budgetTag: "sourcing", target: 5.1, unit: "M$" }
        ),
        kr(
          {
            fr: "Diversification : ≤ 50 % du booking Spices sur les 2 comptes historiques",
            en: "Diversification: ≤ 50% of Spices booking on the 2 historical accounts",
          },
          {
            team: "Spices", owner: "Julien", budgetTag: "booking", target: 50, unit: "%",
            swot: { fr: "~83 % du booking C&D sur 2 comptes Brésil", en: "~83% of C&D booking on 2 Brazil accounts" },
          }
        ),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q3",
      objective: { fr: "Tenir le cash", en: "Hold the cash line" },
      description: {
        fr: "SWOT : cash et billing imprévisibles, fonctions finance mono-personne. La discipline cash conditionne tout le reste.",
        en: "SWOT: unpredictable cash and billing, single-person finance functions. Cash discipline underpins everything else.",
      },
      keyResults: [
        kr(
          { fr: "0 facture client > 30 jours de retard", en: "0 client invoices > 30 days overdue" },
          { team: "Finance", owner: "Richard", budgetTag: "cash", target: 0, start: 1, current: 1, unit: "#" }
        ),
        kr(
          { fr: "Burn YTD ≤ 2,0 M€", en: "Burn YTD ≤ €2.0M" },
          { team: "Finance", owner: "Richard", budgetTag: "cash", target: 2.0, unit: "M€" }
        ),
        kr(
          { fr: "EBITDA YTD ≥ −1,7 M€", en: "EBITDA YTD ≥ −€1.7M" },
          { team: "Finance", owner: "Richard", budgetTag: "ebitda", target: -1.7, start: -2.4, current: -2.4, unit: "M€" }
        ),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q3",
      objective: { fr: "Solidifier les fondations : data & playbooks", en: "Solidify the foundations: data & playbooks" },
      description: {
        fr: "SWOT : pas de master data, données peu fiables, savoir-faire non industrialisé. Les moats se construisent maintenant.",
        en: "SWOT: no master data, unreliable data, know-how not industrialized. The moats are built now.",
      },
      keyResults: [
        kr(
          { fr: "Spécification Master Data 100 % validée en ExCom", en: "Master Data specification 100% validated in ExCom" },
          {
            team: "Tech", owner: "Ludivine", target: 100, unit: "%",
            swot: { fr: "Pas de MDM, données produit non gouvernées", en: "No MDM, ungoverned product data" },
          }
        ),
        kr(
          { fr: "Playbook sourcing v1 adopté par l'équipe", en: "Sourcing playbook v1 adopted by the team" },
          { team: "Sourcing", owner: "Armand", target: 100, unit: "%" }
        ),
        kr(
          {
            fr: "Outil Available Quantity live et utilisé (données fournisseurs automatisées)",
            en: "Available Quantity tool live and in use (automated supplier data)",
          },
          {
            team: "Sourcing", owner: "Armand", target: 100, unit: "%",
            swot: { fr: "Confiance faible dans les données sourcing", en: "Low trust in sourcing data" },
          }
        ),
      ],
      createdAt: now,
    },
  ];
}

/** Annual 2026 — the three axes, with the headline budget/Notion targets. */
function annualSeed(): Okr[] {
  const now = new Date().toISOString();
  return [
    {
      id: newId(),
      period: "2026",
      objective: { fr: "AXE 2 — Scale : l'année du billing", en: "AXIS 2 — Scale: the billing year" },
      keyResults: [
        kr({ fr: "Billing 2026 ≥ 18 M€", en: "2026 billing ≥ €18M" },
          { team: "Sales", owner: "Samy", budgetTag: "billing", target: 18, current: 3.1, unit: "M€" }),
        kr({ fr: "Booking 2026 ≥ 30 M€", en: "2026 booking ≥ €30M" },
          { team: "Sales", owner: "Julien", budgetTag: "booking", target: 30, current: 13.5, unit: "M€" }),
        kr({ fr: "Sourcing SG5 ≥ 50 M€", en: "SG5 sourcing ≥ €50M" },
          { team: "Sourcing", owner: "Serge", budgetTag: "sourcing", target: 50, current: 38.7, unit: "M€" }),
        kr({ fr: "EBITDA 2026 ≥ −1,6 M€", en: "2026 EBITDA ≥ −€1.6M" },
          { team: "Finance", owner: "Richard", budgetTag: "ebitda", start: -2.4, target: -1.6, current: -1.9, unit: "M€" }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026",
      objective: { fr: "AXE 1 — People & Culture", en: "AXIS 1 — People & Culture" },
      keyResults: [
        kr({ fr: "100 % des collaborateurs avec revue de performance dans le cycle", en: "100% of staff with a performance review in the cycle" },
          { team: "HR", owner: "Ludivine", target: 100, current: 100, unit: "%" }),
        kr({ fr: "Plan de recrutement 2026 rempli, avec intégrations réussies", en: "2026 recruitment plan filled, with successful onboardings" },
          { team: "HR", owner: "Ludivine", target: 100, current: 75, unit: "%" }),
        kr({ fr: "Engagement mesuré (eNPS) et plan d'action à chaque semestre", en: "Engagement measured (eNPS) with an action plan every half-year" },
          { team: "HR", owner: "Ludivine", target: 100, current: 50, unit: "%" }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026",
      objective: { fr: "AXE 3 — Data & Tech", en: "AXIS 3 — Data & Tech" },
      keyResults: [
        kr({ fr: "Master data : spécification validée et MDM lancé", en: "Master data: specification validated and MDM started" },
          { team: "Tech", owner: "Ludivine", target: 100, current: 20, unit: "%" }),
        kr({ fr: "Outils internes live et équipes formées", en: "Internal tools live and teams trained" },
          { team: "Tech", target: 100, current: 40, unit: "%" }),
      ],
      createdAt: now,
    },
  ];
}

/** Q1 2026 — distilled from the 25-row sheet, with actual results and verdicts. */
function q1Seed(): Okr[] {
  const now = new Date().toISOString();
  return [
    {
      id: newId(),
      period: "2026-Q1",
      objective: { fr: "Construire la machine commerciale", en: "Build the commercial machine" },
      keyResults: [
        kr({ fr: "Repeat booké ≥ 2,7 M€", en: "Repeat booked ≥ €2.7M" },
          { team: "Sales", owner: "Julien", budgetTag: "booking", target: 2.7, current: 1.15, unit: "M€" }),
        kr({ fr: "Plan de billing tenu : ≥ 1,8 M€ facturés", en: "Billing plan held: ≥ €1.8M billed" },
          { team: "Supply", owner: "Ludivine", budgetTag: "billing", target: 1.8, current: 1.65, unit: "M€" }),
        kr({ fr: "Vanille : +3,6 M€ d'upsell sur le repeat", en: "Vanilla: +€3.6M upsell on repeat" },
          { team: "Vanilla", owner: "Samy", budgetTag: "booking", target: 3.6, current: 0, unit: "M€",
            swot: { fr: "Problème de prix sur les graines de vanille", en: "Price issue on vanilla seeds" } }),
        kr({ fr: "Vanille dérisquée : ≥ 10 t de nouvelles sources", en: "Vanilla de-risked: ≥ 10t from new sources" },
          { team: "Vanilla", owner: "Samy", target: 10, current: 15, unit: "t" }),
        kr({ fr: "NCD : 2 lancements validés (potentiel 7,5 M€)", en: "NCD: 2 launches validated (€7.5M potential)" },
          { team: "NCD", owner: "Serge", target: 2, current: 0.3, unit: "#" }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q1",
      objective: { fr: "Une qualité prête pour FSSC 22000", en: "Quality ready for FSSC 22000" },
      keyResults: [
        kr({ fr: "Audit blanc FSSC conforme (NC −30 % vs 2025)", en: "FSSC blank audit compliant (NCs −30% vs 2025)" },
          { team: "QHSE", owner: "Aurore", target: 100, current: 90, unit: "%" }),
        kr({ fr: "0 non-conformité fournisseur attribuable au sourcing", en: "0 supplier non-conformities attributable to sourcing" },
          { team: "Sourcing", owner: "Armand", target: 0, start: 1, current: 0, unit: "#" }),
        kr({ fr: "Débrief mensuel des réclamations (3/3)", en: "Monthly claim post-mortem (3/3)" },
          { team: "QHSE", owner: "Aurore", target: 3, current: 3, unit: "#" }),
        kr({ fr: "COA sur 100 % des échantillons clients", en: "COA on 100% of customer samples" },
          { team: "Quality", owner: "Aurore", target: 100, current: 0, unit: "%", outcome: "postponed",
            swot: { fr: "Repris au Q3 avec l'automatisation IA", en: "Picked up in Q3 with AI automation" } }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q1",
      objective: { fr: "Fondations people & finance", en: "People & finance foundations" },
      keyResults: [
        kr({ fr: "100 % des revues de performance dans le cycle", en: "100% of performance reviews in the cycle" },
          { team: "HR", owner: "Ludivine", target: 100, current: 100, unit: "%" }),
        kr({ fr: "16 recrutements frontline", en: "16 frontline hires" },
          { team: "HR", owner: "JB", target: 16, current: 12, unit: "#" }),
        kr({ fr: "EBITDA Q1 ≥ −1,0 M€", en: "Q1 EBITDA ≥ −€1.0M" },
          { team: "Finance", owner: "Richard", budgetTag: "ebitda", start: -2, target: -1, current: -1, unit: "M€" }),
        kr({ fr: "Roadmap M&A en place", en: "M&A roadmap in place" },
          { team: "Comex", owner: "Julien", target: 100, current: 70, unit: "%", outcome: "postponed" }),
      ],
      createdAt: now,
    },
  ];
}

/** Q2 2026 — distilled from the 45-row sheet, with actual results and verdicts. */
function q2Seed(): Okr[] {
  const now = new Date().toISOString();
  return [
    {
      id: newId(),
      period: "2026-Q2",
      objective: { fr: "Décrocher FSSC 22000 et industrialiser la qualité", en: "Win FSSC 22000 and industrialize quality" },
      keyResults: [
        kr({ fr: "Certification FSSC 22000 : plan d'action 100 % et audit passé", en: "FSSC 22000 certification: action plan 100% and audit passed" },
          { team: "QHSE", owner: "Adam", target: 100, current: 100, unit: "%" }),
        kr({ fr: "2e laboratoire partenaire contracté", en: "2nd lab partner contracted" },
          { team: "Quality", owner: "Pierre", target: 2, current: 2, unit: "#",
            swot: { fr: "Concentration Eurofins = point de défaillance unique", en: "Eurofins concentration = single point of failure" } }),
        kr({ fr: "≥ 90 % du staff formé quality culture", en: "≥ 90% of staff trained on quality culture" },
          { team: "QHSE", owner: "Adam", target: 90, current: 100, unit: "%" }),
        kr({ fr: "Audits fournisseurs planifiés réalisés (wet + dry)", en: "Planned supplier audits completed (wet + dry)" },
          { team: "QHSE", owner: "Adam", target: 100, current: 50, unit: "%" }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q2",
      objective: { fr: "Accélérer les moteurs : powder, Brésil, USA", en: "Accelerate the engines: powder, Brazil, USA" },
      keyResults: [
        kr({ fr: "15 nouvelles opportunités powder/liquide (EU, LATAM, USA)", en: "15 new powder/liquid opportunities (EU, LATAM, USA)" },
          { team: "Concentrates & Derivatives", owner: "Serge", budgetTag: "booking", target: 15, current: 60, unit: "#" }),
        kr({ fr: "Essais de tolling séchage réalisés (EU + US)", en: "Toll-drying trials done (EU + US)" },
          { team: "Concentrates & Derivatives", owner: "Serge", target: 2, current: 1.5, unit: "#" }),
        kr({ fr: "Force de vente Brésil triplée (3 recrutements)", en: "Brazil sales force tripled (3 hires)" },
          { team: "Sales", owner: "Julien", target: 3, current: 3, unit: "#" }),
        kr({ fr: "30 RDV nouveaux prospects / mois aux USA", en: "30 new-prospect meetings / month in the USA" },
          { team: "USA", owner: "Gustavo", target: 30, current: 32, unit: "#" }),
        kr({ fr: "Capacité manufacturing vanille : +100 t sécurisées", en: "Vanilla manufacturing capacity: +100t secured" },
          { team: "Vanilla", owner: "Samy", target: 100, current: 150, unit: "t" }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q2",
      objective: { fr: "Discipline cash & EBITDA", en: "Cash & EBITDA discipline" },
      keyResults: [
        kr({ fr: "EBITDA YTD ≥ −1,4 M€", en: "YTD EBITDA ≥ −€1.4M" },
          { team: "Finance", owner: "Richard", budgetTag: "ebitda", start: -2.4, target: -1.4, current: -1.9, unit: "M€" }),
        kr({ fr: "FCF YTD ≥ −1,5 M€", en: "YTD FCF ≥ −€1.5M" },
          { team: "Finance", owner: "Richard", budgetTag: "cash", start: -3, target: -1.5, current: -2.1, unit: "M€" }),
        kr({ fr: "4 recrutements via headhunting interne", en: "4 hires through internal headhunting" },
          { team: "HR", owner: "JB", target: 4, current: 4, unit: "#" }),
      ],
      createdAt: now,
    },
    {
      id: newId(),
      period: "2026-Q2",
      objective: { fr: "Data & process — freinés par les départs", en: "Data & process — slowed by departures" },
      description: {
        fr: "Plusieurs chantiers tech mis en pause (départ de Georges) — repris au Q3.",
        en: "Several tech workstreams on hold (Georges' departure) — picked up in Q3.",
      },
      keyResults: [
        kr({ fr: "Playbook sourcing retravaillé et adopté", en: "Sourcing playbook reworked and adopted" },
          { team: "Sourcing", owner: "Armand", target: 100, current: 50, unit: "%", outcome: "postponed" }),
        kr({ fr: "Process de commande 100 % automatisé", en: "Order process 100% automated" },
          { team: "Tech", target: 100, current: 40, unit: "%", outcome: "postponed" }),
        kr({ fr: "Available quantities visibles pour 100 % du SG5", en: "Available quantities visible for 100% of SG5" },
          { team: "Sourcing", owner: "Armand", target: 100, current: 50, unit: "%", outcome: "postponed" }),
        kr({ fr: "Outils IA (shortlisting fournisseurs, dashboards) live", en: "AI tools (supplier shortlisting, dashboards) live" },
          { team: "Tech", target: 100, current: 0, unit: "%", outcome: "postponed" }),
      ],
      createdAt: now,
    },
  ];
}

/**
 * Upgrade pass: an earlier seed shipped French-only strings. Any text that
 * still EXACTLY matches a seeded French string is swapped for its bilingual
 * version — edited texts don't match and stay untouched; ids, check-ins and
 * values are preserved.
 */
function upgradeLegacyTexts(okrs: Okr[], seeds: Okr[]): number {
  const map = new Map<string, OkrText>();
  const learn = (v: OkrText | undefined) => {
    if (v && typeof v === "object") map.set(v.fr, v);
  };
  for (const o of seeds) {
    learn(o.objective);
    learn(o.description);
    for (const k of o.keyResults) {
      learn(k.title);
      learn(k.swot);
    }
  }
  let upgraded = 0;
  const fix = <T extends OkrText | undefined>(v: T): T => {
    if (typeof v === "string" && map.has(v)) {
      upgraded++;
      return map.get(v) as T;
    }
    return v;
  };
  for (const o of okrs) {
    o.objective = fix(o.objective);
    o.description = fix(o.description);
    for (const k of o.keyResults) {
      k.title = fix(k.title);
      k.swot = fix(k.swot);
    }
  }
  return upgraded;
}

export async function POST() {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const db = await loadDb();
  const okrs = db.okrs ?? [];
  const seeds: Record<string, () => Okr[]> = {
    "2026": annualSeed,
    "2026-Q1": q1Seed,
    "2026-Q2": q2Seed,
    "2026-Q3": q3Seed,
  };
  const allSeeds = Object.values(seeds).flatMap((make) => make());
  const upgraded = upgradeLegacyTexts(okrs, allSeeds);
  // Seed only the periods that are still empty — never touch edited ones.
  const missing = Object.keys(seeds).filter((p) => !okrs.some((o) => o.period === p));
  if (!missing.length && !upgraded) {
    return NextResponse.json({ error: "nothing to do" }, { status: 400 });
  }
  const seeded = missing.flatMap((p) => seeds[p]());
  db.okrs = [...okrs, ...seeded];
  await saveDb(db);
  return NextResponse.json({ ok: true, periods: missing, count: seeded.length, upgraded });
}
