---
name: supabase-js
description: Use for Supabase client setup, auth, database, storage, realtime, and Edge Function tasks. Helps with API usage, runtime boundaries, and debugging.
---

# Supabase JS

Use this skill when the task depends on Supabase client behavior across auth, database, storage, realtime, or Edge Function surfaces.

## Purpose

This pack teaches an agent to use `@supabase/supabase-js` as the isomorphic JavaScript client for Supabase services: initialize the client correctly for the target runtime, use auth/session APIs with the right trust model, query PostgREST tables and RPC functions, manage storage buckets and files, subscribe to Realtime channels, and invoke deployed Edge Functions without confusing client SDK usage with dashboard configuration or server-side authoring workflows.

## When to use this skill

- client initialization and runtime setup
- auth, session, and permission boundaries
- database, storage, and realtime operations
- Edge Function invocation and debugging

## Working style

- Treat `createClient(...)` as the entrypoint; the returned client composes auth, database, storage, functions, and realtime.
- Prefer the stable published npm surface over upstream `master` drift when they diverge.
- Keep auth, database, storage, realtime, and functions mentally separate even though they share one client.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
