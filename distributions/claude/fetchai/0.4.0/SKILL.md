---
name: fetchai
description: Use for FetchAI Agentverse Hosting API tasks. Helps with the FetchAI Agentverse Hosting API at a senior-developer level: create and inspect hosted agents, treat agent addresses as stable identifiers, reason about revisions and runtime state correctly, and separate usage reporting from deployment lifecycle actions.
---

# FetchAI Agentverse Hosting API

Use this skill when the task depends on FetchAI Agentverse Hosting API-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the FetchAI Agentverse Hosting API at a senior-developer level: create and inspect hosted agents, treat agent addresses as stable identifiers, reason about revisions and runtime state correctly, and separate usage reporting from deployment lifecycle actions.

## When to use this skill

- FetchAI Agentverse Hosting API setup and implementation work
- FetchAI Agentverse Hosting API API usage and configuration decisions
- FetchAI Agentverse Hosting API-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat agent addresses as the stable handle for later reads and usage queries.
- Re-read the agent record after lifecycle actions instead of assuming state transitions succeeded.
- Track revisions and code digests as rollout signals.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
