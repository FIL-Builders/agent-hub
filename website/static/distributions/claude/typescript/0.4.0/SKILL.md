---
name: typescript
description: Use for TypeScript typing, configuration, generics, and API-design tasks. Helps with compiler behavior, type modeling, and debugging decisions.
---

# TypeScript

Use this skill when the task depends on TypeScript-specific typing or compiler behavior rather than generic JavaScript guidance.

## Purpose

This pack teaches an agent to use TypeScript 5.9 effectively for generic API design, narrowing, inference, utility types, module-resolution debugging, and `tsconfig` decisions while keeping language semantics, compiler behavior, and runtime behavior clearly separated.

## When to use this skill

- type modeling and API design
- tsconfig and compiler configuration
- generics, inference, and narrowing
- type-level debugging and refactoring

## Working style

- Treat TypeScript as a static-analysis and type-modeling system, not as runtime validation.
- Use generics only when they express a real relationship between inputs and outputs.
- Prefer narrowing and discriminated unions over repeated assertions.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
