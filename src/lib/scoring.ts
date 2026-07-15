import { COMPETENCIES } from "./competencies";
import { cultureBand } from "./culture";
import { SECTIONS } from "./questionnaire";
import type {
  Answers,
  CompetencyId,
  FacetId,
  ProfileId,
  Results,
  RoleDef,
  ValueId,
} from "./types";

const PROFILE_IDS: ProfileId[] = [
  "driver",
  "race-engineer",
  "strategist",
  "chief-mechanic",
  "pit-crew",
  "telemetry",
  "aerodynamicist",
  "team-principal",
];

const FACET_IDS: FacetId[] = [
  "pace",
  "structure",
  "autonomy",
  "detail",
  "influence",
  "resilience",
  "learning",
  "service",
];

const VALUE_IDS: ValueId[] = [
  "discernment",
  "boldness",
  "performance",
  "communication",
  "collaboration",
  "pragmatism",
  "integrity",
];

export function isComplete(answers: Answers): boolean {
  return SECTIONS.every((s) =>
    s.items.every((item) => {
      const a = answers[item.id];
      if (item.kind === "pair") return a === "a" || a === "b";
      return typeof a === "number" && a >= 1 && a <= 5;
    })
  );
}

/** Convert a 1–5 Likert mean to a 0–100 scale. */
const likertTo100 = (x: number) => Math.round(((x - 1) / 4) * 100);

export function computeResults(answers: Answers, role?: RoleDef): Results {
  // --- Profiles: count forced choices, normalized by how often each profile
  // actually appears in the pair plan (balanced by design, but computed here
  // so the questionnaire can evolve without touching the scoring).
  const chosen: Record<ProfileId, number> = Object.fromEntries(
    PROFILE_IDS.map((p) => [p, 0])
  ) as Record<ProfileId, number>;
  const appearances: Record<ProfileId, number> = Object.fromEntries(
    PROFILE_IDS.map((p) => [p, 0])
  ) as Record<ProfileId, number>;

  for (const section of SECTIONS) {
    for (const item of section.items) {
      if (item.kind !== "pair") continue;
      appearances[item.a.profile]++;
      appearances[item.b.profile]++;
      const a = answers[item.id];
      if (a === "a") chosen[item.a.profile]++;
      else if (a === "b") chosen[item.b.profile]++;
    }
  }

  const profileScores = Object.fromEntries(
    PROFILE_IDS.map((p) => [p, Math.round((chosen[p] / Math.max(appearances[p], 1)) * 100)])
  ) as Record<ProfileId, number>;

  const ranked = [...PROFILE_IDS].sort((a, b) => profileScores[b] - profileScores[a]);
  const primaryProfile = ranked[0];
  const secondaryProfile = ranked[1];

  // --- Facets: mean of Likert answers per facet → 0–100.
  const facetAcc: Record<FacetId, number[]> = Object.fromEntries(
    FACET_IDS.map((f) => [f, [] as number[]])
  ) as Record<FacetId, number[]>;

  // --- Values: mean of Likert answers per value → 1–5.
  const valueAcc: Record<ValueId, number[]> = Object.fromEntries(
    VALUE_IDS.map((v) => [v, [] as number[]])
  ) as Record<ValueId, number[]>;

  for (const section of SECTIONS) {
    for (const item of section.items) {
      if (item.kind !== "likert") continue;
      const raw = answers[item.id];
      if (typeof raw !== "number") continue;
      const val = item.reversed ? 6 - raw : raw;
      if (item.target.type === "facet") facetAcc[item.target.id].push(val);
      else valueAcc[item.target.id].push(val);
    }
  }

  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 3);

  const facetScores = Object.fromEntries(
    FACET_IDS.map((f) => [f, likertTo100(mean(facetAcc[f]))])
  ) as Record<FacetId, number>;

  const valueScores = Object.fromEntries(
    VALUE_IDS.map((v) => [v, Math.round(mean(valueAcc[v]) * 10) / 10])
  ) as Record<ValueId, number>;

  const cultureScore =
    Math.round((VALUE_IDS.reduce((s, v) => s + valueScores[v], 0) / VALUE_IDS.length) * 10) / 10;

  // --- Competencies: weighted mix of profile dims and facets (both 0–100).
  const dimValue = (key: ProfileId | FacetId): number =>
    (profileScores as Record<string, number>)[key] ??
    (facetScores as Record<string, number>)[key] ??
    0;

  const competencyScores = Object.fromEntries(
    COMPETENCIES.map((c) => {
      const score = Object.entries(c.weights).reduce(
        (sum, [key, w]) => sum + dimValue(key as ProfileId | FacetId) * (w as number),
        0
      );
      return [c.id, Math.round(score)];
    })
  ) as Record<CompetencyId, number>;

  const results: Results = {
    profileScores,
    primaryProfile,
    secondaryProfile,
    valueScores,
    cultureScore,
    cultureBand: cultureBand(cultureScore),
    facetScores,
    competencyScores,
  };

  if (role && role.successFactors.length > 0) {
    const factors = role.successFactors.map((sf) => ({
      label: sf.label,
      competency: sf.competency,
      rating: to5(competencyScores[sf.competency]),
    }));
    const overall =
      Math.round((factors.reduce((s, f) => s + f.rating, 0) / factors.length) * 10) / 10;
    results.roleMatch = { roleId: role.id, overall, factors };
  }

  return results;
}

/** Map a 0–100 competency score to a 1–5 adequacy rating (SOSIE-style). */
export function to5(score100: number): number {
  if (score100 >= 80) return 5;
  if (score100 >= 62) return 4;
  if (score100 >= 42) return 3;
  if (score100 >= 25) return 2;
  return 1;
}

export { PROFILE_IDS, FACET_IDS, VALUE_IDS };
