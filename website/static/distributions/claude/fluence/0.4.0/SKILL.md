---
name: fluence
description: Use for Fluence API tasks. Helps with the Fluence public API at a senior-developer level: discover offers, estimate cost and capacity, create and mutate VM instances safely, manage SSH keys, and avoid the common lifecycle mistakes around open-port replacement and reserved funds.
---

# Fluence API

Use this skill when the task depends on Fluence API-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the Fluence public API at a senior-developer level: discover offers, estimate cost and capacity, create and mutate VM instances safely, manage SSH keys, and avoid the common lifecycle mistakes around open-port replacement and reserved funds.

## When to use this skill

- Fluence API setup and implementation work
- Fluence API API usage and configuration decisions
- Fluence API-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Use discovery endpoints first so filters and pricing assumptions are valid before VM creation.
- Run `vms.estimate` before `vms.create` for any real deployment workflow.
- Treat `PATCH /vms/v3` as declarative replacement for `openPorts`, not merge semantics.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
