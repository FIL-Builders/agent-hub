---
name: impulseai
description: Use for Impulse AI HTTP API tasks. Helps with the Impulse AI HTTP API at a senior-developer level: manage API keys, create and inspect datasets, launch and track fine-tuning jobs, distinguish models from jobs, and keep billing or usage data separate from training orchestration.
---

# Impulse AI HTTP API

Use this skill when the task depends on Impulse AI HTTP API-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the Impulse AI HTTP API at a senior-developer level: manage API keys, create and inspect datasets, launch and track fine-tuning jobs, distinguish models from jobs, and keep billing or usage data separate from training orchestration.

## When to use this skill

- Impulse AI HTTP API setup and implementation work
- Impulse AI HTTP API API usage and configuration decisions
- Impulse AI HTTP API-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Always send the `x-api-key` header.
- Treat dataset creation, fine-tuning jobs, and model retrieval as separate stages.
- Poll job status until it reaches a terminal state.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
