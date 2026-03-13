==============================================================
AGENTHUB - NEXT.JS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/nextjs/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Next.js sources.
==============================================================

### 1 - Target Output

Write:

- `agents/nextjs/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/nextjs-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Next.js sources, including:

- `npm:next@16.1.6` package contents and type declarations
- official Next.js documentation pages
- official Next.js API reference pages
- the Next.js repository at a version-matched tag or commit when needed
- official release, upgrade, caching, or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: nextjs`
- `Spec version: 0.4.0`
- `Library version: ^16.1.6`
- `Primary language: typescript`
- `Homepage: https://nextjs.org/docs`

Lock the target to Next.js `^16.1.6` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current Next.js target and identify
commonly stale mental models that still leak into real code help.

You must identify and avoid stale assumptions, including any assumptions about:

- Pages Router guidance being the default answer when the App Router is more
  appropriate
- React-only SSR knowledge being sufficient without Next.js routing, data, and
  caching semantics
- server components, client components, route handlers, and server actions
  being interchangeable concepts
- old data-fetching APIs or routing conventions being the preferred current
  approach

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Next.js itself: routing models, rendering behavior, data and
caching semantics, configuration, and framework primitives.

You must distinguish:

- App Router primitives and conventions
- Pages Router primitives and conventions
- React core behavior
- platform/runtime behavior in Node.js and Edge environments
- third-party library patterns

Specific rules:

- do not blur App Router and Pages Router into one undifferentiated model
- do not treat plain React guidance as sufficient when a task depends on
  Next.js-specific routing, caching, or runtime behavior
- do not treat third-party data libraries or auth libraries as Next.js core
  surface

If a third-party library pattern is useful as context, call it out as a
boundary rather than treating it as Next.js core API.

### 7 - Coverage Expectations

The generated file should cover the current Next.js surface needed for real
project work, including:

- App Router routing and file conventions
- Pages Router boundaries and when they still matter
- server and client component boundaries
- server actions and route handlers where source support is strong
- rendering, caching, and revalidation behavior
- navigation and routing helpers
- configuration and runtime environment choices
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer version-matched published package declarations, source files, or
  official docs
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Next.js 16 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- choose App Router vs Pages Router deliberately instead of mixing patterns
- keep server and client component boundaries explicit
- explain routing, rendering, and caching in terms of real Next.js behavior,
  not generic React behavior
- distinguish route handlers, server actions, and page/layout components
- call out runtime-sensitive behavior across Node.js and Edge where relevant
- preserve high-value guidance around navigation, data fetching, and invalid
  boundary crossings

### 10 - Required Next.js 16 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that Pages Router patterns are always the preferred default
- that client-only code can run in server-only contexts without qualification
- that React-only advice fully captures Next.js routing, caching, or runtime
  behavior

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   build an App Router page with deliberate server/client boundaries
2. troubleshooting:
   debug a server/client boundary error or a caching / revalidation surprise
3. design or tradeoff:
   choose between App Router and Pages Router or between Node and Edge runtime
4. version-confusion:
   prevent an answer that mixes old Pages Router patterns into an App Router
   task or treats plain React SSR as equivalent to Next.js behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/nextjs/0.4.0.md`
3. fix any reported structural errors
4. confirm App Router vs Pages Router boundaries are explicit
5. confirm server/client and runtime boundaries are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
