# Next.js API Groups

### App Router Navigation And Client Routing
**Exports**
- Link
- useRouter
- usePathname
- useSearchParams
- Route

These are the most common client-facing navigation surfaces in current Next.js.

#### Link
**Kind**
component

**Summary**
Framework navigation component for internal links with Next.js-aware prefetch and routing behavior.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/client/link.d.ts

```ts
type Url = string | UrlObject;

export interface LinkProps<RouteInferType = any> {
  href: Url;
  as?: Url;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean | "auto" | null;
  locale?: string | false;
  legacyBehavior?: boolean;
}

declare const Link: React.ForwardRefExoticComponent<...>;
```

**Guidance**
- Use `Link` for internal navigation instead of raw `<a>` when you want framework routing and prefetch behavior.
- Prefetch semantics differ between App Router and Pages Router, so explain them in router-specific terms.
- Do not rely on `legacyBehavior` for new code; it exists for compatibility.

**Example**
Language: tsx
Description: Navigate to a dashboard page from a Client or Server Component render tree.

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

#### useRouter
**Kind**
hook

**Summary**
Client Component hook for imperative App Router navigation.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/client/components/navigation.d.ts

```ts
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export declare function useRouter(): AppRouterInstance;
```

**Guidance**
- Use this only in Client Components.
- Prefer declarative navigation with `Link` unless you truly need imperative behavior such as post-submit navigation.
- Do not confuse this App Router hook with legacy `next/router` usage from the Pages Router era.

**Example**
Language: tsx
Description: Navigate after a client-side event.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function GoButton() {
  const router = useRouter();
  return (
    <button type="button" onClick={() => router.push("/settings")}>
      Open settings
    </button>
  );
}
```

#### usePathname
**Kind**
hook

**Summary**
Client Component hook that returns the current pathname.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/client/components/navigation.d.ts

```ts
export declare function usePathname(): string;
```

**Guidance**
- Use this in Client Components when UI behavior depends on the current route path.
- Do not use it as a substitute for route params when you need structured dynamic segment data.
- Keep route matching logic narrow; avoid broad pathname string heuristics when route structure is known.

**Example**
Language: tsx
Description: Highlight the active section based on the current pathname.

```tsx
"use client";

import { usePathname } from "next/navigation";

export default function ActivePath() {
  const pathname = usePathname();
  return <p>Current path: {pathname}</p>;
}
```

#### useSearchParams
**Kind**
hook

**Summary**
Client Component hook that exposes read-only URL search parameters.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/client/components/navigation.d.ts

```ts
import { ReadonlyURLSearchParams } from "next/dist/client/components/navigation.react-server";

export declare function useSearchParams(): ReadonlyURLSearchParams;
```

**Guidance**
- Use this only in Client Components.
- Treat the return value as read-only query state derived from the URL.
- If the task needs server-side access to search params, keep that logic in server-side entry points instead of pulling this hook into the server tree.

**Example**
Language: tsx
Description: Read the current filter from the query string.

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function FilterLabel() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") ?? "all";
  return <span>Filter: {filter}</span>;
}
```

#### Route
**Kind**
type

**Summary**
Framework route type used for statically typed link and navigation targets.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/types.d.ts

```ts
export type Route<RouteInferType = any> = string & {};
```

**Guidance**
- Use this when you want type-checked route values in helpers or wrapper components.
- Treat it as compile-time help, not as runtime validation that a route exists.
- Keep build-time route generation in mind; some route typing features depend on Next.js build outputs.

**Example**
Language: tsx
Description: Restrict a custom link wrapper to framework route strings.

```tsx
import Link from "next/link";
import type { Route } from "next";

type NavItemProps = {
  href: Route;
  label: string;
};

export function NavItem({ href, label }: NavItemProps) {
  return <Link href={href}>{label}</Link>;
}
```

### Server Request And Control APIs
**Exports**
- headers
- cookies
- redirect
- notFound

These APIs are server-side request and control-flow primitives.

#### headers
**Kind**
function

**Summary**
Reads incoming request headers in server-side Next.js execution contexts.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/server/request/headers.d.ts

```ts
import { type ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

export declare function headers(): Promise<ReadonlyHeaders>;
```

**Guidance**
- Await this in Server Components, Route Handlers, Server Actions, or Middleware-compatible server code.
- Do not import this into Client Components.
- Use it for request-derived behavior, not as a general-purpose config or environment store.

**Example**
Language: ts
Description: Read a custom request header in a server entry point.

```ts
import { headers } from "next/headers";

export default async function Page() {
  const requestHeaders = await headers();
  const requestId = requestHeaders.get("x-request-id");
  return <pre>{requestId ?? "no request id"}</pre>;
}
```

#### cookies
**Kind**
function

