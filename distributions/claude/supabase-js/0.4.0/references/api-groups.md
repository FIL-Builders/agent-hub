# Supabase JS API Groups

### Client Initialization and Shared Types
**Exports**
- createClient
- SupabaseClientOptions
- QueryData
- QueryResult
- QueryError

The entrypoint for configuring one Supabase client and the helper types most
useful in TypeScript-heavy codebases.

#### createClient
**Kind**
function

**Summary**
Create a new Supabase client bound to one project URL, one publishable/anon key,
and optional auth, database, runtime, and header settings.

**Definition**
Language: typescript
Source: `src/index.ts` and `dist/index.d.mts`

```ts
createClient(
  supabaseUrl: string,
  supabaseKey: string,
  options?: SupabaseClientOptions<SchemaName>
): SupabaseClient<Database, SchemaNameOrClientOptions, SchemaName>;
```

**Guidance**
- Use one shared client per runtime context unless you intentionally need different schemas, headers, or auth behavior.
- Pass a publishable or anon key in ordinary app code; do not treat browser clients as a place for service-role secrets.
- Use `global.fetch` when the runtime's fetch implementation is the compatibility boundary, especially in Workers-like environments.
- If you set `accessToken`, you are opting into third-party token supply and giving up the built-in `supabase.auth` namespace on that client.
- Treat custom schemas, React Native storage, and custom headers as targeted configuration choices, not default boilerplate.

**Example**
Language: typescript
Description: Create a browser or server client with custom headers and fetch.

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    global: {
      headers: { 'x-application-name': 'agent-hub-demo' },
      fetch: fetch.bind(globalThis),
    },
  }
);
```

#### SupabaseClientOptions
**Kind**
type

**Summary**
Configuration surface for database schema selection, auth persistence, realtime,
storage, custom fetch, headers, and third-party access token integration.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
type SupabaseClientOptions<SchemaName> = {
  db?: {
    schema?: SchemaName;
    timeout?: number;
    urlLengthLimit?: number;
  };
  auth?: {
    autoRefreshToken?: boolean;
    storageKey?: string;
    persistSession?: boolean;
    detectSessionInUrl?: boolean | ((url: URL, params: Record<string, string>) => boolean);
    storage?: SupabaseAuthClientOptions['storage'];
    userStorage?: SupabaseAuthClientOptions['userStorage'];
    flowType?: SupabaseAuthClientOptions['flowType'];
    debug?: SupabaseAuthClientOptions['debug'];
    lock?: SupabaseAuthClientOptions['lock'];
    throwOnError?: SupabaseAuthClientOptions['throwOnError'];
  };
  realtime?: RealtimeClientOptions;
  storage?: StorageClientOptions;
  global?: {
    fetch?: typeof fetch;
    headers?: Record<string, string>;
  };
  accessToken?: () => Promise<string | null>;
};
```

**Guidance**
- Start with only the options you actually need; do not cargo-cult full option objects into every client.
- Use `db.schema` to set the default PostgREST schema for this client.
- In React Native, explicitly provide auth storage and usually disable `detectSessionInUrl`.
- Use `accessToken` only when Supabase auth is not your session source.
- Prefer `throwOnError` as an intentional auth-layer policy choice rather than a blanket default.

**Example**
Language: typescript
Description: Configure a React Native client with persistent auth storage.

```ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

#### QueryData
**Kind**
type

**Summary**
Infer the non-null `data` shape from a Supabase query promise.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
type QueryData<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;
```

**Guidance**
- Use this when you want inferred query result types without manually duplicating row shapes.
- It is especially useful after composing a query builder with joins or nested selects.
- Keep the originating query expression close to the type alias so the inference remains understandable.

**Example**
Language: typescript
Description: Infer the row shape from a query builder.

```ts
const profilesQuery = supabase.from('profiles').select('id, username');

type Profiles = QueryData<typeof profilesQuery>;
```

#### QueryResult
**Kind**
type

**Summary**
Infer the full resolved response type from a Supabase query promise.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
type QueryResult<T> = T extends PromiseLike<infer U> ? U : never;
```

**Guidance**
- Use this when you need the complete response contract rather than only the `data` field.
- It is useful for helpers that wrap queries and forward the whole Supabase response.

**Example**
Language: typescript
Description: Infer the full response type from a query builder.

```ts
const profilesQuery = supabase.from('profiles').select('id, username');

