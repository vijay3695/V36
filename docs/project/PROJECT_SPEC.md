# V36 Project Specification

Status: **v0.1.0 Public Preview published** (2026-10-24). The implementation and release verification are recorded in `PHASE_6_AUDIT.md`, `RELEASE_VERIFICATION.md`, and `ACCEPTANCE_CHECKLIST.md`. Historical planning decisions below describe intended product behavior; use current verification records for implementation status.

## Product goal

A free, static-first site that helps contributors discover public GitHub issues, evaluate observable repository activity, and prepare portable context packs for AI coding assistants. It must not present activity signals as a verdict about project health.

## Confirmed decisions

- License: MIT.
- Hosting: GitHub Pages or equivalent free static hosting. No paid backend, VPS, database, account system, or required AI API.
- Main navigation: Discover, Saved, About.
- Discovery: language, labels and issue type, issue creation and update age, optional latest-commit age, star-count ranges, contribution category, sorting, and shareable search URLs.
- Search results: compact cards with repository, issue title, language, labels, stars, issue update date, and GitHub link. Activity evidence belongs in the detail view.
- Filtering: AND logic. GitHub-supported filters are applied to search first; metadata-dependent filters are evaluated only against loaded results and must disclose that limitation.
- Older repositories remain visible by default. No overall health score or dead-project label. Missing data is Unknown or Unavailable.
- Contribution categories: Bug fix, Documentation, Tests, Feature or enhancement, Refactoring, and Other/No category inferred. Inference is conservative and visibly separate from official labels.
- Popularity: optional star ranges; stars are popularity context, never health evidence.
- Loading: fetch a small first page, allow Load more, and fetch extra activity only for displayed results where practical.
- Details: dedicated issue view with current issue/repository evidence, related issue and pull-request search links, and AI context-pack generation.
- Duplicate handling: search links only; no automatic duplicate-detection claim.
- AI context packs: provider-portable, copyable, based only on retrieved information, with source links, fetch times, missing context, and limitations. No AI API calls, repository execution, test execution, or automatic PR creation.
- Saved data: local browser storage, no account or sync. Dedicated Saved page separates issues and saved searches. Export/import uses validated, size-limited JSON, deduplicates canonical references and equivalent filter presets, and preserves unrelated data.
- Share URLs contain filters only, not saved items, credentials, or tokens.
- API limits: anonymous mode remains fully available. An optional, user-supplied fine-grained PAT experiment is implemented on `feature/github-token-auth` but is not enabled on `main` until reviewed and merged. Authenticated requests may raise primary REST limits, while Search API has separate limits and can return only repositories the token can access. Stop additional requests when rate-limited, preserve results and saves, disclose retry timing when known, and allow manual retry.
- Failures: preserve visible results and saved references, identify failed fields, and distinguish unavailable data from zero matches and incomplete results.
- Freshness: GitHub is the source of truth. Refresh issue/repository data when opening details and generating context packs where practical. Show fetch times and never present saved snapshots as current.
- Security: all GitHub content and imported files are untrusted. Render safely, never execute remote content, validate import size/schema, and never include tokens in saved data, exports, URLs, context packs, or diagnostics. On the experiment branch only, token persistence is opt-in and uses browser localStorage with an explicit same-origin JavaScript/XSS warning; session-only mode is the default.
- Accessibility: every agreed criterion is a release blocker. Automated checks plus documented manual keyboard checks are required.
- Tests: unit tests, browser end-to-end tests, accessibility checks, and GitHub Actions CI. Use mocks for routine tests; separate optional live GitHub checks.
- Release scope: the first public preview `v0.1.0` has been published after the release workflow passed on the exact release commit. Apply the same evidence gate to future releases.
- Release verification: require a release checklist and report tied to the exact release commit; never claim a check passed unless it actually ran and passed.

## Planned repository structure

- index.html
- css/styles.css
- js/ application modules
- ../tests/ unit and browser acceptance tests
- .github/workflows/ci.yml
- .github issue and pull request templates
- README.md, LICENSE, CONTRIBUTING.md, SECURITY.md
- PROJECT_SPEC.md and ACCEPTANCE_CHECKLIST.md

## Verification source of truth

The v0.1.0 public preview has passed its recorded release gate. The release candidate `77b36385f3a2e9fb603d1602b451d152fda91cd7` passed 107 unit tests, 47 browser tests, and 6 accessibility scans in [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927); [release workflow #1](https://github.com/vijay3695/V36/actions/runs/40088852176) and [Pages deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) succeeded. Numeric light/dark component contrast ratios are documented in `CONTRAST_AUDIT.md` and regression-tested. See `PHASE_6_AUDIT.md` for scope, limitations, and the distinction between automated results and maintainer-reported manual checks. Do not treat the earlier implementation-gap list as current open work.
