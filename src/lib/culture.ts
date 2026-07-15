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
  },
  {
    id: "boldness",
    name: { en: "Boldness", fr: "Audace" },
    scope: { en: "As individuals", fr: "En tant qu’individus" },
    summary: {
      en: "Full engagement, challenging traditional ways of doing business, standing firm in our values, seeing failure as learning, pivoting fast.",
      fr: "Un engagement total, la remise en cause des façons de faire traditionnelles, la fermeté sur nos valeurs, l’échec vu comme un apprentissage, des pivots rapides.",
    },
  },
  {
    id: "performance",
    name: { en: "Dedication to performance", fr: "Exigence de performance" },
    scope: { en: "As individuals", fr: "En tant qu’individus" },
    summary: {
      en: "High expectations and high support: continuous improvement, autonomy with accountability, discipline and resilience.",
      fr: "Exigence élevée et soutien élevé : amélioration continue, autonomie avec responsabilité, discipline et résilience.",
    },
  },
  {
    id: "communication",
    name: { en: "Communication", fr: "Communication" },
    scope: { en: "As a collective", fr: "En tant que collectif" },
    summary: {
      en: "Clear and concise ideas, open knowledge sharing, constructive solution-oriented feedback, genuine listening.",
      fr: "Des idées claires et concises, un partage ouvert de la connaissance, un feedback constructif orienté solutions, une écoute réelle.",
    },
  },
  {
    id: "collaboration",
    name: { en: "Collaboration", fr: "Collaboration" },
    scope: { en: "As a collective", fr: "En tant que collectif" },
    summary: {
      en: "We win together: strong relationships across teams, trust-based discussions where the best ideas win, success seen as collective.",
      fr: "Nous gagnons ensemble : des relations solides entre équipes, des échanges fondés sur la confiance où les meilleures idées gagnent, un succès collectif.",
    },
  },
  {
    id: "pragmatism",
    name: { en: "Pragmatism", fr: "Pragmatisme" },
    scope: { en: "With the external world", fr: "Avec le monde extérieur" },
    summary: {
      en: "Simplifying complexity, the fastest effective path to results, data-driven with room for judgment, solutions over excuses.",
      fr: "Simplifier la complexité, le chemin le plus rapide et efficace vers le résultat, des décisions guidées par les données avec une place pour le jugement, des solutions plutôt que des excuses.",
    },
  },
  {
    id: "integrity",
    name: { en: "Integrity", fr: "Intégrité" },
    scope: { en: "With the external world", fr: "Avec le monde extérieur" },
    summary: {
      en: "Doing what's right even when no one is watching: transparency, owning mistakes, long-term trust over short-term gains.",
      fr: "Faire ce qui est juste même sans témoin : transparence, assumer ses erreurs, la confiance long terme plutôt que les gains court terme.",
    },
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
