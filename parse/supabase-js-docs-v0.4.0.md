# Supabase JS Documentation Pack

## Target
- Pack: `agents/supabase-js/0.4.0.md`
- Target date: 2026-03-16
- Package anchor: `@supabase/supabase-js@2.99.1`

## Source Inventory
- stable published `@supabase/supabase-js@2.99.1`
- `README.md`
- `src/index.ts`
- `src/SupabaseClient.ts`
- `dist/index.d.mts`
- stable published `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`
- stable published `@supabase/functions-js@2.99.1` `FunctionsClient.d.ts`
- stable published `@supabase/storage-js@2.99.1` `index.d.mts`

## Version Delta Audit
- This is a new Agent Hub `0.4.0` pack, not a port of an older `0.3.0` file.
- The current stable npm version is `2.99.1`.
- The upstream repo `master` branch continues to move, so the pack should stay anchored to the published package and its shipped type surface.
- Stable repo snapshot inspected during extraction: `b835e3c870f3767980776cc25fd16df72fa416be` from 2026-03-13, but the package contract remains the source of truth.

## Ecosystem Boundaries

### `supabase-js` vs the full Supabase platform
- This pack targets the JavaScript client package `@supabase/supabase-js`.
- Dashboard configuration, SQL migrations, Edge Function authoring, and framework-specific wrappers are adjacent surfaces, not the same API.

### Built-in Supabase Auth vs third-party access-token mode
- If `accessToken` is configured on the client, the `supabase.auth` namespace becomes unavailable.
- The pack must preserve that as a hard boundary, not a subtle caveat.

### Database queries vs Storage vs Realtime vs Edge Functions
- The top-level client unifies those services, but each has a distinct mental model.
- Querying tables/views is PostgREST.
- Realtime is channel subscription transport.
- Storage is bucket/file access.
- Functions is request/response invocation of deployed Edge Functions.

### Runtime support boundaries
- Current `supabase-js` requires Node 20+.
- Browsers need native `fetch`; Realtime also needs native `WebSocket`.
- React Native and Workers need explicit runtime-aware configuration when the defaults are not sufficient.

## Decision Rules
- Prefer the stable published npm surface over repo `master` assumptions.
- Treat `createClient(...)` as the single entrypoint and document options that materially change runtime behavior.
- Preserve the trust distinction between `getSession()` and `getUser()`.
- Preserve the `accessToken` vs `supabase.auth` exclusivity.
- Keep storage guidance explicit about public URLs vs signed URLs vs private downloads.
- Keep Edge Functions coverage focused on `functions.invoke(...)`, not on authoring or deployment.
- Mention alpha storage vectors/analytics only as boundaries, not as the main storage story.

## Common Confusions
- `getSession()` does not guarantee authentic server-trustworthy identity.
- `schema(...)` returns a PostgREST client, not another full Supabase client.
- `getPublicUrl(...)` does not prove the bucket is public.
- `functions.invoke(...)` is not the Edge Function authoring workflow.
- `supabase.auth` is not available when the client uses a custom `accessToken` callback.

## Failure Modes
- Browser code uses service-role style secrets instead of publishable/anon keys.
- Server code trusts `getSession()` results from cookie-backed storage without verifying the user.
- Realtime is debugged at the application level when the runtime lacks native `WebSocket`.
- Public asset URLs are used for private buckets, or signed URLs are generated for obviously public assets without need.
- Async `onAuthStateChange(...)` callbacks create deadlock-like behavior.
- The pack drifts into `@supabase/ssr` or framework-wrapper advice instead of staying on `@supabase/supabase-js`.

## Coverage Map

### Client Initialization
- `createClient`
- `SupabaseClientOptions`
- `QueryData`
- `QueryResult`
- `QueryError`

### Auth and Sessions
- `supabase.auth`
- `signInWithPassword`
- `getSession`
- `getUser`
- `signOut`
- `onAuthStateChange`

### Database and RPC
- `supabase.from`
- `supabase.schema`
- `supabase.rpc`

### Storage
- `supabase.storage`
- `supabase.storage.from`
- `upload`
- `createSignedUrl`
- `download`
- `getPublicUrl`
- `list`

### Realtime and Functions
- `supabase.channel`
- `getChannels`
- `removeChannel`
- `removeAllChannels`
- `supabase.functions`
- `functions.invoke`

## Must-Not-Regress Insights
- Preserve the runtime support guidance, especially Node 20+ and browser WebSocket requirements.
- Preserve the `accessToken` boundary that disables `supabase.auth`.
- Preserve the `getSession()` vs `getUser()` trust distinction.
- Preserve the separation between public URL, signed URL, and private download storage flows.
- Preserve that `supabase-js` is a client SDK, not the entire Supabase platform surface.
