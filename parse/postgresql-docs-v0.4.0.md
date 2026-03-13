# PostgreSQL Documentation Pack

## Snapshot
- library name: PostgreSQL
- version or version range: 18.3 current docs line
- primary language: sql
- homepage or canonical docs URL: https://www.postgresql.org/docs/current/index.htm
- short description: Relational database with strong transactional semantics, MVCC concurrency, mature indexing, and deep operational tooling.
- source set summary: official PostgreSQL current docs for CREATE TABLE, ALTER TABLE, CREATE INDEX, EXPLAIN, ANALYZE, CREATE STATISTICS, MVCC, transaction isolation, explicit locking, pg_upgrade, and release notes for PostgreSQL 18.

## What This Library Is For
PostgreSQL is for durable relational data storage, transactional integrity, query execution, indexing, concurrency control, and operational schema evolution. The high-value agent tasks are schema design, transaction design, performance diagnosis, lock and isolation debugging, and safe migrations on live systems. This pack stays on core PostgreSQL behavior and treats ORMs and extensions as boundaries rather than source truth.

## Installation And Setup
- Install PostgreSQL server and client tools using the platform-specific packages documented by PostgreSQL or the operating system.
- Verify the client and server version before using version-specific guidance.
- Create a scratch database before testing DDL, indexes, or query plans.
- Minimum setup example:

```bash
createdb app
psql app
```

## Core Concepts

### MVCC
- PostgreSQL uses multiversion concurrency control to let readers and writers proceed without simple table-level serialization.
- Visibility rules depend on transaction snapshot timing, not only on current physical row contents.
- Common confusion to avoid: MVCC does not mean "no locks"; row, table, and predicate-like behaviors still matter.

### Constraints And Keys
- Use database constraints to protect invariants close to the data.
- Primary keys, foreign keys, unique constraints, and check constraints solve different problems and should not be collapsed into one generic "validation" concept.
- Common confusion to avoid: app-layer validation complements constraints; it does not replace them.

### Query Planner And Statistics
- PostgreSQL chooses plans from table statistics, estimated costs, available indexes, and query shape.
- `EXPLAIN` shows planner decisions; `EXPLAIN ANALYZE` adds execution measurements.
- Common confusion to avoid: an index that seems obvious can still be a bad fit if planner estimates or workload shape disagree.

### Transactions, Isolation, And Locks
- Isolation level changes what each statement can see and how conflicts are handled.
- Row locking, table locking, and transaction visibility are related but distinct.
- Common confusion to avoid: `SELECT ... FOR UPDATE` is not the same as "everything in this transaction is serialized".

### Schema Change And Operations
- DDL choices can take locks, rewrite tables, or interact badly with live traffic.
- Large-table changes need planning around lock scope, validation strategy, and backfill sequencing.
- Common confusion to avoid: even simple-looking schema changes can have important runtime consequences.

## Version Delta Audit
- prior version or prior pack target: no prior PostgreSQL pack in this repo
- current locked version: PostgreSQL 18.3 current docs line
- major changes that affect agent behavior:
  - PostgreSQL 18 release notes add skip scan lookups for multicolumn B-tree use cases
  - PostgreSQL 18 release notes say `pg_upgrade` now retains optimizer statistics
  - PostgreSQL 18 release notes describe virtual generated columns as the default for generated columns
- outdated assumptions that must not carry forward:
  - do not assume upgrades always discard planner statistics
  - do not assume generated columns are always stored
  - do not answer PostgreSQL tuning questions with generic SQL or ORM intuition only

## Decision Rules
- Use constraints for invariants that must always hold, even if application code is wrong.
- Use indexes to support measured query patterns, not as automatic decoration for every column.
- Use `EXPLAIN` first, then `EXPLAIN ANALYZE` when you need execution truth and can safely run the statement.
- Use `CREATE INDEX CONCURRENTLY` on hot tables when write blocking is unacceptable.
- Use large-table migration patterns that separate data backfill, constraint validation, and cutover work.
- Avoid reaching for extension-specific features unless the task explicitly includes them.

## Ecosystem Boundaries
- Core surface:
  - SQL commands and PostgreSQL database behavior
  - planner, statistics, transactions, locks, and MVCC
  - DDL, constraints, indexes, and maintenance commands
