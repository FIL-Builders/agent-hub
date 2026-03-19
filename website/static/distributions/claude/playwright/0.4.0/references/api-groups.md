# Playwright API Groups

### Test Runner Core
**Exports**
- test
- expect
- defineConfig
- devices

Core Playwright Test exports for writing tests and configuring the runner.

#### test
**Kind**
object

**Summary**
Primary Playwright Test object that defines tests and provides the built-in
browser, page, and fixture environment.

**Definition**
Language: typescript
Source: `packages/playwright/types/test.d.ts`

```ts
export const test: TestType<
  PlaywrightTestArgs & PlaywrightTestOptions,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;
```

**Guidance**
- Use this as the root authoring surface for tests, hooks, fixture extension, and per-file configuration.
- Keep tests meaning-oriented and let fixtures or projects establish environment differences.
- Avoid manually bootstrapping browser/page lifecycle when `test` already provides the correct isolation model.

**Example**
Language: typescript
Description: Basic Playwright test with the built-in `page` fixture.

```ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});
```

#### expect
**Kind**
object

**Summary**
Assertion surface for generic, async web-first, soft, and polling assertions.

**Definition**
Language: typescript
Source: `packages/playwright/types/test.d.ts`

```ts
export const expect: Expect<{}>;
```

**Guidance**
- Prefer async locator and page assertions for UI state because they auto-retry.
- Use `expect.poll` or `expect.toPass` for retried non-locator checks instead of ad hoc loops.
- Treat `expect.soft` as a deliberate reporting choice, not as a blanket default.

**Example**
Language: typescript
Description: Web-first assertion that waits until the DOM reflects the expected text.

```ts
await expect(page.getByTestId('status')).toHaveText('Submitted');
```

#### defineConfig
**Kind**
function

**Summary**
Type-safe helper for declaring Playwright Test configuration.

**Definition**
Language: typescript
Source: `packages/playwright/types/test.d.ts`

```ts
export function defineConfig(config: PlaywrightTestConfig): PlaywrightTestConfig;
export function defineConfig(config: PlaywrightTestConfig, ...configs: PlaywrightTestConfig[]): PlaywrightTestConfig;
```

**Guidance**
- Centralize shared defaults here instead of scattering timeouts, retries, projects, and `use` values across test files.
- Keep environment-specific or browser-specific behavior inside `projects`.
- Use the config to codify the team’s debugging posture, including traces and reporter output.

**Example**
Language: typescript
Description: Minimal config with CI-aware retries and tracing.

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
});
```

#### devices
**Kind**
object

**Summary**
Registry of desktop and mobile browser/device presets for project configuration.

**Definition**
Language: typescript
Source: `packages/playwright-core/types/types.d.ts`

```ts
export const devices: Devices;
```

**Guidance**
- Use this to configure browser and mobile presets in `projects` instead of hand-building device emulation objects when an official preset exists.
- Prefer named device presets for readability and consistency across suites.
- Treat device presets as browser-context defaults, not as a replacement for app-specific test data or auth setup.

**Example**
Language: typescript
Description: Use an official device preset in a project definition.

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

### Locators and Web-First Assertions
**Exports**
- page.getByRole
- page.getByTestId
- locator.filter
- web-first assertions

The core anti-flakiness surface: user-facing locators plus auto-retrying
assertions.

#### page.getByRole
**Kind**
function

**Summary**
Create a locator by ARIA role and optional accessible-name and state filters.

**Definition**
Language: typescript
Source: `packages/playwright-core/types/types.d.ts`

```ts
getByRole(
  role: string,
  options?: {
    name?: string | RegExp;
    exact?: boolean;
    checked?: boolean;
    disabled?: boolean;
    expanded?: boolean;
    includeHidden?: boolean;
    level?: number;
    pressed?: boolean;
    selected?: boolean;
  }
): Locator;
```

**Guidance**
- Prefer this when the element has a meaningful user-facing role and name.
- Usually pass the accessible name so the locator stays specific and readable.
- This is the preferred first-choice locator for most interactive UI testing.

**Example**
Language: typescript
Description: Click the submit button by role and accessible name.

```ts
await page.getByRole('button', { name: /submit/i }).click();
```

#### page.getByTestId
**Kind**
function

**Summary**
Create a locator from the configured test-id attribute.

**Definition**
Language: typescript
Source: `packages/playwright-core/types/types.d.ts`

```ts
getByTestId(testId: string | RegExp): Locator;
```

**Guidance**
- Use this when your app intentionally provides a stable testing contract.
- Prefer role/name locators first when the UI already exposes good accessible semantics.
- If you customize the test-id attribute, do it centrally in config instead of mixing attributes across files.

**Example**
Language: typescript
Description: Locate a status node by explicit testing contract.

```ts
await expect(page.getByTestId('status')).toHaveText('Submitted');
```

#### locator.filter
**Kind**
function

**Summary**
Narrow an existing locator by nested locators or text conditions.

**Definition**
Language: typescript
Source: `packages/playwright-core/types/types.d.ts`

```ts
filter(options?: {
  has?: Locator;
  hasNot?: Locator;
  hasText?: string | RegExp;
  hasNotText?: string | RegExp;
}): Locator;
```

**Guidance**
- Use this when a base locator is right structurally but still too broad.
- Prefer filtering relative to a strong base locator instead of building fragile long CSS selectors.
- Keep inner locators frame-relative and in the same frame as the outer locator.

**Example**
Language: typescript
Description: Narrow rows to the one that contains both text and a nested button.

```ts
const row = page
  .locator('tr')
  .filter({ hasText: 'Ada Lovelace' })
  .filter({ has: page.getByRole('button', { name: 'Edit' }) });
