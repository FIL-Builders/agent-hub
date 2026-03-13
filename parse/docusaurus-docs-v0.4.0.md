# Docusaurus Documentation Pack

## Snapshot
- Library: docusaurus
- Target version: ^3.9.2
- Generated: 2026-03-12
- Primary package anchor: @docusaurus/core@3.9.2
- Source set: npm:@docusaurus/core@3.9.2 declarations, npm:@docusaurus/theme-common@3.9.2 declarations, npm:@docusaurus/types@3.9.2 declarations, official Docusaurus 3.9.2 docs pages, agents/docusaurus/0.2.0.md for coverage audit only

## Version Delta Audit
- Prior pack target: ^3.0.0
- Current target: ^3.9.2
- This is the same major version, but the old pack mixed together core exports, companion-package exports, and site-local code.
- The largest correction in v0.4 is boundary discipline: `@site/...` imports and swizzled files are not upstream API exports.

## Ecosystem Boundaries
- `@docusaurus/core` owns CLI commands, build/runtime orchestration, and some client export shims.
- `@docusaurus/theme-common` owns theme-oriented hooks such as `useColorMode` and `useWindowSize`.
- `@docusaurus/types` defines config and plugin lifecycle contracts such as `DocusaurusConfig` and `Plugin`.
- `@site/...` imports are project-local aliases, not stable upstream exports.
- Swizzled theme files are maintenance boundaries, not first-class core APIs.

## Source Inventory
- Contract source:
  - `npm:@docusaurus/core@3.9.2:package/lib/index.d.ts`
  - `npm:@docusaurus/core@3.9.2:package/lib/client/exports/*.d.ts`
  - `npm:@docusaurus/core@3.9.2:package/lib/commands/**/*.d.ts`
  - `npm:@docusaurus/theme-common@3.9.2:package/lib/contexts/colorMode.d.ts`
  - `npm:@docusaurus/theme-common@3.9.2:package/lib/hooks/useWindowSize.d.ts`
  - `npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts`
  - `npm:@docusaurus/types@3.9.2:package/src/config.d.ts`
- Guidance source:
  - `https://docusaurus.io/docs/configuration`
  - `https://docusaurus.io/docs/advanced/plugins`
  - `https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis`
  - `https://docusaurus.io/docs/swizzling`
  - `https://docusaurus.io/docs/api/themes/configuration`
- Cross-check only:
  - `agents/docusaurus/0.2.0.md`

## Runtime Hooks And Components
- `useDocusaurusContext()` returns the validated site context and is the right way to read `siteConfig` in runtime components.
- `useBaseUrl(url, options?)` is the safe path helper for links and assets that must respect `baseUrl`.
- `useColorMode()` and `useWindowSize()` are theme-common hooks, not `@docusaurus/core` exports.
- `Link` and `Head` are client-facing Docusaurus component surfaces exposed through Docusaurus packages. They are not interchangeable with plugin lifecycle APIs.

## Core CLI And Build Surface
- `runCLI` is the top-level command runner.
- `build`, `start`, `serve`, `deploy`, and `swizzle` are callable CLI entry points from `@docusaurus/core`.
- Treat CLI commands as operational surfaces, not import-and-render runtime primitives.
- `swizzle` is a customization workflow with maintenance cost and upgrade drift risk.

## Plugin Lifecycle
- `Plugin` in `@docusaurus/types` is the authoritative lifecycle contract.
- `loadContent` is for build-time content loading.
- `contentLoaded` is where routes and serialized data are created.
- `configureWebpack` is for bundler customization, not runtime logic.
- `postBuild` runs after generation and is the right place for output post-processing.
- `getPathsToWatch` narrows hot-reload triggers; broad globs can create noisy rebuilds.

## Config Authoring
- `DocusaurusConfig` is the normalized config type.
- `title`, `url`, and `baseUrl` are foundational fields and should be accurate before debugging routing or deploy issues.
- `plugins`, `presets`, and `themeConfig` are different concerns and should not be conflated.
- `themeConfig` customizes the UI layer; it does not replace plugin lifecycle behavior.

## Decision Rules
- If the task is about page code, prefer runtime hooks and components over plugin lifecycle methods.
- If the task is about content generation or route creation, use plugin lifecycle methods instead of page-level hooks.
- If the task is about global site behavior or deploy routing, inspect `DocusaurusConfig` fields before changing page code.
- If the task proposes `@site/...` as an upstream import surface, treat it as project-local unless the repo explicitly owns it.
- Prefer config or CSS changes before swizzling when the goal is simple theme customization.

## Common Confusions
- `Link` is for internal routing; it is not the same as a raw `<a>` tag when `baseUrl` and client routing matter.
- `useBaseUrl` solves path resolution; it does not mutate config or routing state.
- `themeConfig` is a config field; it is not a theme package API.
- Themes and plugins share lifecycle concepts, but themes primarily provide UI components and aliases after plugin data exists.
- Swizzled components are local copies and should not be documented as stable upstream contracts.

## Failure Modes
- Browser-only code outside an effect or client guard can break SSR or hydration.
- Hard-coded `/`-rooted asset paths can break when `baseUrl` is not `/`.
- Misplaced plugin logic in page components leads to runtime code trying to do build-time work.
- Treating `@site/...` files as upstream API creates portability and upgrade errors.
- Over-broad `getPathsToWatch()` globs can trigger rebuild storms.

## References
- https://docusaurus.io/docs/configuration
- https://docusaurus.io/docs/advanced/plugins
- https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis
- https://docusaurus.io/docs/swizzling
- https://docusaurus.io/docs/api/themes/configuration
- https://github.com/facebook/docusaurus
