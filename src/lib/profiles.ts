import type { ProfileDef, ProfileId } from "./types";

/**
 * The 8 Apex contribution profiles.
 * The metaphor comes from Formula 1: a profile describes how someone
 * naturally contributes to team performance — never who they "are",
 * and never their job title. A Race Engineer profile can work in Sales;
 * a Strategist can work in Operations.
 */
export const PROFILES: ProfileDef[] = [
  {
    id: "driver",
    emoji: "🏁",
    name: { en: "The Driver", fr: "Le Pilote" },
    shortName: { en: "Driver", fr: "Pilote" },
    tagline: {
      en: "Execution, ownership, decision-making under pressure.",
      fr: "Exécution, responsabilité, décision sous pression.",
    },
    color: "#FF684D",
    strengths: [
      {
        en: "Takes full ownership of outcomes and drives them to the finish line.",
        fr: "S’approprie pleinement les résultats et les mène jusqu’au bout.",
      },
      {
        en: "Decides quickly with incomplete information.",
        fr: "Décide rapidement avec une information incomplète.",
      },
      {
        en: "Keeps momentum when stakes and pressure are high.",
        fr: "Maintient la dynamique quand les enjeux et la pression montent.",
      },
    ],
    watchouts: [
      {
        en: "May move too fast and overlook consensus.",
        fr: "Peut aller trop vite et négliger le consensus.",
      },
      {
        en: "Can under-invest in documentation and handover.",
        fr: "Peut sous-investir la documentation et la transmission.",
      },
    ],
    motivators: [
      { en: "Clear ownership of a measurable result.", fr: "Une responsabilité claire sur un résultat mesurable." },
      { en: "Autonomy to decide and act quickly.", fr: "L’autonomie pour décider et agir vite." },
      { en: "Visible impact on the scoreboard.", fr: "Un impact visible sur les résultats." },
    ],
    frustrations: [
      { en: "Slow decision loops and approval chains.", fr: "Des circuits de décision lents et des chaînes de validation." },
      { en: "Unclear accountability.", fr: "Des responsabilités floues." },
      { en: "Meetings without decisions.", fr: "Des réunions sans décisions." },
    ],
    coachTips: [
      {
        en: "Give a clear finish line and get out of the way; check in on milestones, not methods.",
        fr: "Fixez une ligne d’arrivée claire et laissez de l’espace ; suivez les jalons, pas les méthodes.",
      },
      {
        en: "Ask them to name who needs to be consulted before big calls — make alignment part of the win.",
        fr: "Demandez-leur d’identifier qui consulter avant les décisions majeures — faites de l’alignement une condition de la victoire.",
      },
      {
        en: "Channel their pace into the highest-impact problem, not the most visible one.",
        fr: "Orientez leur rythme vers le problème à plus fort impact, pas le plus visible.",
      },
    ],
    teamContribution: {
      en: "Converts plans into results and keeps the team moving under pressure.",
      fr: "Transforme les plans en résultats et garde l’équipe en mouvement sous pression.",
    },
    mapX: 0.92,
    mapY: 0.5,
  },
  {
    id: "race-engineer",
    emoji: "🎧",
    name: { en: "The Race Engineer", fr: "L’Ingénieur de course" },
    shortName: { en: "Race Eng.", fr: "Ing. course" },
    tagline: {
      en: "Coaching, problem-solving, translating data into action.",
      fr: "Coaching, résolution de problèmes, traduction des données en action.",
    },
    color: "#00414F",
    strengths: [
      {
        en: "Helps others perform better through precise, actionable feedback.",
        fr: "Aide les autres à mieux performer par un feedback précis et actionnable.",
      },
      {
        en: "Connects analysis to concrete next steps.",
        fr: "Relie l’analyse à des actions concrètes.",
      },
      {
        en: "Stays calm and structured when solving problems live.",
        fr: "Reste calme et structuré pour résoudre les problèmes en temps réel.",
      },
    ],
    watchouts: [
      {
        en: "Can overanalyze before acting.",
        fr: "Peut sur-analyser avant d’agir.",
      },
      {
        en: "May carry others' problems instead of building their autonomy.",
        fr: "Peut porter les problèmes des autres au lieu de développer leur autonomie.",
      },
    ],
    motivators: [
      { en: "Seeing people and systems improve thanks to their input.", fr: "Voir les personnes et les systèmes progresser grâce à leur contribution." },
      { en: "Complex problems with real stakes.", fr: "Des problèmes complexes à enjeux réels." },
      { en: "Trusted-advisor relationships.", fr: "Des relations de conseiller de confiance." },
    ],
    frustrations: [
      { en: "Advice ignored until the problem explodes.", fr: "Des conseils ignorés jusqu’à ce que le problème éclate." },
      { en: "Acting without data or context.", fr: "Agir sans données ni contexte." },
      { en: "Pure execution with no room for improvement.", fr: "De l’exécution pure sans marge d’amélioration." },
    ],
    coachTips: [
      {
        en: "Set explicit analysis deadlines: 'best answer by Friday' beats 'perfect answer someday'.",
        fr: "Fixez des échéances d’analyse explicites : « la meilleure réponse vendredi » vaut mieux que « la réponse parfaite un jour ».",
      },
      {
        en: "Give them a coaching role — they multiply the performance of others.",
        fr: "Confiez-leur un rôle d’accompagnement — ils démultiplient la performance des autres.",
      },
      {
        en: "Recognize the wins they enable, not only the ones they score.",
        fr: "Valorisez les succès qu’ils rendent possibles, pas seulement ceux qu’ils remportent.",
      },
    ],
    teamContribution: {
      en: "Raises everyone's level by turning information into better decisions.",
      fr: "Élève le niveau de tous en transformant l’information en meilleures décisions.",
    },
    mapX: 0.45,
    mapY: 0.8,
  },
  {
    id: "strategist",
    emoji: "📊",
    name: { en: "The Strategist", fr: "Le Stratège" },
    shortName: { en: "Strategist", fr: "Stratège" },
    tagline: {
      en: "Planning, prioritization, anticipating scenarios.",
      fr: "Planification, priorisation, anticipation des scénarios.",
    },
    color: "#0F2024",
    strengths: [
      {
        en: "Sees several moves ahead and prepares for multiple scenarios.",
        fr: "Voit plusieurs coups à l’avance et prépare plusieurs scénarios.",
      },
      {
        en: "Prioritizes ruthlessly against the goal.",
        fr: "Priorise sans complaisance en fonction de l’objectif.",
      },
      {
        en: "Builds plans that survive contact with reality.",
        fr: "Construit des plans qui résistent à l’épreuve du réel.",
      },
    ],
    watchouts: [
      {
        en: "May struggle when rapid, unplanned action is needed.",
        fr: "Peut être en difficulté quand une action rapide et non planifiée s’impose.",
      },
      {
        en: "Can appear detached from day-to-day urgency.",
        fr: "Peut sembler éloigné de l’urgence du quotidien.",
      },
    ],
    motivators: [
      { en: "Shaping the direction, not just following it.", fr: "Définir la direction, pas seulement la suivre." },
      { en: "Time and space to think before committing.", fr: "Du temps et de l’espace pour réfléchir avant de s’engager." },
      { en: "Decisions grounded in a clear logic.", fr: "Des décisions fondées sur une logique claire." },
    ],
    frustrations: [
      { en: "Constant firefighting with no plan.", fr: "Le mode pompier permanent, sans plan." },
      { en: "Priorities that change without rationale.", fr: "Des priorités qui changent sans justification." },
      { en: "Being asked to execute before the 'why' is clear.", fr: "Exécuter avant que le « pourquoi » soit clair." },
    ],
    coachTips: [
      {
        en: "Involve them early — their value is greatest before the decision, not after.",
        fr: "Impliquez-les tôt — leur valeur est maximale avant la décision, pas après.",
      },
      {
        en: "Pair them with a strong executor to convert plans into motion.",
        fr: "Associez-les à un fort profil d’exécution pour transformer les plans en mouvement.",
      },
      {
        en: "Practice 'good enough now': agree on when a 70% plan should ship.",
        fr: "Travaillez le « suffisant maintenant » : convenez du moment où un plan à 70 % doit partir.",
      },
    ],
    teamContribution: {
      en: "Gives the team a map: clear priorities, anticipated risks, no surprises.",
      fr: "Donne une carte à l’équipe : priorités claires, risques anticipés, pas de surprises.",
    },
    mapX: 0.28,
    mapY: 0.45,
  },
  {
    id: "chief-mechanic",
    emoji: "🔧",
    name: { en: "The Chief Mechanic", fr: "Le Chef mécanicien" },
    shortName: { en: "Mechanic", fr: "Mécanicien" },
    tagline: {
      en: "Reliability, quality, operational excellence.",
      fr: "Fiabilité, qualité, excellence opérationnelle.",
    },
    color: "#00414F",
    strengths: [
      {
        en: "Delivers consistent, high-quality work others can build on.",
        fr: "Fournit un travail constant et de qualité sur lequel les autres peuvent s’appuyer.",
      },
      {
        en: "Spots defects and risks before they become incidents.",
        fr: "Repère les défauts et les risques avant qu’ils ne deviennent des incidents.",
      },
      {
        en: "Turns chaos into stable, repeatable process.",
        fr: "Transforme le chaos en processus stables et reproductibles.",
      },
    ],
    watchouts: [
      {
        en: "Can resist last-minute changes.",
        fr: "Peut résister aux changements de dernière minute.",
      },
      {
        en: "May optimize the process at the expense of speed.",
        fr: "Peut optimiser le processus au détriment de la vitesse.",
      },
    ],
    motivators: [
      { en: "Standards respected and quality recognized.", fr: "Des standards respectés et une qualité reconnue." },
      { en: "Owning a domain end-to-end.", fr: "La responsabilité d’un domaine de bout en bout." },
      { en: "Time to do things right the first time.", fr: "Le temps de bien faire les choses du premier coup." },
    ],
    frustrations: [
      { en: "Rework caused by rushed decisions.", fr: "Le travail refait à cause de décisions précipitées." },
      { en: "Quality treated as negotiable.", fr: "La qualité traitée comme négociable." },
      { en: "Scope changes at the last minute.", fr: "Des changements de périmètre à la dernière minute." },
    ],
    coachTips: [
      {
        en: "Explain the 'why' behind changes early — resistance drops when context rises.",
        fr: "Expliquez tôt le « pourquoi » des changements — la résistance baisse quand le contexte augmente.",
      },
      {
        en: "Let them define the quality bar for the team; it is a strength, not friction.",
        fr: "Laissez-les définir le niveau d’exigence qualité de l’équipe ; c’est une force, pas une friction.",
      },
      {
        en: "Agree explicitly on where 'good enough' applies and where excellence is non-negotiable.",
        fr: "Convenez explicitement des zones où « suffisant » s’applique et où l’excellence est non négociable.",
      },
    ],
    teamContribution: {
      en: "The reliability layer: what they own does not break.",
      fr: "Le socle de fiabilité : ce qu’ils prennent en charge ne casse pas.",
    },
    mapX: 0.6,
    mapY: 0.32,
  },
  {
    id: "pit-crew",
    emoji: "⚡",
    name: { en: "The Pit Crew", fr: "Le Pit Crew" },
    shortName: { en: "Pit Crew", fr: "Pit Crew" },
    tagline: {
      en: "Speed, teamwork, adaptability.",
      fr: "Vitesse, esprit d’équipe, adaptabilité.",
    },
    color: "#FF684D",
    strengths: [
      {
        en: "Reacts fast and well when the situation changes.",
        fr: "Réagit vite et bien quand la situation change.",
      },
      {
        en: "Puts the team's result above individual credit.",
        fr: "Place le résultat de l’équipe avant le mérite individuel.",
      },
      {
        en: "Slots into any gap where help is needed.",
        fr: "S’insère partout où un coup de main est nécessaire.",
      },
    ],
    watchouts: [
      {
        en: "May focus on execution over long-term thinking.",
        fr: "Peut privilégier l’exécution au détriment du long terme.",
      },
      {
        en: "Risk of spreading thin across too many fronts.",
        fr: "Risque de dispersion sur trop de fronts.",
      },
    ],
    motivators: [
      { en: "A tight team with a shared goal.", fr: "Une équipe soudée avec un objectif commun." },
      { en: "Variety and a fast pace.", fr: "De la variété et un rythme soutenu." },
      { en: "Being the person who unblocks others.", fr: "Être la personne qui débloque les autres." },
    ],
    frustrations: [
      { en: "Working in isolation.", fr: "Travailler isolé." },
      { en: "Slow, bureaucratic environments.", fr: "Des environnements lents et bureaucratiques." },
      { en: "Effort that helps no one visibly.", fr: "Des efforts sans utilité visible pour les autres." },
    ],
    coachTips: [
      {
        en: "Protect them from over-commitment — help them say no to the fourth simultaneous request.",
        fr: "Protégez-les du sur-engagement — aidez-les à dire non à la quatrième sollicitation simultanée.",
      },
      {
        en: "Give them one longer-horizon project to stretch strategic muscles.",
        fr: "Confiez-leur un projet à plus long terme pour développer leur regard stratégique.",
      },
      {
        en: "Recognize collective wins publicly — it is their fuel.",
        fr: "Célébrez publiquement les victoires collectives — c’est leur carburant.",
      },
    ],
    teamContribution: {
      en: "The glue and the speed: keeps the whole team fast and connected.",
      fr: "Le liant et la vitesse : garde l’équipe rapide et connectée.",
    },
    mapX: 0.85,
    mapY: 0.72,
  },
  {
    id: "telemetry",
    emoji: "📡",
    name: { en: "The Telemetry Engineer", fr: "L’Ingénieur télémétrie" },
    shortName: { en: "Telemetry", fr: "Télémétrie" },
    tagline: {
      en: "Data, insight, pattern recognition.",
      fr: "Données, analyse, détection de signaux.",
    },
    color: "#A1D0DB",
    strengths: [
      {
        en: "Finds the signal in the noise before anyone else.",
        fr: "Trouve le signal dans le bruit avant tout le monde.",
      },
      {
        en: "Grounds debates in facts and measurements.",
        fr: "Ancre les débats dans les faits et la mesure.",
      },
      {
        en: "Builds the instruments the team navigates with.",
        fr: "Construit les instruments avec lesquels l’équipe navigue.",
      },
    ],
    watchouts: [
      {
        en: "May become too detail-oriented.",
        fr: "Peut se perdre dans le détail.",
      },
      {
        en: "Can hold back conclusions waiting for more data.",
        fr: "Peut retenir ses conclusions en attendant plus de données.",
      },
    ],
    motivators: [
      { en: "Access to raw data and time to explore it.", fr: "L’accès aux données brutes et le temps de les explorer." },
      { en: "Being right for the right reasons.", fr: "Avoir raison pour les bonnes raisons." },
      { en: "Questions no one has answered yet.", fr: "Des questions encore sans réponse." },
    ],
    frustrations: [
      { en: "Decisions that ignore the evidence.", fr: "Des décisions qui ignorent les faits." },
      { en: "Vague goals that cannot be measured.", fr: "Des objectifs vagues et non mesurables." },
      { en: "Presenting before the analysis is solid.", fr: "Présenter avant que l’analyse soit solide." },
    ],
    coachTips: [
      {
        en: "Ask for a recommendation, not just the analysis — one slide, one decision.",
        fr: "Demandez une recommandation, pas seulement l’analyse — une slide, une décision.",
      },
      {
        en: "Timebox exploration; agree on 'decision-grade' vs 'research-grade' work.",
        fr: "Limitez le temps d’exploration ; distinguez le travail « pour décider » du travail « pour approfondir ».",
      },
      {
        en: "Connect their findings to business outcomes so the value is visible.",
        fr: "Reliez leurs analyses aux résultats business pour rendre leur valeur visible.",
      },
    ],
    teamContribution: {
      en: "The team's sensors: sees problems and opportunities in the data first.",
      fr: "Les capteurs de l’équipe : voit les problèmes et les opportunités dans les données en premier.",
    },
    mapX: 0.15,
    mapY: 0.2,
  },
  {
    id: "aerodynamicist",
    emoji: "🌬️",
    name: { en: "The Aerodynamicist", fr: "L’Aérodynamicien" },
    shortName: { en: "Aero", fr: "Aéro" },
    tagline: {
      en: "Innovation, systems thinking, optimization.",
      fr: "Innovation, pensée systémique, optimisation.",
    },
    color: "#D4B6FF",
    strengths: [
      {
        en: "Imagines solutions no one else has considered.",
        fr: "Imagine des solutions que personne n’a envisagées.",
      },
      {
        en: "Sees the whole system, not just the parts.",
        fr: "Voit le système entier, pas seulement les pièces.",
      },
      {
        en: "Finds gains where everything seemed already optimized.",
        fr: "Trouve des gains là où tout semblait déjà optimisé.",
      },
    ],
    watchouts: [
      {
        en: "Ideas may outpace implementation.",
        fr: "Les idées peuvent aller plus vite que leur mise en œuvre.",
      },
      {
        en: "Can lose interest once the novelty fades.",
        fr: "Peut se désengager une fois la nouveauté passée.",
      },
    ],
    motivators: [
      { en: "Hard problems with no known playbook.", fr: "Des problèmes difficiles sans mode d’emploi connu." },
      { en: "Freedom to experiment and challenge how things are done.", fr: "La liberté d’expérimenter et de remettre en cause l’existant." },
      { en: "Seeing an idea change the system.", fr: "Voir une idée changer le système." },
    ],
    frustrations: [
      { en: "\"We've always done it this way.\"", fr: "« On a toujours fait comme ça. »" },
      { en: "Innovation without follow-through.", fr: "L’innovation sans suite concrète." },
      { en: "Purely repetitive work.", fr: "Le travail purement répétitif." },
    ],
    coachTips: [
      {
        en: "Pair each idea with an owner for delivery — separate invention from industrialization.",
        fr: "Associez chaque idée à un responsable de la mise en œuvre — séparez l’invention de l’industrialisation.",
      },
      {
        en: "Create a regular forum where ideas get a fair hearing and a fast verdict.",
        fr: "Créez un rendez-vous régulier où les idées sont écoutées et tranchées rapidement.",
      },
      {
        en: "Ask 'what would make this 10% simpler?' — their optimization drive works on scope too.",
        fr: "Demandez « comment rendre cela 10 % plus simple ? » — leur goût de l’optimisation vaut aussi pour le périmètre.",
      },
    ],
    teamContribution: {
      en: "The edge: finds the tenths of a second everyone else has given up on.",
      fr: "L’avantage compétitif : trouve les dixièmes de seconde que les autres ont abandonnés.",
    },
    mapX: 0.25,
    mapY: 0.3,
  },
  {
    id: "team-principal",
    emoji: "🎯",
    name: { en: "The Team Principal", fr: "Le Directeur d’écurie" },
    shortName: { en: "Principal", fr: "Dir. écurie" },
    tagline: {
      en: "Leadership, alignment, vision.",
      fr: "Leadership, alignement, vision.",
    },
    color: "#00414F",
    strengths: [
      {
        en: "Aligns people around a clear direction.",
        fr: "Aligne les personnes autour d’une direction claire.",
      },
      {
        en: "Builds the conditions for others to perform.",
        fr: "Crée les conditions de la performance des autres.",
      },
      {
        en: "Keeps the long-term vision alive through short-term storms.",
        fr: "Maintient la vision long terme malgré les tempêtes du court terme.",
      },
    ],
    watchouts: [
      {
        en: "May delegate too much or lose touch with details.",
        fr: "Peut trop déléguer ou perdre le contact avec le terrain.",
      },
      {
        en: "Can prioritize harmony over hard conversations.",
        fr: "Peut privilégier l’harmonie au détriment des conversations difficiles.",
      },
    ],
    motivators: [
      { en: "Responsibility for people and direction.", fr: "La responsabilité des personnes et de la direction." },
      { en: "Building something bigger than any individual.", fr: "Construire quelque chose de plus grand que chaque individu." },
      { en: "Trust from the team and from leadership.", fr: "La confiance de l’équipe et de la direction." },
    ],
    frustrations: [
      { en: "Micromanagement from above.", fr: "Le micro-management venu d’en haut." },
      { en: "Misalignment that keeps resurfacing.", fr: "Des désalignements qui reviennent sans cesse." },
      { en: "Having accountability without authority.", fr: "La responsabilité sans l’autorité." },
    ],
    coachTips: [
      {
        en: "Agree on the few metrics they should stay hands-on with — total delegation is a risk, not a style.",
        fr: "Convenez des quelques indicateurs qu’ils doivent suivre de près — la délégation totale est un risque, pas un style.",
      },
      {
        en: "Use them to cascade strategy: they translate vision into team language naturally.",
        fr: "Appuyez-vous sur eux pour décliner la stratégie : ils traduisent naturellement la vision en langage d’équipe.",
      },
      {
        en: "Encourage direct, early feedback conversations — name the cost of delayed candor.",
        fr: "Encouragez les feedbacks directs et précoces — nommez le coût d’une franchise différée.",
      },
    ],
    teamContribution: {
      en: "The compass: direction, alignment and the conditions to win.",
      fr: "La boussole : direction, alignement et conditions de la victoire.",
    },
    mapX: 0.55,
    mapY: 0.88,
  },
];

