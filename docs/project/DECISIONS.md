# V36 Decision Log

This file records product decisions made by the maintainer during planning. It exists so coding agents do not need access to the original chat to understand what was agreed, what belongs in the first release, and what is explicitly not part of the current scope.

**Status key**
- **CONFIRMED** — explicitly chosen or agreed.
- **FIRST RELEASE** — included in the first public release; must be implemented and verified before release.
- **LATER / OUT OF CURRENT SCOPE** — intentionally deferred or excluded from the current implementation scope.
- **PROPOSED / UNCONFIRMED** — recommended, but not explicitly decided by the maintainer.

When this log conflicts with implementation assumptions, follow the confirmed decision and update the implementation. If a genuine conflict exists between decision documents, stop and reconcile the docs rather than guessing. Update this file when the maintainer changes a decision.

## 1. Product direction and constraints

| Topic | Decision | Status |
|---|---|---|
| Project name | V36 | CONFIRMED |
| License | MIT | CONFIRMED |
| Hosting / architecture | Static-first website intended for GitHub Pages; keep it usable without a paid server or backend | CONFIRMED |
| Budget | No paid hosting, database, or AI API dependency | CONFIRMED |
| Accounts / backend | No user account system or server database for the planned first release | FIRST RELEASE |
| GitHub credentials | Anonymous mode must remain available. Optional user-supplied fine-grained PAT support is present on `main`; never required. In-memory session mode is default; browser localStorage only after explicit opt-in and risk warning. Tokens must never enter exports, URLs, context packs, or diagnostics. Live rate-limit benefit and broad-search effects remain unverified. | IMPLEMENTED; LIVE VERIFICATION PENDING |
| AI provider | Generate a portable context prompt for the user's own AI assistant; do not call an AI API or make automatic code changes | FIRST RELEASE |
| Evidence philosophy | Show evidence, dates, source links, and uncertainty. Do not produce a simplistic “dead/alive” verdict or overall repository health score | FIRST RELEASE |
| Release policy | Do not publish the first release until every agreed feature and release check is implemented and verified | CONFIRMED |

## 2. What belongs in the first release

The maintainer selected the **complete-scope release gate**. The following are not optional “nice to have” items to silently defer until after launch.

| Area | Agreed behavior | Status |
|---|---|---|
| Discovery filters | Language, labels/issue type, issue age, last update, latest commit/push age, contribution category, popularity, and sorting | FIRST RELEASE |
| Issue details | Dedicated detail view with issue description, links, dates, and activity evidence | FIRST RELEASE |
| Activity evidence | Show available dates and metadata; unknown/unavailable values remain Unknown | FIRST RELEASE |
| Saved items | Save issues and search presets in browser local storage | FIRST RELEASE |
| Import/export | Validated saved-data file import/export, duplicate handling, and preservation of existing data | FIRST RELEASE |
| Context packs | Copyable, provider-portable AI context pack with source links, fetch times, missing context, and limitations | FIRST RELEASE |
| URL sharing | Share search filters only; do not encode saved/private data or credentials | FIRST RELEASE |
| Accessibility | Automated checks plus documented manual keyboard acceptance checks | FIRST RELEASE |
| Tests and CI | Unit tests, browser E2E tests, accessibility checks, and GitHub Actions CI | FIRST RELEASE |
| Documentation | README, contributing/security guidance, phase tracking, progress log, and release verification evidence | FIRST RELEASE |
| Security | Safe rendering of untrusted GitHub content; validated/limited imports; no execution of imported HTML/scripts | FIRST RELEASE |

## 3. Confirmed filter and discovery decisions

| Topic | Decision |
|---|---|
| Language | Use repository language metadata for any language supported by the available GitHub data, not only the primary language. Clearly state that repository languages do not prove which language a particular issue needs. |
| Filter combination | Apply selected filters with AND logic by default. Explain this to users. |
| Unsupported filters | Apply GitHub-supported query filters first; apply additional metadata filters to loaded results and disclose incomplete coverage. Never imply the entire result set was checked when only loaded results were evaluated. |
| Default sort | Recently updated first. Offer recently created or GitHub relevance where supported. Recency is not a health verdict. |
| Issue dates | Keep issue creation age separate from last-updated age. Provide 7-, 30-, 90-, and 365-day presets and custom ranges where practical. |
| Commit age | Optional filter with 30-, 90-, 180-, and 365-day presets and custom range where supported. Do not hide older projects by default. Explain that GitHub push metadata may not be the exact latest commit date. |
| Unknown dates | Show Unknown; never guess or silently drop an item because data is missing. |
| Contribution categories | Infer conservatively from labels and issue text; clearly distinguish inferred categories from official labels. If evidence is weak, use “No category inferred.” |
| Categories | Bug fix; Documentation; Tests; Feature or enhancement; Refactoring; Other / No category inferred. Multiple categories may apply where supported. |
| Popularity | Provide star-count filters: under 100, 100–999, 1,000–9,999, and 10,000+, plus min/max where practical. No popularity filter by default. Stars mean popularity, not health. |
| Results and pagination | Fetch a small first page, load more on demand, and clearly distinguish loaded results from the full matching set. Fetch supplemental activity only for displayed results to conserve API quota. |
| Duplicate discovery | In the first release, provide GitHub search links for similar issues and pull requests. Do not claim automatic duplicate detection. |

