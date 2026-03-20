# PostgreSQL API Groups

### Schema Design And Constraints

**Exports**
- CREATE TABLE
- PRIMARY KEY
- FOREIGN KEY
- CHECK
- GENERATED AS IDENTITY

Core schema primitives for row shape, invariants, and relational integrity.

#### CREATE TABLE
**Kind**
other

**Summary**
Define a new table, its columns, defaults, constraints, and partitioning or storage choices.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createtable.html

```sql
CREATE TABLE table_name (
  column_name data_type [column_constraint ...],
  [table_constraint ...]
);
```

**Guidance**
- Use it to express stable data contracts up front: types, nullability, keys, and checks.
- Decide whether the table is ordinary, partitioned, or temporary before the application depends on it.
- Do not treat table creation as just "make columns exist"; defaults, constraints, and storage choices drive operational behavior later.

**Example**
Language: sql
Description: Create an application table with identity, unique, and check constraints.

```sql
CREATE TABLE accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  plan text NOT NULL CHECK (plan IN ('free', 'pro')),
  created_at timestamptz NOT NULL DEFAULT now()
);
```

#### PRIMARY KEY
**Kind**
other

**Summary**
Declare the canonical row identity and automatically back it with a unique B-tree index.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createtable.html

```sql
PRIMARY KEY (column_name [, ...])
```

**Guidance**
- Use it when the row must have a stable unique identifier that other tables or application logic can depend on.
- Keep primary keys stable; changing them later is usually more expensive than choosing them carefully now.
- Do not confuse a primary key with every other uniqueness rule in the schema.

