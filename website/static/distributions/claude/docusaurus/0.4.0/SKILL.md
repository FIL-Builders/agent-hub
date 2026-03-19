---
name: docusaurus
description: Use for Docusaurus tasks. Helps with work on Docusaurus 3 sites and extensions with correct separation between page-runtime APIs, build-time plugin lifecycle APIs, CLI commands, config fields, and project-local customization boundaries such as swizzles and `@site/...` imports.
---

# Docusaurus

Use this skill when the task depends on Docusaurus-specific APIs, workflows, or debugging guidance rather than generic library advice.

## Purpose

This skill teaches an agent to work on Docusaurus 3 sites and extensions with correct separation between page-runtime APIs, build-time plugin lifecycle APIs, CLI commands, config fields, and project-local customization boundaries such as swizzles and `@site/...` imports.

## When to use this skill

- Docusaurus setup and implementation work
- Docusaurus API usage and configuration decisions
- Docusaurus-specific debugging and maintenance
- version-sensitive framework or tool guidance

## Working style

- Keep `@docusaurus/core`, theme-common hooks, type contracts, and site-local code as distinct surfaces in answers.
- Use runtime hooks and components for page behavior, and plugin lifecycle methods for build-time data or route generation.
- Resolve internal paths with Docusaurus helpers instead of hard-coding root-relative assumptions when `baseUrl` matters.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
