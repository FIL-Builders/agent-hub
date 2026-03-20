# Docusaurus Overview

## Snapshot

- Spec name: docusaurus
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: ^3.9.2
- Primary language: javascript
- Homepage: https://docusaurus.io/
- Source set: npm:@docusaurus/core@3.9.2 declarations, npm:@docusaurus/theme-common@3.9.2 declarations, npm:@docusaurus/types@3.9.2 declarations, official Docusaurus 3.9.2 docs pages, parse/docusaurus-docs-v0.4.0.md as the intermediate documentation pack, and agents/docusaurus/0.2.0.md for coverage audit only

**Tags**
- docs
- static-site
- react
- tooling
- plugin-system

## Purpose

This pack teaches an agent to work on Docusaurus 3 sites and extensions with correct separation between page-runtime APIs, build-time plugin lifecycle APIs, CLI commands, config fields, and project-local customization boundaries such as swizzles and `@site/...` imports.

## Guiding Principles

- Keep `@docusaurus/core`, theme-common hooks, type contracts, and site-local code as distinct surfaces in answers.
- Use runtime hooks and components for page behavior, and plugin lifecycle methods for build-time data or route generation.
- Resolve internal paths with Docusaurus helpers instead of hard-coding root-relative assumptions when `baseUrl` matters.
- Treat browser-only logic as SSR-sensitive and guard it accordingly.
- Prefer config or theme customization before swizzling when a simple upstream-supported change is available.
- Treat swizzled files and `@site/...` aliases as local project implementation, not stable upstream exports.
- Use CLI commands as operational entry points, not as substitutes for plugin or runtime APIs.

## Boundary Notes

- Primary contract sources: `npm:@docusaurus/core@3.9.2:package/lib/index.d.ts`, `package/lib/client/exports/*.d.ts`, `package/lib/commands/**/*.d.ts`, `npm:@docusaurus/theme-common@3.9.2:package/lib/contexts/colorMode.d.ts`, `package/lib/hooks/useWindowSize.d.ts`, and `npm:@docusaurus/types@3.9.2:package/src/plugin.d.ts` plus `package/src/config.d.ts`.
- Guidance sources: Docusaurus 3.9.2 docs pages for configuration, plugins, lifecycle APIs, swizzling, and theme configuration.
- Coverage is organized by developer mental model: page/runtime work, CLI/build work, plugin lifecycle work, and config authoring.
- The main correction over the old pack is boundary discipline: project-local components such as `@site/...` imports and swizzled files are not documented as upstream Docusaurus exports.
- `agents/docusaurus/0.2.0.md` was used only to avoid regressing helpful coverage, not as the primary contract source.

## FAQ

### Are `@site/...` imports part of Docusaurus itself?
No. They are project-local aliases resolved inside a specific Docusaurus site. They are useful in a given repo, but they are not stable upstream exports and should not be documented as such.

### When should I use a plugin lifecycle hook instead of a React hook?
Use plugin lifecycle hooks for build-time content loading, route creation, bundler changes, and output post-processing. Use React hooks such as `useDocusaurusContext()` or `useColorMode()` for runtime component behavior.

### Should I swizzle to make small UI changes?
Usually no. Prefer config or CSS first. Swizzle when you need component-level control that the supported config surface does not provide.

### Why is `baseUrl` so important?
Because Docusaurus sites are often deployed under a subpath. If `baseUrl` is wrong or ignored, internal links and assets can appear correct in some local setups and fail after deployment.

## External Resources

- Docusaurus Configuration: https://docusaurus.io/docs/configuration
- Docusaurus Plugins Guide: https://docusaurus.io/docs/advanced/plugins
- Docusaurus Plugin Lifecycle APIs: https://docusaurus.io/docs/api/plugin-methods/lifecycle-apis
- Docusaurus Swizzling Guide: https://docusaurus.io/docs/swizzling
- Docusaurus Theme Configuration: https://docusaurus.io/docs/api/themes/configuration
- Docusaurus source: https://github.com/facebook/docusaurus
