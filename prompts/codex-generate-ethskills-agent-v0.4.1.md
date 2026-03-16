==============================================================
AGENTHUB - ETHSKILLS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/ethskills/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/ethskills/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `parse/ethskills-docs-v0.4.0.md`

Additional authoritative sources:

- upstream `README.md`
- upstream top-level `SKILL.md`
- upstream `ship/SKILL.md`
- upstream `.claude-plugin/plugin.json`
- upstream `CONTRIBUTING.md`

### 4 - Invariants To Preserve

- `Spec name: ethskills`
- `Spec version: 0.4.0`
- `Library version: current-docs + claude-plugin^1.1.0`
- `Primary language: markdown`
- `Homepage: https://ethskills.com`

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- there is no prior `agents/ethskills/0.3.0.md` pack
- this is a first-class `0.4.0` pack for the published ETHSkills skill system
- current upstream repo head for extraction is `370760f57d1a0b0ab2f39fc6369bce46c02b5b17`

You must avoid stale assumptions, including:

- that Hardhat is the default Ethereum toolchain
- that Ethereum mainnet is categorically too expensive for normal dApp work
- that `ship` and the top-level `SKILL.md` are interchangeable
- that `security`, `qa`, and `audit` mean the same thing

### 6 - Ecosystem Boundary Rules

Keep these boundaries explicit:

- root router vs topic skills
- published skill URLs vs GitHub contribution workflow
- build guidance vs review guidance
- current canonical skills vs deprecated aliases

Specific rules:

- `ship` should be the default first fetch for end-to-end dApp work
- topic skill fetches should be selective, not “load everything”
- deprecated aliases like `l2`, `layer2`, `contracts`, and `defi` should not be treated as the preferred names
- the contribution rule from upstream `CONTRIBUTING.md` should appear in the pack authoring guidance

### 7 - Coverage Expectations

- top-level router skill
- `ship`
- canonical skill URL pattern
- Claude plugin install path
- core topic skills
- security vs qa vs audit distinction
- contribution guidance for revising ethskills itself

### 8 - Definition Quality

For each documented symbol or feature:

- prefer upstream skill docs and plugin metadata over README marketing copy when they disagree
- keep current-Ethereum reality corrections explicit
- if a point is ambiguous, mark it `Needs verification`

### 9 - Required Ethskills Guidance

Make sure the final pack teaches these behaviors clearly:

- fetch `ship` first for broad dApp work
- fetch only the relevant topic skills for narrow tasks
- preserve “onchain” as the preferred spelling
- treat current gas/tooling guidance as updated corrections, not historical assumptions
- use the blind-spot-or-human-teaching contribution rule when revising the skill set

### 10 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/ethskills/0.4.0.md`
3. stop only when the validator passes
