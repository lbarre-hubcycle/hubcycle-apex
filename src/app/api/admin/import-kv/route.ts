import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { personToRow } from "@/lib/storage";
import type { Db, Person } from "@/lib/types";

/**
 * One-shot production data migration: reads the legacy `apex-db-v1` JSON
 * document from Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN, with the
 * UPSTASH_* names as fallback) and imports it into Postgres.
 *
 * Idempotent: every record is upserted by id, and records that already exist
 * only in Postgres are left untouched — safe to run several times.
 */

const KEY = "apex-db-v1";

export async function POST() {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "postgres not configured (DATABASE_URL missing)" }, { status: 400 });
  }
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return NextResponse.json(
      { error: "kv not configured (KV_REST_API_URL / KV_REST_API_TOKEN missing)" },
      { status: 400 }
    );
  }

  const res = await fetch(`${url}/get/${KEY}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: `KV read failed: ${res.status}` }, { status: 502 });
  }
  const data = (await res.json()) as { result: string | null };
  if (!data.result) {
    return NextResponse.json({ ok: true, imported: { people: 0, teams: 0 }, note: "KV key empty" });
  }

  let kvDb: Db;
  try {
    kvDb = JSON.parse(data.result) as Db;
  } catch {
    return NextResponse.json({ error: "KV payload is not valid JSON" }, { status: 502 });
  }
  const people = (kvDb.people ?? []).filter((p): p is Person => Boolean(p?.id && p?.token && p?.name));
  const teams = (kvDb.teams ?? []).filter((t) => Boolean(t?.id && t?.name));

  const prisma = getPrisma();
  await prisma.$transaction([
    ...teams.map((t) =>
      prisma.team.upsert({ where: { id: t.id }, create: t, update: { name: t.name } })
    ),
    ...people.map((p) => {
      const row = personToRow({ ...p, invitedAt: p.invitedAt ?? new Date().toISOString() });
      return prisma.person.upsert({ where: { id: p.id }, create: row, update: row });
    }),
  ]);

  return NextResponse.json({
    ok: true,
    imported: { people: people.length, teams: teams.length },
    skipped: {
      people: (kvDb.people ?? []).length - people.length,
      teams: (kvDb.teams ?? []).length - teams.length,
    },
  });
}
