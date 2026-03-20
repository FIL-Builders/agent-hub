---
name: lighthouse-web3-sdk
description: Use for Lighthouse Web3 SDK tasks. Helps with the Lighthouse Web3 SDK at a senior-developer level: create or manage an SDK wallet, produce signed auth messages, obtain short-lived upload auth where needed, upload encrypted content correctly, inspect uploaded files, and separate upload completion from deal durability.
---

# Lighthouse Web3 SDK

Use this skill when the task depends on Lighthouse Web3 SDK-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the Lighthouse Web3 SDK at a senior-developer level: create or manage an SDK wallet, produce signed auth messages, obtain short-lived upload auth where needed, upload encrypted content correctly, inspect uploaded files, and separate upload completion from deal durability.

## When to use this skill

- Lighthouse Web3 SDK setup and implementation work
- Lighthouse Web3 SDK API usage and configuration decisions
- Lighthouse Web3 SDK-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Start encrypted flows with wallet and auth helpers rather than improvising signatures by hand.
- Treat one-time auth as an ephemeral credential for a specific operation.
- Preserve CIDs as canonical identifiers and treat gateway URLs as interchangeable delivery layers.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
