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
    overview: {
      en: "Drivers are at their best when a result is at stake and someone needs to take the wheel. They convert ambiguity into decisions and decisions into movement, absorbing pressure that would stall others. They tend to thrive when the goal is explicit, ownership is clear and the path is theirs to choose — and to lose energy in environments governed by committees and long validation chains. Around them the team feels the tempo rise: things ship faster, sometimes at the cost of alignment or documentation.",
      fr: "Les Pilotes sont à leur meilleur quand un résultat est en jeu et qu’il faut prendre le volant. Ils transforment l’ambiguïté en décisions et les décisions en mouvement, en absorbant une pression qui en paralyserait d’autres. Ils s’épanouissent quand l’objectif est explicite, la responsabilité claire et le chemin libre — et perdent de l’énergie dans les environnements gouvernés par les comités et les longues chaînes de validation. Autour d’eux, l’équipe sent le rythme monter : les choses aboutissent plus vite, parfois au prix de l’alignement ou de la documentation.",
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
    overview: {
      en: "Race Engineers perform through others: their impact shows in colleagues who improve, decisions that get sharper, problems whose root cause finally surfaces. They pair analysis with a human touch — their feedback lands because it is both precise and considerate. They thrive in roles with genuine interaction, where the progression of the people around them is visible, and lose energy in solitary or purely transactional work. In a team they act as a multiplier: performance quietly rises around them.",
      fr: "Les Ingénieurs de course performent à travers les autres : leur impact se lit dans des collègues qui progressent, des décisions plus nettes, des problèmes dont la cause racine émerge enfin. Ils allient l’analyse à un vrai sens du contact — leur feedback porte parce qu’il est à la fois précis et attentionné. Ils s’épanouissent dans les rôles à forte interaction, où la progression des personnes autour d’eux est visible, et perdent de l’énergie dans un travail solitaire ou purement transactionnel. Dans une équipe, ils jouent le rôle de multiplicateur : la performance monte discrètement autour d’eux.",
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
    overview: {
      en: "Strategists bring the map. Before the team moves, they have framed the problem, ranked the options and anticipated the ways things could go wrong. They thrive when there is real time to think ahead and a genuine say in direction; permanent firefighting drains them, because it burns the very anticipation they excel at. Their signature in a team is fewer surprises: risks are named early, priorities survive contact with reality, and effort lands where it matters.",
      fr: "Les Stratèges apportent la carte. Avant que l’équipe ne bouge, ils ont cadré le problème, hiérarchisé les options et anticipé ce qui pourrait mal tourner. Ils s’épanouissent quand il y a un vrai temps pour penser en avance et une vraie prise sur la direction ; l’urgence permanente les épuise, car elle consume précisément l’anticipation qui fait leur force. Leur signature dans une équipe : moins de surprises — les risques sont nommés tôt, les priorités résistent au contact du réel, et l’effort porte là où il compte.",
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
    overview: {
      en: "Chief Mechanics make performance repeatable. Where others improvise, they build the routine, the checklist, the standard that still holds once attention has moved elsewhere. Quality is personal to them: what leaves their hands works, every time. They thrive with clear ownership of critical operations and a quality bar that is actually respected, and they suffer in chronically improvised environments. The team experiences them as stability — and occasionally as friction, when speed gets chosen over craft.",
      fr: "Les Chefs mécanos rendent la performance reproductible. Là où d’autres improvisent, ils construisent la routine, la checklist, le standard qui tient encore quand l’attention est passée ailleurs. La qualité est pour eux une affaire personnelle : ce qui sort de leurs mains fonctionne, à chaque fois. Ils s’épanouissent avec une responsabilité claire sur des opérations critiques et une exigence de qualité réellement respectée, et souffrent dans les environnements chroniquement improvisés. L’équipe les vit comme une stabilité — et parfois comme une friction, quand la vitesse est préférée au travail bien fait.",
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
    overview: {
      en: "Pit Crew profiles are the connective tissue of a team. They read the situation, spot where the bottleneck is, and go there — without being asked and without needing the credit. Intensity energizes them: coordinated sprints, launches, crunch moments where everyone's timing matters. They thrive in collective, fast-moving contexts and wilt in siloed or slow ones. Their fingerprint is a team that flows: fewer dropped balls, faster handoffs, and someone always covering the gap nobody owns.",
      fr: "Les profils Pit Crew sont le tissu conjonctif d’une équipe. Ils lisent la situation, repèrent où se trouve le goulot d’étranglement, et y vont — sans qu’on le leur demande et sans avoir besoin d’en tirer le crédit. L’intensité les stimule : sprints coordonnés, lancements, moments de rush où la synchronisation de chacun compte. Ils s’épanouissent dans les contextes collectifs et rapides, et s’étiolent dans les environnements cloisonnés ou lents. Leur empreinte : une équipe qui coule de source — moins de balles perdues, des passations plus rapides, et toujours quelqu’un pour couvrir le trou dont personne n’est responsable.",
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
    overview: {
      en: "Telemetry Engineers trust what can be verified. They dig beneath opinions to find the number, the pattern, the root cause — and they change their mind when the data says so, which is rarer than it sounds. They thrive when questions are genuinely open and rigor is actually valued; they lose energy when conclusions precede evidence or when speed systematically beats accuracy. A team that includes one makes fewer confident mistakes: decisions get audited before reality audits them.",
      fr: "Les Ingénieurs télémétrie font confiance à ce qui peut être vérifié. Ils creusent sous les opinions pour trouver le chiffre, la tendance, la cause racine — et ils changent d’avis quand les données le disent, ce qui est plus rare qu’il n’y paraît. Ils s’épanouissent quand les questions sont réellement ouvertes et la rigueur véritablement valorisée ; ils perdent de l’énergie quand les conclusions précèdent les preuves ou quand la vitesse l’emporte systématiquement sur la justesse. Une équipe qui en compte un commet moins d’erreurs assurées : les décisions sont auditées avant que la réalité ne s’en charge.",
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
    overview: {
      en: "Aerodynamicists see the system — and its hidden drag. They question defaults, connect ideas across domains, and find the simplification everyone else walks past. They thrive where there is room to experiment and a real tolerance for iteration, and they suffocate under \"we've always done it this way\". Their trace in a team is renewal: processes stay alive instead of calcifying — occasionally at the price of stability, when they redesign something that merely needed maintaining.",
      fr: "Les Aérodynamiciens voient le système — et ses frottements cachés. Ils questionnent les évidences, connectent des idées de domaines différents et trouvent la simplification devant laquelle tout le monde passe. Ils s’épanouissent là où il y a de l’espace pour expérimenter et une vraie tolérance à l’itération, et s’asphyxient sous le « on a toujours fait comme ça ». Leur trace dans une équipe : le renouvellement — les processus restent vivants au lieu de se figer, parfois au prix de la stabilité, quand ils redessinent ce qui demandait seulement d’être entretenu.",
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
    overview: {
      en: "Team Principals hold the collective together and point it somewhere. They create alignment — sometimes by deciding, more often by making the goal so clear that decisions become obvious. They instinctively think in terms of conditions: what does this group need in order to perform? They thrive with a real mandate over people and direction, and lose energy executing alone in a corner. Their mark on a team is a shared sense of direction: people know where they are going, and why it matters.",
      fr: "Les Team Principals tiennent le collectif ensemble et lui donnent un cap. Ils créent l’alignement — parfois en tranchant, plus souvent en rendant l’objectif si clair que les décisions deviennent évidentes. Ils pensent instinctivement en termes de conditions : de quoi ce groupe a-t-il besoin pour performer ? Ils s’épanouissent avec un vrai mandat sur les personnes et la direction, et perdent de l’énergie à exécuter seuls dans leur coin. Leur marque sur une équipe : un sens partagé de la direction — chacun sait où l’on va, et pourquoi cela compte.",
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
