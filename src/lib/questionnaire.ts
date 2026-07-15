import type { FacetId, Item, L10n, LikertItem, PairItem, ProfileId, ValueId } from "./types";

/**
 * Apex questionnaire — designed for 15–20 minutes total.
 *
 * Part 1 — 24 forced-choice pairs → 8 contribution profiles (ipsative format
 *   reduces social desirability: both statements are positive, the respondent
 *   picks the one that describes them best).
 * Part 2 — 16 Likert items → 8 work-style facets.
 * Part 3 — 21 Likert items → 7 Manifesto values (culture alignment).
 *
 * Neutrality by design: every item describes a work behaviour or preference.
 * No item references or correlates with origin, age, gender or disability;
 * no leisure, physical, cultural or family content is used.
 */

/** Six positively-valenced statements per profile, matched in tone. */
const STATEMENTS: Record<ProfileId, L10n[]> = {
  driver: [
    { en: "I take charge of getting a result over the line.", fr: "Je prends en main l’atteinte du résultat jusqu’au bout." },
    { en: "I decide quickly, even under pressure.", fr: "Je décide vite, même sous pression." },
    { en: "I feel personally accountable for the final outcome.", fr: "Je me sens personnellement responsable du résultat final." },
    { en: "I move to action before conditions are perfect.", fr: "Je passe à l’action avant que les conditions soient parfaites." },
    { en: "I push a project forward when it stalls.", fr: "Je relance un projet quand il s’enlise." },
    { en: "I like being the one who makes the final call.", fr: "J’aime être la personne qui tranche." },
  ],
  "race-engineer": [
    { en: "I help colleagues find the cause of a problem.", fr: "J’aide mes collègues à trouver la cause d’un problème." },
    { en: "I turn analysis into concrete recommendations.", fr: "Je transforme l’analyse en recommandations concrètes." },
    { en: "I give feedback that helps someone improve.", fr: "Je donne un feedback qui aide l’autre à progresser." },
    { en: "I enjoy guiding someone through a difficult task.", fr: "J’aime guider quelqu’un dans une tâche difficile." },
    { en: "I solve problems best by talking them through with the person involved.", fr: "Je résous mieux les problèmes en les travaillant avec la personne concernée." },
    { en: "I am at my best supporting someone else's performance.", fr: "Je suis à mon meilleur quand je soutiens la performance de quelqu’un d’autre." },
  ],
  strategist: [
    { en: "I map out the steps before starting.", fr: "Je définis les étapes avant de commencer." },
    { en: "I anticipate what could go wrong and prepare options.", fr: "J’anticipe ce qui pourrait mal tourner et prépare des options." },
    { en: "I rank priorities before diving into work.", fr: "Je hiérarchise les priorités avant de me lancer." },
    { en: "I think several moves ahead.", fr: "Je réfléchis plusieurs coups à l’avance." },
    { en: "I build the plan the team will follow.", fr: "Je construis le plan que l’équipe va suivre." },
    { en: "I take time to frame a problem before solving it.", fr: "Je prends le temps de cadrer un problème avant de le résoudre." },
  ],
  "chief-mechanic": [
    { en: "I make sure the work meets the quality bar before it ships.", fr: "Je m’assure que le travail atteint le niveau de qualité avant de partir." },
    { en: "I keep critical operations running smoothly.", fr: "Je fais tourner les opérations critiques sans accroc." },
    { en: "I build routines that make results repeatable.", fr: "Je crée des routines qui rendent les résultats reproductibles." },
    { en: "People can rely on what I deliver, every time.", fr: "On peut compter sur ce que je livre, à chaque fois." },
    { en: "I fix the small defects others walk past.", fr: "Je corrige les petits défauts devant lesquels d’autres passent." },
    { en: "I prefer doing it right over doing it twice.", fr: "Je préfère bien faire plutôt que refaire." },
  ],
  "pit-crew": [
    { en: "I jump in wherever the team needs a hand.", fr: "J’interviens partout où l’équipe a besoin d’un coup de main." },
    { en: "I adapt fast when the situation changes.", fr: "Je m’adapte vite quand la situation change." },
    { en: "I keep the team moving when the pace picks up.", fr: "Je garde l’équipe en mouvement quand le rythme s’accélère." },
    { en: "I coordinate smoothly with others in fast sequences.", fr: "Je me coordonne facilement avec les autres dans les moments intenses." },
    { en: "I would rather succeed as a team than shine alone.", fr: "Je préfère réussir en équipe que briller seul·e." },
    { en: "I am energized by intense, collective moments.", fr: "Les moments intenses et collectifs me donnent de l’énergie." },
  ],
  telemetry: [
    { en: "I dig into the data before trusting an opinion.", fr: "Je creuse les données avant de me fier à une opinion." },
    { en: "I spot patterns others haven't seen yet.", fr: "Je repère des tendances que d’autres n’ont pas encore vues." },
    { en: "I measure things to know what is really happening.", fr: "Je mesure les choses pour savoir ce qui se passe vraiment." },
    { en: "I investigate until I find the root cause.", fr: "J’investigue jusqu’à trouver la cause racine." },
    { en: "I check the facts before the meeting starts.", fr: "Je vérifie les faits avant le début de la réunion." },
    { en: "I like turning raw information into insight.", fr: "J’aime transformer l’information brute en enseignements." },
  ],
  aerodynamicist: [
    { en: "I propose solutions nobody has tried before.", fr: "Je propose des solutions que personne n’a encore essayées." },
    { en: "I question how things are done, even when they work.", fr: "Je questionne les façons de faire, même quand elles fonctionnent." },
    { en: "I see how the whole system fits together.", fr: "Je vois comment le système s’articule dans son ensemble." },
    { en: "I look for the improvement hidden in an existing process.", fr: "Je cherche l’amélioration cachée dans un processus existant." },
    { en: "I enjoy experimenting with new approaches.", fr: "J’aime expérimenter de nouvelles approches." },
    { en: "I simplify what has become too complex.", fr: "Je simplifie ce qui est devenu trop complexe." },
  ],
  "team-principal": [
    { en: "I bring people into alignment around a goal.", fr: "Je crée l’alignement autour d’un objectif." },
    { en: "I give a group a clear direction.", fr: "Je donne une direction claire à un groupe." },
    { en: "I create the conditions for others to do their best work.", fr: "Je crée les conditions pour que les autres donnent leur meilleur." },
    { en: "I naturally take responsibility for the group's result.", fr: "Je prends naturellement la responsabilité du résultat du groupe." },
    { en: "I connect everyday work to the bigger picture.", fr: "Je relie le travail quotidien à la vision d’ensemble." },
    { en: "I help a team stay united through difficult periods.", fr: "J’aide une équipe à rester soudée dans les périodes difficiles." },
  ],
};

