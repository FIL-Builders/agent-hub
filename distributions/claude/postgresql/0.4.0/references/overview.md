# PostgreSQL Overview

## Snapshot

- Spec name: postgresql
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^18.3
- Primary language: sql
- Homepage: https://www.postgresql.org/docs/current/index.htm
- Source set: official PostgreSQL 18 current docs for CREATE TABLE, ALTER TABLE, CREATE INDEX, EXPLAIN, ANALYZE, CREATE STATISTICS, MVCC, transaction isolation, explicit locking, pg_upgrade, and release notes; plus parse/postgresql-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- postgresql
- sql
- schema-design
- transactions
- indexing
- query-planning
- concurrency
- migrations

## Purpose

This pack teaches an agent to use PostgreSQL 18.3 for schema design, constraints, transactions, indexing, query tuning, concurrency control, and migration planning while keeping PostgreSQL-specific planner and locking behavior distinct from generic SQL, ORM, or extension advice.

## Guiding Principles

- Put durable invariants in PostgreSQL constraints, not only in application code.
- Treat transactions, MVCC visibility, row locks, and table locks as related but distinct concepts.
- Add indexes for measured query patterns and sort requirements, not by reflex.
- Use `EXPLAIN` and `EXPLAIN ANALYZE` to understand planner choices before changing schema or queries.
- Keep long-running transactions rare because they distort concurrency and maintenance behavior.
- Treat `ALTER TABLE`, index builds, and major upgrades as operational work with locking and compatibility consequences.
- Keep ORM conventions, extensions, and cross-database folklore outside the PostgreSQL core mental model unless the task explicitly includes them.

## Boundary Notes

- Primary sources are official PostgreSQL current docs for command syntax and operational semantics, with PostgreSQL 18 release notes used for version-sensitive guidance such as planner and upgrade behavior.
- Coverage is deliberately centered on high-value PostgreSQL surfaces: constraints, transactions, concurrency, planner behavior, index design, query diagnosis, and migrations.
- The pack is organized by the way real tasks arrive: schema design, transactional concurrency, planner/index work, and operational change.
- This is a fresh pack, not a port from an older PostgreSQL agent file.
- The strongest boundary in this pack is that PostgreSQL-specific planner, lock, and MVCC behavior should not be replaced by generic SQL or ORM intuition.

## FAQ

### Should every foreign key column have an index?
No. Indexes are workload-driven, but foreign key access paths often benefit from indexing when deletes, updates, or joins touch the referencing side frequently.

### Does TypeScript or ORM validation make database constraints unnecessary?
No. Application validation improves developer and user experience, but PostgreSQL constraints protect the data boundary even when application code is wrong or partially deployed.

### Is `EXPLAIN ANALYZE` always safe?
No. It executes the statement. Use caution with writes or run inside a controlled transaction you can roll back when appropriate.

## External Resources

- Official docs index: https://www.postgresql.org/docs/current/index.htm
- CREATE TABLE reference: https://www.postgresql.org/docs/current/sql-createtable.html
- CREATE INDEX reference: https://www.postgresql.org/docs/current/sql-createindex.html
- EXPLAIN reference: https://www.postgresql.org/docs/current/sql-explain.html
- ANALYZE reference: https://www.postgresql.org/docs/current/sql-analyze.html
- Transaction isolation reference: https://www.postgresql.org/docs/current/transaction-iso.html
- Explicit locking reference: https://www.postgresql.org/docs/current/explicit-locking.html
- pg_upgrade reference: https://www.postgresql.org/docs/current/pgupgrade.html
