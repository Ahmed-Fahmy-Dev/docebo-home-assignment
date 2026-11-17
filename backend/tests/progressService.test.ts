import {
  computeCompletionPercentage,
  getInProgressCourses,
  isEnrollmentQuickWin,
  isEnrollmentStale,
} from '../src/services/progressService';
import { enrollments } from '../src/data/seed';
import type { CourseEnrollment } from '../src/types';

function enrollmentWithLessons(completedLessons: boolean[]): CourseEnrollment {
  return {
    courseId: 'test-course',
    title: 'Test course',
    learnerId: 1,
    lessons: completedLessons.map((completed, index) => ({
      id: `lesson-${index}`,
      title: `Lesson ${index}`,
      completed,
    })),
    lastActivityAt: '2026-11-17T12:00:00.000Z',
    status: 'in_progress',
  };
}

describe('completion percentage', () => {
  it('returns zero for a course without lessons', () => {
    expect(computeCompletionPercentage(enrollmentWithLessons([]))).toBe(0);
  });

  it('rounds fractional completion to a whole percentage', () => {
    expect(computeCompletionPercentage(enrollmentWithLessons([true, true, false]))).toBe(67);
  });
});

describe('stale activity boundary', () => {
  const now = new Date('2026-11-17T12:00:00.000Z');

  it('becomes stale only after the exact 30-day boundary', () => {
    expect(isEnrollmentStale('2026-10-18T12:00:00.000Z', now)).toBe(false);
    expect(isEnrollmentStale('2026-10-18T11:59:59.999Z', now)).toBe(true);
  });
});

describe('quick wins', () => {
  it.each([
    { name: 'a single unfinished lesson with no completed lessons', lessons: [false], expected: true },
    { name: 'several unfinished lessons', lessons: [true, false, false], expected: false },
    { name: 'all lessons complete', lessons: [true, true], expected: false },
  ])('handles $name', ({ lessons, expected }) => {
    expect(isEnrollmentQuickWin(enrollmentWithLessons(lessons))).toBe(expected);
  });
});

describe('service data integrity', () => {
  it('preserves seed records and their ordering across filtered and unfiltered requests', () => {
    const before = structuredClone(enrollments);

    getInProgressCourses(1, 50);
    getInProgressCourses(2);
    getInProgressCourses(1);

    expect(enrollments).toEqual(before);
  });
});
