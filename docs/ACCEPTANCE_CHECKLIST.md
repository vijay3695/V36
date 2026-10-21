# V36 release acceptance checklist and disposition

**Phase 6 disposition:** VERIFIED against tested candidate commit `7e91404d05e85cb24447ae5708ec21896f4a5728` and [consolidated CI run #73](https://github.com/vijay3695/V36/actions/runs/39642076673). The maintainer explicitly approved Phase 5 and waived the remaining human visual checks for phase sign-off. A checked item means it was verified by implementation/test evidence or resolved by that explicit waiver; waived checks are identified inline and remain **NOT RUN**, not PASS. No public release was published in this task.

Do not publish the first release until every applicable item below is completed and evidenced against the exact release commit, with any approved exception clearly disclosed.

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
- [x] Text and controls meet the agreed contrast criteria: unit contrast tests passed and automated axe scans reported 0 violations (1 incomplete result); human contrast review remains NOT RUN and is explicitly waived by the maintainer for Phase 5 sign-off.
- [x] Manual keyboard checks are documented for loading, results, failures, filters, and saved-item updates.
- [x] Reduced-motion preference is respected by the automated browser check; human OS/browser review remains NOT RUN and is explicitly waived by the maintainer for Phase 5 sign-off.
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

Manual acceptance is documented in [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md). The maintainer explicitly approved Phase 5 and waived the remaining human visual checks for phase sign-off on 2026-10-21. The outstanding human visual checks (768px/desktop, contrast, reduced motion, long-content) remain NOT RUN and are accepted as documented exceptions; automated proxy checks passed and are not represented as human sign-off. Keyboard and 200% zoom checks remain maintainer-reported PASS.
