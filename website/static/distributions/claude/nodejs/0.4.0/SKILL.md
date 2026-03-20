---
name: nodejs
description: Use for Node.js tasks. Helps with node.js 25.8.1 effectively for CLI apps, servers, filesystem work, streams, subprocesses, workers, the built-in test runner, and module/runtime behavior without collapsing those concerns into browser or framework intuition.
---

# Node.js

Use this skill when the task depends on Node.js-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Node.js 25.8.1 effectively for CLI apps, servers, filesystem work, streams, subprocesses, workers, the built-in test runner, and module/runtime behavior without collapsing those concerns into browser or framework intuition.

## When to use this skill

- Node.js setup and implementation work
- Node.js API usage and configuration decisions
- Node.js-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Choose ESM or CommonJS deliberately and keep package boundaries explicit.
- Prefer built-in runtime primitives before reaching for third-party abstractions.
- Treat streams, subprocesses, and workers as resource-management primitives,

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
