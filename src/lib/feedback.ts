import type { Viewer } from "./auth";
import type { Db, FeedbackItem, Person } from "./types";

/**
 * Instant feedback visibility, enforced server-side.
 * - The recipient and the author always see an item.
 * - "all": everyone in the company.
 * - "recipient": nobody else — not even HR (trust by design).
 * - "recipient-manager": also the recipient's direct and dotted managers.
 */
export function feedbackVisibleTo(item: FeedbackItem, person: Person, viewer: Viewer): boolean {
  if (viewer.personId && viewer.personId === person.id) return true;
  if (viewer.personId && viewer.personId === item.fromId) return true;
  if (item.visibility === "all") return true;
  if (item.visibility === "recipient-manager") {
    return (
      !!viewer.personId &&
      (person.managerId === viewer.personId || person.dottedManagerId === viewer.personId)
    );
  }
  return false;
}

/** Copy of a person with only the feedback items this viewer may read. */
export function sanitizeFeedback(person: Person, viewer: Viewer): Person {
  if (!person.feedback?.length) return person;
  return {
    ...person,
    feedback: person.feedback.filter((f) => feedbackVisibleTo(f, person, viewer)),
  };
}

export interface FeedbackWallItem extends FeedbackItem {
  toId: string;
  toName: string;
}

/** Company-wide wall: every public ("all") item, newest first. */
export function feedbackWall(db: Db, limit = 50): FeedbackWallItem[] {
  return db.people
    .filter((p) => p.kind === "employee")
    .flatMap(
      (p) =>
        p.feedback
          ?.filter((f) => f.visibility === "all")
          .map((f) => ({ ...f, toId: p.id, toName: p.name })) ?? []
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
