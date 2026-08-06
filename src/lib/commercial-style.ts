import { ROLE_EXPECTATIONS_MAP } from "@/data/competency-framework";
import type { Results } from "./types";

/**
 * Commercial style read: hunting (new-business drive, B1) vs farming
 * (account development, B2). Computed from assessment dimensions that
 * proxy each style — declared preferences, to explore in interview.
 */

export type CommercialStyle = "hunter" | "balanced" | "farmer";
export type CommercialNeed = "hunting" | "farming" | "both";

export interface CommercialRead {
  hunter: number; // 0–100
  farmer: number; // 0–100
  delta: number; // hunter - farmer
  style: CommercialStyle;
}

export function commercialStyleOf(results: Results): CommercialRead {
  const f = results.facetScores;
  const p = results.profileScores;
  // Hunting: comfort influencing and converting strangers, fast pace, initiative.
  const hunter = Math.round(
    0.35 * f.influence + 0.25 * p.driver + 0.2 * f.pace + 0.2 * f.autonomy
  );
  // Farming: service orientation, relationship coaching, consistency, steadiness.
  const farmer = Math.round(
    0.35 * f.service + 0.25 * p["race-engineer"] + 0.2 * p["chief-mechanic"] + 0.2 * f.resilience
  );
  const delta = hunter - farmer;
  const style: CommercialStyle = delta >= 15 ? "hunter" : delta <= -15 ? "farmer" : "balanced";
  return { hunter, farmer, delta, style };
}

/** What the role's competency expectations emphasize (B1 = hunting, B2 = farming). */
export function roleCommercialNeed(roleId?: string): CommercialNeed | null {
  if (!roleId) return null;
  const exp = ROLE_EXPECTATIONS_MAP[roleId];
  if (!exp) return null;
  const hunts = exp.competencies.includes("B1");
  const farms = exp.competencies.includes("B2");
  if (hunts && farms) return "both";
  if (hunts) return "hunting";
  if (farms) return "farming";
  return null;
}

/** Alignment verdict between what the role needs and the candidate's style. */
export function commercialFit(
  need: CommercialNeed,
  read: CommercialRead
): "match" | "partial" | "gap" {
  if (need === "both") return read.style === "balanced" ? "match" : "partial";
  if (need === "hunting") {
    return read.style === "hunter" ? "match" : read.style === "balanced" ? "partial" : "gap";
  }
  return read.style === "farmer" ? "match" : read.style === "balanced" ? "partial" : "gap";
}
