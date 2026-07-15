import type { FacetId, Item, L10n, LikertItem, PairItem, ProfileId, ValueId } from "./types";

/**
 * Apex questionnaire — designed for 15–20 minutes total (81 items).
 *
 * Part 1 — 36 forced-choice pairs → 8 contribution profiles.
 *   · 28 "strengths" pairs: a complete round-robin — every profile is opposed
 *     to every other exactly once, so no profile is structurally favored.
 *   · 8 "under pressure" pairs: both statements are watch-outs, matched in
 *     tone. Endorsing a profile's shadow side signals that profile just as
 *     its strengths do, and is far less sensitive to social desirability.
 *   Each profile appears exactly 9 times (7 strengths + 2 shadows).
 *
 * Part 2 — 45 Likert items in ONE mixed section → 8 work-style facets (24
 *   items, 1 in 3 reverse-scored) and 7 Manifesto values (21 items, 1 in 3
 *   reverse-scored). Facet and value items are interleaved so that culture
 *   items are not presented as a recognizable "values test", and same-
 *   construct items sit far apart. Reverse-keyed items make straight-lining
 *   ineffective, and value items are phrased as trade-offs between two goods
 *   rather than virtues to endorse.
 *
 * Neutrality by design: every item describes a work behaviour or preference.
 * No item references or correlates with origin, age, gender or disability;
 * no leisure, physical, cultural or family content is used.
 */

