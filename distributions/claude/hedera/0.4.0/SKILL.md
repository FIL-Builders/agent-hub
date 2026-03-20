---
name: hedera
description: Use for Hedera tasks. Helps with hedera as a developer platform: configure the JavaScript SDK correctly, submit and confirm account, token, topic, and contract workflows against consensus nodes, use mirror-node REST for indexed reads, and keep Hedera-specific identity, receipt, and mirror-node consistency rules explicit.
---

# Hedera

Use this skill when the task depends on Hedera-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Hedera as a developer platform: configure the JavaScript SDK correctly, submit and confirm account, token, topic, and contract workflows against consensus nodes, use mirror-node REST for indexed reads, and keep Hedera-specific identity, receipt, and mirror-node consistency rules explicit.

## When to use this skill

- Hedera setup and implementation work
- Hedera API usage and configuration decisions
- Hedera-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Use the JavaScript SDK as the default path for writes, receipts, and authoritative query semantics.
- Treat mirror-node REST as an indexed read model, not the transaction-submission path.
- Wait for a receipt before treating a submitted write as finalized, then expect mirror-node visibility to lag.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
