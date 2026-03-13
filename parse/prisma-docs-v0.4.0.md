# Prisma ORM Documentation Pack

## Snapshot
- library name: prisma orm
- version or version range: ^7.5.0
- primary language: typescript
- homepage or canonical docs URL: https://www.prisma.io/orm
- short description: Prisma ORM combines a declarative schema, migration workflow, and generated TypeScript client for relational and document database access.
- source set summary: `npm:prisma@7.5.0`, `npm:@prisma/client@7.5.0`, official Prisma schema, client, transaction, migration, and raw SQL docs, and the Prisma 7 release line as current context

## What This Library Is For
Prisma ORM is for defining database models in a Prisma schema, generating a typed client, running queries and writes through that client, and managing schema changes with Prisma Migrate.

Major use cases:
- defining relational schemas with explicit relations and constraints
- generating a typed TypeScript client for common read and write workflows
- managing development and production migrations
- handling transactions and selective raw SQL in application code

Scope and boundaries:
- this pack covers Prisma schema, Prisma Client, Prisma Migrate, and core CLI workflows
- this pack does not treat framework adapters as Prisma core behavior
- this pack does not treat database-native behavior as identical to Prisma Client behavior
- this pack does not treat raw SQL as interchangeable with generated-client semantics

## Installation And Setup
- install commands:
  - `npm install prisma@7.5.0 @prisma/client@7.5.0`
- environment prerequisites:
  - a supported Node.js runtime for the Prisma 7 release line
  - a real database connection URL
  - a deliberate choice of database provider and migration workflow
- configuration prerequisites:
  - `schema.prisma` with a `datasource` and `generator`
  - a valid `DATABASE_URL`
  - generated client artifacts before application code imports the client
- minimum setup example:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
}
```

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
```

## Core Concepts

### Schema drives client shape
- The Prisma schema is the source of truth for models, fields, relations, and generator output.
- Changes to the schema affect both migrations and the generated client surface.
- Schema syntax is not SQL; it is a Prisma layer that maps to database behavior with provider-specific constraints.

### Generated client is typed but not magic
- Prisma Client gives typed query builders and result shapes based on the schema.
- The generated client does not erase database costs, transaction semantics, or deployment concerns.
- Relation loading, selection, and writes should be chosen deliberately because they affect query shape and behavior.

### Migrations are operational work
- `prisma migrate dev` is for development iteration.
- `prisma migrate deploy` is for applying committed migrations in production.
- `prisma db push` is a different workflow and should not be treated as a drop-in replacement for migrations.

### Transactions and raw SQL are boundaries
- `$transaction(...)` is the main Prisma transaction boundary.
- Raw SQL is an escape hatch for cases Prisma Client does not model well.
- Raw SQL changes the safety and portability profile of the code and should be treated explicitly.

## Version Delta Audit
- prior version or prior pack target: none in this repo
- current locked version: ^7.5.0
- major changes that affect agent behavior:
  - Prisma 7 is the active current line, so guidance should default to Prisma 7-era workflows
  - client generation, migration workflow, and release-line assumptions should stay aligned with Prisma 7 docs
- outdated assumptions that must not carry forward:
  - do not collapse `db push` and migrations into one workflow
  - do not present framework-specific integration guidance as Prisma core behavior
  - do not present raw SQL as equivalent to generated Prisma Client operations

## Decision Rules
- Use Prisma schema models and relations when the application data model maps cleanly to Prisma's declarative layer.
- Use generated Prisma Client methods for ordinary CRUD and relation queries before reaching for raw SQL.
- Use `select` or `include` deliberately instead of over-fetching by habit.
- Use `$transaction(...)` when multiple operations must succeed or fail together.
- Use `prisma migrate dev` for development-time schema iteration and `prisma migrate deploy` for production application of existing migrations.
- Use `db push` only when the workflow explicitly fits schema synchronization without managed migrations.
- Use raw SQL when Prisma Client cannot express the needed operation cleanly or efficiently, and explain the tradeoff.

