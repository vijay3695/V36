# V36 Manual Acceptance Checklist

<!-- RELEASE EVIDENCE SNAPSHOT: 2026-10-24. Maintainer-reported manual outcomes are recorded below; older entries are historical snapshots. -->

> **Current verified status (2026-10-24):** The public preview [V36 v0.1.0](https://github.com/vijay3695/V36/releases/tag/v0.1.0) is published from `77b36385f3a2e9fb603d1602b451d152fda91cd7`. [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927) passed **107 unit tests, 47 browser tests, and 6 accessibility scans**; [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded; [release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176) succeeded. Per-component numeric contrast ratios for both themes are recorded in [`docs/CONTRAST_AUDIT.md`](CONTRAST_AUDIT.md) and recalculated by [`tests/contrast-audit.test.js`](../tests/contrast-audit.test.js) where this relative link is valid only for docs files. **No Phase 0–6 or active release/CI/deployment task remains pending.** Older status notes below describe earlier snapshots and are not the current state.


## Latest maintainer follow-up — 2026-10-24

The maintainer confirmed PASS for all four checks in a subsequent message. These are maintainer-reported outcomes; browser/OS and assistive-technology versions, detailed measurements, and the exact test data were not supplied and are not inferred.

- [x] Reduced-motion preference — **PASS**.
- [x] Long-content stress test (long title/body, many labels, empty description, unavailable-data list) — **PASS**.
- [x] Light/dark theme contrast — **PASS** for the reported theme contrast check. Numeric per-component contrast ratios are documented in `CONTRAST_AUDIT.md`; the automated audit is distinct from this maintainer-reported manual theme review.
- [x] Screen reader and keyboard — **PASS**, as reported by the maintainer. The specific screen reader, browser/OS combination, and detailed announcement results were not supplied.

The pass statuses above reflect the maintainer's explicit report; they do not imply unreported measurements, test configurations, or additional coverage.

## New maintainer manual verification — 2026-10-24 (after UI redesign)

The maintainer manually checked the live V36 UI and reported PASS for every item below. The browser/OS version and exact deployed commit were not supplied for this review, so they are not inferred here.

- [x] Discover: search/load issues; single-language filtering; multi-label and custom-label filtering; quick and advanced filters; sorting, Load more, and issue details.
- [x] Saved/sharing: save and revisit an issue; save/reload a search; export/import saved data; restore filters from a shared URL.
- [x] Responsive layout: 320px, 375px, 768px, and 1280px.
- [x] Browser zoom: 200%, with no horizontal overflow reported.
- [x] Light and dark themes.
- [x] Keyboard-only navigation and visible focus.
- [x] Readability and disabled controls.
- [x] No-results and unavailable/rate-limit states.
- [x] About page and issue-detail navigation.

**Latest follow-up:** the maintainer explicitly confirmed PASS for reduced-motion, long-content stress, light/dark theme contrast, and screen-reader/keyboard checks. At the time of this historical snapshot the numeric audit had not yet been recorded; the completed ratio report is now in `docs/CONTRAST_AUDIT.md`. Automated tests and maintainer-reported checks are distinct evidence types.


**Historical status at the time of the Phase 5 waiver (2026-10-21): PARTIALLY PERFORMED.** The maintainer directed that Phase 5 be approved. The documented approval includes an explicit waiver for residual manual-review risks; it does not imply coverage beyond the recorded checks. Checks were run by the maintainer on 2026-10-21 in Firefox on Windows. Keyboard navigation, advanced-filter disclosure, search, failure handling, import/export, 200% zoom, and issue-detail content passed. Four defects were fixed and re-tested (`534bca7`, `7bd7d45`, `28d0768`, `ac5306e`). Manual visual approval is recorded at 320px and 375px. Automated Chromium overflow testing passed at 320px, 375px, 768px, and 1280px in [GitHub Actions run #1](https://github.com/vijay3695/V36/actions/runs/39636965181) on commit `16fd41922033a356e7305e70f00f9edcac71702d`. The automated check measures document-level horizontal overflow only; it does not certify visual usability or absence of clipped controls. The maintainer's 2026-10-24 manual review passed the listed redesigned UI checks, including the four requested viewport widths and 200% zoom. In a later follow-up, the maintainer explicitly confirmed PASS for reduced-motion, long-content stress, light/dark theme contrast, and screen-reader/keyboard checks. At the time of this earlier snapshot the numeric audit had not yet been recorded; see `docs/CONTRAST_AUDIT.md` for the completed ratio report.

## Approved UI redesign — automated verification (2026-10-24)

- Tested candidate: `7a3faefbcab7e88ce7cbf1f8a9a4a0506b20b09d`.
- [Full CI run](https://github.com/vijay3695/V36/actions/runs/40080705257): **103/103 unit tests, 47/47 browser tests, and 6/6 automated accessibility scans passed** with no failures.
- [Responsive viewport run](https://github.com/vijay3695/V36/actions/runs/40080705237): no horizontal overflow at 320, 375, 768, or 1280px.
- The browser suite also tested a 640px CSS viewport as the reflow equivalent of 200% zoom on a 1280px display; document and body widths both remained 640px. This is an automated viewport proxy, not a fresh manual browser-zoom check.
- Automated contrast checks cover light and dark theme tokens; accessibility scans cover Discover, Saved, and About in both themes, and the issue-detail view in the end-to-end flow. Reduced motion, keyboard focus, long content, theme persistence, filter behavior, and context-pack button text are covered by passing tests.
- [GitHub Pages build/deployment](https://github.com/vijay3695/V36/actions/runs/40080705112) succeeded.
- **Manual-review record:** the maintainer reported PASS for the listed redesigned UI checks on 2026-10-24 and subsequently confirmed PASS for reduced-motion, long-content stress, light/dark theme contrast, and screen-reader/keyboard checks. See the latest follow-up at the top of this file. Numeric per-component contrast ratios are recorded separately in `CONTRAST_AUDIT.md`; automated success is not represented as human review.

## Record the test environment

- Reviewer: maintainer (`vijay3695`), self-reported
- Date/time: 2026-10-21 (time not recorded)
- OS and version: Windows (version not recorded)
- Browser and version: Firefox (version not recorded)
- Viewport / zoom: 200% zoom, default desktop, and 320px (Saved-search re-test target)
- Commit SHA tested: `e381197` preview build for the first pass; fixes in `534bca7` (Saved search), `7bd7d45` (star inputs), `28d0768` (related-work links), `ac5306e` (context-pack completeness)
- Assistive technology used: none recorded (keyboard and visual checks only)

## Keyboard-only checks

- [x] Load the home page and confirm the skip link is the first useful keyboard stop. **PASS**
- [x] Tab through Discover navigation, all search fields, advanced filters, submit/reset/load-more actions, and result-card controls without a mouse. **PASS** (tab order verified through the filter set and form actions)
- [x] Open and close the advanced filter disclosure using the keyboard. **PASS** — the "Custom date ranges and exact star counts" row opens on Space/Enter, its fields are reachable, and it collapses again. Reviewer noted the purpose of the row was initially unclear, but the keyboard behavior itself passed.
- [x] Submit a search and confirm focus, loading feedback, result count, partial-result warning, and errors remain understandable. **PASS**
- [x] Open issue details, navigate the related-work links, inspect official labels and activity evidence, and use Retry activity refresh. **PASS** — detail content, labels, evidence and Retry worked; the Related-work links were built as `repo:undefined …`, fixed in `28d0768` and re-tested successfully by the maintainer (repository identity from the issue URL, correct result types)
- [x] Save an issue and search, navigate to Saved, remove one item, and use import/export controls with the keyboard. **PASS** — saved items and import/export worked; the Saved-search overflow defect found in this pass was fixed in `534bca7` and the maintainer confirmed the fix works
- [x] Confirm focus remains visible and is not trapped; returning between views does not strand focus on a hidden element. **PASS**
- [x] Test a failed search and rate-limit state; verify existing results and saved data remain available. **PASS** — the offline search reported "Network request failed. Check your connection and retry. Existing results and saved items are preserved. You can retry manually." and restored the previous results and filters

## Visual / responsive checks

- [x] Human visual acceptance at 320px, 375px, 768px, and desktop width: **PASS — maintainer-reported 2026-10-24** for the redesigned live UI. Browser/OS versions and exact deployed commit were not supplied. This new result supersedes the earlier 768px/desktop NOT RUN entry.
- [x] Automated responsive overflow test at 320px, 375px, 768px, and 1280px. **PASS** — [GitHub Actions run #1](https://github.com/vijay3695/V36/actions/runs/39636965181), commit `16fd41922033a356e7305e70f00f9edcac71702d`. Playwright logged `OVERFLOW@320: false`, `OVERFLOW@375: false`, `OVERFLOW@768: false`, and `OVERFLOW@1280: false`; 1 test passed. This measures document-level horizontal overflow, not clipped controls or visual usability.
- [x] At 200% zoom, confirm navigation, filters, cards, detail panels, saved controls, and context-pack text remain usable. **PASS — maintainer-reported 2026-10-24** for the redesigned live UI; environment/version details were not supplied.
- [x] Light/dark theme contrast check — **PASS**, explicitly confirmed by the maintainer on 2026-10-24. Numeric ratios for the documented text, border, focus, status, inferred-label, and disabled-control combinations are recorded in `CONTRAST_AUDIT.md` and regression-tested.
- [x] Reduced-motion preference check — **PASS**, explicitly confirmed by the maintainer on 2026-10-24.
- [x] Dedicated long-content stress test: long issue title/body, many labels, empty description, and unavailable-data list — **PASS**, explicitly confirmed by the maintainer on 2026-10-24.

## Automated proxy results (Playwright)

**Not manual sign-off.** These are automated approximations from a headless browser. They do not replace the human checks above and must not be recorded as a reviewer result.

- Date: 2026-10-21
- Command: `npx playwright test tests/e2e/manual-check.spec.js -g "responsive no horizontal overflow"` (GitHub Actions, Chromium)
- Workflow run: [#1 — PASS](https://github.com/vijay3695/V36/actions/runs/39636965181), commit `16fd41922033a356e7305e70f00f9edcac71702d`.
- Responsive overflow at 320/375/768/1280px: `false` at each width; 1 test passed. This is document-level overflow coverage, not manual visual sign-off.
- Reduced motion: transition duration 0.00001s (effectively disabled).
- Detail view focus moves to the issue heading: pass.
- 200% zoom: not an automated check — see the manual result above.

## Results

- Outcome: **PASS WITH DOCUMENTED LIMITATION** — the maintainer reported PASS for the redesigned live UI at 320/375/768/1280px, 200% zoom, light/dark themes, keyboard-only navigation, readability/disabled controls, no-results/rate-limit states, About/detail navigation, reduced motion, long-content stress, theme contrast, and screen reader/keyboard checks. Formal numeric per-component contrast measurement remains unconfirmed.
- Recorded manual results:
  - 200% zoom: **PASS** (2026-10-21, Firefox on Windows)
  - Skip link, tab order, visible focus, no focus trap: **PASS**
  - Search submit, loading, result count and errors: **PASS**
  - Offline search failure with previous results and saved data preserved: **PASS**
  - Saved issues/searches and import/export: **PASS** except the Saved-search layout defect below
- Defects with reproduction steps:
  - **Saved-search row overflow (found 2026-10-21)** — save a search with a long query/labels, open Saved: the raw filter text overflowed the card and pushed "Run search"/"Remove" outside it. Fixed in `534bca7` by wrapping the text and replacing raw JSON with a readable filter summary; regression test "saved searches wrap long summaries without pushing actions out of the card" passes at 320px, and the maintainer confirmed the fix on 2026-10-21.
  - **Star inputs rejected values containing a space (found 2026-10-21)** — typing a space in "Minimum stars" or "Maximum stars" left the field in an invalid state, so Firefox showed "Please enter a number" and refused to submit the search. Fixed in `7bd7d45`: spaces are ignored while typing and stripped from pasted values, with a regression test covering both fields and a successful submit. Maintainer re-tested and confirmed the fix on 2026-10-21.
  - **Related-work links contained `repo:undefined` (found 2026-10-21)** — when repository metadata could not be retrieved, the detail view built search links as `repo:undefined <title>`, and the pull-request link pointed at the issues filter. Fixed in `28d0768`: repository identity falls back to the issue's own URL, the `repo:` qualifier is omitted when no repository is known, and the PR link uses `type=pullrequests`. Covered by unit and browser tests. Maintainer re-tested and confirmed the fix on 2026-10-21.
  - **Context pack did not state its completeness (found 2026-10-21)** — under a rate limit the pack showed `Repository Name: Unavailable` even though the issue URL identified the repository, buried the incompleteness in two raw API error bullets (including a transient "Retry after 8:59:32 pm"), and did not distinguish "not fetched" from "unknown". Fixed in `ac5306e`: a new **Evidence completeness** section reports `COMPLETE` or `INCOMPLETE — not retrieved: …` with a neutral reason, the repository identity from the issue URL is shown and labelled as such, issue-data provenance is stated, and raw API error strings are replaced by a neutral "Not retrieved: <sources>" list. Maintainer re-tested and confirmed the fix on 2026-10-21.
- Follow-up issue/commit links: `534bca7`, `7bd7d45`, `28d0768`, `ac5306e`
- Reviewer sign-off: Phase 5 approval/waiver authorized by maintainer on 2026-10-21. The listed manual checks were subsequently reported PASS on 2026-10-24. The remaining evidence limitation is formal numeric per-component contrast measurement; the waiver remains documented for any residual review risk.

Automated axe checks are useful but do not replace these manual checks. The maintainer's phase approval is an explicit waiver of the outstanding manual review, not a claim that those checks were performed. The waiver is recorded to keep the acceptance evidence honest.
