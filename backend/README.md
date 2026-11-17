# Backend — Learner Progress API

Express + TypeScript API for the Learner Progress take-home. Lists in-progress courses with completion, recent activity, stale flags, a minimum-completion filter, and quick-win flags. Data stays in memory and requests do not modify the seed records.

## Quick start

```bash
cd backend
npm ci
npm test
npm run dev       # http://localhost:3001
```

To compile and run without the development watcher, use `npm run build` followed by `npm start`. The existing TypeScript configuration emits the entry point to `dist/src/index.js`.

## API

### `GET /health`

Returns `{ "status": "ok" }`.

### `GET /api/learners/:learnerId/progress`

Returns only in-progress courses for a known learner, sorted by last activity from newest to oldest. A known learner with no qualifying courses receives `200` with an empty `courses` array. An unknown learner receives `404`.

Learner IDs must consist of decimal digits representing a positive safe integer; leading zeros are accepted. Fractions, signs, hexadecimal/scientific notation, and values above `Number.MAX_SAFE_INTEGER` are rejected.

**Optional query parameter:**

| Parameter | Accepted values | Behavior |
| --- | --- | --- |
| `minCompletion` | A whole-number percentage from 0 to 100, inclusive | Include only courses whose displayed, rounded completion percentage is at least the threshold. |

Omitting the parameter or using `0` includes all in-progress courses. Empty values, fractions, repeated parameters, arrays, objects, and out-of-range values return `400`.

Examples:

```text
GET /api/learners/1/progress
GET /api/learners/1/progress?minCompletion=50
GET /api/learners/1/progress?minCompletion=100
```

The 50% filter returns Onboarding and Compliance, in that order. The 100% filter returns an empty list for learner 1.

**Success (200):**

```json
{
  "learnerId": 1,
  "courses": [
    {
      "courseId": "course-leadership",
      "title": "Leadership Essentials",
      "completionPercentage": 33,
      "lastActivityAt": "2026-08-22T09:15:00.000Z",
      "status": "in_progress",
      "isStale": false,
      "isQuickWin": false
    }
  ]
}
```

The example shows one course; the unfiltered response for learner 1 contains three. Seed timestamps are generated relative to server startup, so their exact values differ between runs.

- **Completion:** completed lessons divided by total lessons, rounded to a whole percentage; zero lessons yields 0. Lessons have equal weight.
- **Stale:** `isStale` is true only after more than 30 elapsed 24-hour days without activity. All courses in a response use one reference time.
- **Quick win:** `isQuickWin` is true for an in-progress course with exactly one unfinished lesson. This includes a one-lesson course whose lesson is unfinished; zero or multiple unfinished lessons do not qualify. No estimate of time or lesson difficulty is implied.
- Both flags are always returned as booleans. Filtering does not change newest-first ordering.
- Enrollment status determines inclusion. An inconsistent in-progress record with all lessons complete would return 100%; completion is not capped at 99%.

**Errors:**

| Status | When |
|--------|------|
| 400 | Invalid learner ID or `minCompletion` value |
| 404 | Unknown learner (not in seed data) |
| 500 | Unexpected failure; internal details are not returned to the client |

Errors use `{ "error": "Readable message" }`. An unknown learner still returns `404` when a valid completion filter is supplied.

## Tests

The suite contains 23 tests: the original eight API contract tests unchanged plus 15 focused additions. Added coverage targets completion rounding, zero lessons, the exact stale-date boundary, quick wins, threshold filtering, empty results, representative invalid filters, and seed immutability.

Run `npm test -- --runInBand` for a single-worker run. Edge-case learner records exist only in isolated test fixtures; production seed data is unchanged.

Business rules and tradeoffs are documented in [`PRODUCT.md`](../PRODUCT.md).

## Seed data

`src/data/seed.ts` includes:

- **Learner 1** — 3 in-progress, 1 completed, 1 not started (API should return 3)
- **Learner 2** — 1 in-progress, 1 completed (API should return 1)
- **Learner 999** — does not exist (404)

## CORS

Enabled for all origins so any local frontend dev server can call the API during development.

## Authentication

The `x-authenticated-learner-id` header is a fictional identity stub, not verified authentication. Per the assignment, learner authorization is intentionally not enforced. A real implementation must obtain identity from a verified session and authorize it before fetching progress; a mismatched authenticated identity would receive `403`.

This is a local demo with fictional data. Production authentication, restricted CORS, and deployment hardening are outside this backend implementation.

## Frontend integration hint

The React starter proxies `/api` to `http://localhost:3001`. Fetch:

```
GET /api/learners/1/progress
```

Learner 1 is a good default for demos; learner 2 shows a single-course case; learner 999 triggers an error state in your UI.
