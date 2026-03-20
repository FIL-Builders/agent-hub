# Prisma ORM Workflows

### Design a schema and generate the client
1. define `datasource`, `generator`, and models in `schema.prisma`
2. model keys, relations, defaults, and uniqueness intentionally
3. run `prisma migrate dev` or the appropriate workflow for the environment
4. run `prisma generate` when needed
5. import `PrismaClient` and use model delegates in application code

### Add a schema change safely
1. change the schema deliberately
2. create and review a migration in development
3. check generated-client changes
4. apply production migrations with `prisma migrate deploy`

### Use transactions or raw SQL deliberately
1. start with generated Prisma Client operations
2. use `$transaction(...)` when atomicity matters across operations
3. use raw SQL only when the generated client cannot express the operation cleanly
