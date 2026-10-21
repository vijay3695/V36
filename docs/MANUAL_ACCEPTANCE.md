# V36 Manual Acceptance Checklist

**Status: PARTIALLY PERFORMED.** Checks were run by the maintainer on 2026-10-21 in Firefox on Windows. Keyboard navigation, advanced-filter disclosure, search, failure handling, import/export, 200% zoom, and issue-detail content passed. Four defects were fixed and re-tested (`534bca7`, `7bd7d45`, `28d0768`, `ac5306e`). Responsive layout is **DEV APPROVED at 320px and 375px only**; 768px and desktop remain pending. Contrast, reduced motion, and long-content checks remain **NOT RUN**.

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

- [ ] At 320px, 375px, 768px, and desktop width, confirm no horizontal page overflow or clipped controls. **PARTIAL — DEV APPROVED**: 320px: PASS, 0px overflow, no offenders; 375px: PASS, 0px overflow, no offenders. 768px and desktop: NOT RUN.
- [x] At 200% zoom, confirm navigation, filters, cards, detail panels, saved controls, and context-pack text remain usable. **PASS** (maintainer-reported 2026-10-21; Firefox on Windows, versions not recorded)
- [ ] Check dark-theme text, borders, focus indicators, status messages, inferred-label styling, and disabled controls for adequate contrast. **NOT RUN**
- [ ] Enable reduced motion in the OS/browser and confirm no disruptive animations or smooth scrolling. **NOT RUN**
- [ ] Check a long issue title/body, many labels, an empty description, and an unavailable-data list. **NOT RUN**

## Automated proxy results (Playwright)

**Not manual sign-off.** These are automated approximations from a headless browser. They do not replace the human checks above and must not be recorded as a reviewer result.

- Date: 2026-10-21
- Command: `npx playwright test tests/e2e/manual-check.spec.js`
- Keyboard tab order: automated tab traversal starts at the skip link and no focus trap was detected (approximation; not assistive-technology testing).
- Responsive overflow at 320/375/768/1280px: no horizontal overflow.
- Reduced motion: transition duration 0.00001s (effectively disabled).
- Detail view focus moves to the issue heading: pass.
- 200% zoom: not an automated check — see the manual result above.

## Results

- Outcome: **PARTIAL** — prior manual checks remain recorded; responsive layout is DEV APPROVED at 320px and 375px (0px overflow, no offenders at either width); 768px and desktop widths, contrast, reduced motion, and long-content checks remain pending.
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
- Reviewer sign-off: pending

Automated axe checks are useful but do not replace these manual checks.
