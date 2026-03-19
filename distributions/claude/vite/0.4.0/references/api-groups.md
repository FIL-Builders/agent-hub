# Vite API Groups

### Config And Env

**Exports**
- defineConfig
- UserConfig
- loadEnv
- import.meta.env
- mergeConfig

Core config authoring and environment primitives.

#### defineConfig
**Kind**
function

**Summary**
Typed helper for authoring Vite config with better inference and editor support.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function defineConfig(config: UserConfig): UserConfig;
declare function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>;
declare function defineConfig(config: UserConfigFnObject): UserConfigFnObject;
declare function defineConfig(config: UserConfigFnPromise): UserConfigFnPromise;
declare function defineConfig(config: UserConfigFn): UserConfigFn;
declare function defineConfig(config: UserConfigExport): UserConfigExport;
```

**Guidance**
- Use this for nearly all `vite.config.ts` authoring.
- Prefer it over a plain exported object when config needs type safety or conditional logic.
- Do not use it to hide unrelated runtime logic in the config file.

**Example**
Language: typescript
Description: Basic typed Vite config with a framework plugin and alias.

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

#### UserConfig
**Kind**
interface

**Summary**
Top-level Vite configuration shape for root, base, plugins, server, preview, build, and related options.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
interface UserConfig extends DefaultEnvironmentOptions {
  root?: string;
  base?: string;
  publicDir?: string | false;
  cacheDir?: string;
  mode?: string;
  plugins?: PluginOption[];
  server?: ServerOptions;
  preview?: PreviewOptions;
  build?: BuildOptions;
  resolve?: AllResolveOptions;
}
```

**Guidance**
- Keep config focused on build/dev/tooling concerns, not application runtime logic.
- Treat `base`, `resolve.alias`, `server`, `preview`, and `build` as separate problem spaces.
- When config must vary by mode, make the branching explicit instead of mutating shared objects unpredictably.

**Example**
Language: typescript
Description: Configure root, base path, and build output.

```ts
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  base: "/docs/",
  build: {
    outDir: "dist",
  },
});
```

#### loadEnv
**Kind**
function

