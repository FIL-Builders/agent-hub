---
name: golem-base-json-rpc
description: Use for Golem Base JSON-RPC tasks. Helps with golem Base DB-Chain at a senior-developer level: encode storage mutations correctly as RLP, send them to the right precompile address through Ethereum-style JSON-RPC, and retrieve stored entities through indexed metadata and free-form query endpoints without losing TTL or payload semantics.
---

# Golem Base JSON-RPC

Use this skill when the task depends on Golem Base JSON-RPC-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Golem Base DB-Chain at a senior-developer level: encode storage mutations correctly as RLP, send them to the right precompile address through Ethereum-style JSON-RPC, and retrieve stored entities through indexed metadata and free-form query endpoints without losing TTL or payload semantics.

## When to use this skill

- Golem Base JSON-RPC setup and implementation work
- Golem Base JSON-RPC API usage and configuration decisions
- Golem Base JSON-RPC-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Send all storage mutations to the precompile address, not to arbitrary contracts.
- Prefer indexed queries before broad free-form queries.
- Treat BTL as a block-based TTL value rather than a wall-clock duration.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
