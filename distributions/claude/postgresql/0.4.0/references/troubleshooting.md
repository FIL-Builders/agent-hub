# PostgreSQL Troubleshooting

### Query stays slow after adding an index
**Cause**
Stale statistics, poor selectivity, wrong column order, or a query shape that
cannot use the index efficiently.

**Fix**
Inspect `EXPLAIN`, then `EXPLAIN ANALYZE` if safe. Refresh statistics, revisit
query shape, or redesign the index around actual predicates and ordering.

### Migration blocks traffic
**Cause**
`ALTER TABLE` or other DDL is waiting on or holding conflicting locks, often
because of long transactions or a high-lock operation on a busy table.

**Fix**
Inspect active locks and long transactions. Split the migration, choose
lower-impact rollout steps, or schedule the high-lock phase deliberately.

### Workers block each other while claiming rows
**Cause**
Row locks are held too long or queue consumers are not using the right locking
pattern for concurrent claiming.

**Fix**
Inspect active transactions and locking behavior around `SELECT ... FOR UPDATE`.
Shorten transactions and adopt an explicit queue strategy such as `SKIP LOCKED`
when appropriate.
