import type { L10n, ProfileId } from "./types";

/**
 * Team-level narratives per profile, inspired by the Working Genius team-map
 * analysis: what a team loses when a profile is missing from every member's
 * natural zone, and what it risks when the profile dominates.
 */
export interface ProfileInsight {
  /** Short noun phrase: what this profile makes the team focus on. */
  focus: L10n;
  /** Narrative when no one carries the profile naturally. */
  absenceImpact: L10n;
  /** Narrative when the profile dominates the team. */
  dominanceRisk: L10n;
}

export const PROFILE_INSIGHTS: Record<ProfileId, ProfileInsight> = {
  driver: {
    focus: {
      en: "delivery and decisive execution",
      fr: "la livraison et l’exécution décisive",
    },
    absenceImpact: {
      en: "It will often fail to close: decisions linger, deadlines soften and projects stall near the finish line. The team analyses, plans and discusses — but struggles to commit and finish.",
      fr: "Elle échouera souvent à conclure : les décisions traînent, les échéances glissent et les projets s’enlisent près de la ligne d’arrivée. L’équipe analyse, planifie et discute — mais peine à trancher et à finir.",
    },
    dominanceRisk: {
      en: "With many Drivers, the team moves fast but may decide before aligning: efforts duplicate, consensus is skipped, and quality or documentation get left behind in the race to the result.",
      fr: "Avec beaucoup de Pilotes, l’équipe va vite mais peut décider avant de s’aligner : les efforts se dupliquent, le consensus est sauté, et la qualité ou la documentation restent au bord de la piste.",
    },
  },
  "race-engineer": {
    focus: {
      en: "coaching and turning analysis into action",
      fr: "l’accompagnement et la traduction de l’analyse en action",
    },
    absenceImpact: {
      en: "It will often fail to turn information into better decisions: problems are discovered late, feedback is rare, and people progress alone instead of being coached through difficulties.",
      fr: "Elle échouera souvent à transformer l’information en meilleures décisions : les problèmes sont découverts tard, le feedback est rare, et chacun progresse seul au lieu d’être accompagné dans les difficultés.",
    },
    dominanceRisk: {
      en: "With many Race Engineers, everyone advises and supports — but fewer people own the outcome, and analysis of the problem can replace the decision to act on it.",
      fr: "Avec beaucoup d’Ingénieurs de course, tout le monde conseille et accompagne — mais moins de personnes portent le résultat, et l’analyse du problème peut remplacer la décision d’agir.",
    },
  },
  strategist: {
    focus: {
      en: "planning and prioritization",
      fr: "la planification et la priorisation",
    },
    absenceImpact: {
      en: "It will often fail to anticipate: the team reacts to the loudest urgency rather than the most important goal, priorities shift constantly, and effort scatters across too many fronts.",
      fr: "Elle échouera souvent à anticiper : l’équipe réagit à l’urgence la plus bruyante plutôt qu’à l’objectif le plus important, les priorités changent sans cesse et l’effort se disperse sur trop de fronts.",
    },
    dominanceRisk: {
      en: "With many Strategists, planning can crowd out starting: scenarios get refined while windows of opportunity close, and perfect roadmaps replace imperfect progress.",
      fr: "Avec beaucoup de Stratèges, la planification peut retarder le démarrage : on affine les scénarios pendant que les fenêtres d’opportunité se referment, et la feuille de route parfaite remplace le progrès imparfait.",
    },
  },
  "chief-mechanic": {
    focus: {
      en: "quality and reliable operations",
      fr: "la qualité et la fiabilité des opérations",
    },
    absenceImpact: {
      en: "It will often fail to make results repeatable: the same problems come back, quality depends on individual heroics, processes stay fragile, and rework quietly eats the team's speed.",
      fr: "Elle échouera souvent à rendre les résultats reproductibles : les mêmes problèmes reviennent, la qualité repose sur des exploits individuels, les processus restent fragiles et le travail refait grignote silencieusement la vitesse de l’équipe.",
    },
    dominanceRisk: {
      en: "With many Chief Mechanics, process can win over speed: standards harden into rigidity, last-minute changes become battles, and 'done right' delays 'done now' even when now matters.",
      fr: "Avec beaucoup de Chefs mécaniciens, le processus peut l’emporter sur la vitesse : les standards se rigidifient, les changements de dernière minute deviennent des batailles, et le « bien fait » retarde le « fait maintenant » même quand maintenant compte.",
    },
  },
  "pit-crew": {
    focus: {
      en: "responsiveness and mutual support",
      fr: "la réactivité et l’entraide",
    },
    absenceImpact: {
      en: "It will often fail to flex together: hand-offs are slow, help doesn't flow across roles, everyone guards their lane — and the team loses speed exactly when coordination matters most.",
      fr: "Elle échouera souvent à se coordonner dans l’intensité : les passages de relais sont lents, l’aide ne circule pas entre les rôles, chacun garde son couloir — et l’équipe perd de la vitesse précisément quand la coordination compte le plus.",
    },
    dominanceRisk: {
      en: "With many Pit Crew profiles, the team executes brilliantly today but under-invests in tomorrow: urgent beats important, and no one steps back to question where the race is going.",
      fr: "Avec beaucoup de profils Pit Crew, l’équipe exécute brillamment aujourd’hui mais sous-investit demain : l’urgent l’emporte sur l’important, et personne ne prend de recul pour questionner la direction de la course.",
    },
  },
  telemetry: {
    focus: {
      en: "evidence and measurement",
      fr: "les faits et la mesure",
    },
    absenceImpact: {
      en: "It will often fail to see problems coming: decisions rest on opinions and instinct, weak signals go unnoticed, and issues are discovered when they are already expensive.",
      fr: "Elle échouera souvent à voir venir les problèmes : les décisions reposent sur des opinions et de l’instinct, les signaux faibles passent inaperçus, et les difficultés sont découvertes quand elles coûtent déjà cher.",
    },
    dominanceRisk: {
      en: "With many Telemetry Engineers, analysis can become an end in itself: more dashboards, more depth, more caveats — and fewer calls actually made.",
      fr: "Avec beaucoup d’Ingénieurs télémétrie, l’analyse peut devenir une fin en soi : plus de tableaux de bord, plus de profondeur, plus de réserves — et moins de décisions réellement prises.",
    },
  },
  aerodynamicist: {
    focus: {
      en: "innovation and optimization",
      fr: "l’innovation et l’optimisation",
    },
    absenceImpact: {
      en: "It will often fail to challenge how things are done: the team perfects the existing, improvements stay incremental, and better ways of working go unexplored until a competitor finds them first.",
      fr: "Elle échouera souvent à remettre en question les façons de faire : l’équipe perfectionne l’existant, les améliorations restent incrémentales, et les meilleures manières de travailler restent inexplorées jusqu’à ce qu’un concurrent les trouve en premier.",
    },
    dominanceRisk: {
      en: "With many Aerodynamicists, novelty can outpace delivery: many ideas get opened, fewer land in production, and the existing machine is neglected for the next invention.",
      fr: "Avec beaucoup d’Aérodynamiciens, la nouveauté peut dépasser la livraison : beaucoup d’idées s’ouvrent, peu atterrissent en production, et la machine existante est délaissée au profit de la prochaine invention.",
    },
  },
  "team-principal": {
    focus: {
      en: "alignment and direction",
      fr: "l’alignement et la direction",
    },
    absenceImpact: {
      en: "It will often fail to pull in one direction: individual goals drift apart, conflicts stay unresolved, and the 'why' behind the work fades until effort no longer adds up.",
      fr: "Elle échouera souvent à tirer dans la même direction : les objectifs individuels s’éloignent, les conflits restent irrésolus, et le « pourquoi » du travail s’estompe jusqu’à ce que les efforts ne s’additionnent plus.",
    },
    dominanceRisk: {
      en: "With many Team Principals, there are too many captains: direction gets debated more than executed, decision rights blur, and alignment meetings multiply while the car stays in the garage.",
      fr: "Avec beaucoup de Directeurs d’écurie, il y a trop de capitaines : la direction se débat plus qu’elle ne s’exécute, les responsabilités se brouillent, et les réunions d’alignement se multiplient pendant que la voiture reste au garage.",
    },
  },
};

/** Profile name without its leading article, for use inside a sentence. */
export function bareName(name: L10n): L10n {
  const strip = (s: string) => s.replace(/^(The|Le|La|L’)\s*/i, "");
  return { en: strip(name.en), fr: strip(name.fr) };
}
