import request from 'supertest';
import { createApp } from '../src/app';
import * as progressService from '../src/services/progressService';

describe('API error handling', () => {
  const app = createApp();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a readable 400 for malformed URL encoding', async () => {
    const res = await request(app).get('/api/learners/%E0%A4%A/progress');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid URL encoding' });
  });

  it('returns a readable 400 for malformed JSON', async () => {
    const res = await request(app)
      .get('/api/learners/1/progress')
      .set('Content-Type', 'application/json')
      .send('{');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid JSON body' });
  });

  it('keeps unexpected server syntax errors opaque with a 500 response', async () => {
    jest.spyOn(progressService, 'getInProgressCourses').mockImplementationOnce(() => {
      throw new SyntaxError('Internal implementation detail');
    });

    const res = await request(app).get('/api/learners/1/progress');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});
