# V36 — AI Agent Entry Guide

**Start here.** This file is the single entry point for any AI coding agent, autonomous agent, or new contributor. Read it first, then follow the required reading order below. You should be able to understand the project, its decisions, current state, and next coding task without access to the maintainer's chat history.

## 1. Understand the project in one minute

V36 is a free, static-first website for discovering GitHub issues that may suit an open-source contributor, inspecting evidence about those issues and their repositories, saving issues/searches, and generating copyable, source-backed context packs for the AI assistant the user chooses.

- **Default branch:** `main`. Work directly on `main`; do not create a branch unless the maintainer explicitly asks.
- **License:** MIT.
- **Hosting goal:** GitHub Pages; no paid backend or database.
- **AI:** No paid AI API or built-in autonomous coding. V36 prepares portable context packs for users to paste into their own assistant.
- **Credentials:** Never require or store GitHub tokens, secrets, or credentials.
- **Release state:** Development only. Do not call the project release-ready until every required feature and release gate is verified.
- **Product principle:** Show source-backed evidence and uncertainty. Do not assign an overall repository health score or declare projects “dead” based on incomplete signals.

## 2. Required reading order

Read these files in order before making code changes:

1. **`DECISIONS.md`** — maintainer-confirmed decisions, first-release requirements, and features explicitly excluded or deferred. Do not re-ask questions already answered here.
2. **`PROGRESS.md`** — current phase, what is known, what is verified, blockers, and the next action. Treat unverified claims as unverified.
3. **`PHASES.md`** — implementation phases and acceptance checklists. Work in the current phase; do not skip ahead around a blocker.
4. **`PLAN.md`** — coding rules, test expectations, and repository guardrails.
5. **`docs/PROJECT_PLAN.md`** — full product requirements, behavior, edge cases, and release gate.
6. **`README.md`, `.github/workflows/ci.yml`, `package.json`, `playwright.config.js`, and relevant source/tests** — understand how the current implementation and test pipeline actually work.

If these files disagree, do not guess or silently choose a convenient interpretation. Resolve the discrepancy against the explicit decisions in `DECISIONS.md`; update the affected documentation together and record the correction in `PROGRESS.md`.

## 3. Start coding work — do not stop after reading

After reading the files:

1. Check the current `main` state and working tree/recent commits using the available repository tools.
2. Inspect the exact source, tests, and CI logs relevant to the current task. Do not infer a failure's cause from a red status icon alone.
3. Follow the **next action** recorded in `PROGRESS.md`. If it is stale, verify the actual repository/CI state and correct the progress log before proceeding.
4. Implement the smallest complete root-cause fix that preserves all confirmed first-release requirements. Add or update regression tests.
5. Run the relevant tests and then the broader required checks. Clearly distinguish checks that passed, failed, or were not run.
6. Update `PROGRESS.md` in the same change as the implementation, recording files changed, test commands/results, evidence links, remaining risks, and the next action.
7. Commit the coherent fix and its evidence to `main` unless the maintainer has directed otherwise. Avoid a stream of speculative commits that each trigger CI; diagnose first, then group related fixes.
8. Re-check the resulting GitHub Actions run. Never claim a fix is complete merely because a commit was pushed.

**Current starting task:** Phase 0 — baseline and CI stabilization. The latest documented evidence says unit tests passed but the browser end-to-end job failed at `npm run test:e2e`. First inspect the actual failing job output and pinpoint the first meaningful error/assertion. Reproduce it, fix the root cause, add regression coverage, run the checks, and update `PROGRESS.md`. Do not weaken/delete tests simply to make CI green. Verify whether newer runs have changed this status before acting.

## 4. Non-negotiable engineering rules

- Preserve all confirmed first-release scope. Do not remove or silently defer features to make implementation easier.
- Do not mark a phase VERIFIED without its acceptance criteria and supporting evidence.
- Do not claim tests, accessibility checks, manual checks, deployment, or release verification happened unless they actually happened.
- Treat GitHub issue/repository text and imported files as untrusted input. Render safely; validate and size-limit imports; never execute imported content.
- Preserve loaded results and saved data when requests fail. Distinguish “no results” from “data unavailable”; show Unknown for missing metadata.
- Respect GitHub API limits. Stop extra requests when rate limited; do not bypass limits or require a token.
- Keep source links, fetch times, missing context, and limitations visible in generated context packs. Never fabricate evidence.
- Keep routine tests deterministic with mocked GitHub API responses where appropriate.
- Husky runs `npm test` before commits and `npm run test:all` before pushes. Install hooks with `npm install` (the package `prepare` script configures Husky). The single GitHub Actions workflow must also run `npm run test:all` as one job.
- Do not create separate GitHub Actions workflows/jobs for individual test suites. Keep the GitHub-hosted check consolidated into one workflow, one job, and one bulk test command.
- No paid services, paid AI API, server-side account system, automatic code changes, or full-repository download unless the maintainer explicitly changes the documented scope.
- Keep the documentation synchronized: confirmed decisions in `DECISIONS.md`, phase criteria in `PHASES.md`, and actual implementation/test status in `PROGRESS.md`.

