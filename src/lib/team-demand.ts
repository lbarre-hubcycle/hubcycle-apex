import { ROLE_MAP } from "@/data/roles";
import { COMPETENCY_MAP } from "./competencies";
import { PROFILES } from "./profiles";
import type { L10n, Person, ProfileId } from "./types";

/**
 * Role-aware team demand: how much each contribution profile matters to a
 * given team, derived from its members' fiches de poste. Each role's top
 * success factors map to behavioural competencies, and each competency is a
 * weighted mix of profiles — summing those weights across the team's roles
 * yields a demand score per profile. A missing Chief Mechanic is critical in
 * a team whose roles hinge on reliability, and secondary in one that doesn't.
 */

export type DemandTier = "key" | "mid" | "low";

export interface DemandDriver {
  factor: L10n; // success-factor label that creates the demand
  role: L10n; // role title it comes from
  weight: number;
}

export interface TeamDemand {
  /** Demand per profile, normalized to 0..1 (relative to the strongest). */
  demand: Record<ProfileId, number>;
  /** Top success factors driving each profile's demand, for explanations. */
  drivers: Record<ProfileId, DemandDriver[]>;
  /** Role titles counted (with multiplicity), for context. */
  roles: L10n[];
}

export function demandTier(rel: number): DemandTier {
  if (rel >= 0.5) return "key";
  if (rel >= 0.2) return "mid";
  return "low";
}

/** Returns null when no member has a role attached (no basis for demand). */
export function teamDemand(members: Person[]): TeamDemand | null {
  const raw = Object.fromEntries(PROFILES.map((p) => [p.id, 0])) as Record<ProfileId, number>;
  const drivers = Object.fromEntries(PROFILES.map((p) => [p.id, [] as DemandDriver[]])) as Record<
    ProfileId,
    DemandDriver[]
  >;
  const roles: L10n[] = [];

  for (const m of members) {
    const role = m.roleId ? ROLE_MAP[m.roleId] : undefined;
    if (!role) continue;
    roles.push(role.title);
    for (const sf of role.successFactors) {
      const comp = COMPETENCY_MAP[sf.competency];
      for (const [key, w] of Object.entries(comp.weights)) {
        if (!(key in raw)) continue; // skip facet weights
        const pid = key as ProfileId;
        raw[pid] += w as number;
        drivers[pid].push({ factor: sf.label, role: role.title, weight: w as number });
      }
    }
  }

  if (roles.length === 0) return null;

  const max = Math.max(...Object.values(raw));
  if (max <= 0) return null;

  const demand = Object.fromEntries(
    PROFILES.map((p) => [p.id, Math.round((raw[p.id] / max) * 100) / 100])
  ) as Record<ProfileId, number>;

  // Keep the 2 strongest, distinct drivers per profile for explanations.
  for (const p of PROFILES) {
    const seen = new Set<string>();
    drivers[p.id] = drivers[p.id]
      .sort((a, b) => b.weight - a.weight)
      .filter((d) => {
        if (seen.has(d.factor.en)) return false;
        seen.add(d.factor.en);
        return true;
      })
      .slice(0, 2);
  }

  return { demand, drivers, roles };
}
