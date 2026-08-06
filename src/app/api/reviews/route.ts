import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { isReviewManager } from "@/lib/reviews";
import { loadDb, newId, saveDb } from "@/lib/storage";
import { FRAMEWORK_MAP } from "@/data/competency-framework";
import { VALUES } from "@/lib/culture";
import type { PerformanceReview, ReviewStatus } from "@/lib/types";

/**
 * Performance reviews: created by HR or the person's manager; the employee
 * fills the self side, the reviewer the manager side; the reviewer shares,
 * the employee acknowledges. Field-level permissions enforced here.
 */

const VALUE_IDS = new Set(VALUES.map((v) => v.id as string));
const clampRating = (n: unknown) =>
  typeof n === "number" && n >= 1 && n <= 4 ? Math.round(n) : undefined;

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { personId?: string; cycle?: string };
  const cycle = body.cycle?.trim();
  if (!body.personId || !cycle || !/^\d{4}-(S[12]|Q[1-4]|annual)$/i.test(cycle)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId && p.kind === "employee");
  if (!person) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!isReviewManager(person, viewer)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (person.reviews?.some((r) => r.cycle === cycle)) {
    return NextResponse.json({ error: "cycle exists" }, { status: 400 });
  }
  const reviewer =
    (viewer.personId && viewer.personId !== person.id
      ? db.people.find((p) => p.id === viewer.personId)
      : undefined) ?? db.people.find((p) => p.id === person.managerId);
  const review: PerformanceReview = {
    id: newId(),
    cycle,
    reviewerId: reviewer?.id ?? "hr-admin",
    reviewerName: reviewer?.name ?? viewer.name ?? "RH Hubcycle",
    status: "self",
    competencies: {},
    values: {},
    createdAt: new Date().toISOString(),
  };
  person.reviews = [...(person.reviews ?? []), review];
  await saveDb(db);
  return NextResponse.json({ review });
}

export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as {
    personId?: string;
    reviewId?: string;
    rating?: {
      kind: "competency" | "value";
      key: string;
      side: "self" | "manager";
      rating?: number;
      note?: string;
    };
    objectivesComment?: { side: "self" | "manager"; text: string };
    summary?: { side: "self" | "manager"; text: string };
    overall?: number;
    transition?: "submit-self" | "share" | "done" | "reopen";
  };
  if (!body.personId || !body.reviewId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const db = await loadDb();
  const person = db.people.find((p) => p.id === body.personId);
  const review = person?.reviews?.find((r) => r.id === body.reviewId);
  if (!person || !review) return NextResponse.json({ error: "not found" }, { status: 404 });

  const isSelf = !!viewer.personId && viewer.personId === person.id;
  const isMgr = isReviewManager(person, viewer);
  if (!isSelf && !isMgr) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const locked = review.status === "done";

  const sideAllowed = (side: "self" | "manager") =>
    !locked && (side === "self" ? isSelf : isMgr);

  if (body.rating) {
    const { kind, key, side } = body.rating;
    const validKey = kind === "competency" ? Boolean(FRAMEWORK_MAP[key]) : VALUE_IDS.has(key);
    if (!validKey || !sideAllowed(side)) {
      return NextResponse.json({ error: "forbidden-rating" }, { status: 403 });
    }
    const bucket = kind === "competency" ? review.competencies : review.values;
    const entry = bucket[key] ?? {};
    if ("rating" in body.rating) entry[side] = clampRating(body.rating.rating);
    if (body.rating.note !== undefined) {
      const note = body.rating.note.trim().slice(0, 1000) || undefined;
      if (side === "self") entry.selfNote = note;
      else entry.managerNote = note;
    }
    bucket[key] = entry;
  }
  if (body.objectivesComment && sideAllowed(body.objectivesComment.side)) {
    review.objectivesComment = {
      ...review.objectivesComment,
      [body.objectivesComment.side]: body.objectivesComment.text.trim().slice(0, 3000) || undefined,
    };
  }
  if (body.summary && sideAllowed(body.summary.side)) {
    review.summary = {
      ...review.summary,
      [body.summary.side]: body.summary.text.trim().slice(0, 3000) || undefined,
    };
  }
  if (body.overall !== undefined && isMgr && !locked) {
    review.summary = { ...review.summary, overall: clampRating(body.overall) };
  }
  if (body.transition) {
    const moves: Record<string, { from: ReviewStatus[]; to: ReviewStatus; by: boolean }> = {
      "submit-self": { from: ["self"], to: "manager", by: isSelf },
      share: { from: ["self", "manager"], to: "shared", by: isMgr },
      done: { from: ["shared"], to: "done", by: isSelf },
      reopen: { from: ["manager", "shared"], to: "self", by: viewer.role === "hr" },
    };
    const move = moves[body.transition];
    if (!move?.by || !move.from.includes(review.status)) {
      return NextResponse.json({ error: "forbidden-transition" }, { status: 403 });
    }
    review.status = move.to;
    if (move.to === "shared") review.sharedAt = new Date().toISOString();
    if (move.to === "done") review.doneAt = new Date().toISOString();
  }

  await saveDb(db);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const personId = searchParams.get("personId");
  const reviewId = searchParams.get("reviewId");
  if (!personId || !reviewId) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const db = await loadDb();
  const person = db.people.find((p) => p.id === personId);
  if (!person?.reviews?.some((r) => r.id === reviewId)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  person.reviews = person.reviews.filter((r) => r.id !== reviewId);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
