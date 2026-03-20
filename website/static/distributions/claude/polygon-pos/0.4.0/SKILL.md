---
name: polygon-pos
description: Use for Polygon PoS tasks. Helps with polygon PoS as an application and bridge platform: initialize `matic.js` correctly, keep parent-chain Ethereum and child-chain Polygon PoS providers separate, deposit assets onto PoS, start withdrawals from PoS, wait for checkpoint or exit readiness before finalizing on Ethereum, and avoid the common network and bridge-model confusions that produce broken answers.
---

# Polygon PoS

Use this skill when the task depends on Polygon PoS-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Polygon PoS as an application and bridge platform: initialize `matic.js` correctly, keep parent-chain Ethereum and child-chain Polygon PoS providers separate, deposit assets onto PoS, start withdrawals from PoS, wait for checkpoint or exit readiness before finalizing on Ethereum, and avoid the common network and bridge-model confusions that produce broken answers.

## When to use this skill

- Polygon PoS setup and implementation work
- Polygon PoS API usage and configuration decisions
- Polygon PoS-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Keep parent-chain Ethereum and child-chain Polygon PoS contexts explicit at all times.
- Treat deposits and withdrawals as asymmetric workflows with different confirmation and completion semantics.
- Use `POSClient` as the default programmatic bridge entrypoint for PoS application work.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
