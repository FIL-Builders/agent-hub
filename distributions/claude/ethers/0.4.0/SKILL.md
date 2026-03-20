---
name: ethers
description: Use for ethers tasks. Helps with ethers v6 for Ethereum-compatible providers, wallets, contract interaction, ABI work, unit conversion, address handling, and signature-oriented workflows in production-style JavaScript and TypeScript codebases.
---

# ethers

Use this skill when the task depends on ethers-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use ethers v6 for Ethereum-compatible providers, wallets, contract interaction, ABI work, unit conversion, address handling, and signature-oriented workflows in production-style JavaScript and TypeScript codebases.

## When to use this skill

- ethers setup and implementation work
- ethers API usage and configuration decisions
- ethers-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Prefer explicit providers and signers over hidden defaults in production code.
- Treat `bigint` and `BigNumberish` values as integer-domain data and avoid JavaScript floating-point arithmetic for on-chain amounts.
- Keep private keys, mnemonics, and API keys out of source control and logs.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