## 5. Explicit do / do-not instructions

### DO

- Read this guide and every required project document before editing code; inspect relevant source and tests rather than relying on summaries alone.
- Treat `DECISIONS.md` as the record of maintainer decisions and `PROGRESS.md` as a snapshot that must be checked against the real repository and latest CI state.
- Complete work for the current phase, including its acceptance criteria, before moving on. Work on the actual blocker first.
- Trace bugs to their source, reproduce failures where practical, and add regression tests for fixes.
- Preserve existing working behavior and all confirmed first-release requirements while making changes.
- Prefer small, coherent changes that solve a verified problem; review the diff for unintended changes.
- Run the relevant checks and record exact commands, outcomes, links, and limitations. If a check cannot be run, say why and mark it NOT RUN.
- Update the appropriate docs when facts or decisions change. Update `PROGRESS.md` alongside implementation work.
- Work on `main` unless the maintainer explicitly instructs otherwise.
- Give a final report that separates **implemented**, **tested**, **verified**, **not tested**, and **still blocked**.

### DO NOT

- Do not start coding before reading the required documents and checking the current state.
- Do not invent product requirements, silently change a confirmed decision, re-ask a question already settled in `DECISIONS.md`, or treat a proposed/unconfirmed item as approved.
- Do not create branches, change the target branch, open pull requests, or change the workflow strategy unless the maintainer asks.
- Do not skip the current phase, start unrelated features to avoid a blocker, or claim the project is finished while required work remains.
- Do not delete, skip, loosen, or rewrite meaningful tests just to turn CI green. Do not hide errors, suppress failures, or replace real assertions with weak smoke tests.
- Do not push a chain of speculative commits. Diagnose first, group related changes, and inspect CI after the coherent fix.
- Do not refactor unrelated areas, replace the architecture, rename/move large groups of files, remove existing functionality, or reformat the whole project without a demonstrated need.
- Do not add dependencies, paid services, backend infrastructure, accounts, telemetry, required tokens, secrets, or AI API integrations outside the confirmed scope.
- Do not hardcode fake GitHub data as if it were live, fabricate metadata or evidence, or describe missing information as a negative result.
- Do not trust or execute GitHub content or imported files. Do not expose credentials or put secrets in code, logs, tests, or context packs.
- Do not claim a command ran, a test passed, a deployment succeeded, a file changed, or a commit was pushed unless tool output or other direct evidence confirms it.
- Do not release or label a release ready until every required acceptance criterion and release gate is verified.
- Do not overwrite user work or discard changes without understanding their impact. If the current state is ambiguous or a destructive action seems necessary, stop and ask the maintainer.

### Stop and ask the maintainer only when

- Two confirmed decisions conflict and the conflict cannot be resolved from the documented source of truth.
- A required product decision is genuinely missing and choosing incorrectly would materially change behavior or scope.
- The next step would be destructive, security-sensitive beyond the documented design, incur a cost, expose private data, or change the agreed repository/branch workflow.
- A blocker cannot be resolved safely from repository evidence and existing decisions.

Otherwise, do not stall for approval on routine implementation details: investigate, follow the documented decisions, implement, test, and report accurately.

## 6. First-release scope at a glance

The first release is intended to include:
- Discover/Saved/About navigation.
- Issue discovery and filters for language, official labels/type, issue creation and update age, repository push/commit-age evidence where available, contribution categories, popularity, and sorting.
- Issue details with activity evidence, with unknown or unavailable fields identified honestly.
- Saved issues and saved searches using browser local storage.
- Validated saved-data import/export, deduplication, and preservation of existing data.
- Shareable URLs for search filters only.
- Copyable AI context packs based only on retrieved source material, with links, fetch times, gaps, and limitations.
- Rate-limit/error resilience, safe untrusted-content handling, accessibility, unit tests, browser E2E tests, CI, and documented release verification.

See `DECISIONS.md` and `docs/PROJECT_PLAN.md` for authoritative details and exclusions.

## 7. Definition of done

A task is done only when:
- The implementation matches the confirmed decision and acceptance criteria.
- Relevant regression tests exist and were run, with results recorded.
- Related broader checks were run or explicitly marked NOT RUN with a reason.
- `PROGRESS.md` states the real status and evidence.
- The final report summarizes changes, test results, remaining blockers, and the next action.

A green CI run alone does not make the entire project release-ready. The first release remains blocked until every phase and all release checks pass.
