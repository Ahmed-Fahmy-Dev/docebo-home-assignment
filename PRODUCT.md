# Product Notes

The backend and frontend progress flow are implemented. Analytics and the final success metric remain pending.

## User problem

Learners taking multiple courses lose track of their progress and most recent activity. A single progress list should help them reconnect with unfinished learning and identify a manageable course to complete.

## MVP scope

- Implemented backend: list a learner's in-progress courses with rounded completion percentages, last activity, stale flags, and newest-first sorting.
- Implemented extra rules: optional minimum-completion filtering and a quick-win flag for courses with one unfinished lesson.
- Implemented validation and readable error responses, with original contract tests and additional boundary tests.
- Verified all 23 backend tests (eight original plus 15 focused additions), TypeScript compilation, and compiled-server startup with real health/progress/filter/error requests; the temporary server was stopped afterward.
- Frontend: extended the React starter with demo learner selection, minimum-completion filtering, result counts, accessible progress bars, formatted activity dates, and inactive/quick-win badges. Includes loading, error/retry, distinct empty states, Refresh, and Clear filter.
- Initial browser checks passed, including obsolete-request cancellation, error recovery, keyboard access, contrast, and mobile layouts. The refactored frontend passes TypeScript checks and the Vite production build with Strict Mode enabled.

## Extra business rule

### Minimum completion

`minCompletion` optionally limits the list to courses with at least the requested displayed completion percentage. This helps learners focus on courses where they have already made progress. It accepts whole-number percentages from 0 through 100, includes courses exactly at the threshold, and compares against the same rounded percentage shown in the response. A valid filter with no matches returns an empty list, and newest-first sorting remains unchanged.

For learner 1, `minCompletion=50` retains Onboarding and Compliance. Focused tests verify inclusive thresholds, rounding, 0/100 boundaries, empty results, and representative out-of-range and repeated query values. The original tests retain learner-isolation coverage.

### Quick wins

`isQuickWin` identifies an in-progress course with exactly one unfinished lesson. It helps learners spot an opportunity to finish a course without inventing time estimates. A one-lesson in-progress course with its lesson unfinished qualifies; empty courses and courses with zero or multiple unfinished lessons do not. The flag neither filters courses nor changes their order.

Compliance for learner 1 and Workplace Safety for learner 2 qualify in the existing seed data. Tests verify zero/one/multiple unfinished-lesson counts and API flags. Lesson difficulty and duration are unknown, so a quick win means one lesson remaining, not a promise of low effort.

## What I intentionally cut

| Cut | Why |
| --- | --- |
| Estimated remaining minutes | Seed data has no duration information; avoid unsupported estimates or invented data. |
| Database and write endpoints | Existing in-memory records support the required read/list flow and both extra rules. |
| Production authentication | The assignment explicitly allows an identity stub; retain and document the trust boundary. |
| Exhaustive input variants and tests of unchanged infrastructure | Keep additional tests focused on the extra rules and meaningful boundaries within the assignment's time budget. |

## Success metric

Pending analytics planning: choose one learner re-engagement metric, its measurement approach, and a first-30-days target. No analytics event or outcome measurement is implemented yet.

## Assumptions

- **Repository organization:** Keep the Express backend, React frontend, and assignment documentation in one Git repository at the project root. This provides one submission and keeps related frontend/backend changes together.
- **Ignore rules:** Maintain one root `.gitignore` for dependencies, build output, coverage, local `.env` files, logs, and `.DS_Store` metadata across both applications. Keep package manifests and lockfiles under version control.
- **Persistence:** Keep the supplied in-memory seed data unchanged. Requests derive new response objects and do not mutate enrollment records or their ordering. Empty-state edge records are isolated test fixtures.
- **Authentication:** Retain the fictional identity header without adding authorization. It is client-controlled and not a verified identity. Real authentication would establish identity first, and learner authorization would run before retrieving data; mismatches would receive `403`.
- **Demo identity:** The frontend selects learner 1 or 2, defaulting to learner 1. This dropdown is a demonstration control, not a login or authorization mechanism.
- **Frontend filtering:** Offer Any, 25%, 50%, 75%, and 100% minimum completion. Preserve the selection when switching learners; Clear filter restores Any. Filtering and sorting remain authoritative in the backend.
- **Frontend states and dates:** Clear obsolete results while loading and cancel superseded requests. Show separate empty messages for no active courses and no filter matches. Preserve UTC timestamps from the API and display local dates/times with timezone labels.
- **Completion:** Lessons have equal weight. Round completed/total lessons to a whole percentage; no lessons yields 0. Enrollment status determines inclusion, even for inconsistent records; no 99% cap is applied.
- **Activity time:** Preserve ISO-8601 seed timestamps and calculate elapsed time in milliseconds. Stale means strictly more than 30 24-hour days; exactly 30 days and future activity are not stale. Capture one reference time for each response.
- **Input validation:** Learner IDs use positive decimal safe integers. `minCompletion` accepts a single whole-number decimal value from 0 to 100. Leading zeros are accepted; signs, fractions, scientific/hexadecimal notation, and structured/repeated filter values are rejected.
- **API contract:** Preserve `{ learnerId, courses }`, add explicit boolean flags, return empty arrays for known learners without matching courses, and keep unknown learners as `404` even when a valid filter is present.
- **Analytics:** Deferred by explicit scope choice. The required learning-related event remains a separate implementation step.

## What I'd build next

Pending final product review after the frontend and analytics are complete.
