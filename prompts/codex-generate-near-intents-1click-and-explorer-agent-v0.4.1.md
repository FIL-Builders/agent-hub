==============================================================
AGENTHUB - NEAR INTENTS 1CLICK AND EXPLORER 0.4.1 GENERATION BRIEF
Goal: Generate `agents/near-intents-1click-and-explorer/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/near-intents-1click-and-explorer/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/near-intents-1click-and-explorer/0.3.0.md`
- `parse/near-intents-1click-and-explorer-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.near-intents.org/`

### 4 - Invariants To Preserve

- `Spec name: near-intents/1click-and-explorer`
- `Spec version: 0.4.0`
- `Library version: current-docs + 1click-v0 + explorer-v0`
- `Primary language: http+json`
- `Homepage: https://docs.near-intents.org/`

### 5 - Coverage Expectations

- token discovery
- quote and status lifecycle
- optional deposit submit step
- explorer transaction pagination

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/near-intents-1click-and-explorer/0.4.0.md`
3. stop only when the validator passes
