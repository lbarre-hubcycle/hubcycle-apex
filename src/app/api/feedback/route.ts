import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";
import { VALUES } from "@/lib/culture";
import { FRAMEWORK_MAP } from "@/data/competency-framework";
import type { FeedbackItem, FeedbackType, FeedbackVisibility } from "@/lib/types";

const TYPES: FeedbackType[] = ["praise", "constructive"];
const VISIBILITIES: FeedbackVisibility[] = ["all", "recipient", "recipient-manager"];
const VALUE_IDS = new Set(VALUES.map((v) => v.id as string));

/** Give instant feedback. Employees, managers and HR — not recruiters. */
export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (viewer.role === "recruiter") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    toPersonId?: string;
    type?: FeedbackType;
    message?: string;
    tags?: string[];
    visibility?: FeedbackVisibility;
  };
  const message = body.message?.trim();
  if (!body.toPersonId || !body.type || !TYPES.includes(body.type)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "message" }, { status: 400 });
  }
  const visibility =
    body.visibility && VISIBILITIES.includes(body.visibility) ? body.visibility : "recipient";
  const validTag = (tag: string) =>
    body.type === "praise" ? VALUE_IDS.has(tag) : Boolean(FRAMEWORK_MAP[tag]);
  const tags = (body.tags ?? []).filter(validTag).slice(0, 6);

  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.toPersonId && p.kind === "employee");
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (viewer.personId && viewer.personId === person.id) {
    return NextResponse.json({ error: "self" }, { status: 400 });
  }

  const item: FeedbackItem = {
    id: newId(),
    fromId: viewer.personId ?? "hr-admin",
    fromName: viewer.name ?? "RH Hubcycle",
    type: body.type,
    tags,
    message,
    visibility,
    createdAt: new Date().toISOString(),
  };
  person.feedback = [...(person.feedback ?? []), item];
  await saveDb(db);
  return NextResponse.json({ item });
}

/** Remove an item — its author or HR only. */
export async function DELETE(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId");
  const feedbackId = searchParams.get("feedbackId");
  if (!personId || !feedbackId) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const db = await loadDb();
  const person = db.people.find((p) => p.id === personId);
  const item = person?.feedback?.find((f) => f.id === feedbackId);
  if (!person || !item) return NextResponse.json({ error: "not found" }, { status: 404 });
  const allowed = viewer.role === "hr" || (viewer.personId && viewer.personId === item.fromId);
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  person.feedback = person.feedback!.filter((f) => f.id !== feedbackId);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