type ProfilesResponse = QueryResult<typeof profilesQuery>;
```

#### QueryError
**Kind**
type

**Summary**
The PostgREST error type re-exported by `@supabase/supabase-js` for query-layer
failures.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
type QueryError = PostgrestError;
```

**Guidance**
- Use this when typing utilities that handle query failures from `from(...)` or `rpc(...)`.
- Do not treat it as the universal error type for auth, storage, or functions; those surfaces use different error contracts.

**Example**
Language: typescript
Description: Type a helper that formats PostgREST errors.

```ts
function formatQueryError(error: QueryError | null) {
  return error?.message ?? null;
}
```

### Auth and Session Management
**Exports**
- supabase.auth
- supabase.auth.signInWithPassword
- supabase.auth.getSession
- supabase.auth.getUser
- supabase.auth.signOut
- supabase.auth.onAuthStateChange

Built-in auth/session APIs when the client is using Supabase Auth rather than a
custom `accessToken` callback.

#### supabase.auth
**Kind**
object

**Summary**
The built-in Supabase Auth client for sign-in, session, user, and auth-state
operations.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
auth: SupabaseAuthClient;
```

**Guidance**
- This namespace is available only when the client was not configured with the `accessToken` option.
- Use it for session lifecycle, provider login, OTP flows, and auth event subscriptions.
- If you need both Supabase Auth and a separate token-provider client, create two clients instead of trying to mix models on one client.

**Example**
Language: typescript
Description: Read the current session with the built-in auth client.

```ts
const { data, error } = await supabase.auth.getSession();
```

#### supabase.auth.signInWithPassword
**Kind**
function

**Summary**
Sign in an existing user with email+password or phone+password.

**Definition**
Language: typescript
Source: `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`

```ts
signInWithPassword(
  credentials: SignInWithPasswordCredentials
): Promise<AuthTokenResponsePassword>;
```

**Guidance**
- Use this for direct password login flows when email/password or phone/password is the intended auth UX.
- Do not rely on the error details to distinguish “user missing” from “wrong password” or “social login only”; the SDK explicitly warns against that assumption.
- Keep this on the client where user-entered credentials belong; do not proxy it through ad hoc server handlers unless you have a clear reason.

**Example**
Language: typescript
Description: Sign in with email and password.

```ts
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'ada@example.com',
  password: 'correct horse battery staple',
});
```

#### supabase.auth.getSession
**Kind**
function

**Summary**
Return the current session, refreshing it if necessary, using the client’s
attached storage.

**Definition**
Language: typescript
Source: `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`

```ts
getSession(): Promise<{
  data: { session: Session | null };
  error: AuthError | null;
}>;
```

**Guidance**
- Use this for ordinary client-side session access.
- Be careful on server-like environments where storage is cookie-backed or request-scoped; the docs explicitly warn that the returned session may not be authentic enough for authorization decisions.
- If you need verified identity for trusted server logic, use `getUser()` instead.

**Example**
Language: typescript
Description: Read the current access token from the session.

```ts
const { data } = await supabase.auth.getSession();
const accessToken = data.session?.access_token ?? null;
```

#### supabase.auth.getUser
**Kind**
function

**Summary**
Fetch the current authenticated user from the Supabase Auth server.

**Definition**
Language: typescript
Source: `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`

```ts
getUser(jwt?: string): Promise<UserResponse>;
```

**Guidance**
- Use this when authenticity matters more than avoiding a network call.
- This is the safer choice for server-side authorization logic because it validates against the Auth server rather than trusting local storage.
- If you already have a specific JWT to validate, pass it explicitly.

**Example**
Language: typescript
Description: Fetch the authenticated user for trusted server logic.

```ts
const { data, error } = await supabase.auth.getUser();
const user = data.user;
```

#### supabase.auth.signOut
**Kind**
function

**Summary**
Sign out the current user and clear local session state.

**Definition**
Language: typescript
Source: `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`

```ts
signOut(options?: SignOut): Promise<{ error: AuthError | null }>;
```

**Guidance**
- Use this for ordinary client sign-out flows.
- Inside browser contexts it clears local session state and emits `"SIGNED_OUT"` for the normal scope.
- Do not assume this revokes existing access tokens immediately; the docs explicitly call out refresh-token revocation boundaries.

**Example**
Language: typescript
Description: Sign the current user out.

```ts
const { error } = await supabase.auth.signOut();
```

#### supabase.auth.onAuthStateChange
**Kind**
function

**Summary**
Subscribe to auth-state change events such as sign-in, sign-out, and token
refresh.

**Definition**
Language: typescript
Source: `@supabase/auth-js@2.99.1` `GoTrueClient.d.ts`

```ts
onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): {
  data: { subscription: Subscription };
};
```

**Guidance**
- Use this to react to session changes in long-lived client runtimes.
- Prefer a synchronous callback; the auth package explicitly warns that async callbacks can deadlock because they run under an exclusive lock.
- Keep cleanup logic by unsubscribing when your framework/component lifecycle ends.

**Example**
Language: typescript
Description: Track auth-state changes without using an async callback.

```ts
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
  console.log('auth event', event, session?.user.id);
});