/**
 * 24 pairs covering all profile combinations except a perfect matching of 4
 * (each profile appears exactly 6 times).
 */
const PAIR_PLAN: [ProfileId, ProfileId][] = [
  ["driver", "strategist"],
  ["race-engineer", "telemetry"],
  ["chief-mechanic", "pit-crew"],
  ["aerodynamicist", "driver"],
  ["team-principal", "strategist"],
  ["telemetry", "chief-mechanic"],
  ["pit-crew", "race-engineer"],
  ["driver", "telemetry"],
  ["strategist", "aerodynamicist"],
  ["team-principal", "chief-mechanic"],
  ["race-engineer", "aerodynamicist"],
  ["pit-crew", "driver"],
  ["telemetry", "team-principal"],
  ["chief-mechanic", "race-engineer"],
  ["strategist", "pit-crew"],
  ["aerodynamicist", "chief-mechanic"],
  ["team-principal", "driver"],
  ["telemetry", "strategist"],
  ["race-engineer", "team-principal"],
  ["pit-crew", "aerodynamicist"],
  ["driver", "chief-mechanic"],
  ["strategist", "race-engineer"],
  ["aerodynamicist", "telemetry"],
  ["team-principal", "pit-crew"],
];

function buildPairs(): PairItem[] {
  const counters: Record<string, number> = {};
  return PAIR_PLAN.map(([a, b], i) => {
    const ai = counters[a] ?? 0;
    const bi = counters[b] ?? 0;
    counters[a] = ai + 1;
    counters[b] = bi + 1;
    return {
      kind: "pair" as const,
      id: `p${i + 1}`,
      a: { profile: a, text: STATEMENTS[a][ai] },
      b: { profile: b, text: STATEMENTS[b][bi] },
    };
  });
}

