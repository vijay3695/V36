# V36 Working Plan

> This is the execution plan for contributors and coding agents. Read this before changing code. Keep `PROGRESS.md` updated in the same change as implementation work. The detailed product requirements live in [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md).

## Project guardrails

- Work directly on `main` unless the maintainer explicitly says otherwise.
- Do not remove agreed features to make tests pass.
- Do not claim a feature or test is complete without checking the implementation and evidence.
- Do not publish a release until every required release gate passes.
- No paid services, backend, AI API, required GitHub token, or stored credentials.
- GitHub issue/repository content and imported files are untrusted input.
- If CI fails, inspect the failing job output and fix the root cause before stacking more implementation commits. Avoid a rapid chain of speculative commits that all trigger failing CI.
- Keep the app static-first and compatible with GitHub Pages.
- Use `docs/PROJECT_PLAN.md` as the source for detailed product requirements. If this file conflicts with that spec, stop and reconcile the documents instead of guessing.

## How agents should work

1. Read `PLAN.md`, `PHASES.md`, `PROGRESS.md`, `docs/PROJECT_PLAN.md`, and the current CI workflow.
2. Read the relevant implementation and tests before editing.
3. Select the earliest incomplete phase or a clearly scoped task in the current phase.
4. Implement the smallest complete, tested unit of work without breaking unrelated functionality.
5. Run relevant unit tests, browser tests, and accessibility checks; inspect failures rather than guessing.
6. Update `PROGRESS.md` with files changed, actual checks and results, known issues, and the next task. Do not mark unchecked work complete.
7. Commit related changes together where possible. Avoid one commit per tiny edit.
8. Do not start the next phase while a release-blocking regression from the current work remains unresolved.

## Phase order

1. **Phase 0 — Baseline and CI stabilization**
2. **Phase 1 — Core discovery and filtering**
3. **Phase 2 — Issue details and activity evidence**
4. **Phase 3 — Saved issues/searches and portability**
5. **Phase 4 — AI context packs**
6. **Phase 5 — Accessibility, resilience, and security**
7. **Phase 6 — End-to-end verification and release readiness**

The phase checklist and acceptance criteria are in [PHASES.md](PHASES.md). Current factual status is in [PROGRESS.md](PROGRESS.md); it is not a substitute for test evidence.
