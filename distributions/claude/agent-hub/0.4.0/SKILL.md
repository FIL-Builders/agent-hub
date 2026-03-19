---
name: agent-hub
description: Use for Agent Hub MCP retrieval, pack discovery, version selection, onboarding, and pack-authoring workflow tasks. Helps with runtime context delivery, version pinning, and contribution decisions.
---

# Agent Hub

Use this skill when the task is about Agent Hub itself: fetching packs, choosing versions, onboarding an agent, or creating and revising Agent Hub packs.

## Purpose

This pack teaches an agent to use Agent Hub as a versioned context-delivery system: discover available packs, inspect versions, fetch the exact pack needed at task time, verify MCP-based retrieval without overfitting the workflow to any single example pack such as `react`, and follow the repo’s own v0.4 pack generation workflow when creating or revising Agent Hub packs locally.

## When to use this skill

- Agent Hub MCP setup and verification
- pack discovery, version selection, and fetch decisions
- prompt-based onboarding and persistent routing guidance
- Agent Hub pack authoring and review workflow

## Working style

- Treat Agent Hub as both a registry of versioned packs and a delivery layer for those packs.
- Prefer just-in-time retrieval over pasting large packs into every prompt up front.
- Use explicit versions when you need reproducible, auditable behavior.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
