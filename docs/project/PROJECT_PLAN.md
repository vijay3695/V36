# V36 Project Plan

<!-- RELEASE EVIDENCE SNAPSHOT: 2026-10-24. Current release status is recorded below; older verification notes are historical. -->

> **Current verified status (2026-10-24):** The public preview [V36 v0.1.0](https://github.com/vijay3695/V36/releases/tag/v0.1.0) is published from `77b36385f3a2e9fb603d1602b451d152fda91cd7`. [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927) passed **107 unit tests, 47 browser tests, and 6 accessibility scans**; [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded; [release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176) succeeded. Per-component numeric contrast ratios for both themes are recorded in [`docs/testing/CONTRAST_AUDIT.md`](../testing/CONTRAST_AUDIT.md) and recalculated by [`tests/contrast-audit.test.js`](../../tests/contrast-audit.test.js) where this relative link is valid only for docs files. **No Phase 0–6 or active release/CI/deployment task remains pending.** Older status notes below describe earlier snapshots and are not the current state.


**Status:** Phase 6 VERIFIED; public preview [v0.1.0](https://github.com/vijay3695/V36/releases/tag/v0.1.0) published on 2026-10-24. The release commit `77b36385f3a2e9fb603d1602b451d152fda91cd7` passed 107 unit tests, 47 browser tests, and 6 accessibility scans in [CI #142](https://github.com/vijay3695/V36/actions/runs/40088851927); release workflow #1 and Pages deployment #69 succeeded. The numeric contrast audit is complete. Manual checks reported by the maintainer are distinguished from automated evidence in `MANUAL_ACCEPTANCE.md`.
**License:** MIT
**Default branch:** `main`
**Hosting target:** GitHub Pages (static-first; no paid backend or AI API).
**Source of truth:** GitHub issues and repositories. Saved data stays in the user's browser.

## 1. Purpose

V36 helps open-source contributors discover GitHub issues that may fit their skills, inspect relevant repository/activity evidence, save issues and searches, and prepare portable context packs for the AI coding assistant they choose.

V36 must not pretend to determine whether a repository is "dead" or healthy. It presents observable evidence and uncertainty so users can judge for themselves.

## 2. Release rule

**Do not publish a first release until every required feature and release check in this plan is implemented and verified.** A green CI run is necessary but not sufficient. Do not claim the app or release is ready merely because files exist or a workflow was triggered.

## 3. Navigation and core experience

- **Discover:** issue search, filters, compact result cards, load-more behavior, and issue details.
- **Saved:** saved issue references and saved search presets; export/import.
- **About:** purpose, limitations, contribution guidance, and project rules.

Issue result cards show repository, issue title, language metadata where available, official labels, stars, issue update date, and a direct GitHub link. Detailed views show activity evidence, dates, uncertainty, related-issue/PR search links, and context-pack generation.

## 4. Search and filters

- Programming language: use repository language metadata, including languages other than the primary language when the available GitHub data supports it. A repository's language does not prove which language an issue requires.
- Official labels and issue type.
- Conservative inferred contribution category, visibly separate from official labels:
  - Bug fix
  - Documentation
  - Tests
  - Feature or enhancement
  - Refactoring
  - Other / No category inferred
- Issue creation age and last-updated age are separate filters. Support 7-, 30-, 90-, and 365-day presets and custom ranges where practical.
- Optional latest-commit/push-age filter with 30-, 90-, 180-, and 365-day presets and custom range where supported. GitHub's repository `pushed` metadata is not necessarily the exact latest commit date.
- Popularity filters: minimum/maximum stars and presets under 100, 100–999, 1,000–9,999, and 10,000+. No popularity filter is selected by default.
- Sorting: recently updated by default; recently created, most discussed, and GitHub relevance where supported.
- Provide custom date bounds for issue creation, last update, latest commit, and repository last push, plus exact minimum/maximum stars. Repository last-push age is a separate filter from latest commit age because `pushed_at` is not the same as a commit timestamp. Custom date bounds override the corresponding age preset; exact star bounds override star presets.
- Filters combine with AND logic by default. Explain the behavior to users.

Older repositories remain visible unless a user explicitly filters them out. Unknown dates and unavailable metadata are shown as **Unknown**, never guessed. Stars indicate popularity, not health.

## 5. Search completeness and pagination

Load a small first page promptly and fetch more only on request. Show the number of loaded results and make clear that it may not equal the full matching set.

Apply GitHub-supported query filters first. Apply additional metadata-based filters only to loaded results and disclose that coverage is partial until more results are loaded. Never claim that all matching results were evaluated when only a subset was loaded.

## 6. Activity evidence and failures

Display dates and available evidence rather than an overall repository health score. Fetch extra activity data only for displayed results to conserve API quota.

If activity data is unavailable, keep the issue visible and mark the missing fields Unknown; offer retry. On rate limits, stop extra requests, preserve loaded results and saved items, explain the limit and retry time if known, and provide manual retry. Never bypass rate limits or require users to supply a token.

For failures, preserve existing results and saved items, identify which data failed, distinguish unavailable data from zero matches, and never fabricate cached data or silently discard results.

## 7. Saved data and URL sharing

- Store saved issues and search presets in browser local storage; no account or backend.
- A dedicated Saved page lists both types.
- Export/import saved data as a file. Validate imports, deduplicate issues by canonical GitHub issue URL or stable identity, normalize search presets, report duplicates, and preserve unrelated saved data rather than silently overwriting it.
- Explain that browser storage can be lost when browser data is cleared or private browsing ends.
- If an issue closes, moves, is deleted, or becomes inaccessible, preserve the saved reference and show the status/retrieval limitation. Do not silently remove it.
- Shareable URLs encode search filters only. Never include private saved data or credentials. Results are fetched again and may differ over time.

## 8. AI context packs

Generate a copyable, provider-portable prompt from information actually retrieved. Include, when available:
- Issue title, description, official labels, and canonical GitHub link.
- Repository README.
- Contribution instructions.
- Source-file links when identifiable from available evidence.
- A reusable prompt asking the user's chosen coding assistant to analyze the issue.

Do not download or execute the entire repository, run project tests, call a paid AI API, or make automatic code changes. Each pack must list source links, fetch times, unavailable context, and limitations. Never invent files, instructions, test results, or facts. Incomplete packs are allowed only when the missing context is disclosed.

## 9. Security and privacy

Treat GitHub issue/repository content and imported files as untrusted input. Render text safely; do not execute imported or retrieved scripts/HTML. Validate and limit imported data. Do not store credentials, access tokens, or secret-bearing API keys. Security-sensitive behavior must be tested before release.

## 10. Planned repository structure

```
index.html
css/
js/
tests/
  unit/
  e2e/
README.md
PROJECT_PLAN.md
LICENSE
CONTRIBUTING.md
SECURITY.md
package.json
playwright.config.js
.github/
  ISSUE_TEMPLATE/
  workflows/ci.yml
```

The actual repository layout may differ as implementation evolves; update this plan when a deliberate, reviewed change is made.

## 11. Testing and CI requirements

### Unit tests
Cover filters, date ranges, commit/push-age interpretation, search URL encode/decode, category inference, duplicate detection, and import/export validation.

### Browser end-to-end tests
Cover discovery/search, filters, load more, issue details, context-pack generation, saved issues/searches, import/export, and shareable URLs.

### Accessibility
Automated checks plus documented manual keyboard checks. Verify keyboard navigation, visible focus, semantic headings/structure, accessible labels, contrast, and status/error announcements. Automated checks alone do not prove full accessibility.

### Failure and edge-case tests
Cover unknown dates, partial results, rate limits, failed metadata requests, closed/inaccessible issues, malformed/oversized imports, duplicates, and preservation of existing saved data.

### CI
Run unit tests, browser end-to-end tests, and automated accessibility checks on relevant pushes and pull requests. Use mock GitHub API responses for routine tests; keep live API checks separate and quota-aware. Do not claim checks passed unless their results are verified.

## 12. Release acceptance gate

A first release is blocked until all of the following are true:

- [ ] All planned filters and their limitations behave as documented.
- [ ] Saved issues/searches, export/import validation, deduplication, and shareable URLs work.
- [ ] Context packs contain only retrieved, sourced information and disclose missing context.
- [ ] Activity evidence, Unknown states, partial results, rate-limit handling, and retry behavior work.
- [ ] Unit tests pass.
- [ ] Browser end-to-end tests pass.
- [ ] Automated accessibility checks pass.
- [ ] Manual keyboard acceptance checks are documented and complete.
- [ ] Security-sensitive rendering and import handling are tested.
- [ ] CI passes on the release candidate commit.
- [ ] A public, auditable release verification report records the tested commit, checks run, results, limitations, and any skipped/failed checks.
- [ ] Documentation matches the implemented behavior.

Any release-blocking defect prevents publication. A workflow run or commit is not proof of completion.

## 13. Delivery sequence

1. Stabilize CI and make every existing test failure actionable.
2. Review the current implementation against this plan without removing agreed features.
3. Fix the underlying causes of failing checks; avoid pushing a succession of unverified fixes.
4. Run unit tests, end-to-end tests, and accessibility checks locally or in CI and inspect the actual failure output.
5. Verify every release-gate item and document any known limitation.
6. Publish only after the release gate is satisfied.

## 14. Current status

Historical verification snapshot: Phase 6 was verified on tested candidate `7e91404d05e85cb24447ae5708ec21896f4a5728`: [CI run #73](https://github.com/vijay3695/V36/actions/runs/39642076673) passed 101/101 unit tests, 42/42 browser tests, and 3/3 standalone accessibility scans; [responsive overflow run](https://github.com/vijay3695/V36/actions/runs/39642076859) passed at 320/375/768/1280px. The 2026-10-21 Phase 5 waiver is historical sign-off context; later maintainer-reported manual outcomes are recorded in `docs/testing/MANUAL_ACCEPTANCE.md`. The v0.1.0 public preview was subsequently published; see `docs/releases/RELEASE_VERIFICATION.md` for exact release-commit evidence.
