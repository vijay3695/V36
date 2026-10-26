# V36 release acceptance checklist and disposition

<!-- RELEASE EVIDENCE SNAPSHOT: 2026-10-24. The current release disposition is recorded below; earlier counts are historical snapshots. -->

> **Current verified status (2026-10-24):** The public preview [V36 v0.1.0](https://github.com/vijay3695/V36/releases/tag/v0.1.0) is published from `77b36385f3a2e9fb603d1602b451d152fda91cd7`. [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927) passed **107 unit tests, 47 browser tests, and 6 accessibility scans**; [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded; [release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176) succeeded. Per-component numeric contrast ratios for both themes are recorded in [`docs/CONTRAST_AUDIT.md`](CONTRAST_AUDIT.md) and recalculated by [`tests/contrast-audit.test.js`](../tests/contrast-audit.test.js) where this relative link is valid only for docs files. **No Phase 0–6 or active release/CI/deployment task remains pending.** Older status notes below describe earlier snapshots and are not the current state.


**Phase 6 disposition:** VERIFIED; the public preview [V36 v0.1.0](https://github.com/vijay3695/V36/releases/tag/v0.1.0) was published on 2026-10-24. The exact release commit `77b36385f3a2e9fb603d1602b451d152fda91cd7` passed [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927): 107 unit tests, 47 browser tests, and 6 accessibility scans. [Release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176) and [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded. Manual acceptance outcomes are recorded in `MANUAL_ACCEPTANCE.md`; numeric contrast ratios are recorded in `CONTRAST_AUDIT.md`.

The checklist below records the release gate applied to v0.1.0. For future releases, do not publish until every applicable item is completed and evidenced against the exact release commit, with any approved exception clearly disclosed.

## Discovery and filters

- [x] Search public GitHub issues using supported search qualifiers.
- [x] Language, labels, issue type, issue creation date/custom bounds, issue update date/custom bounds, commit age/custom bounds, star presets and exact min/max, categories, and sorting behave as specified.
- [x] Custom date ranges are supported where planned or the specification is explicitly updated before release.
- [x] AND behavior is consistent and explained.
- [x] Metadata-dependent filters never silently exclude items merely because metadata is not yet fetched; unknown data is identified.
- [x] Filtering within loaded results is clearly distinguished from GitHub's total result count.
- [x] Load more, incomplete search results, empty matches, request failure, and API rate limits have distinct states.
- [x] Search URLs round-trip all supported filter settings and contain no saved data or secrets.
- [x] Older repositories remain visible by default; no health score or dead-project verdict is displayed.

## Activity evidence and details

- [x] Issue details refresh from GitHub where practical and show fetch timestamps.
- [x] Repository latest commit date, issue dates, available PR/issue activity, language, and star count are shown with unknown/unavailable distinctions.
- [x] API failures preserve loaded issue results and saved references.
- [x] Related-work links are search links and do not claim automatic duplicate detection.
- [x] Saved references remain when issues close, move, disappear, or become inaccessible; the UI communicates status honestly.
- [x] No source file, repository instruction, test result, or other fact is invented.

## AI context packs

- [x] Context pack uses only retrieved information and is copyable.
- [x] Every included source has a grounded link and fetch time where available.
- [x] Missing README, contribution instructions, commit evidence, and other context is disclosed.
- [x] Source-file links are included only when identifiable from retrieved evidence.
- [x] Issue and repository content is clearly treated as untrusted input.
- [x] Context pack never claims repository code or tests were inspected/run when they were not.
- [x] No AI API, paid key, automatic code execution, or automatic PR creation is required.

## Saved items and portability

- [x] Saved issues and saved searches are separate on the Saved page.
- [x] Saved issue references are canonicalized and deduplicated.
- [x] Equivalent filter presets deduplicate by normalized settings.
- [x] Import validates version, structure, types, string lengths, item count, and total file size.
- [x] Import reports accepted, rejected, and duplicate items without silently overwriting unrelated data.
- [x] Malformed or oversized import leaves existing saved data unchanged.
- [x] Export creates a usable versioned backup.
- [x] Browser storage failures are surfaced without claiming data was saved.
- [x] No credentials or tokens are stored.

## Security and privacy

- [x] Remote content is rendered with safe DOM APIs; no untrusted HTML is injected.
- [x] External links use safe protocols and do not auto-open links found in issue text.
- [x] No tokens, credentials, secrets, or private API keys are present in client code or local storage.
- [x] Rate-limit handling stops additional requests; no bypass behavior exists.
- [x] Security tests cover unsafe URLs, hostile content, malformed imports, oversized imports, duplicates, and data preservation.

## Accessibility

- [x] Automated axe/WCAG checks pass for Discover, Saved, About, and issue details.
- [x] Full keyboard-only navigation works, including filters, results, details, import/export, and context-pack copy.
- [x] Focus is visible and restored sensibly after navigation and dialogs/controls.
- [x] Semantic headings, landmarks, labels, accessible names, and status messages are correct.
- [x] Theme contrast review — **PASS**. Numeric contrast ratios for light and dark themes are documented for the listed text/control/border/focus/status/inferred/disabled component combinations in `CONTRAST_AUDIT.md`; `tests/contrast-audit.test.js` recalculates the checked token combinations.
- [x] Manual keyboard checks are documented for loading, results, failures, filters, and saved-item updates.
- [x] Reduced-motion preference — automated browser check **PASS** and manual OS/browser preference check **PASS**, explicitly confirmed by the maintainer on 2026-10-24.
- [x] Automated accessibility success is not described as proof of complete accessibility.

## Automated tests and CI

- [x] Unit tests cover filters, date handling, URL encoding/decoding, category inference, import/export validation, duplicate detection, and failure states.
- [x] Browser end-to-end tests cover search, load more, details, activity evidence, related links, context packs, saved issues/searches, import/export, and shareable URLs.
- [x] Routine tests use deterministic mocked GitHub responses.
- [x] Edge cases include unknown dates, partial results, closed/moved/deleted issues, malformed imports, duplicate imports, storage failures, network errors, and rate limits.
- [x] GitHub Actions CI passes on the release commit.
- [x] No test is marked passing unless it ran and passed.
- [x] Manual acceptance results are recorded.

## Release evidence

- [x] Known limitations and failed/skipped checks are disclosed.
- [x] Verification report and checklist identify the exact release commit SHA.
- [x] No first release is published while any mandatory item is incomplete.


## Manual acceptance

Manual acceptance is documented in [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md). On 2026-10-24 the maintainer reported PASS for Discover/search/filter/sort/load-more/details, Saved/sharing/import-export, 320/375/768/1280px layouts, 200% zoom, light/dark themes, keyboard/focus, readability/disabled controls, no-results/rate-limit states, About/detail navigation, reduced motion, long-content stress, theme contrast, and screen reader/keyboard checks. Numeric per-component contrast ratios are documented in `CONTRAST_AUDIT.md` and regression-tested. Phase 5's earlier waiver remains historical sign-off context, not a statement that these later-confirmed checks are still NOT RUN.
