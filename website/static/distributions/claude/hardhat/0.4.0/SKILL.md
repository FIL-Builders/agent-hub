---
name: hardhat
description: Use for Hardhat tasks. Helps with hardhat 3 core APIs for project configuration, secure config values, network management, task authoring, compilation, and artifact access in modern Ethereum development workflows.
---

# Hardhat

Use this skill when the task depends on Hardhat-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Hardhat 3 core APIs for project configuration, secure config values, network management, task authoring, compilation, and artifact access in modern Ethereum development workflows.

## When to use this skill

- Hardhat setup and implementation work
- Hardhat API usage and configuration decisions
- Hardhat-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat Hardhat 3 core as config-first and plugin-extensible rather than assuming the old Hardhat 2 runtime shape.
- Use `defineConfig(...)` for project configuration and keep secrets in `configVariable(...)` or the Hardhat keystore.
- Prefer explicit network connections and explicit cleanup in programmatic scripts.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
