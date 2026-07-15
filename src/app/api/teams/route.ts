import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { name } = (await req.json()) as { name?: string };
  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
  const db = await loadDb();
  const team = { id: newId(), name: name.trim() };
  db.teams.push(team);
  await saveDb(db);
  return NextResponse.json({ team });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = (await req.json()) as { id?: string };
  const db = await loadDb();
  db.teams = db.teams.filter((t) => t.id !== id);
  for (const p of db.people) if (p.teamId === id) p.teamId = undefined;
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
