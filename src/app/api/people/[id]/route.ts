import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadDb, saveDb } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = await loadDb();
  const person = db.people.find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ person, teams: db.teams, people: db.people });
}

export async function PATCH(req: Request, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const patch = (await req.json()) as { roleId?: string; teamId?: string; kind?: "candidate" | "employee" };
  const db = await loadDb();
  const person = db.people.find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if ("roleId" in patch) person.roleId = patch.roleId || undefined;
  if ("teamId" in patch) person.teamId = patch.teamId || undefined;
  if (patch.kind) person.kind = patch.kind;
  await saveDb(db);
  return NextResponse.json({ person });
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = await loadDb();
  db.people = db.people.filter((p) => p.id !== id);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
