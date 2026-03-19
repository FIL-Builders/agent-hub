---
name: filecoin-synapse-sdk
description: Use for Filecoin Synapse SDK tasks. Helps with the current Filecoin Synapse SDK at a senior-developer level: initialize the top-level `Synapse` object with the current viem-based model, manage payment balances and service approvals correctly, use storage-manager and storage-context workflows appropriately, inspect provider and warm-storage state, and avoid carrying forward outdated `0.24.x` assumptions.
---

# Filecoin Synapse SDK

Use this skill when the task depends on Filecoin Synapse SDK-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the current Filecoin Synapse SDK at a senior-developer level: initialize the top-level `Synapse` object with the current viem-based model, manage payment balances and service approvals correctly, use storage-manager and storage-context workflows appropriately, inspect provider and warm-storage state, and avoid carrying forward outdated `0.24.x` assumptions.

## When to use this skill

- Filecoin Synapse SDK setup and implementation work
- Filecoin Synapse SDK API usage and configuration decisions
- Filecoin Synapse SDK-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Start with the high-level `Synapse` entrypoint and only drop to subservices when the task clearly requires it.
- Treat wallet balances, Synapse account balances, and settlement state as separate layers.
- Use `prepare()` or upload-cost inspection when the workflow is cost-sensitive.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
