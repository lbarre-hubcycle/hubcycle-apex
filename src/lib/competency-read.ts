import type { FacetId, L10n, ProfileId, Results, ValueId } from "./types";

/**
 * Style-based read of the 18 framework competencies (A1-C4).
 *
 * Each competency either has a weighted formula over assessment dimensions
 * (profiles 0-100, facets 0-100, Manifesto values 1-5 rescaled) — a proxy of
 * *declared style*, not proven mastery — or is flagged `interview: true`
 * when a questionnaire cannot honestly measure it (knowledge/track-record
 * competencies). Every competency names its OPPOSITE register, so a report
 * can say: "the role expects X; the candidate leans toward Y".
 */

type DimKey = ProfileId | FacetId | ValueId;

export interface CompetencyRead {
  /** Weighted formula (weights sum to 1). Absent when interview-only. */
  weights?: Partial<Record<DimKey, number>>;
  /** True when the assessment cannot measure it — evaluate in interview/CV. */
  interview?: boolean;
  /** The opposite register, named — used when the candidate leans away. */
  opposite: L10n;
  /** One suggested interview question (asked on gaps, always for interview-only). */
  question: L10n;
}

export const COMPETENCY_READS: Record<string, CompetencyRead> = {
  A1: {
    weights: { driver: 0.35, pace: 0.2, resilience: 0.2, performance: 0.25 },
    opposite: {
      en: "deliberation-first: prefers full certainty and external impulse before moving",
      fr: "délibération d’abord : préfère la certitude complète et l’impulsion externe avant d’avancer",
    },
    question: {
      en: "Tell me about a result you carried end-to-end despite obstacles — what did you personally do to land it?",
      fr: "Racontez-moi un résultat que vous avez porté de bout en bout malgré les obstacles — qu’avez-vous fait personnellement pour le faire aboutir ?",
    },
  },
  A2: {
    weights: { discernment: 0.35, pragmatism: 0.3, strategist: 0.2, telemetry: 0.15 },
    opposite: {
      en: "certainty-seeking: needs complete information or precedent before deciding",
      fr: "recherche de certitude : a besoin d’une information complète ou d’un précédent avant de décider",
    },
    question: {
      en: "Describe a decision you made with clearly incomplete information. How did you reason, and what happened?",
      fr: "Décrivez une décision prise avec une information clairement incomplète. Comment avez-vous raisonné, et qu’est-il arrivé ?",
    },
  },
  A3: {
    weights: { communication: 0.5, influence: 0.25, "race-engineer": 0.25 },
    opposite: {
      en: "dense or withheld communication: technical, long-form, or shared only when asked",
      fr: "communication dense ou retenue : technique, longue, ou partagée seulement sur demande",
    },
    question: {
      en: "Explain your current (or last) job's most complex topic to me in one minute, as if I were a new hire.",
      fr: "Expliquez-moi le sujet le plus complexe de votre poste actuel (ou dernier) en une minute, comme à une nouvelle recrue.",
    },
  },
  A4: {
    weights: { collaboration: 0.45, service: 0.3, "pit-crew": 0.25 },
    opposite: {
      en: "solo play: guards own lane, optimizes individual scoreboard",
      fr: "jeu individuel : garde son couloir, optimise son propre tableau de marque",
    },
    question: {
      en: "Tell me about a win that belonged to someone else but wouldn't have happened without you.",
      fr: "Racontez-moi une victoire qui appartenait à quelqu’un d’autre mais qui n’aurait pas eu lieu sans vous.",
    },
  },
  A5: {
    weights: { boldness: 0.35, learning: 0.35, "pit-crew": 0.3 },
    opposite: {
      en: "plan attachment: resists pivots, treats failure as a verdict rather than information",
      fr: "attachement au plan : résiste aux pivots, vit l’échec comme un verdict plutôt qu’une information",
    },
    question: {
      en: "Tell me about a time the context invalidated your plan. What did you keep, what did you drop, how fast?",
      fr: "Racontez-moi une fois où le contexte a invalidé votre plan. Qu’avez-vous gardé, abandonné, et en combien de temps ?",
    },
  },
  A6: {
    weights: { detail: 0.35, structure: 0.3, "chief-mechanic": 0.35 },
    opposite: {
      en: "improvisation: ships approximate work fast and fixes later",
      fr: "improvisation : livre vite un travail approximatif et corrige ensuite",
    },
    question: {
      en: "What do you systematically check before calling something done? Give me a real recent example.",
      fr: "Que vérifiez-vous systématiquement avant de considérer un travail terminé ? Donnez-moi un exemple récent et réel.",
    },
  },
  B1: {
    weights: { influence: 0.35, driver: 0.25, pace: 0.2, autonomy: 0.2 },
    opposite: {
      en: "farmer register: energized by growing existing relationships, drained by cold conquest",
      fr: "registre cultivateur : énergisé par le développement de relations existantes, épuisé par la conquête à froid",
    },
    question: {
      en: "Tell me about the last account you opened from scratch: your concrete approach, week by week, to signature.",
      fr: "Racontez-moi le dernier compte ouvert à partir de rien : votre démarche concrète, semaine par semaine, jusqu’à la signature.",
    },
  },
  B2: {
    weights: { service: 0.35, "race-engineer": 0.25, "chief-mechanic": 0.2, resilience: 0.2 },
    opposite: {
      en: "hunter register: energized by the chase, loses interest once the deal is signed",
      fr: "registre chasseur : énergisé par la conquête, se désintéresse une fois le deal signé",
    },
    question: {
      en: "How did you grow your most strategic account: what did you do, over what period, with what result?",
      fr: "Comment avez-vous fait grandir votre compte le plus stratégique : quoi, sur quelle durée, avec quel résultat ?",
    },
  },
  B3: {
    weights: { structure: 0.35, detail: 0.25, telemetry: 0.4 },
    opposite: {
      en: "instinct-driven selling: great moments, no machine — pipeline lives in their head",
      fr: "vente à l’instinct : de beaux coups, pas de machine — le pipeline vit dans sa tête",
    },
    question: {
      en: "Walk me through how you ran your pipeline last quarter: cadence, coverage, forecast vs actual.",
      fr: "Montrez-moi comment vous pilotiez votre pipeline au dernier trimestre : cadence, couverture, forecast vs réel.",
    },
  },
  B4: {
    weights: { service: 0.3, influence: 0.25, "chief-mechanic": 0.25, resilience: 0.2 },
    opposite: {
      en: "transactional register: optimizes each deal, under-invests in the relationship that survives it",
      fr: "registre transactionnel : optimise chaque deal, sous-investit la relation qui lui survit",
    },
    question: {
      en: "Tell me about a supplier/partner crisis you handled — and where that relationship stands today.",
      fr: "Racontez-moi une crise fournisseur/partenaire que vous avez gérée — et où en est cette relation aujourd’hui.",
    },
  },
  B5: {
    weights: { "chief-mechanic": 0.35, structure: 0.3, strategist: 0.2, detail: 0.15 },
    opposite: {
      en: "permanent firefighting: solves loudly today what a process would have prevented quietly",
      fr: "pompier permanent : résout bruyamment aujourd’hui ce qu’un processus aurait évité silencieusement",
    },
    question: {
      en: "Give me an example of a recurring problem you eliminated for good. What did you put in place?",
      fr: "Donnez-moi l’exemple d’un problème récurrent que vous avez éliminé pour de bon. Qu’avez-vous mis en place ?",
    },
  },
  B6: {
    weights: { telemetry: 0.4, detail: 0.3, strategist: 0.3 },
    opposite: {
      en: "narrative-first: convinces with stories, uncomfortable when challenged on the numbers",
      fr: "narratif d’abord : convainc par l’histoire, mal à l’aise quand on challenge les chiffres",
    },
    question: {
      en: "Take a business decision you influenced with analysis: model, assumptions, and what the numbers changed.",
      fr: "Prenez une décision business que vous avez influencée par l’analyse : modèle, hypothèses, et ce que les chiffres ont changé.",
    },
  },
  B7: {
    interview: true,
    opposite: {
      en: "knowledge competency — the questionnaire cannot read it",
      fr: "compétence de connaissance — le questionnaire ne peut pas la lire",
    },
    question: {
      en: "Case: a client requires a certification you don't have on a spec you know. Walk me through your 90 days.",
      fr: "Cas pratique : un client exige une certification que vous n’avez pas sur une spec que vous connaissez. Déroulez vos 90 jours.",
    },
  },
  B8: {
    weights: { aerodynamicist: 0.45, learning: 0.3, autonomy: 0.25 },
    opposite: {
      en: "optimizer of the existing: perfects what is, rarely questions whether it should exist",
      fr: "optimiseur de l’existant : perfectionne ce qui est, questionne rarement si cela devrait exister",
    },
    question: {
      en: "Tell me about something you built that didn't exist before. From what signal, and what shipped?",
      fr: "Racontez-moi une chose que vous avez créée qui n’existait pas. À partir de quel signal, et qu’est-ce qui a été livré ?",
    },
  },
  C1: {
    weights: { "team-principal": 0.35, "race-engineer": 0.3, service: 0.2, communication: 0.15 },
    opposite: {
      en: "expert-contributor register: leads by doing, drained by developing others",
      fr: "registre expert-contributeur : montre l’exemple en faisant, s’épuise à faire grandir les autres",
    },
    question: {
      en: "Who is the person you're proudest of having grown? What did you actually do, over what period?",
      fr: "Quelle est la personne que vous êtes le plus fier·ère d’avoir fait grandir ? Qu’avez-vous fait concrètement, sur quelle durée ?",
    },
  },
  C2: {
    weights: { strategist: 0.45, telemetry: 0.2, discernment: 0.35 },
    opposite: {
      en: "execution without a map: moves fast on what's in front, direction set by urgency",
      fr: "exécution sans carte : avance vite sur ce qui se présente, la direction fixée par l’urgence",
    },
    question: {
      en: "Show me a plan you built that survived contact with reality. What did you anticipate that others hadn't?",
      fr: "Montrez-moi un plan que vous avez construit et qui a résisté au réel. Qu’aviez-vous anticipé que d’autres n’avaient pas vu ?",
    },
  },
  C3: {
    weights: { influence: 0.4, "team-principal": 0.25, communication: 0.35 },
    opposite: {
      en: "silent expertise: right in the room, unheard beyond it",
      fr: "expertise silencieuse : a raison dans la pièce, inaudible au-delà",
    },
    question: {
      en: "Tell me about a decision you obtained from people you had no authority over. How?",
      fr: "Racontez-moi une décision que vous avez obtenue de personnes sur lesquelles vous n’aviez aucune autorité. Comment ?",
    },
  },
  C4: {
    weights: { integrity: 0.4, performance: 0.3, boldness: 0.3 },
    opposite: {
      en: "comfort conformity: values hold until they cost something",
      fr: "conformisme de confort : les valeurs tiennent jusqu’à ce qu’elles coûtent quelque chose",
    },
    question: {
      en: "Tell me about a time doing the right thing cost you something real. What did you choose?",
      fr: "Racontez-moi une fois où faire ce qui était juste vous a réellement coûté. Qu’avez-vous choisi ?",
    },
  },
};

const VALUE_IDS = new Set([
  "discernment",
  "boldness",
  "performance",
  "communication",
  "collaboration",
  "pragmatism",
  "integrity",
]);

function dimValue(results: Results, key: DimKey): number {
  if (VALUE_IDS.has(key)) {
    return ((results.valueScores[key as ValueId] - 1) / 4) * 100;
  }
  const p = (results.profileScores as Record<string, number>)[key];
  if (p !== undefined) return p;
  return (results.facetScores as Record<string, number>)[key] ?? 0;
}

/** Style score 0-100, or null for interview-only competencies. */
export function competencyStyleScore(results: Results, code: string): number | null {
  const read = COMPETENCY_READS[code];
  if (!read?.weights) return null;
  const score = Object.entries(read.weights).reduce(
    (sum, [key, w]) => sum + dimValue(results, key as DimKey) * (w as number),
    0
  );
  return Math.round(score);
}

export type ReadTier = "demonstrated" | "present" | "opposite";

export function readTier(score: number): ReadTier {
  if (score >= 62) return "demonstrated";
  if (score >= 42) return "present";
  return "opposite";
}
