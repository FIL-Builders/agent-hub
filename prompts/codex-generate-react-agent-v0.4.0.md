==============================================================
AGENTHUB - REACT 0.4.0 GENERATION BRIEF
Goal: Generate `agents/react/0.4.0.md` using the v0.4.0 spec and
      version-matched React source material.
==============================================================

### 1 - Target Output

Write:

- `agents/react/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/react.out`
- `agents/react/0.3.0.md`

If available, also use:

- `parse/react-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
React 18.3-era sources, including:

- the React source repository at a version-matched tag or commit
- official React documentation pages for the matching version when available
- version-matched type declarations or package contents
- official examples, release notes, or migration notes

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: react`
- `Spec version: 0.4.0`
- `Library version: ^18.3.0`
- `Primary language: javascript`
- `Homepage: https://react.dev`

Lock the target to React `^18.3.0` before extracting contracts.

### 5 - Coverage Expectations

The generated file should continue to cover the major React public surface areas
already present in `agents/react/0.3.0.md`, including:

- element creation and helpers
- component helpers
- core hooks
- performance and concurrent hooks
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/react/0.3.0.md` only to audit coverage so you do not regress useful
surface area. It is not the primary contract source.

### 6 - Definition Quality

For each documented symbol:

- prefer version-matched upstream source code or type declarations for contracts
- use `parse/react.out` only when it matches the locked React `^18.3.0` target
- preserve definitions as closely as possible
- compress only when the compression does not change meaning
- do not copy `Definition` blocks from `agents/react/0.3.0.md` unless the task
  explicitly authorizes that fallback
- if version-matched source material cannot support a symbol cleanly, mark the
  relevant point as `Needs verification`

### 7 - Example Quality

Examples should:

- be minimal
- be import-complete where practical
- reflect modern React usage
- remain consistent with React 18.3-era APIs and guidance

### 8 - Completion Check

Before considering the task complete:

1. run `node scripts/validate-agent-pack-v0.4.0.js agents/react/0.4.0.md`
2. fix any reported structural errors
3. confirm the pack's `Definition` sources are version-matched React 18.3-era
   sources as closely as possible
4. stop only when the validator passes
