import { NextResponse } from "next/server";
import { getViewer, visiblePeople } from "@/lib/auth";
import { loadDb, storageMode } from "@/lib/storage";

/**
 * State scoped to the viewer's role: hr sees everything; managers their
 * reports, teams and attached candidates; recruiters the candidates;
 * employees only themselves.
 */
export async function GET() {
  const viewer = await getViewer();
  if (!viewer) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await loadDb();
  const people = visiblePeople(db, viewer);
  const teamIds = new Set(
    viewer.role === "hr"
      ? db.teams.map((t) => t.id)
      : (people.flatMap((p) => [p.teamId, p.functionalTeamId]).filter(Boolean) as string[])
  );
  return NextResponse.json({
    db: { people, teams: db.teams.filter((t) => teamIds.has(t.id)) },
    storageMode: storageMode(),
    viewer: {
      role: viewer.role,
      email: viewer.email,
      name: viewer.name,
      personId: viewer.personId,
      legacy: viewer.legacy ?? false,
    },
  });
}
