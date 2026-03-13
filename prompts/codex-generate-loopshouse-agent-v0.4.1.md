==============================================================
AGENTHUB - LOOPSHOUSE 0.4.1 GENERATION BRIEF
Goal: Generate `agents/loopshouse/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/loopshouse/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `parse/loopshouse-docs-v0.4.0.md`

Additional authoritative sources:

- `npm:loopshouse@0.1.1`
- npm README for `loopshouse@0.1.1`
- packaged `SKILL.md`

### 4 - Invariants To Preserve

- `Spec name: loopshouse/cli`
- `Spec version: 0.4.0`
- `Library version: loopshouse^0.1.1`
- `Primary language: javascript`
- `Homepage: https://www.npmjs.com/package/loopshouse`

### 5 - Coverage Expectations

- auth commands
- project commands
- hackathon list, ideate, submit
- MCP registration and server mode
- representative MCP tool names

### 6 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/loopshouse/0.4.0.md`
3. stop only when the validator passes
