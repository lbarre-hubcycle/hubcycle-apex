import { NextResponse } from "next/server";
import { getViewer, visiblePeople } from "@/lib/auth";
import { feedbackWall, sanitizeFeedback } from "@/lib/feedback";
import { sanitizeOneOnOnes } from "@/lib/one-on-ones";
import { loadDb, storageMode } from "@/lib/storage";

/**
 * State scoped to the viewer's role: hr sees everything; managers their
 * reports, teams and attached candidates; recruiters the candidates;
 * employees only themselves. Feedback items are filtered per viewer, and
 * internal viewers also get a company directory (to address feedback) and
 * the public feedback wall.
 */
export async function GET() {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await loadDb();
  const people = visiblePeople(db, viewer).map((p) =>
    sanitizeOneOnOnes(sanitizeFeedback(p, viewer), viewer)
  );
  const teamIds = new Set(
    viewer.role === "hr"
      ? db.teams.map((t) => t.id)
      : (people.flatMap((p) => [p.teamId, p.functionalTeamId]).filter(Boolean) as string[])
  );
  const internal = viewer.role !== "recruiter";
  return NextResponse.json({
    db: { people, teams: db.teams.filter((t) => teamIds.has(t.id)) },
    storageMode: storageMode(),
    directory: internal
      ? db.people
          .filter((p) => p.kind === "employee")
          .map((p) => ({ id: p.id, name: p.name, roleId: p.roleId }))
      : [],
    wall: internal ? feedbackWall(db) : [],
    okrs: internal ? (db.okrs ?? []) : [],
    viewer: {
      role: viewer.role,
      email: viewer.email,
      name: viewer.name,
      personId: viewer.personId,
      legacy: viewer.legacy ?? false,
      viewingAs: viewer.viewingAs ?? false,
    },
  });
}
