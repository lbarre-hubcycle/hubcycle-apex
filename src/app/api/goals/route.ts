import { NextResponse } from "next/server";
import { getViewer, type Viewer } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";
import { FRAMEWORK_MAP } from "@/data/competency-framework";
import type { CommitmentCadence, Goal, GoalKind, GoalStatus, Person } from "@/lib/types";

const KINDS: GoalKind[] = ["performance", "development"];
const STATUSES: GoalStatus[] = ["on-track", "at-risk", "done", "dropped"];
const CADENCES: CommitmentCadence[] = ["weekly", "monthly"];

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
    commitment?: string;
    cadence?: CommitmentCadence;
    kind?: GoalKind;
    competency?: string;
    kpi?: string;
    targetDate?: string;
  };
  const title = body.title?.trim();
  if (!body.personId || !title || title.length > 200 || !body.kind || !KINDS.includes(body.kind)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  // The "how I will get there" commitment is mandatory, with a cadence.
  const commitment = body.commitment?.trim();
  if (!commitment || commitment.length > 500) {
    return NextResponse.json({ error: "commitment" }, { status: 400 });
  }
  const cadence: CommitmentCadence =
    body.cadence && CADENCES.includes(body.cadence) ? body.cadence : "weekly";

  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId && p.kind === "employee");
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!canManage(viewer, person)) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const goal: Goal = {
    id: newId(),
    title,
    description: body.description?.trim().slice(0, 2000) || undefined,
    commitment,
    cadence,
    kind: body.kind,
    competency:
      body.kind === "development" && body.competency && FRAMEWORK_MAP[body.competency]
        ? body.competency
        : undefined,
    kpi: body.kind === "performance" ? body.kpi?.trim().slice(0, 300) || undefined : undefined,
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
    commitment?: string;
    cadence?: CommitmentCadence;
    kpi?: string;
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
  if (body.commitment?.trim()) goal.commitment = body.commitment.trim().slice(0, 500);
  if (body.cadence && CADENCES.includes(body.cadence)) goal.cadence = body.cadence;
  if ("description" in body) goal.description = body.description?.trim().slice(0, 2000) || undefined;
  if ("kpi" in body && goal.kind === "performance") goal.kpi = body.kpi?.trim() || undefined;
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
