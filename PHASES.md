# V36 Phases and Acceptance Criteria

Use this file to plan and complete work phase by phase. Keep status synchronized with `PROGRESS.md`. A phase is not complete because code exists; it is complete only when its acceptance criteria have been verified.

Statuses: **NOT STARTED**, **IN PROGRESS**, **BLOCKED**, **VERIFIED**. Only mark **VERIFIED** with evidence recorded in `PROGRESS.md`.

## Phase 0 — Baseline and CI stabilization

**Initial status: BLOCKED — latest reported CI run has an end-to-end failure.**

Tasks:
- [ ] Inspect current `.github/workflows/ci.yml`, package scripts, all unit tests, all E2E tests, and actual failed GitHub Actions job output.
- [ ] Reproduce the E2E failure locally or in a diagnostic CI run.
- [ ] Fix the underlying failure; do not weaken or delete meaningful tests just to get a green run.
- [ ] Run `npm test`, `npm run test:e2e`, and `npm run test:a11y` (the accessibility script may overlap with E2E; record what was actually run).
- [ ] Ensure CI reports actionable failure output and does not rely on a missing lockfile.
- [ ] Confirm a new run on the resulting commit and record its URL and per-job result in `PROGRESS.md`.

Acceptance criteria:
- [ ] Unit tests pass.
- [ ] E2E tests pass.
- [ ] Accessibility automation passes.
- [ ] The actual commit under test is recorded.
- [ ] No failures are hidden by skipped tests, weakened assertions, or unverified claims.

## Phase 1 — Core discovery and filtering

Tasks:
- [ ] Search open GitHub issues and support pagination/load-more.
- [ ] Compact result cards and explicit loading, empty, partial-results, unavailable-data, error, and rate-limit states.
- [ ] Filters: language metadata, official labels, issue type, creation age, last-update age, latest commit/push age, popularity, inferred contribution category, and sort order.
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
