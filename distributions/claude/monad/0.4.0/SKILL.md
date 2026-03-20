---
name: monad
description: Use for Monad Protocol Docs tasks. Helps with build on Monad at a senior-developer level: connect to the testnet correctly, use the documented system contracts, understand Monad’s transparent parallel execution model, avoid historical-state and nonce-management mistakes, and design applications around its fast finality and distinct gas semantics.
---

# Monad Protocol Docs

Use this skill when the task depends on Monad Protocol Docs-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to build on Monad at a senior-developer level: connect to the testnet correctly, use the documented system contracts, understand Monad’s transparent parallel execution model, avoid historical-state and nonce-management mistakes, and design applications around its fast finality and distinct gas semantics.

## When to use this skill

- Monad Protocol Docs setup and implementation work
- Monad Protocol Docs API usage and configuration decisions
- Monad Protocol Docs-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat Monad as bytecode-compatible with the EVM, but not operationally identical to Ethereum.
- Keep gas-limit billing explicit when estimating and sending transactions.
- Batch read-heavy workflows with Multicall or RPC batching instead of serial `eth_call` loops.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
