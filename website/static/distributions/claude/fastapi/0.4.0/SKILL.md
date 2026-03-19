---
name: fastapi
description: Use for FastAPI tasks. Helps with fastAPI 0.135.1 for typed path operations, request validation, dependency injection, async and sync handler behavior, background tasks, and OpenAPI generation while keeping FastAPI-specific semantics distinct from generic Starlette, ASGI, or third-party integration advice.
---

# FastAPI

Use this skill when the task depends on FastAPI-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use FastAPI 0.135.1 for typed path operations, request validation, dependency injection, async and sync handler behavior, background tasks, and OpenAPI generation while keeping FastAPI-specific semantics distinct from generic Starlette, ASGI, or third-party integration advice.

## When to use this skill

- FastAPI setup and implementation work
- FastAPI API usage and configuration decisions
- FastAPI-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Keep request parsing, validation, and OpenAPI generation aligned through typed path operation signatures and explicit parameter helpers.
- Use `Depends(...)` and `Security(...)` as request-lifecycle primitives, not as generic service-locator patterns.
- Choose `async def` only when the work is truly async-friendly; keep blocking work out of async handlers.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