## Ecosystem Boundaries
- core Prisma surface:
  - Prisma schema, Prisma Client, Prisma Migrate, Prisma CLI workflows, raw SQL helpers
- first-party companion surfaces:
  - framework integration guides
  - deployment guides for specific platforms
- third-party ecosystem surfaces:
  - auth adapters, ORM wrappers, framework starters, custom generators
- intentionally out of scope for this pack:
  - framework-specific route handlers, server components, NestJS helpers, or deployment platform internals

## Preconditions And Invariants
- the schema and generated client must be in sync
- connection URLs and provider choice affect runtime behavior materially
- migrations are part of deployment, not just local development convenience
- transaction semantics still depend on the underlying database
- raw SQL bypasses some Prisma-level guarantees and ergonomics

## Public Surface Area

### Schema and setup

#### datasource
**Kind:** other

**Summary:** Defines the database provider and connection URL for the Prisma schema.

**Definition**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Guidance**
- Keep provider and connection URL accurate and environment-specific.
- Treat connection URLs as deployment-sensitive configuration.
- Provider choice changes available features and migration semantics.

**Example**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-schema/overview

#### generator
**Kind:** other

**Summary:** Declares generated artifacts, typically Prisma Client.

**Definition**
```prisma
generator client {
  provider = "prisma-client-js"
}
```

**Guidance**
- Keep generator output aligned with the runtime package the app imports.
- Regenerate after schema changes that affect client shape.
- Treat generated artifacts as build outputs, not hand-edited source.

**Example**
```prisma
generator client {
  provider = "prisma-client-js"
}
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-schema/overview

#### model
**Kind:** other

**Summary:** Declares a Prisma data model that maps to a database table or collection concept.

**Definition**
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}
```

**Guidance**
- Model names shape the generated client API and relation naming.
- Field attributes affect schema, migrations, and query behavior.
- Treat relation and uniqueness design as data-contract decisions, not only code-generation choices.

**Example**
```prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-schema/overview

### Client lifecycle and CRUD

#### PrismaClient
**Kind:** class

**Summary:** Generated client entrypoint used to connect to the database and run queries.

**Definition**
```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
```

**Guidance**
- Create a client intentionally and manage its lifecycle for the runtime environment.
- Reuse the client in long-lived processes instead of creating one per query.
- Generated client shape depends on the current schema and generation step.

**Example**
```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
await prisma.$connect();
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration
- Source: `npm:@prisma/client@7.5.0`

#### findMany
**Kind:** function

**Summary:** Query multiple records for a model with filtering, selection, ordering, and pagination options.

**Definition**
```ts
const users = await prisma.user.findMany({
  where: { email: { contains: "@example.com" } },
  select: { id: true, email: true },
});
```

**Guidance**
- Use `select` or `include` deliberately so result shape and query cost stay explicit.
- Combine filters, ordering, and pagination instead of fetching everything by default.
- Remember model delegates are generated from the schema, not global static APIs.

**Example**
```ts
const users = await prisma.user.findMany({
  where: { published: true },
  orderBy: { id: "desc" },
  take: 20,
});
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-client/queries/crud

#### create
**Kind:** function

**Summary:** Create a new record for a model through the generated client.

**Definition**
```ts
const user = await prisma.user.create({
  data: { email: "ada@example.com", name: "Ada" },
});
```

**Guidance**
- Keep `data` aligned with schema constraints and relation requirements.
- Prefer explicit nested writes only when the data shape truly belongs in one mutation.
- Validation and constraint failures still depend on database and schema state.

**Example**
```ts
const post = await prisma.post.create({
  data: {
    title: "Hello Prisma",
    author: { connect: { id: 1 } },
  },
});
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-client/queries/crud

#### update
**Kind:** function

**Summary:** Update one existing record, typically identified by a unique `where` clause.

**Definition**
```ts
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Grace" },
});
```

