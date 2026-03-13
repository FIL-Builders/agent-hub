==============================================================
AGENTHUB - UNISWAPX 0.4.1 GENERATION BRIEF
Goal: Generate `agents/uniswapx/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/uniswapx/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/uniswapx/0.3.0.md`
- `parse/uniswapx-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.uniswap.org/contracts/uniswapx/overview`

### 4 - Invariants To Preserve

- `Spec name: uniswapx/integrator-apis`
- `Spec version: 0.4.0`
- `Library version: current-docs`
- `Primary language: http+solidity`
- `Homepage: https://docs.uniswap.org/contracts/uniswapx/overview`

### 5 - Coverage Expectations

- quote endpoint
- orders listing
- reactor execution
- callback execution boundary

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/uniswapx/0.4.0.md`
3. stop only when the validator passes
