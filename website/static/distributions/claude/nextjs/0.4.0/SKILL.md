---
name: nextjs
description: Use for Next.js App Router, data fetching, rendering, and deployment tasks. Helps with framework APIs, routing, caching, and production debugging.
---

# Next.js

Use this skill when the task depends on Next.js framework behavior, especially App Router rendering, routing, caching, or deployment conventions.

## Purpose

This skill teaches an agent to use Next.js 16 effectively across App Router, Pages Router compatibility, rendering boundaries, request helpers, caching and revalidation, and framework-specific routing behavior without collapsing those concerns into generic React advice.

## When to use this skill

- App Router routing and layout structure
- server and client component boundaries
- data fetching, caching, and revalidation
- framework-specific debugging and deployment

## Working style

- Default to App Router mental models for new work unless the task is explicitly about Pages Router or migration.
- Keep server components, client components, route handlers, server actions, and Pages Router data functions as distinct execution contexts.
- Treat `next/navigation` hooks as Client Component APIs and `headers()` / `cookies()` / `redirect()` as server-side control or request APIs.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