## 4. Confirmed saved-data decisions

- Use browser local storage; no account or backend.
- Provide a dedicated Saved page for saved issues and saved search presets.
- Export and import saved data through a file.
- Validate imported data, normalize search presets, deduplicate issue references by canonical GitHub issue URL or stable identity, and report duplicates.
- Do not silently overwrite unrelated saved data or corrupt existing saved items when an import fails.
- Explain that browser storage can be lost when browser data is cleared or private browsing ends.
- Keep saved references if an issue closes, moves, is deleted, or becomes inaccessible; show the status or retrieval limitation instead of silently deleting the reference.

## 5. Confirmed API limits and failure handling

- When rate limited, stop additional requests, preserve already-loaded results and saved items, explain the limit and retry time when known, and offer manual retry.
- Never bypass rate limits and never require a GitHub token.
- Experimental token-based authentication may raise general REST capacity, but Search API limits are separate (GitHub documents 10 requests/minute unauthenticated and up to 30 authenticated) and authenticated search can return only resources the token has access to. Verify real behavior before merge.
- If activity metadata cannot be retrieved, keep the issue visible and mark missing fields Unknown; allow retry.
- Preserve current results and saved data on failures.
- Clearly distinguish unavailable data from zero matches.
- Never fabricate fallback data or silently discard results.
- Display data fetch times and indicate stale/unavailable information where practical. GitHub is the source of truth; saved references or previously displayed snapshots must not be implied to be current.

## 6. Confirmed AI context-pack decisions

- Build a copyable prompt from information actually retrieved.
- Include issue title, description, labels, canonical link, repository README, contribution instructions, and source-file links when available.
- List source links, fetch times, missing/unavailable context, and limitations.
- Incomplete packs are acceptable only when their gaps are disclosed.
- Never invent source files, repository instructions, test results, or facts.
- Do not download or execute an entire repository, run project tests, call a paid AI API, or change code automatically.

## 7. Confirmed interface and repository decisions

- Main navigation: **Discover**, **Saved**, **About**.
- Search filters and issue detail views live within Discover.
- Keep search cards compact; show repository, issue title, language, labels, stars, update date, and GitHub link. Show activity evidence in detail view.
- Use a structured static repository with separate HTML, CSS, and JavaScript modules; include README, MIT LICENSE, CONTRIBUTING, SECURITY, GitHub issue/PR templates, tests, and CI.
- Routine automated tests should use mocked GitHub API responses; live API checks should be separate and quota-aware.

## 8. Phase order agreed for implementation

1. **Phase 0 — Baseline and CI stabilization.** Inspect actual failure logs, reproduce the failing E2E tests, and fix root causes before stacking more changes.
2. **Phase 1 — Core discovery and filtering.**
3. **Phase 2 — Issue details and activity evidence.**
4. **Phase 3 — Saved issues/searches and portability.**
5. **Phase 4 — AI context packs.**
6. **Phase 5 — Accessibility, resilience, and security.**
7. **Phase 6 — End-to-end verification and release readiness.**

This order is an implementation sequence, not permission to omit a later phase from a release. The v0.1.0 public preview has been published after its required phases and acceptance criteria passed; future releases must meet their applicable acceptance criteria before publication.

## 9. Explicitly deferred or excluded from current scope

| Feature | Decision |
|---|---|
| Automatic duplicate detection | Not in the first release; use GitHub search links for related issues/PRs. |
| AI API integration / built-in AI agent | Excluded from current scope; context packs are generated locally for the user to paste into their own assistant. |
| Automatic code edits, repository execution, or running target-repository tests | Excluded from current scope. |
| Full repository download for context packs | Excluded from current scope. |
| Accounts, server-side saved data, paid database/backend | Excluded from first-release scope. |
| Required personal access token | Excluded; token connection must remain optional. Any optional token feature requires explicit maintainer approval and verified security/rate-limit evidence. |
| Overall repository health score or “dead/alive” label | Explicitly rejected; show evidence instead. |

These items are not a promise to implement them after release. Reconsider them only if the maintainer explicitly changes the scope.

## 10. Release verification policy

The maintainer chose a strict release gate:
- All agreed first-release features must work.
- Unit tests, browser end-to-end tests, CI, and automated accessibility checks must pass.
- Manual keyboard checks must be documented and completed.
- Security-sensitive rendering/import paths must be tested.
- Documentation must match actual behavior.
- A public, auditable verification report should tie results to the exact release candidate commit and list checks, limitations, and any failed/skipped checks.
- Any release-blocking defect blocks publication. Never describe an unrun or failed check as passing.

**Verification-report presentation detail:** The recommendation to publish a detailed public report was recorded in the working plan, but the maintainer had not yet explicitly answered the final A/B question about public detail versus a concise public summary. Treat the detailed public report as the current proposed default, not a confirmed preference, unless the maintainer confirms it.

## 11. How to maintain this log

When the maintainer answers a planning question:
1. Add or update the relevant row in this file.
2. If the decision changes implementation scope, update `PHASES.md` and `PROJECT_PLAN.md` as needed.
3. Update `PROGRESS.md` only for actual implementation/test status, not to claim a product decision is implemented.
4. Keep “confirmed decision”, “planned”, “implemented”, and “verified” as distinct states.
5. Do not ask the maintainer to repeat decisions already recorded here.