**Example**
Language: sql
Description: Use a UUID primary key for cross-system identity.

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY,
  name text NOT NULL
);
```

#### FOREIGN KEY
**Kind**
other

**Summary**
Enforce referential integrity between a referencing table and a referenced key.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createtable.html

```sql
FOREIGN KEY (child_column)
REFERENCES parent_table(parent_column)
```

**Guidance**
- Use foreign keys for invariants that must survive bad application code or partial deploys.
- Think about `ON DELETE` and `ON UPDATE` actions explicitly instead of relying on defaults by habit.
- Remember that foreign keys protect correctness; separate indexing decisions still depend on workload shape.

**Example**
Language: sql
Description: Tie orders to customers with database-enforced integrity.

```sql
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL REFERENCES customers(id)
);
```

#### CHECK
**Kind**
other

**Summary**
Enforce a per-row boolean invariant directly in the database.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createtable.html

```sql
CHECK (predicate)
```

**Guidance**
- Use `CHECK` for row-local invariants such as ranges, enums, and value relationships.
- Keep the predicate deterministic and cheap enough to enforce on every write.
- Do not use it for cross-row invariants that require aggregation or external state.

**Example**
Language: sql
Description: Ensure money values remain positive.

```sql
CREATE TABLE invoices (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  amount_cents integer NOT NULL CHECK (amount_cents > 0)
);
```

#### GENERATED AS IDENTITY
**Kind**
other

**Summary**
Declare an identity column backed by a sequence and managed by PostgreSQL.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createtable.html

```sql
column_name bigint GENERATED ALWAYS AS IDENTITY
```

**Guidance**
- Prefer identity columns over older serial-style habits when you want database-managed numeric keys.
- Use `ALWAYS` when callers should not provide values casually; use `BY DEFAULT` only when controlled overrides are acceptable.
- Keep sequence-backed identifiers separate from business identifiers.

**Example**
Language: sql
Description: Create an auto-generated integer key.

```sql
CREATE TABLE jobs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  status text NOT NULL
);
```

### Transactions And Concurrency

**Exports**
- MVCC
- Transaction Isolation
- SELECT ... FOR UPDATE
- LOCK

PostgreSQL concurrency primitives and the mental model needed to avoid stale or unsafe advice.

#### MVCC
**Kind**
other

**Summary**
Multiversion concurrency control governs row visibility and lets readers and writers overlap without simple table-wide serialization.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/mvcc-intro.html

```sql
-- MVCC is a database behavior model, not a standalone SQL command
-- each transaction sees row versions according to snapshot visibility rules
```

**Guidance**
- Use MVCC as the base mental model for visibility questions before reaching for lock explanations.
- Remember that MVCC reduces some contention but does not remove row, table, or predicate-like conflict behavior.
- Keep transactions short; old snapshots keep dead tuples visible for longer and complicate maintenance.

**Example**
Language: sql
Description: Snapshot visibility matters across the full transaction, not only per statement.

```sql
BEGIN;
SELECT count(*) FROM orders;
-- concurrent writes may commit here, but this transaction still follows its own snapshot rules
COMMIT;
```

#### Transaction Isolation
**Kind**
other

**Summary**
Isolation level controls what a transaction can observe and how concurrent changes can interfere with it.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/transaction-iso.html

```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
COMMIT;
```

**Guidance**
- Default to `READ COMMITTED` unless the task needs stronger guarantees and can tolerate the tradeoffs.
- Move to `REPEATABLE READ` or `SERIALIZABLE` deliberately, with retry behavior and conflict handling in mind.
- Isolation is a transaction-wide contract, not a single-statement hint.

**Example**
Language: sql
Description: Use a stronger isolation level for a critical inventory update flow.

```sql
BEGIN;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE inventory
SET quantity = quantity - 1
WHERE sku = 'book-1';
COMMIT;
```

#### SELECT ... FOR UPDATE
**Kind**
other

**Summary**
Acquire row locks for rows selected by a query so concurrent workers cannot modify or claim them freely.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-select.html

```sql
SELECT *
FROM table_name
WHERE predicate
FOR UPDATE;
```

**Guidance**
- Use it for read-modify-write logic, job queues, or claim semantics on specific rows.
- Add `SKIP LOCKED` or `NOWAIT` only when the workload truly needs non-blocking behavior.
- Keep the transaction open only as long as needed; row locks last until transaction end.

**Example**
Language: sql
Description: Claim ready jobs without blocking workers behind already-claimed rows.

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

#### LOCK
**Kind**
other

**Summary**
Take an explicit table lock mode when row-level coordination is not enough and table-wide access ordering matters.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/explicit-locking.html

```sql
LOCK TABLE table_name IN lock_mode;
```

**Guidance**
- Use explicit table locks sparingly because they increase blocking and deadlock risk.
- Choose the narrowest lock mode that satisfies the task instead of escalating by habit.
- Only `ACCESS EXCLUSIVE` blocks ordinary `SELECT`, but many weaker modes still conflict with writes or DDL in important ways.

**Example**
Language: sql
Description: Guard a DDL change with an explicit lock inside a transaction.

```sql
BEGIN;
LOCK TABLE billing_cycles IN ACCESS EXCLUSIVE MODE;
ALTER TABLE billing_cycles ADD COLUMN archived_at timestamptz;
COMMIT;
```

### Indexing And Query Planning

**Exports**
- CREATE INDEX
- CREATE INDEX CONCURRENTLY
- EXPLAIN
- ANALYZE
- CREATE STATISTICS

Planner-facing surfaces for access-path selection, diagnosis, and statistics quality.

#### CREATE INDEX
**Kind**
other

**Summary**
Build an index to support specific filter, join, ordering, or uniqueness needs.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createindex.html

```sql
CREATE INDEX index_name
ON table_name USING btree (column_name);
```

**Guidance**
- Create indexes for measured workload patterns, not because every foreign key or filtered column "should have one".
- Pick the indexed columns and order to match real predicates and sorts.
- Every index adds write, vacuum, and storage cost, so explain the tradeoff when recommending one.

**Example**
Language: sql
Description: Support recent-order queries for one customer.

```sql
CREATE INDEX orders_customer_created_idx
ON orders (customer_id, created_at DESC);
```

#### CREATE INDEX CONCURRENTLY
**Kind**
other

**Summary**
Build an index with reduced write blocking on a live table, at the cost of extra operational complexity.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createindex.html

```sql
CREATE INDEX CONCURRENTLY index_name
ON table_name (column_name);
```

**Guidance**
- Use it on hot production tables when blocking writes for a standard build is unacceptable.
- Expect a longer build and more caveats than ordinary index creation.
- Treat it as operational DDL rather than bundling it into large transactional migrations.

**Example**
Language: sql
Description: Add an email lookup index without stopping writes.

```sql
CREATE INDEX CONCURRENTLY users_email_idx
ON users (email);
```

#### EXPLAIN
**Kind**
other

**Summary**
Show the execution plan the PostgreSQL planner chooses for a statement, optionally with execution measurements.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-explain.html

```sql
EXPLAIN [ ( option [, ...] ) ] statement;
```

**Guidance**
- Start here when a query is slow, a join shape looks wrong, or an index appears unused.
- Read row estimates, scan types, join methods, and sort steps together instead of fixating on one line.
- Use `ANALYZE` mode only when the statement can safely execute and its runtime side effects are acceptable.

**Example**
Language: sql
Description: Inspect the plan for a filtered and ordered query.

```sql
EXPLAIN
SELECT *
FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC
LIMIT 20;
```

#### ANALYZE
**Kind**
other

**Summary**
Refresh planner statistics so PostgreSQL can estimate row counts and costs more accurately.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-analyze.html

```sql
ANALYZE [ table_name [(column_name [, ...]) ] ];
```

**Guidance**
- Run it after major data changes when autovacuum has not refreshed stats yet.
- Use it before concluding that the planner is "wrong" on a freshly loaded or heavily changed table.
- Remember that the collected stats are approximate because PostgreSQL samples large tables.

**Example**
Language: sql
Description: Refresh statistics after a large batch load.

```sql
ANALYZE orders;
```

#### CREATE STATISTICS
**Kind**
other

**Summary**
Define extended statistics for correlated columns or expressions so the planner can estimate better.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-createstatistics.html

```sql
CREATE STATISTICS stats_name
ON column_a, column_b
FROM table_name;
```

**Guidance**
- Use it when bad estimates come from correlated columns or important expression relationships.
- Prefer it when you need better planner estimates without creating another maintained index.
- Follow it with `ANALYZE`, because the statistics object is only useful once populated.

**Example**
Language: sql
Description: Help the planner reason about two columns that are often filtered together.

```sql
CREATE STATISTICS orders_customer_status_stats
ON customer_id, status
FROM orders;

