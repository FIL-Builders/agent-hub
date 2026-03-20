---
name: worldcoin
description: Use for Worldcoin tasks. Helps with build and reason about World Mini Apps, World ID proof workflows, wallet-auth flows, payment and transaction requests, and backend verification or reconciliation paths without collapsing those distinct trust models into one undifferentiated client flow.
---

# Worldcoin

Use this skill when the task depends on Worldcoin-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to build and reason about World Mini Apps, World ID proof workflows, wallet-auth flows, payment and transaction requests, and backend verification or reconciliation paths without collapsing those distinct trust models into one undifferentiated client flow.

## When to use this skill

- Worldcoin setup and implementation work
- Worldcoin API usage and configuration decisions
- Worldcoin-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat MiniKit command success as client-side submission only; trusted backend verification or reconciliation is the actual source of truth.
- Use `walletAuth` for Mini App login and session establishment; do not use proof verification flows as a substitute for login.
- Keep World ID proof flows separate from wallet-auth flows and separate both from payment or transaction flows.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
