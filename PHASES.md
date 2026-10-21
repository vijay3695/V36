# V36 Phases and Acceptance Criteria

Use this file to plan and complete work phase by phase. Read `DECISIONS.md` first so scope and deferred work are clear. Keep status synchronized with `PROGRESS.md`. A phase is not complete because code exists; it is complete only when its acceptance criteria have been verified.

Statuses: **NOT STARTED**, **IN PROGRESS**, **BLOCKED**, **VERIFIED**. Only mark **VERIFIED** with evidence recorded in `PROGRESS.md`.

## Live status snapshot — 2026-10-21

| Phase | Current status | What is done | What remains |
|---|---|---|---|
| 0 — Baseline and CI | **VERIFIED** | [Run #56](https://github.com/vijay3695/V36/actions/runs/39573889300): 59/59 unit tests, 17/17 browser tests, and 3/3 standalone accessibility checks passed in one workflow job. | Re-check on each subsequent commit; investigate any new failure. |
| 1 — Discovery and filters | **IN PROGRESS — not verified** | Search, pagination, custom dates, push age, star bounds, share URLs and unknown-metadata messaging are implemented with tests. | Verify full behavior after Phase 0 is green; inspect remaining API/filter edge cases. |
| 2 — Issue details/activity | **IN PROGRESS — not verified** | Detail view, source links, activity fields, fetch timestamps and related-work search links exist. | Verify inaccessible/closed/moved cases, rate-limit retry and freshness behavior. |
| 3 — Saved/import/export | **IN PROGRESS — not verified** | Browser-local saved issues/searches, validated import, dedupe, export and merge behavior exist. | Verify all storage/import edge cases in a green full run. |
| 4 — AI context packs | **IN PROGRESS — not verified** | Context-pack generation, source links, contribution guide and missing-source disclosure exist. | Verify copy fallback, source bounds and unavailable-source behavior. |
| 5 — Accessibility/security/resilience | **IN PROGRESS — not verified** | Axe scans and keyboard/security/storage/rate-limit regression tests exist. | Green automation plus documented manual keyboard and screen-reader checks. |
| 6 — Release readiness | **BLOCKED** | Release gate and acceptance checklist are documented. | Complete all prior phases, publish exact-commit verification report; no release until all blockers pass. |

## Phase 0 — Baseline and CI stabilization

**Current status: BLOCKED — Phase 0 passed on [run #52](https://github.com/vijay3695/V36/actions/runs/39573103139), but later storage-safety commits introduced test failures. Run #53 and #54 failed because the storage module was accidentally replaced by test content; run #55 then failed on a duplicate CATEGORIES declaration. Those exact errors are being corrected before the next full run. Do not treat the current head as verified until it passes.**

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

Tasks:
- [ ] Search open GitHub issues and support pagination/load-more.
- [ ] Compact result cards and explicit loading, empty, partial-results, unavailable-data, error, and rate-limit states.
- [ ] Filters: language metadata, official labels, issue type, creation age/custom bounds, last-update age/custom bounds, latest commit/push age/custom bounds, popularity presets and exact min/max stars, inferred contribution category, and sorting.
- [ ] AND semantics for selected filters and visible explanation of partial coverage.
- [ ] Preserve older projects by default; unknown dates remain Unknown.
- [ ] Clearly separate official labels from conservative inferred categories.
- [ ] Shareable URLs encode filters only and restore them safely.
- [ ] Unit tests for filter logic, date boundaries, URL encode/decode, category inference, unknown metadata, and pagination/partial coverage.

Acceptance criteria:
- [ ] Each filter has tests for positive, negative, and missing-data cases.
- [ ] Loaded-result filters disclose incomplete coverage.
- [ ] Search failures do not erase already-loaded results.
- [ ] No unsupported claim that all GitHub results have been evaluated.

## Phase 2 — Issue details and activity evidence

Tasks:
- [ ] Dedicated issue-detail view.
- [ ] Show issue description, canonical link, labels, issue dates, repository details, stars, and available activity evidence.
- [ ] Fetch supplemental repository activity only for displayed results / selected details to conserve quota.
- [ ] Show data fetch time where applicable and identify unavailable fields.
- [ ] Provide GitHub search links for related issues and PRs; do not claim automatic duplicate detection.
- [ ] Handle closed, moved, deleted, or inaccessible issue references honestly.

Acceptance criteria:
- [ ] Unknown and unavailable values are not guessed.
- [ ] Stars are presented as popularity, not repository health.
- [ ] Rate limits stop additional requests, preserve results, explain the situation, and allow manual retry.

## Phase 3 — Saved issues/searches and portability

Tasks:
- [ ] Dedicated Saved view.
- [ ] Save/remove issues and search presets in browser local storage; no account/backend.
- [ ] Preserve references when issues close or become inaccessible.
- [ ] Export/import saved data with schema validation and input-size limits.
- [ ] Deduplicate canonical issue identities and normalize saved searches.
- [ ] Report duplicates/invalid entries; preserve unrelated data and never silently overwrite it.
- [ ] Explain local-storage limitations and privacy implications.
- [ ] Test malformed, oversized, duplicate, partial, and valid import files.

Acceptance criteria:
- [ ] Saved data survives navigation/reload in normal browser use.
- [ ] Import errors do not corrupt existing saved data.
- [ ] Private data and credentials are never included in shareable search URLs.

## Phase 4 — AI context packs

Tasks:
- [ ] Generate a copyable, provider-portable prompt from retrieved context.
- [ ] Include issue title/description/labels/link and available README/contribution instructions/source-file links.
- [ ] List source links, fetch times, unavailable context, and limitations.
- [ ] Keep incomplete packs usable only when missing context is explicitly disclosed.
- [ ] Do not invent files, repository instructions, test results, or issue facts.
- [ ] Do not call paid AI APIs, execute repository code, or automatically change user code.

Acceptance criteria:
- [ ] Tests prove output uses only supplied/retrieved data.
- [ ] Missing context is clearly marked.
- [ ] Copy action and fallback behavior work in supported browsers.

## Phase 5 — Accessibility, resilience, and security

Tasks:
- [ ] Semantic page structure, correct heading hierarchy, labels, keyboard navigation, and visible focus.
- [ ] Accessible announcements for loading, results count, errors, rate limits, and retry outcomes.
- [ ] Contrast checks and responsive layout checks.
- [ ] Automated accessibility tests for Discover, Saved, and About.
- [ ] Manual keyboard and screen-reader acceptance checks documented.
- [ ] Safely render untrusted GitHub content using text-safe DOM APIs; no executing imported/retrieved HTML or scripts.
- [ ] Validate imports and external URLs; never store tokens, credentials, or API keys.
- [ ] Preserve results and saved data through request failures.
- [ ] Test rate limits, failed metadata, unavailable issue details, and browser-storage errors.

Acceptance criteria:
- [ ] Automated accessibility checks pass.
- [ ] Manual checks are complete and recorded; automation alone is not treated as proof of full accessibility.
- [ ] Security-sensitive input paths have tests.
- [ ] No silent data loss or fabricated fallback information.

## Phase 6 — End-to-end verification and release readiness

Tasks:
- [ ] Run the complete unit-test suite.
- [ ] Run the complete browser E2E suite.
- [ ] Run automated accessibility checks and documented manual keyboard/screen-reader checks.
- [ ] Verify import/export, URL sharing, context packs, filters, load more, and failure states end to end.
- [ ] Verify documentation matches actual behavior.
- [ ] Audit all unchecked items in this file and `docs/PROJECT_PLAN.md`.
- [ ] Publish a public release verification report tied to the exact release-candidate commit, listing checks, results, limitations, and failed/skipped checks.
- [ ] Confirm CI is green on the exact candidate commit.
- [ ] Release only after all release-blocking checks pass.

Acceptance criteria:
- [ ] Every required checkbox in the plan/spec is verified with evidence.
- [ ] No known release-blocking defects remain.
- [ ] No failed/skipped check is described as passing.
- [ ] No public release before explicit completion of the release gate.
