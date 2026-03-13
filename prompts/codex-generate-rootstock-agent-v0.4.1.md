==============================================================
AGENTHUB - ROOTSTOCK 0.4.1 GENERATION BRIEF
Goal: Generate `agents/rootstock/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/rootstock/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/rootstock/0.3.0.md`
- `parse/rootstock-docs-v0.4.0.md`

Additional authoritative sources:

- `https://dev.rootstock.io/`

### 4 - Invariants To Preserve

- `Spec name: rootstock/json-rpc-bridge`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: http+json`
- `Homepage: https://dev.rootstock.io/`

### 5 - Coverage Expectations

- JSON-RPC reads and writes
- `minimumGasPrice`
- bridge federation address lookup

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/rootstock/0.4.0.md`
3. stop only when the validator passes