```

#### web-first assertions
**Kind**
workflow

**Summary**
Auto-retrying async assertions that wait for dynamic UI state instead of reading
the page once and guessing timing manually.

**Definition**
Language: markdown
Source: `docs/src/test-assertions-js.md` and `docs/src/actionability.md`

```md
await expect(locator).toBeVisible();
await expect(locator).toHaveText('Submitted');
await expect(page).toHaveURL(/dashboard/);
```

**Guidance**
- Prefer these over manual `waitForTimeout`, repeated `isVisible` loops, or brittle “sleep then assert” patterns.
- They work best when paired with strong locators.
- The default assertion timeout is 5 seconds unless changed in config.

**Example**
Language: typescript
Description: Wait for a status change without manual polling.

```ts
await expect(page.getByRole('status')).toHaveText('Saved');
```

### Fixtures and Project Configuration
**Exports**
- built-in fixtures
- test.extend
- projects
- project dependencies

Reusable environment modeling for browsers, auth, page objects, and CI/browser
matrices.

#### built-in fixtures
**Kind**
workflow

**Summary**
The built-in test-time environment objects Playwright injects, such as `page`,
`context`, `browser`, `browserName`, and `request`.

**Definition**
Language: markdown
Source: `docs/src/test-fixtures-js.md`

```md
Most common built-in fixtures:
- page
- context
- browser
- browserName
- request
```

**Guidance**
- Treat `page` as isolated per test and `browser` as shared for efficiency.
- Use fixtures to give tests exactly what they need and nothing else.
- Reach for custom fixtures before copy-pasting `beforeEach` setup across many files.

**Example**
Language: typescript
Description: Use the built-in `request` and `page` fixtures in one test.

```ts
test('healthcheck and UI', async ({ request, page }) => {
  const response = await request.get('/health');
  await expect(response).toBeOK();
  await page.goto('/');
});
```

#### test.extend
**Kind**
function

**Summary**
Extend the base `test` object with custom fixtures and test options.

**Definition**
Language: typescript
Source: `packages/playwright/types/test.d.ts`

```ts
extend<T extends {}, W extends {} = {}>(
  fixtures: Fixtures<T, W, TestArgs, WorkerArgs>
): TestType<TestArgs & T, WorkerArgs & W>;
```

**Guidance**
- Use this for reusable page objects, authenticated contexts, seeded data, or test options.
- Prefer fixtures over matching `beforeEach`/`afterEach` hooks scattered across many files.
- Keep fixture scope intentional so setup does not leak state between unrelated tests.

**Example**
Language: typescript
Description: Extend the base test with a reusable page-object fixture.

```ts
import { test as base } from '@playwright/test';

