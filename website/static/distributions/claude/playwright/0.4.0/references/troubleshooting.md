# Playwright Troubleshooting

### The test is flaky even though the selector looks correct
**Cause**
The test is relying on brittle selectors, manual sleeps, or non-retrying assertions
instead of locator-first interactions and web-first assertions.

**Fix**
Switch to user-facing locators like `getByRole`, `getByLabel`, or `getByTestId`
and use async `expect(...)` assertions that retry until the UI settles.

### `force: true` makes the click pass, but the failure keeps returning
**Cause**
The underlying actionability issue was bypassed instead of understood, so the
test still interacts with an element that is obscured, disabled, unstable, or
not uniquely resolved.

**Fix**
Inspect the trace or action log, tighten the locator, and wait for the actual UI
state that makes the action valid.

### CI says Playwright is installed, but browsers are missing
**Cause**
The npm package was installed, but Playwright browsers and system dependencies
were not installed on the CI runner.

**Fix**
Run `npx playwright install --with-deps` in the CI workflow before running the tests.

### The expected trace is missing
**Cause**
Retries or `use.trace` were never configured, so the failure did not produce a
trace artifact.

**Fix**
Enable CI-aware retries and set `use.trace` to `on-first-retry` or a stricter
mode, then retain the artifacts.
