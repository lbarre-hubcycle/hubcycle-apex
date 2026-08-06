import type { L10n } from "@/lib/types";

/**
 * The validated Hubcycle competency framework (Notion: "🎯 Apex — Référentiel",
 * validated August 2026). 18 competencies in 3 families, with behavioural
 * anchors per level, plus each role's key KPI, secondary KPIs and applicable
 * competencies. This is the product's single source for candidate debriefs,
 * instant feedback tagging and performance reviews.
 */

export type CompetencyFamily = "core" | "functional" | "leadership";
export type Level = "junior" | "mid" | "senior";

export interface FrameworkCompetency {
  code: string; // A1..A6, B1..B8, C1..C4
  family: CompetencyFamily;
  name: L10n;
  oneLiner: L10n;
  measuredBy: L10n;
  levels: { junior: L10n; mid: L10n; senior: L10n };
}

export const FAMILY_LABELS: Record<CompetencyFamily, L10n> = {
  core: { en: "Core — every role", fr: "Socle — tous les postes" },
  functional: { en: "Functional — by role family", fr: "Métier — par famille de postes" },
  leadership: { en: "Leadership — by role and level", fr: "Leadership — selon poste et niveau" },
};

export const FRAMEWORK: FrameworkCompetency[] = [
  {
    code: "A1",
    family: "core",
    name: { en: "Execution & Ownership", fr: "Exécution et responsabilité" },
    oneLiner: {
      en: "Commits, drives and finishes: owns the outcome end-to-end, at Hubcycle pace.",
      fr: "S’engage, avance et termine : porte le résultat de bout en bout, au rythme Hubcycle.",
    },
    measuredBy: {
      en: "Delivery vs commitments (OKR check-ins), deadlines held, tagged feedback, manager review.",
      fr: "Tenue des engagements (check-ins OKR), livraisons vs deadlines, feedback taggé, revue manager.",
    },
    levels: {
      junior: {
        en: "Reliably delivers scoped tasks; flags blockers early.",
        fr: "Livre de manière fiable les tâches cadrées ; signale les blocages tôt.",
      },
      mid: {
        en: "Owns a full scope unprompted; anticipates obstacles.",
        fr: "Porte un périmètre complet sans relance ; anticipe les obstacles.",
      },
      senior: {
        en: "Lands critical, ambiguous topics; unblocks others.",
        fr: "Fait aboutir les sujets critiques et ambigus ; débloque les autres.",
      },
    },
  },
  {
    code: "A2",
    family: "core",
    name: { en: "Pragmatic Judgment", fr: "Discernement pragmatique" },
    oneLiner: {
      en: "Decides well despite ambiguity: 70% information, calculated risk, simplest effective path.",
      fr: "Décide juste malgré l’ambiguïté : 70 % d’information, risque calculé, chemin le plus simple et efficace.",
    },
    measuredBy: {
      en: "Quality of decisions reviewed after the fact, relevant escalations, tagged feedback.",
      fr: "Qualité des décisions revues a posteriori, escalades pertinentes, feedback taggé.",
    },
    levels: {
      junior: {
        en: "Picks well on framed cases; knows when to ask.",
        fr: "Choisit la bonne option sur des cas cadrés ; sait quand demander.",
      },
      mid: {
        en: "Decides alone on own scope with explicit logic.",
        fr: "Tranche seul·e sur son périmètre avec une logique explicite.",
      },
      senior: {
        en: "Decides fast on high-stakes fuzzy topics; their calls set the reference.",
        fr: "Tranche vite sur des sujets flous à fort enjeu ; ses arbitrages font référence.",
      },
    },
  },
  {
    code: "A3",
    family: "core",
    name: { en: "Clear Communication", fr: "Communication claire" },
    oneLiner: {
      en: "Simple and brief on complex topics; shares unprompted; listens before defending.",
      fr: "Simple et bref sur le complexe ; partage sans qu’on demande ; écoute avant de défendre.",
    },
    measuredBy: {
      en: "Quality of written notes/CRM/specs, useful meetings, peer feedback.",
      fr: "Qualité des écrits (notes, CRM, specs), réunions utiles, feedback des pairs.",
    },
    levels: {
      junior: {
        en: "Clear, up-to-date notes and reports.",
        fr: "Écrits et comptes rendus clairs et à jour.",
      },
      mid: {
        en: "Tailors message to audience; regular constructive feedback.",
        fr: "Adapte le message à l’audience ; feedback constructif régulier.",
      },
      senior: {
        en: "Makes the complex simple company-wide; defuses cross-team misunderstandings.",
        fr: "Rend simple ce qui est complexe pour toute l’entreprise ; désamorce les malentendus transverses.",
      },
    },
  },
  {
    code: "A4",
    family: "core",
    name: { en: "Collaboration & Team Play", fr: "Collaboration et esprit d’équipe" },
    oneLiner: {
      en: "Wins as a team: the best idea wins, help flows across teams, collective success first.",
      fr: "Gagne en équipe : la meilleure idée gagne, l’entraide circule, succès collectif d’abord.",
    },
    measuredBy: {
      en: "Partner-team satisfaction, peer feedback, meeting behaviour.",
      fr: "Satisfaction des équipes partenaires, feedback pairs, comportement en réunion.",
    },
    levels: {
      junior: {
        en: "Helps when asked; shares information.",
        fr: "Aide quand on sollicite ; partage l’information.",
      },
      mid: {
        en: "Builds relationships beyond own team; clears frictions early.",
        fr: "Construit des relations hors de son équipe ; lève les frictions tôt.",
      },
      senior: {
        en: "Creates cross-team cooperation; resolves tensions without authority.",
        fr: "Crée les conditions de coopération entre équipes ; arbitre les tensions sans hiérarchie.",
      },
    },
  },
  {
    code: "A5",
    family: "core",
    name: { en: "Adaptability & Learning", fr: "Adaptabilité et apprentissage" },
    oneLiner: {
      en: "Pivots without regret; failure is information; seeks feedback even when it stings.",
      fr: "Pivote sans regret ; l’échec est une information ; cherche le feedback même quand il pique.",
    },
    measuredBy: {
      en: "Observed reaction to pivots, skill growth, tagged feedback.",
      fr: "Réaction observée aux pivots, montée en compétence, feedback taggé.",
    },
    levels: {
      junior: {
        en: "Accepts pivots; learns fast from mistakes.",
        fr: "Accepte les changements de cap ; apprend vite de ses erreurs.",
      },
      mid: {
        en: "Reprioritizes alone; proposes the pivot when facts demand it.",
        fr: "Reprioritise seul·e ; propose le pivot quand les faits l’exigent.",
      },
      senior: {
        en: "Leads change for others; institutionalizes lessons.",
        fr: "Pilote le changement pour les autres ; institutionnalise les leçons.",
      },
    },
  },
  {
    code: "A6",
    family: "core",
    name: { en: "Rigor & Reliability", fr: "Rigueur et fiabilité" },
    oneLiner: {
      en: "Right first time: quality standards held, data and systems accurate.",
      fr: "Bien du premier coup : standards tenus, données et systèmes exacts.",
    },
    measuredBy: {
      en: "CRM/ERP accuracy (%), error/rework rate, internal audits.",
      fr: "Exactitude CRM/ERP (%), taux d’erreur/reprise, audits internes.",
    },
    levels: {
      junior: {
        en: "Accurate data and deliverables on own desk.",
        fr: "Données et livrables exacts sur son poste.",
      },
      mid: {
        en: "No rework on own scope; hardens own processes.",
        fr: "Zéro reprise sur son périmètre ; fiabilise ses process.",
      },
      senior: {
        en: "Sets the team's quality bar; enforces it with judgment.",
        fr: "Définit le standard de qualité de l’équipe ; le fait respecter avec discernement.",
      },
    },
  },
  {
    code: "B1",
    family: "functional",
    name: { en: "New-Business Drive (hunting)", fr: "Conquête commerciale (chasse)" },
    oneLiner: {
      en: "Opens doors: prospecting, qualification, negotiation, closing of new clients or deposits.",
      fr: "Ouvre des portes : prospection, qualification, négociation, closing de nouveaux clients ou gisements.",
    },
    measuredBy: {
      en: "New accounts / supply chains activated, close rate, sourced pipeline, outbound cadence.",
      fr: "Nouveaux comptes / filières activées, taux de closing, pipeline sourcé, cadence outbound.",
    },
    levels: {
      junior: {
        en: "Holds prospecting cadence; qualifies cleanly.",
        fr: "Tient la cadence de prospection ; qualifie proprement.",
      },
      mid: {
        en: "Converts discovery to deal; negotiates within mandate.",
        fr: "Convertit : discovery → deal ; négocie dans son mandat.",
      },
      senior: {
        en: "Opens strategic markets; lands structural deals.",
        fr: "Ouvre des marchés stratégiques ; deals structurants.",
      },
    },
  },
  {
    code: "B2",
    family: "functional",
    name: { en: "Account Development (farming)", fr: "Développement de comptes (culture)" },
    oneLiner: {
      en: "Grows what exists: satisfaction, renewal, upsell, long-term trusted relationships.",
      fr: "Fait grandir l’existant : satisfaction, renouvellement, upsell, relations de confiance long terme.",
    },
    measuredBy: {
      en: "Renewal/retention ≥ 80-90%, satisfaction ≥ 8/10, growth per account.",
      fr: "Renouvellement/rétention ≥ 80-90 %, satisfaction ≥ 8/10, croissance par compte.",
    },
    levels: {
      junior: {
        en: "Follows accounts reliably; responds fast and well.",
        fr: "Suit ses comptes avec fiabilité ; répond vite et bien.",
      },
      mid: {
        en: "Grows accounts; anticipates churn risks.",
        fr: "Développe ses comptes ; anticipe les risques de churn.",
      },
      senior: {
        en: "Trusted advisor to key accounts; turns relationships into competitive advantage.",
        fr: "Conseiller·ère de confiance des comptes clés ; transforme la relation en avantage compétitif.",
      },
    },
  },
  {
    code: "B3",
    family: "functional",
    name: { en: "Pipeline & CRM Discipline", fr: "Discipline pipeline et CRM" },
    oneLiner: {
      en: "Runs the machine: coverage ≥ 3×, weekly CRM cadence, reliable forecast.",
      fr: "Fait tourner la machine : couverture ≥ 3×, cadence CRM hebdo, forecast fiable.",
    },
    measuredBy: {
      en: "CRM completeness ≥ 95%, pipeline coverage, forecast vs actual gap.",
      fr: "Complétude CRM ≥ 95 %, couverture pipeline, écart forecast vs réel.",
    },
    levels: {
      junior: { en: "CRM current every week.", fr: "CRM à jour chaque semaine." },
      mid: {
        en: "Pipeline steered: coverage and conversion tracked and corrected.",
        fr: "Pipeline piloté : couverture et conversion suivies et corrigées.",
      },
      senior: {
        en: "Reliable team-level forecast; method adopted by others.",
        fr: "Forecast fiable au niveau équipe ; méthode adoptée par les autres.",
      },
    },
  },
  {
    code: "B4",
    family: "functional",
    name: { en: "Supplier & Partner Management", fr: "Gestion fournisseurs et partenaires" },
    oneLiner: {
      en: "Builds and secures the external network: qualification, contracting, reliability, development.",
      fr: "Bâtit et fiabilise le réseau externe : qualification, contractualisation, fiabilité, développement.",
    },
    measuredBy: {
      en: "Supplier reliability (%), retention ≥ 90%, lead times held, qualified partners.",
      fr: "Fiabilité fournisseurs (%), rétention ≥ 90 %, délais tenus, partenaires qualifiés.",
    },
    levels: {
      junior: {
        en: "Handles operations with existing partners.",
        fr: "Gère les échanges opérationnels avec les partenaires existants.",
      },
      mid: {
        en: "Qualifies and contracts alone; handles supplier crises.",
        fr: "Qualifie et contractualise seul·e ; gère les crises fournisseur.",
      },
      senior: {
        en: "Builds a strategic multi-country network; defensible partnerships.",
        fr: "Bâtit un réseau stratégique multi-pays ; partenariats différenciants.",
      },
    },
  },
  {
    code: "B5",
    family: "functional",
    name: { en: "Operational Excellence", fr: "Excellence opérationnelle" },
    oneLiner: {
      en: "Predictable flows that scale: planning, S&OP, on-time delivery, cost control.",
      fr: "Des flux prévisibles qui scalent : planification, S&OP, livraison à l’heure, maîtrise des coûts.",
    },
    measuredBy: {
      en: "OTD ≥ 95%, logistics cost per shipment, service rate, documented processes.",
      fr: "OTD ≥ 95 %, coût logistique par expédition, taux de service, process documentés.",
    },
    levels: {
      junior: {
        en: "Runs processes reliably; reports anomalies.",
        fr: "Exécute les process avec fiabilité ; remonte les anomalies.",
      },
      mid: {
        en: "Optimizes own flows; resolves incidents within 24-48h.",
        fr: "Optimise ses flux ; résout les incidents en 24-48 h.",
      },
      senior: {
        en: "Designs systems that scale (routes, S&OP, digitalization).",
        fr: "Conçoit des systèmes qui scalent (routes, S&OP, digitalisation).",
      },
    },
  },
  {
    code: "B6",
    family: "functional",
    name: { en: "Analytical & Financial Acumen", fr: "Acuité analytique et financière" },
    oneLiner: {
      en: "Turns data into decisions: modeling, unit economics, cash and margin logic.",
      fr: "Transforme les données en décisions : modélisation, unit economics, logique cash et marge.",
    },
    measuredBy: {
      en: "Reliability of analyses and forecasts, dashboard quality, informed decisions.",
      fr: "Fiabilité des analyses et forecasts, qualité des dashboards, décisions éclairées.",
    },
    levels: {
      junior: {
        en: "Produces sound analyses on framed questions.",
        fr: "Produit des analyses justes sur des questions cadrées.",
      },
      mid: {
        en: "Builds models and KPIs for own scope; recommends.",
        fr: "Construit les modèles et KPI de son périmètre ; recommande.",
      },
      senior: {
        en: "Makes numbers speak at strategic level (board, BP, pricing).",
        fr: "Fait parler les chiffres au niveau stratégique (board, BP, pricing).",
      },
    },
  },
  {
    code: "B7",
    family: "functional",
    name: { en: "Technical & Regulatory Mastery", fr: "Maîtrise technique et réglementaire" },
    oneLiner: {
      en: "Compliance as a commercial weapon: specs, HACCP/FSSC, EU/US/CODEX, certifications.",
      fr: "La conformité comme arme commerciale : specs, HACCP/FSSC, UE/US/CODEX, certifications.",
    },
    measuredBy: {
      en: "Spec accuracy, audit scores, zero critical NC, time-to-compliance.",
      fr: "Exactitude des specs, scores d’audit, zéro NC critique, délais de mise en conformité.",
    },
    levels: {
      junior: {
        en: "Applies protocols and standards without deviation.",
        fr: "Applique protocoles et normes sans écart.",
      },
      mid: {
        en: "Validates specs and compliance alone; solves client technical queries.",
        fr: "Valide specs et conformité seul·e ; résout les questions techniques clients.",
      },
      senior: {
        en: "Anticipates regulatory shifts and turns them into business opportunities.",
        fr: "Anticipe les évolutions réglementaires et en fait des opportunités business.",
      },
    },
  },
  {
    code: "B8",
    family: "functional",
    name: { en: "Innovation & Product Development", fr: "Innovation et développement produit" },
    oneLiner: {
      en: "From by-product to market: valorisation processes, experimentation, time-to-market.",
      fr: "Du coproduit au marché : procédés de valorisation, expérimentation, time-to-market.",
    },
    measuredBy: {
      en: "Products launched, time-to-market, confirmed feasibility rate, revenue per product.",
      fr: "Produits lancés, time-to-market, taux de faisabilité confirmée, revenu par produit.",
    },
    levels: {
      junior: {
        en: "Runs rigorous trials; documents results.",
        fr: "Mène des essais rigoureux ; documente les résultats.",
      },
      mid: {
        en: "Carries a product from raw-material assessment to launch.",
        fr: "Porte un produit de l’évaluation matière au lancement.",
      },
      senior: {
        en: "Creates categories: processes, portfolio, R&D methodology.",
        fr: "Crée des catégories : procédés, portefeuille, méthodologie R&D.",
      },
    },
  },
  {
    code: "C1",
    family: "leadership",
    name: { en: "People Leadership & Coaching", fr: "Leadership d’équipe et coaching" },
    oneLiner: {
      en: "High expectations + high support: recruits, grows and retains a performing team.",
      fr: "Exigence élevée + soutien élevé : recrute, développe et fidélise une équipe performante.",
    },
    measuredBy: {
      en: "Team performance and retention, 360° feedback, 1-2-1 quality.",
      fr: "Performance et rétention de l’équipe, feedback 360°, qualité des 1-2-1.",
    },
    levels: {
      junior: {
        en: "(activated with first management role)",
        fr: "(activée avec le premier management)",
      },
      mid: {
        en: "Manages 1-4 people: clear expectations, regular feedback, 1-2-1s held.",
        fr: "Manage 1-4 personnes : attentes claires, feedback régulier, 1-2-1 tenus.",
      },
      senior: {
        en: "Builds and grows an organization; develops other managers.",
        fr: "Bâtit et fait grandir une organisation ; développe d’autres managers.",
      },
    },
  },
  {
    code: "C2",
    family: "leadership",
    name: { en: "Strategic Planning & Prioritization", fr: "Planification stratégique et priorisation" },
    oneLiner: {
      en: "Charts the route: business plans, OKRs, scenarios, ruthless prioritization.",
      fr: "Trace la route : business plans, OKRs, scénarios, priorisation sans complaisance.",
    },
    measuredBy: {
      en: "Plan/OKR achievement, priority relevance in hindsight, strategy iteration.",
      fr: "Atteinte du plan/OKR, pertinence des priorités a posteriori, itération de la stratégie.",
    },
    levels: {
      junior: { en: "Plans own work reliably.", fr: "Planifie son propre travail avec fiabilité." },
      mid: {
        en: "Builds own scope's plan; arbitrates urgent vs important.",
        fr: "Construit le plan de son périmètre ; arbitre urgences vs important.",
      },
      senior: {
        en: "Sets multi-team strategy and lands it into aligned OKRs.",
        fr: "Définit la stratégie multi-équipes et la fait atterrir en OKRs alignés.",
      },
    },
  },
  {
    code: "C3",
    family: "leadership",
    name: { en: "Stakeholder Influence", fr: "Influence des parties prenantes" },
    oneLiner: {
      en: "Moves people without authority: cross-team alignment, board/investors, external voice.",
      fr: "Embarque sans autorité hiérarchique : alignement transverse, board/investisseurs, voix externe.",
    },
    measuredBy: {
      en: "Stakeholder satisfaction, decisions obtained, board reporting quality.",
      fr: "Satisfaction des parties prenantes, décisions obtenues, qualité du reporting board.",
    },
    levels: {
      junior: {
        en: "Presents own topic clearly to internal stakeholders.",
        fr: "Présente clairement son sujet aux parties prenantes internes.",
      },
      mid: {
        en: "Aligns several teams without authority.",
        fr: "Aligne plusieurs équipes sans lien hiérarchique.",
      },
      senior: {
        en: "Influences board, investors, strategic partners.",
        fr: "Influence board, investisseurs et partenaires stratégiques.",
      },
    },
  },
  {
    code: "C4",
    family: "leadership",
    name: { en: "Culture & Standard Setting", fr: "Porter la culture et les standards" },
    oneLiner: {
      en: "Embodies the Manifesto under pressure; names deviations; protects long-term trust.",
      fr: "Incarne le Manifeste sous pression ; nomme les écarts ; protège la confiance long terme.",
    },
    measuredBy: {
      en: "360° culture feedback, exemplarity in hard moments, integrity decisions.",
      fr: "Feedback 360° culture, exemplarité dans les moments difficiles, décisions d’intégrité.",
    },
    levels: {
      junior: { en: "Lives the values daily.", fr: "Vit les valeurs au quotidien." },
      mid: {
        en: "Defends them when uncomfortable; models them for the team.",
        fr: "Les défend quand c’est inconfortable ; donne l’exemple à son équipe.",
      },
      senior: {
        en: "Shapes company-level culture; arbitrates through values.",
        fr: "Façonne la culture à l’échelle de l’entreprise ; arbitre par les valeurs.",
      },
    },
  },
];

