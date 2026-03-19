---
name: rootstock
description: Use for Rootstock JSON-RPC And Bridge tasks. Helps with rootstock at a senior-developer level through its Ethereum-compatible JSON-RPC surface and the native Bridge precompile: read the latest block to learn the current minimum valid gas price, estimate and send transactions safely, and query the live federation address instead of hard-coding bridge parameters.
---

# Rootstock JSON-RPC And Bridge

Use this skill when the task depends on Rootstock JSON-RPC And Bridge-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Rootstock at a senior-developer level through its Ethereum-compatible JSON-RPC surface and the native Bridge precompile: read the latest block to learn the current minimum valid gas price, estimate and send transactions safely, and query the live federation address instead of hard-coding bridge parameters.

## When to use this skill

- Rootstock JSON-RPC And Bridge setup and implementation work
- Rootstock JSON-RPC And Bridge API usage and configuration decisions
- Rootstock JSON-RPC And Bridge-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Read `minimumGasPrice` from the latest block before preparing production transactions.
- Treat `eth_gasPrice` as a hint and clamp it to at least the current `minimumGasPrice`.
- Simulate with `eth_estimateGas` or `eth_call` before broadcasting state-changing transactions.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
