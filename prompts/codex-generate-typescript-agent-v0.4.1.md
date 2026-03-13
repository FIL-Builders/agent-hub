==============================================================
AGENTHUB - TYPESCRIPT 0.4.1 GENERATION BRIEF
Goal: Generate `agents/typescript/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched TypeScript sources.
==============================================================

### 1 - Target Output

Write:

- `agents/typescript/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/tsconfig.json`
- `parse/typescript-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
TypeScript 5 sources, including:

- `npm:typescript@5.9.3` package contents and declaration files
- official TypeScript handbook and reference pages
- official TSConfig reference pages
- the TypeScript repository at a version-matched tag or commit when needed
- official release notes and compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: typescript`
- `Spec version: 0.4.0`
- `Library version: ^5.9.3`
- `Primary language: typescript`
- `Homepage: https://www.typescriptlang.org/docs/`

Lock the target to TypeScript `^5.9.3` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the current target and note any current
language or compiler behavior that is commonly confused with older TypeScript
mental models.

You must identify and avoid stale assumptions, including any assumptions about:

- type annotations changing JavaScript runtime behavior
- type-level constraints guaranteeing runtime validation
- old module-resolution or config expectations being the current default
- compiler convenience options being universally safe in every environment

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for TypeScript itself: language semantics, compiler behavior,
module resolution, configuration, and type-system techniques.

You must distinguish:

- TypeScript language and type-system constructs
- compiler and config behavior
- JavaScript runtime behavior
- framework-specific typing patterns from third-party libraries

Specific rules:

- do not treat framework-specific helpers as TypeScript core surface
- do not present type-level guarantees as runtime guarantees
- do not blur `tsconfig` behavior, Node.js runtime behavior, and bundler
  behavior into one undifferentiated model

If a third-party library pattern is useful as context, call it out as a
boundary rather than treating it as TypeScript core API.

### 7 - Coverage Expectations

The generated file should cover the current TypeScript 5 surface needed for
real project work, including:

- core type-system constructs
- generics and inference
- narrowing and control-flow analysis
- utility types and type composition
- module resolution and imports/exports
- compiler configuration and important `tsconfig` options
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 8 - Definition Quality

For each documented symbol or feature:

- prefer version-matched published package declarations, compiler sources, or
  official docs
- use `parse/tsconfig.json` only as a small local anchor for config examples
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required TypeScript 5 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- use generics to model relationships between inputs and outputs, not to add
  complexity without need
- rely on narrowing and discriminated unions instead of widespread assertions
- distinguish type annotations from runtime validation
- explain module resolution and `tsconfig` options in terms of actual compiler
  behavior and environment assumptions
- preserve high-value guidance around inference, strictness options, and common
  debugging patterns for compiler errors

### 10 - Required TypeScript 5 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that TypeScript types enforce runtime validation by themselves
- that bundler-specific behavior is part of TypeScript core behavior
- that framework-specific typing helpers are TypeScript core exports

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   write a generic utility that preserves inference across inputs and outputs
2. troubleshooting:
   debug a union-narrowing failure or a module-resolution / `tsconfig` issue
3. design or tradeoff:
   choose between inference, explicit annotations, assertions, and helper types
4. version-confusion:
   prevent an answer that treats types as runtime checks or confuses compiler
   behavior with runtime or bundler behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/typescript/0.4.0.md`
3. fix any reported structural errors
4. confirm type-system vs runtime boundaries are explicit
5. confirm compiler/config behavior is separated clearly from runtime behavior
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
