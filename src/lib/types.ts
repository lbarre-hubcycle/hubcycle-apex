/** Bilingual string. Every user-facing piece of content exists in both languages. */
export type L10n = { en: string; fr: string };

export type Lang = "en" | "fr";

/** The 8 contribution profiles (F1 metaphor). Scored 0–100 each. */
export type ProfileId =
  | "driver"
  | "race-engineer"
  | "strategist"
  | "chief-mechanic"
  | "pit-crew"
  | "telemetry"
  | "aerodynamicist"
  | "team-principal";

/** The 7 Hubcycle Manifesto values. Scored 1–5 each. */
export type ValueId =
  | "discernment"
  | "boldness"
  | "performance"
  | "communication"
  | "collaboration"
  | "pragmatism"
  | "integrity";

/** Work-style facets measured with Likert items. Scored 0–100. */
export type FacetId =
  | "pace"
  | "structure"
  | "autonomy"
  | "detail"
  | "influence"
  | "resilience"
  | "learning"
  | "service";

/** Behavioural competencies used to rate role success factors. */
export type CompetencyId =
  | "execution-ownership"
  | "commercial-drive"
  | "analytical-rigor"
  | "planning-organization"
  | "reliability-quality"
  | "adaptability"
  | "collaboration-teamwork"
  | "leadership-alignment"
  | "innovation-systems"
  | "coaching-development"
  | "autonomy-initiative"
  | "stakeholder-communication";

export interface ProfileDef {
  id: ProfileId;
  emoji: string;
  name: L10n;
  /** Short label for charts (radar axes, distribution bars). */
  shortName: L10n;
  tagline: L10n;
  color: string; // brand accent used in charts
  strengths: L10n[];
  watchouts: L10n[];
  motivators: L10n[]; // top 3
  frustrations: L10n[]; // top 3
  coachTips: L10n[];
  teamContribution: L10n; // one-liner: what this profile brings to a team
  /** Team-map coordinates. x: 0 reflection → 1 action. y: 0 systems → 1 people. */
  mapX: number;
  mapY: number;
}

export interface ValueDef {
  id: ValueId;
  name: L10n;
  scope: L10n; // "As individuals" / "As a collective" / "With the external world"
  summary: L10n;
}

export interface FacetDef {
  id: FacetId;
  name: L10n;
}

export interface CompetencyDef {
  id: CompetencyId;
  name: L10n;
  /** Weighted formula over profile dimensions and facets (weights sum to 1). */
  weights: Partial<Record<ProfileId | FacetId, number>>;
}

export interface SuccessFactor {
  label: L10n;
  competency: CompetencyId;
}

export interface RoleDef {
  id: string;
  title: L10n;
  department: string | null;
  mission: L10n;
  /** Top success factors from the Notion fiche de poste. */
  successFactors: SuccessFactor[];
  /** True when the Notion fiche had no explicit success-factor section. */
  derived?: boolean;
}

/** Questionnaire item types */
export interface PairItem {
  kind: "pair";
  id: string;
  a: { profile: ProfileId; text: L10n };
  b: { profile: ProfileId; text: L10n };
}

export interface LikertItem {
  kind: "likert";
  id: string;
  target: { type: "value"; id: ValueId } | { type: "facet"; id: FacetId };
  text: L10n;
  /** When true the item is reverse-scored (6 - answer). */
  reversed?: boolean;
}

export type Item = PairItem | LikertItem;

/** Raw answers keyed by item id. Pair items: "a" | "b". Likert: 1–5. */
export type Answers = Record<string, "a" | "b" | number>;

export interface Results {
  profileScores: Record<ProfileId, number>; // 0–100
  primaryProfile: ProfileId;
  secondaryProfile: ProfileId;
  valueScores: Record<ValueId, number>; // 1–5
  cultureScore: number; // 1–5
  cultureBand: "super-fit" | "strong-fit" | "moderate-fit" | "stretch" | "misfit";
  facetScores: Record<FacetId, number>; // 0–100
  competencyScores: Record<CompetencyId, number>; // 0–100
  /** Only when the person is linked to a role. */
  roleMatch?: {
    roleId: string;
    overall: number; // 1–5
    factors: { label: L10n; competency: CompetencyId; rating: number }[];
  };
}

export type PersonKind = "candidate" | "employee";

export interface Person {
  id: string;
  token: string; // secret link token for taking the assessment
  kind: PersonKind;
  name: string;
  email?: string;
  roleId?: string;
  teamId?: string;
  language?: Lang;
  invitedAt: string;
  completedAt?: string;
  answers?: Answers;
  results?: Results;
}

export interface Team {
  id: string;
  name: string;
}

export interface Db {
  people: Person[];
  teams: Team[];
}
