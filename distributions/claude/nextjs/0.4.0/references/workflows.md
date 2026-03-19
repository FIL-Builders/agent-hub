# Next.js Workflows

### Build An App Router Page With A Client Island
1. Start with a server component page in `app/` and keep data fetching on the server by default.
2. Introduce a child Client Component only for browser interactivity or client hooks like `useRouter()` or `useSearchParams()`.
3. Use `Link` for navigation and keep request-only helpers like `headers()` and `cookies()` on the server side.
4. If the page reads stale data after a mutation, inspect cache invalidation and use `revalidatePath()` or `revalidateTag()` deliberately.

### Revalidate Cached Data After A Mutation
1. Decide whether the mutation invalidates a route path or a logical data tag.
2. Perform the write in a server-side context such as a server action or route handler.
3. Call `revalidatePath()` for route-oriented invalidation or `revalidateTag()` for shared tagged data.
4. Verify that the data source and cache model match the invalidation strategy you chose.

### Maintain A Pages Router Page Safely
1. Confirm the task is actually about `pages/` rather than `app/`.
2. Use `GetServerSideProps`, `GetStaticProps`, or `GetStaticPaths` only within the Pages Router model.
3. Keep App Router APIs like `headers()` or `generateMetadata()` out of the answer unless the task is explicitly about migration boundaries.
4. If the repo is mid-migration, explain the boundary instead of mixing incompatible patterns.