- First-party companion surfaces:
  - client tools such as `psql`, `pg_dump`, and `pg_upgrade`
  - operational commands documented by PostgreSQL itself
- Third-party ecosystem surfaces:
  - ORMs, query builders, migration frameworks, poolers, and application frameworks
  - extensions such as PostGIS or pgvector unless a task explicitly depends on them
- Intentionally out of scope for this pack:
  - ORM-specific migration syntax
  - extension-specific behavior

## Preconditions And Invariants
- Know whether the task is schema design, query diagnosis, or migration planning before giving advice.
- Know the target table size and traffic pattern before recommending schema changes or index builds.
- Know whether the statement can safely be executed when using `EXPLAIN ANALYZE`.
- Keep transaction scope explicit; long transactions distort concurrency and vacuum behavior.
- Keep planner statistics current before drawing strong conclusions from a bad query plan.

## Public Surface Area

### Schema Design

#### CREATE TABLE
**Kind:** other

**Summary:** Define a new table, its columns, defaults, keys, constraints, and partitioning behavior.

**Definition**
```sql
CREATE TABLE name (
  column_name data_type [column_constraint ...],
  [table_constraint ...]
);
```

**Guidance**
- Use it to express durable structure, not just to get a table created quickly.
- Decide keys, nullability, defaults, and ownership semantics up front.
- Partitioning and generated columns have operational consequences; do not add them casually.

