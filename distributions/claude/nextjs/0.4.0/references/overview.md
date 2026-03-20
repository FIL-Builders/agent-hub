# Next.js Overview

## Snapshot

- Spec name: nextjs
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^16.1.6
- Primary language: typescript
- Homepage: https://nextjs.org/docs
- Source set: npm:next@16.1.6 declarations, official Next.js docs pages, official Next.js API reference pages, and parse/nextjs-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- nextjs
- react
- app-router
- pages-router
- ssr
- caching
- routing

## Purpose

This pack teaches an agent to use Next.js 16 effectively across App Router, Pages Router compatibility, rendering boundaries, request helpers, caching and revalidation, and framework-specific routing behavior without collapsing those concerns into generic React advice.

## Guiding Principles

- Default to App Router mental models for new work unless the task is explicitly about Pages Router or migration.
- Keep server components, client components, route handlers, server actions, and Pages Router data functions as distinct execution contexts.
- Treat `next/navigation` hooks as Client Component APIs and `headers()` / `cookies()` / `redirect()` as server-side control or request APIs.
- Distinguish framework caching and revalidation from ordinary React state updates.
- Treat typed routes and TypeScript helpers as static safety aids, not runtime guarantees.
- Keep Node.js and Edge runtime assumptions explicit when code depends on platform behavior.
- Correct stale Router-era advice instead of blending incompatible patterns into one answer.

## Boundary Notes

- Primary contract sources: `npm:next@16.1.6:package/dist/client/link.d.ts`, `package/dist/client/components/navigation.d.ts`, `package/dist/client/components/redirect.d.ts`, `package/dist/client/components/not-found.d.ts`, `package/dist/server/request/headers.d.ts`, `package/dist/server/request/cookies.d.ts`, `package/cache.d.ts`, `package/server.d.ts`, and `package/dist/types.d.ts`.
- Guidance sources: official Next.js docs pages for App Router, Server and Client Components, request helpers, metadata, caching, revalidation, and Pages Router data fetching.
- Coverage is organized by real task shape: navigation and client hooks, server request and control APIs, caching and invalidation, route handling and metadata, and Pages Router compatibility.
- This is a fresh pack, not a port. Its main job is to prevent stale mental models from leaking into answers, especially around App Router vs Pages Router and server vs client boundaries.
- The strongest boundary in the pack is that generic React knowledge is not enough when Next.js routing, caching, or runtime semantics are the actual problem.

## FAQ

### When should an answer default to App Router instead of Pages Router?
Default to App Router for new work unless the task explicitly references `pages/`, `getServerSideProps`, `getStaticProps`, `getStaticPaths`, or a migration scenario.

### Are headers() and cookies() client-side APIs?
No. They are server-side request helpers and should stay in Server Components, Route Handlers, Server Actions, or other server-side framework contexts.

### Is redirect() the same thing as router.push()?
No. `redirect()` is a server-side control-flow API that aborts the current path and redirects immediately. `router.push()` is a client-side navigation method.

## External Resources

- Next.js docs: https://nextjs.org/docs
- App Router docs: https://nextjs.org/docs/app
- Pages Router docs: https://nextjs.org/docs/pages
- Link reference: https://nextjs.org/docs/app/api-reference/components/link
- navigation hooks reference: https://nextjs.org/docs/app/api-reference/functions/use-router
- request helpers reference: https://nextjs.org/docs/app/api-reference/functions/headers
- caching reference: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- Pages Router data reference: https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
