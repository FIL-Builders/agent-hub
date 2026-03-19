# Supabase JS Troubleshooting

### `supabase.auth` throws when I touch it
**Cause**
- The client was created with the `accessToken` option.
- The docs explicitly say that when `accessToken` is set, the `auth` namespace cannot be used on that client.

**Fix**
- Create one client for third-party token mode and a separate client for built-in Supabase Auth if you need both behaviors.
- Remove `accessToken` from the client options if Supabase Auth should be the active session model.

### `getSession()` works locally, but I do not trust it on the server
**Cause**
- `getSession()` reads from the attached storage.
- In server-like environments, storage-backed session values may not be authentic enough for trusted authorization decisions.

**Fix**
- Use `getUser()` when you need verified identity from the Auth server.
- Reserve `getSession()` for ordinary client-side session access or non-authoritative UI state.

### Realtime subscriptions do not work in this environment
**Cause**
- The runtime does not provide the primitives Realtime expects, especially native `WebSocket`.
- Browser-like contexts also need native `fetch`.

**Fix**
- Fix the runtime environment or polyfill boundary before debugging the subscription logic itself.
- Re-test channel creation only after confirming the runtime supports the required APIs.

### A file URL exists, but the file still is not accessible
**Cause**
- `getPublicUrl(...)` was used for a bucket that is not actually public.
- The SDK constructs the URL but does not verify bucket privacy for you.

**Fix**
- Use `createSignedUrl(...)` for temporary access to private objects.
- Use `download(...)` when you need authenticated retrieval instead of a shareable URL.

### `onAuthStateChange` causes odd hangs or deadlock-like behavior
**Cause**
- The callback is async or triggers work that contends with the auth client’s exclusive lock.
- The auth package explicitly warns that async callbacks can deadlock.

**Fix**
- Keep the `onAuthStateChange(...)` callback synchronous.
- Hand off async work outside the subscription callback instead of awaiting inside it.
