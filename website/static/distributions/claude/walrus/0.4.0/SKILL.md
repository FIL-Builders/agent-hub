---
name: walrus
description: Use for Walrus HTTP API tasks. Helps with the Walrus HTTP API at a senior-developer level: write blobs through publisher-capable endpoints, read blobs through aggregator-capable endpoints, set retention and deletion behavior correctly, and introspect a live deployment before binding tightly to its exact HTTP surface.
---

# Walrus HTTP API

Use this skill when the task depends on Walrus HTTP API-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the Walrus HTTP API at a senior-developer level: write blobs through publisher-capable endpoints, read blobs through aggregator-capable endpoints, set retention and deletion behavior correctly, and introspect a live deployment before binding tightly to its exact HTTP surface.

## When to use this skill

- Walrus HTTP API setup and implementation work
- Walrus HTTP API API usage and configuration decisions
- Walrus HTTP API-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Use publisher or daemon endpoints for writes and aggregator or daemon endpoints for reads.
- Treat blob IDs as the canonical handles for retrieval and follow-on integration.
- Set `epochs`, `deletable`, and `send_object_to` deliberately on writes instead of relying on defaults blindly.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