subscription.unsubscribe();
```

### Database Queries and RPC
**Exports**
- supabase.from
- supabase.schema
- supabase.rpc

PostgREST-backed table/view querying and Postgres function calls.

#### supabase.from
**Kind**
function

**Summary**
Start a table or view query against the client’s configured PostgREST schema.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
from(relation: string): PostgrestQueryBuilder<ClientOptions, Schema, any>;
```

**Guidance**
- Use this as the main entrypoint for table and view queries.
- Keep the default schema model in mind: `from(...)` works against the client’s configured schema, which defaults to `public`.
- Let PostgREST compose the query with chained filters/selects rather than building URLs manually.

**Example**
Language: typescript
Description: Select rows from a table.

```ts
const { data, error } = await supabase
  .from('profiles')
  .select('id, username')
  .order('username', { ascending: true });
```

#### supabase.schema
**Kind**
function

**Summary**
Return a PostgREST client bound to a different exposed schema for queries and
RPC calls.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
schema(schema: DynamicSchema): PostgrestClient<Database, ClientOptions, DynamicSchema, any>;
```

**Guidance**
- Use this when you need a non-default exposed schema for database or RPC work.
- The returned object is a PostgREST client, not a full Supabase client; do not expect auth, storage, or functions on it.
- Prefer `db.schema` at client creation time when one schema is the dominant context for that client.

**Example**
Language: typescript
Description: Query a table from another exposed schema.

```ts
const adminDb = supabase.schema('admin');
const { data, error } = await adminDb.from('audit_log').select('*');
```

#### supabase.rpc
**Kind**
function

**Summary**
Call an exposed Postgres function through PostgREST, with optional read-only
mode and count behavior for set-returning functions.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
rpc(
  fn: FnName,
  args?: Args,
  options?: {
    head?: boolean;
    get?: boolean;
    count?: 'exact' | 'planned' | 'estimated';
  }
): PostgrestFilterBuilder<ClientOptions, Schema, Row, Result, RelationName, Relationships, 'RPC'>;
```

**Guidance**
- Use RPC for SQL functions you intentionally expose through PostgREST.
- Treat the RPC name and argument contract as database API surface, not as loose dynamic strings.
- Use `get: true` only for read-only semantics where the function is designed for GET access.
- For set-returning functions, the `count` option controls PostgREST count behavior; do not expect it to affect scalar-returning functions.

**Example**
Language: typescript
Description: Call an exposed Postgres function with named args.

```ts
const { data, error } = await supabase.rpc('search_profiles', {
  query_text: 'ada',
});
```

### Storage and File Delivery
**Exports**
- supabase.storage
- supabase.storage.from
- StorageFileApi.upload
- StorageFileApi.createSignedUrl
- StorageFileApi.download
- StorageFileApi.getPublicUrl
- StorageFileApi.list

Bucket and file operations for uploads, downloads, signed sharing, and metadata
listing.

#### supabase.storage
**Kind**
object