**Example**
```sql
CREATE TABLE accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  plan text NOT NULL CHECK (plan IN ('free', 'pro')),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Source Notes**
- official docs: `sql-createtable`
- exact command structure condensed for readability

#### PRIMARY KEY
**Kind:** other

**Summary:** Declares the row identity and automatically creates a unique B-tree index.

**Definition**
```sql
PRIMARY KEY (column_name [, ...])
```

**Guidance**
- Use it when the row must have a durable unique identifier.
- Keep primary keys stable; changing them later is expensive.
- Primary keys are not interchangeable with arbitrary unique constraints in application design.

**Example**
```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY,
  name text NOT NULL
);
```

**Source Notes**
- official docs: `sql-createtable`
- semantics summarized from constraint behavior

#### FOREIGN KEY
**Kind:** other

**Summary:** Enforces referential integrity between a referencing table and a referenced key.

**Definition**
```sql
FOREIGN KEY (child_column) REFERENCES parent_table(parent_column)
```

**Guidance**
- Use it to protect cross-table integrity at the database layer.
- Think about delete and update actions explicitly instead of accepting defaults blindly.
- Indexing the referencing side is often important for real workloads, but it is still a workload decision.

**Example**
```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers(id)
);
```

**Source Notes**
- official docs: DDL constraints and `sql-createtable`
- condensed from PostgreSQL constraint reference

#### CHECK
**Kind:** other

**Summary:** Enforces a boolean invariant for each row.

**Definition**
```sql
CHECK (predicate)
```

**Guidance**
- Use it for row-local invariants such as ranges, status sets, and domain restrictions.
- Keep the predicate deterministic and row-local.
- Do not confuse `CHECK` with cross-row or cross-table integrity rules.

**Example**
```sql
CREATE TABLE invoices (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount_cents integer NOT NULL CHECK (amount_cents > 0)
);
```

**Source Notes**
- official docs: DDL constraints and `sql-createtable`
- predicate semantics condensed

### Transactions And Concurrency

#### MVCC
**Kind:** other

**Summary:** Multiversion concurrency control keeps snapshots consistent while allowing concurrent access patterns.

**Definition**
```sql
-- concept, not a command
-- each transaction sees row versions according to snapshot visibility rules
```

**Guidance**
- Use MVCC as the mental model for visibility, not "who wrote last".
- Readers and writers can overlap, but conflicts still appear through locks and serialization rules.
- Long-running transactions keep old row versions alive and can hurt maintenance.

**Example**
```sql
BEGIN;
SELECT count(*) FROM orders;
-- concurrent writes may commit, but this transaction still follows its own visibility rules
COMMIT;
```

**Source Notes**
- official docs: `mvcc-intro`
- conceptual summary grounded in concurrency-control docs

#### Transaction Isolation
**Kind:** other

**Summary:** Isolation level controls what a transaction can observe and how concurrent changes can affect it.

**Definition**
```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- or REPEATABLE READ / SERIALIZABLE
COMMIT;
```

**Guidance**
- Use `READ COMMITTED` unless you have a concrete reason to pay for stronger guarantees.
- Move to `REPEATABLE READ` or `SERIALIZABLE` deliberately, with an understanding of retry behavior and conflict costs.
- Isolation level changes behavior across the entire transaction, not just a single statement.

**Example**
```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE inventory SET quantity = quantity - 1 WHERE sku = 'book-1';
COMMIT;
```

**Source Notes**
- official docs: `transaction-iso`
- command form condensed from transaction docs

#### SELECT ... FOR UPDATE
**Kind:** other

**Summary:** Row-locking query form for claiming rows that will be updated or coordinated across concurrent workers.

**Definition**
```sql
SELECT * FROM jobs
WHERE status = 'ready'
ORDER BY id
FOR UPDATE;
```

**Guidance**
- Use it when read-modify-write logic must protect specific rows from concurrent workers.
- Add `SKIP LOCKED` or `NOWAIT` only when the work-queue or contention behavior actually requires it.
- Remember that row locks live until transaction end.

**Example**
```sql
BEGIN;
SELECT id
FROM jobs
WHERE status = 'ready'
ORDER BY id
FOR UPDATE SKIP LOCKED
LIMIT 10;
COMMIT;
```

**Source Notes**
- official docs: `sql-select`, explicit locking docs
- locking example adapted for queue-style workloads

#### LOCK
**Kind:** other

**Summary:** Acquire an explicit table lock mode when ordinary row-level coordination is insufficient.

**Definition**
```sql
LOCK TABLE table_name IN SHARE MODE;
```

**Guidance**
- Use explicit table locks sparingly; they increase the chance of blocking and deadlocks.
- Know the exact lock mode you need rather than escalating by habit.
- The strongest lock modes can block ordinary reads; do not assume they are harmless.

**Example**
```sql
BEGIN;
LOCK TABLE billing_cycles IN ACCESS EXCLUSIVE MODE;
ALTER TABLE billing_cycles ADD COLUMN archived_at timestamptz;
COMMIT;
```

**Source Notes**
- official docs: `explicit-locking`
- lock-mode semantics summarized from locking table and examples

### Indexing And Query Planning

#### CREATE INDEX
**Kind:** other

**Summary:** Build an index to support specific access patterns, ordering, uniqueness, or expression lookup.

**Definition**
```sql
CREATE INDEX index_name ON table_name USING btree (column_name);
```

**Guidance**
- Create indexes to support real query patterns, not just because a column seems important.
- Pick the access method and indexed expression deliberately.
- Every index has write and storage cost; keep that tradeoff visible.

**Example**
```sql
CREATE INDEX orders_customer_created_idx
ON orders (customer_id, created_at DESC);
```

**Source Notes**
- official docs: `sql-createindex`
- synopsis simplified to the common form

#### CREATE INDEX CONCURRENTLY
**Kind:** other

**Summary:** Build an index with reduced write blocking on a live table, with important caveats and extra work.

**Definition**
```sql
CREATE INDEX CONCURRENTLY index_name
ON table_name (column_name);
```

**Guidance**
- Use it on hot production tables when normal index build blocking is unacceptable.
- Expect a longer build and more operational caveats than ordinary `CREATE INDEX`.
- Keep it out of large multi-step transactions; treat it as operational DDL.

**Example**
```sql
CREATE INDEX CONCURRENTLY users_email_idx
ON users (email);
```

**Source Notes**
- official docs: `sql-createindex`
- concurrency behavior summarized from the command reference

#### EXPLAIN
**Kind:** other

**Summary:** Show the execution plan the PostgreSQL planner chooses for a statement.

**Definition**
```sql
EXPLAIN [ ( option [, ...] ) ] statement;
```

**Guidance**
- Start here when a query is slow or an index appears unused.
- Read scan types, join strategy, row estimates, and costs together rather than isolating one line.
- A bad plan is often a statistics or query-shape problem, not only an "index missing" problem.

**Example**
```sql
EXPLAIN
SELECT *
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