/** Seven positively-valenced statements per profile, matched in tone. */
const STATEMENTS: Record<ProfileId, L10n[]> = {
  driver: [
    { en: "I take charge of getting a result over the line.", fr: "Je prends en main l’atteinte du résultat jusqu’au bout." },
    { en: "I decide quickly, even under pressure.", fr: "Je décide vite, même sous pression." },
    { en: "I feel personally accountable for the final outcome.", fr: "Je me sens personnellement responsable du résultat final." },
    { en: "I move to action before conditions are perfect.", fr: "Je passe à l’action avant que les conditions soient parfaites." },
    { en: "I push a project forward when it stalls.", fr: "Je relance un projet quand il s’enlise." },
    { en: "I like being the one who makes the final call.", fr: "J’aime être la personne qui tranche." },
    { en: "I set an ambitious target and go after it.", fr: "Je me fixe un objectif ambitieux et je vais le chercher." },
  ],
  "race-engineer": [
    { en: "I help colleagues find the cause of a problem.", fr: "J’aide mes collègues à trouver la cause d’un problème." },
    { en: "I turn analysis into concrete recommendations.", fr: "Je transforme l’analyse en recommandations concrètes." },
    { en: "I give feedback that helps someone improve.", fr: "Je donne un feedback qui aide l’autre à progresser." },
    { en: "I enjoy guiding someone through a difficult task.", fr: "J’aime guider quelqu’un dans une tâche difficile." },
    { en: "I solve problems best by talking them through with the person involved.", fr: "Je résous mieux les problèmes en les travaillant avec la personne concernée." },
    { en: "I am at my best supporting someone else's performance.", fr: "Je suis à mon meilleur quand je soutiens la performance de quelqu’un d’autre." },
    { en: "I quickly sense what a colleague needs to move forward.", fr: "Je perçois vite ce dont un·e collègue a besoin pour avancer." },
  ],
  strategist: [
    { en: "I map out the steps before starting.", fr: "Je définis les étapes avant de commencer." },
    { en: "I anticipate what could go wrong and prepare options.", fr: "J’anticipe ce qui pourrait mal tourner et prépare des options." },
    { en: "I rank priorities before diving into work.", fr: "Je hiérarchise les priorités avant de me lancer." },
    { en: "I think several moves ahead.", fr: "Je réfléchis plusieurs coups à l’avance." },
    { en: "I build the plan the team will follow.", fr: "Je construis le plan que l’équipe va suivre." },
    { en: "I take time to frame a problem before solving it.", fr: "Je prends le temps de cadrer un problème avant de le résoudre." },
    { en: "I connect today's decisions to where we want to be in a year.", fr: "Je relie les décisions d’aujourd’hui à là où nous voulons être dans un an." },
  ],
  "chief-mechanic": [
    { en: "I make sure the work meets the quality bar before it ships.", fr: "Je m’assure que le travail atteint le niveau de qualité avant de partir." },
    { en: "I keep critical operations running smoothly.", fr: "Je fais tourner les opérations critiques sans accroc." },
    { en: "I build routines that make results repeatable.", fr: "Je crée des routines qui rendent les résultats reproductibles." },
    { en: "People can rely on what I deliver, every time.", fr: "On peut compter sur ce que je livre, à chaque fois." },
    { en: "I fix the small defects others walk past.", fr: "Je corrige les petits défauts devant lesquels d’autres passent." },
    { en: "I prefer doing it right over doing it twice.", fr: "Je préfère bien faire plutôt que refaire." },
    { en: "I keep my commitments even when nobody is checking.", fr: "Je tiens mes engagements même quand personne ne vérifie." },
  ],
  "pit-crew": [
    { en: "I jump in wherever the team needs a hand.", fr: "J’interviens partout où l’équipe a besoin d’un coup de main." },
    { en: "I adapt fast when the situation changes.", fr: "Je m’adapte vite quand la situation change." },
    { en: "I keep the team moving when the pace picks up.", fr: "Je garde l’équipe en mouvement quand le rythme s’accélère." },
    { en: "I coordinate smoothly with others in fast sequences.", fr: "Je me coordonne facilement avec les autres dans les moments intenses." },
    { en: "I would rather succeed as a team than shine alone.", fr: "Je préfère réussir en équipe que briller seul·e." },
    { en: "I am energized by intense, collective moments.", fr: "Les moments intenses et collectifs me donnent de l’énergie." },
    { en: "I notice when a teammate is overloaded and take part of the load.", fr: "Je remarque quand un·e coéquipier·ère est surchargé·e et je prends une partie de la charge." },
  ],
  telemetry: [
    { en: "I dig into the data before trusting an opinion.", fr: "Je creuse les données avant de me fier à une opinion." },
    { en: "I spot patterns others haven't seen yet.", fr: "Je repère des tendances que d’autres n’ont pas encore vues." },
    { en: "I measure things to know what is really happening.", fr: "Je mesure les choses pour savoir ce qui se passe vraiment." },
    { en: "I investigate until I find the root cause.", fr: "J’investigue jusqu’à trouver la cause racine." },
    { en: "I check the facts before the meeting starts.", fr: "Je vérifie les faits avant le début de la réunion." },
    { en: "I like turning raw information into insight.", fr: "J’aime transformer l’information brute en enseignements." },
    { en: "I ask the question that reveals what we actually know.", fr: "Je pose la question qui révèle ce que nous savons vraiment." },
  ],
  aerodynamicist: [
    { en: "I propose solutions nobody has tried before.", fr: "Je propose des solutions que personne n’a encore essayées." },
    { en: "I question how things are done, even when they work.", fr: "Je questionne les façons de faire, même quand elles fonctionnent." },
    { en: "I see how the whole system fits together.", fr: "Je vois comment le système s’articule dans son ensemble." },
    { en: "I look for the improvement hidden in an existing process.", fr: "Je cherche l’amélioration cachée dans un processus existant." },
    { en: "I enjoy experimenting with new approaches.", fr: "J’aime expérimenter de nouvelles approches." },
    { en: "I simplify what has become too complex.", fr: "Je simplifie ce qui est devenu trop complexe." },
    { en: "I combine ideas from different fields to solve a problem.", fr: "Je combine des idées de domaines différents pour résoudre un problème." },
  ],
  "team-principal": [
    { en: "I bring people into alignment around a goal.", fr: "Je crée l’alignement autour d’un objectif." },
    { en: "I give a group a clear direction.", fr: "Je donne une direction claire à un groupe." },
    { en: "I create the conditions for others to do their best work.", fr: "Je crée les conditions pour que les autres donnent leur meilleur." },
    { en: "I naturally take responsibility for the group's result.", fr: "Je prends naturellement la responsabilité du résultat du groupe." },
    { en: "I connect everyday work to the bigger picture.", fr: "Je relie le travail quotidien à la vision d’ensemble." },
    { en: "I help a team stay united through difficult periods.", fr: "J’aide une équipe à rester soudée dans les périodes difficiles." },
    { en: "I make sure every voice has been heard before we commit.", fr: "Je m’assure que chaque voix a été entendue avant que l’on s’engage." },
  ],
};

/**
 * Two "shadow" statements per profile: honest watch-outs, matched in severity.
 * Endorsing a profile's shadow counts toward that profile exactly like a
 * strength does — but neither option is more flattering than the other.
 */
