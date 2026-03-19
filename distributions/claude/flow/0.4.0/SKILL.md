---
name: flow
description: Use for Flow tasks. Helps with flow as an application platform: configure FCL correctly, authenticate users through Flow-compatible wallets, run Cadence scripts, submit Cadence transactions, observe transaction status separately from submission, and drop to the lower-level SDK only when explicit interaction or transport control is actually needed.
---

# Flow

Use this skill when the task depends on Flow-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Flow as an application platform: configure FCL correctly, authenticate users through Flow-compatible wallets, run Cadence scripts, submit Cadence transactions, observe transaction status separately from submission, and drop to the lower-level SDK only when explicit interaction or transport control is actually needed.

## When to use this skill

- Flow setup and implementation work
- Flow API usage and configuration decisions
- Flow-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Start with FCL for normal Flow application work and use the low-level SDK only when you need more explicit control.
- Keep Cadence scripts and Cadence transactions distinct because they have different trust, auth, and execution models.
- Treat a returned tx ID as submission, not final success.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
