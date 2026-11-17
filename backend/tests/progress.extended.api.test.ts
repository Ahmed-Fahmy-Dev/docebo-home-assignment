import request from 'supertest';
import { createApp } from '../src/app';
import type { CourseProgress } from '../src/types';

// Fixtures are isolated to this test module; production seed data stays unchanged.
jest.mock('../src/data/seed', () => {
  const actual = jest.requireActual<typeof import('../src/data/seed')>('../src/data/seed');
  return {
    ...actual,
    enrollments: [
      ...actual.enrollments,
      { ...actual.enrollments[0], learnerId: 3, courseId: 'completed-only', status: 'completed' },
    ],
    knownLearnerIds: new Set([...actual.knownLearnerIds, 3]),
  };
});

const app = createApp();

describe('minimum-completion filter', () => {
  it('preserves the unfiltered default when the threshold is omitted or zero', async () => {
    const unfiltered = await request(app).get('/api/learners/1/progress');
    const zero = await request(app).get('/api/learners/1/progress?minCompletion=0');

    expect(zero.status).toBe(200);
    expect(zero.body).toEqual(unfiltered.body);
    expect(zero.body.courses).toHaveLength(3);
  });

  it('includes courses exactly at the threshold and preserves last-activity ordering', async () => {
    const res = await request(app).get('/api/learners/1/progress?minCompletion=50');

    expect(res.status).toBe(200);
    expect(res.body.courses.map((course: CourseProgress) => course.courseId)).toEqual([
      'course-onboarding',
      'course-compliance',
    ]);
    expect(res.body.courses.map((course: CourseProgress) => course.completionPercentage)).toEqual([50, 50]);
  });

  it('compares against the rounded percentage presented to the learner', async () => {
    const at33 = await request(app).get('/api/learners/1/progress?minCompletion=33');
    const at34 = await request(app).get('/api/learners/1/progress?minCompletion=34');

    expect(at33.status).toBe(200);
    expect(at34.status).toBe(200);
    expect(at33.body.courses.map((course: CourseProgress) => course.courseId)).toContain('course-leadership');
    expect(at34.body.courses.map((course: CourseProgress) => course.courseId)).not.toContain('course-leadership');
  });

  it('returns an empty list when the valid threshold matches no courses', async () => {
    const res = await request(app).get('/api/learners/1/progress?minCompletion=100');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ learnerId: 1, courses: [] });
  });

  it.each([
    'minCompletion=101',
    'minCompletion=50&minCompletion=50',
  ])('rejects malformed or ambiguous query %s', async (query) => {
    const res = await request(app).get(`/api/learners/1/progress?${query}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid minCompletion/i);
  });
});

describe('progress response and empty states', () => {
  it('flags the course with one unfinished lesson as a quick win', async () => {
    const res = await request(app).get('/api/learners/1/progress');

    expect(res.status).toBe(200);
    expect(res.body.courses).toEqual([
      expect.objectContaining({ courseId: 'course-leadership', isQuickWin: false }),
      expect.objectContaining({ courseId: 'course-onboarding', isQuickWin: false }),
      expect.objectContaining({ courseId: 'course-compliance', isQuickWin: true }),
    ]);
  });

  it('returns 200 and an empty list for a known learner with no active courses', async () => {
    const res = await request(app).get('/api/learners/3/progress');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ learnerId: 3, courses: [] });
  });
});
