# Playwright Overview

## Snapshot

- Spec name: playwright
- Spec version: 0.4.0
- Generated: 2026-03-15
- Library version: @playwright/test^1.58.2
- Primary language: typescript
- Homepage: https://playwright.dev
- Source set: stable `release-1.58` branch of `microsoft/playwright`; `packages/playwright-test/package.json`; `packages/playwright/types/test.d.ts`; `packages/playwright-core/types/types.d.ts`; `README.md`; `docs/src/locators.md`; `docs/src/actionability.md`; `docs/src/test-fixtures-js.md`; `docs/src/test-assertions-js.md`; `docs/src/trace-viewer-intro-js.md`; `docs/src/ci-intro.md`; `docs/src/test-projects-js.md`; and `parse/playwright-docs-v0.4.0.md`

**Tags**
- playwright
- testing
- e2e
- fixtures
- locators
- ci

## Purpose

This pack teaches an agent to use Playwright Test at a senior-developer level:
write resilient locator-first tests, use fixtures and projects instead of ad hoc
shared setup, debug failures with traces and HTML reports, and run Playwright
reliably in CI without falling back to brittle sleeps or selector hacks.

## Guiding Principles

- Prefer locator-based flows and web-first assertions over `ElementHandle`-heavy or sleep-based patterns.
- Prefer user-facing locators like `getByRole`, `getByLabel`, and `getByText`; use `getByTestId` as an explicit contract when needed.
- Treat auto-waiting and actionability as the default readiness model for interactions.
- Use fixtures to encapsulate reusable setup and teardown.
- Use projects for browser matrices, environment variants, and setup dependencies.
- Capture traces and HTML reports as the default debugging surface for failures, especially on CI.
- Treat `force: true` as an escape hatch, not a first-line fix for flakiness.
- Keep the pack aligned to stable `@playwright/test^1.58.2`, not the `next` branch.

## Boundary Notes

- This pack targets the JavaScript and TypeScript Playwright Test runner surface, not every language binding.
- The stable npm line is `1.58.2`, and upstream `main` is already on `1.59.0-next`, so source selection is locked to the stable `release-1.58` branch and stable docs.
- The official docs strongly center locators, actionability, fixtures, assertions, traces, projects, and CI as the main anti-flakiness model; this pack keeps that emphasis instead of trying to document every browser primitive.
- Type definitions in `packages/playwright/types/test.d.ts` and `packages/playwright-core/types/types.d.ts` are used as the authoritative contract source for exported JS/TS symbols.

## FAQ

### Should I use `getByRole` or `getByTestId` first?
Use `getByRole` first when the element has meaningful accessible semantics. Use
`getByTestId` when your app intentionally provides a stable testing contract or
the UI surface is otherwise difficult to express robustly.

### Are fixtures better than hooks?
For reusable environment setup, usually yes. Fixtures encapsulate setup and
teardown together, are on-demand, and compose better across files.

### Is `waitForTimeout` a normal anti-flakiness tool?
No. It is usually a smell. Prefer actionability, locator-based interactions, and
web-first assertions.

### When should I use traces?
Use traces when debugging failures, especially on CI. `on-first-retry` is the
common default because it captures failure context without tracing every passing test.

## External Resources

- Playwright docs: https://playwright.dev/docs/intro
- Playwright API reference: https://playwright.dev/docs/api/class-playwright
- Playwright GitHub repo: https://github.com/microsoft/playwright
- Locator guide: https://playwright.dev/docs/locators
- Assertions guide: https://playwright.dev/docs/test-assertions
- Fixtures guide: https://playwright.dev/docs/test-fixtures
- Trace viewer guide: https://playwright.dev/docs/trace-viewer
- CI guide: https://playwright.dev/docs/ci
