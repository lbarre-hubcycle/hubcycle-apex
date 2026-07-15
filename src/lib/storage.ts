import { promises as fs } from "fs";
import path from "path";
import type { Db } from "./types";

/**
 * Pluggable storage.
 * 1. Vercel KV / Upstash Redis via REST when env vars are present
 *    (KV_REST_API_URL + KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 * 2. Local JSON file in development (survives restarts).
 * 3. In-memory fallback (demo mode — data is lost on redeploy; the admin UI
 *    shows a warning when this mode is active on Vercel).
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

export function storageMode(): "kv" | "file" | "memory" {
  if (kvConfig()) return "kv";
  if (useFile) return "file";
  return "memory";
}

export async function loadDb(): Promise<Db> {
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
