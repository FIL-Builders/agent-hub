---
name: uniswapx
description: Use for UniswapX Integrator APIs tasks. Helps with integrate with UniswapX at a senior-developer level: implement the quote endpoint with correct last-look behavior, query open orders from the orders API, execute fills through the reactor, and preserve the identifiers and lifecycle boundaries needed for reconciliation.
---

# UniswapX Integrator APIs

Use this skill when the task depends on UniswapX Integrator APIs-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to integrate with UniswapX at a senior-developer level: implement the quote endpoint with correct last-look behavior, query open orders from the orders API, execute fills through the reactor, and preserve the identifiers and lifecycle boundaries needed for reconciliation.

## When to use this skill

- UniswapX Integrator APIs setup and implementation work
- UniswapX Integrator APIs API usage and configuration decisions
- UniswapX Integrator APIs-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Echo `requestId` and `quoteId` unchanged so downstream reconciliation stays intact.
- Return `204` quickly when you do not intend to quote, rather than holding connections open.
- Keep quote generation, order discovery, and reactor execution as separate operational stages.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
