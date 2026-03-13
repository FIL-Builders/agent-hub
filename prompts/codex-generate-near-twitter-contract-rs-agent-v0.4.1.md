==============================================================
AGENTHUB - NEAR TWITTER CONTRACT RS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/near-twitter-contract-rs/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/near-twitter-contract-rs/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/near-twitter-contract-rs/0.3.0.md`
- `parse/near-twitter-contract-rs-docs-v0.4.0.md`

Additional authoritative sources:

- `https://github.com/frol/near-twitter-example-rs`

### 4 - Invariants To Preserve

- `Spec name: near/twitter-contract-rs`
- `Spec version: 0.4.0`
- `Library version: current-docs + near-sdk-rs-family`
- `Primary language: rust`
- `Homepage: https://github.com/frol/near-twitter-example-rs`

### 5 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/near-twitter-contract-rs/0.4.0.md`
3. stop only when the validator passes
