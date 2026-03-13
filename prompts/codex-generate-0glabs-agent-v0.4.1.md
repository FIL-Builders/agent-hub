==============================================================
AGENTHUB - 0GLABS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/0glabs/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/0glabs/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/0glabs/0.3.0.md`
- `parse/0glabs-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.0g.ai/`

### 4 - Invariants To Preserve

- `Spec name: 0glabs/0g-serving-broker`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: typescript`
- `Homepage: https://docs.0g.ai/`

### 5 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/0glabs/0.4.0.md`
3. stop only when the validator passes