export const FRAMEWORK_MAP: Record<string, FrameworkCompetency> = Object.fromEntries(
  FRAMEWORK.map((c) => [c.code, c])
);

/** Per-role expectations: expected level, key KPI, secondary KPIs, competencies. */
export interface RoleExpectations {
  roleId: string; // matches src/data/roles.ts ids
  level: Level;
  keyKpi: L10n;
  secondaryKpis: L10n[]; // usually 2, per the referential — some roles have fewer
  /** Codes of applicable functional (B) and leadership (C) competencies. A1-A6 apply to everyone. */
  competencies: string[];
}

export const ROLE_EXPECTATIONS: RoleExpectations[] = [
  {
    roleId: "sales-manager",
    level: "mid",
    keyKpi: { en: "Booking (signed GMV at margin ≥ 34%)", fr: "Booking (GMV signé à marge ≥ 34 %)" },
    secondaryKpis: [
      { en: "Close rate ≥ 25%", fr: "Taux de closing ≥ 25 %" },
      { en: "Renewal rate ≥ 80%", fr: "Taux de renouvellement ≥ 80 %" },
    ],
    competencies: ["B1", "B2", "B3", "B4"],
  },
  {
    roleId: "bdr",
    level: "junior",
    keyKpi: { en: "Qualified meetings / month (≥ 15)", fr: "RDV qualifiés / mois (≥ 15)" },
    secondaryKpis: [
      { en: "Sourced pipeline (€)", fr: "Pipeline sourcé (€)" },
      { en: "SQL→opportunity conversion ≥ 30%", fr: "Conversion SQL→opp ≥ 30 %" },
    ],
    competencies: ["B1", "B3"],
  },
  {
    roleId: "sourcing-manager",
    level: "mid",
    keyKpi: { en: "SG5 / supply chains activated", fr: "SG5 / filières activées" },
    secondaryKpis: [
      { en: "First-pass spec validation ≥ 80%", fr: "Validation specs 1er passage ≥ 80 %" },
      { en: "Supplier retention ≥ 90%", fr: "Rétention fournisseurs ≥ 90 %" },
    ],
    competencies: ["B1", "B2", "B3", "B4", "B7"],
  },
  {
    roleId: "category-manager",
    level: "senior",
    keyKpi: { en: "Category P&L (profit contribution)", fr: "P&L catégorie (Profit Contribution)" },
    secondaryKpis: [
      { en: "Pipeline & closing", fr: "Pipeline et closing" },
      { en: "New markets / products", fr: "Nouveaux marchés / produits" },
    ],
    competencies: ["B1", "B2", "B3", "B4", "B6", "B8", "C1", "C2"],
  },
  {
    roleId: "category-manager-spices-herbs",
    level: "senior",
    keyKpi: { en: "Category P&L (profit contribution)", fr: "P&L catégorie (Profit Contribution)" },
    secondaryKpis: [
      { en: "Pipeline & closing", fr: "Pipeline et closing" },
      { en: "New markets / products", fr: "Nouveaux marchés / produits" },
    ],
    competencies: ["B1", "B2", "B3", "B4", "B6", "B8", "C1", "C2"],
  },
  {
    roleId: "category-manager-vanilla",
    level: "senior",
    keyKpi: { en: "Category P&L (profit contribution)", fr: "P&L catégorie (Profit Contribution)" },
    secondaryKpis: [
      { en: "Pipeline & closing", fr: "Pipeline et closing" },
      { en: "New markets / products", fr: "Nouveaux marchés / produits" },
    ],
    competencies: ["B1", "B2", "B3", "B4", "B6", "B8", "C1", "C2"],
  },
  {
    roleId: "category-manager-concentrates-derivatives",
    level: "senior",
    keyKpi: { en: "Category P&L (profit contribution)", fr: "P&L catégorie (Profit Contribution)" },
    secondaryKpis: [
      { en: "Pipeline & closing", fr: "Pipeline et closing" },
      { en: "New markets / products", fr: "Nouveaux marchés / produits" },
    ],
    competencies: ["B1", "B2", "B3", "B4", "B6", "B8", "C1", "C2"],
  },
  {
    roleId: "supply-chain-director",
    level: "senior",
    keyKpi: { en: "Service rate (booking-to-billing)", fr: "Service Rate (booking-to-billing)" },
    secondaryKpis: [
      { en: "Logistics cost per shipment", fr: "Coût logistique / expédition" },
      { en: "On-time delivery ≥ 95%", fr: "OTD ≥ 95 %" },
    ],
    competencies: ["B5", "B4", "B6", "C1", "C2"],
  },
  {
    roleId: "international-logistics-manager",
    level: "mid",
    keyKpi: { en: "On-time delivery ≥ 95%", fr: "OTD ≥ 95 %" },
    secondaryKpis: [
      { en: "Customs clearance ≥ 98%", fr: "Dédouanement ≥ 98 %" },
      { en: "Cost per shipment −10%", fr: "Coût / expédition −10 %" },
    ],
    competencies: ["B5", "B4"],
  },
  {
    roleId: "lead-project-scheduling",
    level: "mid",
    keyKpi: { en: "On-time order execution rate", fr: "Taux d’exécution des commandes à l’heure" },
    secondaryKpis: [
      { en: "ERP data quality ≥ 95%", fr: "Qualité données ERP ≥ 95 %" },
      { en: "Order-to-cash cycle time", fr: "Cycle order-to-cash" },
    ],
    competencies: ["B5", "B3"],
  },
  {
    roleId: "sample-lab-technician",
    level: "junior",
    keyKpi: { en: "Sample dispatch ≤ 48h", fr: "Expédition échantillons ≤ 48 h" },
    secondaryKpis: [
      { en: "Stock accuracy ≥ 98%", fr: "Exactitude stock ≥ 98 %" },
      { en: "Non-conformity ≤ 2%", fr: "Non-conformité ≤ 2 %" },
    ],
    competencies: ["B5", "B7"],
  },
  {
    roleId: "quality-manager",
    level: "mid",
    keyKpi: { en: "Audit scores / FSSC 22000 maintained", fr: "Scores d’audit / FSSC 22000 maintenu" },
    secondaryKpis: [
      { en: "Non-conformity rate", fr: "Taux de NC" },
      { en: "Complaint resolution", fr: "Résolution réclamations" },
    ],
    competencies: ["B7", "B5", "B2", "C1"],
  },
  {
    roleId: "quality-assurance-director",
    level: "senior",
    keyKpi: {
      en: "Certifications with zero critical NC (FSSC, Bio, Halal, Kosher)",
      fr: "Certifications sans NC critique (FSSC, Bio, Halal, Casher)",
    },
    secondaryKpis: [
      { en: "Quality-driven deal wins", fr: "Deals gagnés grâce à la qualité" },
      { en: "Time-to-compliance for launches", fr: "Time-to-compliance des lancements" },
    ],
    competencies: ["B7", "B2", "B5", "C1", "C4"],
  },
  {
    roleId: "toll-manufacturing-manager",
    level: "mid",
    keyKpi: { en: "Production compliance & partner OTD", fr: "Conformité production et OTD partenaires" },
    secondaryKpis: [
      { en: "Partner reliability", fr: "Fiabilité partenaires" },
      { en: "Transformation cost", fr: "Coût de transformation" },
    ],
    competencies: ["B4", "B5", "B7"],
  },
  {
    roleId: "project-manager-rd",
    level: "mid",
    keyKpi: { en: "Products launched / time-to-market", fr: "Produits lancés / time-to-market" },
    secondaryKpis: [
      { en: "Revenue per product", fr: "Revenu par produit" },
      { en: "Spec accuracy", fr: "Exactitude specs" },
    ],
    competencies: ["B8", "B7", "B4"],
  },
  {
    roleId: "product-manager",
    level: "mid",
    keyKpi: { en: "Products launched / time-to-market", fr: "Produits lancés / time-to-market" },
    secondaryKpis: [
      { en: "Revenue per product", fr: "Revenu par produit" },
      { en: "Sales Playbook quality", fr: "Qualité Sales Playbook" },
    ],
    competencies: ["B8", "B7", "B1"],
  },
  {
    roleId: "pm-coordinator",
    level: "mid",
    keyKpi: { en: "Validated valorisation processes", fr: "Procédés de valorisation validés" },
    secondaryKpis: [
      { en: "PM methodology consistency", fr: "Cohérence méthodo PM" },
      { en: "Scale-up reliability", fr: "Fiabilité scale-up" },
    ],
    competencies: ["B8", "B7", "C3"],
  },
  // cfoo: the Notion referential row (CFO0) is currently blank — its KPI moved
  // to financial-manager. Re-add expectations here once Notion defines them.
  {
    roleId: "financial-manager",
    level: "mid",
    keyKpi: { en: "Cash forecast reliability / runway", fr: "Fiabilité du forecast cash / runway" },
    secondaryKpis: [
      { en: "DSO / collections", fr: "DSO / encaissements" },
      { en: "Monthly close lead time", fr: "Délais de clôture mensuelles" },
    ],
    competencies: ["B6", "B5"],
  },
  {
    roleId: "chief-of-staff",
    level: "mid",
    keyKpi: { en: "OKR achievement (cycle completion)", fr: "OKR achievement (complétion des cycles)" },
    secondaryKpis: [
      { en: "Strategic milestone delivery", fr: "Livraison des jalons stratégiques" },
      { en: "Stakeholder satisfaction", fr: "Satisfaction parties prenantes" },
    ],
    competencies: ["B6", "B5", "C2", "C3"],
  },
  {
    roleId: "head-of-strategic-execution",
    level: "senior",
    keyKpi: {
      en: "Core KPI budget achievement (SG5, Booking, Billing)",
      fr: "Atteinte budget KPI cœur (SG5, Booking, Billing)",
    },
    secondaryKpis: [
      { en: "Framework adoption", fr: "Adoption des frameworks" },
      { en: "Blocker resolution", fr: "Résolution des blocages" },
    ],
    competencies: ["B5", "B6", "C2", "C3"],
  },
  {
    roleId: "executive-assistant",
    level: "mid",
    keyKpi: { en: "CEO hours freed / week (10-15h)", fr: "Heures CEO libérées / semaine (10-15 h)" },
    secondaryKpis: [
      { en: "Anticipation rate (proactive vs reactive)", fr: "Taux d’anticipation (proactif vs réactif)" },
      { en: "Zero logistics errors", fr: "Zéro erreur logistique" },
    ],
    competencies: ["B5", "C3"],
  },
  {
    roleId: "ceo",
    level: "senior",
    keyKpi: { en: "Strat plan achievement / valuation", fr: "Strat Plan achievement / valorisation" },
    secondaryKpis: [
      { en: "Revenue growth vs plan", fr: "Croissance CA vs plan" },
      { en: "Leadership team retention", fr: "Rétention équipe de direction" },
    ],
    competencies: ["B1", "B6", "B8", "C1", "C2", "C3", "C4"],
  },
  {
    roleId: "head-of-people",
    level: "senior",
    keyKpi: { en: "Attrition % (retention)", fr: "Attrition % (rétention)" },
    secondaryKpis: [
      { en: "Time-to-hire", fr: "Time-to-hire" },
      { en: "eNPS / engagement", fr: "eNPS / engagement" },
    ],
    competencies: ["B5", "B6", "C1", "C2", "C4"],
  },
  {
    roleId: "talent-acquisition-manager",
    level: "mid",
    keyKpi: { en: "% recruitment plan filled", fr: "% recruitment plan filled" },
    secondaryKpis: [
      { en: "Time-to-hire", fr: "Time-to-hire" },
      { en: "130-day retention", fr: "Rétention à 130 jours" },
    ],
    competencies: ["B1", "B3", "B2"],
  },
  {
    roleId: "people-workplace-partner",
    level: "junior",
    keyKpi: { en: "Workplace satisfaction ≥ 8/10", fr: "Satisfaction workplace ≥ 8/10" },
    secondaryKpis: [{ en: "HRIS accuracy ≥ 98%", fr: "Exactitude SIRH ≥ 98 %" }],
    competencies: ["B5", "B7"],
  },
  {
    roleId: "communication-manager",
    level: "mid",
    keyKpi: { en: "Share of voice / brand awareness", fr: "Share of voice / notoriété" },
    secondaryKpis: [
      { en: "Digital engagement", fr: "Engagement digital" },
      { en: "Leads from communication", fr: "Leads générés par la communication" },
    ],
    competencies: ["B1", "B6", "C3", "C4"],
  },
];

export const ROLE_EXPECTATIONS_MAP: Record<string, RoleExpectations> = Object.fromEntries(
  ROLE_EXPECTATIONS.map((r) => [r.roleId, r])
);
