import type { Viewer } from "./auth";
import type { OneOnOne, Person } from "./types";

/**
 * 1-2-1 notes are private to the two participants: the employee and the
 * manager the meeting was held with. Nobody else — not even HR (they only
 * see their own 1-2-1s). Enforced server-side before any payload leaves.
 */
export function oneOnOneVisibleTo(meeting: OneOnOne, person: Person, viewer: Viewer): boolean {
  return (
    !!viewer.personId && (viewer.personId === person.id || viewer.personId === meeting.withId)
  );
}

/** Copy of a person with only the 1-2-1s this viewer participates in. */
export function sanitizeOneOnOnes(person: Person, viewer: Viewer): Person {
  if (!person.oneOnOnes?.length) return person;
  return {
    ...person,
    oneOnOnes: person.oneOnOnes.filter((m) => oneOnOneVisibleTo(m, person, viewer)),
  };
}

/** The pair must be (employee, one of their managers). */
export function validPair(person: Person, withId: string): boolean {
  return person.managerId === withId || person.dottedManagerId === withId;
}
