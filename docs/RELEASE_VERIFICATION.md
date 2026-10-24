# Release verification record

Release tag planned: `v0.1.0` (Public Preview).

The release workflow is configured to publish only after `npm run test:all` passes on the exact commit associated with the release-note trigger. This includes unit tests, Playwright browser tests, and accessibility checks.

Contrast measurement is recorded in `CONTRAST_AUDIT.md`, calculated from the actual CSS theme tokens, and guarded by `tests/contrast-audit.test.js`.

Do not mark the release as published or verified until the associated GitHub Actions run completes successfully and the public release page confirms the tag and target commit.
