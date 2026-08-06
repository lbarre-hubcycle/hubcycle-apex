import { createHash } from "crypto";
import { cookies } from "next/headers";
import { auth, ssoConfigured } from "@/auth-config";
import { loadDb } from "./storage";
import type { Db, Person } from "./types";

/**
 * Access control.
 * - Primary path: Google SSO restricted to the Hubcycle domain (auth-config.ts).
 *   Roles: hr (full access), manager (own reports & teams), recruiter
 *   (candidates only), employee (own data only).
 * - Break-glass path: the legacy ADMIN_ACCESS_CODE cookie grants the hr role
 *   (kept so the platform stays reachable if SSO is misconfigured).
 * - Candidates never log in: they use their private invitation token.
 */

export type ViewerRole = "hr" | "manager" | "recruiter" | "employee";

export interface Viewer {
  role: ViewerRole;
  email?: string;
  name?: string;
  /** The Person record matching the viewer's email, when one exists. */
  personId?: string;
  /** True when authenticated through the legacy access code. */
  legacy?: boolean;
  /** True when an HR admin is impersonating this person ("view as"). */
  viewingAs?: boolean;
  /** The real admin's display name while impersonating. */
  realName?: string;
}

const COOKIE = "apex_session";
const VIEW_AS_COOKIE = "apex_viewas";

export function accessCode(): string {
  return process.env.ADMIN_ACCESS_CODE || "apex-hubcycle-2026";
}

export function sessionValue(): string {
  return createHash("sha256").update(`apex:${accessCode()}`).digest("hex");
}

async function legacyAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === sessionValue();
}

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "lbarre@hubcycled.com")
    .toLowerCase()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** The authenticated identity, ignoring any "view as" impersonation. */
export async function getRealViewer(): Promise<Viewer | null> {
  const session = await auth().catch(() => null);
  const email = session?.user?.email?.toLowerCase();
  if (email) {
    const db = await loadDb();
    const person = db.people.find((p) => p.email?.toLowerCase() === email);
    let role: ViewerRole = person?.userRole ?? "employee";
    if (person && !person.userRole) {
      const manages = db.people.some(
        (p) => p.managerId === person.id || p.dottedManagerId === person.id
      );
      if (manages) role = "manager";
    }
    if (adminEmails().includes(email)) role = "hr";
    return {
      role,
      email,
      name: session?.user?.name ?? person?.name,
      personId: person?.id,
    };
  }
  if (await legacyAdmin()) return { role: "hr", legacy: true };
  return null;
}

/**
 * Resolve the current viewer. When an HR admin has a "view as" cookie set,
 * the effective viewer becomes that employee (with the role they would
 * naturally have — never hr), so the admin can test the platform exactly as
 * that person sees it. Impersonation only ever narrows rights.
 */
export async function getViewer(): Promise<Viewer | null> {
  const real = await getRealViewer();
  if (!real || real.role !== "hr") return real;
  const store = await cookies();
  const viewAs = store.get(VIEW_AS_COOKIE)?.value;
  if (!viewAs) return real;
  const db = await loadDb();
  const person = db.people.find((p) => p.id === viewAs && p.kind === "employee");
  if (!person) return real;
  let role: ViewerRole = person.userRole === "hr" ? "employee" : (person.userRole ?? "employee");
  if (!person.userRole) {
    const manages = db.people.some(
      (p) => p.managerId === person.id || p.dottedManagerId === person.id
    );
    if (manages) role = "manager";
  }
  return {
    role,
    email: person.email,
    name: person.name,
    personId: person.id,
    viewingAs: true,
    realName: real.name ?? real.email ?? "Admin",
  };
}

/** Start impersonating an employee (caller must already be verified as HR). */
export async function setViewAs(personId: string): Promise<void> {
  const store = await cookies();
  store.set(VIEW_AS_COOKIE, personId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4, // auto-expires after 4h, in case exit is forgotten
    path: "/",
  });
}

export async function clearViewAs(): Promise<void> {
  const store = await cookies();
  store.delete(VIEW_AS_COOKIE);
}

/** Back-compat guard used by write APIs: true only for the hr role. */
export async function isAdmin(): Promise<boolean> {
  const viewer = await getViewer();
  return viewer?.role === "hr";
}

export async function login(code: string): Promise<boolean> {
  if (code !== accessCode()) return false;
  const store = await cookies();
  store.set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export { ssoConfigured };

/** Ids of the people who report to this person (direct or dotted line). */
function reportIds(db: Db, personId: string): Set<string> {
  return new Set(
    db.people
      .filter((p) => p.managerId === personId || p.dottedManagerId === personId)
      .map((p) => p.id)
  );
}

/**
 * Role-based data visibility, enforced server-side:
 * - hr: everyone.
 * - recruiter: candidates only.
 * - manager: themselves, their reports (direct + dotted), and candidates
 *   attached to a team one of their reports (or they themselves) belong to.
 * - employee: themselves only.
 */
export function visiblePeople(db: Db, viewer: Viewer): Person[] {
  if (viewer.role === "hr") return db.people;
  if (viewer.role === "recruiter") return db.people.filter((p) => p.kind === "candidate");
  if (!viewer.personId) return [];
  const selfId = viewer.personId;
  if (viewer.role === "employee") return db.people.filter((p) => p.id === selfId);

  // manager
  const reports = reportIds(db, selfId);
  const circle = new Set([selfId, ...reports]);
  const teamIds = new Set(
    db.people
      .filter((p) => circle.has(p.id))
      .flatMap((p) => [p.teamId, p.functionalTeamId])
      .filter(Boolean) as string[]
  );
  return db.people.filter(
    (p) =>
      circle.has(p.id) ||
      (p.kind === "candidate" &&
        ((p.teamId && teamIds.has(p.teamId)) ||
          (p.functionalTeamId && teamIds.has(p.functionalTeamId))))
  );
}

/** Whether the viewer may open this person's full report. */
export function canViewPerson(db: Db, viewer: Viewer, person: Person): boolean {
  return visiblePeople(db, viewer).some((p) => p.id === person.id);
}
