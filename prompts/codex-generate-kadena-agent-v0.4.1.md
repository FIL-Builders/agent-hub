==============================================================
AGENTHUB - KADENA 0.4.1 GENERATION BRIEF
Goal: Generate `agents/kadena/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/kadena/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `agents/kadena/0.3.0.md`
- `parse/kadena-docs-v0.4.0.md`

Additional authoritative sources:

- `https://docs.kadena.io/`
- `npm:pact-lang-api@4.3.6`

### 4 - Invariants To Preserve

- `Spec name: kadena/pact-lang-api`
- `Spec version: 0.4.0`
- `Library version: pact-lang-api^4.3.6`
- `Primary language: javascript`
- `Homepage: https://docs.kadena.io/`

### 5 - Coverage Expectations

- fetch helpers
- metadata and capability builders
- key generation
- wallet signing and submission

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/kadena/0.4.0.md`
3. stop only when the validator passes
