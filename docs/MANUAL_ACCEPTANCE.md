# V36 Manual Acceptance Checklist

**Status: PARTIALLY PERFORMED.** Checks were run by the maintainer on 2026-10-21 in Firefox on Windows. Keyboard navigation, search, failure handling, import/export, and 200% zoom passed. One defect was found in the Saved-search layout and fixed in `534bca7`; that fix needs a human re-test. Advanced-filter keyboard operation, the issue-detail keyboard pass, responsive widths, contrast, reduced motion, and long-content checks remain **NOT RUN**.

## Record the test environment

- Reviewer: maintainer (`vijay3695`), self-reported
- Date/time: 2026-10-21 (time not recorded)
- OS and version: Windows (version not recorded)
- Browser and version: Firefox (version not recorded)
- Viewport / zoom: 200% zoom, default desktop, and 320px (Saved-search re-test target)
- Commit SHA tested: `e381197` preview build for the first pass; Saved-search fix landed in `534bca7`
- Assistive technology used: none recorded (keyboard and visual checks only)

## Keyboard-only checks

- [x] Load the home page and confirm the skip link is the first useful keyboard stop. **PASS**
- [x] Tab through Discover navigation, all search fields, advanced filters, submit/reset/load-more actions, and result-card controls without a mouse. **PASS** (tab order verified through the filter set and form actions)
- [ ] Open and close the advanced filter disclosure using the keyboard. **NOT RUN** (instruction was unclear in the first pass)
- [x] Submit a search and confirm focus, loading feedback, result count, partial-result warning, and errors remain understandable. **PASS**
- [ ] Open issue details, navigate the related-work links, inspect official labels and activity evidence, and use Retry activity refresh. **NOT RUN**
- [x] Save an issue and search, navigate to Saved, remove one item, and use import/export controls with the keyboard. **PASS WITH DEFECT** — saved items and import/export worked; the Saved-search row let long filter text overflow and push its actions out of the card (fixed in `534bca7`, human re-test pending)
- [x] Confirm focus remains visible and is not trapped; returning between views does not strand focus on a hidden element. **PASS**
- [x] Test a failed search and rate-limit state; verify existing results and saved data remain available. **PASS** — the offline search reported "Network request failed. Check your connection and retry. Existing results and saved items are preserved. You can retry manually." and restored the previous results and filters

## Visual / responsive checks

- [ ] At 320px, 375px, 768px, and desktop width, confirm no horizontal page overflow or clipped controls. **NOT RUN**
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

- Outcome: **PARTIAL** — seven checks passed (one with a now-fixed defect); six remain **NOT RUN**
- Recorded manual results:
  - 200% zoom: **PASS** (2026-10-21, Firefox on Windows)
  - Skip link, tab order, visible focus, no focus trap: **PASS**
  - Search submit, loading, result count and errors: **PASS**
  - Offline search failure with previous results and saved data preserved: **PASS**
  - Saved issues/searches and import/export: **PASS** except the Saved-search layout defect below
- Defects with reproduction steps:
  - **Saved-search row overflow (found 2026-10-21)** — save a search with a long query/labels, open Saved: the raw filter text overflowed the card and pushed "Run search"/"Remove" outside it. Fixed in `534bca7` by wrapping the text and replacing raw JSON with a readable filter summary; regression test "saved searches wrap long summaries without pushing actions out of the card" passes at 320px. Human re-test pending.
- Follow-up issue/commit links: `534bca7`
- Reviewer sign-off: pending

Automated axe checks are useful but do not replace these manual checks.
