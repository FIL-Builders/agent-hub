==============================================================
AGENTHUB - IMPULSEAI 0.4.1 GENERATION BRIEF
Goal: Generate `agents/impulseai/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/impulseai/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/impulseai/0.2.0.md`
- `parse/impulseai-docs-v0.4.0.md`

### 4 - Invariants To Preserve

- `Spec name: impulse-ai/http`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: http`
- `Homepage: https://github.com/impulse-ai`

### 5 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/impulseai/0.4.0.md`
3. stop only when the validator passes
