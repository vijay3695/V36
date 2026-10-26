# V36 documentation index

Use this index to find the right project record without digging through the repository. Start with the [root README](../README.md) for the product overview.

## Contributor entry points

- [AI agent instructions](../AGENTS.md) — required reading order, engineering rules, and repository guardrails.
- [Contributing guide](../CONTRIBUTING.md) — setup, checks, and contribution expectations.
- [Security policy](../SECURITY.md) — security reporting and safe-handling expectations.

## Project requirements and decisions

- [Decision log](project/DECISIONS.md) — confirmed maintainer decisions, scope, and exclusions.
- [Current progress](project/PROGRESS.md) — verified status, evidence, and next actions.
- [Phases and acceptance gates](project/PHASES.md) — phase definitions and acceptance criteria.
- [Working plan](project/PLAN.md) — coding-agent guardrails and test expectations.
- [Project specification](project/PROJECT_SPEC.md) — core requirements and constraints.
- [Detailed project plan](project/PROJECT_PLAN.md) — full behavior, edge cases, and release gate.
- [GitHub token-auth experiment](project/GITHUB_TOKEN_AUTH_EXPERIMENT.md) — optional token security design, current main-branch status, and outstanding live-verification checks.

## Design

- [UI redesign plan](design/UI_REDESIGN_PLAN.md) — approved UI direction and implementation/verification record.

## Testing and quality

- [Acceptance checklist](testing/ACCEPTANCE_CHECKLIST.md) — release acceptance criteria and disposition.
- [Manual acceptance record](testing/MANUAL_ACCEPTANCE.md) — maintainer-reported manual checks and limitations.
- [Numeric contrast audit](testing/CONTRAST_AUDIT.md) — light/dark component ratios and regression coverage.
- [Archived phase test reports and raw logs](archive/testing-reports/) — historical evidence snapshots; use current progress and release records for present status.

## Audits and releases

- [Phase 6 audit](audits/PHASE_6_AUDIT.md) — end-to-end verification scope, evidence, and limitations.
- [Release verification](releases/RELEASE_VERIFICATION.md) — exact release commit and release-gate evidence.
- [v0.1.0 release notes](releases/v0.1.0.md) — published scope and known limitations.

## Where to go for a task

- Confirmed choices: [decision log](project/DECISIONS.md).
- Current status and next action: [progress record](project/PROGRESS.md), reconciled against current repository and latest CI.
- Requirements and phase gates: [project specification](project/PROJECT_SPEC.md), [detailed plan](project/PROJECT_PLAN.md), and [phase checklist](project/PHASES.md).
- Release-specific evidence: [release verification](releases/RELEASE_VERIFICATION.md) and the linked GitHub Actions run for the exact release commit.

Historical reports are retained for auditability. Do not treat an old report as proof that the same check passed on the current commit.