**Summary**
Reads request cookies in server-side Next.js execution contexts.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/server/request/cookies.d.ts

```ts
import { type ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export declare function cookies(): Promise<ReadonlyRequestCookies>;
```

**Guidance**
- Await this in server-side code paths.
- Treat cookie reads as request-scoped behavior; do not try to use this in Client Components.
- Keep auth, personalization, and cache behavior aligned when cookie-dependent rendering is involved.

**Example**
Language: ts
Description: Read a theme cookie on the server.

```ts
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";
  return <div data-theme={theme}>Theme: {theme}</div>;
}
```

#### redirect
**Kind**
function

**Summary**
Aborts the current server-side path and redirects the caller to another URL.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/client/components/redirect.d.ts

```ts
export declare function redirect(url: string, type?: RedirectType): never;
```

**Guidance**
- Use this in Server Components, Route Handlers, or Server Actions when the response should redirect immediately.
- Do not describe this as equivalent to `router.push()`; it is a server-aware control-flow API.
- Remember that it never returns normally.

**Example**
Language: tsx
Description: Redirect unauthenticated users from a server-rendered page.

```tsx
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const user = null;
  if (!user) {
    redirect("/login");
  }
  return <div>Secret area</div>;
}
```

#### notFound
**Kind**
function

**Summary**
Aborts the current render path and renders the not-found boundary.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/client/components/not-found.d.ts

```ts
export declare function notFound(): never;
```

**Guidance**
- Use when the requested resource truly does not exist for the current route.
- Treat this as control flow, not as a value-returning helper.
- Keep it in server-side or route-resolution contexts rather than trying to call it from client event handlers.

**Example**
Language: tsx
Description: Render the 404 boundary when a record lookup fails.

```tsx
import { notFound } from "next/navigation";

export default async function ProductPage() {
  const product = null;
  if (!product) {
    notFound();
  }
  return <div>{product.name}</div>;
}
```

### Caching And Revalidation
**Exports**
- revalidatePath
- revalidateTag
- cacheLife

These primitives control framework cache invalidation and cache profile behavior.

#### revalidatePath
**Kind**
function

**Summary**
Invalidates cached data associated with a specific route path.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/server/web/spec-extension/revalidate.d.ts

```ts
export declare function revalidatePath(
  originalPath: string,
  type?: "layout" | "page",
): undefined;
```

**Guidance**
- Use this after a mutation when path-oriented cache invalidation is the right model.
- Keep path invalidation separate from tag invalidation; choose the one that matches how data is keyed.
- Explain stale-data problems in framework cache terms, not only in React state terms.

**Example**
Language: ts
Description: Revalidate a dashboard page after a mutation.

```ts
import { revalidatePath } from "next/cache";

export async function updateProfile() {
  // write to the database
  revalidatePath("/dashboard");
}
```

#### revalidateTag
**Kind**
function

**Summary**
Invalidates cached data associated with a cache tag.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/server/web/spec-extension/revalidate.d.ts

```ts
export declare function revalidateTag(
  tag: string,
  profile: string | CacheLifeConfig,
): undefined;
```

**Guidance**
- Use tag invalidation when data dependencies are shared across multiple paths.
- Keep your tag model intentional; ad hoc tags make invalidation hard to reason about.
- Prefer tag invalidation over broad path invalidation when the data boundary is domain-specific rather than route-specific.

**Example**
Language: ts
Description: Revalidate all cache entries tagged for a product collection.

```ts
import { revalidateTag } from "next/cache";

export async function publishProduct() {
  // write to the database
  revalidateTag("products", "max");
}
```

#### cacheLife
**Kind**
function

**Summary**
Configures cache timing behavior for `"use cache"` entries.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/cache.d.ts

```ts
export function cacheLife(profile: "default" | "seconds" | "minutes" | "hours" | "days" | "weeks" | "max"): void;
export function cacheLife(profile: string): void;
export function cacheLife(profile: {
  stale?: number;
  revalidate?: number;
  expire?: number;
}): void;
```

**Guidance**
- Use this when the task is specifically about framework cache profiles, not as a generic HTTP caching helper.
- Keep custom profiles aligned with actual data freshness and invalidation strategy.
- If the task is just “why is my page stale?”, start with simpler invalidation explanations before introducing custom cache-life tuning.

**Example**
Language: ts
Description: Apply a named cache profile in a cached server function.

```ts
import { cacheLife } from "next/cache";

export async function getCatalog() {
  "use cache";
  cacheLife("minutes");
  return [{ id: "a", name: "Catalog item" }];
}
```

### Route Handling And Metadata
**Exports**
- NextRequest
- NextResponse
- Metadata
- generateMetadata

These primitives cover route-handler request/response behavior and metadata generation.

