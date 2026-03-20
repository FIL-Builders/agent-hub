# Docusaurus API Groups

### Runtime Hooks And Components
**Exports**
- useDocusaurusContext
- useBaseUrl
- useColorMode
- useWindowSize
- Link
- Head

These are the page-runtime APIs most often used inside site code.

#### useDocusaurusContext
**Kind**
hook

**Summary**
Reads the active Docusaurus runtime context, including validated site config and metadata.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/client/exports/useDocusaurusContext.d.ts

```ts
import type { DocusaurusContext } from "@docusaurus/types";

export default function useDocusaurusContext(): DocusaurusContext;
```

**Guidance**
- Use this inside page or theme components when you need `siteConfig` or site metadata at runtime.
- Treat `siteConfig` as read-only runtime data.
- Do not use this hook as a substitute for plugin lifecycle work or build-time route generation.

**Example**
Language: jsx
Description: Read the site title and tagline inside a page component.

```jsx
import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function HomeTitle() {
  const {siteConfig} = useDocusaurusContext();
  return <h1>{siteConfig.title} · {siteConfig.tagline}</h1>;
}
```

#### useBaseUrl
**Kind**
hook

**Summary**
Resolves a path against the site URL and configured `baseUrl`.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/client/exports/useBaseUrl.d.ts

```ts
import type { BaseUrlOptions } from "@docusaurus/useBaseUrl";

export default function useBaseUrl(
  url: string,
  options?: BaseUrlOptions,
): string;
```

**Guidance**
- Use for internal asset and route resolution when the site may not be hosted at `/`.
- Prefer this over hard-coded root-relative paths in reusable page components.
- Keep config debugging separate: if all paths are wrong, inspect `baseUrl` and `url` before patching component code.

**Example**
Language: jsx
Description: Resolve an image path and a docs route safely.

```jsx
import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function HeroAssets() {
  const logo = useBaseUrl("/img/logo.svg");
  const docsPath = useBaseUrl("/docs/intro");

  return (
    <>
      <img src={logo} alt="Logo" />
      <a href={docsPath}>Read the docs</a>
    </>
  );
}
```

#### useColorMode
**Kind**
hook

**Summary**
Reads and updates the effective color mode in Docusaurus theme state.

**Definition**
Language: typescript
Source: npm:@docusaurus/theme-common@3.9.2:package/lib/contexts/colorMode.d.ts

```ts
export type ColorMode = "light" | "dark";
export type ColorModeChoice = ColorMode | null;

export declare function useColorMode(): {
  readonly colorMode: ColorMode;
  readonly colorModeChoice: ColorModeChoice;
  readonly setColorMode: (colorMode: ColorModeChoice) => void;
  readonly isDarkTheme: boolean;
  readonly setLightTheme: () => void;
  readonly setDarkTheme: () => void;
};
```

**Guidance**
- This belongs to `@docusaurus/theme-common`, not `@docusaurus/core`.
- Use it in interactive UI components, not in build-time plugin code.
- Prefer event handlers for mode changes; avoid setting theme mode during every render.

**Example**
Language: jsx
Description: Toggle between light and dark theme.

```jsx
import React from "react";
import {useColorMode} from "@docusaurus/theme-common";

export default function ColorModeToggle() {
  const {colorMode, setColorMode} = useColorMode();
  return (
    <button
      type="button"
      onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

#### useWindowSize
**Kind**
hook

**Summary**
Reports coarse responsive state and explicitly includes an SSR sentinel state.

**Definition**
Language: typescript
Source: npm:@docusaurus/theme-common@3.9.2:package/lib/hooks/useWindowSize.d.ts

```ts
export declare function useWindowSize(
  { desktopBreakpoint }?: { desktopBreakpoint?: number },
): "desktop" | "mobile" | "ssr";
```

**Guidance**
- Handle the `"ssr"` case explicitly to avoid hydration drift.
- Use this when render branching must track Docusaurus breakpoints rather than raw width numbers.
- Do not assume browser globals are available just because this hook exists.

**Example**
Language: jsx
Description: Render a placeholder during SSR and switch layouts after hydration.

```jsx
import React from "react";
import {useWindowSize} from "@docusaurus/theme-common";

