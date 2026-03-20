---
name: foc-cli
description: Use for foc-cli tasks. Helps with `foc-cli` as the operator-facing interface for Filecoin Onchain Cloud: initialize wallets safely, distinguish wallet balances from payment-account funding, use the recommended high-level upload commands, drop to dataset and piece commands only when explicit PDP control is needed, inspect approved providers, and use the built-in docs and agent surfaces without confusing them with the lower-level Synapse SDK.
---

# foc-cli

Use this skill when the task depends on foc-cli-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use `foc-cli` as the operator-facing interface for Filecoin Onchain Cloud: initialize wallets safely, distinguish wallet balances from payment-account funding, use the recommended high-level upload commands, drop to dataset and piece commands only when explicit PDP control is needed, inspect approved providers, and use the built-in docs and agent surfaces without confusing them with the lower-level Synapse SDK.

## When to use this skill

- foc-cli setup and implementation work
- foc-cli API usage and configuration decisions
- foc-cli-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Start with `upload` or `multi-upload` unless the task clearly needs explicit dataset management.
- Treat wallet FIL or USDFC balances, Synapse payment-account funds, and ongoing lockup or runway as separate layers.
- Use explicit `wallet init` flags in non-interactive or agent-driven contexts.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