const facetLikert = (id: string, facet: FacetId, text: L10n): LikertItem => ({
  kind: "likert",
  id,
  target: { type: "facet", id: facet },
  text,
});

const FACET_ITEMS: LikertItem[] = [
  facetLikert("f1", "pace", { en: "I like to act quickly, even if it means adjusting along the way.", fr: "J’aime agir vite, quitte à ajuster en cours de route." }),
  facetLikert("f2", "structure", { en: "I work best with a clear method and an organized plan.", fr: "Je travaille mieux avec une méthode claire et un plan organisé." }),
  facetLikert("f3", "autonomy", { en: "I prefer organizing my own work over following detailed instructions.", fr: "Je préfère organiser mon travail moi-même plutôt que suivre des consignes détaillées." }),
  facetLikert("f4", "detail", { en: "I notice small errors that others miss.", fr: "Je remarque les petites erreurs qui échappent aux autres." }),
  facetLikert("f5", "influence", { en: "I find it easy to get others on board with an idea.", fr: "J’arrive facilement à embarquer les autres sur une idée." }),
  facetLikert("f6", "resilience", { en: "I stay calm and effective under pressure.", fr: "Je reste calme et efficace sous pression." }),
  facetLikert("f7", "learning", { en: "I regularly explore topics I know nothing about.", fr: "J’explore régulièrement des sujets que je ne connais pas." }),
  facetLikert("f8", "service", { en: "Helping someone else succeed satisfies me as much as succeeding myself.", fr: "Aider quelqu’un à réussir me satisfait autant que réussir moi-même." }),
  facetLikert("f9", "pace", { en: "Waiting for the perfect moment usually costs more than acting now.", fr: "Attendre le moment parfait coûte généralement plus cher qu’agir maintenant." }),
  facetLikert("f10", "structure", { en: "I create order — checklists, processes — where there is none.", fr: "Je crée de l’ordre — checklists, processus — là où il n’y en a pas." }),
  facetLikert("f11", "autonomy", { en: "I move forward without waiting to be told what to do.", fr: "J’avance sans attendre qu’on me dise quoi faire." }),
  facetLikert("f12", "detail", { en: "I double-check my work before considering it done.", fr: "Je vérifie deux fois mon travail avant de le considérer terminé." }),
  facetLikert("f13", "influence", { en: "I naturally take the lead in group discussions.", fr: "Je prends naturellement la parole pour orienter les discussions de groupe." }),
  facetLikert("f14", "resilience", { en: "Setbacks rarely affect my energy for long.", fr: "Les contretemps affectent rarement mon énergie très longtemps." }),
  facetLikert("f15", "learning", { en: "I enjoy being a beginner at something new.", fr: "J’aime être débutant·e dans un nouveau domaine." }),
  facetLikert("f16", "service", { en: "I adapt my way of working to what others need.", fr: "J’adapte ma façon de travailler aux besoins des autres." }),
];

const valueLikert = (id: string, value: ValueId, text: L10n): LikertItem => ({
  kind: "likert",
  id,
  target: { type: "value", id: value },
  text,
});

