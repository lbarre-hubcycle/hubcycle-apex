import type { CompetencyDef, CompetencyId, FacetDef } from "./types";

/** Work-style facets measured by Likert items (scored 0–100). */
export const FACETS: FacetDef[] = [
  { id: "pace", name: { en: "Speed of action", fr: "Vitesse d’action" } },
  { id: "structure", name: { en: "Structure & method", fr: "Structure et méthode" } },
  { id: "autonomy", name: { en: "Autonomy", fr: "Autonomie" } },
  { id: "detail", name: { en: "Attention to detail", fr: "Attention au détail" } },
  { id: "influence", name: { en: "Influence & conviction", fr: "Influence et conviction" } },
  { id: "resilience", name: { en: "Steadiness under pressure", fr: "Stabilité sous pression" } },
  { id: "learning", name: { en: "Curiosity & learning", fr: "Curiosité et apprentissage" } },
  { id: "service", name: { en: "Service orientation", fr: "Sens du service" } },
];

/**
 * Behavioural competency library. Each competency is a weighted combination
 * of contribution-profile dimensions and work-style facets (weights sum to 1).
 * Role success factors are rated 1–5 through these competencies.
 */
export const COMPETENCIES: CompetencyDef[] = [
  {
    id: "execution-ownership",
    name: { en: "Execution & ownership", fr: "Exécution et responsabilité" },
    weights: { driver: 0.5, pace: 0.25, resilience: 0.25 },
  },
  {
    id: "commercial-drive",
    name: { en: "Commercial drive & deal-making", fr: "Tempérament commercial et closing" },
    weights: { driver: 0.3, "team-principal": 0.2, influence: 0.5 },
  },
  {
    id: "analytical-rigor",
    name: { en: "Analytical rigor", fr: "Rigueur analytique" },
    weights: { telemetry: 0.5, detail: 0.3, strategist: 0.2 },
  },
  {
    id: "planning-organization",
    name: { en: "Planning & prioritization", fr: "Planification et priorisation" },
    weights: { strategist: 0.5, "chief-mechanic": 0.25, structure: 0.25 },
  },
  {
    id: "reliability-quality",
    name: { en: "Reliability & quality", fr: "Fiabilité et qualité" },
    weights: { "chief-mechanic": 0.5, detail: 0.25, structure: 0.25 },
  },
  {
    id: "adaptability",
    name: { en: "Adaptability & speed", fr: "Adaptabilité et rapidité" },
    weights: { "pit-crew": 0.5, pace: 0.25, learning: 0.25 },
  },
  {
    id: "collaboration-teamwork",
    name: { en: "Collaboration & teamwork", fr: "Collaboration et esprit d’équipe" },
    weights: { "pit-crew": 0.35, "race-engineer": 0.25, service: 0.4 },
  },
  {
    id: "leadership-alignment",
    name: { en: "Leadership & alignment", fr: "Leadership et alignement" },
    weights: { "team-principal": 0.5, influence: 0.35, resilience: 0.15 },
  },
  {
    id: "innovation-systems",
    name: { en: "Innovation & systems thinking", fr: "Innovation et pensée systémique" },
    weights: { aerodynamicist: 0.6, learning: 0.25, autonomy: 0.15 },
  },
  {
    id: "coaching-development",
    name: { en: "Coaching & developing others", fr: "Accompagnement et développement des autres" },
    weights: { "race-engineer": 0.5, service: 0.3, "team-principal": 0.2 },
  },
  {
    id: "autonomy-initiative",
    name: { en: "Autonomy & initiative", fr: "Autonomie et initiative" },
    weights: { autonomy: 0.5, driver: 0.25, resilience: 0.25 },
  },
  {
    id: "stakeholder-communication",
    name: { en: "Stakeholder communication", fr: "Communication avec les parties prenantes" },
    weights: { influence: 0.4, "race-engineer": 0.2, service: 0.2, "pit-crew": 0.2 },
  },
];

export const COMPETENCY_MAP: Record<CompetencyId, CompetencyDef> = Object.fromEntries(
  COMPETENCIES.map((c) => [c.id, c])
) as Record<CompetencyId, CompetencyDef>;
