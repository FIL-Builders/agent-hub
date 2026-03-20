---
name: pyth
description: Use for Pyth tasks. Helps with the current Pyth developer surface correctly across off-chain price delivery, on-chain verification and consumption, lower-level Pythnet account access, Entropy randomness, Express Relay auction flows, and Lazer low-latency delivery without collapsing those surfaces into one generic oracle model.
---

# Pyth

Use this skill when the task depends on Pyth-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the current Pyth developer surface correctly across off-chain price delivery, on-chain verification and consumption, lower-level Pythnet account access, Entropy randomness, Express Relay auction flows, and Lazer low-latency delivery without collapsing those surfaces into one generic oracle model.

## When to use this skill

- Pyth setup and implementation work
- Pyth API usage and configuration decisions
- Pyth-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat update delivery, on-chain verification, and on-chain price consumption as separate decisions.
- Prefer Hermes for ordinary off-chain price retrieval unless the integration explicitly needs lower-level Pythnet account access.
- Compute update fees and Entropy request fees for the exact payload or gas profile you are about to submit.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
