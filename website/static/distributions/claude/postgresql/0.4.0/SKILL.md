---
name: postgresql
description: Use for PostgreSQL tasks. Helps with postgreSQL 18.3 for schema design, constraints, transactions, indexing, query tuning, concurrency control, and migration planning while keeping PostgreSQL-specific planner and locking behavior distinct from generic SQL, ORM, or extension advice.
---

# PostgreSQL

Use this skill when the task depends on PostgreSQL-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to use PostgreSQL 18.3 for schema design, constraints, transactions, indexing, query tuning, concurrency control, and migration planning while keeping PostgreSQL-specific planner and locking behavior distinct from generic SQL, ORM, or extension advice.

## When to use this skill

- PostgreSQL setup and implementation work
- PostgreSQL API usage and configuration decisions
- PostgreSQL-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Put durable invariants in PostgreSQL constraints, not only in application code.
- Treat transactions, MVCC visibility, row locks, and table locks as related but distinct concepts.
- Add indexes for measured query patterns and sort requirements, not by reflex.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
