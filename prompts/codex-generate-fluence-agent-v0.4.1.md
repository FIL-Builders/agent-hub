==============================================================
AGENTHUB - FLUENCE 0.4.1 GENERATION BRIEF
Goal: Generate `agents/fluence/0.4.0.md` using the
      v0.4.0 spec and current Fluence API docs.
==============================================================

### 1 - Target Output

Write:

- `agents/fluence/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/fluence/0.3.0.md`
- `parse/fluence-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
sources from:

- `https://api.fluence.dev/docs`

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: fluence/api`
- `Spec version: 0.4.0`
- `Library version: current-docs + api-v3`
- `Primary language: http`
- `Homepage: https://api.fluence.dev/docs`

### 5 - Coverage Expectations

The pack should center:

- marketplace discovery
- VM estimate and creation
- VM patch and delete lifecycle
- SSH key management
- price and capacity preflight guidance

### 6 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/fluence/0.4.0.md`
3. stop only when the validator passes
