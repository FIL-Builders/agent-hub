==============================================================
AGENTHUB - FETCHAI 0.4.1 GENERATION BRIEF
Goal: Generate `agents/fetchai/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/fetchai/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/fetchai/0.3.0.md`
- `parse/fetchai-docs-v0.4.0.md`

### 4 - Invariants To Preserve

- `Spec name: fetchai/agentverse-hosting-api`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: http+json`
- `Homepage: https://agentverse.ai/`

### 5 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/fetchai/0.4.0.md`
3. stop only when the validator passes
