---
name: near-intents-1click-and-explorer
description: Use for NEAR Intents 1Click And Explorer tasks. Helps with the NEAR Intents 1Click and Explorer APIs at a senior-developer level: discover supported tokens, request a dry or committed quote, track a swap using `depositAddress`, optionally submit the origin-chain transaction hash, and paginate explorer history without confusing historical analytics with live execution state.
---

# NEAR Intents 1Click And Explorer

Use this skill when the task depends on NEAR Intents 1Click And Explorer-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the NEAR Intents 1Click and Explorer APIs at a senior-developer level: discover supported tokens, request a dry or committed quote, track a swap using `depositAddress`, optionally submit the origin-chain transaction hash, and paginate explorer history without confusing historical analytics with live execution state.

## When to use this skill

- NEAR Intents 1Click And Explorer setup and implementation work
- NEAR Intents 1Click And Explorer API usage and configuration decisions
- NEAR Intents 1Click And Explorer-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Fetch the supported-token list before building quote requests so decimals, asset IDs, and chain assumptions are correct.
- Use `requestQuote` with `dry=true` first; only commit with `dry=false` after the user accepts the tradeoff.
- Treat `depositAddress` as the durable key for status checks and operational reconciliation.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
