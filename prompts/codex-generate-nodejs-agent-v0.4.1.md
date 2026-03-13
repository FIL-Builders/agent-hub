==============================================================
AGENTHUB - NODE.JS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/nodejs/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Node.js sources.
==============================================================

### 1 - Target Output

Write:

- `agents/nodejs/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/nodejs-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Node.js sources, including:

- official Node.js v25.8.1 API documentation pages
- official Node.js v25.8.1 release notes and documentation pages
- the Node.js repository at a version-matched tag or commit when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: nodejs`
- `Spec version: 0.4.0`
- `Library version: ^25.8.1`
- `Primary language: javascript`
- `Homepage: https://nodejs.org/api/documentation.html`

Lock the target to Node.js `^25.8.1` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current Node.js target and identify
commonly stale mental models that still leak into real help.

You must identify and avoid stale assumptions, including any assumptions about:

- CommonJS and ESM being interchangeable without loader, resolution, or package
  boundary implications
- browser Web APIs behaving identically to Node.js runtime behavior
- callback, stream, worker, and process semantics being simple wrappers around
  browser or frontend concepts
- older Node.js habits being the preferred current approach when the runtime now
  offers better built-in primitives

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Node.js itself: runtime behavior, modules, streams, filesystem,
process control, workers, test runner, and platform APIs.

You must distinguish:

- Node.js core runtime and standard library behavior
- browser or frontend runtime behavior
- third-party library patterns
- framework behavior layered on top of Node.js

Specific rules:

- do not treat framework conventions as Node.js core behavior
- do not collapse ESM, CommonJS, and package boundary rules into one vague
  module model
- do not blur Web API familiarity with Node.js-specific runtime semantics

If a third-party pattern is useful as context, call it out as a boundary rather
than treating it as Node.js core API.

### 7 - Coverage Expectations

The generated file should cover the current Node.js surface needed for real
project work, including:

- process and runtime behavior
- filesystem and path APIs
- streams and stream composition
- modules, ESM, CommonJS, and `package.json` boundary behavior
- workers and concurrency
- the built-in test runner
- CLI and environment behavior
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official Node.js API documentation and version-matched release/docs pages
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Node.js 25 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- choose between ESM and CommonJS deliberately instead of mixing patterns
- explain stream behavior in terms of backpressure and composition, not just
  event callbacks
- keep process, worker, and event-loop implications explicit for concurrency and
  long-running tasks
- distinguish filesystem/path behavior from URL semantics where relevant
- preserve high-value guidance around the built-in test runner, CLI runtime
  behavior, and modern Node.js standard-library primitives

### 10 - Required Node.js 25 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that browser semantics and Node.js runtime semantics are interchangeable
- that CommonJS and ESM can be mixed without boundary rules
- that third-party test, stream, or worker libraries are part of Node.js core

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   build a CLI or server utility using filesystem, streams, and modern modules
2. troubleshooting:
   debug an ESM/CommonJS boundary problem or a stream/backpressure issue
3. design or tradeoff:
   choose between workers, subprocesses, streams, or plain async flow
4. version-confusion:
   prevent an answer that relies on stale module or runtime assumptions instead
   of current Node.js behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/nodejs/0.4.0.md`
3. fix any reported structural errors
4. confirm Node.js-vs-browser and ESM-vs-CommonJS boundaries are explicit
5. confirm concurrency and stream guidance is explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
