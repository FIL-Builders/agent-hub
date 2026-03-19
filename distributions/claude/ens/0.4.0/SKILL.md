---
name: ens
description: Use for ENS tasks. Helps with eNS for ordinary dapp integration, verified primary-name handling, resolver-backed record management, `.eth` registration and renewal, and wrapped-name operations, with ENSjs `^4.2.2` as the default TypeScript integration path.
---

# ENS

Use this skill when the task depends on ENS-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use ENS for ordinary dapp integration, verified primary-name handling, resolver-backed record management, `.eth` registration and renewal, and wrapped-name operations, with ENSjs `^4.2.2` as the default TypeScript integration path.

## When to use this skill

- ENS setup and implementation work
- ENS API usage and configuration decisions
- ENS-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Start with ENSjs public and wallet clients for application work; drop to raw contracts only when the task genuinely escapes ENSjs coverage.
- Normalize names before manual hashing, comparison, or low-level protocol interaction.
- Treat reverse lookup results as untrusted display candidates until forward verification succeeds on the relevant chain.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
