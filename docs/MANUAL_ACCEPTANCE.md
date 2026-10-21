# V36 Manual Acceptance Checklist

**Status: NOT PERFORMED by automated CI.** These checks require a human reviewer with a real browser and assistive technology. Do not mark Phase 5 or the first release verified until a reviewer records the environment, date, results, and any defects here.

## Record the test environment

- Reviewer:
- Date/time:
- OS and version:
- Browser and version:
- Screen reader and version (if used):
- Viewport / zoom:
- Commit SHA tested:

## Keyboard-only checks

- [ ] Load the home page and confirm the skip link is the first useful keyboard stop.
- [ ] Tab through Discover navigation, all search fields, advanced filters, submit/reset/load-more actions, and result-card controls without a mouse.
- [ ] Open and close the advanced filter disclosure using the keyboard.
- [ ] Submit a search and confirm focus, loading feedback, result count, partial-result warning, and errors remain understandable.
- [ ] Open issue details, navigate the related-work links, inspect official labels and activity evidence, and use Retry activity refresh.
- [ ] Save an issue and search, navigate to Saved, remove one item, and use import/export controls with the keyboard.
- [ ] Confirm focus remains visible and is not trapped; returning between views does not strand focus on a hidden element.
- [ ] Test a failed search and rate-limit state; verify existing results and saved data remain available.

## Screen-reader checks

- [ ] Verify page title, landmark structure, navigation names, heading hierarchy, form labels, required/optional status, and button/link names.
- [ ] Confirm status changes for loading, empty results, partial results, errors, rate limits, import/export, and storage failures are announced appropriately.
- [ ] Confirm issue title, official labels, inferred categories, activity evidence, Unknown/unavailable values, and retry controls are read with their context.
- [ ] Confirm no essential information is conveyed by color alone and decorative content does not add noisy announcements.
- [ ] Check Discover, Saved, About, and issue detail views, including no-results and unavailable-data states.

## Visual / responsive checks

- [ ] At 320px, 375px, 768px, and desktop width, confirm no horizontal page overflow or clipped controls.
- [ ] At 200% zoom, confirm navigation, filters, cards, detail panels, saved controls, and context-pack text remain usable.
- [ ] Check dark-theme text, borders, focus indicators, status messages, inferred-label styling, and disabled controls for adequate contrast.
- [ ] Enable reduced motion in the OS/browser and confirm no disruptive animations or smooth scrolling.
- [ ] Check a long issue title/body, many labels, an empty description, and an unavailable-data list.

## Automated proxy results (Playwright)

- Date: 2026-10-21
- Commit: c90b2b836c0411938246efadaa35bd278c1ab4e3
- Keyboard tab order: pass (skip link first; no trap observed)
- Responsive overflow at 320/375/768/1280px: no horizontal overflow
- Reduced motion: transition duration 0.00001s (effectively disabled)
- Detail view focus moves to heading: pass

## Results

- Outcome: NOT RUN / PASS / FAIL
- Defects with reproduction steps:
- Follow-up issue/commit links:
- Reviewer sign-off:

Automated axe checks are useful but do not replace these manual checks.
