==============================================================
AGENTHUB - GOLEM BASE JSON-RPC 0.4.1 GENERATION BRIEF
Goal: Generate `agents/golem-base-json-rpc/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/golem-base-json-rpc/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/golem-base-json-rpc/0.3.0.md`
- `parse/golem-base-json-rpc-docs-v0.4.0.md`

### 4 - Invariants To Preserve

- `Spec name: golem-base/json-rpc`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: json-rpc`
- `Homepage: https://docs.golem-base.org/`

### 5 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/golem-base-json-rpc/0.4.0.md`
3. stop only when the validator passes