export default function ResponsiveNavHint() {
  const windowSize = useWindowSize();
  if (windowSize === "ssr") {
    return <div className="nav-hint nav-hint--ssr" />;
  }
  return <div>{windowSize === "desktop" ? "Desktop nav" : "Mobile nav"}</div>;
}
```

#### Link
**Kind**
component

**Summary**
Client-routing link component for internal Docusaurus navigation.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/client/exports/Link.d.ts

```ts
import React from "react";
import type { Props } from "@docusaurus/Link";

declare const Link: React.ForwardRefExoticComponent<
  Omit<Props, "ref"> & React.RefAttributes<HTMLAnchorElement>
>;

export default Link;
```

**Guidance**
- Prefer this for internal navigation instead of raw `<a>` tags.
- Combine with `useBaseUrl` when you need path resolution before rendering.
- Keep external URLs as plain anchors when client-side routing semantics do not apply.

**Example**
Language: jsx
Description: Link to an internal docs page.

```jsx
import React from "react";
import Link from "@docusaurus/Link";

export default function DocsLink() {
  return <Link to="/docs/intro">Docs intro</Link>;
}
```

#### Head
**Kind**
component

**Summary**
Injects document-head tags from Docusaurus page or theme code.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/client/exports/Head.d.ts

```ts
import { type ReactNode } from "react";
import type { Props } from "@docusaurus/Head";

export default function Head(props: Props): ReactNode;
```

**Guidance**
- Use for per-page metadata such as title, description, canonical links, or robots tags.
- Keep head updates stable; avoid noisy per-render mutations.
- This is a runtime component surface, not a plugin lifecycle hook.

**Example**
Language: jsx
Description: Add page metadata in a component.

```jsx
import React from "react";
import Head from "@docusaurus/Head";

export default function DraftPageHead() {
  return (
    <Head>
      <title>Draft Preview</title>
      <meta name="robots" content="noindex" />
    </Head>
  );
}
```

### Core CLI Commands
**Exports**
- runCLI
- build
- start
- serve
- deploy
- swizzle

These are the operational entry points exposed by `@docusaurus/core`.

#### runCLI
**Kind**
function

**Summary**
Runs the Docusaurus command-line program with explicit argv input.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/commands/cli.d.ts

```ts
type CLIArgs = [string, string, ...string[]];

export declare function runCLI(cliArgs: CLIArgs): Promise<void>;
```

**Guidance**
- This is the low-level programmatic CLI entry point behind user-facing commands.
- Prefer named command helpers like `build` or `start` when the task targets one operation.
- Treat this as Node-side operational code, not browser runtime logic.

**Example**
Language: ts
Description: Invoke the CLI programmatically from Node.

```ts
import { runCLI } from "@docusaurus/core";

await runCLI(["node", "docusaurus", "build"]);
```

#### build
**Kind**
function

**Summary**
Builds the static site output for one Docusaurus project.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/commands/build/build.d.ts

```ts
export type BuildCLIOptions = {
  config?: string;
  outDir?: string;
  locale?: [string, ...string[]];
  bundleAnalyzer?: boolean;
  minify?: boolean;
  dev?: boolean;
};

export declare function build(
  siteDirParam?: string,
  cliOptions?: Partial<BuildCLIOptions>,
): Promise<void>;
```

**Guidance**
- Use for production output generation or automation around site builds.
- Keep build-time failures separate from page-runtime failures.
- If routing or asset paths are wrong after build, inspect config fields such as `url` and `baseUrl`.

**Example**
Language: ts
Description: Build the current site to a custom output directory.

```ts
import { build } from "@docusaurus/core";

await build(".", { outDir: "build-preview" });
```

#### start
**Kind**
function

**Summary**
Starts the local Docusaurus development server.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/commands/start/start.d.ts

```ts
export type StartCLIOptions = {
  locale?: string;
  config?: string;
  host?: string;
  port?: number;
  hotOnly?: boolean;
  open?: boolean;
  poll?: boolean | number;
  minify?: boolean;
};

export declare function start(
  siteDirParam?: string,
  cliOptions?: Partial<StartCLIOptions>,
): Promise<void>;
```

**Guidance**
- Use for live development, not for previewing static build output.
- Prefer this when debugging theme, page, or hot-reload behavior.
- If file watching behaves poorly in constrained environments, inspect polling and watch settings rather than changing build-only code.

**Example**
Language: ts
Description: Start the dev server on a custom port.

```ts
import { start } from "@docusaurus/core";