**Guidance**
- Use unique selectors in `where` and keep partial updates intentional.
- Consider transaction boundaries when the update is part of a multi-step workflow.
- Distinguish `update` from `updateMany`; they have different result and error behavior.

**Example**
```ts
const order = await prisma.order.update({
  where: { id: 42 },
  data: { status: "PAID" },
});
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-client/queries/crud

### Transactions, raw SQL, and migrations

#### $transaction
**Kind:** function

**Summary:** Execute multiple Prisma operations in one transaction boundary.

**Definition**
```ts
const result = await prisma.$transaction([
  prisma.user.create({ data: { email: "a@example.com" } }),
  prisma.profile.create({ data: { bio: "hello" } }),
]);
```

**Guidance**
- Use it when the operations must succeed or fail together.
- Keep database-level transaction cost and contention in mind.
- Distinguish array-style batched use from interactive transaction callbacks.

**Example**
```ts
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: { email: "a@example.com" } });
  await tx.auditLog.create({ data: { userId: user.id, action: "CREATE" } });
});
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-client/queries/transactions

#### $queryRaw
**Kind:** function

**Summary:** Run a raw query and return rows when Prisma Client cannot express the operation directly.

**Definition**
```ts
const rows = await prisma.$queryRaw`SELECT id, email FROM "User"`;
```

**Guidance**
- Use it as an explicit escape hatch, not as the default query style.
- Keep parameterization safe and deliberate.
- Raw SQL changes portability, type inference, and abstraction guarantees.

**Example**
```ts
const totals = await prisma.$queryRaw`
  SELECT status, COUNT(*)::int AS count
  FROM "Order"
  GROUP BY status
`;
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries

#### prisma migrate dev
**Kind:** other

**Summary:** Development-time migration workflow that creates and applies a migration and updates the generated client.

**Definition**
```bash
npx prisma migrate dev
```

**Guidance**
- Use in development when iterating on schema changes.
- Keep generated migrations under version control.
- Do not substitute it for production migration application.

**Example**
```bash
npx prisma migrate dev --name add-order-status
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production

#### prisma migrate deploy
**Kind:** other

**Summary:** Apply existing migrations in deployment environments.

**Definition**
```bash
npx prisma migrate deploy
```

**Guidance**
- Use this in production or CI/CD deployment workflows.
- Expect it to apply committed migration files, not generate new ones.
- Keep deployment sequencing explicit so application code and schema stay compatible.

**Example**
```bash
npx prisma migrate deploy
```

**Source Notes**
- Source: https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production

## Workflows

### Model a relational schema and generate the client
1. define `datasource`, `generator`, and models in `schema.prisma`
2. run `prisma migrate dev` for development or the appropriate workflow for the environment
3. regenerate the client when schema changes require it
4. use model delegates from `PrismaClient` in application code

### Add a schema change safely
1. change the schema intentionally
2. generate a migration in development
3. review the migration and resulting client changes
4. apply production migrations with `prisma migrate deploy`

### Use transactions or raw SQL deliberately
1. start with ordinary Prisma Client operations
2. use `$transaction(...)` when atomicity matters across operations
3. use raw SQL only when Prisma Client cannot express the behavior cleanly

## Failure Modes
- schema and generated client are out of sync
- using `db push` where controlled migrations are required
- over-fetching with `include` or under-specifying result shape
- treating raw SQL as interchangeable with generated-client semantics
- ignoring database-level transaction or concurrency realities

## Common Confusions
- Prisma schema is not identical to raw database DDL
- `migrate dev`, `migrate deploy`, and `db push` are not interchangeable
- typed client results do not erase runtime or database costs
- framework integration examples are not Prisma core APIs

## References
- https://www.prisma.io/orm
- https://www.prisma.io/docs/orm/prisma-schema/overview
- https://www.prisma.io/docs/orm/prisma-client/queries/crud
- https://www.prisma.io/docs/orm/prisma-client/queries/transactions
- https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries
- https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production
- https://www.prisma.io/blog/announcing-prisma-orm-7-2-0
