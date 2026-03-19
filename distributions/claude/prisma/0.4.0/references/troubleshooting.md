# Prisma ORM Troubleshooting

### Schema and client drift
**Cause**
The schema changed, but the generated Prisma Client or deployed database schema did not update in step.

**Fix**
- Run `prisma generate` after schema changes when the client surface should refresh.
- Verify the deployed database schema matches the code and migration state.
- Re-check whether recent schema changes were applied through the intended workflow.

### Migration confusion
**Cause**
The workflow mixed `migrate dev`, `migrate deploy`, and `db push` as if they were interchangeable.

**Fix**
- Separate development migration authoring from production migration application.
- Use `prisma migrate dev` for development iteration and `prisma migrate deploy` for production rollout.
- Use `db push` only when the workflow truly fits direct schema synchronization without managed migration history.

### Query shape confusion
**Cause**
The query relied on defaults instead of choosing `select`, `include`, relation loading, or write shape deliberately.

**Fix**
- Make projection explicit with `select` when only a narrow result shape is needed.
- Use `include` only when the caller truly needs related records.
- Re-check whether the query shape matches the actual data and response contract you need.

### Transaction surprises
**Cause**
Multi-step writes relied on ordinary sequential operations even though correctness or consistency required an explicit transaction boundary.

**Fix**
- Use `$transaction(...)` when the operations must succeed or fail together.
- Keep interactive transactions short-lived so they do not hold locks or contention longer than necessary.
- Revisit whether some steps should move outside the transaction if they do not require atomicity.
