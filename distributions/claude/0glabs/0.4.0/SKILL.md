---
name: 0glabs
description: Use for 0G Serving Broker tasks. Helps with the 0G serving broker at a senior-developer level: initialize the broker with a signer, fund the on-network ledger, discover provider metadata, generate per-request auth headers, and verify inference responses correctly.
---

# 0G Serving Broker

Use this skill when the task depends on 0G Serving Broker-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the 0G serving broker at a senior-developer level: initialize the broker with a signer, fund the on-network ledger, discover provider metadata, generate per-request auth headers, and verify inference responses correctly.

## When to use this skill

- 0G Serving Broker setup and implementation work
- 0G Serving Broker API usage and configuration decisions
- 0G Serving Broker-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Create the broker from a signer and reuse it for related requests.
- Check and fund ledger state before making paid requests.
- Generate fresh request headers for each outbound inference request.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
