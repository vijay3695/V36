# Contributing to V36

Thanks for helping improve V36. The first public release has a strict completion gate: planned features, tests, CI, accessibility checks, and documented manual acceptance checks must be implemented and verified before release.

## Before opening a pull request

1. Read README.md and SECURITY.md.
2. Keep the app static-first. Do not add a required server, database, account, paid service, AI API key, or GitHub token without a separate project decision.
3. Preserve the distinction between confirmed GitHub data, inferred categories, and unavailable data.
4. Never describe stars as project health or infer that a repository is dead from its last commit.
5. Keep issue and repository content untrusted. Use safe DOM APIs such as textContent; do not inject remote content as HTML.
6. Add or update tests for behavior changes.

## Local checks

Requires Node.js 20+.

    npm install
    npm test
    npm run test:all

Husky installs local Git hooks during `npm install`: the pre-commit hook runs unit tests, and the pre-push hook runs the complete bulk suite. The single GitHub Actions workflow also runs `npm run test:all` in one job; do not add separate workflows/jobs for individual test suites. The bulk suite includes the Playwright browser tests, including the automated accessibility spec. Automated accessibility scans do not replace manual keyboard checks.

## Pull request expectations

- Explain the problem and intended behavior.
- Include relevant tests and accessibility impact.
- State any checks that were not run and why.
- Do not claim tests passed unless you ran them and saw a passing result.
- Avoid unrelated refactors and preserve existing user data formats unless a migration is documented.

## Release gate

A release must have passing CI, automated tests, documented manual acceptance, automated accessibility results, manual keyboard results, a review of known limitations, and evidence tied to the exact release commit. Failed or skipped checks must be disclosed; they cannot be silently treated as passing.
