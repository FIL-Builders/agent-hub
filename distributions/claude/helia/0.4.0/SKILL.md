---
name: helia
description: Use for Helia tasks. Helps with helia 6 and `@helia/unixfs` 7 for node creation, UnixFS add and retrieval flows, routing-aware CID access, and environment-sensitive persistence decisions while keeping core Helia, UnixFS, and lower-level retrieval behavior distinct.
---

# Helia

Use this skill when the task depends on Helia-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Helia 6 and `@helia/unixfs` 7 for node creation, UnixFS add and retrieval flows, routing-aware CID access, and environment-sensitive persistence decisions while keeping core Helia, UnixFS, and lower-level retrieval behavior distinct.

## When to use this skill

- Helia setup and implementation work
- Helia API usage and configuration decisions
- Helia-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat `createHelia()` plus `unixfs(helia)` as the ordinary application path for file workflows.
- Keep core node construction separate from UnixFS file operations and separate both from lower-level routing behavior.
- Treat browser nodes as ephemeral by default unless a deliberate persistence strategy is configured.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
