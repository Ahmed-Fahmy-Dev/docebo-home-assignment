# Product Notes

Copy this file to `PRODUCT.md` in your repo root and fill it in.

## User problem

Who is affected, and what pain are they experiencing? (2–4 sentences)

## MVP scope

What does your submission actually deliver? List the core capabilities you shipped.

## Extra business rule

What rule did you add beyond the baseline tests? Why would a learner or admin care?

## What I intentionally cut

List at least 2 features or polish items you chose **not** to build, and why. Senior engineers scope as much as they build.

| Cut                      | Why                                                                  |
| ------------------------ | -------------------------------------------------------------------- |
| e.g., course detail page | Validated list view first; detail is v2 if list engagement is strong |
|                          |                                                                      |

## Success metric

If this shipped to production, **one metric** would tell you whether it's working. Be specific.

- Metric name:
- How you'd measure it:
- What "good" looks like in the first 30 days:

## Assumptions

- **Repository organization:** Keep the Express backend, React frontend, and assignment documentation in one Git repository at the project root. This provides one submission and keeps related frontend/backend changes together.
- **Ignore rules:** Maintain one root `.gitignore` for dependencies, build output, coverage, local `.env` files, logs, and `.DS_Store` metadata across both applications. Keep package manifests and lockfiles under version control.
- Persistence, authentication, completion calculation, analytics, and the extra business rule remain to be decided during scope review.

## What I'd build next

Given one more week, what's the highest-leverage follow-up? (3–5 bullets max)
