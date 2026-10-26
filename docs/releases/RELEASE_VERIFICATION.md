# Release verification record

**Status: PUBLISHED AND VERIFIED**

- **Release:** [V36 v0.1.0 — Public Preview](https://github.com/vijay3695/V36/releases/tag/v0.1.0)
- **Published:** 2026-10-24
- **Exact release commit:** `77b36385f3a2e9fb603d1602b451d152fda91cd7`
- **Release CI:** [Workflow run #1](https://github.com/vijay3695/V36/actions/runs/40088852176) — succeeded.
- **Full test suite:** [CI run #142](https://github.com/vijay3695/V36/actions/runs/40088851927) — passed 107 unit tests, 47 browser tests, and 6 accessibility scans.
- **GitHub Pages deployment:** [Deployment #69](https://github.com/vijay3695/V36/actions/runs/40088851539) — succeeded on the release commit.
- **Contrast audit:** `../testing/CONTRAST_AUDIT.md` documents numeric light/dark theme component ratios; `tests/contrast-audit.test.js` recalculates the checked token combinations.

## Scope and limitations

The published preview uses the unauthenticated GitHub API, so rate limits and incomplete results remain possible. Metadata-dependent filters evaluate loaded results only. Related issues and pull requests are surfaced through GitHub search links rather than automatic duplicate detection. Context packs do not run repository code or tests, call an AI API, or modify target repositories. Saved data remains in the user's browser.

Manual acceptance outcomes are recorded in `../testing/MANUAL_ACCEPTANCE.md` as maintainer-reported results; browser/OS and assistive-technology versions were not supplied and are not inferred. Automated checks and reported manual checks are distinct evidence types.

This file is the current release-verification record. Earlier planning statements that publication was pending are superseded by the published release linked above. Do not infer that this documentation update reran the release suite; the cited results apply to the exact release commit.