**Summary**
The top-level storage client for buckets, files, and related storage APIs.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
storage: SupabaseStorageClient;
```

**Guidance**
- Use this namespace for bucket/file work; then narrow into one bucket with `from(bucket)`.
- The ordinary `supabase-js` guidance centers on file buckets, not the alpha vector or analytics storage APIs.
- Keep public-asset URLs, signed URLs, and private downloads as separate access patterns.

**Example**
Language: typescript
Description: Enter one bucket’s file API.

```ts
const avatars = supabase.storage.from('avatars');
```

#### supabase.storage.from
**Kind**
function

**Summary**
Scope storage file operations to a specific bucket.

**Definition**
Language: typescript
Source: `@supabase/storage-js@2.99.1` `index.d.mts`

```ts
from(id: string): StorageFileApi;
```

**Guidance**
- Use this before upload, download, signed URL, list, move, copy, or delete operations.
- Treat the bucket name as part of your application contract and keep it explicit.
- Prefer storing the returned bucket API in a variable when multiple operations target the same bucket.

**Example**
Language: typescript
Description: Reuse one bucket-scoped storage API.

```ts
const avatars = supabase.storage.from('avatars');
```

#### StorageFileApi.upload
**Kind**
function

**Summary**
Upload a file body to a path in the selected bucket.

**Definition**
Language: typescript
Source: `@supabase/storage-js@2.99.1` `index.d.mts`

```ts
upload(
  path: string,
  fileBody: FileBody,
  fileOptions?: FileOptions
): Promise<{ data: { id: string; path: string; fullPath: string } | null; error: StorageError | null }>;
```

**Guidance**
- Use this for authenticated uploads into an existing bucket.
- `path` is the file path inside the bucket, not a full URL.
- Set `contentType`, `cacheControl`, and `upsert` deliberately; do not leave them ambiguous when file semantics matter.

**Example**
Language: typescript
Description: Upload an avatar image to a bucket.

```ts
const avatarFile = input.files?.[0];

if (avatarFile) {
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .upload(`public/${avatarFile.name}`, avatarFile, {
      cacheControl: '3600',
      upsert: false,
    });
}
```

#### StorageFileApi.createSignedUrl
**Kind**
function

**Summary**
Create a time-limited signed URL for one file in a bucket.

**Definition**
Language: typescript
Source: `@supabase/storage-js@2.99.1` `index.d.mts`

```ts
createSignedUrl(
  path: string,
  expiresIn: number,
  options?: {
    download?: string | boolean;
    transform?: TransformOptions;
  }
): Promise<{ data: { signedUrl: string } | null; error: StorageError | null }>;
```

**Guidance**
- Use this for temporary sharing of private assets.
- Prefer this over `getPublicUrl(...)` when the bucket is private or the asset should expire.
- Keep `expiresIn` explicit in seconds and aligned to the actual sharing requirement.

**Example**
Language: typescript
Description: Create a one-minute signed URL for a private file.

```ts
const { data, error } = await supabase
  .storage
  .from('avatars')
  .createSignedUrl('private/avatar.png', 60);
```

#### StorageFileApi.download
**Kind**
function

**Summary**
Download a file from a private bucket, optionally with transforms or fetch
parameters.

**Definition**
Language: typescript
Source: `@supabase/storage-js@2.99.1` `index.d.mts`

```ts
download(
  path: string,
  options?: { transform?: TransformOptions },
  parameters?: FetchParameters
): BlobDownloadBuilder;
```

**Guidance**
- Use this for private bucket downloads; for public buckets, the docs recommend using the URL from `getPublicUrl(...)`.
- In server or edge runtimes, pass fetch parameters such as `cache: 'no-store'` or `signal` when the request semantics matter.
- Do not treat `download(...)` and `getPublicUrl(...)` as interchangeable.

**Example**
Language: typescript
Description: Download a private file without caching.

```ts
const { data, error } = await supabase
  .storage
  .from('avatars')
  .download('private/avatar.png', {}, { cache: 'no-store' });
```

#### StorageFileApi.getPublicUrl
**Kind**
function

**Summary**
Construct the public URL for a file in a public bucket.

**Definition**
Language: typescript
Source: `@supabase/storage-js@2.99.1` `index.d.mts`

```ts
getPublicUrl(
  path: string,
  options?: {
    download?: string | boolean;
    transform?: TransformOptions;
  }
): {
  data: { publicUrl: string };
};
```

**Guidance**
- Use this only when the bucket is intentionally public.
- This does not verify bucket privacy for you; a generated public URL does not imply the asset is actually retrievable if the bucket is private.
- Prefer this over `download(...)` for public browser-facing asset delivery.

**Example**
Language: typescript
Description: Build a public image URL.

```ts
const {
  data: { publicUrl },
} = supabase.storage.from('public-assets').getPublicUrl('logos/mark.png');
```

#### StorageFileApi.list
**Kind**
function

**Summary**
List files and folders inside a bucket path.

**Definition**
Language: typescript
Source: `@supabase/storage-js@2.99.1` `index.d.mts`

```ts
list(
  path?: string,
  options?: SearchOptions,
  parameters?: FetchParameters
): Promise<{ data: FileObject[] | null; error: StorageError | null }>;
```

**Guidance**
- Use this for directory-like browsing and search inside a bucket path.
- Folder entries differ from file entries; several metadata fields are `null` on folders.
- Keep `limit`, `offset`, and `sortBy` explicit for admin-style UIs and background jobs.

**Example**
Language: typescript
Description: List the first 100 files in a folder.

```ts
const { data, error } = await supabase
  .storage
  .from('avatars')
  .list('public', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });
