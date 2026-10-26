# V36

**Live app:** [Open V36 on GitHub Pages](https://vijay3695.github.io/V36/) · **Source:** [GitHub repository](https://github.com/vijay3695/V36)

V36 is a free, static-first open-source discovery tool for finding GitHub issues and preparing evidence-backed context packs for AI coding assistants.

**Published release:** [V36 v0.1.0 — Public Preview](https://github.com/vijay3695/V36/releases/tag/v0.1.0) was published on 2026-10-24 after the `Publish v0.1.0` workflow passed on release commit `77b36385f3a2e9fb603d1602b451d152fda91cd7`. The latest documentation and status corrections are tracked on `main`; historical test runs below the current status are not claims about the latest commit. See the [documentation index](docs/README.md) for a map of project records, testing evidence, audits, and release documents; the [numeric contrast audit](../docs/testing/CONTRAST_AUDIT.md) for light/dark component ratios and regression coverage.

## Principles

- Show evidence, dates, and uncertainty; do not label repositories as dead or assign an overall health score.
- Keep older projects visible unless the user explicitly filters them out.
- Clearly distinguish GitHub-provided labels from conservatively inferred contribution categories.
- Preserve loaded results and saved references when requests fail.
- Treat GitHub content and imported files as untrusted input.
- Never require a GitHub token. Optional token connection is an isolated experiment; device storage is opt-in and disclosed, and tokens never enter exports or share URLs.
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

The application is designed for GitHub Pages and modern browsers using static HTML, CSS, and JavaScript modules. No server, database, account system, or paid AI API is required. Anonymous GitHub access remains available; an optional token-based experiment is being reviewed on `feature/github-token-auth`. Authenticated search may be limited to repositories the token can access. See [the experiment plan](docs/project/GITHUB_TOKEN_AUTH_EXPERIMENT.md).

## Documentation and contributor handoff

**AI coding agents:** start with [AGENTS.md](AGENTS.md). Use the [documentation index](docs/README.md) to find project records, detailed requirements, design plans, test evidence, audits, and release notes.

Key project records live in `docs/`:

- [Decision log](../docs/project/DECISIONS.md) — maintainer-confirmed scope and exclusions.
- [Current progress](../docs/project/PROGRESS.md) — verified status, evidence, and next actions.
- [Phases](../docs/project/PHASES.md) — phased work and acceptance criteria.
- [Working plan](../docs/project/PLAN.md) — coding-agent guardrails.
- [Project specification](../docs/project/PROJECT_SPEC.md) and [detailed requirements](../docs/project/PROJECT_PLAN.md).

Keep these records synchronized. Never mark a feature or phase complete without evidence.

## Development

Prerequisites: Node.js 20 or newer.

```sh
npm install
npm test
```

Browser end-to-end tests and accessibility checks are part of the release gate; see `CONTRIBUTING.md`, `SECURITY.md`, and the [manual acceptance checklist](../docs/testing/MANUAL_ACCEPTANCE.md). Automated accessibility scans do not replace manual keyboard acceptance. A passing unit-test command alone does not establish release readiness.

## Release policy

The first public preview (`v0.1.0`) has been published after the release workflow passed on its exact release commit. Future releases must not be published until their planned scope is implemented and verified, automated tests and CI pass, accessibility criteria pass through both automated and documented manual checks, and the release acceptance checklist is complete. Do not claim checks passed unless they were actually run.

## License

MIT. See [LICENSE](LICENSE).
