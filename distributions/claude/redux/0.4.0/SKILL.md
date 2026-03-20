---
name: redux
description: Use for Redux tasks. Helps with the low-level Redux 5 core package for reducer composition, store creation, middleware composition, dispatch contracts, and utility guards while keeping modern boundary guidance explicit around Redux Toolkit and `react-redux`.
---

# Redux

Use this skill when the task depends on Redux-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use the low-level Redux 5 core package for reducer composition, store creation, middleware composition, dispatch contracts, and utility guards while keeping modern boundary guidance explicit around Redux Toolkit and `react-redux`.

## When to use this skill

- Redux setup and implementation work
- Redux API usage and configuration decisions
- Redux-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat the `redux` package as the low-level core surface, not the default modern application stack.
- Keep core Redux answers separate from Redux Toolkit and `react-redux` companion-library answers.
- Prefer `legacy_createStore` over `createStore` when direct core store creation is intentional and you want to avoid the deprecated identifier.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
