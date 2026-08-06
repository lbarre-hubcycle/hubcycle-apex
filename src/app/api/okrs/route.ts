import { NextResponse } from "next/server";
import { getViewer } from "@/lib/auth";
import { loadDb, newId, saveDb } from "@/lib/storage";
import { BUDGET_MAP } from "@/data/budget";
import type { KeyResult, Okr, OkrText } from "@/lib/types";

/** Seeded content is bilingual; user input is a plain string. */
function isOkrText(v: unknown): v is OkrText {
  return (
    typeof v === "string" ||
    (typeof v === "object" &&
      v !== null &&
      typeof (v as { en?: unknown }).en === "string" &&
      typeof (v as { fr?: unknown }).fr === "string")
  );
}

function cleanText(v: unknown, max: number): OkrText | undefined {
  if (typeof v === "string") return v.trim().slice(0, max) || undefined;
  if (isOkrText(v)) return v;
  return undefined;
}

/**
 * Company OKRs. HR shapes them (after the quarterly SWOT); HR and managers
 * check in on key results; everyone reads them (via /api/state).
 * Methodology guardrails enforced server-side: max 4 objectives per period,
 * max 5 key results per objective.
 */

const MAX_OBJECTIVES_PER_PERIOD = 4;
const MAX_KRS_PER_OBJECTIVE = 5;

function parseKr(input: Record<string, unknown>): Omit<KeyResult, "id" | "checkIns"> | null {
  const title = cleanText(input.title, 300);
  if (!title) return null;
  const num = (v: unknown, fallback = 0) => (typeof v === "number" && isFinite(v) ? v : fallback);
  return {
    title,
    team: typeof input.team === "string" ? input.team.trim().slice(0, 60) || undefined : undefined,
    owner: typeof input.owner === "string" ? input.owner.trim().slice(0, 60) || undefined : undefined,
    budgetTag:
      typeof input.budgetTag === "string" && BUDGET_MAP[input.budgetTag]
        ? input.budgetTag
        : undefined,
    swot: cleanText(input.swot, 500),
    start: num(input.start),
    target: num(input.target, 100),
    current: num(input.current, num(input.start)),
    unit: typeof input.unit === "string" ? input.unit.trim().slice(0, 10) || undefined : undefined,
  };
}

export async function POST(req: Request) {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await req.json()) as { period?: string; objective?: string; description?: string };
  const period = body.period?.trim();
  const objective = body.objective?.trim();
  if (!period || !/^\d{4}(-Q[1-4])?$/.test(period) || !objective || objective.length > 300) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const db = await loadDb();
  const okrs = db.okrs ?? [];
  if (okrs.filter((o) => o.period === period).length >= MAX_OBJECTIVES_PER_PERIOD) {
    return NextResponse.json({ error: "max-objectives" }, { status: 400 });
  }
  const okr: Okr = {
    id: newId(),
    period,
    objective,
    description: body.description?.trim().slice(0, 1000) || undefined,
    keyResults: [],
    createdAt: new Date().toISOString(),
  };
  db.okrs = [...okrs, okr];
  await saveDb(db);
  return NextResponse.json({ okr });
}

export async function PATCH(req: Request) {
  const viewer = await getViewer();
  if (!viewer || viewer.role === "recruiter" || viewer.role === "employee") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json()) as {
    okrId?: string;
    objective?: string;
    description?: string;
    addKr?: Record<string, unknown>;
    editKr?: { krId: string } & Record<string, unknown>;
    removeKrId?: string;
    checkIn?: { krId: string; value: number; note?: string };
    setOutcome?: { krId: string; outcome: "achieved" | "missed" | "postponed" | null };
  };
  if (!body.okrId) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const db = await loadDb();
  const okr = db.okrs?.find((o) => o.id === body.okrId);
  if (!okr) return NextResponse.json({ error: "not found" }, { status: 404 });

  const isHr = viewer.role === "hr";
  // Managers may only check in; structure changes are HR's.
  if (
    !isHr &&
    (body.objective || body.description || body.addKr || body.editKr || body.removeKrId || body.setOutcome)
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (isHr && body.objective?.trim()) okr.objective = body.objective.trim().slice(0, 300);
  if (isHr && "description" in body) {
    okr.description = body.description?.trim().slice(0, 1000) || undefined;
  }
  if (isHr && body.addKr) {
    if (okr.keyResults.length >= MAX_KRS_PER_OBJECTIVE) {
      return NextResponse.json({ error: "max-krs" }, { status: 400 });
    }
    const kr = parseKr(body.addKr);
    if (!kr) return NextResponse.json({ error: "invalid-kr" }, { status: 400 });
    okr.keyResults = [...okr.keyResults, { ...kr, id: newId(), checkIns: [] }];
  }
  if (isHr && body.editKr) {
    const existing = okr.keyResults.find((k) => k.id === body.editKr!.krId);
    const parsed = existing && parseKr({ ...existing, ...body.editKr });
    if (!existing || !parsed) return NextResponse.json({ error: "invalid-kr" }, { status: 400 });
    Object.assign(existing, parsed);
  }
  if (isHr && body.removeKrId) {
    okr.keyResults = okr.keyResults.filter((k) => k.id !== body.removeKrId);
  }
  if (isHr && body.setOutcome) {
    const kr = okr.keyResults.find((k) => k.id === body.setOutcome!.krId);
    const outcome = body.setOutcome.outcome;
    if (!kr || (outcome !== null && !["achieved", "missed", "postponed"].includes(outcome))) {
      return NextResponse.json({ error: "invalid-outcome" }, { status: 400 });
    }
    kr.outcome = outcome ?? undefined;
  }
  if (body.checkIn) {
    const kr = okr.keyResults.find((k) => k.id === body.checkIn!.krId);
    if (!kr || typeof body.checkIn.value !== "number" || !isFinite(body.checkIn.value)) {
      return NextResponse.json({ error: "invalid-checkin" }, { status: 400 });
    }
    kr.current = body.checkIn.value;
    kr.checkIns = [
      ...kr.checkIns,
      {
        date: new Date().toISOString(),
        value: body.checkIn.value,
        note: body.checkIn.note?.trim().slice(0, 500) || undefined,
        byName: viewer.name ?? viewer.email ?? "—",
      },
    ];
  }

  await saveDb(db);
  return NextResponse.json({ okr });
}

export async function DELETE(req: Request) {
  const viewer = await getViewer();
  if (viewer?.role !== "hr") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const okrId = searchParams.get("okrId");
  if (!okrId) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const db = await loadDb();
  if (!db.okrs?.some((o) => o.id === okrId)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  db.okrs = db.okrs.filter((o) => o.id !== okrId);
  await saveDb(db);
  return NextResponse.json({ ok: true });
}
