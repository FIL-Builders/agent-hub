# Supabase JS Overview

## Snapshot

- Spec name: supabase-js
- Spec version: 0.4.0
- Generated: 2026-03-16
- Library version: @supabase/supabase-js^2.99.1
- Primary language: typescript
- Homepage: https://supabase.com/docs/reference/javascript/start
- Source set: stable published `@supabase/supabase-js@2.99.1`; `README.md`; `src/index.ts`; `src/SupabaseClient.ts`; `dist/index.d.mts`; stable published `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`; stable published `@supabase/functions-js@2.99.1` `FunctionsClient.d.ts`; stable published `@supabase/storage-js@2.99.1` `index.d.mts`; and `parse/supabase-js-docs-v0.4.0.md`

**Tags**
- supabase-js
- supabase
- auth
- storage
- realtime
- edge-functions

## Purpose

This pack teaches an agent to use `@supabase/supabase-js` as the isomorphic
JavaScript client for Supabase services: initialize the client correctly for the
target runtime, use auth/session APIs with the right trust model, query PostgREST
tables and RPC functions, manage storage buckets and files, subscribe to
Realtime channels, and invoke deployed Edge Functions without confusing client
SDK usage with dashboard configuration or server-side authoring workflows.

## Guiding Principles

- Treat `createClient(...)` as the entrypoint; the returned client composes auth, database, storage, functions, and realtime.
- Prefer the stable published npm surface over upstream `master` drift when they diverge.
- Keep auth, database, storage, realtime, and functions mentally separate even though they share one client.
- Use `getUser()` for authentic user identity on trusted-server decisions; `getSession()` reads local storage state and has weaker guarantees.
- Treat `accessToken` mode as mutually exclusive with `supabase.auth`.
- Use `from(...)` for table/view queries and `rpc(...)` for Postgres functions.
- Use `storage.from(bucket)` to enter file operations; distinguish public URLs, signed URLs, and private downloads explicitly.
- Treat `functions.invoke(...)` as the client-side invocation surface for already deployed Edge Functions, not as the function authoring workflow.
- Prefer runtime-specific configuration only where needed: custom `fetch`, React Native storage, headers, or schema selection.
- Keep this pack aligned to Node 20+ support for current versions of `@supabase/supabase-js`.

## Boundary Notes

- The stable package line is `2.99.1`, while the upstream repo `master` branch continues to move; this pack is anchored to the published package and stable dependency types.
- `@supabase/supabase-js` is a composition layer over `auth-js`, `postgrest-js`, `storage-js`, `functions-js`, and `realtime-js`; the pack documents the top-level client surface plus the most important delegated methods.
- Framework helpers such as `@supabase/ssr` are out of scope here; this pack is for the core JS client.
- Edge Function authoring, deployment, and server runtime code are out of scope here; `supabase.functions.invoke(...)` is the relevant client surface.
- Storage vectors and analytics are present in `storage-js`, but they are alpha surfaces and are not first-line guidance for ordinary `supabase-js` work.
- Runtime support matters operationally: browsers need native `fetch` and Realtime also needs native `WebSocket`; current `supabase-js` requires Node 20+.

## FAQ

### Should I use `getSession()` or `getUser()`?
- Use `getSession()` for normal client-side session access.
- Use `getUser()` when you need authenticated identity you can trust for server-side authorization decisions.

### Should I set `db.schema` or call `schema(...)`?
- Set `db.schema` when one schema should be the default for the whole client.
- Call `schema(...)` when you need a different PostgREST client for a specific query/RPC flow.

### Is `supabase.functions.invoke(...)` how I write Edge Functions?
- No.
- It is the client-side invocation surface for functions that are already deployed.
- Function authoring, runtime code, and deployment are outside this package’s core API.

### Does this pack cover framework-specific helpers like `@supabase/ssr`?
- No.
- This pack is for `@supabase/supabase-js` itself.
- SSR helpers and framework wrappers should be treated as separate surfaces.

## External Resources

- Supabase JavaScript reference: https://supabase.com/docs/reference/javascript/start
- Supabase JS repository: https://github.com/supabase/supabase-js
- Supabase Auth JS repository: https://github.com/supabase/auth-js
- Supabase Storage JS repository: https://github.com/supabase/storage-js
