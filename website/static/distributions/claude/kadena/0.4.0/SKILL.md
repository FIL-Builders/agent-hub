---
name: kadena
description: Use for Kadena Pact Lang API tasks. Helps with the Kadena `pact-lang-api` package at a senior-developer level: build transaction metadata correctly, submit writes and wait for their results, simulate reads safely, use capability-based wallet signing flows, and avoid the common timing and observation mistakes that make Pact integrations unreliable.
---

# Kadena Pact Lang API

Use this skill when the task depends on Kadena Pact Lang API-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the Kadena `pact-lang-api` package at a senior-developer level: build transaction metadata correctly, submit writes and wait for their results, simulate reads safely, use capability-based wallet signing flows, and avoid the common timing and observation mistakes that make Pact integrations unreliable.

## When to use this skill

- Kadena Pact Lang API setup and implementation work
- Kadena Pact Lang API API usage and configuration decisions
- Kadena Pact Lang API-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Use `Pact.fetch.local` for read-only evaluation and preflight simulation.
- Use `Pact.fetch.send` for state-changing transactions and always follow with `listen` or `poll`.
- Build metadata with `Pact.lang.mkMeta` using seconds-based timestamps.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