**Source Notes**
- official docs: `sql-explain`
- plan-oriented options condensed from the command reference

#### ANALYZE
**Kind:** other

**Summary:** Refresh planner statistics so PostgreSQL can estimate row counts and costs more accurately.

**Definition**
```sql
ANALYZE [ table_name [(column_name [, ...]) ] ];
```

**Guidance**
- Run it after major data changes when autovacuum has not caught up yet.
- Use it before overreacting to a bad plan on a freshly loaded or heavily changed table.
- Remember that statistics are sampled and approximate.

**Example**
```sql
ANALYZE orders;
```

**Source Notes**
- official docs: `sql-analyze`
- synopsis simplified to the common form

#### CREATE STATISTICS
**Kind**
other

**Summary**
Define extended statistics for columns or expressions whose relationship matters to the planner.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createstatistics.html

```sql
CREATE STATISTICS stats_name
ON column_a, column_b
FROM table_name;
```

**Guidance**
- Use it when planner estimates suffer because column values are correlated or expression distributions matter.
- Prefer this when you need better estimates but not another maintained index.
- Remember that the statistics still require `ANALYZE` to be populated and refreshed.

**Example**
Language: sql
Description: Help the planner understand correlated columns used together in filters.

```sql
CREATE STATISTICS orders_customer_status_stats
ON customer_id, status
FROM orders;

ANALYZE orders;
```

**Source Notes**
- official docs: `sql-createstatistics`
- command intent condensed from the reference page

### Schema Change And Operations

#### ALTER TABLE
**Kind:** other

**Summary:** Change a table definition in place for new columns, defaults, constraints, types, names, and related structural work.

**Definition**
```sql
ALTER TABLE table_name action [, ...];
```

**Guidance**
- Treat it as operational DDL, not just a syntactic edit; some forms are cheap and others rewrite or lock heavily.
- Break risky changes into stages on large tables instead of bundling everything into one migration.
- Understand when validation, default evaluation, or type conversion forces more work than expected.

**Example**
```sql
ALTER TABLE customers
ADD COLUMN timezone text NOT NULL DEFAULT 'UTC';
```

**Source Notes**
- official docs: `ddl-alter`, `sql-altertable`
- lock and rewrite consequences summarized from the docs

#### pg_upgrade
**Kind:** workflow

**Summary:** Major-version upgrade tool that reuses existing data files to accelerate PostgreSQL upgrades.

**Definition**
```sql
-- command-line workflow, not a SQL statement
pg_upgrade [options]
```

**Guidance**
- Use it for major-version upgrades when the documented prerequisites and downtime model fit your environment.
- Treat extension compatibility, binaries, and rollback strategy as first-class planning items.
- PostgreSQL 18 release notes highlight retained optimizer statistics; still validate plans after upgrade.

**Example**
```bash
pg_upgrade \
  --old-datadir=/var/lib/postgresql/17/data \
  --new-datadir=/var/lib/postgresql/18/data \
  --old-bindir=/usr/lib/postgresql/17/bin \
  --new-bindir=/usr/lib/postgresql/18/bin
```

**Source Notes**
- official docs: `pgupgrade`, release notes for 18
- workflow shape condensed from upgrade docs

## Common Workflows

### Design a table for a write-heavy application
- when to use it:
  - new schema design for operational application tables
- ordered steps:
  1. choose stable primary keys and concrete data types
  2. add `NOT NULL`, `CHECK`, `UNIQUE`, and `FOREIGN KEY` constraints for real invariants
  3. add only the indexes required by measured query patterns
  4. run representative queries with `EXPLAIN`
- example:

```sql
CREATE TABLE tickets (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  account_id bigint NOT NULL REFERENCES accounts(id),
  status text NOT NULL CHECK (status IN ('open', 'closed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX tickets_account_created_idx
ON tickets (account_id, created_at DESC);
```

- common failure points:
  - using generic `text` or nullable columns where a real invariant exists
  - creating indexes preemptively without a query shape
  - forgetting planner validation after bulk loading

### Diagnose a slow query
- when to use it:
  - query latency is too high or index usage looks wrong
