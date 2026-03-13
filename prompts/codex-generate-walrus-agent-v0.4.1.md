==============================================================
AGENTHUB - WALRUS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/walrus/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/walrus/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/walrus/0.3.0.md`
- `parse/walrus-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.wal.app/`

### 4 - Invariants To Preserve

- `Spec name: walrus/http-api`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: http`
- `Homepage: https://docs.wal.app/`

### 5 - Coverage Expectations

- blob writes
- blob reads
- live API introspection
- retention and deletable semantics

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/walrus/0.4.0.md`
3. stop only when the validator passes
