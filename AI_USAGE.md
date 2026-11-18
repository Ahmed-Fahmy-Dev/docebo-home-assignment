# AI Usage

This document records AI assistance and how I reviewed and changed its output.

## Tools used

OpenAI Codex in the VS Code workspace.

## What AI helped with

| Area | How AI was used | Your involvement |
| --- | --- | --- |
| Security review | Inspected repository files, dependency sources, install scripts, and published dependency advisories without installing packages or running application code. | Requested the audit before setup and asked for a concise risk assessment. |
| Requirements and planning | Read the assignment documentation and summarized the scope, required deliverables, and constraints. Recommended a single repository for both applications. | Directed a plan-and-review workflow and selected one root repository. |
| Repository setup | Initialized Git on `main`, configured the supplied GitHub remote, and consolidated the application ignore rules into a root `.gitignore`, also excluding `.DS_Store`. Added a Git trust entry for this exact project directory to resolve a Windows sandbox ownership conflict. | Created the GitHub repository and explicitly authorized local repository initialization and ignore-file migration. |
| Backend planning | Reviewed all backend source, helpers, comments, and original tests. Proposed extra rules and refined the plan to use existing seed fields. | Rejected time estimates without supporting duration data and selected a minimum-completion filter plus quick-win flags. Approved the final plan before implementation. |
| Backend implementation | Completed progress filtering, mapping, stale flags, sorting, input validation, both extra rules, the frontend response type, and the compiled startup path. | Reviewed and understand the implementation; challenged the filter argument design, learner-ID parsing, and test scope. Made fewer direct code changes than in the frontend. |
| Backend verification | Established the original test baseline (four passing, four failing). After review, reduced the expanded suite from 62 to 23 tests: the original eight unchanged plus 15 focused additions. All 23 tests and the TypeScript build pass. Previously verified compiled startup with real HTTP requests and stopped the smoke-test server afterward. | Challenged excessive test scope and requested focused coverage of the extra rules and important boundaries. |
| Frontend implementation | Implemented learner selection, completion filtering, progress display, responsive styling, loading/error/empty states, retry, cancellation, and runtime response validation. Completed narrow prop types, safe parent wiring, and a shared controlled dropdown with options kept outside the UI component. | Chose a demo learner dropdown and refinement of the existing page. Reorganized layout/page/list components, the section header, and date formatting; initiated reusable dropdown extraction and requested reviews of component boundaries and prop contracts. |
| Frontend verification | The initial implementation passed browser checks for filters, request cancellation, error recovery, keyboard access, contrast, and mobile layouts. The refactored frontend passes TypeScript checks and the Vite production build with Strict Mode enabled. | Kept validation focused without adding a frontend testing framework; enabled Strict Mode and requested relevant documentation updates after initially deferring them. |
| Documentation | Wrote concise root setup/run instructions and maintained the separate product and AI-assistance records. | Challenged the initial README's excess detail and duplication; requested each document follow its specific role in the spec. |
| Analytics | Added a typed console event after successful, non-cancelled progress loads. Verified event counts, Strict Mode behavior, and failure/cancellation suppression in the browser; added no dependencies or backend changes. | Selected one progress-view event and approved a minimal console-only implementation. |
| Version control | Prepared feature commits and validation summaries for the reviewed backend and frontend work. | Explicitly requested separate backend and frontend commits with meaningful messages and GitHub pushes. |

## What you rejected or rewrote

- Requested a shorter, actionable security assessment after the initial report was too long.
- Rejected AI's proposal to estimate remaining minutes because the seed data has no lesson-duration information. Chose features grounded in the existing completed-lesson data instead: minimum-completion filtering and quick-win flags.
- Challenged AI's options object for a single `minCompletion` argument; requested a primitive number and deferred extensibility until needed.
- Challenged AI changing `parseLearnerId` from `string | string[]` to `unknown` and using dense validation. Requested the original union type and clearer guards; retained decimal-format and safe-integer checks.
- Challenged the oversized 62-case test suite. Requested removal of repetitive input variants and unchanged-infrastructure tests; retained 23 tests covering the original contract, extra rules, and key boundaries.
- Requested frontend request handling use `async`/`await` with `try`/`catch` instead of promise chaining, and extracted repeated filter options into a constant mapped by the page.
- Challenged duplicated loading-state updates in event handlers; centralized loading, success, and error transitions in the fetch effect. Handlers now only update request inputs or trigger a refresh.
- Reviewed the purpose of runtime response validation and destructured its fields for readability while retaining the guard.

## What you'd do differently without AI

Manually reviewing the full dependency trees and cross-checking published advisories would have taken longer without AI assistance.

## Ownership statement

I understand the frontend and backend code and can explain how the application works. I substantially refactored the frontend and challenged AI suggestions about structure, validation, and test scope. AI implemented most of the backend changes; I reviewed and understand that code, although I made fewer direct changes.