export const PROFILE_MAP: Record<ProfileId, ProfileDef> = Object.fromEntries(
  PROFILES.map((p) => [p.id, p])
) as Record<ProfileId, ProfileDef>;

/** Short synergy notes between profile pairs, used in team-fit narratives. */
export function synergyNote(a: ProfileId, b: ProfileId): { en: string; fr: string } | null {
  const key = [a, b].sort().join("+");
  const notes: Record<string, { en: string; fr: string }> = {
    "driver+strategist": {
      en: "Plan meets pace: the Strategist charts the route, the Driver gets there first.",
      fr: "Le plan rencontre le rythme : le Stratège trace la route, le Pilote y arrive en premier.",
    },
    "driver+chief-mechanic": {
      en: "Speed with safety: the Chief Mechanic keeps quality intact at the Driver's pace.",
      fr: "La vitesse en sécurité : le Chef mécanicien préserve la qualité au rythme du Pilote.",
    },
    "aerodynamicist+chief-mechanic": {
      en: "Invention meets industrialization: ideas become reliable practice.",
      fr: "L’invention rencontre l’industrialisation : les idées deviennent des pratiques fiables.",
    },
    "race-engineer+driver": {
      en: "The classic radio pair: data-informed guidance keeps raw speed on track.",
      fr: "Le duo radio classique : un accompagnement basé sur les données garde la vitesse sur la bonne trajectoire.",
    },
    "telemetry+strategist": {
      en: "Evidence feeds the plan: scenarios built on real signals.",
      fr: "Les faits nourrissent le plan : des scénarios fondés sur des signaux réels.",
    },
    "pit-crew+team-principal": {
      en: "Alignment plus adaptability: direction set, execution flexes.",
      fr: "Alignement et adaptabilité : le cap est fixé, l’exécution s’adapte.",
    },
    "aerodynamicist+telemetry": {
      en: "Insight fuels innovation: patterns in the data become new designs.",
      fr: "L’analyse nourrit l’innovation : les tendances des données deviennent de nouvelles solutions.",
    },
    "race-engineer+team-principal": {
      en: "Development at two levels: the person and the team both grow.",
      fr: "Le développement à deux niveaux : la personne et l’équipe progressent ensemble.",
    },
  };
  return notes[key] ?? null;
}
