import { enrollments, knownLearnerIds } from '../data/seed';
import { NotFoundError } from '../errors';
import type { CourseEnrollment, CourseProgress } from '../types';

/** A course becomes stale after more than this many elapsed days without activity. */
export const STALE_DAYS = 30;

/**
 * Return in-progress courses for a learner, sorted by last activity (most recent first).
 * An optional minimum applies to the rounded completion percentage shown to the learner.
 * Unknown learners fail before filtering; known learners may have no matching courses.
 */
export function getInProgressCourses(
  learnerId: number,
  minCompletion = 0,
): CourseProgress[] {
  if (!knownLearnerIds.has(learnerId)) {
    throw new NotFoundError(`Learner ${learnerId} not found`);
  }

  const now = new Date();

  return enrollments
    .filter((enrollment) => enrollment.learnerId === learnerId && enrollment.status === 'in_progress')
    .map((enrollment) => toCourseProgress(enrollment, now))
    .filter((course) => course.completionPercentage >= minCompletion)
    .sort((a, b) => Date.parse(b.lastActivityAt) - Date.parse(a.lastActivityAt));
}

/** Lessons are equally weighted; a course with no lessons has zero completion. */
export function computeCompletionPercentage(enrollment: CourseEnrollment): number {
  if (enrollment.lessons.length === 0) {
    return 0;
  }
  const completed = enrollment.lessons.filter((lesson) => lesson.completed).length;
  return Math.round((completed / enrollment.lessons.length) * 100);
}

/** Exactly 30 days old is still fresh. Seed timestamps are valid ISO-8601 strings. */
export function isEnrollmentStale(lastActivityAt: string, now: Date = new Date()): boolean {
  const lastActivity = new Date(lastActivityAt);
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > STALE_DAYS;
}

/** A quick win has exactly one unfinished lesson; this does not imply a duration. */
export function isEnrollmentQuickWin(enrollment: CourseEnrollment): boolean {
  return enrollment.status === 'in_progress'
    && enrollment.lessons.filter((lesson) => !lesson.completed).length === 1;
}

/** Only in-progress enrollments reach this mapper after the service filters them. */
function toCourseProgress(enrollment: CourseEnrollment, now: Date): CourseProgress {
  return {
    courseId: enrollment.courseId,
    title: enrollment.title,
    completionPercentage: computeCompletionPercentage(enrollment),
    lastActivityAt: enrollment.lastActivityAt,
    status: 'in_progress',
    isStale: isEnrollmentStale(enrollment.lastActivityAt, now),
    isQuickWin: isEnrollmentQuickWin(enrollment),
  };
}
