---
name: filecoin
description: Use for Filecoin tasks. Helps with filecoin as a developer platform: reading chain and actor state through Lotus JSON-RPC, estimating gas and submitting messages safely, using FEVM Ethereum-compatible RPC without losing Filecoin-specific chain semantics, and choosing the right endpoint and client surface for the task.
---

# Filecoin

Use this skill when the task depends on Filecoin-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Filecoin as a developer platform: reading chain and actor state through Lotus JSON-RPC, estimating gas and submitting messages safely, using FEVM Ethereum-compatible RPC without losing Filecoin-specific chain semantics, and choosing the right endpoint and client surface for the task.

## When to use this skill

- Filecoin setup and implementation work
- Filecoin API usage and configuration decisions
- Filecoin-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat Lotus `/rpc/v0` and FEVM `/rpc/v1` as separate operational surfaces.
- Use the Lotus JS Client as the default JavaScript path for Filecoin-native RPC.
- Anchor state reads with a `TipSetKey` when determinism matters; use `[]` only when latest-head behavior is intended.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
