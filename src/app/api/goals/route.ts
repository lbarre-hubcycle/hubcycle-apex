import { NextResponse } from "next/server";
import { getViewer, type Viewer } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";
import { FRAMEWORK_MAP } from "@/data/competency-framework";
import type { Commitment, CommitmentCadence, Goal, GoalKind, GoalStatus, Person } from "@/lib/types";

const KINDS: GoalKind[] = ["performance", "development"];
const STATUSES: GoalStatus[] = ["on-track", "at-risk", "done", "dropped"];
const CADENCES: CommitmentCadence[] = ["weekly", "monthly", "by-date"];

/** Validate and normalize 1–3 commitments, each with its own schedule. */
function parseCommitments(
  input: unknown
): Commitment[] | null {
  if (!Array.isArray(input)) return null;
  const cleaned = input
    .map((c) => {
      const text = typeof c?.text === "string" ? c.text.trim().slice(0, 500) : "";
      const cadence: CommitmentCadence = CADENCES.includes(c?.cadence) ? c.cadence : "weekly";
      const date = cadence === "by-date" && typeof c?.date === "string" && c.date ? c.date : undefined;
      return text ? { id: newId(), text, cadence, date } : null;
    })
    .filter(Boolean) as Commitment[];
  if (cleaned.length < 1 || cleaned.length > 3) return null;
  if (cleaned.some((c) => c.cadence === "by-date" && !c.date)) return null;
  return cleaned;
}

/** Goals are managed by the person themselves, their managers, or HR. */
function canManage(viewer: Viewer, person: Person): boolean {
  if (viewer.role === "hr") return true;
  if (!viewer.personId) return false;
  return (
    viewer.personId === person.id ||
    person.managerId === viewer.personId ||
    person.dottedManagerId === viewer.personId
  );
}

const clampProgress = (n: unknown) =>
  Math.min(100, Math.max(0, Math.round(typeof n === "number" ? n : 0)));

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    personId?: string;
    title?: string;
    description?: string;
    commitments?: unknown;
    kind?: GoalKind;
    competency?: string;
    targetDate?: string;
    okrId?: string;
  };
  const title = body.title?.trim();
  if (!body.personId || !title || title.length > 200 || !body.kind || !KINDS.includes(body.kind)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // "How I will get there" is mandatory: 1–3 commitments, each scheduled.
  const commitments = parseCommitments(body.commitments);
  if (!commitments) {
    return NextResponse.json({ error: "commitments" }, { status: 400 });
  }

  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId && p.kind === "employee");
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canManage(viewer, person)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // Optional alignment to a company OKR key result.
  const okrId =
    body.okrId &&
    db.okrs?.some((o) => o.id === body.okrId || o.keyResults.some((k) => k.id === body.okrId))
      ? body.okrId
      : undefined;

  const goal: Goal = {
    id: newId(),
    title,
    description: body.description?.trim().slice(0, 2000) || undefined,
    commitments,
    okrId,
    kind: body.kind,
    competency:
      body.kind === "development" && body.competency && FRAMEWORK_MAP[body.competency]
        ? body.competency
        : undefined,
    targetDate: body.targetDate || undefined,
    status: "on-track",
    progress: 0,
    checkins: [],
    createdAt: new Date().toISOString(),
    createdById: viewer.personId ?? "hr-admin",
    createdByName: viewer.name ?? "RH Hubcycle",
  };
  person.goals = [...(person.goals ?? []), goal];
  await saveDb(db);
  return NextResponse.json({ goal });
}

/** Check-in or edit. A check-in appends to the history; edits change the goal itself. */
export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    personId?: string;
    goalId?: string;
    checkin?: { status?: GoalStatus; progress?: number; note?: string };
    title?: string;
    description?: string;
    commitments?: unknown;
    competency?: string;
    targetDate?: string;
  };
  if (!body.personId || !body.goalId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId);
  const goal = person?.goals?.find((goalItem) => goalItem.id === body.goalId);
  if (!person || !goal) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canManage(viewer, person)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  if (body.checkin) {
    const status =
      body.checkin.status && STATUSES.includes(body.checkin.status)
        ? body.checkin.status
        : goal.status;
    const progress =
      body.checkin.progress === undefined ? goal.progress : clampProgress(body.checkin.progress);
    goal.status = status;
    goal.progress = status === "done" ? 100 : progress;
    goal.checkins = [
      ...goal.checkins,
      {
        date: new Date().toISOString(),
        status,
        progress: goal.progress,
        note: body.checkin.note?.trim().slice(0, 1000) || undefined,
      },
    ];
  }
  if (body.title?.trim()) goal.title = body.title.trim().slice(0, 200);
  if (body.commitments !== undefined) {
    const commitments = parseCommitments(body.commitments);
    if (!commitments) return NextResponse.json({ error: "commitments" }, { status: 400 });
    goal.commitments = commitments;
    goal.commitment = undefined;
    goal.cadence = undefined;
  }
  if ("description" in body) goal.description = body.description?.trim().slice(0, 2000) || undefined;
  if ("competency" in body && goal.kind === "development") {
    goal.competency = body.competency && FRAMEWORK_MAP[body.competency] ? body.competency : undefined;
  }
  if ("targetDate" in body) goal.targetDate = body.targetDate || undefined;

  await saveDb(db);
  return NextResponse.json({ goal });
}

export async function DELETE(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId");
  const goalId = searchParams.get("goalId");
  if (!personId || !goalId) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const db = await loadDb();
  const person = db.people.find((p) => p.id === personId);
  if (!person || !person.goals?.some((goalItem) => goalItem.id === goalId)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!canManage(viewer, person)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  person.goals = person.goals.filter((goalItem) => goalItem.id !== goalId);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
