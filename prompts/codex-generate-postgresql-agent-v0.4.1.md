==============================================================
AGENTHUB - POSTGRESQL 0.4.1 GENERATION BRIEF
Goal: Generate `agents/postgresql/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched PostgreSQL sources.
==============================================================

### 1 - Target Output

Write:

- `agents/postgresql/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/postgresql-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
PostgreSQL sources, including:

- official PostgreSQL 18 current documentation pages
- official SQL command reference pages
- official runtime, planner, indexing, transaction, and concurrency reference pages
- official release notes and compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: postgresql`
- `Spec version: 0.4.0`
- `Library version: ^18.3`
- `Primary language: sql`
- `Homepage: https://www.postgresql.org/docs/current/index.htm`

Lock the target to PostgreSQL `^18.3` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current PostgreSQL target and identify
commonly stale mental models that still leak into real help.

You must identify and avoid stale assumptions, including any assumptions about:

- database constraints being interchangeable with application-level validation
- indexes always improving performance without write or planner tradeoffs
- transaction isolation, locks, MVCC, and concurrency behavior being simple or
  interchangeable concepts
- generic SQL advice from other databases being automatically valid for
  PostgreSQL behavior and tooling

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for PostgreSQL itself: SQL semantics, schema design, indexes,
query tuning, transactions, concurrency, and operational database behavior.

You must distinguish:

- core PostgreSQL SQL and database behavior
- extension behavior
- application ORM or framework behavior
- generic database advice from non-PostgreSQL systems

Specific rules:

- do not treat ORM conventions as PostgreSQL core behavior
- do not collapse PostgreSQL planner behavior into generic SQL advice
- do not blur extension features into baseline PostgreSQL unless the source
  material makes the dependency explicit

If an ORM or extension pattern is useful as context, call it out as a boundary
rather than treating it as PostgreSQL core surface.

### 7 - Coverage Expectations

The generated file should cover the current PostgreSQL surface needed for real
project work, including:

- schema design and data types
- constraints and keys
- transactions, isolation, and locking
- indexes and query tuning
- `EXPLAIN` and performance diagnosis
- migrations and schema-change tradeoffs
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official PostgreSQL documentation and command/reference pages
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required PostgreSQL 18 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- choose data types, keys, and constraints deliberately instead of defaulting
  to weak schemas
- distinguish transaction semantics, row/table locks, and MVCC visibility
- explain indexing in terms of read/write tradeoffs and planner behavior
- use `EXPLAIN` / `EXPLAIN ANALYZE` as diagnosis tools rather than intuition
- treat migrations and schema changes as operationally significant work with
  locking and compatibility implications
- preserve high-value guidance around concurrency, slow queries, and index
  selection

### 10 - Required PostgreSQL 18 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that application-layer validation replaces database constraints
- that all indexes are universally beneficial
- that generic SQL or ORM behavior fully captures PostgreSQL planner and
  concurrency behavior

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   design a schema with keys, constraints, and indexes for a real workload
2. troubleshooting:
   debug a slow query or blocking transaction with planner and lock awareness
3. design or tradeoff:
   choose between schema patterns, index strategies, or migration approaches
4. version-confusion:
   prevent an answer that substitutes generic SQL or ORM assumptions for
   PostgreSQL-specific behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/postgresql/0.4.0.md`
3. fix any reported structural errors
4. confirm PostgreSQL-specific planner, transaction, and concurrency behavior
   is explicit
5. confirm ORM and extension boundaries are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
