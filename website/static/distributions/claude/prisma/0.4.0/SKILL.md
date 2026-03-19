---
name: prisma
description: Use for Prisma ORM tasks. Helps with prisma ORM 7.5.0 for schema design, migrations, generated client behavior, transactions, and deployment-sensitive workflows while keeping Prisma-specific semantics distinct from raw SQL, framework integrations, and underlying database behavior.
---

# Prisma ORM

Use this skill when the task depends on Prisma ORM-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use Prisma ORM 7.5.0 for schema design, migrations, generated client behavior, transactions, and deployment-sensitive workflows while keeping Prisma-specific semantics distinct from raw SQL, framework integrations, and underlying database behavior.

## When to use this skill

- Prisma ORM setup and implementation work
- Prisma ORM API usage and configuration decisions
- Prisma ORM-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Treat the Prisma schema as the source of truth for generated client shape and migration intent.
- Distinguish generated Prisma Client behavior from raw SQL and database-native behavior.
- Treat migrations and deployment as operational workflows, not just development convenience.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
