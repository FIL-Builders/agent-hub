# Vite Overview

## Snapshot

- Spec name: vite
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^8.0.0
- Primary language: typescript
- Homepage: https://vite.dev/guide/
- Source set: npm:vite@8.0.0 declarations, official Vite guide pages, config reference pages, plugin API docs, env docs, SSR docs, and parse/vite-docs-v0.4.0.md as the intermediate documentation pack

**Tags**
- vite
- frontend-tooling
- dev-server
- build
- plugins
- env
- ssr
- typescript

## Purpose

This pack teaches an agent to use Vite 8 effectively for config authoring, dev-server behavior, plugin boundaries, env handling, build output, SSR integration, and framework setup without collapsing those concerns into generic bundler or framework advice.

## Guiding Principles

- Distinguish dev-server behavior from production build behavior before diagnosing problems.
- Keep Vite core behavior separate from framework plugin behavior.
- Use `defineConfig(...)` and typed config composition instead of ad hoc untyped objects.
- Treat `import.meta.env` exposure as an explicit security and build-time contract.
- Explain SSR in Vite terms: pipeline, entry strategy, and integration boundary, not generic server-rendering slogans.
- Keep plugin scope narrow and hook choice deliberate.
- Treat alias resolution, workspace roots, and filesystem access as environment-sensitive behavior.

## Boundary Notes

- Primary contract sources: `npm:vite@8.0.0:package/dist/node/index.d.ts` and `npm:vite@8.0.0:package/types/importMeta.d.ts`.
- Guidance sources: official Vite guide pages for getting started, env and mode, build, SSR, plugin API, JavaScript API, shared config options, and server options.
- Coverage is organized by real task shape: config and env, dev server and build, plugin authoring, and workspace/path behavior.
- This is a fresh pack, not a port from an older Vite agent file.
- The strongest boundaries in the pack are Vite core vs framework plugin behavior, dev server vs production build behavior, and `import.meta.env` vs generic environment assumptions.

## FAQ

### Should I use `loadEnv(...)` or `import.meta.env`?

Use `loadEnv(...)` in config-time code. Use `import.meta.env` in application code.

### Is `vite preview` the same as production?

No. It previews built output locally. It is useful, but it is not your deployment platform.

### Is a framework plugin part of Vite core?

No. It may be first-party or ecosystem-standard, but it is still plugin-layer behavior.

## External Resources

- Official guide: https://vite.dev/guide/
- Config reference: https://vite.dev/config/
- Env and mode: https://vite.dev/guide/env-and-mode
- Build guide: https://vite.dev/guide/build
- SSR guide: https://vite.dev/guide/ssr
- Plugin API: https://vite.dev/guide/api-plugin
- JavaScript API: https://vite.dev/guide/api-javascript
