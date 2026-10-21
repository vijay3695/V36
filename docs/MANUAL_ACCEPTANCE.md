# V36 Manual Acceptance Checklist

**Status: PARTIALLY PERFORMED.** The maintainer reported a **PASS** for the 200% zoom check on 2026-10-21. Every other manual check below remains **NOT RUN**. Do not mark Phase 5 or the first release verified until all required checks are recorded here.

## Record the test environment

- Reviewer: maintainer (`vijay3695`), self-reported
- Date/time: 2026-10-21 (time not recorded)
- OS and version: Windows (version not recorded)
- Browser and version: Firefox (version not recorded)
- Viewport / zoom: 200% zoom
- Commit SHA tested: not recorded (entry written while `main` was at `cd9021b`)

## Keyboard-only checks

- [ ] Load the home page and confirm the skip link is the first useful keyboard stop.
- [ ] Tab through Discover navigation, all search fields, advanced filters, submit/reset/load-more actions, and result-card controls without a mouse.
- [ ] Open and close the advanced filter disclosure using the keyboard.
- [ ] Submit a search and confirm focus, loading feedback, result count, partial-result warning, and errors remain understandable.
- [ ] Open issue details, navigate the related-work links, inspect official labels and activity evidence, and use Retry activity refresh.
- [ ] Save an issue and search, navigate to Saved, remove one item, and use import/export controls with the keyboard.
- [ ] Confirm focus remains visible and is not trapped; returning between views does not strand focus on a hidden element.
- [ ] Test a failed search and rate-limit state; verify existing results and saved data remain available.

## Visual / responsive checks

- [ ] At 320px, 375px, 768px, and desktop width, confirm no horizontal page overflow or clipped controls.
- [x] At 200% zoom, confirm navigation, filters, cards, detail panels, saved controls, and context-pack text remain usable. **PASS** (maintainer-reported 2026-10-21; Firefox on Windows, versions not recorded)
- [ ] Check dark-theme text, borders, focus indicators, status messages, inferred-label styling, and disabled controls for adequate contrast.
- [ ] Enable reduced motion in the OS/browser and confirm no disruptive animations or smooth scrolling.
- [ ] Check a long issue title/body, many labels, an empty description, and an unavailable-data list.

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

- Outcome: **PARTIAL** — 200% zoom **PASS** (maintainer-reported 2026-10-21); all other manual checks **NOT RUN**
- Recorded manual results:
  - 200% zoom: **PASS**, reported directly by the maintainer on 2026-10-21 in Firefox on Windows. Browser/OS versions and the exact commit SHA were not recorded.
- Defects with reproduction steps:
- Follow-up issue/commit links:
- Reviewer sign-off:

Automated axe checks are useful but do not replace these manual checks.