```

### Realtime Channels and Edge Function Invocation
**Exports**
- supabase.channel
- supabase.getChannels
- supabase.removeChannel
- supabase.removeAllChannels
- supabase.functions
- FunctionsClient.invoke

Long-lived channel subscriptions plus client-side invocation of deployed Edge
Functions.

#### supabase.channel
**Kind**
function

**Summary**
Create a Realtime channel for broadcast, presence, or Postgres changes.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
channel(name: string, opts?: RealtimeChannelOptions): RealtimeChannel;
```

**Guidance**
- Use one channel per logical subscription surface instead of piling unrelated concerns into one unnamed channel.
- Keep cleanup explicit with `removeChannel(...)` or `removeAllChannels()` when the runtime/component ends.
- Realtime requires native `WebSocket` support in browser environments.

**Example**
Language: typescript
Description: Create a channel for Postgres changes.

```ts
const channel = supabase.channel('room-1');
```

#### supabase.getChannels
**Kind**
function

**Summary**
Return the Realtime channels currently attached to the client.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
getChannels(): RealtimeChannel[];
```

**Guidance**
- Use this for diagnostics or cleanup tooling when you suspect channel leakage.
- Do not treat it as the primary application state source for subscription logic.

**Example**
Language: typescript
Description: Inspect active Realtime channels.

```ts
const channels = supabase.getChannels();
```

#### supabase.removeChannel
**Kind**
function

**Summary**
Unsubscribe and remove one Realtime channel from the client.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
removeChannel(channel: RealtimeChannel): Promise<'ok' | 'timed out' | 'error'>;
```

**Guidance**
- Use this when a specific subscription scope is no longer needed.
- Always keep the channel reference if you expect to clean it up later.

**Example**
Language: typescript
Description: Tear down a specific channel.

```ts
await supabase.removeChannel(channel);
```

#### supabase.removeAllChannels
**Kind**
function

**Summary**
Unsubscribe and remove all Realtime channels from the client.

**Definition**
Language: typescript
Source: `dist/index.d.mts`

```ts
removeAllChannels(): Promise<Array<'ok' | 'timed out' | 'error'>>;
```

**Guidance**
- Use this at global teardown boundaries such as app shutdown, test cleanup, or explicit logout flows.
- Prefer `removeChannel(...)` when only one subscription scope is ending.

**Example**
Language: typescript
Description: Remove all active channels at teardown.

```ts
await supabase.removeAllChannels();
```

#### supabase.functions
**Kind**
object

**Summary**
The edge-function invocation client scoped to the project’s `/functions/v1`
endpoint.

**Definition**
Language: typescript
Source: `src/SupabaseClient.ts`

```ts
get functions(): FunctionsClient;
```

**Guidance**
- Use this namespace to call already deployed Edge Functions from app code.
- This is not the function-authoring or deployment API; that belongs to your Edge Function source and deployment tooling.
- The client inherits the Supabase headers and custom fetch configuration.

**Example**
Language: typescript
Description: Access the functions client and invoke a function.

```ts
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Ada' },
});
```

#### FunctionsClient.invoke
**Kind**
function

**Summary**
Invoke a deployed Edge Function by name with optional body and invocation
options.

**Definition**
Language: typescript
Source: `@supabase/functions-js@2.99.1` `FunctionsClient.d.ts`

```ts
invoke<T = any>(
  functionName: string,
  options?: FunctionInvokeOptions
): Promise<FunctionsResponse<T>>;
```

**Guidance**
- Use this when you need server-side logic that runs as a deployed Supabase Edge Function.
- Keep the function name aligned to the deployed route name, not a file path in your local repo.
- Treat typed response parsing as an application-level contract; the SDK does not infer your function response shape automatically.

**Example**
Language: typescript
Description: Invoke an Edge Function and type the JSON response.

```ts
type HelloResponse = { message: string };

const { data, error } = await supabase.functions.invoke<HelloResponse>(
  'hello-world',
  {
    body: { name: 'Ada' },
  }
);
```
