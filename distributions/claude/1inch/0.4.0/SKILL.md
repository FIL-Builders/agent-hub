---
name: 1inch
description: Use for 1inch tasks. Helps with the current 1inch docs surface and Fusion SDK for chain-aware swap routing, Fusion quote and order workflows, order monitoring, and transaction-broadcast boundary decisions without collapsing classic execution, Fusion orders, approvals, and submission into one undifferentiated swap flow.
---

# 1inch

Use this skill when the task depends on 1inch-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the current 1inch docs surface and Fusion SDK for chain-aware swap routing, Fusion quote and order workflows, order monitoring, and transaction-broadcast boundary decisions without collapsing classic execution, Fusion orders, approvals, and submission into one undifferentiated swap flow.

## When to use this skill

- 1inch setup and implementation work
- 1inch API usage and configuration decisions
- 1inch-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat the current 1inch docs surface as product-oriented: Swap API, Fusion-mode workflows, and Transaction API are related but distinct layers.
- Keep classic executable swap flows separate from Fusion order flows; a Fusion order is not a direct router transaction.
- Treat approval or permit preparation as its own decision point before any spend-requiring execution path.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