- ordered steps:
  1. capture the query and parameters
  2. run `EXPLAIN` to inspect estimated plan shape
  3. run `EXPLAIN ANALYZE` only when it is safe to execute the statement
  4. refresh stats with `ANALYZE` if the table changed materially
  5. revisit indexes, predicates, and row-estimate quality
- example:

```sql
EXPLAIN ANALYZE
SELECT *
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

- common failure points:
  - diagnosing from intuition instead of plan output
  - ignoring stale statistics
  - adding broad indexes before understanding selectivity and sort order

### Add a constraint on a large live table
- when to use it:
  - migration on a production table that already contains data
- ordered steps:
  1. backfill or clean existing bad data first
  2. add the constraint in a low-risk form when supported
  3. validate in a separate operational step
  4. monitor lock behavior and transaction duration
- example:

```sql
ALTER TABLE orders
ADD CONSTRAINT orders_total_positive
CHECK (total_cents > 0) NOT VALID;

ALTER TABLE orders
VALIDATE CONSTRAINT orders_total_positive;
```

- common failure points:
  - assuming every DDL statement is cheap
  - validating immediately during peak traffic
  - skipping data cleanup before constraint enforcement

## Common Confusions
- MVCC vs locks:
  - MVCC controls snapshot visibility; locks coordinate conflicting operations.
- `EXPLAIN` vs `EXPLAIN ANALYZE`:
  - `EXPLAIN` shows the chosen plan; `EXPLAIN ANALYZE` runs the statement and measures it.
- constraints vs app validation:
  - application validation improves UX; database constraints protect invariants at the data boundary.
- index presence vs planner usage:
  - an existing index can still be ignored if statistics, selectivity, or query shape make another plan cheaper.

## Deprecated And Compatibility Surface
- Treat old cross-database SQL folklore with caution; PostgreSQL planner, MVCC, and DDL behaviors are more specific than generic SQL advice.
- Do not present ORM migration defaults as PostgreSQL operational truth.
- Version-specific operational details such as generated-column defaults or upgrade behavior should follow PostgreSQL 18 docs, not older habits.

## Pitfalls And Troubleshooting

### Slow query despite having an index
- likely cause:
  - stale statistics, low selectivity, wrong column order, or a query shape that cannot use the index efficiently
- how to verify:
  - inspect `EXPLAIN`, then `EXPLAIN ANALYZE` if safe
- fix:
  - refresh statistics, revisit index design, or rewrite the query shape

### Migration waits or blocks traffic
- likely cause:
  - lock contention from `ALTER TABLE` or other DDL
- how to verify:
  - inspect active locks and long transactions
- fix:
  - split the migration, schedule lower-impact steps, or use compatibility-first patterns

### Transaction queue workers block each other
- likely cause:
  - row locks are being taken without `SKIP LOCKED` or transactions remain open too long
- how to verify:
  - inspect active transactions and locking behavior
- fix:
  - shorten transactions and use explicit row-locking patterns deliberately

## Best Practices
- Put invariants in the database when they must always hold.
- Keep transactions short.
- Measure plans before and after schema or data-shape changes.
- Treat indexes as workload-specific structures with write cost.
- Separate migration rollout from business-logic rollout.

## References
- https://www.postgresql.org/docs/current/index.htm
- https://www.postgresql.org/docs/current/sql-createtable.html
- https://www.postgresql.org/docs/current/ddl-alter.html
- https://www.postgresql.org/docs/current/sql-altertable.html
- https://www.postgresql.org/docs/current/sql-createindex.html
- https://www.postgresql.org/docs/current/sql-explain.html
- https://www.postgresql.org/docs/current/sql-analyze.html
- https://www.postgresql.org/docs/current/sql-createstatistics.html
- https://www.postgresql.org/docs/current/mvcc-intro.html
- https://www.postgresql.org/docs/current/transaction-iso.html
- https://www.postgresql.org/docs/current/explicit-locking.html
- https://www.postgresql.org/docs/current/sql-select.html
- https://www.postgresql.org/docs/current/pgupgrade.html
- https://www.postgresql.org/docs/current/release-18.html

## Open Questions
- Needs verification: whether to include extension-facing workflows such as logical replication or vector search in a future PostgreSQL pack variant instead of this core pack.
