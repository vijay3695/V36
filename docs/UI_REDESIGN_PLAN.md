# V36 UI Redesign Plan

**Status:** Approved by maintainer — implementation authorized  
**Scope:** UI-only redesign. Preserve every existing feature and behavior; no feature removal is authorized.  
**Implementation status:** In progress — Discover layout, theme system, and regression coverage have been updated; verification remains pending.  
**Target repository:** `vijay3695/V36`  
**Implementation baseline:** Existing HTML, CSS, and vanilla JavaScript application hosted on GitHub Pages.

## 1. Goal

Redesign V36 into a compact, GitHub-native issue-discovery interface where users can find and scan useful open-source issues quickly. Results are the primary focus; filters should be easy to reach without dominating the screen.

### Approved design preferences

- **Design direction:** GitHub-native.
- **Themes:** Light and dark.
- **Density:** Compact.
- **Priority:** Results and result scanning.
- **Implementation:** Retain the current HTML/CSS/vanilla JavaScript approach.
- **Release constraint:** Do not implement until the maintainer approves the detailed design and plan.

The design should feel like a polished developer tool: familiar issue-list patterns, quiet borders, restrained blue actions, legible labels, clear metadata, and minimal decorative space. It should not become a generic AI dashboard or marketing landing page.

## 2. Non-goals and constraints

- Do not add a server, database, account system, paid service, required GitHub token, or hosted AI API.
- Do not automatically modify target repositories or execute their code.
- Do not remove existing features merely to simplify the UI.
- Do not change GitHub API behavior, filtering semantics, saved-data formats, or context-pack evidence rules as part of a visual-only change.
- Do not fabricate issue evidence or imply that unavailable metadata means a filter matched or failed.
- Do not introduce a new frontend framework or a large UI dependency.
- Do not implement anything before this plan and the visual layout are approved.

## 3. Current application audit summary

The existing application already includes Discover, Saved, and About views, a separate issue-detail view, issue and search saving, import/export, shareable filter URLs, GitHub search and metadata filters, pagination/load-more behavior, and portable context packs.

The current Discover view places a substantial group of filters before the results. The visual hierarchy should be reversed: search and a compact quick-filter strip first, then the result count/sort/selected-filter context, then a compact issue list. Secondary filters should remain available through an organized disclosure.

The stylesheet contains repeated responsive and reduced-motion rules. The redesign should consolidate theme and component styling into a coherent set of CSS variables and avoid adding more override layers.

Project status records in `PROGRESS.md`, `PHASES.md`, and related acceptance documentation do not describe all verification history identically. Before implementation, reconcile the actual baseline, open regressions, and outstanding manual checks. Do not treat an old test result as proof that the current default branch passes.

The previously reported repeated “Generate context pack” button text issue has been reported as fixed by the maintainer. Treat it as resolved on the current baseline; do not reopen or modify the fix as part of this redesign. Preserve the working behavior. Retain a regression test only if it can verify the button text appears once and context-pack generation still works.

## 4. Information architecture

Keep the existing primary destinations:

- **Discover:** Search, filters, result list, and pagination.
- **Saved:** Saved issues and saved searches, with existing run/remove/import/export actions.
- **About:** Purpose, data limitations, privacy, filtering behavior, and context-pack explanation.
- **Issue details:** Existing detail view, reachable from results and with a clear return path.

Keep navigation compact. Theme selection should be visible and usable without consuming space needed by search or results.

## 5. Discover screen specification

### 5.1 Header and search

- Keep the V36 identity and primary navigation in a compact header.
- Provide a prominent query field and a clear Search action.
- Preserve current search submission behavior, query encoding, and URL-sharing behavior.
- Do not clear current filters, results, or saved data when switching theme.
- Provide clear loading, rate-limit, request-error, and unavailable states without confusing them with a successful empty search.

### 5.2 Quick filters

Expose the most frequently useful controls near the search field:

1. Language — single selection at a time; retain alias handling and custom language entry.
2. Labels — searchable multi-select with custom label entry.
3. Issue type.
4. Updated-date preset.
5. More filters disclosure.

Selected filters must be visible, removable, and represented accurately. Compactness must not hide active constraints or make selected labels difficult to understand.

### 5.3 More filters

Keep all existing advanced capabilities, grouped and labelled clearly:

- Inferred contribution category.
- Issue creation date and custom date range.
- Last commit age.
- Repository last-push age.
- Star range and exact/custom star bounds where currently supported.
- Any remaining existing filters not listed above.

