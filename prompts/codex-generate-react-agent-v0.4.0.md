==============================================================
AGENTHUB - REACT 0.4.0 GENERATION BRIEF
Goal: Generate `agents/react/0.4.0.md` using the v0.4.0 spec and
      local React source material.
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

Use these local source files as the primary content basis:

- `parse/react.out`
- `agents/react/0.3.0.md`

If available, also use:

- `parse/react-docs-v0.4.0.md`

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: react`
- `Spec version: 0.4.0`
- `Library version: ^18.3.0`
- `Primary language: javascript`
- `Homepage: https://react.dev`

Preserve the broad coverage shape from `agents/react/0.3.0.md` unless the local
source material contradicts it.

### 5 - Coverage Expectations

The generated file should continue to cover the major React public surface areas
already present in `agents/react/0.3.0.md`, including:

- element creation and helpers
- component helpers
- core hooks
- performance and concurrent hooks
- library-wide workflows
- troubleshooting and FAQ where source support is strong

### 6 - Definition Quality

For each documented symbol:

- use `parse/react.out` as the primary source for contracts and signatures
- preserve definitions as closely as possible
- compress only when the compression does not change meaning

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
3. stop only when the validator passes
