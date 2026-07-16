import type { ValueDef, ValueId } from "./types";

/**
 * The 7 values of the Hubcycle Culture Manifesto (2025) — the single source
 * of truth for culture alignment. Structure mirrors the Manifesto:
 * as individuals / as a collective / with the external world.
 */
export const VALUES: ValueDef[] = [
  {
    id: "discernment",
    name: { en: "Discernment", fr: "Discernement" },
    scope: { en: "As individuals", fr: "En tant qu’individus" },
    summary: {
      en: "Smart decisions despite ambiguity: deciding without 100% of the information, taking calculated risks, seeking high-impact opportunities, thinking long term.",
      fr: "Des décisions justes malgré l’ambiguïté : décider sans 100 % de l’information, prendre des risques calculés, viser les opportunités à fort impact, penser long terme.",
    },
    highWhy: {
      en: "The answers indicate ease with deciding on partial information and weighing the long term — the person endorsed committing at ~70% certainty and taking calculated risks over playing safe.",
      fr: "Les réponses indiquent une aisance à décider sur une information partielle et à peser le long terme — la personne a validé s’engager à ~70 % de certitude et préférer un risque calculé à la sécurité.",
    },
    highExamples: [
      { en: "Moves a project forward without waiting for every validation.", fr: "Fait avancer un projet sans attendre chaque validation." },
      { en: "Commits to a recommendation in an ambiguous client situation.", fr: "S’engage sur une recommandation dans une situation client ambiguë." },
      { en: "Accepts a short-term cost when the long-term gain justifies it.", fr: "Accepte un coût court terme quand le gain long terme le justifie." },
    ],
    lowWhy: {
      en: "The answers lean toward certainty before commitment and immediate results over the long game — the person preferred waiting for near-certainty even at the risk of missing the opportunity.",
      fr: "Les réponses penchent vers la certitude avant l’engagement et le résultat immédiat plutôt que le long terme — la personne a préféré attendre une quasi-certitude, même au risque de laisser passer l’opportunité.",
    },
    lowExamples: [
      { en: "May postpone a decision until more data arrives, even when the window is closing.", fr: "Peut repousser une décision en attendant plus de données, même quand la fenêtre se referme." },
      { en: "May default to the safe option over the high-impact one.", fr: "Peut privilégier par défaut l’option sûre plutôt que celle à fort impact." },
      { en: "May optimize this quarter's result at the expense of the long game.", fr: "Peut optimiser le résultat du trimestre au détriment du long terme." },
    ],
  },
  {
    id: "boldness",
    name: { en: "Boldness", fr: "Audace" },
    scope: { en: "As individuals", fr: "En tant qu’individus" },
    summary: {
      en: "Full engagement, challenging traditional ways of doing business, standing firm in our values, seeing failure as learning, pivoting fast.",
      fr: "Un engagement total, la remise en cause des façons de faire traditionnelles, la fermeté sur nos valeurs, l’échec vu comme un apprentissage, des pivots rapides.",
    },
    highWhy: {
      en: "The answers show comfort with challenging established methods and treating failure as information — including questioning approaches that still work.",
      fr: "Les réponses montrent une aisance à remettre en question les méthodes établies et à traiter l’échec comme une information — y compris questionner des approches qui fonctionnent encore.",
    },
    highExamples: [
      { en: "Questions a process even when it \"has always worked\".", fr: "Questionne un processus même quand il « a toujours fonctionné »." },
      { en: "Proposes an approach nobody has tried, and owns it.", fr: "Propose une approche que personne n’a tentée, et l’assume." },
      { en: "Bounces back from a failed attempt keeping the lesson, not the bruise.", fr: "Rebondit après un essai raté en gardant la leçon, pas la blessure." },
    ],
    lowWhy: {
      en: "The answers favor proven methods and stability — the person endorsed the idea that questioning what already works is mostly wasted energy.",
      fr: "Les réponses privilégient les méthodes éprouvées et la stabilité — la personne a validé l’idée que questionner ce qui fonctionne déjà est surtout une perte d’énergie.",
    },
    lowExamples: [
      { en: "May defend the status quo when a change of method is on the table.", fr: "Peut défendre le statu quo quand un changement de méthode est sur la table." },
      { en: "May experience a failed attempt as a setback to avoid rather than data to use.", fr: "Peut vivre un essai raté comme un revers à éviter plutôt qu’une donnée à exploiter." },
      { en: "May resist a pivot even after the context has clearly changed.", fr: "Peut résister à un pivot même quand le contexte a clairement changé." },
    ],
  },
  {
    id: "performance",
    name: { en: "Dedication to performance", fr: "Exigence de performance" },
    scope: { en: "As individuals", fr: "En tant qu’individus" },
    summary: {
      en: "High expectations and high support: continuous improvement, autonomy with accountability, discipline and resilience.",
      fr: "Exigence élevée et soutien élevé : amélioration continue, autonomie avec responsabilité, discipline et résilience.",
    },
    highWhy: {
      en: "The answers indicate a personal bar above what is asked — the person endorsed improving work that is already \"good enough\" and rejected the idea that critical feedback is discouraging.",
      fr: "Les réponses indiquent une barre personnelle au-dessus de ce qui est demandé — la personne a validé améliorer un travail déjà « suffisant » et rejeté l’idée que le feedback critique est décourageant.",
    },
    highExamples: [
      { en: "Reworks a deliverable that already meets the bar, because it can be better.", fr: "Retravaille un livrable qui atteint déjà le niveau attendu, parce qu’il peut être meilleur." },
      { en: "Asks for critical feedback after a success, not only after a failure.", fr: "Demande un feedback critique après un succès, pas seulement après un échec." },
      { en: "Keeps discipline on repetitive or unglamorous work.", fr: "Garde sa discipline sur un travail répétitif ou ingrat." },
    ],
    lowWhy: {
      en: "The answers suggest effort stops near \"what was asked\" — the person endorsed moving on once the goal is reached and found critical feedback more discouraging than useful.",
      fr: "Les réponses suggèrent que l’effort s’arrête près de « ce qui était demandé » — la personne a validé passer à la suite une fois l’objectif atteint et trouvé le feedback critique plus décourageant qu’utile.",
    },
    lowExamples: [
      { en: "May consider work finished once the minimum expectation is met.", fr: "Peut considérer le travail terminé dès que l’attendu minimal est atteint." },
      { en: "May avoid, deflect or discount critical feedback.", fr: "Peut éviter, esquiver ou minimiser le feedback critique." },
      { en: "May lose intensity when the work becomes repetitive or hard.", fr: "Peut perdre en intensité quand le travail devient répétitif ou difficile." },
    ],
  },
  {
    id: "communication",
    name: { en: "Communication", fr: "Communication" },
    scope: { en: "As a collective", fr: "En tant que collectif" },
    summary: {
      en: "Clear and concise ideas, open knowledge sharing, constructive solution-oriented feedback, genuine listening.",
      fr: "Des idées claires et concises, un partage ouvert de la connaissance, un feedback constructif orienté solutions, une écoute réelle.",
    },
    highWhy: {
      en: "The answers indicate proactive sharing and genuine listening — the person endorsed sharing knowledge early (even unpolished) and expressing complex ideas simply.",
      fr: "Les réponses indiquent un partage proactif et une écoute réelle — la personne a validé partager tôt (même imparfait) et exprimer simplement les idées complexes.",
    },
    highExamples: [
      { en: "Shares a half-formed insight so the team can build on it.", fr: "Partage une intuition encore imparfaite pour que l’équipe puisse s’en emparer." },
      { en: "Sums up a complex topic in a few clear sentences.", fr: "Résume un sujet complexe en quelques phrases claires." },
      { en: "Lets others finish and reflects before defending a position.", fr: "Laisse l’autre finir et réfléchit avant de défendre sa position." },
    ],
    lowWhy: {
      en: "The answers lean toward holding information until it is complete and validated — knowledge circulates late or on request.",
      fr: "Les réponses penchent vers la rétention d’information tant qu’elle n’est pas complète et validée — la connaissance circule tard ou à la demande.",
    },
    lowExamples: [
      { en: "May sit on important information until it feels \"ready\".", fr: "Peut garder une information importante jusqu’à ce qu’elle semble « prête »." },
      { en: "Colleagues may discover decisions or problems late.", fr: "Les collègues peuvent découvrir des décisions ou des problèmes tardivement." },
      { en: "May defend a position before having fully heard the other side.", fr: "Peut défendre une position avant d’avoir vraiment écouté l’autre partie." },
    ],
  },
  {
    id: "collaboration",
    name: { en: "Collaboration", fr: "Collaboration" },
    scope: { en: "As a collective", fr: "En tant que collectif" },
    summary: {
      en: "We win together: strong relationships across teams, trust-based discussions where the best ideas win, success seen as collective.",
      fr: "Nous gagnons ensemble : des relations solides entre équipes, des échanges fondés sur la confiance où les meilleures idées gagnent, un succès collectif.",
    },
    highWhy: {
      en: "The answers put the team's result above personal scope — the person rejected \"my part is done, the rest isn't my concern\" and measures success collectively.",
      fr: "Les réponses placent le résultat de l’équipe au-dessus du périmètre personnel — la personne a rejeté « ma partie est faite, le reste n’est pas mon affaire » et mesure le succès collectivement.",
    },
    highExamples: [
      { en: "Helps another team win even without personal credit.", fr: "Aide une autre équipe à gagner même sans crédit personnel." },
      { en: "Drops their own idea for a better one without friction.", fr: "Abandonne sa propre idée pour une meilleure, sans friction." },
      { en: "Stays engaged on the project after their own deliverable has shipped.", fr: "Reste engagé·e sur le projet après avoir livré sa propre partie." },
    ],
    lowWhy: {
      en: "The answers suggest scope-bounded ownership — the person endorsed working best without depending on others and considering the project done once their part is delivered.",
      fr: "Les réponses suggèrent une responsabilité bornée au périmètre — la personne a validé mieux travailler sans dépendre des autres et considérer le projet clos une fois sa partie livrée.",
    },
    lowExamples: [
      { en: "May optimize their own perimeter over the collective outcome.", fr: "Peut optimiser son propre périmètre au détriment du résultat collectif." },
      { en: "May disengage once their deliverable is shipped, even if the project struggles.", fr: "Peut se désengager une fois sa partie livrée, même si le projet est en difficulté." },
      { en: "May experience dependencies on colleagues as friction rather than leverage.", fr: "Peut vivre les dépendances aux collègues comme une friction plutôt qu’un levier." },
    ],
  },
  {
    id: "pragmatism",
    name: { en: "Pragmatism", fr: "Pragmatisme" },
    scope: { en: "With the external world", fr: "Avec le monde extérieur" },
    summary: {
      en: "Simplifying complexity, the fastest effective path to results, data-driven with room for judgment, solutions over excuses.",
      fr: "Simplifier la complexité, le chemin le plus rapide et efficace vers le résultat, des décisions guidées par les données avec une place pour le jugement, des solutions plutôt que des excuses.",
    },
    highWhy: {
      en: "The answers favor useful-now over perfect-later — the person endorsed the simple solution today and reacting to blockers with solutions rather than explanations.",
      fr: "Les réponses privilégient l’utile maintenant au parfait plus tard — la personne a validé la solution simple aujourd’hui et la réaction aux blocages par des solutions plutôt que des explications.",
    },
    highExamples: [
      { en: "Ships the 80% version to unblock a client, then iterates.", fr: "Livre la version à 80 % pour débloquer un client, puis itère." },
      { en: "Cuts a complex process down to its essentials.", fr: "Ramène un processus complexe à son essentiel." },
      { en: "Responds to a blocker by testing a workaround the same day.", fr: "Répond à un blocage en testant un contournement le jour même." },
    ],
    lowWhy: {
      en: "The answers lean toward polish before delivery — the person endorsed finding it hard to hand over unpolished work even when time is short.",
      fr: "Les réponses penchent vers le peaufinage avant la livraison — la personne a validé avoir du mal à livrer un travail non peaufiné même quand le temps presse.",
    },
    lowExamples: [
      { en: "May hold a deliverable past the deadline to perfect it.", fr: "Peut retenir un livrable au-delà de l’échéance pour le perfectionner." },
      { en: "May over-engineer where a simple fix would have done.", fr: "Peut sur-ingénierer là où une solution simple aurait suffi." },
      { en: "May explain a blocker at length before attempting a workaround.", fr: "Peut expliquer longuement un blocage avant de tenter un contournement." },
    ],
  },
  {
    id: "integrity",
    name: { en: "Integrity", fr: "Intégrité" },
    scope: { en: "With the external world", fr: "Avec le monde extérieur" },
    summary: {
      en: "Doing what's right even when no one is watching: transparency, owning mistakes, long-term trust over short-term gains.",
      fr: "Faire ce qui est juste même sans témoin : transparence, assumer ses erreurs, la confiance long terme plutôt que les gains court terme.",
    },
    highWhy: {
      en: "The answers favor transparency even at a personal cost — the person endorsed saying uncomfortable truths and rejected fixing mistakes quietly or letting ambiguities stand.",
      fr: "Les réponses privilégient la transparence même à coût personnel — la personne a validé dire les vérités inconfortables et rejeté corriger ses erreurs discrètement ou laisser passer les ambiguïtés.",
    },
    highExamples: [
      { en: "Flags their own mistake before anyone discovers it.", fr: "Signale sa propre erreur avant que quiconque ne la découvre." },
      { en: "Tells a client an uncomfortable truth at the risk of the deal.", fr: "Dit à un client une vérité inconfortable au risque du deal." },
      { en: "Clarifies an ambiguity even when it creates short-term tension.", fr: "Clarifie une ambiguïté même quand cela crée une tension à court terme." },
    ],
    lowWhy: {
      en: "The answers suggest discretion over transparency — the person endorsed fixing mistakes quietly and letting a convenient ambiguity stand to preserve harmony.",
      fr: "Les réponses suggèrent la discrétion plutôt que la transparence — la personne a validé corriger ses erreurs discrètement et laisser passer une ambiguïté commode pour préserver l’harmonie.",
    },
    lowExamples: [
      { en: "May correct errors quietly rather than surfacing them.", fr: "Peut corriger ses erreurs en silence plutôt que les signaler." },
      { en: "May let a favorable misunderstanding persist with a client or colleague.", fr: "Peut laisser perdurer un malentendu favorable avec un client ou un collègue." },
      { en: "May prioritize immediate harmony over saying what needs to be said.", fr: "Peut privilégier l’harmonie immédiate plutôt que dire ce qui doit l’être." },
    ],
  },
];

