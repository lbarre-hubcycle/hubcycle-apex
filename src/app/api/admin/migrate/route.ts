import { NextResponse } from "next/server";
import { getRealViewer } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { storageMode } from "@/lib/storage";

/**
 * One-click schema sync (HR only, real identity — works while impersonating).
 *
 * `prisma migrate deploy` times out (P1002) on the pooled Neon connection
 * used in production, so schema changes are applied here instead: through
 * the app's own Prisma client, which the pooler handles fine. Every
 * statement is idempotent (IF NOT EXISTS) — safe to run any number of
 * times. When a release adds a column, it is appended to this list and HR
 * opens /api/admin/migrate once after deploy.
 */
const STATEMENTS = [
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "feedback" JSONB',
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "goals" JSONB',
  'ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "oneOnOnes" JSONB',
  'CREATE TABLE IF NOT EXISTS "AppDoc" ("id" TEXT NOT NULL, "data" JSONB NOT NULL, CONSTRAINT "AppDoc_pkey" PRIMARY KEY ("id"))',
];

async function run() {
  const real = await getRealViewer();
  if (real?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (storageMode() !== "postgres") {
    return NextResponse.json({ ok: true, mode: storageMode(), note: "No Postgres — nothing to migrate." });
  }
  const prisma = getPrisma();
  const applied: string[] = [];
  for (const sql of STATEMENTS) {
    await prisma.$executeRawUnsafe(sql);
    applied.push(sql);
  }
  return NextResponse.json({ ok: true, applied });
}

export async function GET() {
  return run();
}

export async function POST() {
  return run();
}
