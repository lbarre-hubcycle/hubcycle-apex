import { NextResponse } from "next/server";
import { ROLE_MAP } from "@/data/roles";
import { computeResults, isComplete } from "@/lib/scoring";
import { loadDb, saveDb } from "@/lib/storage";
import type { Answers, Lang } from "@/lib/types";

type Params = { params: Promise<{ token: string }> };

/**
 * Assessment-taker endpoints. Authenticated by the private invitation token
 * only; expose the minimum needed to take the test (never results — the full
 * report is admin-only).
 */
export async function GET(_req: Request, { params }: Params) {
  const { token } = await params;
  const db = await loadDb();
  const person = db.people.find((p) => p.token === token);
  if (!person) return NextResponse.json({ error: "invalid" }, { status: 404 });
  return NextResponse.json({
    name: person.name,
    completed: Boolean(person.completedAt),
  });
}

export async function POST(req: Request, { params }: Params) {
  const { token } = await params;
  const body = (await req.json()) as { answers?: Answers; language?: Lang };
  const db = await loadDb();
  const person = db.people.find((p) => p.token === token);
  if (!person) return NextResponse.json({ error: "invalid" }, { status: 404 });
  if (person.completedAt) return NextResponse.json({ error: "already completed" }, { status: 409 });
  if (!body.answers || !isComplete(body.answers)) {
    return NextResponse.json({ error: "incomplete answers" }, { status: 400 });
  }

  const role = person.roleId ? ROLE_MAP[person.roleId] : undefined;
  person.answers = body.answers;
  person.language = body.language === "fr" ? "fr" : "en";
  person.results = computeResults(body.answers, role);
  person.completedAt = new Date().toISOString();
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
