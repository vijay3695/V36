# V36 release acceptance checklist

Do not publish the first release until every applicable item below is completed and evidenced against the exact release commit.

## Discovery and filters

- [ ] Search public GitHub issues using supported search qualifiers.
- [ ] Language, labels, issue type, issue creation date/custom bounds, issue update date/custom bounds, commit age/custom bounds, star presets and exact min/max, categories, and sorting behave as specified.
- [ ] Custom date ranges are supported where planned or the specification is explicitly updated before release.
- [ ] AND behavior is consistent and explained.
- [ ] Metadata-dependent filters never silently exclude items merely because metadata is not yet fetched; unknown data is identified.
- [ ] Filtering within loaded results is clearly distinguished from GitHub's total result count.
- [ ] Load more, incomplete search results, empty matches, request failure, and API rate limits have distinct states.
- [ ] Search URLs round-trip all supported filter settings and contain no saved data or secrets.
- [ ] Older repositories remain visible by default; no health score or dead-project verdict is displayed.

## Activity evidence and details

- [ ] Issue details refresh from GitHub where practical and show fetch timestamps.
- [ ] Repository latest commit date, issue dates, available PR/issue activity, language, and star count are shown with unknown/unavailable distinctions.
- [ ] API failures preserve loaded issue results and saved references.
- [ ] Related-work links are search links and do not claim automatic duplicate detection.
- [ ] Saved references remain when issues close, move, disappear, or become inaccessible; the UI communicates status honestly.
- [ ] No source file, repository instruction, test result, or other fact is invented.

## AI context packs

- [ ] Context pack uses only retrieved information and is copyable.
- [ ] Every included source has a grounded link and fetch time where available.
- [ ] Missing README, contribution instructions, commit evidence, and other context is disclosed.
- [ ] Source-file links are included only when identifiable from retrieved evidence.
- [ ] Issue and repository content is clearly treated as untrusted input.
- [ ] Context pack never claims repository code or tests were inspected/run when they were not.
- [ ] No AI API, paid key, automatic code execution, or automatic PR creation is required.

## Saved items and portability

- [ ] Saved issues and saved searches are separate on the Saved page.
- [ ] Saved issue references are canonicalized and deduplicated.
- [ ] Equivalent filter presets deduplicate by normalized settings.
- [ ] Import validates version, structure, types, string lengths, item count, and total file size.
- [ ] Import reports accepted, rejected, and duplicate items without silently overwriting unrelated data.
- [ ] Malformed or oversized import leaves existing saved data unchanged.
- [ ] Export creates a usable versioned backup.
- [ ] Browser storage failures are surfaced without claiming data was saved.
- [ ] No credentials or tokens are stored.

## Security and privacy

- [ ] Remote content is rendered with safe DOM APIs; no untrusted HTML is injected.
- [ ] External links use safe protocols and do not auto-open links found in issue text.
- [ ] No tokens, credentials, secrets, or private API keys are present in client code or local storage.
- [ ] Rate-limit handling stops additional requests; no bypass behavior exists.
- [ ] Security tests cover unsafe URLs, hostile content, malformed imports, oversized imports, duplicates, and data preservation.

## Accessibility

- [ ] Automated axe/WCAG checks pass for Discover, Saved, About, and issue details.
- [ ] Full keyboard-only navigation works, including filters, results, details, import/export, and context-pack copy.
- [ ] Focus is visible and restored sensibly after navigation and dialogs/controls.
- [ ] Semantic headings, landmarks, labels, accessible names, and status messages are correct.
- [ ] Text and controls meet the agreed contrast criteria.
- [ ] Manual keyboard checks are documented for loading, results, failures, filters, and saved-item updates.
- [ ] Reduced-motion preference is respected.
- [ ] Automated accessibility success is not described as proof of complete accessibility.

## Automated tests and CI

- [ ] Unit tests cover filters, date handling, URL encoding/decoding, category inference, import/export validation, duplicate detection, and failure states.
- [ ] Browser end-to-end tests cover search, load more, details, activity evidence, related links, context packs, saved issues/searches, import/export, and shareable URLs.
- [ ] Routine tests use deterministic mocked GitHub responses.
- [ ] Edge cases include unknown dates, partial results, closed/moved/deleted issues, malformed imports, duplicate imports, storage failures, network errors, and rate limits.
- [ ] GitHub Actions CI passes on the release commit.
- [ ] No test is marked passing unless it ran and passed.
- [ ] Manual acceptance results are recorded.

## Release evidence

- [ ] Known limitations and failed/skipped checks are disclosed.
- [ ] Verification report and checklist identify the exact release commit SHA.
- [ ] No first release is published while any mandatory item is incomplete.


## Manual acceptance

Before first release, complete every applicable keyboard-only, responsive, reduced-motion, and high-zoom check in [MANUAL_ACCEPTANCE.md](MANUAL_ACCEPTANCE.md). Automated axe checks alone are not sufficient. Record the reviewer, environment, commit SHA, outcome, and any follow-up defects; until then, manual accessibility acceptance remains pending.
