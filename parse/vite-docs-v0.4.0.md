# Vite Documentation Pack

## Snapshot
- Library: vite
- Target version: ^8.0.0
- Generated: 2026-03-12
- Source set: npm:vite@8.0.0 declarations, official guide pages, config reference pages, plugin API docs, SSR docs, env docs, build docs, and release-oriented docs for Vite 8

## Version Delta Audit

Vite 8 still preserves the same high-level mental model as recent Vite releases,
but there are recurring stale assumptions to correct:

- dev-server behavior is not production build behavior
- framework plugin behavior is not Vite core behavior
- SSR support is a Vite pipeline and integration concern, not generic server
  rendering advice
- `import.meta.env` exposure rules are specific and must not be reduced to
  "all process env vars are available everywhere"

## Ecosystem Boundaries

### Core Vite

- config authoring and resolution
- dev server behavior
- build output and preview
- plugin API
- env handling
- SSR integration primitives and caveats
- path and workspace utilities

### First-Party / Adjacent Boundaries

- framework integrations such as Vue, React, Svelte, and others are important,
  but they are plugin-layer behavior, not Vite core exports
- Rollup / Rolldown internals influence build behavior, but Vite guidance should
  stay at the Vite API boundary unless a build issue specifically requires the
  underlying tool model

### Out Of Scope

- framework runtime APIs
- framework router semantics
- unrelated bundler-specific behavior
- deployment platform behavior beyond Vite preview/build expectations

## Public Surface Inventory

### Config And Env

- `defineConfig`
- `UserConfig`
- `loadEnv`
- `mergeConfig`
- `import.meta.env`

### Dev Server And Build

- `createServer`
- `ViteDevServer`
- `build`
- `preview`

### Plugin Authoring

- `Plugin`
- `PluginOption`

### Path And Workspace Utilities

- `normalizePath`
- `searchForWorkspaceRoot`

## Decision Rules

- default to `defineConfig(...)` for authoring config because it preserves
  typing and editor help
- use `loadEnv(...)` only when config logic truly needs raw env values at config
  time; do not confuse that with `import.meta.env` at app runtime
- treat dev-server fixes and build fixes as different problem classes until
  proven otherwise
- use Vite plugin hooks for build/dev pipeline behavior, not for framework
  runtime concerns
- use `mergeConfig(...)` for composition when several config fragments must be
  combined programmatically

## Common Confusions

- `import.meta.env` vs `process.env`
- dev server success vs production build success
- Vite plugin behavior vs framework plugin behavior
- SSR support vs framework-level SSR architecture
- workspace root detection vs alias resolution

## Failure Modes

- env variables not exposed because the configured prefix does not allow them
- alias or path behavior working in one environment but failing in another
- dev-only HMR behavior masking build-time or SSR-time issues
- plugin ordering or hook scope causing transformations to run at the wrong time
- SSR issues caused by assuming browser globals or dev-only module behavior

## Workflow Notes

### App Setup

- use `defineConfig(...)`
- add framework plugins explicitly
- keep aliases in `resolve.alias`
- keep env usage explicit and prefix-safe

### Dev Vs Build Diagnosis

- reproduce both `vite` and `vite build`
- compare env, alias, and plugin behavior across both paths
- use `vite preview` only as a production-output preview, not as a substitute
  for deployment platform semantics

### Plugin Work

- keep plugin scope narrow
- prefer official hook boundaries over ad hoc transforms
- distinguish serve-time behavior from build-time behavior

## References

- https://vite.dev/guide/
- https://vite.dev/config/
- https://vite.dev/config/shared-options
- https://vite.dev/config/server-options
- https://vite.dev/guide/env-and-mode
- https://vite.dev/guide/build
- https://vite.dev/guide/ssr
- https://vite.dev/guide/api-javascript
- https://vite.dev/guide/api-plugin
- npm:vite@8.0.0:package/dist/node/index.d.ts
- npm:vite@8.0.0:package/types/importMeta.d.ts
