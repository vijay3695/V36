# V36

**Live app:** [Open V36 on GitHub Pages](https://vijay3695.github.io/V36/) · **Source:** [GitHub repository](https://github.com/vijay3695/V36)

V36 is a free, static-first open-source discovery tool for finding GitHub issues and preparing evidence-backed context packs for AI coding assistants.

**Published release:** [V36 v0.1.0 — Public Preview](https://github.com/vijay3695/V36/releases/tag/v0.1.0) was published on 2026-10-24 after the `Publish v0.1.0` workflow passed on release commit `77b36385f3a2e9fb603d1602b451d152fda91cd7`. The latest documentation and status corrections are tracked on `main`; historical test runs below the current status are not claims about the latest commit. See the [numeric contrast audit](docs/CONTRAST_AUDIT.md) for light/dark component ratios and regression coverage.

## Principles

- Show evidence, dates, and uncertainty; do not label repositories as dead or assign an overall health score.
- Keep older projects visible unless the user explicitly filters them out.
- Clearly distinguish GitHub-provided labels from conservatively inferred contribution categories.
- Preserve loaded results and saved references when requests fail.
- Treat GitHub content and imported files as untrusted input.
- Never require or store a GitHub token, credentials, or a paid API key.
- Generate portable AI context packs from retrieved information only.
- Respect GitHub API limits and disclose when loaded results are incomplete.

## Included in the public preview

- Discover issues with language, labels, issue type, date, commit-age, popularity, category, and sorting filters.
- Compact search results and a dedicated issue-detail view with activity evidence.
- Related issue and pull-request search links rather than automatic duplicate claims.
- Copyable AI context packs with source links, fetch times, missing context, and limitations.
- Shareable search URLs.
- A Saved page for issues and search presets, using browser-local storage and validated JSON import/export.
- Accessible keyboard-first navigation and explicit loading, empty, partial, unavailable, and error states.

## Technology and hosting

The application is designed for GitHub Pages and modern browsers using static HTML, CSS, and JavaScript modules. No server, database, account system, or paid AI API is required. GitHub's unauthenticated API limits still apply.

## Contributor handoff and project tracking

**AI coding agents: start with [AGENTS.md](AGENTS.md).** It explains the whole project, specifies the required reading order, and tells agents how to begin the current coding task.

Supporting records:

1. [DECISIONS.md](DECISIONS.md) — what the maintainer explicitly decided, first-release scope, and what is deferred/excluded.
2. [PROGRESS.md](PROGRESS.md) — current status, verified evidence, blockers, and next actions.
3. [PHASES.md](PHASES.md) — phased work breakdown and acceptance checklists.
4. [PLAN.md](PLAN.md) — coding-agent instructions and guardrails.
5. [Detailed project specification](docs/PROJECT_PLAN.md) — full product requirements and release rules.

Update `PROGRESS.md` alongside implementation work. Never mark a feature or phase complete without test evidence. Keep confirmed decisions separate from implementation status.

## Development

Prerequisites: Node.js 20 or newer.

```sh
npm install
npm test
```

Browser end-to-end tests and accessibility checks are part of the release gate; see `CONTRIBUTING.md`, `SECURITY.md`, and the [manual acceptance checklist](docs/MANUAL_ACCEPTANCE.md). Automated accessibility scans do not replace manual keyboard acceptance. A passing unit-test command alone does not establish release readiness.

## Release policy

The first public preview (`v0.1.0`) has been published after the release workflow passed on its exact release commit. Future releases must not be published until their planned scope is implemented and verified, automated tests and CI pass, accessibility criteria pass through both automated and documented manual checks, and the release acceptance checklist is complete. Do not claim checks passed unless they were actually run.

## License

MIT. See [LICENSE](LICENSE).
