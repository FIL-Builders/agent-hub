# Playwright Workflows

### Start a New Playwright Test Suite
1. Install `@playwright/test` and Playwright browsers.
2. Create `playwright.config.ts` with shared defaults for retries, traces, and projects.
3. Write tests with `test` plus locator-first interactions and web-first assertions.
4. Prefer role- and label-based locators before falling back to test IDs.

### Build Reusable Page Objects and Auth Setup
1. Start from built-in fixtures like `page` and `request`.
2. Use `test.extend` for reusable page objects, authenticated contexts, or seeded environment setup.
3. Keep fixture setup and teardown co-located instead of duplicating hooks.
4. Use projects or setup dependencies when a setup phase should run before multiple browser projects.

### Debug a Flaky Failure
1. Re-check the locator choice before changing timing.
2. Replace manual sleeps with web-first assertions where possible.
3. Record or open traces with `use.trace`, `show-report`, or `show-trace`.
4. Treat `force: true` as a last resort after understanding why actionability did not pass.

### Run Playwright on CI
1. Install Node dependencies.
2. Install Playwright browsers with `npx playwright install --with-deps`.
3. Run the suite through the configured projects.
4. Upload HTML reports and traces as artifacts so failures are inspectable after the run.
