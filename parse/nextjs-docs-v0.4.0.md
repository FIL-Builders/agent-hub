# Next.js Documentation Pack

## Snapshot
- Library: nextjs
- Target version: ^16.1.6
- Generated: 2026-03-12
- Primary package anchor: next@16.1.6
- Source set: npm:next@16.1.6 declarations, official Next.js docs pages, and official Next.js API reference pages

## Version Delta Audit
- Prior pack target: none in this repo
- Current target: ^16.1.6
- This is a fresh pack, but the documentation must actively prevent stale Next.js mental models from leaking in.
- The most common stale patterns are treating Pages Router as the default answer, collapsing server and client component boundaries, and treating generic React SSR knowledge as sufficient for Next.js routing and caching behavior.

## Ecosystem Boundaries
- Next.js owns framework routing, rendering, caching, request helpers, route handlers, and framework-level type surfaces such as `Route`, `Metadata`, and Pages Router data-fetching types.
- React owns component semantics and hooks that are not exported by Next.js.
- Node.js or Edge runtimes influence behavior, but runtime APIs are not interchangeable with framework APIs.
- Third-party auth, data, and state libraries are not part of the Next.js core surface.
- App Router and Pages Router are both real framework surfaces, but they should not be merged into one undifferentiated model.

## Source Inventory
- Contract source:
  - `npm:next@16.1.6:package/dist/client/link.d.ts`
  - `npm:next@16.1.6:package/dist/client/components/navigation.d.ts`
  - `npm:next@16.1.6:package/dist/client/components/redirect.d.ts`
  - `npm:next@16.1.6:package/dist/client/components/not-found.d.ts`
  - `npm:next@16.1.6:package/dist/server/request/headers.d.ts`
  - `npm:next@16.1.6:package/dist/server/request/cookies.d.ts`
  - `npm:next@16.1.6:package/cache.d.ts`
  - `npm:next@16.1.6:package/server.d.ts`
  - `npm:next@16.1.6:package/dist/types.d.ts`
- Guidance source:
  - `https://nextjs.org/docs/app/getting-started/project-structure`
  - `https://nextjs.org/docs/app/getting-started/server-and-client-components`
  - `https://nextjs.org/docs/app/api-reference/components/link`
  - `https://nextjs.org/docs/app/api-reference/functions/use-router`
  - `https://nextjs.org/docs/app/api-reference/functions/use-pathname`
  - `https://nextjs.org/docs/app/api-reference/functions/use-search-params`
  - `https://nextjs.org/docs/app/api-reference/functions/headers`
  - `https://nextjs.org/docs/app/api-reference/functions/cookies`
  - `https://nextjs.org/docs/app/api-reference/functions/redirect`
  - `https://nextjs.org/docs/app/api-reference/functions/not-found`
  - `https://nextjs.org/docs/app/api-reference/functions/revalidatePath`
  - `https://nextjs.org/docs/app/api-reference/functions/revalidateTag`
  - `https://nextjs.org/docs/app/api-reference/functions/generate-metadata`
  - `https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props`
  - `https://nextjs.org/docs/pages/api-reference/functions/get-static-props`
  - `https://nextjs.org/docs/pages/api-reference/functions/get-static-paths`

## App Router Boundaries
- App Router answers should default to server components unless client behavior is actually required.
- Client hooks from `next/navigation` require Client Components.
- Route handlers, server actions, page components, and layout components are different execution contexts and should be taught separately.
- `headers()` and `cookies()` are server-side request helpers, not client-side APIs.

## Pages Router Boundaries
- Pages Router is still a supported compatibility and migration surface.
- `getServerSideProps`, `getStaticProps`, and `getStaticPaths` are Pages Router primitives, not App Router primitives.
- Do not mix these functions into `app/` answers unless the task is explicitly about Pages Router interop or migration.

## Routing And Navigation
- `Link` is the default framework navigation component and carries different prefetch behavior across App Router and Pages Router.
- `useRouter`, `usePathname`, `useSearchParams`, and `useParams` are App Router client hooks and should stay in Client Components.
- Typed routes are framework-specific type support, not runtime validation.

## Caching And Revalidation
- Revalidation APIs belong to framework cache invalidation, not generic React state management.
- `revalidatePath` is path-oriented invalidation.
- `revalidateTag` is cache-tag-oriented invalidation.
- `cacheLife` configures the behavior of `"use cache"` entries and should not be explained as a generic HTTP cache header helper.

## Request And Response Helpers
- `headers()` and `cookies()` are async request helpers in current Next.js and should be awaited.
- `redirect()` and `notFound()` abort the current render path by throwing control-flow exceptions; they are not value-returning helpers.
- `NextRequest` and `NextResponse` belong to route handlers, middleware, and edge/server request handling, not page component rendering.

## Metadata And Config
- `Metadata` and `generateMetadata` are App Router metadata surfaces.
- Metadata generation is not a replacement for route handlers or page rendering logic.
- Runtime choice, routing mode, and caching mode should be taught as framework decisions with environment implications, not as plain React concerns.

## Decision Rules
- If the task is about `app/`, start from App Router primitives and only bring in Pages Router APIs if the task explicitly says so.
- If the task needs browser interactivity, introduce a Client Component boundary first, then use `next/navigation` client hooks.
- If the task needs request headers, cookies, redirects, or route handlers, keep the solution on the server side.
- If the task mentions stale data after a mutation, inspect cache invalidation and runtime boundaries before blaming React state.
- If the task mixes `getServerSideProps` into `app/`, treat that as a version-model mismatch and correct it.

## Common Confusions
- Server Components are not the same thing as SSR in the Pages Router sense.
- `redirect()` is not equivalent to `router.push()`; one is server/control-flow aware and the other is a client navigation API.
- `headers()` and `cookies()` are not client APIs.
- `Link` is not just a styled `<a>` tag; it carries framework routing and prefetch behavior.
- `Route` typing helps with type safety but does not replace route generation or runtime existence checks.

## Failure Modes
- Calling `useRouter()` in a Server Component causes boundary errors.
- Mixing Pages Router data APIs into App Router code leads to invalid architecture, not just a type error.
- Assuming stale data will refresh automatically after a mutation leads to caching bugs.
- Treating Edge and Node runtimes as interchangeable can break dependencies or request handling.
- Forgetting that `headers()` and `cookies()` are async in current Next.js can lead to incorrect code shape.

## References
- https://nextjs.org/docs
- https://nextjs.org/docs/app
- https://nextjs.org/docs/pages
- https://nextjs.org/docs/app/api-reference
- https://nextjs.org/docs/pages/api-reference
- https://github.com/vercel/next.js
