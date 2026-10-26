# V36 documentation index

A guide to the project's Markdown documentation. Start with the repository [README](../README.md) for the product overview, then use this page to find the right record.

## Contributor entry points

- [AI agent instructions](../AGENTS.md) — required reading order, engineering rules, and repository guardrails.
- [Contributing guide](../CONTRIBUTING.md) — development setup, checks, and contribution expectations.
- [Security policy](../SECURITY.md) — security reporting and safe-handling expectations.

## Project records

- [Decision log](DECISIONS.md) — confirmed maintainer decisions, scope, and exclusions.
- [Current progress](PROGRESS.md) — current verified status, evidence, and next actions.
- [Phases](PHASES.md) — phase definitions and acceptance gates.
- [Working plan](PLAN.md) — execution rules and coding-agent guardrails.
- [Project specification](PROJECT_SPEC.md) — requirements and product constraints.
- [Detailed project plan](PROJECT_PLAN.md) — full behavior, edge cases, and release gate.

## Design

- [UI redesign plan](UI_REDESIGN_PLAN.md) — approved UI direction and implementation/verification record.

## Testing and quality

- [Acceptance checklist](ACCEPTANCE_CHECKLIST.md) — release acceptance criteria and current disposition.
- [Manual acceptance](MANUAL_ACCEPTANCE.md) — maintainer-reported manual checks, including their limitations.
- [Contrast audit](CONTRAST_AUDIT.md) — numeric light/dark component ratios and regression coverage.
- [Historical testing reports](../Testing%20Report/) — archived phase reports and raw logs. These are historical snapshots; use the current progress and release records for present status.

## Audits and releases

- [Phase 6 audit](PHASE_6_AUDIT.md) — end-to-end verification scope, evidence, and limitations.
- [Release verification](RELEASE_VERIFICATION.md) — exact release commit and release-gate evidence.
- [v0.1.0 release notes](releases/v0.1.0.md) — published scope and known limitations.

## Which record is authoritative?

- Confirmed product choices: [Decision log](DECISIONS.md).
- Current implementation and test status: [Progress record](PROGRESS.md), reconciled against the current repository and latest CI.
- Requirements and phase gates: [Project specification](PROJECT_SPEC.md), [detailed plan](PROJECT_PLAN.md), and [phase checklist](PHASES.md).
- Release-specific proof: [Release verification](RELEASE_VERIFICATION.md) and the linked GitHub Actions run for the exact commit.
- Manual acceptance and automated test results are different evidence types; do not infer one from the other.