**Summary**
Load env files for a given mode and directory during config evaluation.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function loadEnv(
  mode: string,
  envDir: string | false,
  prefixes?: string | string[],
): Record<string, string>;
```

**Guidance**
- Use this in config code when config values depend on env files before the app runs.
- Keep `loadEnv(...)` separate from `import.meta.env`; they solve different phases of the pipeline.
- Be explicit about prefixes when you need non-default exposure behavior.

**Example**
Language: typescript
Description: Read a mode-specific API target at config time.

```ts
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["VITE_", "APP_"]);
  return {
    define: {
      __API_ORIGIN__: JSON.stringify(env.APP_API_ORIGIN),
    },
  };
});
```

#### import.meta.env
**Kind**
object

**Summary**
Client-facing environment object exposed by Vite with built-in flags and allowed env variables.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/types/importMeta.d.ts

```ts
interface ImportMetaEnv extends Record<string, any> {
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Guidance**
- Use this in app code, not config code.
- Remember that only allowed prefixes are exposed to client code.
- Do not treat it as a generic dump of all process environment variables.

**Example**
Language: typescript
Description: Branch client behavior on the active Vite mode and flags.

```ts
if (import.meta.env.DEV) {
  console.log("development diagnostics enabled");
}

const apiBase = import.meta.env.VITE_API_BASE_URL;
```

#### mergeConfig
**Kind**
function

**Summary**
Programmatically combine two Vite config objects.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function mergeConfig<
  D extends Record<string, any>,
  O extends Record<string, any>,
>(
  defaults: D extends Function ? never : D,
  overrides: O extends Function ? never : O,
  isRoot?: boolean,
): Record<string, any>;
```

**Guidance**
- Use this when composing reusable config fragments.
- Prefer composition over mutation when several config layers must be combined.
- Keep the merge order explicit because later overrides win.

**Example**
Language: typescript
Description: Combine a shared base config with a command-specific override.

```ts
import { defineConfig, mergeConfig } from "vite";

const base = defineConfig({
  resolve: { alias: { "@": "/src" } },
});

export default defineConfig(({ command }) =>
  mergeConfig(
    base,
    command === "build" ? { build: { sourcemap: true } } : {},
  ),
);
```

### Dev Server And Build

**Exports**
- createServer
- ViteDevServer
- build
- preview

Core runtime surfaces for programmatic dev, production build, and preview flows.

#### createServer
**Kind**
function

**Summary**
Create a Vite dev server programmatically.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function createServer(
  inlineConfig?: InlineConfig | ResolvedConfig,
): Promise<ViteDevServer>;
```

**Guidance**
- Use this for middleware mode, custom dev-server integrations, or advanced tooling flows.
- Keep in mind that a programmatic server still follows Vite dev-server semantics, not build semantics.
- Do not substitute this for `build(...)` or `preview(...)`.

**Example**
Language: typescript
Description: Start a Vite dev server programmatically.

```ts
import { createServer } from "vite";

const server = await createServer({
  server: { port: 5173 },
});

await server.listen();
server.printUrls();
```

#### ViteDevServer
**Kind**
interface

**Summary**
Programmatic handle for the running Vite dev server, its middleware stack, watcher, module graph, and transform pipeline.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
interface ViteDevServer {
  config: ResolvedConfig;
  middlewares: Connect.Server;
  httpServer: HttpServer | null;
  watcher: FSWatcher;
  ws: WebSocketServer;
  moduleGraph: ModuleGraph;
  resolvedUrls: ResolvedServerUrls | null;
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>;
}
```

**Guidance**
- Use this when integrating Vite into a custom server or tool.
- Reach for `middlewares`, `transformRequest`, or `moduleGraph` deliberately; they expose dev-pipeline internals.
- Do not assume `httpServer` exists in middleware mode.

**Example**
Language: typescript
Description: Attach Vite middlewares to a custom HTTP framework.

```ts
import { createServer } from "vite";
import express from "express";

const app = express();
const vite = await createServer({ server: { middlewareMode: true } });

app.use(vite.middlewares);
```

#### build
**Kind**
function

**Summary**
Run a production build programmatically.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function build(
  inlineConfig?: InlineConfig,
): Promise<RolldownOutput | RolldownOutput[] | RolldownWatcher>;
```

**Guidance**
- Use this for production bundling or tooling that needs to trigger Vite builds programmatically.
- Treat build diagnostics separately from dev-server diagnostics.
- Do not assume a green dev server guarantees a green build.

**Example**
Language: typescript
Description: Trigger a production build from a custom script.

```ts
import { build } from "vite";

await build({
  build: {
    sourcemap: true,
  },
});
```

#### preview
**Kind**
function

**Summary**
Start a preview server for already-built output.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function preview(
  inlineConfig?: InlineConfig,
): Promise<PreviewServer>;
```

**Guidance**
- Use this to inspect production build output locally.
- Treat it as a build-output preview, not a substitute for full deployment behavior.
- Do not confuse it with the dev server.

**Example**
Language: typescript
Description: Preview a production build locally.

```ts
import { preview } from "vite";

const server = await preview({
  preview: { port: 4173 },
});
server.printUrls();
```

### Plugin Authoring

**Exports**
- Plugin
- PluginOption

Core Vite plugin authoring surfaces.

#### Plugin
**Kind**
interface

**Summary**
Vite plugin contract, extending the underlying build tool plugin model with Vite-specific app-level and dev-server hooks.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
interface Plugin<A = any> extends Rolldown.Plugin<A> {
  hotUpdate?: ObjectHook<...>;
  resolveId?: ObjectHook<...>;
  load?: ObjectHook<...>;
  transform?: ObjectHook<...>;
}
```

**Guidance**
- Use Vite plugin hooks for build/dev pipeline concerns, not framework runtime logic.
- Keep hook scope narrow and choose hooks based on the exact lifecycle need.
- Be explicit about whether behavior should apply in serve, build, or both.

**Example**
Language: typescript
Description: Add a tiny transform plugin for one file pattern.

```ts
import type { Plugin } from "vite";

function bannerPlugin(): Plugin {
  return {
    name: "banner-plugin",
    transform(code, id) {
      if (!id.endsWith(".txt")) return null;
      return `export default ${JSON.stringify(`banner:${code}`)}`;
    },
  };
}
```

#### PluginOption
**Kind**
type

**Summary**
Accepted plugin entry shape, including individual plugins, arrays, falsy values, and promises.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
type PluginOption = Thenable<
  Plugin | { name: string } | false | null | undefined | PluginOption[]
>;
```

**Guidance**
- Use this when composing plugin arrays that may conditionally include entries.
- Return `false`, `null`, or `undefined` for disabled plugin branches instead of mutating arrays later.
- Keep framework plugins explicit so their behavior is not mistaken for Vite core behavior.

**Example**
Language: typescript
Description: Conditionally include a plugin in the config.

```ts
import { defineConfig, type PluginOption } from "vite";

const plugins: PluginOption[] = [
  process.env.ANALYZE ? { name: "analyze-placeholder" } : false,
];

export default defineConfig({ plugins });
```

### Path And Workspace Utilities

**Exports**
- normalizePath
- searchForWorkspaceRoot

Utilities for filesystem and monorepo-aware Vite behavior.

#### normalizePath
**Kind**
function

**Summary**
Normalize a file path into Vite's forward-slash form.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function normalizePath(id: string): string;
```

**Guidance**
- Use this when plugin or config code compares paths across platforms.
- Normalize before matching or caching path keys if Windows paths may appear.
- Do not use it as a substitute for real path resolution.

**Example**
Language: typescript
Description: Normalize a transformed file path before matching.

```ts
import { normalizePath } from "vite";

const normalized = normalizePath(filePath);
if (normalized.endsWith("/src/main.ts")) {
  // ...
}
```

#### searchForWorkspaceRoot
**Kind**
function

**Summary**
Find the nearest workspace root above a starting directory.

**Definition**
Language: typescript
Source: npm:vite@8.0.0:package/dist/node/index.d.ts

```ts
declare function searchForWorkspaceRoot(
  current: string,
  root?: string,
): string;
```

**Guidance**
- Use this for monorepo-sensitive filesystem or dev-server decisions.
- Keep it separate from alias resolution; it answers a workspace-boundary question.
- Do not assume the project root and workspace root are the same thing.

**Example**
Language: typescript
Description: Expand Vite filesystem access around a monorepo workspace.

```ts
import { defineConfig, searchForWorkspaceRoot } from "vite";

export default defineConfig({
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },
});
```
