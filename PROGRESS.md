# V36 Progress Log

> Update this file with every implementation change. Record facts and evidence, not optimism. If a test was not run, write **NOT RUN**. If it failed, write **FAILED** and link the run. Do not mark a phase VERIFIED until all its acceptance criteria are met.

## Current snapshot

- **Branch:** `main`
- **Project status:** In development; not release-ready.
- **Current phase:** Phase 0 — Baseline and CI stabilization.
- **Phase 0 status:** Consolidated CI passed on commit `914928c`; expanded implementation in the current batch is pending its own bulk test run. CI structure has now been consolidated; test status remains unverified until the single bulk run completes.
- **Latest run supplied by maintainer:** [CI run #17 — Preserve rate-limit and partial-metadata status messages](https://github.com/vijay3695/V36/actions/runs/39563293807).
- **Observed in that run:** Unit tests passed; browser acceptance/E2E failed at `npm run test:e2e`.
- **Other recent runs supplied by maintainer:** CI runs #1–#18 were reported as failing overall. Do not assume a single cause; inspect each relevant failed job and the current head commit.
- **Last known documentation commit:** [03d1a6e](https://github.com/vijay3695/V36/commit/03d1a6e9b094cc6760f96ad675d72cd822dd1c20) — added `docs/PROJECT_PLAN.md`.
- **This file's purpose:** handoff state for the next coding agent. Re-check current `main` and latest Actions run before relying on this snapshot.

## Verified observations

- [x] Repository contains a static-first app entry point (`index.html`), `package.json`, `playwright.config.js`, and `.github/workflows/ci.yml`.
- [x] Package scripts define `npm test`, `npm run test:e2e`, and `npm run test:a11y`.
- [x] The CI workflow has been consolidated to one job that invokes the bulk test command `npm run test:all`.
- [x] Husky local hooks are configured: unit tests before commit, bulk tests before push.
- [ ] The new consolidated bulk test command has passed on the current `main` commit.
- [x] In the reported run #17, unit tests passed.
- [x] In the reported run #17, `npm run test:e2e` failed.
- [ ] Root cause of the E2E failure identified.
- [ ] Root cause fixed and regression test added/updated.
- [ ] New CI run fully green on the current `main` commit.

## Feature status

These are **not yet verified as complete** merely because related code exists.

| Area | Status | Evidence / next action |
|---|---|---|
| App shell and Discover/Saved/About navigation | IMPLEMENTED, NOT VERIFIED | Inspect current browser behavior and E2E results |
| GitHub issue search and load-more | IMPLEMENTED, NOT VERIFIED | Verify API behavior, pagination, partial-result messaging |
| Search filters and category inference | IMPLEMENTED, NOT VERIFIED | Run unit tests and filter E2E tests; check unknown/multi-language cases |
| Issue details and activity metadata | IMPLEMENTED, NOT VERIFIED | Verify missing metadata, rate-limit handling, fetch times |
| Saved issues and searches | IMPLEMENTED, NOT VERIFIED | Test local storage, reload, closed/inaccessible references |
| Import/export and duplicate handling | IMPLEMENTED, NOT VERIFIED | Test malformed/oversized files, duplicates, preservation of existing data |
| AI context packs | IMPLEMENTED, NOT VERIFIED | Verify only retrieved data is included and missing sources are disclosed |
| Shareable search URLs | IMPLEMENTED, NOT VERIFIED | Test filter round-trip and ensure no saved data/secrets are encoded |
| Automated accessibility | PRESENT, FAILING/NOT VERIFIED | E2E/accessibility run currently fails; inspect exact assertion output |
| Manual keyboard/screen-reader checks | NOT VERIFIED | Perform and record manual checks |
| CI / release readiness | BLOCKED | Do not release until Phase 0 and all later acceptance criteria pass |

## Immediate next actions

1. Open the latest failed Actions run for the current `main` commit; fetch the failing job logs and identify the first real assertion/error in `npm run test:e2e`.
2. Compare the failure with the exact current implementation and tests. Do not guess from commit messages.
3. Fix the root cause and add/update a regression test. Do not remove features or weaken assertions to force green CI.
4. Run unit, E2E, and accessibility suites. Record exact results and the tested commit below.
5. Update this progress file and phase checkboxes in the same logical change as code.

## Work log

### 2026-10-21 — Expanded filters, activity evidence, and context packs

- Added custom date bounds for issue creation, update, and latest commit; exact minimum/maximum star filters; and GitHub relevance sorting.
- Wired new filter values through form state, shareable URLs, and saved-search backups.
- Added repository push date, issue comment count, closed date, and pull-request link to activity evidence.
- Context packs now retrieve a repository-root file listing on demand, include identifiable root-level source links, and fetch a root `CONTRIBUTING.md` when available. Missing sources are disclosed.
- Added unit and browser integration tests. Run `39568309050` passed all 21 unit tests and 6 browser tests; its new integration test failed because it used a text assertion on a textarea value. The assertion was corrected, and URL round-trip, detail accessibility, and invalid-import preservation coverage were added. Await the next bulk run before claiming this batch passes.


### 2026-10-21 — Expanded filters, activity evidence, and context packs (pending CI)

- Added custom created/updated/commit date bounds, exact min/max star filters, and GitHub relevance sorting.
- Wired new filter values through form state, shareable URLs, and validated saved-search backups.
- Added repository last-push date, issue comment count, close date, and PR link to activity evidence.
- Context-pack generation now optionally retrieves root-level source links and a root `CONTRIBUTING.md`, disclosing when the guide or listing is unavailable.
- Added filter/storage/context-pack unit tests and a deterministic mocked browser flow for search, details, context packs, and saved issues.
- This batch's checks: **NOT RUN locally** because this environment cannot clone from GitHub. Verify the single consolidated GitHub Actions run before treating these changes as complete.


### 2026-10-21 — Consolidated local and GitHub test execution

- Added Husky local hooks: `npm test` on pre-commit and `npm run test:all` on pre-push.
- Added `test:all` as the single bulk command for unit and Playwright browser tests.
- Consolidated GitHub Actions into one workflow, one job, and one bulk test command.
- Updated agent and contributor instructions to prevent separate workflows/jobs for individual test suites.
- Tests: **NOT RUN in this editing environment**. The next single CI run must be inspected; the previous E2E failure remains unresolved until diagnosed and verified.


### 2026-10-21 — Project tracking files added

- Added the master working plan, phase-by-phase acceptance criteria, and progress handoff log.
- No application code or tests changed in this documentation update.
- CI status after this documentation commit: **NOT YET CHECKED**.
- Next owner/agent should start at Phase 0 and re-check latest `main` and GitHub Actions before coding.