const CULTURE_ITEMS: LikertItem[] = [
  // Discernment
  valueLikert("c1", "discernment", { en: "I am comfortable deciding with 70% of the information.", fr: "Je suis à l’aise pour décider avec 70 % de l’information." }),
  valueLikert("c2", "discernment", { en: "I would rather take a calculated risk than miss an opportunity.", fr: "Je préfère prendre un risque calculé que laisser passer une opportunité." }),
  valueLikert("c3", "discernment", { en: "I weigh long-term consequences even when a quick win is tempting.", fr: "Je pèse les conséquences long terme même quand un gain rapide est tentant." }),
  // Boldness
  valueLikert("c4", "boldness", { en: "I challenge the way things are done, even when it is uncomfortable.", fr: "Je remets en question les façons de faire, même quand c’est inconfortable." }),
  valueLikert("c5", "boldness", { en: "I treat failure primarily as information for the next attempt.", fr: "Je considère l’échec d’abord comme une information pour l’essai suivant." }),
  valueLikert("c6", "boldness", { en: "When the context changes, I change my plan without regret.", fr: "Quand le contexte change, je change de plan sans regret." }),
  // Dedication to performance
  valueLikert("c7", "performance", { en: "I hold my work to a higher standard than what is asked of me.", fr: "Je place la barre plus haut que ce qu’on me demande." }),
  valueLikert("c8", "performance", { en: "I keep my discipline when the work gets repetitive or hard.", fr: "Je garde ma discipline quand le travail devient répétitif ou difficile." }),
  valueLikert("c9", "performance", { en: "I actively seek feedback to improve, even when it stings.", fr: "Je recherche activement le feedback pour progresser, même quand il pique." }),
  // Communication
  valueLikert("c10", "communication", { en: "I express complex ideas simply and briefly.", fr: "J’exprime les idées complexes de façon simple et brève." }),
  valueLikert("c11", "communication", { en: "I share what I know without waiting to be asked.", fr: "Je partage ce que je sais sans attendre qu’on me le demande." }),
  valueLikert("c12", "communication", { en: "I listen fully before defending my point of view.", fr: "J’écoute jusqu’au bout avant de défendre mon point de vue." }),
  // Collaboration
  valueLikert("c13", "collaboration", { en: "I measure my success by the team's result more than my own.", fr: "Je mesure mon succès au résultat de l’équipe plus qu’au mien." }),
  valueLikert("c14", "collaboration", { en: "I deliberately build relationships outside my own team.", fr: "Je construis délibérément des relations en dehors de mon équipe." }),
  valueLikert("c15", "collaboration", { en: "In a debate, I would rather the best idea win than my idea.", fr: "Dans un débat, je préfère que la meilleure idée gagne plutôt que la mienne." }),
  // Pragmatism
  valueLikert("c16", "pragmatism", { en: "I prefer a simple solution today over a perfect one next month.", fr: "Je préfère une solution simple aujourd’hui qu’une solution parfaite le mois prochain." }),
  valueLikert("c17", "pragmatism", { en: "I look for the shortest effective path to a result.", fr: "Je cherche le chemin le plus court et efficace vers le résultat." }),
  valueLikert("c18", "pragmatism", { en: "When something blocks me, I look for a solution before an explanation.", fr: "Quand quelque chose me bloque, je cherche une solution avant une explication." }),
  // Integrity
  valueLikert("c19", "integrity", { en: "I do the right thing even when nobody will notice.", fr: "Je fais ce qui est juste même si personne ne le remarquera." }),
  valueLikert("c20", "integrity", { en: "I flag my own mistakes early, even when it costs me.", fr: "Je signale mes erreurs tôt, même quand cela me coûte." }),
  valueLikert("c21", "integrity", { en: "I would rather lose a short-term gain than long-term trust.", fr: "Je préfère perdre un gain court terme qu’une confiance long terme." }),
];

export interface QuestionnaireSection {
  id: "profiles" | "workstyle" | "culture";
  title: L10n;
  intro: L10n;
  items: Item[];
}

export const SECTIONS: QuestionnaireSection[] = [
  {
    id: "profiles",
    title: { en: "How you contribute", fr: "Votre façon de contribuer" },
    intro: {
      en: "For each pair, choose the statement that describes you best at work. Both options are positive — pick the one that is more like you, most of the time.",
      fr: "Pour chaque paire, choisissez l’affirmation qui vous décrit le mieux au travail. Les deux options sont positives — choisissez celle qui vous ressemble le plus, la plupart du temps.",
    },
    items: buildPairs(),
  },
  {
    id: "workstyle",
    title: { en: "How you work", fr: "Votre façon de travailler" },
    intro: {
      en: "Indicate how well each statement describes you, from 1 (not at all) to 5 (exactly).",
      fr: "Indiquez à quel point chaque affirmation vous décrit, de 1 (pas du tout) à 5 (exactement).",
    },
    items: FACET_ITEMS,
  },
  {
    id: "culture",
    title: { en: "Your work environment", fr: "Votre environnement de travail" },
    intro: {
      en: "Indicate how well each statement describes you, from 1 (not at all) to 5 (exactly). There are no right answers — environments differ, and so do people.",
      fr: "Indiquez à quel point chaque affirmation vous décrit, de 1 (pas du tout) à 5 (exactement). Il n’y a pas de bonnes réponses — les environnements diffèrent, les personnes aussi.",
    },
    items: CULTURE_ITEMS,
  },
];

export const ALL_ITEMS: Item[] = SECTIONS.flatMap((s) => s.items);
export const TOTAL_ITEMS = ALL_ITEMS.length;
