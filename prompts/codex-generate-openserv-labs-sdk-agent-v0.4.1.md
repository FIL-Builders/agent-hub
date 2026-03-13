==============================================================
AGENTHUB - OPENSERV LABS SDK 0.4.1 GENERATION BRIEF
Goal: Generate `agents/openserv-labs-sdk/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/openserv-labs-sdk/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/openserv-labs-sdk/0.3.0.md`
- `parse/openserv-labs-sdk-docs-v0.4.0.md`

Additional authoritative sources:

- `https://www.openserv.ai/`

### 4 - Invariants To Preserve

- `Spec name: openserv-labs/sdk`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: typescript`
- `Homepage: https://www.openserv.ai/`

### 5 - Coverage Expectations

- agent boot and capability registration
- task status and logging
- human-assistance escalation
- integrations

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/openserv-labs-sdk/0.4.0.md`
3. stop only when the validator passes
