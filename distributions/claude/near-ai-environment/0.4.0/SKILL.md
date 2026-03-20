---
name: near-ai-environment
description: Use for NEAR AI Environment tasks. Helps with the NEAR AI Python environment at a senior-developer level: manage chat completions and signed completions, persist thread state through environment helpers, register and expose tools correctly, and configure an async NEAR client for read and write operations.
---

# NEAR AI Environment

Use this skill when the task depends on NEAR AI Environment-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the NEAR AI Python environment at a senior-developer level: manage chat completions and signed completions, persist thread state through environment helpers, register and expose tools correctly, and configure an async NEAR client for read and write operations.

## When to use this skill

- NEAR AI Environment setup and implementation work
- NEAR AI Environment API usage and configuration decisions
- NEAR AI Environment-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Use `Environment.completions` when you need structured control or streaming.
- Use `Environment.completion` only as a convenience wrapper for plain text.
- Pass tool definitions from the registry into tool-running helpers.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