const SHADOW_STATEMENTS: Record<ProfileId, L10n[]> = {
  driver: [
    { en: "Under pressure, I can decide before everyone has been heard.", fr: "Sous pression, je peux trancher avant que tout le monde ait été entendu." },
    { en: "Under pressure, I can push for the result at the expense of the process.", fr: "Sous pression, je peux pousser le résultat au détriment du processus." },
  ],
  "race-engineer": [
    { en: "Under pressure, I can spend so much time helping others that my own work slips.", fr: "Sous pression, je peux passer tant de temps à aider les autres que mon propre travail glisse." },
    { en: "Under pressure, I can soften a message so much that it loses its force.", fr: "Sous pression, je peux adoucir un message au point qu’il perde de sa force." },
  ],
  strategist: [
    { en: "Under pressure, I can keep refining the plan when it is time to start.", fr: "Sous pression, je peux continuer à affiner le plan alors qu’il est temps de commencer." },
    { en: "Under pressure, I can see risks everywhere and slow things down.", fr: "Sous pression, je peux voir des risques partout et ralentir les choses." },
  ],
  "chief-mechanic": [
    { en: "Under pressure, I can polish details past the point of usefulness.", fr: "Sous pression, je peux peaufiner des détails au-delà de l’utile." },
    { en: "Under pressure, I can hold on to the usual way of doing things too long.", fr: "Sous pression, je peux m’accrocher trop longtemps à la façon de faire habituelle." },
  ],
  "pit-crew": [
    { en: "Under pressure, I can say yes to too many requests at once.", fr: "Sous pression, je peux dire oui à trop de demandes à la fois." },
    { en: "Under pressure, I can rush in before understanding the whole picture.", fr: "Sous pression, je peux me lancer avant d’avoir compris l’ensemble de la situation." },
  ],
  telemetry: [
    { en: "Under pressure, I can delay a decision waiting for more data.", fr: "Sous pression, je peux retarder une décision en attendant plus de données." },
    { en: "Under pressure, I can trust the numbers more than what people tell me.", fr: "Sous pression, je peux faire plus confiance aux chiffres qu’à ce que les gens me disent." },
  ],
  aerodynamicist: [
    { en: "Under pressure, I can change approach even when the current one still works.", fr: "Sous pression, je peux changer d’approche alors que l’actuelle fonctionne encore." },
    { en: "Under pressure, I can complicate something by wanting to reinvent it.", fr: "Sous pression, je peux complexifier une chose à force de vouloir la réinventer." },
  ],
  "team-principal": [
    { en: "Under pressure, I can spend more time aligning people than producing.", fr: "Sous pression, je peux passer plus de temps à aligner les gens qu’à produire." },
    { en: "Under pressure, I can take on responsibility that was not mine to carry.", fr: "Sous pression, je peux endosser une responsabilité qui n’était pas la mienne." },
  ],
};

/**
 * Complete round-robin: all 28 combinations of 8 profiles, so every profile
 * faces every other exactly once (7 appearances each). Ordered with the
 * circle method so each profile appears once per block of 4, and sides
 * alternate to balance position effects.
 */
const MAIN_PAIR_PLAN: [ProfileId, ProfileId][] = [
  // Round 1
  ["team-principal", "driver"],
  ["race-engineer", "aerodynamicist"],
  ["strategist", "telemetry"],
  ["chief-mechanic", "pit-crew"],
  // Round 2
  ["race-engineer", "team-principal"],
  ["driver", "strategist"],
  ["aerodynamicist", "chief-mechanic"],
  ["pit-crew", "telemetry"],
  // Round 3
  ["team-principal", "strategist"],
  ["chief-mechanic", "race-engineer"],
  ["pit-crew", "driver"],
  ["telemetry", "aerodynamicist"],
  // Round 4
  ["chief-mechanic", "team-principal"],
  ["strategist", "pit-crew"],
  ["race-engineer", "telemetry"],
  ["driver", "aerodynamicist"],
  // Round 5
  ["team-principal", "pit-crew"],
  ["telemetry", "chief-mechanic"],
  ["aerodynamicist", "strategist"],
  ["driver", "race-engineer"],
  // Round 6
  ["telemetry", "team-principal"],
  ["pit-crew", "aerodynamicist"],
  ["chief-mechanic", "driver"],
  ["strategist", "race-engineer"],
  // Round 7
  ["team-principal", "aerodynamicist"],
  ["driver", "telemetry"],
  ["race-engineer", "pit-crew"],
  ["strategist", "chief-mechanic"],
];

