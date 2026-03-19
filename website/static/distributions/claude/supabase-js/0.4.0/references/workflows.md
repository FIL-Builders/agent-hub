# Supabase JS Workflows

### Create a client for the right runtime
1. Start with `createClient(url, publishableKey)`.
2. Add `global.fetch` only when the runtime fetch implementation is the compatibility boundary.
3. Add React Native auth storage explicitly when the runtime does not provide the right persistence behavior by default.
4. Use `db.schema` only when one non-public schema is your dominant query surface.

### Authenticate a user and load trustworthy identity
1. Use `supabase.auth.signInWithPassword(...)`, OAuth, or OTP methods for the sign-in flow that matches the app.
2. Use `getSession()` for ordinary client session access.
3. Use `getUser()` when server-side trust or authorization decisions depend on authentic user identity.
4. Subscribe with `onAuthStateChange(...)` using a synchronous callback.

### Query tables or call database functions
1. Use `from(...)` for tables and views in the client’s configured schema.
2. Use `schema(...)` when you need another exposed schema for PostgREST or RPC work.
3. Use `rpc(...)` for exposed Postgres functions rather than trying to call `/rest/v1/rpc/...` manually.
4. Use `QueryData<typeof query>` when you want inferred result types from a built query.

### Upload, share, or fetch files
1. Enter the bucket with `supabase.storage.from('bucket')`.
2. Use `upload(...)` or `update(...)` for writes.
3. Use `getPublicUrl(...)` only for public buckets.
4. Use `createSignedUrl(...)` for temporary access to private files.
5. Use `download(...)` for private content retrieval, especially in server or edge runtimes.

### Subscribe to changes and invoke deployed functions
1. Create a named channel with `supabase.channel(...)`.
2. Clean up with `removeChannel(...)` or `removeAllChannels()`.
3. Use `supabase.functions.invoke(...)` to call deployed Edge Functions.
4. Keep Realtime and Functions mentally separate: one is long-lived subscription transport, the other is request/response execution.
