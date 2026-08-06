import { NextResponse } from "next/server";
import { canViewPerson, getViewer } from "@/lib/auth";
import { sanitizeFeedback } from "@/lib/feedback";
import { sanitizeOneOnOnes } from "@/lib/one-on-ones";
import { loadDb, saveDb } from "@/lib/storage";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = await loadDb();
  const person = db.people.find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canViewPerson(db, viewer, person)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({
    person: sanitizeOneOnOnes(sanitizeFeedback(person, viewer), viewer),
    teams: db.teams,
    // Teammates are needed for team-map context only — never expose their private data here.
    people: db.people.map((p) => ({ ...p, feedback: undefined, goals: undefined, oneOnOnes: undefined })),
  });
}

export async function PATCH(req: Request, { params }: Params) {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const patch = (await req.json()) as { name?: string; email?: string; roleId?: string; teamId?: string; functionalTeamId?: string; managerId?: string; dottedManagerId?: string; kind?: "candidate" | "employee"; userRole?: "hr" | "manager" | "recruiter" | "employee" | "" };
  const db = await loadDb();
  const person = db.people.find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (patch.name?.trim()) person.name = patch.name.trim();
  if ("email" in patch) person.email = patch.email?.trim().toLowerCase() || undefined;
  if ("userRole" in patch) person.userRole = patch.userRole || undefined;
  if ("roleId" in patch) person.roleId = patch.roleId || undefined;
  if ("teamId" in patch) person.teamId = patch.teamId || undefined;
  if ("functionalTeamId" in patch) person.functionalTeamId = patch.functionalTeamId || undefined;
  if ("managerId" in patch) person.managerId = patch.managerId || undefined;
  if ("dottedManagerId" in patch) person.dottedManagerId = patch.dottedManagerId || undefined;
  if (patch.kind) person.kind = patch.kind;
  await saveDb(db);
  return NextResponse.json({ person });
}

export async function DELETE(_req: Request, { params }: Params) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = await loadDb();
  const target = db.people.find((p) => p.id === id);
  const allowed =
    viewer.role === "hr" || (viewer.role === "recruiter" && target?.kind === "candidate");
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  db.people = db.people.filter((p) => p.id !== id);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