Use concise labels and helpful explanations where a filter depends on metadata being available. Do not change filter defaults or AND semantics as a side effect of rearranging controls.

### 5.4 Results toolbar

Immediately before the list, show:

- A truthful result/loaded count.
- The current sort selection, preserving recently updated as the default if that remains the current product decision.
- Active-filter summary or removable chips.
- Any material warning about partial metadata coverage or API limits.
- A clear Load more action when more results may be retrieved.

Do not claim a total count if only loaded results are known. Preserve loaded results when a request fails or a rate limit is reached.

### 5.5 Compact issue row

Each result should prioritize, in order:

1. Issue title, visually strongest and keyboard-accessible.
2. Repository identity and issue number.
3. Official GitHub labels.
4. Concise metadata such as update date, stars, and language, when available.
5. A save action and a clear route to issue details or the original GitHub issue.

Keep rows compact but readable. Allow long repository names, issue titles, labels, and metadata to wrap without overlapping actions or causing horizontal page overflow. Use consistent spacing and alignment across rows. Do not rely on color alone to communicate state.

Official labels and inferred contribution categories must remain distinguishable. Missing values must display as Unknown or an equivalent explicit unavailable state rather than being silently omitted when their absence would mislead users.

## 6. Issue detail view

Retain existing detail content and behavior, but organize it into compact, scannable sections:

- Issue identity, title, repository, official labels, and canonical GitHub link.
- Issue description with safe rendering of untrusted content.
- Available activity and repository evidence, with raw dates and source links.
- Clear Unknown/unavailable states and request retry where supported.
- Related-work search links, where currently available.
- Context-pack generation and copy/fallback behavior, including source links, retrieval times, missing evidence, and limitations.

The context pack remains a portable prompt generated from information V36 actually retrieved. It must not invoke an AI API, invent evidence, or edit code. The maintainer has confirmed the previously reported repeated button text issue is fixed. Do not treat it as an open bug or change the existing fix; preserve its behavior and keep an appropriate regression assertion if supported by the current test setup.

## 7. Saved and About views

### Saved

- Distinguish saved issues from saved searches.
- Keep run, remove, import, and export actions easy to find.
- Preserve validation, deduplication, and existing-data protection.
- Ensure long titles and filter summaries wrap cleanly.
- Retain entries that cannot currently be fetched; do not silently discard inaccessible saved items.

### About

- Explain V36's purpose and the anonymous GitHub API model.
- Explain that results are discovery aids, not guarantees that an issue is still open or suitable.
- Describe the distinction between official labels and inferred categories.
- Describe metadata limitations, rate limits, local saved data, import/export, and portable context packs.
- Keep this view concise and consistent with the rest of the application rather than using an oversized hero layout.

## 8. Light and dark themes

Implement both themes using shared CSS variables/tokens for page surfaces, raised surfaces, text, muted text, borders, links/actions, focus indicators, labels, warnings, success/error states, and disabled controls.

- Respect the system theme on first visit.
- Provide a visible theme toggle.
- Remember the user's explicit choice locally.
- Apply the selected theme consistently to every view, detail state, dropdown, date input, dialog, status message, and focus state.
- Preserve the current route, filters, and in-memory results during theme changes.
- Verify contrast for ordinary text, muted text, controls, labels, focus outlines, disabled states, and status messages in both themes.

Avoid a second independent layout for dark mode: only theme tokens and necessary component color treatments should differ.

## 9. Responsive and accessibility requirements

### Responsive widths

- **320 px and 375 px:** Single-column result list; wrapping filters; no horizontal page overflow; all actions reachable.
- **768 px:** Compact layout with controls arranged efficiently where space permits; result titles remain readable.
- **1280 px:** Use available space without excessively wide text lines, oversized cards, or large empty regions.
- **200% zoom:** Reflow content and controls without clipping or losing essential actions.
- Long issue titles, repository names, labels, error messages, and descriptions must not break the layout.

### Accessibility

- Preserve semantic landmarks and heading order.
- All filters, menus, result actions, theme toggle, detail navigation, and import/export controls must work by keyboard.
- Keep visible focus and sensible focus restoration after navigation and dialogs.
- Provide accessible names and state announcements for loading, no results, errors, rate limits, and save actions.
- Respect reduced-motion preferences.
- Do not communicate category, selection, or status by color alone.
- Test both themes with automated accessibility checks and manual visual/keyboard review where required.

## 10. Behavior that must not regress

