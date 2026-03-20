---
name: openserv-labs-sdk
description: Use for OpenServ Labs SDK tasks. Helps with the OpenServ Labs SDK at a senior-developer level: instantiate an agent, register typed capabilities before start, process tasks with explicit status and logs, escalate to humans when blocked, and route platform-governed external calls through integrations instead of ad hoc HTTP.
---

# OpenServ Labs SDK

Use this skill when the task depends on OpenServ Labs SDK-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the OpenServ Labs SDK at a senior-developer level: instantiate an agent, register typed capabilities before start, process tasks with explicit status and logs, escalate to humans when blocked, and route platform-governed external calls through integrations instead of ad hoc HTTP.

## When to use this skill

- OpenServ Labs SDK setup and implementation work
- OpenServ Labs SDK API usage and configuration decisions
- OpenServ Labs SDK-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Register capabilities before calling `start()` so the runtime begins in a coherent state.
- Prefer `addCapabilities` for boot-time bulk registration.
- Pair `updateTaskStatus` with `addLogToTask` so task progress is visible to operators.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