await start(".", { port: 4000, open: false });
```

#### serve
**Kind**
function

**Summary**
Serves a built Docusaurus site, optionally building first.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/commands/serve.d.ts

```ts
export type ServeCLIOptions = {
  config?: string;
  host?: string;
  port?: number;
  dir?: string;
  build?: boolean;
  open?: boolean;
};

export declare function serve(
  siteDirParam?: string,
  cliOptions?: Partial<ServeCLIOptions>,
): Promise<void>;
```

**Guidance**
- Use to preview generated output closer to deployment semantics than `start`.
- Prefer this over `start` when validating built assets, generated routes, or output directories.
- Keep runtime hydration bugs separate from missing build artifacts.

**Example**
Language: ts
Description: Serve an already-built output directory.

```ts
import { serve } from "@docusaurus/core";

await serve(".", { dir: "build", build: false });
```

#### deploy
**Kind**
function

**Summary**
Builds or reuses output and deploys it through the configured deployment target flow.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/commands/deploy.d.ts

```ts
export type DeployCLIOptions = {
  config?: string;
  outDir?: string;
  locale?: [string, ...string[]];
  skipBuild?: boolean;
  targetDir?: string;
};

export declare function deploy(
  siteDirParam?: string,
  cliOptions?: Partial<DeployCLIOptions>,
): Promise<void>;
```

**Guidance**
- Verify `url`, `baseUrl`, and deployment-related config before debugging deploy output.
- Treat deploy problems as configuration and hosting problems first, not page-component problems.
- Use `skipBuild` only when you trust the current output and want to reuse it intentionally.

**Example**
Language: ts
Description: Deploy while reusing an existing build output.

```ts
import { deploy } from "@docusaurus/core";

await deploy(".", { skipBuild: true });
```

#### swizzle
**Kind**
function

**Summary**
Copies or wraps theme components into the local project for advanced customization.

**Definition**
Language: typescript
Source: npm:@docusaurus/core@3.9.2:package/lib/commands/swizzle/index.d.ts

```ts
import type { SwizzleCLIOptions } from "./common";

export declare function swizzle(
  themeNameParam?: string | undefined,
  componentNameParam?: string | undefined,
  siteDirParam?: string,
  optionsParam?: Partial<SwizzleCLIOptions>,
): Promise<void>;
```

**Guidance**
- Swizzle only when config, CSS, or documented extension points are insufficient.
- Treat swizzled files as local maintenance burden with upgrade drift risk.
- Do not document swizzled files as stable upstream exports.

**Example**
Language: bash
Description: Copy a theme component into the local project for customization.

```bash
npx docusaurus swizzle @docusaurus/theme-classic Navbar
```

### Plugin Lifecycle
**Exports**
- Plugin
- loadContent
- contentLoaded
- configureWebpack
- postBuild
- getPathsToWatch

These symbols describe build-time extension points for plugins and themes.

#### Plugin
**Kind**
type

**Summary**
Type contract for Docusaurus plugins and themes, including lifecycle hooks and infrastructure extension points.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts

```ts
export type Plugin<Content = unknown> = {
  name: string;
  loadContent?: () => Promise<Content> | Content;
  contentLoaded?: (args: {
    content: Content;
    actions: PluginContentLoadedActions;
  }) => Promise<void> | void;
  postBuild?: (props: Props & { content: Content }) => Promise<void> | void;
  configureWebpack?: (
    config: WebpackConfiguration,
    isServer: boolean,
    configureWebpackUtils: ConfigureWebpackUtils,
    content: Content,
  ) => ConfigureWebpackResult | void;
  getPathsToWatch?: () => string[];
};
```

**Guidance**
- Use this as the top-level contract when authoring plugins or themes.
- Keep build-time lifecycle logic separate from React page components.
- Remember that themes share lifecycle concepts with plugins but are still a distinct layer focused on UI and aliases.

**Example**
Language: js
Description: Minimal plugin skeleton with a lifecycle method.

```js
export default function myPlugin() {
  return {
    name: "my-plugin",
    async loadContent() {
      return {generatedAt: new Date().toISOString()};
    },
  };
}
```

#### loadContent
**Kind**
function

**Summary**
Loads or generates a plugin's build-time content before route creation.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts

```ts
loadContent?: () => Promise<Content> | Content;
```

**Guidance**
- Put remote fetches, filesystem reads, or content synthesis here.
- Return serializable content that downstream lifecycle hooks can consume.
- Do not move this work into runtime components when the goal is static-site generation.

**Example**
Language: js
Description: Load JSON content during the build.

```js
import fs from "node:fs/promises";

