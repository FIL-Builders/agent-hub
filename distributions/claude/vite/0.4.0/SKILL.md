---
name: vite
description: Use for Vite tasks. Helps with vite 8 effectively for config authoring, dev-server behavior, plugin boundaries, env handling, build output, SSR integration, and framework setup without collapsing those concerns into generic bundler or framework advice.
---

# Vite

Use this skill when the task depends on Vite-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Vite 8 effectively for config authoring, dev-server behavior, plugin boundaries, env handling, build output, SSR integration, and framework setup without collapsing those concerns into generic bundler or framework advice.

## When to use this skill

- Vite setup and implementation work
- Vite API usage and configuration decisions
- Vite-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Distinguish dev-server behavior from production build behavior before diagnosing problems.
- Keep Vite core behavior separate from framework plugin behavior.
- Use `defineConfig(...)` and typed config composition instead of ad hoc untyped objects.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
