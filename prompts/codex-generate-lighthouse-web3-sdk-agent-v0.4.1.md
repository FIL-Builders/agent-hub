==============================================================
AGENTHUB - LIGHTHOUSE WEB3 SDK 0.4.1 GENERATION BRIEF
Goal: Generate `agents/lighthouse-web3-sdk/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/lighthouse-web3-sdk/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/lighthouse-web3-sdk/0.3.0.md`
- `parse/lighthouse-web3-sdk-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.lighthouse.storage/`
- `npm:@lighthouse-web3/sdk@0.4.4`

### 4 - Invariants To Preserve

- `Spec name: lighthouse-web3/sdk`
- `Spec version: 0.4.0`
- `Library version: @lighthouse-web3/sdk^0.4.4`
- `Primary language: typescript`
- `Homepage: https://docs.lighthouse.storage/`

### 5 - Coverage Expectations

- wallet and auth helpers
- encrypted upload
- uploads listing
- deal status and durability guidance

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/lighthouse-web3-sdk/0.4.0.md`
3. stop only when the validator passes