export default function productPlugin() {
  return {
    name: "product-plugin",
    async loadContent() {
      const raw = await fs.readFile("./products.json", "utf8");
      return JSON.parse(raw);
    },
  };
}
```

#### contentLoaded
**Kind**
function

**Summary**
Receives plugin content and actions for route creation, data serialization, and global data registration.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts

```ts
contentLoaded?: (args: {
  content: Content;
  actions: {
    addRoute: (config: RouteConfig) => void;
    createData: (name: string, data: string | object) => Promise<string>;
    setGlobalData: (data: unknown) => void;
  };
}) => Promise<void> | void;
```

**Guidance**
- Use this to turn loaded content into routes and serialized data files.
- Keep data plain and serializable because plugins and themes run in different environments.
- Prefer `createData` and `addRoute` over bespoke output wiring when you need generated pages.

**Example**
Language: js
Description: Create a route from loaded data.

```js
export default function releasePlugin() {
  return {
    name: "release-plugin",
    async loadContent() {
      return [{slug: "3-9", title: "Docusaurus 3.9"}];
    },
    async contentLoaded({content, actions}) {
      const {createData, addRoute} = actions;
      for (const release of content) {
        const dataPath = await createData(
          `${release.slug}.json`,
          JSON.stringify(release),
        );
        addRoute({
          path: `/releases/${release.slug}`,
          component: "@site/src/components/ReleasePage.js",
          modules: {release: dataPath},
        });
      }
    },
  };
}
```

#### configureWebpack
**Kind**
function

**Summary**
Adjusts the build webpack configuration for a plugin or theme.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts

```ts
configureWebpack?: (
  config: WebpackConfiguration,
  isServer: boolean,
  configureWebpackUtils: ConfigureWebpackUtils,
  content: Content,
) => ConfigureWebpackResult | void;
```

**Guidance**
- Use this for bundler customization, not for page-level runtime behavior.
- Respect `isServer` differences instead of assuming browser-only loaders or globals.
- Keep the change as narrow as possible to reduce upgrade risk.

**Example**
Language: js
Description: Add a raw loader rule for text files.

```js
export default function rawTextPlugin() {
  return {
    name: "raw-text-plugin",
    configureWebpack() {
      return {
        mergeStrategy: {"module.rules": "prepend"},
        config: {
          module: {
            rules: [{test: /\.txt$/, type: "asset/source"}],
          },
        },
      };
    },
  };
}
```

#### postBuild
**Kind**
function

**Summary**
Runs after site generation and can inspect output props and generated artifacts.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts

```ts
postBuild?: (
  props: Props & {
    content: Content;
    routesBuildMetadata: { [location: string]: RouteBuildMetadata };
  },
) => Promise<void> | void;
```

**Guidance**
- Use for output post-processing such as feed generation or build artifact inspection.
- Treat this as a build-finalization hook, not a substitute for content generation.
- Keep expensive or fragile work here intentional because it lengthens production builds.

**Example**
Language: js
Description: Write a small JSON manifest after build.

```js
import fs from "node:fs/promises";
import path from "node:path";

export default function manifestPlugin() {
  return {
    name: "manifest-plugin",
    async postBuild({outDir, routes}) {
      await fs.writeFile(
        path.join(outDir, "routes.json"),
        JSON.stringify(routes.map((route) => route.path), null, 2),
      );
    },
  };
}
```

#### getPathsToWatch
**Kind**
function

**Summary**
Declares extra file paths or globs that should trigger rebuilds during development.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts

```ts
getPathsToWatch?: () => string[];
```

**Guidance**
- Keep watch globs narrow to avoid unnecessary rebuild churn.
- Use when plugin inputs live outside the default watched content set.
- Do not watch broad generated-output trees unless you intentionally want rebuild loops.

**Example**
Language: js
Description: Watch a plugin data directory.

```js
export default function watchExtraContentPlugin() {
  return {
    name: "watch-extra-content",
    getPathsToWatch() {
      return ["./content/releases/**/*.md"];
    },
  };
}
```

### Config Authoring
**Exports**
- DocusaurusConfig
- title
- url
- baseUrl
- presets
- plugins
- themeConfig

These fields control site-wide behavior and often explain routing or deploy failures faster than component changes do.

#### DocusaurusConfig
**Kind**
type

**Summary**
Normalized Docusaurus site configuration contract.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
export type DocusaurusConfig = {
  title: string;
  url: string;
  baseUrl: string;
  themeConfig: ThemeConfig;
  plugins: PluginConfig[];
  themes: PluginConfig[];
  presets: PresetConfig[];
};
```

