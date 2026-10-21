# V36 Phases and Acceptance Criteria

Use this file to plan and complete work phase by phase. Read `DECISIONS.md` first so scope and deferred work are clear. Keep status synchronized with `PROGRESS.md`. A phase is not complete because code exists; it is complete only when its acceptance criteria have been verified.

Statuses: **NOT STARTED**, **IN PROGRESS**, **BLOCKED**, **VERIFIED**. Only mark **VERIFIED** with evidence recorded in `PROGRESS.md`.

## Live status snapshot — 2026-10-21

| Phase | Current status | What is done | What remains |
|---|---|---|---|
| 0 — Baseline and CI | **VERIFIED** | [Run #64](https://github.com/vijay3695/V36/actions/runs/39576488647) on current main passed 75/75 unit tests, 25/25 browser tests, and 3/3 standalone accessibility checks in one workflow job. | Re-check on each subsequent commit; investigate any new failure. |
| 1 — Discovery and filters | **VERIFIED** | [Run #60](https://github.com/vijay3695/V36/actions/runs/39575117877): 75/75 unit tests, 24/24 browser tests, and 3/3 accessibility checks passed. Standard/custom URL round-trips, secondary-language metadata, safe share URLs, partial results, and filter boundaries are covered. | Re-check after later changes; investigate any regression. |
| 2 — Issue details/activity | **VERIFIED** (local: 86/86 unit, 25/25 E2E, 3/3 a11y) | Detail view, official labels, source links, activity fields, fetch timestamps, unavailable/closed/moved handling, and manual retry are implemented and tested locally. | Phase 2 acceptance criteria verified locally; no GitHub Actions used. |
| 3 — Saved/import/export | **VERIFIED** (local: 86/86 unit, 25/25 E2E, 3/3 a11y) | Browser-local saved issues/searches, validated import, dedupe, export and merge behavior exist and are tested locally. | All storage/import edge cases verified locally; no GitHub Actions used. |
| 4 — AI context packs | **VERIFIED** (local: 86/86 unit, 25/25 E2E, 3/3 a11y) | Context-pack generation, source links, contribution guide and missing-source disclosure exist and are tested locally. | All context-pack acceptance criteria verified locally; no GitHub Actions used. |
| 5 — Accessibility/security/resilience | **IN PROGRESS — remaining checks deferred by maintainer** | Existing automated accessibility/resilience coverage and the prior responsive-overflow run remain recorded. A new long-content responsive browser test was added in `998670f`, but the latest consolidated CI run failed during the browser suite; the test has not been verified as passing. | By maintainer direction (2026-10-21), defer remaining Phase 5 tests for now. Contrast, reduced motion, long-content/responsive edge cases, and remaining visual acceptance are still unresolved; Phase 5 is not VERIFIED. Latest failing CI: [run #69](https://github.com/vijay3695/V36/actions/runs/39638495312). |
| 6 — End-to-end verification and release readiness | **IN PROGRESS — pre-release audit only; release gate BLOCKED** | Started the release-readiness audit at the maintainer's direction while Phase 5 follow-up tests are deferred. The consolidated CI workflow is present on `main`. | Latest CI on `998670f` failed in browser regression tests and skipped standalone accessibility scans; Phase 5 acceptance remains incomplete. Audit remaining release checklist/documentation, but do not publish or claim release readiness until deferred Phase 5 checks and all release gates pass. |

The suite now contains 37 browser tests (including the Phase 5 announcement/live-region coverage). It was re-run green on `main`: 95/95 unit, 37/37 browser, 3/3 standalone axe. The counts recorded in the Phase 2–4 rows and sections below are historical snapshots from those verification runs, not the current suite size.

**Phase 0/CI clarification:** Phase 0's historical verification is [run #64](https://github.com/vijay3695/V36/actions/runs/39576488647). A consolidated `.github/workflows/ci.yml` is now present on `main` and has run on current commits. The latest run, [#69](https://github.com/vijay3695/V36/actions/runs/39638495312) on `998670f`, failed during browser regression tests, so CI is active but not green.

## Phase 0 — Baseline and CI stabilization

**Status: VERIFIED.** The historical failures in runs #53–#55 were corrected. The current consolidated run [#64](https://github.com/vijay3695/V36/actions/runs/39576488647) passed all automated suites on the current `main` commit. Keep the historical failure record in `PROGRESS.md`; do not carry the obsolete BLOCKED status forward.

Tasks:
- [x] Inspect current `.github/workflows/ci.yml`, package scripts, unit tests, E2E tests, and actual failed GitHub Actions job output.
- [x] Identify the E2E failure from job output: startup auto-search rewrote the hash to Discover on the Saved route, so activating Discover did not emit a hash change and its controls remained hidden.
- [ ] Fix startup route handling and confirm a green rerun; do not weaken or delete meaningful tests just to get a green run.
- [x] Run `npm test`, `npm run test:e2e`, and `npm run test:a11y` through the single bulk command.
- [x] CI logs show the failing test/assertion and the workflow uses the available package manifest (`npm install`; there is currently no package-lock file).
- [x] Confirm [run #52](https://github.com/vijay3695/V36/actions/runs/39573103139) on commit `9f8b841`; one job completed successfully.

Acceptance criteria:
- [x] Unit tests pass: 59/59.
- [x] Browser E2E tests pass: 16/16.
- [x] Standalone accessibility automation passes: 3/3.
- [x] The exact commit is recorded: `9f8b841c08ff0d4c5717891d84687c9e1916277c`.
- [x] No failures are hidden; failed run #50 and its fix are documented in `PROGRESS.md`.

## Phase 1 — Core discovery and filtering

**Status: VERIFIED on [CI run #60](https://github.com/vijay3695/V36/actions/runs/39575117877), commit `83d8327`.** Unit, browser, and standalone accessibility checks passed; filter and URL behavior has explicit regression coverage.

Tasks:
- [x] Search open GitHub issues and support pagination/load-more.
- [x] Compact result cards and explicit loading, empty, partial-results, unavailable-data, error, and rate-limit states.
- [x] Filters: language metadata, official labels, issue type, creation age/custom bounds, last-update age/custom bounds, latest commit/push age/custom bounds, popularity presets and exact min/max stars, inferred contribution category, and sorting.
- [x] AND semantics for selected filters and visible explanation of partial coverage.
- [x] Preserve older projects by default; unknown dates remain Unknown.
- [x] Clearly separate official labels from conservative inferred categories.
- [x] Shareable URLs encode filters only and restore them safely.
- [x] Unit tests for filter logic, date boundaries, URL encode/decode, category inference, unknown metadata, and pagination/partial coverage.

Acceptance criteria:
- [x] Each filter has tests for positive, negative, and missing-data cases.
- [x] Loaded-result filters disclose incomplete coverage.
- [x] Search failures do not erase already-loaded results.
- [x] No unsupported claim that all GitHub results have been evaluated.

## Phase 2 — Issue details and activity evidence

**Status: VERIFIED (local, no GitHub Actions).** Unit, browser E2E, and standalone accessibility checks passed locally (86/86, 25/25, 3/3). Detail view, official labels, source links, activity fields, fetch timestamps, unavailable/closed/moved handling, and manual retry are implemented and tested.

Tasks:
- [x] Dedicated issue-detail view.
- [x] Show issue description, canonical link, labels, issue dates, repository details, stars, and available activity evidence.
- [x] Fetch supplemental repository activity only for displayed results / selected details to conserve quota.
- [x] Show data fetch time where applicable and identify unavailable fields.
- [x] Provide GitHub search links for related issues and PRs; do not claim automatic duplicate detection.
- [x] Handle closed, moved, deleted, or inaccessible issue references honestly.

Acceptance criteria:
- [x] Unknown and unavailable values are not guessed.
- [x] Stars are presented as popularity, not repository health.
- [x] Rate limits stop additional requests, preserve results, explain the situation, and allow manual retry.

## Phase 3 — Saved issues/searches and portability

**Status: VERIFIED (local, no GitHub Actions).** Browser-local saved issues/searches, validated import/export, deduplication, and merge behavior are implemented and tested (86/86 unit, 25/25 E2E, 3/3 a11y).

Tasks:
- [x] Dedicated Saved view.
- [x] Save/remove issues and search presets in browser local storage; no account/backend.
- [x] Preserve references when issues close or become inaccessible.
- [x] Export/import saved data with schema validation and input-size limits.
- [x] Deduplicate canonical issue identities and normalize saved searches.
- [x] Report duplicates/invalid entries; preserve unrelated data and never silently overwrite it.
- [x] Explain local-storage limitations and privacy implications.
- [x] Test malformed, oversized, duplicate, partial, and valid import files.

Acceptance criteria:
- [x] Saved data survives navigation/reload in normal browser use.
- [x] Import errors do not corrupt existing saved data.
- [x] Private data and credentials are never included in shareable search URLs.

## Phase 4 — AI context packs

**Status: VERIFIED (local, no GitHub Actions).** Context-pack generation, source links, contribution guide, missing-source disclosure, and copy/fallback behavior are implemented and tested (86/86 unit, 25/25 E2E, 3/3 a11y).

**Post-verification improvement (`ac5306e`):** packs now open with an **Evidence completeness** section (`COMPLETE`, or `INCOMPLETE — not retrieved: …` plus a neutral reason), show the repository identity derived from the issue URL when metadata is missing, state issue-data provenance, and replace raw API error strings with neutral "Not retrieved: <sources>" bullets.

Tasks:
- [x] Generate a copyable, provider-portable prompt from retrieved context.
- [x] Include issue title/description/labels/link and available README/contribution instructions/source-file links.
- [x] List source links, fetch times, unavailable context, and limitations.
- [x] Keep incomplete packs usable only when missing context is explicitly disclosed.
- [x] Do not invent files, repository instructions, test results, or issue facts.
- [x] Do not call paid AI APIs, execute repository code, or automatically change user code.

Acceptance criteria:
- [x] Tests prove output uses only supplied/retrieved data.
- [x] Missing context is clearly marked.
- [x] Copy action and fallback behavior work in supported browsers.

## Phase 5 — Accessibility, resilience, and security

**Status: APPROVED BY MAINTAINER WITH DOCUMENTED MANUAL-REVIEW WAIVER (2026-10-21).** The maintainer explicitly directed approval of Phase 5. This is an approval of the remaining documented manual-review risks, not a claim that unperformed manual checks passed. Automated tests must still pass on the final commit. Announcements for result counts, search outcomes, rate-limit/error states (assertive), detail-refresh progress, and retry outcomes are implemented with browser regression tests. Discover, Saved, About, and the issue-detail view pass automated axe scans locally. Manual pass on 2026-10-21 (Firefox on Windows): keyboard navigation, advanced-filter disclosure, issue-detail focus/content, search success/failure, saved items, import/export, and 200% zoom PASS; a Saved-search overflow defect was found and fixed in `534bca7`. The automated Chromium responsive-overflow test passed in [run #1](https://github.com/vijay3695/V36/actions/runs/39636965181) on `16fd419`, with no document-level overflow at 320/375/768/1280px. Human visual approval is recorded at 320px and 375px; 768px/desktop visual review, contrast, long-content, and reduced-motion checks remain pending. Automated proxies do not certify full visual accessibility.

Tasks:
- [x] Semantic page structure, correct heading hierarchy, labels, keyboard navigation, and visible focus. (Axe scans, role/label browser tests, skip-link and tab-order proxy tests pass locally; visual focus confirmation remains part of manual acceptance.)
- [x] Accessible announcements for loading, results count, errors, rate limits, and retry outcomes. (Polite result-count live region, `aria-busy` during search, assertive `aria-live` for errors, polite detail-refresh progress and completion announcements; covered by four browser tests.)
- [ ] Contrast checks and responsive layout checks. (200% zoom: PASS, maintainer-reported 2026-10-21. Automated responsive overflow test covers 320/375/768/1280px; recorded proxy results report no overflow at all four widths. Human visual approval: 320px and 375px PASS; 768px and desktop visual review pending. Automated axe color-contrast passes; human contrast review remains pending.)
- [x] Automated accessibility tests for Discover, Saved, and About, plus the issue-detail view.
- [x] Manual keyboard acceptance checks documented and recorded in `docs/MANUAL_ACCEPTANCE.md` (maintainer-reported PASS on 2026-10-21; keyboard and visual checks only, no assistive technology recorded).
- [x] Safely render untrusted GitHub content using text-safe DOM APIs; no executing imported/retrieved HTML or scripts.
- [x] Validate imports and external URLs; never store tokens, credentials, or API keys.
- [x] Preserve results and saved data through request failures.
- [x] Test rate limits, failed metadata, unavailable issue details, and browser-storage errors.

Acceptance criteria:
- [x] Automated accessibility checks pass (local run on `main`: 3/3 axe scans, including the issue-detail scan inside the end-to-end flow).
- [x] Manual acceptance disposition recorded: maintainer explicitly approved Phase 5 on 2026-10-21 and accepted the documented residual manual-review risk. Human visual checks for 768px/desktop, contrast, reduced motion, and long content remain **NOT RUN**; this approval is a waiver, not test evidence.
- [x] Security-sensitive input paths have tests.
- [x] No silent data loss or fabricated fallback information.

## Phase 6 — End-to-end verification and release readiness

**Status: VERIFIED — 2026-10-21, with the maintainer-approved Phase 5 manual-review waiver recorded.** Full consolidated CI passed on candidate commit `7e91404d05e85cb24447ae5708ec21896f4a5728`: 101/101 unit tests, 42/42 browser tests, and 3/3 standalone accessibility scans. Responsive overflow automation also passed on the same commit at 320, 375, 768, and 1280 CSS pixels. No failed or skipped tests in the successful full-suite run. Human visual review at 768px/desktop, human contrast review, reduced-motion manual review, and long-content manual review remain NOT RUN and are explicitly waived for phase sign-off by the maintainer; automated results are not represented as human review.

Tasks:
- [x] Run the complete unit-test suite — 101/101 passed.
- [x] Run the complete browser E2E suite — 42/42 passed.
- [x] Run automated accessibility checks and documented manual keyboard checks — 3/3 standalone axe scans passed; maintainer-reported keyboard acceptance remains documented; residual manual visual checks waived by explicit maintainer approval.
- [x] Verify import/export, URL sharing, context packs, filters, load more, and failure states end to end — relevant mocked browser tests passed in the complete suite.
- [x] Audit documentation against recorded implementation and current test evidence; stale agent handoff/CI instructions corrected.
- [x] Audit the release checklist, project plan, manual acceptance record, release list, workflow, and latest CI failure; disposition recorded in this report.
- [x] Publish a public, auditable verification report tied to the exact tested candidate commit, listing checks, results, limitations, and waived/not-run checks.
- [x] Confirm CI is green on the exact candidate commit — [run #73](https://github.com/vijay3695/V36/actions/runs/39642076673) on `7e91404d05e85cb24447ae5708ec21896f4a5728`.
- [x] Enforce release policy — no public release was published as part of this task; publication remains a separate action.

Acceptance criteria:
- [x] Every required item has a verified result or an explicit maintainer-approved exception recorded.
- [x] No known unresolved automated release-blocking defect remains in the verified test scope.
- [x] No failed or skipped check is described as passing; the waived manual checks remain marked NOT RUN.
- [x] No public release is published before the release gate is explicitly completed.

### Phase 6 sequencing note — 2026-10-21

The maintainer explicitly directed on 2026-10-21 to approve Phase 5 and complete Phase 6. Phase 5 is approved with a documented waiver of the remaining human visual checks, not falsely recorded as performed. The long-content browser locator was corrected without weakening the assertion. Full consolidated CI passed on candidate commit `7e91404d05e85cb24447ae5708ec21896f4a5728`: 101 unit tests, 42 browser tests, and 3 standalone accessibility scans; responsive overflow checks also passed at 320/375/768/1280px. Phase 6 is VERIFIED with this explicit manual-review waiver; no release was published.
