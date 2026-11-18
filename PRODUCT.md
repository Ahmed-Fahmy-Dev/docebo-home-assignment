# Product Notes

## User problem

Learners taking multiple courses lose track of where they left off. A single progress view should help them choose a course to resume.

## MVP scope

- React UI backed by Express: in-progress courses, completion percentages, last activity, inactive badges, and newest-first ordering.
- Demo learner selection, minimum-completion filtering, quick-win badges, and result counts.
- Loading, error/retry, and separate empty states for no active courses versus no filter matches; Refresh and Clear filter controls.
- Responsive layout, labelled controls, and accessible progress bars.

## Extra business rules

### Minimum completion

`minCompletion` keeps courses at or above the requested **rounded, displayed percentage**, helping learners focus on existing progress. The API accepts integers from 0 to 100; the UI offers Any, 25%, 50%, 75%, and 100%. The filter persists when switching learners; Clear filter restores Any.

Tests cover inclusive thresholds, rounding, 0/100 boundaries, no matches, and invalid or repeated filter values.

### Quick wins

`isQuickWin` flags an in-progress course with **exactly one unfinished lesson**, helping learners identify a course close to completion. It does not change ordering or filtering. Lesson duration and difficulty are unknown, so this is not a promise of low effort.

Tests cover zero, one, and multiple unfinished lessons, empty courses, and the API flags.

## Cuts and limitations

| Cut | Why |
| --- | --- |
| Database, write endpoints, and a course player | The supplied in-memory data supports the required progress-list flow. |
| Production authentication | The assignment permits an identity stub; see the trust boundary below. |
| Estimated remaining minutes | No duration data supports a credible estimate. |
| Exhaustive backend input variants | Focus tests on the contract, extra rules, and meaningful boundaries. |
| Automated frontend regression tests | Used browser validation; future tests would cover request cancellation, retry, and malformed responses. |

Known API limitation: malformed URL encoding or JSON currently returns a generic `500` instead of `400`; this remains an error-handling fix.

## Analytics

Log `course_progress_viewed` as console JSON after each successful, non-cancelled load, including empty results, filter/learner changes, Refresh, and successful Retry. Fields: `learnerId`, `minCompletion`, filtered `courseCount`, and UTC `timestamp`. Failed or malformed responses emit no event. Inspect it in the browser console; events are not persisted.

## Success metric

- **Metric:** Seven-day re-engagement rate: the percentage of learners with an in-progress course who record new course activity within seven days of pilot assignment.
- **Measurement:** Randomly offer the view to one group; compare re-engagement with a control group using the existing experience and real LMS activity records.
- **First 30-day target:** 10% relative improvement, for example 40% to 44%. This is a hypothesis, not a measured result.

Console events verify instrumentation; measuring re-engagement requires persistent pilot-assignment and course-activity data.

## Assumptions

- **Persistence:** Unchanged in-memory seed data; requests do not mutate enrollments.
- **Identity and trust:** The demo selects learner 1 or 2, defaulting to 1. Neither the dropdown nor the fictional identity header authenticates users. Authorization is intentionally unenforced; real verified identity would be checked before fetching progress, with mismatches returning `403`.
- **Completion:** Equally weighted lessons; round completed/total to a whole percentage; no lessons means 0%. Enrollment status determines inclusion, even if a record's lessons imply 100% completion.
- **Time:** API timestamps remain UTC; the UI displays local time with a timezone label. Inactive means strictly more than 30 elapsed 24-hour days; exactly 30 days and future activity are not stale.
- **API:** Preserve `{ learnerId, courses }`, adding boolean flags and the optional filter. Known learners with no matches receive an empty list; unknown learners receive `404`. Filtering and sorting remain in the backend.
- **Validation:** Positive decimal safe-integer learner IDs and one integer filter value from 0 to 100. Leading zeros are accepted; signs, fractions, alternate numeric formats, and repeated/structured filters are rejected.
- **Requests:** Clear old results while loading and cancel superseded requests so outdated responses cannot replace the current selection.

## What I'd build next

- Connect verified learner identity and real course progress, enforcing learner authorization before returning data.
- Persist analytics and correlate pilot assignment with LMS activity to measure re-engagement.
- Start a small learner pilot to assess whether completion filters and quick-win labels help people choose a course to resume.
