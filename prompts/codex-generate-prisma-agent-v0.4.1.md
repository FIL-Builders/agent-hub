==============================================================
AGENTHUB - PRISMA ORM 0.4.1 GENERATION BRIEF
Goal: Generate `agents/prisma/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Prisma ORM sources.
==============================================================

### 1 - Target Output

Write:

- `agents/prisma/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/prisma-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Prisma ORM sources, including:

- `npm:prisma@7.5.0` package contents
- `npm:@prisma/client@7.5.0` package contents and type declarations
- official Prisma ORM docs pages
- official release and upgrade notes for the Prisma 7 line
- the Prisma repository at a version-matched tag or commit when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: prisma`
- `Spec version: 0.4.0`
- `Library version: ^7.5.0`
- `Primary language: typescript`
- `Homepage: https://www.prisma.io/orm`

Lock the target to Prisma ORM `^7.5.0` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current Prisma target and identify
commonly stale mental models that still leak into real help.

You must identify and avoid stale assumptions, including any assumptions about:

- Prisma schema behavior being the same thing as database-native behavior
- generated Prisma Client behavior being interchangeable with raw SQL or a
  lower-level query builder
- migrations, schema pushes, and deployment steps being one undifferentiated
  workflow
- framework-specific integration patterns being Prisma core behavior

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Prisma ORM itself: schema modeling, generated client behavior,
migrations, transactions, deployment workflow, and operational gotchas.

You must distinguish:

- Prisma schema and client behavior
- underlying database behavior
- raw SQL escape hatches
- deployment or hosting platform behavior
- framework-specific integration patterns

Specific rules:

- do not treat framework adapters or app-framework conventions as Prisma core
  behavior
- do not collapse Prisma Client semantics into generic SQL semantics
- do not blur schema authoring, migration authoring, and production deployment
  into one vague workflow

If another library or framework pattern is useful as context, call it out as a
boundary rather than treating it as Prisma core API.

### 7 - Coverage Expectations

The generated file should cover the current Prisma surface needed for real
project work, including:

- schema design and modeling
- relations and referential behavior
- generated client querying and writes
- transactions and concurrency-sensitive workflows
- migrations and schema deployment
- seeding and operational workflows where source support is strong
- raw SQL escape hatches and caveats
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer version-matched package contents, generated-client types, and official
  docs
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Prisma ORM 7 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- distinguish schema design from generated client usage
- explain migrations and deployment steps as operationally significant, not just
  development-time convenience
- keep transaction behavior and database-level concurrency implications explicit
- explain when raw SQL is appropriate and what guarantees are lost or changed
- preserve high-value guidance around generated client types, relation queries,
  migration drift, and deployment gotchas

### 10 - Required Prisma ORM 7 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that Prisma Client is just a thin wrapper over generic SQL semantics
- that schema changes are safe without migration/deployment analysis
- that framework-specific adapters are Prisma core APIs

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   model a relational schema and query it through Prisma Client
2. troubleshooting:
   debug migration drift, relation-query confusion, or transaction misuse
3. design or tradeoff:
   choose between Prisma Client patterns, raw SQL, and migration strategies
4. version-confusion:
   prevent an answer that substitutes generic ORM or SQL intuition for
   Prisma-specific client and migration behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/prisma/0.4.0.md`
3. fix any reported structural errors
4. confirm Prisma-vs-database and Prisma-vs-framework boundaries are explicit
5. confirm schema, client, and migration semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
