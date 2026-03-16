==============================================================
AGENTHUB - PLAYWRIGHT 0.4.1 GENERATION BRIEF
Goal: Generate `agents/playwright/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/playwright/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `parse/playwright-docs-v0.4.0.md`

Additional authoritative sources:

- stable `release-1.58` branch of `microsoft/playwright`
- `packages/playwright-test/package.json`
- `packages/playwright/types/test.d.ts`
- `packages/playwright-core/types/types.d.ts`
- `README.md`
- locator, actionability, fixtures, assertions, tracing, projects, and CI docs

### 4 - Invariants To Preserve

- `Spec name: playwright`
- `Spec version: 0.4.0`
- `Library version: @playwright/test^1.58.2`
- `Primary language: typescript`
- `Homepage: https://playwright.dev`

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- there is no prior `agents/playwright/0.3.0.md` pack
- current stable npm dist-tag is `1.58.2`
- upstream `main` is already `1.59.0-next`, so the pack must stay aligned to stable `release-1.58`

You must avoid stale assumptions, including:

- that CSS/XPath-first selectors are the preferred Playwright style
- that `waitForTimeout` is a good default anti-flakiness tool
- that hooks are the preferred reusable setup abstraction instead of fixtures
- that traces are only for local debugging and not part of normal CI failure analysis

### 6 - Ecosystem Boundary Rules

Keep these boundaries explicit:

- Playwright core vs Playwright Test runner
- locator flows vs discouraged ElementHandle-heavy patterns
- build-time test authoring vs CI/debugging workflows
- stable release docs vs `next` branch drift

Specific rules:

- do not overfit the pack to browser automation primitives while missing the test-runner surface
- do not teach `force: true` as a default fix for flaky tests
- do not collapse projects, retries, and tracing into one vague “config” section

### 7 - Coverage Expectations

- `test`
- `expect`
- `defineConfig`
- `devices`
- `page.getByRole`
- `page.getByTestId`
- `locator.filter`
- built-in fixtures and `test.extend`
- projects and project dependencies
- tracing, HTML reports, trace viewer, and GitHub Actions CI

### 8 - Definition Quality

For each documented symbol or feature:

- prefer stable type definitions and stable docs over README copy when they disagree
- keep locator guidance aligned with official docs that prioritize user-facing locators
- if a point is ambiguous, mark it `Needs verification`

### 9 - Required Playwright Guidance

Make sure the final pack teaches these behaviors clearly:

- prefer locators and web-first assertions over manual waits and brittle selectors
- treat fixtures as the reusable setup/teardown model
- use projects for browsers, environments, and setup dependencies
- use tracing and HTML reports as the primary failure-analysis workflow
- install browsers explicitly on CI

### 10 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/playwright/0.4.0.md`
3. stop only when the validator passes