**Guidance**
- Treat this as the authoritative shape for validated site config.
- Debug site-wide routing, deploy, and UI configuration issues here before patching page components.
- Keep unknown project-specific values in `customFields` instead of inventing new top-level keys.

**Example**
Language: js
Description: Minimal typed config skeleton.

```js
/** @type {import("@docusaurus/types").DocusaurusConfig} */
const config = {
  title: "Docs",
  url: "https://example.com",
  baseUrl: "/",
  presets: [],
  themeConfig: {},
};

export default config;
```

#### title
**Kind**
config

**Summary**
Site title used in metadata and browser/tab display.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
title: string;
```

**Guidance**
- Keep this distinct from page-level `<Head>` overrides.
- If a page title looks wrong everywhere, inspect config before patching individual pages.
- Pair with `tagline` when you want richer site branding in the default theme.

**Example**
Language: js
Description: Set the site title in config.

```js
export default {
  title: "AgentHub Docs",
};
```

#### url
**Kind**
config

**Summary**
Top-level website origin used for canonical URLs and deployment behavior.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
url: string;
```

**Guidance**
- Set this to the deployment origin, not an internal dev URL.
- Wrong `url` can break canonical URLs, feeds, and deploy assumptions even when local development looks fine.
- Debug deploy output here before changing page routing code.

**Example**
Language: js
Description: Set the production host.

```js
export default {
  url: "https://docs.example.com",
};
```

#### baseUrl
**Kind**
config

**Summary**
Path prefix under the site origin where the Docusaurus site is served.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
baseUrl: string;
```

**Guidance**
- This always includes leading and trailing slash.
- Wrong `baseUrl` is a common root cause when internal links or assets work locally but break after deployment.
- Use `useBaseUrl` and Docusaurus routing helpers instead of hard-coding assumptions about this field.

**Example**
Language: js
Description: Configure a GitHub Pages-style path prefix.

```js
export default {
  url: "https://example.github.io",
  baseUrl: "/my-project/",
};
```

#### presets
**Kind**
config

**Summary**
Preset list that bundles multiple plugins and themes into one higher-level configuration choice.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
presets: PresetConfig[];
```

**Guidance**
- Use when you want a curated bundle of plugins and themes rather than wiring each one manually.
- Keep preset decisions separate from page code and plugin lifecycle code.
- If the task is about one content feature, confirm whether a preset already owns that behavior before adding a duplicate plugin entry.

**Example**
Language: js
Description: Use the classic preset with docs and blog enabled.

```js
export default {
  presets: [
    [
      "classic",
      {
        docs: true,
        blog: true,
      },
    ],
  ],
};
```

#### plugins
**Kind**
config

**Summary**
Plugin configuration list for additional build-time or content-generation behavior.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
plugins: PluginConfig[];
```

**Guidance**
- Use this for explicit plugin registration, not theme customization.
- Keep plugin config separate from `themeConfig`; they solve different layers of the system.
- When debugging route or generated-content issues, inspect this field before changing runtime components.

**Example**
Language: js
Description: Register a local plugin module.

```js
export default {
  plugins: [require.resolve("./plugins/releases-plugin.js")],
};
```

#### themeConfig
**Kind**
config

**Summary**
Theme-level configuration object for UI concerns such as navbar, footer, and color mode.

**Definition**
Language: typescript
Source: npm:@docusaurus/types@3.9.2:package/src/config.d.ts

```ts
themeConfig: ThemeConfig;
```

**Guidance**
- Use this for supported UI configuration, not for plugin lifecycle logic.
- Prefer this before swizzling when the change is already supported by the active theme.
- Treat theme config as data for the theme layer, not as a general-purpose extension hook.

**Example**
Language: js
Description: Configure navbar links and color mode.

```js
export default {
  themeConfig: {
    navbar: {
      title: "AgentHub",
      items: [{to: "/docs/intro", label: "Docs", position: "left"}],
    },
    colorMode: {
      defaultMode: "dark",
    },
  },
};
```