#### NextRequest
**Kind**
class

**Summary**
Framework request object used in route handlers and middleware-style server entry points.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/server.d.ts

```ts
export { NextRequest } from "next/dist/server/web/spec-extension/request";
```

**Guidance**
- Use this in Route Handlers and middleware-style code, not in page component props.
- Treat it as a framework request abstraction with runtime implications.
- Keep route-handler logic separate from page rendering logic even when both touch the same domain data.

**Example**
Language: ts
Description: Read query params inside a route handler.

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q");
  return NextResponse.json({ search });
}
```

#### NextResponse
**Kind**
class

**Summary**
Framework response helper for route handlers and middleware-style server responses.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/server.d.ts

```ts
export { NextResponse } from "next/dist/server/web/spec-extension/response";
```

**Guidance**
- Use this in Route Handlers or middleware-style code when you need framework-aware response helpers.
- Do not confuse this with React render output or page component return values.
- Keep JSON, redirect, and header-setting behavior in handler logic rather than page components.

**Example**
Language: ts
Description: Return JSON from a route handler.

```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true });
}
```

#### Metadata
**Kind**
type

**Summary**
TypeScript type for App Router metadata objects.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/types.d.ts

```ts
export type {
  Metadata,
  MetadataRoute,
  ResolvedMetadata,
  ResolvingMetadata,
} from "./lib/metadata/types/metadata-interface";
```

**Guidance**
- Use this when typing static `metadata` exports or the return type of `generateMetadata`.
- Keep metadata generation separate from page rendering or route-handler response logic.
- Do not model arbitrary page props as metadata just because both are page-adjacent concerns.

**Example**
Language: ts
Description: Type a static metadata export for an App Router page.

```ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Account overview",
};
```

#### generateMetadata
**Kind**
other

**Summary**
App Router file-convention function for deriving page metadata dynamically.

**Definition**
Language: typescript
Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

```ts
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params, searchParams }: {
    params: Promise<Record<string, string>>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata>;
```

**Guidance**
- Use this when metadata depends on route params, fetched data, or parent metadata.
- Keep it focused on metadata concerns; do not turn it into a general data-loading substitute for the page component.
- Align the implementation with App Router conventions rather than Pages Router head management patterns.

**Example**
Language: ts
Description: Generate metadata from a dynamic segment.

```ts
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Post: ${slug}`,
  };
}
```

### Pages Router Compatibility
**Exports**
- GetServerSideProps
- GetStaticProps
- GetStaticPaths

These types remain important for existing `pages/` codebases and migrations.

#### GetServerSideProps
**Kind**
type

**Summary**
Pages Router server-side rendering function type.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/types.d.ts

```ts
export type GetServerSideProps<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetServerSidePropsContext<Params, Preview>,
) => Promise<GetServerSidePropsResult<Props>>;
```

**Guidance**
- Use this only in Pages Router files under `pages/`.
- Do not mix it into `app/` answers.
- Reach for it when the task is explicitly about existing Pages Router SSR or migration support.

**Example**
Language: ts
Description: Fetch data per request in a Pages Router page.

```ts
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      now: new Date().toISOString(),
    },
  };
};
```

#### GetStaticProps
**Kind**
type

**Summary**
Pages Router static generation function type.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/types.d.ts

```ts
export type GetStaticProps<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetStaticPropsContext<Params, Preview>,
) => Promise<GetStaticPropsResult<Props>> | GetStaticPropsResult<Props>;
```

**Guidance**
- Use this only for Pages Router static generation.
- Keep revalidation semantics aligned with Pages Router expectations rather than App Router cache APIs.
- If the task is App Router-first, do not drag this in out of habit.

**Example**
Language: ts
Description: Generate static props for a Pages Router page.

```ts
import type { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
    revalidate: 60,
  };
};
```

#### GetStaticPaths
**Kind**
type

**Summary**
Pages Router function type for enumerating dynamic paths during static generation.

**Definition**
Language: typescript
Source: npm:next@16.1.6:package/dist/types.d.ts

```ts
export type GetStaticPaths<
  Params extends ParsedUrlQuery = ParsedUrlQuery,
> = (
  context: GetStaticPathsContext,
) => Promise<GetStaticPathsResult<Params>> | GetStaticPathsResult<Params>;
```

**Guidance**
- Use this with dynamic Pages Router routes when static generation needs known paths.
- Keep it in the Pages Router mental model; App Router uses different file conventions and generation APIs.
- Explain fallback behavior in Pages Router terms when it matters to the task.

**Example**
Language: ts
Description: Pre-generate two blog slugs in a Pages Router route.

```ts
import type { GetStaticPaths } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: "hello" } }, { params: { slug: "world" } }],
    fallback: false,
  };
};
```
