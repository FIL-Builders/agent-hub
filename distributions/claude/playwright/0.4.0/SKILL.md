---
name: playwright
description: Use for Playwright testing, locator, tracing, and CI tasks. Helps with authoring stable tests, debugging failures, and runner configuration.
---

# Playwright

Use this skill when the task is about Playwright test authoring, locator strategy, tracing, fixtures, or CI execution.

## Purpose

This pack teaches an agent to use Playwright Test at a senior-developer level: write resilient locator-first tests, use fixtures and projects instead of ad hoc shared setup, debug failures with traces and HTML reports, and run Playwright reliably in CI without falling back to brittle sleeps or selector hacks.

## When to use this skill

- stable locator and assertion design
- fixtures, projects, and test runner setup
- trace-based failure debugging
- CI and report configuration

## Working style

- Prefer locator-based flows and web-first assertions over `ElementHandle`-heavy or sleep-based patterns.
- Prefer user-facing locators like `getByRole`, `getByLabel`, and `getByText`; use `getByTestId` as an explicit contract when needed.
- Treat auto-waiting and actionability as the default readiness model for interactions.

## Read next

- For overview and boundaries: `references/overview.md`
- For the core API surface: `references/api-groups.md`
- For common workflows: `references/workflows.md`
- For debugging and fixes: `references/troubleshooting.md`
