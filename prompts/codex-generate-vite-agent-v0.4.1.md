==============================================================
AGENTHUB - VITE 0.4.1 GENERATION BRIEF
Goal: Generate `agents/vite/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Vite sources.
==============================================================

### 1 - Target Output

Write:

- `agents/vite/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/vite-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Vite sources, including:

- `npm:vite@8.0.0` package contents and type declarations
- official Vite guide and API pages
- official Vite plugin and SSR docs
- official release notes and compatibility notes when needed
- the Vite repository at a version-matched tag or commit when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: vite`
- `Spec version: 0.4.0`
- `Library version: ^8.0.0`
- `Primary language: typescript`
- `Homepage: https://vite.dev/guide/`

Lock the target to Vite `^8.0.0` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current Vite target and identify
commonly stale mental models that still leak into real help.

You must identify and avoid stale assumptions, including any assumptions about:

- Vite dev-server behavior being the same thing as production build behavior
- framework plugin behavior being interchangeable with Vite core behavior
- browser env handling, server env handling, and `import.meta.env` semantics
  being one vague concept
- generic bundler advice being sufficient without Vite-specific pipeline and
  plugin semantics

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Vite itself: dev server, build pipeline, config, plugin API,
SSR, env handling, and framework integration boundaries.

You must distinguish:

- Vite core behavior
- framework integration plugins
- Rollup or underlying tooling behavior
- browser runtime behavior
- framework runtime behavior layered above Vite

Specific rules:

- do not treat framework plugins as Vite core exports
- do not collapse Vite and Rollup into one undifferentiated tool model
- do not blur dev-server behavior, SSR behavior, and production output behavior

If another tool or plugin pattern is useful as context, call it out as a
boundary rather than treating it as Vite core API.

### 7 - Coverage Expectations

The generated file should cover the current Vite surface needed for real
project work, including:

- config authoring and resolution
- dev-server behavior
- env handling
- plugin authoring and hook boundaries
- build output and optimization behavior
- SSR support and caveats
- framework integration boundaries
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer version-matched package contents, type declarations, and official docs
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Vite 8 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- distinguish dev-server behavior from build output and production semantics
- explain `import.meta.env` and env exposure rules precisely
- keep plugin authoring and framework integration boundaries explicit
- explain SSR support in Vite terms rather than generic server-rendering terms
- preserve high-value guidance around aliasing, config merge behavior, plugin
  hooks, and common dev/build mismatches

### 10 - Required Vite 8 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that framework-specific behavior is Vite core behavior
- that Rollup or plugin internals are identical to Vite core semantics
- that dev-server behavior guarantees production behavior

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   configure a Vite app with aliases, env usage, and a framework plugin
2. troubleshooting:
   debug a dev-vs-build mismatch, env exposure issue, or plugin ordering problem
3. design or tradeoff:
   choose between config options, plugin hooks, or SSR integration strategies
4. version-confusion:
   prevent an answer that substitutes generic bundler or framework intuition for
   Vite-specific behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/vite/0.4.0.md`
3. fix any reported structural errors
4. confirm Vite-vs-framework and dev-vs-build boundaries are explicit
5. confirm env and SSR semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
