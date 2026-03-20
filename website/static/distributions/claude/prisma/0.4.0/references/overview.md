# Prisma ORM Overview

## Snapshot

- Spec name: prisma
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^7.5.0
- Primary language: typescript
- Homepage: https://www.prisma.io/orm
- Source set: npm:prisma@7.5.0, npm:@prisma/client@7.5.0, official Prisma schema, client, transaction, migration, and raw SQL docs, and parse/prisma-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- prisma
- orm
- typescript
- schema-design
- migrations
- transactions
- generated-client
- raw-sql

## Purpose

This pack teaches an agent to use Prisma ORM 7.5.0 for schema design, migrations, generated client behavior, transactions, and deployment-sensitive workflows while keeping Prisma-specific semantics distinct from raw SQL, framework integrations, and underlying database behavior.

## Guiding Principles

- Treat the Prisma schema as the source of truth for generated client shape and migration intent.
- Distinguish generated Prisma Client behavior from raw SQL and database-native behavior.
- Treat migrations and deployment as operational workflows, not just development convenience.
- Use `select`, `include`, and nested writes deliberately so query shape stays explicit.
- Use `$transaction(...)` when atomicity matters, but keep underlying database cost and contention in mind.
- Reach for raw SQL when Prisma Client cannot express the needed behavior cleanly, and call out the tradeoff.
- Keep framework-specific integration patterns outside the core Prisma mental model unless the task explicitly includes them.

## Boundary Notes

- Primary contract sources: `npm:@prisma/client@7.5.0` package surface for `PrismaClient` and runtime query entrypoints, plus official Prisma docs for schema modeling, CRUD, transactions, migrations, and raw SQL.
- Coverage is centered on the highest-value Prisma surfaces for ordinary backend work: schema modeling, generated client usage, migrations, transactions, and raw SQL escape hatches.
- This pack is organized by real task shape: schema authoring, client lifecycle and CRUD, transaction boundaries, and migration/deployment workflows.
- This is a fresh pack, not a port from an older Prisma agent file.
- The strongest boundaries in the pack are Prisma schema vs database behavior, Prisma Client vs raw SQL, and development migrations vs production deployment.

## FAQ

### When should I use raw SQL instead of Prisma Client?
Use raw SQL when Prisma Client cannot express the operation cleanly or efficiently, and explain the portability and safety tradeoff explicitly.

### Is `db push` the same as migrations?
No. `db push` synchronizes schema state directly, while migrations provide managed history and deployment sequencing.

### Does Prisma Client remove database-level concerns?
No. Typed queries help correctness and ergonomics, but transaction semantics, locking, indexing, and deployment behavior still come from the real database.

## External Resources

- Prisma ORM Overview: https://www.prisma.io/orm
- Prisma Schema Overview: https://www.prisma.io/docs/orm/prisma-schema/overview
- Prisma Client CRUD Queries: https://www.prisma.io/docs/orm/prisma-client/queries/crud
- Prisma Client Transactions: https://www.prisma.io/docs/orm/prisma-client/queries/transactions
- Prisma Raw Queries: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries
- Prisma Migrate Development and Production: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
- Prisma ORM 7.2.0 Release Note: https://www.prisma.io/blog/announcing-prisma-orm-7-2-0