/** 8 shadow pairs — each profile appears exactly twice. */
const SHADOW_PAIR_PLAN: [ProfileId, ProfileId][] = [
  ["driver", "race-engineer"],
  ["strategist", "chief-mechanic"],
  ["pit-crew", "telemetry"],
  ["aerodynamicist", "team-principal"],
  ["chief-mechanic", "driver"],
  ["telemetry", "aerodynamicist"],
  ["race-engineer", "pit-crew"],
  ["team-principal", "strategist"],
];

function buildPairs(): PairItem[] {
  const mainCounters: Record<string, number> = {};
  const shadowCounters: Record<string, number> = {};

  const main = MAIN_PAIR_PLAN.map(([a, b], i) => {
    const ai = mainCounters[a] ?? 0;
    const bi = mainCounters[b] ?? 0;
    mainCounters[a] = ai + 1;
    mainCounters[b] = bi + 1;
    return {
      kind: "pair" as const,
      id: `p${i + 1}`,
      a: { profile: a, text: STATEMENTS[a][ai] },
      b: { profile: b, text: STATEMENTS[b][bi] },
    };
  });

  const shadow = SHADOW_PAIR_PLAN.map(([a, b], i) => {
    const ai = shadowCounters[a] ?? 0;
    const bi = shadowCounters[b] ?? 0;
    shadowCounters[a] = ai + 1;
    shadowCounters[b] = bi + 1;
    return {
      kind: "pair" as const,
      id: `s${i + 1}`,
      a: { profile: a, text: SHADOW_STATEMENTS[a][ai] },
      b: { profile: b, text: SHADOW_STATEMENTS[b][bi] },
    };
  });

  return [...main, ...shadow];
}

const facetLikert = (id: string, facet: FacetId, text: L10n, reversed?: boolean): LikertItem => ({
  kind: "likert",
  id,
  target: { type: "facet", id: facet },
  text,
  ...(reversed ? { reversed: true } : {}),
});

/**
 * 24 facet items: 3 per facet — 2 positively keyed, 1 reverse-keyed —
 * ordered in rounds of 8 (one item per facet per round).
 */
