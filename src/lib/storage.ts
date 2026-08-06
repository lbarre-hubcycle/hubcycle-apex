import { promises as fs } from "fs";
import path from "path";
import { Prisma, type Person as PersonRow, type Team as TeamRow } from "@prisma/client";
import { getPrisma } from "./prisma";
import type {
  Answers,
  Db,
  FeedbackItem,
  Goal,
  Lang,
  OneOnOne,
  Person,
  PersonKind,
  Results,
  Team,
  UserRole,
} from "./types";

/**
 * Pluggable storage.
 * 1. Postgres via Prisma when DATABASE_URL is present (Neon in production).
 * 2. Vercel KV / Upstash Redis via REST when env vars are present
 *    (KV_REST_API_URL + KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 * 3. Local JSON file in development (survives restarts).
 * 4. In-memory fallback (demo mode — data is lost on redeploy; the admin UI
 *    shows a warning when this mode is active on Vercel).
 *
 * All backends expose the same whole-document loadDb/saveDb contract the app
 * is built on; the Postgres backend maps it onto Person/Team tables.
 */

const KEY = "apex-db-v1";
const EMPTY: Db = { people: [], teams: [] };

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };
  return null;
}

const FILE_PATH = path.join(process.cwd(), ".apex-data.json");
const useFile = !process.env.VERCEL && process.env.NODE_ENV !== "test";

const g = globalThis as unknown as { __apexDb?: Db };

export function storageMode(): "postgres" | "kv" | "file" | "memory" {
  if (process.env.DATABASE_URL) return "postgres";
  if (kvConfig()) return "kv";
  if (useFile) return "file";
  return "memory";
}

// --- Postgres row mapping -------------------------------------------------

function personFromRow(row: PersonRow): Person {
  return {
    id: row.id,
    token: row.token,
    kind: row.kind as PersonKind,
    name: row.name,
    email: row.email ?? undefined,
    roleId: row.roleId ?? undefined,
    teamId: row.teamId ?? undefined,
    functionalTeamId: row.functionalTeamId ?? undefined,
    managerId: row.managerId ?? undefined,
    dottedManagerId: row.dottedManagerId ?? undefined,
    userRole: (row.userRole ?? undefined) as UserRole | undefined,
    language: (row.language ?? undefined) as Lang | undefined,
    invitedAt: row.invitedAt,
    completedAt: row.completedAt ?? undefined,
    answers: row.answers === null ? undefined : (row.answers as Answers),
    results: row.results === null ? undefined : (row.results as unknown as Results),
    feedback: row.feedback === null ? undefined : (row.feedback as unknown as FeedbackItem[]),
    goals: row.goals === null ? undefined : (row.goals as unknown as Goal[]),
    oneOnOnes: row.oneOnOnes === null ? undefined : (row.oneOnOnes as unknown as OneOnOne[]),
  };
}

export function personToRow(p: Person) {
  return {
    id: p.id,
    token: p.token,
    kind: p.kind,
    name: p.name,
    email: p.email ?? null,
    roleId: p.roleId ?? null,
    teamId: p.teamId ?? null,
    functionalTeamId: p.functionalTeamId ?? null,
    managerId: p.managerId ?? null,
    dottedManagerId: p.dottedManagerId ?? null,
    userRole: p.userRole ?? null,
    language: p.language ?? null,
    invitedAt: p.invitedAt,
    completedAt: p.completedAt ?? null,
    answers: p.answers === undefined ? Prisma.DbNull : (p.answers as Prisma.InputJsonValue),
    results:
      p.results === undefined ? Prisma.DbNull : (p.results as unknown as Prisma.InputJsonValue),
    feedback:
      p.feedback === undefined ? Prisma.DbNull : (p.feedback as unknown as Prisma.InputJsonValue),
    goals: p.goals === undefined ? Prisma.DbNull : (p.goals as unknown as Prisma.InputJsonValue),
    oneOnOnes:
      p.oneOnOnes === undefined ? Prisma.DbNull : (p.oneOnOnes as unknown as Prisma.InputJsonValue),
  };
}

function teamFromRow(row: TeamRow): Team {
  return { id: row.id, name: row.name };
}

async function loadFromPostgres(): Promise<Db> {
  const prisma = getPrisma();
  const [people, teams] = await Promise.all([
    // invitedAt is ISO-8601, so lexicographic order == chronological order,
    // matching the insertion order the JSON-document backends preserved.
    prisma.person.findMany({ orderBy: { invitedAt: "asc" } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);
  // AppDoc may not exist until /api/admin/migrate has run — tolerate that.
  const okrs = await prisma.appDoc
    .findUnique({ where: { id: "okrs" } })
    .then((row) => (row ? (row.data as unknown as Db["okrs"]) : undefined))
    .catch(() => undefined);
  return { people: people.map(personFromRow), teams: teams.map(teamFromRow), okrs };
}

async function saveToPostgres(db: Db): Promise<void> {
  const prisma = getPrisma();
  const personIds = db.people.map((p) => p.id);
  const teamIds = db.teams.map((t) => t.id);
  // Full sync in one transaction: the app mutates a whole Db snapshot, so we
  // upsert every record and delete the ones no longer present.
  await prisma.$transaction([
    ...db.people.map((p) => {
      const row = personToRow(p);
      return prisma.person.upsert({ where: { id: p.id }, create: row, update: row });
    }),
    prisma.person.deleteMany({ where: { id: { notIn: personIds } } }),
    ...db.teams.map((t) =>
      prisma.team.upsert({ where: { id: t.id }, create: t, update: { name: t.name } })
    ),
    prisma.team.deleteMany({ where: { id: { notIn: teamIds } } }),
  ]);
  // Outside the transaction: AppDoc may not exist yet (pre-migrate deploys).
  if (db.okrs !== undefined) {
    const data = db.okrs as unknown as Prisma.InputJsonValue;
    await prisma.appDoc
      .upsert({ where: { id: "okrs" }, create: { id: "okrs", data }, update: { data } })
      .catch((err) => {
        console.error("AppDoc save failed (run /api/admin/migrate):", err?.message ?? err);
      });
  }
}

// --- Public API -----------------------------------------------------------

export async function loadDb(): Promise<Db> {
  if (process.env.DATABASE_URL) return loadFromPostgres();
  const kv = kvConfig();
  if (kv) {
    const res = await fetch(`${kv.url}/get/${KEY}`, {
      headers: { Authorization: `Bearer ${kv.token}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`KV read failed: ${res.status}`);
    const data = (await res.json()) as { result: string | null };
    return data.result ? (JSON.parse(data.result) as Db) : structuredClone(EMPTY);
  }
  if (useFile) {
    try {
      const raw = await fs.readFile(FILE_PATH, "utf8");
      return JSON.parse(raw) as Db;
    } catch {
      return structuredClone(EMPTY);
    }
  }
  if (!g.__apexDb) g.__apexDb = structuredClone(EMPTY);
  return g.__apexDb;
}

export async function saveDb(db: Db): Promise<void> {
  if (process.env.DATABASE_URL) return saveToPostgres(db);
  const kv = kvConfig();
  if (kv) {
    const res = await fetch(`${kv.url}/set/${KEY}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${kv.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(db),
    });
    if (!res.ok) throw new Error(`KV write failed: ${res.status}`);
    return;
  }
  if (useFile) {
    await fs.writeFile(FILE_PATH, JSON.stringify(db, null, 2), "utf8");
    return;
  }
  g.__apexDb = db;
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function newToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