export const VALUE_MAP: Record<ValueId, ValueDef> = Object.fromEntries(
  VALUES.map((v) => [v.id, v])
) as Record<ValueId, ValueDef>;

export type CultureBand = "super-fit" | "strong-fit" | "moderate-fit" | "stretch" | "misfit";

export const CULTURE_BANDS: { id: CultureBand; min: number; label: { en: string; fr: string }; description: { en: string; fr: string } }[] = [
  {
    id: "super-fit",
    min: 4.3,
    label: { en: "Super fit", fr: "Super fit" },
    description: {
      en: "The declared work preferences align strongly with the Manifesto across all value families.",
      fr: "Les préférences de travail déclarées s’alignent fortement avec le Manifeste sur toutes les familles de valeurs.",
    },
  },
  {
    id: "strong-fit",
    min: 3.7,
    label: { en: "Strong fit", fr: "Fit solide" },
    description: {
      en: "Clear alignment with the Manifesto, with one or two values to explore in interview.",
      fr: "Un alignement net avec le Manifeste, avec une ou deux valeurs à explorer en entretien.",
    },
  },
  {
    id: "moderate-fit",
    min: 3.0,
    label: { en: "Moderate fit", fr: "Fit modéré" },
    description: {
      en: "Partial alignment. Several values deserve a structured conversation before concluding.",
      fr: "Un alignement partiel. Plusieurs valeurs méritent un échange structuré avant de conclure.",
    },
  },
  {
    id: "stretch",
    min: 2.3,
    label: { en: "Stretch", fr: "Écart notable" },
    description: {
      en: "The declared preferences diverge from the Manifesto on several dimensions; a demanding, fast-paced environment may require significant adaptation.",
      fr: "Les préférences déclarées s’écartent du Manifeste sur plusieurs dimensions ; un environnement exigeant et rapide pourrait demander une adaptation importante.",
    },
  },
  {
    id: "misfit",
    min: 0,
    label: { en: "Misfit", fr: "Misfit" },
    description: {
      en: "The declared preferences point to a work environment quite different from Hubcycle's. To be validated carefully in interview.",
      fr: "Les préférences déclarées orientent vers un environnement de travail assez différent de celui de Hubcycle. À valider avec soin en entretien.",
    },
  },
];

export function cultureBand(score: number): CultureBand {
  for (const band of CULTURE_BANDS) {
    if (score >= band.min) return band.id;
  }
  return "misfit";
}