const FACET_ITEMS: LikertItem[] = [
  // Round 1 — positively keyed
  facetLikert("f1", "pace", { en: "I like to act quickly, even if it means adjusting along the way.", fr: "J’aime agir vite, quitte à ajuster en cours de route." }),
  facetLikert("f2", "structure", { en: "I work best with a clear method and an organized plan.", fr: "Je travaille mieux avec une méthode claire et un plan organisé." }),
  facetLikert("f3", "autonomy", { en: "I prefer organizing my own work over following detailed instructions.", fr: "Je préfère organiser mon travail moi-même plutôt que suivre des consignes détaillées." }),
  facetLikert("f4", "detail", { en: "I notice small errors that others miss.", fr: "Je remarque les petites erreurs qui échappent aux autres." }),
  facetLikert("f5", "influence", { en: "I find it easy to get others on board with an idea.", fr: "J’arrive facilement à embarquer les autres sur une idée." }),
  facetLikert("f6", "resilience", { en: "I stay calm and effective under pressure.", fr: "Je reste calme et efficace sous pression." }),
  facetLikert("f7", "learning", { en: "I regularly explore topics I know nothing about.", fr: "J’explore régulièrement des sujets que je ne connais pas." }),
  facetLikert("f8", "service", { en: "Helping someone else succeed satisfies me as much as succeeding myself.", fr: "Aider quelqu’un à réussir me satisfait autant que réussir moi-même." }),
  // Round 2 — positively keyed
  facetLikert("f9", "pace", { en: "Waiting for the perfect moment usually costs more than acting now.", fr: "Attendre le moment parfait coûte généralement plus cher qu’agir maintenant." }),
  facetLikert("f10", "structure", { en: "I create order — checklists, processes — where there is none.", fr: "Je crée de l’ordre — checklists, processus — là où il n’y en a pas." }),
  facetLikert("f11", "autonomy", { en: "I move forward without waiting to be told what to do.", fr: "J’avance sans attendre qu’on me dise quoi faire." }),
  facetLikert("f12", "detail", { en: "I double-check my work before considering it done.", fr: "Je vérifie deux fois mon travail avant de le considérer terminé." }),
  facetLikert("f13", "influence", { en: "I naturally take the lead in group discussions.", fr: "Je prends naturellement la parole pour orienter les discussions de groupe." }),
  facetLikert("f14", "resilience", { en: "Setbacks rarely affect my energy for long.", fr: "Les contretemps affectent rarement mon énergie très longtemps." }),
  facetLikert("f15", "learning", { en: "I enjoy being a beginner at something new.", fr: "J’aime être débutant·e dans un nouveau domaine." }),
  facetLikert("f16", "service", { en: "I adapt my way of working to what others need.", fr: "J’adapte ma façon de travailler aux besoins des autres." }),
  // Round 3 — reverse-keyed
  facetLikert("f17", "pace", { en: "I take my time before acting, even when others are eager to move.", fr: "Je prends mon temps avant d’agir, même quand les autres ont hâte d’avancer." }, true),
  facetLikert("f18", "structure", { en: "Formal processes and checklists slow me down more than they help me.", fr: "Les processus formels et les checklists me freinent plus qu’ils ne m’aident." }, true),
  facetLikert("f19", "autonomy", { en: "I am more comfortable when someone defines precisely what is expected of me.", fr: "Je suis plus à l’aise quand on définit précisément ce qu’on attend de moi." }, true),
  facetLikert("f20", "detail", { en: "Once the big picture is right, small imperfections rarely bother me.", fr: "Une fois l’essentiel en place, les petites imperfections me dérangent rarement." }, true),
  facetLikert("f21", "influence", { en: "In a group, I prefer to let others steer the discussion.", fr: "En groupe, je préfère laisser les autres orienter la discussion." }, true),
  facetLikert("f22", "resilience", { en: "After a hard setback, I need some time before finding my momentum again.", fr: "Après un contretemps difficile, il me faut un peu de temps pour retrouver mon élan." }, true),
  facetLikert("f23", "learning", { en: "I would rather deepen what I already master than start from zero on something new.", fr: "Je préfère approfondir ce que je maîtrise déjà que repartir de zéro sur une nouveauté." }, true),
  facetLikert("f24", "service", { en: "I protect my own priorities first, even when a colleague asks for help.", fr: "Je protège d’abord mes propres priorités, même quand un·e collègue demande de l’aide." }, true),
];

const valueLikert = (id: string, value: ValueId, text: L10n, reversed?: boolean): LikertItem => ({
  kind: "likert",
  id,
  target: { type: "value", id: value },
  text,
  ...(reversed ? { reversed: true } : {}),
});

/**
 * 21 value items: 3 per value — 2 phrased as trade-offs between two
 * legitimate preferences (no obviously "right" answer), 1 reverse-keyed —
 * ordered in rounds of 7 (one item per value per round).
 */
