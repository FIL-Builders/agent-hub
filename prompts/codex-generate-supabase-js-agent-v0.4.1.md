==============================================================
AGENTHUB - SUPABASE-JS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/supabase-js/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/supabase-js/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `parse/supabase-js-docs-v0.4.0.md`

Additional authoritative sources:

- stable published `@supabase/supabase-js@2.99.1`
- `README.md`
- `src/index.ts`
- `src/SupabaseClient.ts`
- `dist/index.d.mts`
- stable published `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`
- stable published `@supabase/functions-js@2.99.1` `FunctionsClient.d.ts`
- stable published `@supabase/storage-js@2.99.1` `index.d.mts`

### 4 - Invariants To Preserve

- `Spec name: supabase-js`
- `Spec version: 0.4.0`
- `Library version: @supabase/supabase-js^2.99.1`
- `Primary language: typescript`
- `Homepage: https://supabase.com/docs/reference/javascript/start`

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- there is no prior `agents/supabase-js/0.3.0.md` pack
- current stable npm line is `2.99.1`
- the pack must stay aligned to the published package, not repo `master` drift

You must avoid stale assumptions, including:

- that Node 18 is still supported for current `supabase-js`
- that `getSession()` is the correct trusted-identity primitive for server authorization
- that `accessToken` mode can coexist with ordinary `supabase.auth` usage on one client
- that `functions.invoke(...)` is the Edge Function authoring or deployment workflow
- that `getPublicUrl(...)` is the right answer for private-bucket access

### 6 - Ecosystem Boundary Rules

Keep these boundaries explicit:

- `@supabase/supabase-js` vs dashboard/config/deployment workflows
- built-in Supabase Auth vs third-party `accessToken` mode
- PostgREST queries/RPC vs Storage vs Realtime vs Edge Function invocation
- core `supabase-js` vs framework helpers like `@supabase/ssr`

Specific rules:

- do not flatten the whole Supabase platform into one vague SDK description
- do not imply that framework SSR helpers are part of this package
- do not overfocus on alpha storage vector or analytics APIs
- do not hide the browser/runtime support requirements for Realtime

### 7 - Coverage Expectations

- `createClient`
- `SupabaseClientOptions`
- `QueryData`, `QueryResult`, `QueryError`
- `supabase.auth`
- `signInWithPassword`
- `getSession`
- `getUser`
- `signOut`
- `onAuthStateChange`
- `supabase.from`
- `supabase.schema`
- `supabase.rpc`
- `supabase.storage.from`
- representative storage file operations
- `supabase.channel`
- `getChannels`
- `removeChannel`
- `removeAllChannels`
- `supabase.functions.invoke`

### 8 - Definition Quality

For each documented symbol or feature:

- prefer shipped type definitions over README prose when they disagree
- keep examples aligned to the stable package line
- mark a point `Needs verification` if package-level sources do not settle it

### 9 - Required Supabase Guidance

Make sure the final pack teaches these behaviors clearly:

- initialize clients intentionally for the target runtime
- use `getUser()` when you need authenticated identity you can trust on the server
- treat `schema(...)` as a PostgREST client switch, not a full Supabase client clone
- distinguish public URLs, signed URLs, and private downloads for storage
- treat Realtime cleanup as explicit lifecycle work
- treat `functions.invoke(...)` as deployed-function invocation, not authoring

### 10 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/supabase-js/0.4.0.md`
3. stop only when the validator passes
