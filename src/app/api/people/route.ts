import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadDb, newId, newToken, saveDb } from "@/lib/storage";
import type { Person, PersonKind } from "@/lib/types";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    kind?: PersonKind;
    roleId?: string;
    teamId?: string;
  };
  if (!body.name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });

  const person: Person = {
    id: newId(),
    token: newToken(),
    kind: body.kind === "employee" ? "employee" : "candidate",
    name: body.name.trim(),
    email: body.email?.trim() || undefined,
    roleId: body.roleId || undefined,
    teamId: body.teamId || undefined,
    invitedAt: new Date().toISOString(),
  };

  const db = await loadDb();
  db.people.push(person);
  await saveDb(db);
  return NextResponse.json({ person });
}
