# PostgreSQL Workflows

### Design a production table with real invariants
- when to use it:
  - new schema design for application tables that will be written frequently
- ordered steps:
  1. choose concrete data types and stable keys
  2. add `NOT NULL`, `CHECK`, `UNIQUE`, and `FOREIGN KEY` constraints for real invariants
  3. add only the indexes required by measured query patterns
  4. inspect representative queries with `EXPLAIN`
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
  - weak types and nullable columns where stronger contracts exist
  - using application code alone for invariants
  - adding broad indexes before looking at real query shape

### Diagnose a slow query
- when to use it:
  - query latency is high or planner behavior looks surprising
- ordered steps:
  1. capture the query and its real predicates
  2. run `EXPLAIN`
  3. run `EXPLAIN ANALYZE` if the statement is safe to execute
  4. refresh stats with `ANALYZE` if data changed materially
  5. revisit query shape, indexes, and estimate quality
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
  - optimizing from intuition instead of plan output
  - ignoring stale statistics
  - treating an existing index as proof that the plan should use it

### Add a constraint safely on a live table
- when to use it:
  - production migration on an already-populated table
- ordered steps:
  1. clean or backfill bad data first
  2. add the constraint in a low-risk rollout form when supported
  3. validate it separately
  4. watch lock behavior and transaction duration
- example:

```sql
ALTER TABLE orders
ADD CONSTRAINT orders_total_positive
CHECK (total_cents > 0) NOT VALID;

ALTER TABLE orders
VALIDATE CONSTRAINT orders_total_positive;
```

- common failure points:
  - validating during peak traffic
  - assuming all DDL is cheap
  - skipping data cleanup before enforcement