ANALYZE orders;
```

### Schema Change And Operations

**Exports**
- ALTER TABLE
- pg_upgrade

Operational surfaces where lock scope, compatibility, and rollout sequencing matter as much as syntax.

#### ALTER TABLE
**Kind**
other

**Summary**
Change table structure in place for columns, defaults, constraints, types, names, and related DDL work.

**Definition**
Language: sql
Source: https://www.postgresql.org/docs/current/sql-altertable.html

```sql
ALTER TABLE table_name action [, ...];
```

**Guidance**
- Treat it as operational work; some forms are fast metadata changes and others rewrite or heavily lock the table.
- Split risky large-table changes into staged migrations instead of bundling cleanup, backfill, and enforcement together.
- Validation timing matters just as much as syntax when live traffic exists.

**Example**
Language: sql
Description: Add and then validate a check constraint in a staged rollout.

```sql
ALTER TABLE orders
ADD CONSTRAINT orders_total_positive
CHECK (total_cents > 0) NOT VALID;

ALTER TABLE orders
VALIDATE CONSTRAINT orders_total_positive;
```

#### pg_upgrade
**Kind**
workflow

**Summary**
Major-version upgrade workflow that reuses existing data files to accelerate PostgreSQL upgrades.

**Definition**
Language: bash
Source: https://www.postgresql.org/docs/current/pgupgrade.html

```bash
pg_upgrade [options]
```

**Guidance**
- Use it when upgrading between major PostgreSQL versions and the documented prerequisites are satisfied.
- Treat extension compatibility, binary paths, rollback plans, and downtime windows as first-class concerns.
- PostgreSQL 18 release notes say optimizer statistics are retained, but you should still verify important plans after the upgrade.

**Example**
Language: bash
Description: Run a version-to-version upgrade with explicit binary and data directories.

```bash
pg_upgrade \
  --old-datadir=/var/lib/postgresql/17/data \
  --new-datadir=/var/lib/postgresql/18/data \
  --old-bindir=/usr/lib/postgresql/17/bin \
  --new-bindir=/usr/lib/postgresql/18/bin
```
