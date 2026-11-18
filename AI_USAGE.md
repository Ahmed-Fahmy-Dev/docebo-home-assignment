# AI Usage

## Tools used

OpenAI Codex in VS Code, including one review subagent without the chat history. I asked for plans before implementation, reviewed the output, and directed refinements.

## What AI helped with

- **Review and planning:** Read the spec, backend helpers, comments, and tests; proposed implementation plans. Before setup, audited dependency sources, install scripts, and published advisories without installing packages or executing application code.
- **Backend:** Generated most changes: progress calculations, filtering, stale flags, sorting, validation, both extra rules, response types, tests, and the compiled startup path.
- **Frontend:** Generated the initial progress UI, responsive styles, loading/error/empty states, retry, cancellation, and runtime response validation. Helped complete prop types and wiring during my refactors.
- **Analytics:** Implemented the approved console-only progress-view event after successful, non-cancelled loads, with no new dependencies or backend changes.
- **Repository and documentation:** Initialized Git and configured the remote after I created the GitHub repository; consolidated ignore rules. Added a trust entry for this exact folder to resolve Windows Git ownership checks. Drafted documentation and prepared commits/pushes at my explicit request.

## My decisions, challenges, and refactors

- **Scope:** Chose one root repository, React, a demo learner dropdown, and minimal console analytics. Rejected estimated remaining minutes because the seed data has no duration information; selected minimum-completion filtering and quick-win flags instead.
- **Backend arguments:** Rejected an options object for the single `minCompletion` argument; used a primitive number and deferred extensibility until needed.
- **Learner-ID parsing:** Challenged changing `string | string[]` to `unknown` and adding dense validation. Restored the original union and clearer guards while retaining decimal-format and safe-integer checks.
- **Test scope:** Rejected the expanded 62-test suite. Kept 23 tests: the original eight unchanged plus 15 focused additions for the extra rules and meaningful boundaries; removed repetitive variants and unchanged-infrastructure tests.
- **Frontend structure:** Substantially reorganized layout, page, list, section-header components, and date formatting. Initiated the shared controlled dropdown and external options constants; requested AI reviews of component boundaries, narrow props, and parent wiring.
- **Request handling:** Requested `async`/`await` with `try`/`catch` instead of promise chaining. Challenged duplicated loading updates in handlers; moved loading, success, and error transitions into the fetch effect so handlers only change inputs or trigger refresh.
- **Validation and verification:** Questioned runtime response validation, retained the guard, and destructured fields for readability. Enabled Strict Mode and kept browser validation without adding a frontend testing framework.
- **Documentation and review:** Requested shorter security findings and simpler README/product/AI notes without duplication. Requested an independent review; deferred optional test additions and refactors, documenting the frontend testing tradeoff in `PRODUCT.md`.

## Verification

- **Backend:** Original baseline was four passing and four failing tests. All 23 final tests and the TypeScript build pass. Compiled startup was checked with real health, progress, filter, and error requests; the temporary server was stopped.
- **Frontend:** Initial browser checks covered filters, request cancellation, error recovery, keyboard access, contrast, and mobile layouts. The refactored frontend passes TypeScript checks and the Vite production build with Strict Mode enabled.
- **Analytics:** Browser checks covered event counts, Strict Mode, and suppression on failed/cancelled requests.
- **Independent review:** The subagent checked frontend/backend code against the spec, reran tests and typechecks, and reproduced the API error-classification limitation recorded in `PRODUCT.md`. It made no file changes and did not repeat browser checks.

## What you'd do differently without AI

Manually reviewing the full dependency trees and cross-checking published advisories would have taken longer without AI assistance.

## Ownership statement

I understand the frontend and backend code and can explain how the application works. I substantially refactored the frontend and challenged AI suggestions about structure, validation, and test scope. AI implemented most of the backend changes; I reviewed and understand that code, although I made fewer direct changes. I added TODO comments where I consider future changes to be implemented whether for the sake of scalability or better code readabilyt and maintanability.
