import type { RoleDef } from "@/lib/types";

/**
 * Role library — sourced from the Notion "💼 Fiches de poste" database
 * ("What's my job?"), July 2026. Each role keeps its top success factors
 * (condensed) and maps each factor to a behavioural competency so the
 * assessment can rate role fit on a 1–5 scale.
 *
 * Roles marked `derived: true` had no explicit success-factor section in
 * Notion; factors were derived from responsibilities and should be reviewed.
 */
export const ROLES: RoleDef[] = [
  {
    id: "talent-acquisition-manager",
    title: { en: "Talent Acquisition Manager", fr: "Talent Acquisition Manager" },
    department: "HR",
    mission: {
      en: "Drive Hubcycle's growth by attracting, hiring and onboarding top talent while building an authentic employer brand.",
      fr: "Soutenir la croissance de Hubcycle en attirant, recrutant et intégrant les meilleurs talents tout en construisant une marque employeur authentique.",
    },
    successFactors: [
      { label: { en: "Strategic workforce planning", fr: "Planification stratégique des effectifs" }, competency: "planning-organization" },
      { label: { en: "Hiring quality & business fit", fr: "Qualité des recrutements et adéquation business" }, competency: "analytical-rigor" },
      { label: { en: "Time-to-hire & process efficiency", fr: "Délai de recrutement et efficacité du processus" }, competency: "execution-ownership" },
      { label: { en: "Candidate & onboarding experience", fr: "Expérience candidat et onboarding" }, competency: "stakeholder-communication" },
      { label: { en: "Employer brand visibility", fr: "Visibilité de la marque employeur" }, competency: "commercial-drive" },
    ],
  },
  {
    id: "head-of-strategic-execution",
    title: { en: "Head of Strategic Execution", fr: "Head of Strategic Execution" },
    department: "Comex",
    mission: {
      en: "Bridge strategy and operations: standardized processes, management routines and measurable delivery of the most critical KPIs.",
      fr: "Faire le pont entre stratégie et opérations : processus standardisés, routines de management et résultats mesurables sur les KPI critiques.",
    },
    successFactors: [
      { label: { en: "Operational improvement impact (core KPIs)", fr: "Impact d’amélioration opérationnelle (KPI clés)" }, competency: "execution-ownership" },
      { label: { en: "Execution discipline (OKR & frameworks)", fr: "Discipline d’exécution (OKR et cadres de travail)" }, competency: "planning-organization" },
      { label: { en: "Cross-functional influence without authority", fr: "Influence transverse sans autorité hiérarchique" }, competency: "stakeholder-communication" },
      { label: { en: "Interim leadership effectiveness", fr: "Efficacité en leadership de transition" }, competency: "leadership-alignment" },
    ],
  },
  {
    id: "international-logistics-manager",
    title: { en: "International Logistics Manager", fr: "Responsable logistique internationale" },
    department: "Supply chain",
    mission: {
      en: "Own international logistics flows from order confirmation to invoicing, executing complex multi-country shipments on time and at the right cost.",
      fr: "Piloter les flux logistiques internationaux de la confirmation de commande à la facturation, en exécutant des expéditions multi-pays complexes dans les délais et au bon coût.",
    },
    successFactors: [
      { label: { en: "On-time delivery & order-to-invoice lead time", fr: "Livraison à l’heure et délai commande-facture" }, competency: "execution-ownership" },
      { label: { en: "Customs & documentation accuracy", fr: "Exactitude douanière et documentaire" }, competency: "reliability-quality" },
      { label: { en: "Logistics cost optimization", fr: "Optimisation des coûts logistiques" }, competency: "analytical-rigor" },
      { label: { en: "Client satisfaction & fast issue resolution", fr: "Satisfaction client et résolution rapide des incidents" }, competency: "stakeholder-communication" },
      { label: { en: "Risk review & trade compliance", fr: "Revue des risques et conformité commerce international" }, competency: "planning-organization" },
    ],
  },
  {
    id: "sample-lab-technician",
    title: { en: "Sample & Lab Technician", fr: "Technicien·ne échantillons et laboratoire" },
    department: "Supply chain",
    mission: {
      en: "Own the full sample lifecycle — from reception to dispatch — so every product that leaves reflects Hubcycle's quality standards.",
      fr: "Gérer tout le cycle de vie des échantillons — de la réception à l’expédition — pour que chaque produit reflète les standards de qualité de Hubcycle.",
    },
    successFactors: [
      { label: { en: "Zero stock-outs & 48h dispatch", fr: "Zéro rupture de stock et expédition sous 48 h" }, competency: "execution-ownership" },
      { label: { en: "Non-conformity ≤2% & HACCP compliance", fr: "Non-conformité ≤ 2 % et conformité HACCP" }, competency: "reliability-quality" },
      { label: { en: "Lab protocol compliance & low rework", fr: "Respect des protocoles labo et faible taux de reprise" }, competency: "analytical-rigor" },
      { label: { en: "Quarterly workspace & HACCP audit scores", fr: "Scores d’audit trimestriels espace de travail et HACCP" }, competency: "planning-organization" },
      { label: { en: "Sales & PM satisfaction on sample support", fr: "Satisfaction Sales et PM sur le support échantillons" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "category-manager",
    title: { en: "Category Manager", fr: "Category Manager" },
    department: "Comex",
    mission: {
      en: "Own strategy and execution of an ingredient category worldwide — sales, sourcing, product and P&L.",
      fr: "Piloter la stratégie et l’exécution d’une catégorie d’ingrédients au niveau mondial — ventes, sourcing, produit et P&L.",
    },
    successFactors: [
      { label: { en: "Category P&L ownership", fr: "Responsabilité du P&L de la catégorie" }, competency: "execution-ownership" },
      { label: { en: "Sales & commercial development (deal-maker)", fr: "Développement commercial (deal-maker)" }, competency: "commercial-drive" },
      { label: { en: "Sourcing & supply quality", fr: "Qualité du sourcing et de l’approvisionnement" }, competency: "reliability-quality" },
      { label: { en: "Team leadership & development", fr: "Leadership et développement de l’équipe" }, competency: "leadership-alignment" },
      { label: { en: "Strategy quality & market agility", fr: "Qualité de la stratégie et agilité marché" }, competency: "adaptability" },
    ],
  },
  {
    id: "executive-assistant",
    title: { en: "Executive Assistant", fr: "Executive Assistant" },
    department: "Comex",
    mission: {
      en: "Free up significant CEO time by owning organization, anticipation and low-risk decisions with total discretion.",
      fr: "Libérer un temps significatif du CEO en prenant en charge l’organisation, l’anticipation et les décisions à faible risque avec une discrétion totale.",
    },
    successFactors: [
      { label: { en: "Meeting & logistics support (10–15h/week saved)", fr: "Support organisationnel et logistique (10–15 h/semaine libérées)" }, competency: "planning-organization" },
      { label: { en: "Anticipation & simplification of demands", fr: "Anticipation et simplification des sollicitations" }, competency: "adaptability" },
      { label: { en: "Discretion & sound judgment", fr: "Discrétion et discernement" }, competency: "reliability-quality" },
      { label: { en: "Autonomous low-risk decision-making", fr: "Décisions autonomes à faible risque" }, competency: "autonomy-initiative" },
    ],
  },
  {
    id: "bdr",
    title: { en: "Business Development Representative", fr: "Business Development Representative" },
    department: "Sales",
    mission: {
      en: "Fuel commercial growth by generating and qualifying new opportunities at the top of the funnel.",
      fr: "Alimenter la croissance commerciale en générant et qualifiant de nouvelles opportunités en haut du funnel.",
    },
    successFactors: [
      { label: { en: "Qualified discovery meetings booked", fr: "Rendez-vous de découverte qualifiés obtenus" }, competency: "commercial-drive" },
      { label: { en: "Outbound cadence discipline", fr: "Discipline de prospection sortante" }, competency: "execution-ownership" },
      { label: { en: "New ICP accounts across geographies", fr: "Nouveaux comptes cibles multi-géographies" }, competency: "adaptability" },
      { label: { en: "CRM completeness & data accuracy", fr: "Complétude et exactitude du CRM" }, competency: "reliability-quality" },
    ],
  },
  {
    id: "supply-chain-director",
    title: { en: "Supply Chain Director", fr: "Directeur·rice Supply Chain" },
    department: "Supply chain",
    mission: {
      en: "Design, build and run a predictable, scalable international supply chain — the operational backbone of Hubcycle.",
      fr: "Concevoir, construire et opérer une supply chain internationale prévisible et scalable — la colonne vertébrale opérationnelle de Hubcycle.",
    },
    successFactors: [
      { label: { en: "Supply chain performance & reliability", fr: "Performance et fiabilité de la supply chain" }, competency: "execution-ownership" },
      { label: { en: "Scalability & system building", fr: "Scalabilité et construction de systèmes" }, competency: "innovation-systems" },
      { label: { en: "ERP data quality & visibility", fr: "Qualité des données ERP et visibilité" }, competency: "reliability-quality" },
      { label: { en: "Team management & development", fr: "Management et développement de l’équipe" }, competency: "leadership-alignment" },
      { label: { en: "Cost & planning performance", fr: "Performance coûts et planification" }, competency: "planning-organization" },
    ],
  },
  {
    id: "toll-manufacturing-manager",
    title: { en: "Toll Manufacturing Manager", fr: "Toll Manufacturing Manager" },
    department: null,
    mission: {
      en: "Manage external manufacturing partners to transform by-products reliably, at spec and on schedule.",
      fr: "Piloter les partenaires de transformation à façon pour valoriser les coproduits de manière fiable, conforme et dans les délais.",
    },
    derived: true,
    successFactors: [
      { label: { en: "Manufacturing partner relationships", fr: "Relations avec les partenaires industriels" }, competency: "stakeholder-communication" },
      { label: { en: "Production reliability & compliance", fr: "Fiabilité et conformité de la production" }, competency: "reliability-quality" },
      { label: { en: "Production planning & scheduling", fr: "Planification et ordonnancement de la production" }, competency: "planning-organization" },
      { label: { en: "Fast resolution of production issues", fr: "Résolution rapide des incidents de production" }, competency: "execution-ownership" },
    ],
  },
  {
    id: "sales-manager",
    title: { en: "Sales Manager", fr: "Sales Manager" },
    department: "Sales",
    mission: {
      en: "Own the full commercial cycle — from prospecting to close — and build client relationships that generate sustainable, profitable revenue.",
      fr: "Piloter tout le cycle commercial — de la prospection au closing — et construire des relations clients générant un revenu durable et rentable.",
    },
    successFactors: [
      { label: { en: "Revenue target at margin, close rate ≥25%", fr: "Objectif de CA à la marge, taux de closing ≥ 25 %" }, competency: "commercial-drive" },
      { label: { en: "Pipeline coverage ≥3× & CRM cadence", fr: "Couverture de pipeline ≥ 3× et discipline CRM" }, competency: "planning-organization" },
      { label: { en: "New clients & new geographies", fr: "Nouveaux clients et nouvelles géographies" }, competency: "autonomy-initiative" },
      { label: { en: "Client satisfaction & renewal rate", fr: "Satisfaction client et taux de renouvellement" }, competency: "stakeholder-communication" },
      { label: { en: "Technical issue resolution with Sourcing & Quality", fr: "Résolution des sujets techniques avec Sourcing et Qualité" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "sourcing-manager",
    title: { en: "Sourcing Manager", fr: "Sourcing Manager" },
    department: "Sourcing",
    mission: {
      en: "Ensure rapid, stable access to strategic ingredient deposits: map, qualify and sample suppliers for long-term partnerships.",
      fr: "Garantir un accès rapide et stable aux gisements stratégiques : cartographier, qualifier et échantillonner les fournisseurs pour des partenariats durables.",
    },
    successFactors: [
      { label: { en: "New supply chains activated (≥€600k)", fr: "Nouvelles filières activées (≥ 600 k€)" }, competency: "commercial-drive" },
      { label: { en: "First-pass spec validation & conversion", fr: "Validation des specs au premier passage et conversion" }, competency: "analytical-rigor" },
      { label: { en: "Supplier retention & procurement compliance", fr: "Rétention fournisseurs et conformité achats" }, competency: "reliability-quality" },
      { label: { en: "CRM completeness & pipeline coverage", fr: "Complétude CRM et couverture de pipeline" }, competency: "planning-organization" },
      { label: { en: "Internal satisfaction & sourcing lead times", fr: "Satisfaction interne et délais de sourcing" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "people-workplace-partner",
    title: { en: "People & Workplace Partner", fr: "People & Workplace Partner" },
    department: "HR",
    mission: {
      en: "Ensure a smooth, welcoming, efficient work environment by owning HR administration and office operations.",
      fr: "Garantir un environnement de travail fluide, accueillant et efficace en pilotant l’administration RH et les opérations du bureau.",
    },
    successFactors: [
      { label: { en: "Compliant first-week onboarding", fr: "Onboarding conforme dès la première semaine" }, competency: "execution-ownership" },
      { label: { en: "Office & facility audit scores", fr: "Scores d’audit bureaux et équipements" }, competency: "reliability-quality" },
      { label: { en: "HR legal compliance & HRIS accuracy", fr: "Conformité légale RH et exactitude du SIRH" }, competency: "analytical-rigor" },
      { label: { en: "Employee workplace satisfaction", fr: "Satisfaction des collaborateurs sur l’environnement de travail" }, competency: "collaboration-teamwork" },
      { label: { en: "Proactive issue resolution & initiatives", fr: "Résolution proactive et initiatives d’amélioration" }, competency: "autonomy-initiative" },
    ],
  },
  {
    id: "chief-of-staff",
    title: { en: "Chief of Staff", fr: "Chief of Staff" },
    department: "Comex",
    mission: {
      en: "Strategic partner to the executive team: clarity, alignment and execution across key initiatives.",
      fr: "Partenaire stratégique de l’équipe dirigeante : clarté, alignement et exécution des initiatives clés.",
    },
    successFactors: [
      { label: { en: "Performance tracking & insight quality", fr: "Qualité du suivi de performance et des analyses" }, competency: "analytical-rigor" },
      { label: { en: "Executive routines & OKR alignment", fr: "Routines exécutives et alignement OKR" }, competency: "planning-organization" },
      { label: { en: "Strategic project delivery", fr: "Livraison des projets stratégiques" }, competency: "execution-ownership" },
      { label: { en: "Cross-functional coordination & influence", fr: "Coordination transverse et influence" }, competency: "stakeholder-communication" },
      { label: { en: "Leadership trust & recommendations", fr: "Confiance du leadership et qualité des recommandations" }, competency: "leadership-alignment" },
    ],
  },
  {
    id: "head-of-people",
    title: { en: "Head of People", fr: "Head of People" },
    department: "HR",
    mission: {
      en: "Build and execute the people strategy: talent acquisition, employee experience, performance, development and culture.",
      fr: "Construire et déployer la stratégie people : acquisition de talents, expérience collaborateur, performance, développement et culture.",
    },
    successFactors: [
      { label: { en: "Talent acquisition effectiveness", fr: "Efficacité de l’acquisition de talents" }, competency: "execution-ownership" },
      { label: { en: "Retention & engagement", fr: "Rétention et engagement" }, competency: "coaching-development" },
      { label: { en: "Performance management quality", fr: "Qualité du management de la performance" }, competency: "leadership-alignment" },
      { label: { en: "HR compliance & operations", fr: "Conformité et opérations RH" }, competency: "reliability-quality" },
      { label: { en: "Culture & employer brand", fr: "Culture et marque employeur" }, competency: "stakeholder-communication" },
    ],
  },
  {
    id: "cfoo",
    title: { en: "CFOO", fr: "CFOO" },
    department: "Finance",
    mission: {
      en: "Structure and implement the financial strategy: finance, legal and operations leadership, investor relations, strategic decisions.",
      fr: "Structurer et déployer la stratégie financière : direction finance, juridique et opérations, relations investisseurs, décisions stratégiques.",
    },
    successFactors: [
      { label: { en: "Financial strategy & governance", fr: "Stratégie financière et gouvernance" }, competency: "planning-organization" },
      { label: { en: "Cash & working capital management", fr: "Gestion du cash et du BFR" }, competency: "analytical-rigor" },
      { label: { en: "Investor relations & fundraising", fr: "Relations investisseurs et levées de fonds" }, competency: "stakeholder-communication" },
      { label: { en: "Team leadership & financial operations", fr: "Leadership d’équipe et opérations financières" }, competency: "leadership-alignment" },
      { label: { en: "Strategic contribution to leadership decisions", fr: "Contribution stratégique aux décisions de direction" }, competency: "innovation-systems" },
    ],
  },
  {
    id: "communication-manager",
    title: { en: "Communication Manager", fr: "Responsable Communication" },
    department: "Communication",
    mission: {
      en: "Define and execute a communication strategy that shapes the brand and makes Hubcycle's mission resonate with clients, investors, talents and institutions.",
      fr: "Définir et déployer une stratégie de communication qui façonne la marque et fait résonner la mission de Hubcycle auprès des clients, investisseurs, talents et institutions.",
    },
    successFactors: [
      { label: { en: "Brand awareness & positioning", fr: "Notoriété et positionnement de marque" }, competency: "stakeholder-communication" },
      { label: { en: "Digital presence & engagement growth", fr: "Croissance de la présence et de l’engagement digital" }, competency: "commercial-drive" },
      { label: { en: "Internal communication effectiveness", fr: "Efficacité de la communication interne" }, competency: "collaboration-teamwork" },
      { label: { en: "Campaign ROI & measurable impact", fr: "ROI des campagnes et impact mesurable" }, competency: "analytical-rigor" },
      { label: { en: "Crisis communication readiness", fr: "Préparation à la communication de crise" }, competency: "planning-organization" },
    ],
  },
  {
    id: "financial-manager",
    title: { en: "Financial Manager", fr: "Responsable financier·ère" },
    department: "Finance",
    mission: {
      en: "Run financial operations with rigor: bookkeeping, tax filings, financial statements and strategic finance projects.",
      fr: "Gérer les opérations financières avec rigueur : comptabilité, déclarations fiscales, états financiers et projets finance stratégiques.",
    },
    successFactors: [
      { label: { en: "Accounting accuracy & tax compliance", fr: "Exactitude comptable et conformité fiscale" }, competency: "analytical-rigor" },
      { label: { en: "Cash & receivables management (DSO)", fr: "Gestion du cash et des créances (DSO)" }, competency: "execution-ownership" },
      { label: { en: "Financial close quality & lead time", fr: "Qualité et délais de clôture" }, competency: "reliability-quality" },
      { label: { en: "ERP data quality & automation", fr: "Qualité des données ERP et automatisation" }, competency: "innovation-systems" },
      { label: { en: "Cross-functional finance support", fr: "Support finance transverse" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "category-manager-concentrates-derivatives",
    title: { en: "Category Manager — Concentrates & Derivatives", fr: "Category Manager — Concentrés et dérivés" },
    department: "Concentrates & derivatives",
    mission: {
      en: "Own the category end-to-end — supply chain development, supplier management, sales and P&L — with consistent methodology across categories.",
      fr: "Piloter la catégorie de bout en bout — développement des filières, gestion fournisseurs, ventes et P&L — avec une méthodologie cohérente entre catégories.",
    },
    successFactors: [
      { label: { en: "Category P&L performance", fr: "Performance P&L de la catégorie" }, competency: "execution-ownership" },
      { label: { en: "Global sourcing network strength", fr: "Solidité du réseau de sourcing mondial" }, competency: "stakeholder-communication" },
      { label: { en: "Sales & commercial development", fr: "Développement commercial" }, competency: "commercial-drive" },
      { label: { en: "Sourcing team leadership", fr: "Leadership de l’équipe sourcing" }, competency: "leadership-alignment" },
      { label: { en: "Cross-category coordination", fr: "Coordination inter-catégories" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "lead-project-scheduling",
    title: { en: "Lead Project Scheduling", fr: "Lead Project Scheduling" },
    department: "Supply chain",
    mission: {
      en: "Central coordinator of customer order execution: every order treated as a project, from ERP integration to delivery and invoicing.",
      fr: "Coordinateur central de l’exécution des commandes clients : chaque commande traitée comme un projet, de l’intégration ERP à la livraison et la facturation.",
    },
    successFactors: [
      { label: { en: "Order fulfillment & order-to-cash cycle", fr: "Exécution des commandes et cycle order-to-cash" }, competency: "execution-ownership" },
      { label: { en: "ERP data quality & scheduling accuracy", fr: "Qualité des données ERP et précision de l’ordonnancement" }, competency: "reliability-quality" },
      { label: { en: "Proactive issue anticipation", fr: "Anticipation proactive des incidents" }, competency: "autonomy-initiative" },
      { label: { en: "Customer satisfaction & responsiveness", fr: "Satisfaction et réactivité client" }, competency: "stakeholder-communication" },
      { label: { en: "Scheduling process optimization", fr: "Optimisation des processus d’ordonnancement" }, competency: "innovation-systems" },
    ],
  },
  {
    id: "quality-manager",
    title: { en: "Quality Manager", fr: "Responsable Qualité" },
    department: "Quality",
    mission: {
      en: "Define and oversee the global quality strategy — quality as a competitive advantage with full compliance to international food-safety standards.",
      fr: "Définir et superviser la stratégie qualité globale — la qualité comme avantage compétitif, en pleine conformité avec les standards internationaux de sécurité alimentaire.",
    },
    successFactors: [
      { label: { en: "FSSC 22000 certification & audit scores", fr: "Certification FSSC 22000 et scores d’audit" }, competency: "reliability-quality" },
      { label: { en: "Quality as a business enabler", fr: "La qualité comme levier business" }, competency: "stakeholder-communication" },
      { label: { en: "QHSE standards implementation", fr: "Déploiement des standards QHSE" }, competency: "planning-organization" },
      { label: { en: "Team leadership & development", fr: "Leadership et développement de l’équipe" }, competency: "coaching-development" },
      { label: { en: "Continuous improvement initiatives", fr: "Initiatives d’amélioration continue" }, competency: "innovation-systems" },
    ],
  },
  {
    id: "ceo",
    title: { en: "CEO", fr: "CEO" },
    department: "Comex",
    mission: {
      en: "Promote, prove and scale Hubcycle's circular model: the head, the voice, the values and the vision of the company.",
      fr: "Promouvoir, prouver et déployer le modèle circulaire de Hubcycle : la tête, la voix, les valeurs et la vision de l’entreprise.",
    },
    successFactors: [
      { label: { en: "Company value & equity story", fr: "Valeur de l’entreprise et equity story" }, competency: "leadership-alignment" },
      { label: { en: "Revenue & strategic deal execution", fr: "Chiffre d’affaires et deals stratégiques" }, competency: "commercial-drive" },
      { label: { en: "Leadership team strength", fr: "Solidité de l’équipe de direction" }, competency: "coaching-development" },
      { label: { en: "Investor & board alignment", fr: "Alignement investisseurs et board" }, competency: "stakeholder-communication" },
      { label: { en: "Operational autonomy & delegation", fr: "Autonomie opérationnelle et délégation" }, competency: "planning-organization" },
    ],
  },
  {
    id: "project-manager-rd",
    title: { en: "Project Manager R&D", fr: "Chef·fe de projet R&D" },
    department: "R&D",
    mission: {
      en: "Transform agri-food by-products into market-ready ingredients — own the product lifecycle from raw material to market entry.",
      fr: "Transformer les coproduits agroalimentaires en ingrédients prêts pour le marché — piloter le cycle produit de la matière première à la mise sur le marché.",
    },
    successFactors: [
      { label: { en: "Product portfolio velocity & time-to-market", fr: "Vélocité du portefeuille et time-to-market" }, competency: "execution-ownership" },
      { label: { en: "Commercial contribution & sales support", fr: "Contribution commerciale et support aux ventes" }, competency: "commercial-drive" },
      { label: { en: "Market & regulatory intelligence", fr: "Veille marché et réglementaire" }, competency: "analytical-rigor" },
      { label: { en: "Manufacturing partner quality", fr: "Qualité des partenaires industriels" }, competency: "reliability-quality" },
      { label: { en: "Cross-functional coordination", fr: "Coordination transverse" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "product-manager",
    title: { en: "Product Manager", fr: "Product Manager" },
    department: "R&D",
    mission: {
      en: "Maximize portfolio velocity — own the product lifecycle from raw material assessment to go-to-market, bridging Sourcing, Sales and the market.",
      fr: "Maximiser la vélocité du portefeuille — piloter le cycle produit de l’évaluation matière au go-to-market, en reliant Sourcing, Sales et le marché.",
    },
    successFactors: [
      { label: { en: "New products launched & time-to-market", fr: "Nouveaux produits lancés et time-to-market" }, competency: "execution-ownership" },
      { label: { en: "Revenue per product & Sales Playbook quality", fr: "Revenu par produit et qualité du Sales Playbook" }, competency: "commercial-drive" },
      { label: { en: "Specification & compliance accuracy", fr: "Exactitude des spécifications et conformité" }, competency: "analytical-rigor" },
      { label: { en: "Processing partner network reliability", fr: "Fiabilité du réseau de partenaires de transformation" }, competency: "stakeholder-communication" },
      { label: { en: "Cross-functional effectiveness", fr: "Efficacité transverse" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "category-manager-spices-herbs",
    title: { en: "Category Manager — Spices & Herbs", fr: "Category Manager — Épices et herbes" },
    department: "Spices & herbs",
    mission: {
      en: "Lead the Spices & Herbs category globally: full P&L, team building, and the strategic foundations to become the reference player in upcycled spices.",
      fr: "Diriger la catégorie Épices et herbes au niveau mondial : P&L complet, construction d’équipe et fondations stratégiques pour devenir la référence des épices upcyclées.",
    },
    successFactors: [
      { label: { en: "Category P&L ownership", fr: "Responsabilité du P&L de la catégorie" }, competency: "execution-ownership" },
      { label: { en: "Pipeline, close rate & market share", fr: "Pipeline, taux de closing et part de marché" }, competency: "commercial-drive" },
      { label: { en: "Side-stream qualification & supply reliability", fr: "Qualification des gisements et fiabilité des approvisionnements" }, competency: "reliability-quality" },
      { label: { en: "Team leadership & 360° feedback", fr: "Leadership d’équipe et feedback 360°" }, competency: "leadership-alignment" },
      { label: { en: "Market expansion & product launches", fr: "Expansion marché et lancements produits" }, competency: "adaptability" },
    ],
  },
  {
    id: "pm-coordinator",
    title: { en: "PM Coordinator", fr: "Coordinateur·rice PM" },
    department: "R&D",
    mission: {
      en: "Lead applied R&D in Juice & Concentrates and coordinate PM research methodology across New Category Development.",
      fr: "Mener la R&D appliquée Jus et concentrés et coordonner la méthodologie de recherche des PM au sein du New Category Development.",
    },
    successFactors: [
      { label: { en: "Valorisation processes developed & validated", fr: "Procédés de valorisation développés et validés" }, competency: "innovation-systems" },
      { label: { en: "Methodology consistency across PMs", fr: "Cohérence méthodologique entre PM" }, competency: "planning-organization" },
      { label: { en: "Scientific & technical quality", fr: "Qualité scientifique et technique" }, competency: "analytical-rigor" },
      { label: { en: "Transformation partner & process mastery", fr: "Maîtrise des partenaires et procédés de transformation" }, competency: "reliability-quality" },
      { label: { en: "Cross-functional coordination", fr: "Coordination transverse" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "category-manager-vanilla",
    title: { en: "Category Manager — Vanilla", fr: "Category Manager — Vanille" },
    department: "Vanilla",
    mission: {
      en: "Own strategy and execution of the Vanilla category worldwide — direct sales ownership, expert sourcing, and a strategy refined through execution.",
      fr: "Piloter la stratégie et l’exécution de la catégorie Vanille au niveau mondial — ventes en direct, sourcing expert et une stratégie affinée par l’exécution.",
    },
    successFactors: [
      { label: { en: "Category P&L ownership", fr: "Responsabilité du P&L de la catégorie" }, competency: "execution-ownership" },
      { label: { en: "Pipeline value & deal execution", fr: "Valeur du pipeline et exécution des deals" }, competency: "commercial-drive" },
      { label: { en: "Sourcing & product quality", fr: "Qualité du sourcing et des produits" }, competency: "reliability-quality" },
      { label: { en: "Strategy adaptation to market shifts", fr: "Adaptation de la stratégie aux évolutions du marché" }, competency: "adaptability" },
      { label: { en: "Team & cross-functional coordination", fr: "Coordination d’équipe et transverse" }, competency: "collaboration-teamwork" },
    ],
  },
  {
    id: "quality-assurance-director",
    title: { en: "Quality Assurance Director", fr: "Directeur·rice Assurance Qualité" },
    department: "Quality",
    mission: {
      en: "Build a world-class quality management system that protects products, unlocks markets and creates commercial momentum.",
      fr: "Construire un système de management de la qualité de classe mondiale qui protège les produits, ouvre des marchés et crée une dynamique commerciale.",
    },
    successFactors: [
      { label: { en: "Quality as a commercial enabler", fr: "La qualité comme levier commercial" }, competency: "commercial-drive" },
      { label: { en: "Certifications & audit readiness (FSSC, Bio, Halal, Kosher)", fr: "Certifications et préparation aux audits (FSSC, Bio, Halal, Casher)" }, competency: "reliability-quality" },
      { label: { en: "QMS performance & continuous improvement", fr: "Performance du SMQ et amélioration continue" }, competency: "innovation-systems" },
      { label: { en: "Team & quality culture development", fr: "Développement de l’équipe et de la culture qualité" }, competency: "coaching-development" },
      { label: { en: "New product launch agility", fr: "Agilité sur les lancements de nouveaux produits" }, competency: "adaptability" },
    ],
  },
];

export const ROLE_MAP: Record<string, RoleDef> = Object.fromEntries(ROLES.map((r) => [r.id, r]));