export const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});
```

#### projects
**Kind**
config

**Summary**
Logical groups of tests that run with different browser, device, environment, or
retry settings.

**Definition**
Language: typescript
Source: `docs/src/test-projects-js.md`

```ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

**Guidance**
- Use projects for browsers, environments, or focused subsets like smoke tests.
- Keep shared defaults at the top-level config and project-specific overrides inside each project.
- Use `--project` when debugging one configuration instead of disabling the rest in source.

**Example**
Language: bash
Description: Run a single configured project.

```bash
npx playwright test --project=firefox
```

#### project dependencies
**Kind**
config

**Summary**
Project-level setup sequencing where one project must complete before dependent
projects run.

**Definition**
Language: typescript
Source: `docs/src/test-projects-js.md`

```ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: '**/*.setup.ts' },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
});
```

**Guidance**
- Use this when browser projects depend on setup tests that should also produce traces and reporter output.
- Prefer project dependencies over bespoke global shell scripts when the setup itself is meaningfully test-like.
- If a dependency fails, dependents will not run; model your setup project accordingly.

**Example**
Language: text
Description: Use a setup project to establish shared auth or data before browser projects run.

```text
Create a setup project, then list it in each dependent project's dependencies array.
```

### Tracing, Reports, and CI
**Exports**
- use.trace
- npx playwright show-report
- npx playwright show-trace
- GitHub Actions workflow

Operational debugging and CI delivery surface for Playwright suites.

#### use.trace
**Kind**
config

**Summary**
Per-test tracing configuration, commonly enabled on the first retry in CI.

**Definition**
Language: typescript
Source: `docs/src/trace-viewer-intro-js.md`

```ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
});
```

**Guidance**
- `on-first-retry` is the documented default posture because it captures failures without tracing every passing test.
- Use `--trace on` locally when you need traces immediately outside UI Mode.
- Make sure retries and trace settings align, or you may expect traces that were never recorded.

**Example**
Language: bash
Description: Force tracing locally for a run.

```bash
npx playwright test --trace on
```

#### npx playwright show-report
**Kind**
workflow

**Summary**
Open the HTML report for the most recent test run.

**Definition**
Language: bash
Source: `docs/src/trace-viewer-intro-js.md`

```bash
npx playwright show-report
```

**Guidance**
- Use this first when a run failed and you need a structured view of failing tests, steps, and traces.
- The HTML report is also the main entry point to opening trace artifacts from a failed test.
- Keep the report artifact on CI when remote debugging matters.

**Example**
Language: bash
Description: Open the HTML report after a failed local run.

```bash
npx playwright show-report
```

#### npx playwright show-trace
**Kind**
workflow

**Summary**
Open Trace Viewer directly against a trace artifact or an empty viewer session.

**Definition**
Language: bash
Source: `docs/src/test-cli-js.md` and `docs/src/trace-viewer-intro-js.md`

```bash
npx playwright show-trace
npx playwright show-trace trace.zip
```

**Guidance**
- Use this when you already know which trace artifact you want to inspect.
- Prefer this for deep step-by-step debugging of one failure rather than scanning the entire HTML report.
- Pair it with `use.trace` and CI artifact retention so the trace actually exists when you need it.

**Example**
Language: bash
Description: Inspect a single trace artifact.

```bash
npx playwright show-trace trace.zip
```

#### GitHub Actions workflow
**Kind**
workflow

**Summary**
Reference CI workflow for running Playwright on GitHub Actions with browser
installation and report artifact upload.

**Definition**
Language: yaml
Source: `docs/src/ci-intro.md`

```yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
    - run: npm ci
    - run: npx playwright install --with-deps
    - run: npx playwright test
```

**Guidance**
- Install Playwright browsers explicitly on CI; installing the npm package alone is not enough.
- Upload the HTML report or trace artifacts so failures are debuggable from the CI UI.
- Keep retries, tracing, and artifact retention aligned with how your team debugs flakes.

**Example**
Language: text
Description: Minimal CI checklist.

```text
checkout repo -> install node deps -> install playwright browsers with deps -> run tests -> upload report artifacts
```
