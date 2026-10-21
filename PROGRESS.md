# V36 Progress Log

> Update this file with every implementation change. Record facts and evidence, not optimism. If a test was not run, write **NOT RUN**. If it failed, write **FAILED** and link the run. Do not mark a phase VERIFIED until all its acceptance criteria are met.

## Current snapshot

- **Branch:** `main` (the repository keeps a single branch; all work is committed directly to `main`)
- **Project status:** In development; not release-ready.
- **Current work phase:** Phase 6 — End-to-end verification and release readiness (**pre-release audit only**). Per maintainer direction on 2026-10-21, remaining Phase 5 tests are deferred to a later pass; Phase 5 is still IN PROGRESS and this does not waive its acceptance criteria. Phases 0–4 retain their recorded VERIFIED status (0/1 with GitHub Actions history; 2–4 locally).
- **Latest local evidence (`main`):** 95/95 unit tests, 37/37 browser tests, 3/3 standalone axe scans at commit `ac5306e`, including four announcement/live-region tests, the Saved-search layout test, the star-input space test, and the issue-detail axe scan inside the end-to-end flow.
- **CI / Actions reality:** `.github/workflows/ci.yml` is present on `main` and runs unit, browser, and standalone accessibility checks in one job. Latest run [#69](https://github.com/vijay3695/V36/actions/runs/39638495312) on commit `998670ff6cf91d00a72c91343b8a70ddb7b47d95` — **FAILED** during browser regression tests; unit tests passed and the standalone accessibility step was skipped. Do not treat this commit as CI-verified.
- **Release blocker:** The release gate requires CI to pass on the exact release candidate and all Phase 5 acceptance criteria to be met. CI is active but currently red, and Phase 5 follow-up tests are explicitly deferred by the maintainer. No release is authorized.
- **Husky hooks:** pre-commit runs `npm test`; pre-push runs `npm run test:all`.
- **Last documentation commit before this work:** `0638fb9` — "docs: remove screen-reader requirement per maintainer".
- **This file's purpose:** handoff state for the next coding agent. Re-check the real branch, tree, and Actions state before relying on this snapshot.

## Verified observations

- [x] Repository contains the static-first app (`index.html`), `package.json`, `playwright.config.js`, and unit/browser tests.
- [x] Package scripts define `npm test`, `npm run test:e2e`, `npm run test:a11y`, and `npm run test:all`.
- [x] `main` contains the consolidated `.github/workflows/ci.yml`; latest run is recorded as failed in the current snapshot.
- [x] Husky local hooks are configured: unit tests before commit, bulk tests before push.
- [x] Local `npm test` passes 95/95 on `main`.
- [x] Local browser suite passes 37/37 on `main`.
- [x] Local standalone axe scans pass 3/3 on `main`; the issue-detail view is scanned inside the end-to-end flow.
- [x] The historical storage-identity failure (#67) was fixed in `53907b9`; the current distinct failure is browser regression coverage on `998670f`.

## Feature status

These are **not yet verified as complete** merely because related code exists.

| Area | Status | Evidence / next action |
|---|---|---|
| App shell and Discover/Saved/About navigation | IMPLEMENTED, VERIFIED LOCALLY | Browser suite and axe scans pass on `main` |
| GitHub issue search and load-more | IMPLEMENTED, VERIFIED LOCALLY | Mocked search, pagination, partial-result and empty states covered |
| Search filters and category inference | IMPLEMENTED, VERIFIED LOCALLY | Unit filter tests and URL round-trip browser tests pass |
| Issue details and activity metadata | IMPLEMENTED, VERIFIED LOCALLY | Detail refresh, fetch times, unavailable/closed/404 paths covered |
| Saved issues and searches | IMPLEMENTED, VERIFIED LOCALLY | Local storage, reload, closed/inaccessible references covered |
| Import/export and duplicate handling | IMPLEMENTED, VERIFIED LOCALLY | Malformed/oversized/duplicate imports and data preservation covered |
| AI context packs | IMPLEMENTED, VERIFIED LOCALLY | Source links, missing context and copy fallback covered; packs now state evidence completeness and use neutral limitations (`ac5306e`) |
| Shareable search URLs | IMPLEMENTED, VERIFIED LOCALLY | Filter round-trip tests; no saved data or credential-like values |
| Automated accessibility | PASS LOCALLY | 3/3 axe scans (Discover, Saved, About) plus detail-view scan in E2E |
| Accessible announcements | IMPLEMENTED, PASS LOCALLY | Result-count live region, `aria-busy`, assertive errors, detail-refresh announcements |
| Manual keyboard/contrast/zoom checks | PARTIAL — keyboard navigation, advanced-filter disclosure, focus/no-trap, search success and failure, saved items, import/export, issue detail, and 200% zoom PASS; four defects fixed and re-tested; contrast, responsive widths, long content, reduced motion NOT RUN | Continue from `docs/MANUAL_ACCEPTANCE.md` with the remaining four checks |
| CI / release readiness | BLOCKED | No workflow on `main`; CI-vs-no-Actions decision required; manual acceptance pending |

## Immediate next actions

1. Complete the remaining manual checks in `docs/MANUAL_ACCEPTANCE.md` (keyboard-only, contrast, responsive widths, long content, reduced motion) and record environment, commit SHA, and outcome. 200% zoom is already recorded as PASS (maintainer-reported 2026-10-21). Automation cannot substitute.
2. The maintainer resolves the CI conflict: `DECISIONS.md` still requires a passing GitHub Actions run, but the workflow was removed in `ad8379b`.
3. Keep all work on `main`; do not create side branches for these tasks.
4. Do not mark Phase 5 VERIFIED or Phase 6 complete until the manual record and CI decision are settled.

## Work log

### 2026-10-21 — AI context pack made self-describing and rate-limit honest (commit `ac5306e`)

- Problem reported from a rate-limited session: the pack showed `Repository Name: Unavailable` although the issue URL identified the repository, listed raw API error text including a transient "Retry after 8:59:32 pm", and never stated that the pack was incomplete.
- Added an **Evidence completeness** section: `COMPLETE — …` only when repository metadata, README, contribution guide, source-file listing, latest commit and a fresh issue refresh were all retrieved; otherwise `INCOMPLETE — not retrieved: <list>` plus a neutral reason (rate limit, failed requests, or evidence not exposed).
- Repository identity now falls back to `owner/repo` from the issue URL and is labelled "identity from the issue URL; repository metadata was not retrieved" — never presented as fetched metadata.
- Issue data now states provenance: `Issue data fetched: <timestamp>` or `Issue data: from earlier loaded results; refresh not completed`.
- Raw API error strings are gone from the artifact; the limitations section lists only which sources were not retrieved.
- Missing fetch timestamps now read `Not retrieved` instead of `Unknown`.
- Tests: three new unit tests (rate-limited completeness/identity/no raw errors, complete-pack labelling, invalid identity rejection) plus browser assertions that generate a pack after a 403 repository response. Suite: 95/95 unit, 37/37 browser, 3/3 axe.
- Human re-test of the new pack output pending.


### 2026-10-21 — Related-work links fixed: no more `repo:undefined` (commit `28d0768`)

- Manual pass found the detail view's Related-work links built as `repo:undefined <title>` whenever repository metadata was unavailable (for example after a rate limit), and the pull-request link pointed at the issues result filter.
- Fix: new `relatedSearchUrl()` in `filters.js` validates an `owner/repo` identity, omits the `repo:` qualifier when the repository is unknown, truncates titles at 100 characters, and URL-encodes the query; the PR link now uses `type=pullrequests`.
- The detail view derives repository identity from `repository_url` or the issue's `html_url` when `repo.full_name` is missing.
- Tests: three unit tests for link construction (no `undefined`, correct result type, truncation/blank fallback) and a browser test where repository metadata returns 403 — the links still resolve to `repo:acme/demo`.
- Local suite: 92/92 unit, 37/37 browser, 3/3 axe.
- Human re-tests of this fix and the star-input fix are pending. Rate-limit/unknown-field behaviour and the AI context pack contents are queued as the next problem to address.


### 2026-10-21 — Advanced filters PASS; star-input space defect fixed (commit `7bd7d45`)

- Manual pass update (maintainer, Firefox on Windows): the "Custom date ranges and exact star counts" disclosure opens on Space/Enter, its fields are reachable, and it collapses — recorded **PASS**.
- Defect found: typing a space into "Minimum stars" or "Maximum stars" left the number field in an invalid state, so Firefox reported "Please enter a number" and blocked the search from submitting.
- Fix: spaces are ignored while typing in those two fields and stripped from pasted values, so a leading space can no longer block submission. A regression test types `" 100"` and `" 900"`, asserts the values become `100`/`900`, and confirms the search submits.
- Local suite: 89/89 unit, 36/36 browser, 3/3 axe.
- Human re-test of the Saved-search and star-input fixes still pending; manual acceptance remains PARTIAL.


### 2026-10-21 — Saved-search layout defect fixed; manual pass recorded (commit `534bca7`)

- Manual pass (maintainer, Firefox on Windows, preview build `e381197`): skip link, tab order, visible focus/no trap, search submit/loading/results, offline failure preservation, saved items and import/export **PASS**; 200% zoom **PASS**.
- Defect found during that pass: Saved-search rows rendered raw `JSON.stringify(filters)` with no wrapping, so long filter text overflowed the card and pushed "Run search"/"Remove" outside it.
- Fix: new `describeFilters()` readable summary used on the Saved page; saved-search rows and text now wrap; actions sit in their own flex container. Regression test at 320px asserts the row does not overflow and both buttons remain inside the card.
- Local suite after the fix: 89/89 unit (3 new `describeFilters` tests), 35/35 browser (1 new layout test), 3/3 axe.
- Manual checks still outstanding: advanced-filter disclosure, issue-detail keyboard pass, contrast, responsive widths, long content, reduced motion, plus a human re-test of this fix.


### 2026-10-21 — Manual acceptance: 200% zoom recorded PASS (maintainer-reported)

- The maintainer reported that the 200% zoom check passed.
- Recorded it in `docs/MANUAL_ACCEPTANCE.md` as a maintainer-reported PASS dated 2026-10-21 in Firefox on Windows, with the browser/OS version numbers and the exact commit SHA marked **not recorded** rather than invented.
- Replaced the automated-proxy "200% zoom: NOT PERFORMED" line with a pointer to the manual result.
- Outcome is now **PARTIAL**: 200% zoom PASS; keyboard-only, contrast, responsive widths, long-content, and reduced-motion checks remain NOT RUN.
- Phase 5 remains IN PROGRESS; no other manual check was marked complete, and no automated suite was re-run for this documentation-only change.


### 2026-10-21 — Phase 5 automated completion: announcements, manual-record correction, and truth pass (commit `363fb3a` on `main`)

- Added accessible announcements: `#results-meta` is now a polite `role="status"` live region for loaded-result counts; `#results` exposes `aria-busy` while a search is pending; `#status` switches to `aria-live="assertive"` for error/rate-limit messages; the detail view announces "Refreshing issue and repository evidence…" politely and announces completion or unavailable-evidence outcomes.
- Added four browser regression tests: result-count and detail-outcome live regions, assertive failure announcements that preserve prior results, pending-search `aria-busy`, and detail-refresh progress before refreshed evidence.
- Scoped existing status assertions to `#status` because `#results-meta` is now a second `role="status"` region; assertions were made more specific, not weaker.
- Corrected `docs/MANUAL_ACCEPTANCE.md`: removed the then-unrecorded "200% zoom: PASS (reported by reviewer)" entry (it had no reviewer, environment, or commit recorded) and stated that automated proxies are not sign-off. The maintainer later confirmed the 200% zoom pass directly; it is now recorded in the entry above, with the missing details marked not recorded.
- Local runs on `main` (Chromium): `npm test` 86/86; `npx playwright test --workers=2` 34/34; `npx playwright test tests/e2e/accessibility.spec.js` 3/3. Eight full browser-suite runs passed at `--workers=2`/`--workers=4`; one other run under parallel load had a single failure in the long mocked flow whose error text was not captured, and it was not reproduced in the seven runs that followed. The documented bulk command `npm run test:all` was also attempted, but its default parallelism (30 Playwright workers on this host) exceeded the sandbox's 6 GiB memory limit and the run was killed before producing output; the same three suites were therefore verified with capped workers. The browser runs required locally extracted Chromium libraries plus fonts because this sandbox image ships neither (the renderer crashed with zero fonts installed); this is an environment-only workaround and added no dependency to the repository.
- Corrected stale CI claims: `main` contains no `.github/workflows/` directory (workflow deleted in `ad8379b`); the newest Actions run is #67, FAILED on `e35d421` in the storage identity test, which `53907b9` fixed — that test passes locally. The CI requirement in `DECISIONS.md`/`docs/ACCEPTANCE_CHECKLIST.md` now conflicts with the workflow removal and needs a maintainer decision.
- Phase 5 remains IN PROGRESS: every automated criterion passes; human manual acceptance is still NOT RUN. Evidence commit: `363fb3a` on `main`.


### 2026-10-21 — Phase 4 verified locally (no GitHub Actions)

- Audited Phase 4 acceptance criteria against implementation and tests (context-pack.test.js plus E2E copy/fallback coverage).
- Full bulk suite passed: `npm run test:all` — 86/86 unit, 25/25 E2E, 3/3 a11y.
- Updated `PHASES.md` to mark Phase 4 VERIFIED with local evidence.

### 2026-10-21 — Phase 3 verified locally (no GitHub Actions)

- Audited Phase 3 acceptance criteria against implementation and tests.
- Storage bug fix from Phase 2 remains in place; full bulk suite passed: `npm run test:all` — 86/86 unit, 25/25 E2E, 3/3 a11y.
- Updated `PHASES.md` to mark Phase 3 VERIFIED with local evidence.
- No GitHub Actions triggered; push performed only after workflow removal (already in place).

### 2026-10-21 — Phase 2 verified locally (no GitHub Actions)

- Audited Phase 2 acceptance criteria against the implementation and tests.
- Fixed the storage normalization bug (`js/storage.js`): issue/PR numbers are now derived from the validated canonical URL instead of trusting a conflicting imported `number`.
- Ran the full bulk suite locally: `npm run test:all` passed — 86/86 unit tests, 25/25 browser E2E tests, 3/3 standalone accessibility checks.
- Updated `PHASES.md` to mark Phase 2 VERIFIED with local evidence.
- GitHub Actions were not triggered. Push remains blocked by the Actions conflict; no push performed.

### 2026-10-21 — Closed/unavailable issue handling and manual acceptance guide (pending CI)

- Strengthened the 404 detail scenario to save the issue first, then verify the saved reference remains visible and clearly says its current status has not been checked.
- Added an E2E scenario where a search snapshot is open but the refreshed issue is closed; detail view must show the current closed state, close date, updated body and official labels, while the saved reference remains intact.
- Added `docs/MANUAL_ACCEPTANCE.md` with keyboard-only, responsive, 200% zoom, contrast, reduced-motion and error-state checks. It is explicitly marked NOT PERFORMED until a human reviewer records actual results; automated CI cannot perform this manual sign-off.
- Linked the manual acceptance checklist from README and the release acceptance checklist. Phase 2 remains IN PROGRESS and Phase 5 remains pending human manual acceptance.


### 2026-10-21 — Phase 2 detail evidence improvements (retry-time verified)

- Added a dedicated Official issue labels section to the detail view, separate from inferred contribution categories.
- Rate-limited detail/activity failures now disclose GitHub retry timing when supplied, while retaining the manual retry action.
- Added regression assertions for displayed official labels and rate-limit retry-time messaging.
- [Run #61](https://github.com/vijay3695/V36/actions/runs/39575435286) and [run #62](https://github.com/vijay3695/V36/actions/runs/39575815864) each passed 75/75 unit tests but failed one browser assertion requiring visible retry time. The first fixture used x-ratelimit-reset; the second used Retry-After, but neither exposed the custom header through CORS. [Run #63](https://github.com/vijay3695/V36/actions/runs/39576107714) passed after adding `Access-Control-Expose-Headers`; the retry-time assertion remains strict.


### 2026-10-21 — Secondary languages and safe shareable URLs (passed CI)

- Added E2E coverage proving a repository can match a non-primary language when GitHub language metadata is available.
- Added E2E coverage proving an unavailable language-metadata response does not silently discard an issue and clearly marks the filter as uncertain.
- Added E2E coverage that shareable search URLs contain filter settings only and never include saved issue titles or credential-like query parameters.
- [Run #60](https://github.com/vijay3695/V36/actions/runs/39575117877) passed: 75/75 unit tests, 24/24 browser tests, and 3/3 standalone accessibility checks. Phase 1 acceptance criteria are marked VERIFIED in PHASES.md.


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


### 2026-10-21 — Corrected phase handoff; retry-time follow-up deferred

- Verified current `main` commit `7d803a07daf39c7af1090d7394fc22f8c8044bed` and latest consolidated GitHub Actions run [#64](https://github.com/vijay3695/V36/actions/runs/39576488647).
- Run #64 passed 75/75 unit tests, 25/25 browser tests, and 3/3 standalone accessibility checks in one job.
- The retry-time test remains in the suite. The earlier failures (#61/#62) and subsequent green runs (#63/#64) are recorded; no more work is being spent on this assertion in the current batch.
- Corrected the obsolete Phase 0 BLOCKED paragraph and stale progress snapshot. Phase 2 stays IN PROGRESS until its remaining acceptance criteria are audited; current work moves to Phase 3.
- Next: inspect saved-item/import/export behavior, address meaningful edge cases in a bundled batch, and monitor the consolidated CI run.


### 2026-10-21 — Phase 3 portability regression coverage (CI pending)

- Moved active work to Phase 3 after correcting the phase handoff; the retry-time test remains untouched and deferred for a later audit.
- Added 11 focused storage/import regression tests covering lookalike hosts and unsupported routes, canonical URLs, issue identity, bounded imported strings, malformed backup structures, oversized search arrays, duplicate import diagnostics, merge precedence, equivalent saved searches, invalid filter values, and preservation of unrelated saved references.
- Local test execution: **NOT RUN** in this environment. The changes must pass the single consolidated GitHub Actions workflow before being treated as verified.
- Next: inspect the Actions result; fix any real failure in the next coherent batch, then continue Phase 3 edge cases.


### 2026-10-21 — Phase 6 pre-release audit started; Phase 5 follow-up deferred

- Maintainer direction: move to Phase 6 now and defer remaining Phase 5 tests to a later pass. Phase 5 remains **IN PROGRESS**; its acceptance criteria have not been waived.
- Audited current repository phase records, acceptance checklist, manual acceptance record, package scripts, and CI workflow on `main`.
- Current consolidated workflow: `.github/workflows/ci.yml`; one job runs unit tests, browser regression tests, then standalone accessibility scans.
- Latest CI: [run #69](https://github.com/vijay3695/V36/actions/runs/39638495312), commit `998670ff6cf91d00a72c91343b8a70ddb7b47d95`. Unit tests **PASS**; browser regression tests **FAIL**; standalone accessibility scans **SKIPPED** because the prior step failed. No green full-suite result on this commit.
- No Phase 5 test failure was fixed in this batch; the failure is intentionally left for the deferred Phase 5 follow-up rather than being misreported as passed.
- Phase 6 is active for the documentation and release-acceptance audit only. Release readiness remains **BLOCKED** until Phase 5 acceptance is completed and a consolidated CI run passes on the exact candidate commit.
- Next: continue the Phase 6 audit of the acceptance checklist and documentation against actual implementation/test evidence, without publishing a release or marking incomplete criteria as verified.


### 2026-10-21 — Phase 6 release-readiness audit batch

- Audited the latest `main` snapshot, release list, full acceptance checklist, project plan, manual acceptance record, package scripts, workflow, recent workflow history, and actual latest CI job log.
- Exact audit baseline: `3f86bf81a2c45d14972c2d3bb3669db6b80c2d63`. No GitHub Releases are published.
- CI run [#71](https://github.com/vijay3695/V36/actions/runs/39640377631): unit tests **PASS**; browser suite **41 passed / 1 failed**; standalone accessibility scan **SKIPPED**. Failure: `tests/e2e/manual-check.spec.js:125` uses a non-unique text locator for `accessibility-resilience-label-24`, which matches both the result-card label and issue detail. This is a test-selector ambiguity; the test itself is still failing and has not been altered because the maintainer deferred remaining Phase 5 tests.
- Confirmed manual acceptance remains partial: human visual review at 320/375px and 200% zoom/keyboard results are recorded as passed; 768px/desktop human visual review, contrast review, reduced-motion review, and long-content manual review remain pending. Automated document overflow at 320/375/768/1280 passed on an earlier commit, but it is not visual sign-off.
- Confirmed there are no published releases. The full release gate remains blocked by incomplete Phase 5 acceptance and non-green CI.
- Corrected stale Phase 5/removed-workflow claims in `AGENTS.md`, consolidated CI to the documented single `npm run test:all` command, and added `docs/PHASE_6_AUDIT.md` as an auditable pre-release report. No app behavior or test assertion was changed in this batch.
- Phase 6 audit/documentation tasks are complete for this batch, but Phase 6 is **not VERIFIED** and the project is **not release-ready**. Remaining next action is the deferred Phase 5 follow-up (make the locator unambiguous, rerun the full test suite, then complete outstanding manual acceptance); only after those gates pass can the final release-candidate verification occur.


### 2026-10-21 — Maintainer Phase 5 approval and Phase 6 completion run

- Maintainer instruction: **approve Phase 5 and complete Phase 6 now**. Phase 5 is recorded as approved with an explicit waiver for remaining human visual checks; those checks remain NOT RUN and are not mislabeled as passed.
- Fixed the sole known browser-test failure without weakening coverage: the long-content resilience test now scopes the final-label assertion to `#detail-content`, where the detail-view label is expected.
- Updated `PHASES.md`, `docs/MANUAL_ACCEPTANCE.md`, and `docs/PROJECT_PLAN.md` to record the approval/waiver accurately, and updated this log and the Phase 6 audit report.
- Next verification is the consolidated `npm run test:all` GitHub Actions run on the commit containing this change. Phase 6 can only be declared complete after that run passes; no test result is assumed in advance.
