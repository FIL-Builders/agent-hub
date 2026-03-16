# Playwright Documentation Pack

## Target
- Pack: `agents/playwright/0.4.0.md`
- Target date: 2026-03-15
- Package anchor: `@playwright/test@1.58.2`

## Source Inventory
- stable `release-1.58` branch of `microsoft/playwright`
- `packages/playwright-test/package.json`
- `packages/playwright/types/test.d.ts`
- `packages/playwright-core/types/types.d.ts`
- `README.md`
- `docs/src/locators.md`
- `docs/src/actionability.md`
- `docs/src/test-fixtures-js.md`
- `docs/src/test-assertions-js.md`
- `docs/src/trace-viewer-intro-js.md`
- `docs/src/ci-intro.md`
- `docs/src/test-projects-js.md`

## Version Delta Audit
- This is a new Agent Hub `0.4.0` pack, not a port of an older `0.3.0` file.
- Current stable npm dist-tag is `1.58.2`.
- Upstream `main` is already on `1.59.0-next`, so the pack should stay aligned to stable `release-1.58` docs and types instead of drifting onto `next`.
- Stable extraction commit used here: `77f4013536c3d9f49de188a9932cbd68c8f778de`.

## Ecosystem Boundaries

### Playwright Core vs Playwright Test
- The package target here is the Playwright Test runner surface centered on `@playwright/test`.
- Browser automation APIs from `playwright-core` matter when they are exposed through test usage, locator contracts, and device descriptors.
- Keep the pack focused on the JS/TS Playwright Test mental model rather than every cross-language Playwright API.

### Locators vs Element Handles
- Locator-based flows are the preferred runtime surface.
- ElementHandle usage is explicitly discouraged in the official docs for action/assertion-heavy work.

### Fixtures vs Hooks
- Reusable environment setup should prefer fixtures and `test.extend`.
- Hooks are still valid for local grouping, but they are not the preferred reusable abstraction for shared setup/teardown logic.

### Local Debugging vs CI Debugging
- Local debugging often uses UI Mode or `--trace on`.
- CI debugging should rely on retries, trace capture, HTML reports, and uploaded artifacts.

## Decision Rules
- Prefer user-facing locators like `getByRole` before CSS/XPath selectors.
- Prefer web-first async assertions over manual polling or sleep-based checks.
- Use fixtures to encapsulate setup/teardown and keep tests meaning-oriented.
- Use projects for browsers, environments, and dependency-based setup instead of cloning entire test files.
- Capture traces and HTML reports as the default debugging surface for failures, especially on CI.

## Common Confusions
- `page.locator()` and `ElementHandle` are not equivalent design choices; locator flows are the intended resilient path.
- `getByTestId` is a useful explicit contract, but it is not the first choice when accessible role/name is available.
- `force: true` bypasses checks; it does not fix the underlying readiness issue.
- `show-report` and `show-trace` are analysis workflows, not test execution commands.
- Project dependencies are setup sequencing tools, not just a browser matrix feature.

## Failure Modes
- Tests use `waitForTimeout` instead of actionability and web-first assertions.
- Shared login/setup leaks across tests because fixtures or `storageState` are not modeled cleanly.
- CI installs the package but not the Playwright browsers and system dependencies.
- Traces are expected to exist, but retries or `use.trace` were never configured.
- Locators overfit fragile CSS structure instead of user-facing roles, labels, or test IDs.

## Coverage Map

### Test Runner Core
- `test`
- `expect`
- `defineConfig`
- `devices`

### Locators and Assertions
- `page.getByRole`
- `page.getByTestId`
- `locator.filter`
- web-first assertions
- actionability

### Fixtures and Projects
- built-in fixtures
- `test.extend`
- projects
- project dependencies

### Debugging and CI
- `use.trace`
- `show-report`
- `show-trace`
- GitHub Actions workflow

## Must-Not-Regress Insights
- Preserve locator-first and web-first guidance as the core anti-flakiness model.
- Preserve fixture-based setup as the preferred reusable abstraction over ad hoc hooks.
- Preserve tracing plus HTML reports as the main debugging surface for failed tests.
- Preserve CI guidance that explicitly installs browsers and uploads artifacts.
- Preserve the stable-branch lock so the pack does not silently drift onto `next`.
