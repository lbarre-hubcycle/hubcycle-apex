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
  /** Narrative portrait: how this profile operates, where it thrives, what the team feels. */
  overview: L10n;
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
  /** Why a high score (> 3.5): what the answers indicate. */
  highWhy: L10n;
  /** Concrete attitudes typically observed when alignment is strong. */
  highExamples: L10n[];
  /** Why a low score (< 2.7): what the answers indicate. */
  lowWhy: L10n;
  /** Concrete attitudes that may show up — hypotheses to probe in interview. */
  lowExamples: L10n[];
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

/** Instant feedback (Leapsome-style). */
export type FeedbackType = "praise" | "constructive";

/**
 * Who may read a feedback item (the author always can):
 * - "all": everyone in the company
 * - "recipient": the employee only
 * - "recipient-manager": the employee and their manager(s)
 */
export type FeedbackVisibility = "all" | "recipient" | "recipient-manager";

export interface FeedbackItem {
  id: string;
  fromId: string;
  /** Denormalized so display survives author renames/departures. */
  fromName: string;
  type: FeedbackType;
  /** Manifesto value ids (praise) or framework competency codes (constructive). Optional. */
  tags: string[];
  message: string;
  visibility: FeedbackVisibility;
  createdAt: string;
}

/** Goals & commitments (Cockpit). */
export type GoalKind = "performance" | "development";
export type GoalStatus = "on-track" | "at-risk" | "done" | "dropped";

export interface GoalCheckin {
  date: string;
  status: GoalStatus;
  progress: number; // 0–100
  note?: string;
}

export type CommitmentCadence = "weekly" | "monthly" | "by-date";

/** One "how I will get there" commitment, with its own schedule. */
export interface Commitment {
  id: string;
  text: string;
  cadence: CommitmentCadence;
  /** Deadline, when cadence is "by-date". */
  date?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  /** 1–3 commitments describing how the person will get there. Required at creation. */
  commitments?: Commitment[];
  /** Legacy single commitment (pre-multi). Kept for old goals. */
  commitment?: string;
  /** Legacy cadence for the single commitment. */
  cadence?: CommitmentCadence;
  /** Future: the OKR this objective contributes to (set once OKRs exist). */
  okrId?: string;
  kind: GoalKind;
  /** Framework competency code, for development goals. */
  competency?: string;
  /** KPI this goal commits to, for performance goals (from the role referential or free text). */
  kpi?: string;
  targetDate?: string; // ISO date
  status: GoalStatus;
  progress: number; // 0–100
  checkins: GoalCheckin[];
  createdAt: string;
  createdById: string;
  createdByName: string;
}

/** 1-2-1 meetings (manager ↔ employee). Visible to the two participants only. */
export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  /** Person id of who owns the action (one of the two participants). */
  assigneeId?: string;
  /** Set when this action is an objective's commitment, seeded automatically. */
  goalId?: string;
  createdAt: string;
}

export interface OneOnOne {
  id: string;
  /** Meeting date (ISO date). */
  date: string;
  /** The other participant (a manager of the employee). */
  withId: string;
  withName: string;
  /** Notes shared between the two participants. */
  sharedNotes?: string;
  todos: TodoItem[];
  createdAt: string;
}

export type PersonKind = "candidate" | "employee";

/** Platform access role, assigned in the Admin panel (SSO users). */
export type UserRole = "hr" | "manager" | "recruiter" | "employee";

export interface Person {
  id: string;
  token: string; // secret link token for taking the assessment
  kind: PersonKind;
  name: string;
  email?: string;
  roleId?: string;
  /** Primary team (business line). */
  teamId?: string;
  /** Secondary team (functional), for people who belong to two teams. */
  functionalTeamId?: string;
  /** Employee id of this person's direct-line manager (assigned in the admin panel). */
  managerId?: string;
  /** Employee id of this person's dotted-line (functional) manager. */
  dottedManagerId?: string;
  /** Access role when this person signs in through SSO. Defaults to employee (or manager if others report to them). */
  userRole?: UserRole;
  language?: Lang;
  invitedAt: string;
  completedAt?: string;
  answers?: Answers;
  results?: Results;
  /** Instant feedback received (employees only). Visibility filtered server-side. */
  feedback?: FeedbackItem[];
  /** Goals & commitments (employees only). Visible to self, managers and HR. */
  goals?: Goal[];
  /** 1-2-1 meetings (employees only). Filtered server-side to participants. */
  oneOnOnes?: OneOnOne[];
}

export interface Team {
  id: string;
  name: string;
}

/**
 * OKR text fields: seeded content is bilingual (L10n); user-authored
 * content is a plain string shown as-is in both languages.
 */
export type OkrText = string | L10n;

/** OKRs — company objectives per period, each key result owned by a department. */
export interface KrCheckIn {
  date: string;
  value: number;
  note?: string;
  byName: string;
}

export interface KeyResult {
  id: string;
  /** Measurable outcome ("Billing YTD ≥ 10,5 M€"), never a task list. */
  title: OkrText;
  /** Department carrying it (free text: Supply, Finance, Sales…). */
  team?: string;
  /** Accountable person (free text name). */
  owner?: string;
  /** Budget line this KR moves (see src/data/budget.ts). */
  budgetTag?: string;
  /** The SWOT finding that justified this KR. */
  swot?: OkrText;
  start: number;
  target: number;
  current: number;
  unit?: string; // "M€", "%", "#", "j"…
  /** Closing verdict, set at quarter end: achieved, missed, or postponed. */
  outcome?: "achieved" | "missed" | "postponed";
  checkIns: KrCheckIn[];
}

export interface Okr {
  id: string;
  /** "2026-Q3", "2026-Q4", "2026" (annual). */
  period: string;
  /** Qualitative, memorable objective. */
  objective: OkrText;
  /** Why now — SWOT context. */
  description?: OkrText;
  keyResults: KeyResult[];
  createdAt: string;
}

export interface Db {
  people: Person[];
  teams: Team[];
  okrs?: Okr[];
}
