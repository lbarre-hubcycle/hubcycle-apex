import type { Viewer } from "./auth";
import type { PerformanceReview, Person, ReviewRating } from "./types";

/**
 * Performance-review visibility:
 * - Reviewer, the person's managers and HR see everything at any stage.
 * - The employee sees their own review, but the manager's ratings, notes,
 *   summary and overall are stripped until the review is shared.
 * - Self-assessment stays visible to the manager only after the employee
 *   submits it (status leaves "self").
 */
export function isReviewManager(person: Person, viewer: Viewer): boolean {
  return (
    viewer.role === "hr" ||
    (!!viewer.personId &&
      (person.managerId === viewer.personId || person.dottedManagerId === viewer.personId))
  );
}

function stripManagerFields(review: PerformanceReview): PerformanceReview {
  const strip = (r: ReviewRating): ReviewRating => ({ self: r.self, selfNote: r.selfNote });
  return {
    ...review,
    competencies: Object.fromEntries(
      Object.entries(review.competencies).map(([k, r]) => [k, strip(r)])
    ),
    values: Object.fromEntries(Object.entries(review.values).map(([k, r]) => [k, strip(r)])),
    objectivesComment: { self: review.objectivesComment?.self },
    summary: { self: review.summary?.self },
  };
}

function stripSelfFields(review: PerformanceReview): PerformanceReview {
  const strip = (r: ReviewRating): ReviewRating => ({
    manager: r.manager,
    managerNote: r.managerNote,
  });
  return {
    ...review,
    competencies: Object.fromEntries(
      Object.entries(review.competencies).map(([k, r]) => [k, strip(r)])
    ),
    values: Object.fromEntries(Object.entries(review.values).map(([k, r]) => [k, strip(r)])),
    objectivesComment: { manager: review.objectivesComment?.manager },
    summary: { manager: review.summary?.manager, overall: review.summary?.overall },
  };
}

export function sanitizeReviews(person: Person, viewer: Viewer): Person {
  if (!person.reviews?.length) return person;
  const isSelf = !!viewer.personId && viewer.personId === person.id;
  const isMgr = isReviewManager(person, viewer);
  return {
    ...person,
    reviews: person.reviews
      .filter(() => isSelf || isMgr)
      .map((review) => {
        if (isSelf && !isMgr && review.status !== "shared" && review.status !== "done") {
          return stripManagerFields(review);
        }
        if (!isSelf && isMgr && review.status === "self") {
          return stripSelfFields(review);
        }
        return review;
      }),
  };
}
