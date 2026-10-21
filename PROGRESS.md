# V36 Progress Log

> Update this file with every implementation change. Record facts and evidence, not optimism. If a test was not run, write **NOT RUN**. If it failed, write **FAILED** and link the run. Do not mark a phase VERIFIED until all its acceptance criteria are met.

## Current snapshot

- **Branch:** `main`
- **Project status:** In development; not release-ready.
- **Current phase:** Phase 1 — Core discovery and filtering.
- **Phase 0 status:** VERIFIED on [CI #59](https://github.com/vijay3695/V36/actions/runs/39574808517), exact commit [`06b4fbd`](https://github.com/vijay3695/V36/commit/06b4fbdd728e5c455f5fd01d75d50d72e55bb9ab): 75/75 unit tests, 21/21 browser tests, and 3/3 standalone accessibility checks passed in the single consolidated job. Historical failures #53–#55 are documented below and were corrected; continue checking every subsequent commit.
- **CI shape:** One workflow (`.github/workflows/ci.yml`), one job (`Full test suite`), one bulk command (`npm run test:all`). Husky pre-commit runs unit tests; pre-push runs the bulk suite.
- **Latest run status:** PASS — [run #52](https://github.com/vijay3695/V36/actions/runs/39573103139) completed the single CI job successfully: 59/59 unit tests, 16/16 browser tests, and 3/3 standalone accessibility checks. Phase 0 acceptance criteria are satisfied on that commit.
- **Last known documentation commit:** [03d1a6e](https://github.com/vijay3695/V36/commit/03d1a6e9b094cc6760f96ad675d72cd822dd1c20) — added `docs/PROJECT_PLAN.md`.
- **This file's purpose:** handoff state for the next coding agent. Re-check current `main` and latest Actions run before relying on this snapshot.

## Verified observations

- [x] Repository contains a static-first app entry point (`index.html`), `package.json`, `playwright.config.js`, and `.github/workflows/ci.yml`.
- [x] Package scripts define `npm test`, `npm run test:e2e`, and `npm run test:a11y`.
- [x] The CI workflow has been consolidated to one job that invokes the bulk test command `npm run test:all`.
- [x] Husky local hooks are configured: unit tests before commit, bulk tests before push.
- [ ] The new consolidated bulk test command has passed on the current `main` commit. Latest run #49 FAILED in one browser test.
- [x] In the reported run #17, unit tests passed.
- [x] In the reported run #17, `npm run test:e2e` failed.
- [x] Latest E2E failure identified from job logs: saved-search test navigation leaves the Discover-only Save search button inaccessible to the locator.
- [ ] Root cause fixed and regression test added/updated; fix and expanded filter coverage are in the next batch.
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

### 2026-10-21 — Secondary languages and safe shareable URLs (pending CI)

- Added E2E coverage proving a repository can match a non-primary language when GitHub language metadata is available.
- Added E2E coverage proving an unavailable language-metadata response does not silently discard an issue and clearly marks the filter as uncertain.
- Added E2E coverage that shareable search URLs contain filter settings only and never include saved issue titles or credential-like query parameters.
- Phase 1 remains IN PROGRESS until this batch passes and the complete filter acceptance checklist is reviewed.


### 2026-10-21 — Filter and GitHub failure-path coverage (pending CI)

- Run [#58](https://github.com/vijay3695/V36/actions/runs/39574476749) passed on the preceding commit: 67/67 unit tests, 20/20 browser tests, and 3/3 standalone accessibility checks.
- Added eight filter tests for custom update/commit boundaries, future timestamps, inverted ranges, unknown commit/push metadata, category matching, and unknown language metadata.
- Added a browser test for manual activity retry after a rate limit; it verifies no README/commit requests occur after the limit and that a user-triggered retry can recover evidence.
- Expanded Phase 1 URL coverage and API failure-path tests are in the current pending batch. Verify the next consolidated run before claiming this batch passes.


### 2026-10-21 — Phase 1 URL and GitHub failure-path coverage (passed CI)

- Expanded browser acceptance coverage to round-trip the standard filter set and custom creation/update/commit/push date bounds plus exact star limits through shareable URLs and reloads.
- Added an E2E scenario for a selected issue whose issue/repository refresh returns 404, verifying that the reference and original description remain visible while unavailable evidence is disclosed.
- Added eight GitHub API unit tests for secondary-rate-limit detection, ordinary permission 403 handling, HTTP 429 retry timing, invalid JSON, abort propagation, server errors, page/sort query parameters, and nested file-path encoding.
- Updated AGENTS.md to start from Phase 1 after the verified Phase 0 gate, and synchronized PHASES.md/PROGRESS.md with [run #57](https://github.com/vijay3695/V36/actions/runs/39574086433).
- Run [#59](https://github.com/vijay3695/V36/actions/runs/39574808517) passed the preceding batch: 75/75 unit tests, 21/21 browser tests, and 3/3 standalone accessibility checks. The next batch adds explicit tests for secondary-language matching, unavailable language metadata, and ensuring private saved references never enter shareable URLs.


### 2026-10-21 — Protect unreadable browser storage (verified by CI)

- Added a storage-write guard when saved data cannot be parsed. Save, remove, import, and export actions now refuse to overwrite unreadable existing local storage and report why.
- Added an E2E regression test that attempts valid import and export against malformed existing storage and verifies the original value remains unchanged.
- Corrected saved-search label normalization to trim whitespace before deduplication and sorting; aligned the storage regression assertion.
- CI outcomes: [run #53](https://github.com/vijay3695/V36/actions/runs/39573546241) and [run #54](https://github.com/vijay3695/V36/actions/runs/39573607069) failed because the storage test content was accidentally written to `js/storage.js`; [run #55](https://github.com/vijay3695/V36/actions/runs/39573683295) failed on a duplicate `CATEGORIES` declaration. These failures were explicitly recorded and fixed in commit [`eb9b890`](https://github.com/vijay3695/V36/commit/eb9b890af8a545633d33e6cb8d3645a5bcd94769). [Run #56](https://github.com/vijay3695/V36/actions/runs/39573889300) passed 59/59 unit tests, 17/17 browser tests, and 3/3 standalone accessibility checks. The unreadable-storage regression test confirmed malformed existing data was not overwritten by import/export.


### 2026-10-21 — Explicit accessibility gate and saved-data normalization tests (passed CI)

- Updated `test:all` to run unit tests, the full browser suite, and the standalone accessibility script as one bulk command within the existing single GitHub Actions job.
- Tightened saved-search import normalization so unsupported inferred categories are discarded rather than retained as invalid UI state.
- Added storage tests for invalid categories, normalized labels, invalid date/star values, canonical pull-request references, trailing-slash identity dedupe, malformed JSON, and the 2,000-item cap.
- Run [#56](https://github.com/vijay3695/V36/actions/runs/39573889300) passed the storage-safety batch: 59/59 unit tests, 17/17 browser tests, and 3/3 standalone accessibility checks. Documentation-only follow-up [#57](https://github.com/vijay3695/V36/actions/runs/39574086433) also passed.


### 2026-10-21 — Saved-route regression fixed; full browser suite green

- Inspected the actual job output for [run #49](https://github.com/vijay3695/V36/actions/runs/39572073815). All 41 unit tests pass; 14 of 15 browser tests pass.
- The saved-search test times out waiting for Save search after a navigation/reload sequence. Updated the flow to load Discover explicitly before keyboard-activating Save search; dedicated keyboard navigation coverage remains in place.
- Added ten filter regression tests for push-date boundaries, future push timestamps, custom-bound precedence, invalid dates, exact star bounds, unknown labels, conservative category inference, case-insensitive language metadata, and malformed star presets.
- Updated PHASES.md with a readable live phase-by-phase done/pending snapshot. Phase 0 and release readiness remain blocked pending a green full run and manual accessibility acceptance.
- Run [#50](https://github.com/vijay3695/V36/actions/runs/39572501176) failed in one browser test despite all 51 unit tests passing. Root cause: the app auto-runs a URL search even when the initial hash is #saved, and `updateUrl()` rewrites that hash to #discover while the Saved view remains active. Fix the startup condition and add a regression test in the next batch; do not ignore this failure.


### 2026-10-21 — Final acceptance coverage expansion (pending CI)

- Confirmed separate repository push-age filtering and custom bounds pass the bulk suite on [39571468560](https://github.com/vijay3695/V36/actions/runs/39571468560): 40 unit tests and 15 browser tests.
- Added explicit coverage that age filters are opt-in, missing update dates remain unknown, activity timestamps and related-search links are visible, and saved issues/searches survive reload.
- Run [39571893981](https://github.com/vijay3695/V36/actions/runs/39571893981) passed 40 of 41 unit tests; the missing-update-metadata test fixture accidentally retained the base issue's valid `updated_at` timestamp. The fixture now sets it to `null` to exercise the intended unknown-data case. No product assertion was weakened; the corrected run is pending.


### 2026-10-21 — Separate repository last-push filtering (pending CI)

- Added a repository last-push age preset and custom date bounds, separate from latest commit age/date.
- Added URL and saved-search backup support, including normalization so custom bounds override age presets.
- Added unit coverage for known stale pushes, custom push-date boundaries, and unavailable push metadata; extended the browser URL round-trip test.
- Previous full suite [39571103679](https://github.com/vijay3695/V36/actions/runs/39571103679) passed 38 unit tests and 15 browser tests. The new push-filter batch awaits the consolidated run.


### 2026-10-21 — Pagination, saved-search, and hostile-content coverage (pending CI)

- Added filter tests for language metadata, official labels, issue-vs-PR type, age presets, and star preset boundaries.
- Added mocked browser tests for incomplete-result pagination, load-more append behavior, saved-search persistence, and rendering hostile issue markup as text.
- The preceding keyboard-flow run [39570653737](https://github.com/vijay3695/V36/actions/runs/39570653737) passed. The current test batch awaits the consolidated workflow.


### 2026-10-21 — Keyboard activation regression coverage (pending CI)

- Expanded the mocked browser flow to activate issue details, context-pack generation/copy, save, navigation, and export using keyboard focus and Enter.
- The preceding consolidated workflow [39570467026](https://github.com/vijay3695/V36/actions/runs/39570467026) passed 33 unit tests and 13 browser tests. This additional keyboard flow is pending CI.


### 2026-10-21 — Keyboard-accessible import control (pending CI)

- Replaced the styled label used as an import control with a real button that opens the hidden file picker, making the action keyboard-focusable.
- Expanded keyboard regression coverage to include the import control and keyboard-submitted search.
- The preceding full suite passed on [39570184135](https://github.com/vijay3695/V36/actions/runs/39570184135): 33 unit tests and 13 browser tests. This batch awaits its own CI result.


### 2026-10-21 — Keyboard focus, source bounds, and portability verification (pending CI)

- Added focus movement to destination headings after navigation and issue-detail opening; advanced filters open automatically when shared/saved custom filters are present.
- Added timestamp precision for fetch evidence, bounded README/contribution-guide excerpts, and checked common nested CONTRIBUTING.md locations on demand.
- Added browser tests for keyboard skip-link/navigation focus, valid import diagnostics, backup download, and storage write failures.
- Latest preceding run [39569657260](https://github.com/vijay3695/V36/actions/runs/39569657260) passed 31 unit tests and 9 browser tests. This new batch is pending its own single bulk run.


### 2026-10-21 — Unknown metadata and incomplete search results (pending CI)

- Changed metadata-dependent filtering so missing language, labels, dates, stars, or latest-commit evidence does not silently remove an issue from the visible result set. Such results are visibly marked as not fully evaluated.
- Corrected null star counts so they are not interpreted as zero stars.
- Kept load-more available when GitHub marks a result set incomplete but provides another page.
- Canonicalized saved-search label ordering during backup validation to improve duplicate detection.
- Added unit and browser regression tests for unknown metadata behavior.
- Run [39569510803](https://github.com/vijay3695/V36/actions/runs/39569510803) exposed two outdated assertions that still treated unknown language/date metadata as a definite mismatch. The tests now distinguish known mismatches from unavailable metadata; no product assertion was removed. The corrected run [39569657260](https://github.com/vijay3695/V36/actions/runs/39569657260) passed 31 unit tests and 9 browser tests. The current batch adds keyboard focus management, accessible keyboard navigation, bounded source excerpts, valid import/export checks, and browser-storage failure coverage; its first run [39569974281](https://github.com/vijay3695/V36/actions/runs/39569974281) passed 33 unit tests and 12 browser tests but failed the new keyboard test: automatic focus on the Discover heading during initial load prevented the skip link from being the first tab stop. The startup call now suppresses programmatic heading focus while in-session navigation still moves focus. The corrected run [39570184135](https://github.com/vijay3695/V36/actions/runs/39570184135) passed 33 unit tests and 13 browser tests. The current batch replaces a non-focusable file-input label with a real Import button and expands keyboard coverage; the consolidated run [39570467026](https://github.com/vijay3695/V36/actions/runs/39570467026) passed 33 unit tests and 13 browser tests. The keyboard flow passed in run [39570653737](https://github.com/vijay3695/V36/actions/runs/39570653737). The current batch adds pagination/incomplete-results, saved-search, and hostile-markup regression coverage plus broader filter tests; Run [39570890449](https://github.com/vijay3695/V36/actions/runs/39570890449) passed all 38 unit tests and 14 browser tests; the hostile-markup test failed because it targeted a CSS class not present on the description paragraph. The paragraph now has the explicit `issue-body` class used by the security assertion. The corrected run [39571103679](https://github.com/vijay3695/V36/actions/runs/39571103679) passed 38 unit tests and 15 browser tests. The current batch adds a separate repository last-push age/custom-date filter, distinct from latest commit date, and persists it through URLs/backups; The push-filter run [39571468560](https://github.com/vijay3695/V36/actions/runs/39571468560) passed 40 unit tests and 15 browser tests. The current batch adds default-age behavior, missing update-date coverage, activity-link assertions, and saved-data reload verification; its run is pending.


### 2026-10-21 — API failure and import diagnostics coverage (pending CI)

- Added unit coverage for rate-limit detection/retry timing, missing GitHub resources, network failures, relevance sorting, and base64 contribution-guide decoding.
- Added import diagnostics assertions for accepted, rejected, duplicate, and oversized records.
- Added browser regression coverage that a failed search restores the previous results and filters instead of clearing the visible result set.
- Tests for this batch: **NOT RUN locally**; wait for the single consolidated GitHub Actions run on the commit containing these tests.


### 2026-10-21 — Expanded filters, activity evidence, and context packs

- Added custom date bounds for issue creation, update, and latest commit; exact minimum/maximum star filters; and GitHub relevance sorting.
- Wired new filter values through form state, shareable URLs, and saved-search backups.
- Added repository push date, issue comment count, closed date, and pull-request link to activity evidence.
- Context packs now retrieve a repository-root file listing on demand, include identifiable root-level source links, and fetch a root `CONTRIBUTING.md` when available. Missing sources are disclosed.
- Added unit and browser integration tests. Run `39568309050` passed all 21 unit tests and 6 browser tests; its integration test exposed a textarea-value assertion mistake. Run `39568636335` passed all 21 unit tests and 7 browser tests but revealed that the global status region was inside the hidden Discover view, making Saved-page import feedback inaccessible. The status region has been moved outside the individual views so search, save, export, and import feedback remains visible on every page. The follow-up run [39568836496](https://github.com/vijay3695/V36/actions/runs/39568836496) passed the full suite: 21 unit tests and 8 browser tests, including the sourced context-pack flow, URL restoration, detail-page axe scan, and invalid-import preservation. The latest consolidated run [39569098206](https://github.com/vijay3695/V36/actions/runs/39569098206) passed 28 unit tests and 8 browser tests. The current batch addresses unknown metadata semantics and partial-result pagination; its bulk test run is pending.


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
