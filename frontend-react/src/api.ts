import type { CourseProgress } from './types';

// an optional defensive block to check the type safety of the API JSON response
const isCourseProgressShapeValid = (value: unknown): value is CourseProgress => {
  if (typeof value !== 'object' || value === null) return false;

  const { courseId, title, completionPercentage, lastActivityAt, status, isStale, isQuickWin } =
    value as Partial<CourseProgress>;

  return (
    typeof courseId === 'string' &&
    typeof title === 'string' &&
    typeof completionPercentage === 'number' &&
    Number.isFinite(completionPercentage) &&
    completionPercentage >= 0 &&
    completionPercentage <= 100 &&
    typeof lastActivityAt === 'string' &&
    Number.isFinite(Date.parse(lastActivityAt)) &&
    status === 'in_progress' &&
    typeof isStale === 'boolean' &&
    typeof isQuickWin === 'boolean'
  );
};

const fetchProgress = async (
  learnerId: number,
  minCompletion: number,
  signal: AbortSignal,
): Promise<CourseProgress[]> => {
  const response = await fetch(`/api/learners/${learnerId}/progress?minCompletion=${minCompletion}`, { signal });
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? 'This learner could not be found.'
        : 'We couldn’t load your progress. Please try again.',
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('We couldn’t read your progress. Please try again.');
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    !('learnerId' in data) ||
    data.learnerId !== learnerId ||
    !('courses' in data) ||
    !Array.isArray(data.courses) ||
    !data.courses.every(isCourseProgressShapeValid)
  ) {
    throw new Error('We couldn’t read your progress. Please try again.');
  }

  return data.courses;
};

export { fetchProgress };