- Anonymous GitHub API access; no token required.
- Language selection remains single-select, with current aliases and custom entry.
- Labels remain searchable multi-select with custom entry.
- Existing filters and AND logic remain intact.
- GitHub-native search and metadata filtering retain their current separation.
- Default sorting and pagination/load-more behavior remain intact.
- Raw activity dates and evidence links remain visible where available.
- Missing or unavailable metadata stays explicit.
- API rate limits stop additional requests, preserve loaded results and saved data, and permit manual retry where supported. Never bypass limits.
- Saved issues/searches remain local; import/export validation, deduplication, and preservation behavior remain intact.
- Shareable URLs contain filters only, not saved/private data or credentials.
- Untrusted GitHub text and imported content remain safely handled.
- Context packs include only retrieved evidence, source links, retrieval times, gaps, and limitations.
- Discover, Saved, About, details, empty states, errors, and unavailable states all receive the same visual-system treatment.

## 11. Implementation sequence (after approval)

### Step 0 — Establish baseline

- Inspect the current default-branch files and existing tests before editing.
- Reconcile status claims in `PROGRESS.md`, `PHASES.md`, and acceptance records using actual repository evidence.
- Run the available baseline test commands and record the exact results.
- Confirm the existing context-pack button fix remains intact; do not reopen the resolved issue.
- List known failures and checks that require manual review.

**Exit gate:** Baseline is documented; current behavior and known issues are separated from proposed changes.

### Step 1 — Approve screen structure

- Finalize the compact header, quick-filter strip, advanced-filter disclosure, results toolbar, and issue-row anatomy.
- Finalize detail, Saved, About, mobile reflow, and theme-toggle behavior.

**Exit gate:** Maintainer explicitly approves the screen structure before implementation.

### Step 2 — Shared visual foundation

- Consolidate theme tokens and common styling for typography, spacing, borders, buttons, form controls, labels, notices, focus states, and disabled states.
- Remove superseded duplicate rules only when their behavior is understood and covered by tests.

**Exit gate:** Shared components render consistently in both themes; no functionality is intentionally removed.

### Step 3 — Discover redesign

- Rework search and filter hierarchy.
- Make active filters visible and easy to remove.
- Implement compact result rows and a clear results toolbar.
- Preserve loading, empty, error, rate-limit, partial-data, and Load more states.

**Exit gate:** Existing filter behavior passes regression tests and results remain the dominant page content.

### Step 4 — Detail, Saved, and About redesign

- Apply the same visual system to all views.
- Preserve every existing action and evidence requirement.
- Verify context-pack generation/copy behavior and, where supported, confirm the button text remains singular.

**Exit gate:** All views and their important states remain usable and behaviorally equivalent.

### Step 5 — Verification and documentation

- Run unit, browser/E2E, and automated accessibility suites.
- Test responsive widths 320, 375, 768, and 1280 px and 200% zoom.
- Check both themes, long content, keyboard-only flows, reduced motion, focus, contrast, and error/unavailable states.
- Report actual pass/fail evidence and remaining manual checks. Do not mark unperformed checks complete.
- Update project status and acceptance documents only to reflect verified facts.

**Exit gate:** No unresolved critical regressions; evidence and outstanding checks are reported truthfully for maintainer review.

## 12. Acceptance checklist

- [ ] Maintainer approves the detailed layout before implementation begins.
- [ ] Light and dark themes cover all views and UI states.
- [ ] Results are visually primary and issue rows are compact and scannable.
- [ ] Quick and advanced filters retain all existing options and semantics.
- [ ] Active filters, sorting, loaded counts, and partial-data warnings are clear.
- [ ] Detail, Saved, About, pagination, import/export, and context packs retain their behavior.
- [ ] The previously fixed context-pack button text remains correct; an existing or appropriate regression test verifies singular button text and working generation where supported.
- [ ] Unknown values, unavailable evidence, and rate limits are represented honestly.
- [ ] Existing automated tests pass or failures are documented and addressed.
- [ ] Responsive checks pass at 320, 375, 768, and 1280 px and at 200% zoom.
- [ ] Accessibility checks cover both themes; manual checks are recorded separately.
- [ ] Project progress records reflect actual verification, not assumed completion.

## 13. Approval and change control

The maintainer has approved this plan and authorized implementation. Proceed in the documented sequence, beginning with a baseline audit. Preserve every existing feature and behavior; this is a UI upgrade, not a feature-removal exercise. If an implementation step appears to require removing or changing a feature, stop and obtain explicit approval before doing so.

Any suggested behavior change discovered during implementation must be called out separately for approval rather than silently bundled into the visual redesign.
