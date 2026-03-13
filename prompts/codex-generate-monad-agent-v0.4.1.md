==============================================================
AGENTHUB - MONAD 0.4.1 GENERATION BRIEF
Goal: Generate `agents/monad/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/monad/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/monad/0.3.0.md`
- `parse/monad-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.monad.xyz/`

### 4 - Invariants To Preserve

- `Spec name: monad-protocol-docs`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: solidity`
- `Homepage: https://docs.monad.xyz/`

### 5 - Coverage Expectations

- testnet configuration
- system contracts
- parallel execution
- historical-state and finality caveats

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/monad/0.4.0.md`
3. stop only when the validator passes
