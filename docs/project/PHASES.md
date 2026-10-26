# V36 Phases and Acceptance Criteria

<!-- RELEASE EVIDENCE SNAPSHOT: 2026-10-24. The current phase summary is below; detailed older sections are historical snapshots. -->

> **Release evidence (published 2026-10-24; documentation reviewed 2026-10-26):** The public preview [V36 v0.1.0](https://github.com/vijay3695/V36/releases/tag/v0.1.0) is published from `77b36385f3a2e9fb603d1602b451d152fda91cd7`. [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927) passed **107 unit tests, 47 browser tests, and 6 accessibility scans**; [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded; [release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176) succeeded. Per-component numeric contrast ratios for both themes are recorded in [`CONTRAST_AUDIT.md`](../testing/CONTRAST_AUDIT.md) and recalculated by [`tests/contrast-audit.test.js`](../../tests/contrast-audit.test.js) where this relative link is valid only for docs files. **No Phase 0–6 or active release/CI/deployment task remains pending.** Older status notes below describe earlier snapshots and are not the current state.


Use this file to plan and complete work phase by phase. Read `DECISIONS.md` first so scope and deferred work are clear. Keep status synchronized with `PROGRESS.md`. A phase is not complete because code exists; it is complete only when its acceptance criteria have been verified.

Statuses: **NOT STARTED**, **IN PROGRESS**, **BLOCKED**, **VERIFIED**. Only mark **VERIFIED** with evidence recorded in `PROGRESS.md`.

## Live status snapshot — 2026-10-26

| Phase | Current status | Current disposition |
|---|---|---|
| 0 — Baseline and CI | **VERIFIED** | Historical baseline tests passed; the release candidate later passed the full consolidated suite. |
| 1 — Discovery and filters | **VERIFIED** | Filters, URL round-trips, partial-result semantics, and loaded-result metadata filtering are covered by the recorded test suites. |
| 2 — Issue details/activity | **VERIFIED** | Detail view, source links, activity fields, timestamps, unavailable states, and retry behavior are covered by the recorded tests. |
| 3 — Saved/import/export | **VERIFIED** | Browser-local saves, validation, deduplication, export/import, and preservation behavior are covered by the recorded tests. |
| 4 — AI context packs | **VERIFIED** | Portable source-backed context packs disclose missing evidence and limitations; no AI API or repository execution is used. |
| 5 — Accessibility/security/resilience | **VERIFIED** | Release CI passed 107 unit tests, 47 browser tests, and 6 accessibility scans. Manual outcomes reported by the maintainer are recorded separately in `MANUAL_ACCEPTANCE.md`. Numeric contrast ratios are recorded in `CONTRAST_AUDIT.md`. |
| 6 — End-to-end verification and release | **VERIFIED; v0.1.0 PUBLISHED** | Release commit `77b36385f3a2e9fb603d1602b451d152fda91cd7`; [CI #142](https://github.com/vijay3695/V36/actions/runs/40088851927), [release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176), and [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded. |

**Current release source of truth:** [V36 v0.1.0 — Public Preview](https://github.com/vijay3695/V36/releases/tag/v0.1.0), published 2026-10-24. The release candidate passed 107 unit tests, 47 browser tests, and 6 accessibility scans. Numeric light/dark theme component ratios are documented and regression-tested. No Phase 0–6, release publication, or contrast-audit task remains pending in the recorded scope.

**Historical records below:** The detailed phase sections and older test counts preserve the sequence of work and earlier evidence. They are historical snapshots, not claims that the old commit or test count is current. Where an older paragraph says no release was published or contrast ratios were missing, that status was superseded on 2026-10-24 by the release and audit linked above.
## Phase 0 — Baseline and CI stabilization

**Status: VERIFIED.** The historical failures in runs #53–#55 were corrected. The current consolidated run [#64](https://github.com/vijay3695/V36/actions/runs/39576488647) passed all automated suites on the current `main` commit. Keep the historical failure record in `PROGRESS.md`; do not carry the obsolete BLOCKED status forward.

Tasks:
- [x] Inspect current `.github/workflows/ci.yml`, package scripts, unit tests, E2E tests, and actual failed GitHub Actions job output.
- [x] Identify the E2E failure from job output: startup auto-search rewrote the hash to Discover on the Saved route, so activating Discover did not emit a hash change and its controls remained hidden.
- [x] Fix startup route handling and confirm a green rerun; the historical route issue was corrected and subsequent consolidated CI runs passed. The original failure remains in the historical log only.
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

**Status: VERIFIED — maintainer-reported manual checks PASS (2026-10-24; automated evidence refreshed 2026-10-24).** Phase 5 was approved by the maintainer on 2026-10-21. On 2026-10-24, the maintainer reported PASS for the redesigned UI's manual checks, including responsive widths 320/375/768/1280px, 200% zoom, light/dark themes, keyboard/focus, readability/disabled controls, failure states, About/detail navigation, reduced motion, long-content stress, theme contrast, and screen reader/keyboard. Latest full CI [run #132](https://github.com/vijay3695/V36/actions/runs/40084825503) passed on main: 103/103 unit tests, 47/47 browser tests, and 6/6 accessibility scans. Automated responsive checks passed at 320/375/768/1280px and at the 640px CSS viewport used as a 200% zoom equivalent. These manual outcomes are maintainer-reported; browser/OS and assistive-technology versions were not supplied. Formal numeric per-component contrast measurement remains unconfirmed.

Tasks:
- [x] Semantic page structure, correct heading hierarchy, labels, keyboard navigation, and visible focus. (Axe scans, role/label browser tests, skip-link and tab-order proxy tests pass locally; visual focus confirmation remains part of manual acceptance.)
- [x] Accessible announcements for loading, results count, errors, rate limits, and retry outcomes. (Polite result-count live region, `aria-busy` during search, assertive `aria-live` for errors, polite detail-refresh progress and completion announcements; covered by four browser tests.)
- [x] Automated contrast and responsive layout checks. (Latest CI checks both theme palettes; responsive runs pass at 320/375/768/1280px and the 640px CSS viewport used as a 200% zoom equivalent. The maintainer reported passing manual review of the listed redesigned UI checks on 2026-10-24; the maintainer has explicitly confirmed PASS for reduced motion, long-content stress, theme contrast, and screen reader/keyboard checks; At the time of this earlier snapshot the numeric audit was subsequently completed; see `CONTRAST_AUDIT.md`.)
- [x] Automated accessibility tests for Discover, Saved, and About, plus the issue-detail view.
- [x] Manual keyboard acceptance checks documented and recorded in `MANUAL_ACCEPTANCE.md` (maintainer-reported PASS on 2026-10-21; keyboard and visual checks only, no assistive technology recorded).
- [x] Safely render untrusted GitHub content using text-safe DOM APIs; no executing imported/retrieved HTML or scripts.
- [x] Validate imports and external URLs; never store tokens, credentials, or API keys.
- [x] Preserve results and saved data through request failures.
- [x] Test rate limits, failed metadata, unavailable issue details, and browser-storage errors.

Acceptance criteria:
- [x] Automated accessibility checks pass (local run on `main`: 3/3 axe scans, including the issue-detail scan inside the end-to-end flow).
- [x] Manual acceptance disposition recorded: maintainer approved Phase 5 on 2026-10-21 and later explicitly confirmed PASS for responsive layouts, 200% zoom, theme contrast, reduced motion, long-content stress, and screen reader/keyboard checks on 2026-10-24. Formal numeric per-component contrast measurement remains unconfirmed.
- [x] Security-sensitive input paths have tests.
- [x] No silent data loss or fabricated fallback information.

## Phase 6 — End-to-end verification and release readiness

**Status: VERIFIED — current main candidate `7a3faefbcab7e88ce7cbf1f8a9a4a0506b20b09d`, with the maintainer-approved Phase 5 manual-review waiver recorded.** [Full CI](https://github.com/vijay3695/V36/actions/runs/40080705257) passed 103/103 unit tests, 47/47 browser tests, and 6/6 accessibility scans. [Responsive checks](https://github.com/vijay3695/V36/actions/runs/40080705237) passed at 320/375/768/1280px and the 640px zoom-equivalent viewport. [Pages build/deployment](https://github.com/vijay3695/V36/actions/runs/40080705112) succeeded. The maintainer subsequently reported passing manual review of the listed redesigned UI flows on 2026-10-24 and later explicitly confirmed PASS for reduced-motion, long-content stress, light/dark theme contrast, and screen reader/keyboard checks. The numeric audit was subsequently completed; see `CONTRAST_AUDIT.md`.

Tasks:
- [x] Run the complete unit-test suite — 101/101 passed.
- [x] Run the complete browser E2E suite — 42/42 passed.
- [x] Run automated accessibility checks and documented manual keyboard checks — 3/3 standalone axe scans passed; maintainer-reported keyboard acceptance remains documented; residual manual visual checks waived by explicit maintainer approval.
- [x] Verify import/export, URL sharing, context packs, filters, load more, and failure states end to end — relevant mocked browser tests passed in the complete suite.
- [x] Audit documentation against recorded implementation and current test evidence; stale agent handoff/CI instructions corrected.
- [x] Audit the release checklist, project plan, manual acceptance record, release list, workflow, and latest CI failure; disposition recorded in this report.
- [x] Publish a public, auditable verification report tied to the exact tested candidate commit, listing checks, results, limitations, and waived/not-run checks.
- [x] Confirm CI is green on the exact candidate commit — [run #73](https://github.com/vijay3695/V36/actions/runs/39642076673) on `7e91404d05e85cb24447ae5708ec21896f4a5728`.
- [x] Enforce release policy — the v0.1.0 public preview was subsequently published after the release gate passed; see `RELEASE_VERIFICATION.md`.

Acceptance criteria:
- [x] Every required item has a verified result or an explicit maintainer-approved exception recorded.
- [x] No known unresolved automated release-blocking defect remains in the verified test scope.
- [x] No failed, skipped, or outcome-unspecified check is described as passing. Latest manual checks with unspecified outcomes are documented without a PASS/FAIL claim.
- [x] No public release is published before the release gate is explicitly completed.

### Phase 6 sequencing note — 2026-10-21

The maintainer explicitly directed on 2026-10-21 to approve Phase 5 and complete Phase 6. The long-content browser locator was corrected without weakening the assertion. Since then, the maintainer explicitly confirmed PASS for the listed manual acceptance checks on 2026-10-24. Latest consolidated CI run #132 passed on main with 103 unit tests, 47 browser tests, and 6 accessibility scans; responsive overflow checks also passed at 320/375/768/1280px. Phase 6 remains VERIFIED. The v0.1.0 public preview was subsequently published and the numeric audit completed; see `RELEASE_VERIFICATION.md` and `CONTRAST_AUDIT.md`.
