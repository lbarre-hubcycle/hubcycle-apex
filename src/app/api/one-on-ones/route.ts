import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { oneOnOneVisibleTo, validPair } from "@/lib/one-on-ones";
import { loadDb, newId, saveDb } from "@/lib/storage";
import type { OneOnOne } from "@/lib/types";

/**
 * 1-2-1 meetings. Created and edited only by their two participants
 * (the employee and one of their managers).
 */
export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer?.personId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { personId?: string; withId?: string; date?: string };
  if (!body.personId || !body.withId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId && p.kind === "employee");
  const partner = db.people.find((p) => p.id === body.withId);
  if (!person || !partner) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!validPair(person, partner.id)) {
    return NextResponse.json({ error: "not a manager of this person" }, { status: 400 });
  }
  const isParticipant = viewer.personId === person.id || viewer.personId === partner.id;
  if (!isParticipant) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  // Every active objective's commitment ("how I will get there") is seeded
  // as an action to review in the 1-2-1, assigned to the employee.
  const commitments = (person.goals ?? [])
    .filter((g) => (g.status === "on-track" || g.status === "at-risk") && g.commitment)
    .map((g) => ({
      id: newId(),
      text: g.commitment!,
      done: false,
      assigneeId: person.id,
      goalId: g.id,
      createdAt: new Date().toISOString(),
    }));

  const meeting: OneOnOne = {
    id: newId(),
    date: body.date || new Date().toISOString().slice(0, 10),
    withId: partner.id,
    withName: partner.name,
    todos: commitments,
    createdAt: new Date().toISOString(),
  };
  person.oneOnOnes = [...(person.oneOnOnes ?? []), meeting];
  await saveDb(db);
  return NextResponse.json({ meeting });
}

export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer?.personId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    personId?: string;
    meetingId?: string;
    sharedNotes?: string;
    date?: string;
    addTodo?: { text: string; assigneeId?: string };
    toggleTodo?: string;
    removeTodo?: string;
  };
  if (!body.personId || !body.meetingId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId);
  const meeting = person?.oneOnOnes?.find((m) => m.id === body.meetingId);
  if (!person || !meeting) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!oneOnOneVisibleTo(meeting, person, viewer)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if ("sharedNotes" in body) meeting.sharedNotes = body.sharedNotes?.slice(0, 10000) || undefined;
  if (body.date) meeting.date = body.date;
  const participants = [person.id, meeting.withId];
  if (body.addTodo?.text?.trim()) {
    meeting.todos = [
      ...meeting.todos,
      {
        id: newId(),
        text: body.addTodo.text.trim().slice(0, 500),
        done: false,
        assigneeId:
          body.addTodo.assigneeId && participants.includes(body.addTodo.assigneeId)
            ? body.addTodo.assigneeId
            : undefined,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  if (body.toggleTodo) {
    const todo = meeting.todos.find((t) => t.id === body.toggleTodo);
    if (todo) todo.done = !todo.done;
  }
  if (body.removeTodo) {
    meeting.todos = meeting.todos.filter((t) => t.id !== body.removeTodo);
  }

  await saveDb(db);
  return NextResponse.json({ meeting });
}

export async function DELETE(req: Request) {
  const viewer = await getViewer();
  if (!viewer?.personId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId");
  const meetingId = searchParams.get("meetingId");
  if (!personId || !meetingId) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const db = await loadDb();
  const person = db.people.find((p) => p.id === personId);
  const meeting = person?.oneOnOnes?.find((m) => m.id === meetingId);
  if (!person || !meeting) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!oneOnOneVisibleTo(meeting, person, viewer)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  person.oneOnOnes = person.oneOnOnes!.filter((m) => m.id !== meetingId);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
