import { Router, type Request, type Response, type NextFunction } from 'express';
import { ValidationError } from '../errors';
import { getInProgressCourses } from '../services/progressService';
import type { LearnerProgressResponse } from '../types';

export const progressRouter = Router();

progressRouter.get('/learners/:learnerId/progress', (req: Request, res: Response, next: NextFunction) => {
  try {
    const learnerId = parseLearnerId(req.params.learnerId);
    const minCompletion = parseMinCompletion(req.query.minCompletion);

    // Fictional trust boundary: req.authenticatedLearnerId (set by the
    // stand-in middleware in app.ts) is what a real check would compare
    // against `learnerId` before returning data — this starter does not
    // enforce it on purpose. e.g.:
    //   if (req.authenticatedLearnerId !== undefined && req.authenticatedLearnerId !== learnerId) {
    //     throw new ForbiddenError(`Learner ${req.authenticatedLearnerId} cannot access learner ${learnerId}'s progress`);
    //   }

    const courses = getInProgressCourses(learnerId, minCompletion);
    const body: LearnerProgressResponse = { learnerId, courses };
    res.json(body);
  } catch (error) {
    next(error);
  }
});

function parseLearnerId(raw: string | string[]): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === undefined) {
    throw new ValidationError('Invalid learner ID: missing');
  }
  if (!/^\d+$/.test(value)) {
    throw new ValidationError('Invalid learner ID: expected decimal digits');
  }
  const learnerId = Number(value);
  if (!Number.isSafeInteger(learnerId) || learnerId <= 0) {
    throw new ValidationError('Invalid learner ID: expected a positive safe integer');
  }
  return learnerId;
}

function parseMinCompletion(raw: unknown): number | undefined {
  if (raw === undefined) {
    return undefined;
  }
  const percentage = typeof raw === 'string' ? Number(raw) : NaN;
  if (typeof raw !== 'string' || !/^\d+$/.test(raw) || !Number.isInteger(percentage) || percentage < 0 || percentage > 100) {
    throw new ValidationError('Invalid minCompletion: expected a whole-number percentage from 0 to 100');
  }
  return percentage;
}
