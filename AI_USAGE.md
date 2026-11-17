# AI Usage

This document records AI assistance as the assignment progresses. Implementation and final ownership details will be completed after review.

## Tools used

OpenAI Codex in the VS Code workspace.

## What AI helped with

| Area | How AI was used | Your involvement |
| --- | --- | --- |
| Security review | Inspected repository files, dependency sources, install scripts, and published dependency advisories without installing packages or running application code. | Requested the audit before setup and asked for a concise risk assessment. |
| Requirements and planning | Read the assignment documentation and summarized the scope, required deliverables, and constraints. Recommended a single repository for both applications. | Directed a plan-and-review workflow and selected one root repository. |
| Repository setup | Initialized Git on `main`, configured the supplied GitHub remote, and consolidated the application ignore rules into a root `.gitignore`, also excluding `.DS_Store`. Added a Git trust entry for this exact project directory to resolve a Windows sandbox ownership conflict. | Created the GitHub repository and explicitly authorized local repository initialization and ignore-file migration. |
| Documentation | Updated this record and the repository assumptions in `PRODUCT.md`. | Requested relevant documentation updates after each action; reviews and approves changes before implementation. |

## What you rejected or rewrote

Requested a shorter, actionable security assessment after the initial report was too long. No AI-generated application implementation has been accepted, rejected, or rewritten yet; specific examples will be recorded as development proceeds.

## What you'd do differently without AI

Manually reviewing the full dependency trees and cross-checking published advisories would have taken longer without AI assistance.

## Ownership statement

Pending the candidate's own statement after implementation and review. No application implementation has been changed by Codex at this stage.
