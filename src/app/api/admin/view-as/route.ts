import { NextResponse } from "next/server";
import { clearViewAs, getRealViewer, setViewAs } from "@/lib/auth";
import { loadDb } from "@/lib/storage";

/**
 * "View as" impersonation. Gated on the REAL identity (not the effective
 * viewer), so an impersonating admin can always exit, and nobody below hr
 * can ever enter.
 */
export async function POST(req: Request) {
  const real = await getRealViewer();
  if (real?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { personId } = (await req.json()) as { personId?: string };
  if (!personId) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const db = await loadDb();
  const person = db.people.find((p) => p.id === personId && p.kind === "employee");
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  await setViewAs(person.id);
  return NextResponse.json({ ok: true, name: person.name });
}

export async function DELETE() {
  const real = await getRealViewer();
  if (real?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await clearViewAs();
  return NextResponse.json({ ok: true });
}