const CULTURE_ITEMS: LikertItem[] = [
  // Round 1
  valueLikert("c1", "discernment", { en: "I am comfortable deciding with 70% of the information.", fr: "Je suis à l’aise pour décider avec 70 % de l’information." }),
  valueLikert("c4", "boldness", { en: "I challenge the way things are done, even when it is uncomfortable.", fr: "Je remets en question les façons de faire, même quand c’est inconfortable." }),
  valueLikert("c7", "performance", { en: "I keep improving a piece of work even after it is already “good enough”.", fr: "Je continue d’améliorer un travail même quand il est déjà « suffisant »." }),
  valueLikert("c10", "communication", { en: "I express complex ideas simply and briefly.", fr: "J’exprime les idées complexes de façon simple et brève." }),
  valueLikert("c13", "collaboration", { en: "I measure my success by the team's result more than my own.", fr: "Je mesure mon succès au résultat de l’équipe plus qu’au mien." }),
  valueLikert("c16", "pragmatism", { en: "I prefer a simple solution today over a perfect one next month.", fr: "Je préfère une solution simple aujourd’hui qu’une solution parfaite le mois prochain." }),
  valueLikert("c19", "integrity", { en: "I say the uncomfortable truth rather than let a misunderstanding settle in.", fr: "Je dis la vérité inconfortable plutôt que de laisser un malentendu s’installer." }),
  // Round 2
  valueLikert("c2", "discernment", { en: "I would rather take a calculated risk than miss an opportunity.", fr: "Je préfère prendre un risque calculé que laisser passer une opportunité." }),
  valueLikert("c5", "boldness", { en: "I treat failure primarily as information for the next attempt.", fr: "Je considère l’échec d’abord comme une information pour l’essai suivant." }),
  valueLikert("c8", "performance", { en: "I actively seek feedback to improve, even when it stings.", fr: "Je recherche activement le feedback pour progresser, même quand il pique." }),
  valueLikert("c11", "communication", { en: "I share what I know early, even when it is not yet complete or validated.", fr: "Je partage tôt ce que je sais, même quand ce n’est pas encore complet ou validé." }),
  valueLikert("c14", "collaboration", { en: "In a debate, I would rather the best idea win than my idea.", fr: "Dans un débat, je préfère que la meilleure idée gagne plutôt que la mienne." }),
  valueLikert("c17", "pragmatism", { en: "When something blocks me, I look for a solution before an explanation.", fr: "Quand quelque chose me bloque, je cherche une solution avant une explication." }),
  valueLikert("c20", "integrity", { en: "I flag my own mistakes early, even when it costs me.", fr: "Je signale mes erreurs tôt, même quand cela me coûte." }),
  // Round 3 — reverse-keyed
  valueLikert("c3", "discernment", { en: "I prefer to wait for near-certainty before committing, even if the opportunity may pass.", fr: "Je préfère attendre une quasi-certitude avant de m’engager, même si l’opportunité risque de passer." }, true),
  valueLikert("c6", "boldness", { en: "When a method has proven itself, questioning it is mostly a waste of energy.", fr: "Quand une méthode a fait ses preuves, la remettre en question est surtout une perte d’énergie." }, true),
  valueLikert("c9", "performance", { en: "Once the goal is reached, I move on rather than look for what could still be improved.", fr: "Une fois l’objectif atteint, je passe à la suite plutôt que de chercher ce qui pourrait encore être amélioré." }, true),
  valueLikert("c12", "communication", { en: "I prefer to hold information back until it is complete and validated.", fr: "Je préfère garder une information tant qu’elle n’est pas complète et validée." }, true),
  valueLikert("c15", "collaboration", { en: "I work best when I can move forward on my scope without depending on others.", fr: "Je travaille mieux quand je peux avancer sur mon périmètre sans dépendre des autres." }, true),
  valueLikert("c18", "pragmatism", { en: "I find it hard to hand over work that is not polished, even when time is short.", fr: "J’ai du mal à livrer un travail qui n’est pas peaufiné, même quand le temps presse." }, true),
  valueLikert("c21", "integrity", { en: "I sometimes let a small ambiguity stand when clarifying it would create tension.", fr: "Il m’arrive de laisser passer une petite ambiguïté quand la clarifier créerait des tensions." }, true),
];

/**
 * Interleave facet and value items (f, c, f, c, …) so same-construct items
 * sit far apart and value items are not presented as a separate block.
 * Deterministic: every respondent sees the same order.
 */
function interleave(a: LikertItem[], b: LikertItem[]): LikertItem[] {
  const out: LikertItem[] = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

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
      en: "For each pair, choose the statement that describes you best at work, most of the time. Some pairs describe strengths, others describe tendencies under pressure — in both cases there is no better answer, only a more accurate one.",
      fr: "Pour chaque paire, choisissez l’affirmation qui vous décrit le mieux au travail, la plupart du temps. Certaines paires décrivent des forces, d’autres des tendances sous pression — dans les deux cas il n’y a pas de meilleure réponse, seulement une réponse plus juste.",
    },
    items: buildPairs(),
  },
  {
    id: "workstyle",
    title: { en: "How you work", fr: "Votre façon de travailler" },
    intro: {
      en: "Indicate how well each statement describes you, from 1 (not at all) to 5 (exactly). Statements deliberately pull in opposite directions — there are no right answers, so respond spontaneously rather than consistently.",
      fr: "Indiquez à quel point chaque affirmation vous décrit, de 1 (pas du tout) à 5 (exactement). Les affirmations tirent volontairement dans des directions opposées — il n’y a pas de bonnes réponses, répondez donc spontanément plutôt que par cohérence.",
    },
    items: interleave(FACET_ITEMS, CULTURE_ITEMS),
  },
];

export const ALL_ITEMS: Item[] = SECTIONS.flatMap((s) => s.items);
export const TOTAL_ITEMS = ALL_ITEMS.length;
