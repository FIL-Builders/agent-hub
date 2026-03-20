==============================================================
AGENTHUB - FOC-CLI 0.4.1 GENERATION BRIEF
Goal: Generate `agents/foc-cli/0.4.0.md`
==============================================================

### 1 - Target Output

Write:

- `agents/foc-cli/0.4.0.md`

### 2 - Required Structural Inputs

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

- `parse/foc-cli-docs-v0.4.0.md`

Additional authoritative sources:

- upstream `main` at `46f80a379e351086758497944205eb7611143592`
- `README.md`
- `cli/package.json`
- `cli/src/index.ts`
- `cli/src/config.ts`
- `cli/src/client.ts`
- `cli/src/output.ts`
- `cli/src/utils.ts`
- `cli/src/commands/upload.ts`
- `cli/src/commands/multi-upload.ts`
- `cli/src/commands/provider/index.ts`
- `cli/src/commands/provider/list.ts`
- `cli/src/commands/wallet/init.ts`
- `cli/src/commands/wallet/balance.ts`
- `cli/src/commands/wallet/fund.ts`
- `cli/src/commands/wallet/deposit.ts`
- `cli/src/commands/wallet/withdraw.ts`
- `cli/src/commands/wallet/summary.ts`
- `cli/src/commands/wallet/costs.ts`
- `cli/src/commands/dataset/index.ts`
- `cli/src/commands/dataset/create.ts`
- `cli/src/commands/dataset/upload.ts`
- `cli/src/commands/dataset/list.ts`
- `cli/src/commands/dataset/details.ts`
- `cli/src/commands/dataset/terminate.ts`
- `cli/src/commands/piece/index.ts`
- `cli/src/commands/piece/list.ts`
- `cli/src/commands/piece/remove.ts`
- `cli/src/commands/docs.ts`
- `skills/foc-cli/SKILL.md`
- `skills/foc-docs/SKILL.md`

### 4 - Invariants To Preserve

- `Spec name: foc-cli`
- `Spec version: 0.4.0`
- `Library version: foc-cli^0.0.4 + @filoz/synapse-sdk^0.40.0 + @filoz/synapse-core^0.3.1 + incur^0.3.1`
- `Primary language: typescript`
- `Homepage: https://github.com/FIL-Builders/foc-cli`

### 5 - Version Delta Audit

Before drafting, explicitly audit:

- there is no older `agents/foc-cli/0.3.0.md` pack in this repo
- the current package version is `0.0.4`
- the repo ships both CLI and skill surfaces
- the current implementation uses `viem`, `Synapse`, and `incur`

You must avoid stale assumptions, including:

- that the tool is only a human terminal CLI
- that `wallet fund` is valid on mainnet
- that wallet token balances and payment-account funds are interchangeable
- that `upload` and `dataset upload` are the same abstraction level
- that the docs command just dumps raw `llms.txt` without search or auto-fetch behavior
- that a single OS-specific config path is universal

### 6 - Ecosystem Boundary Rules

Keep these boundaries explicit:

- foc-cli operational surface vs raw Synapse SDK usage
- high-level upload path vs explicit dataset management
- wallet balances vs payment-account state and runway
- docs retrieval vs operational commands
- human interactive mode vs agent/MCP mode

Specific rules:

- preserve `upload` and `multi-upload` as the recommended path
- do not flatten the pack into generic Filecoin or Synapse SDK lore
- keep `foc-cli` and `foc-docs` as distinct skill purposes
- keep testnet/mainnet behavior explicit

### 7 - Coverage Expectations

- root `foc-cli` entrypoint
- `--chain`, `--debug`, `--format`, `--json`
- `--schema`
- `--llms`
- `--mcp`
- `mcp add`
- `upload`
- `multi-upload`
- `wallet init`
- `wallet balance`
- `wallet fund`
- `wallet deposit`
- `wallet withdraw`
- `wallet summary`
- `wallet costs`
- `provider list`
- `dataset list`
- `dataset details`
- `dataset create`
- `dataset upload`
- `dataset terminate`
- `piece list`
- `piece remove`
- `docs --prompt`
- `docs --url`
- `docs --maxDepth`

### 8 - Definition Quality

For each documented command or feature:

- prefer checked-in repo source over generic ecosystem memory
- preserve current command names and option names exactly
- treat README claims as secondary to the current source when they diverge
- if a detail is OS-specific or inherited from `conf`, mark that boundary clearly

### 9 - Required foc-cli Guidance

Make sure the final pack teaches these behaviors clearly:

- initialize credentials explicitly in agent mode
- deposit USDFC into the payment account before expecting uploads to work
- use `wallet summary` and `wallet costs` for runway planning
- prefer `upload` or `multi-upload` before manual dataset flows
- use `provider list` before explicit dataset creation when provider choice matters
- use `docs --prompt` or `foc-docs` for documentation-heavy tasks
- use structured output and schema surfaces when the caller is an agent

### 10 - Completion Check

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/foc-cli/0.4.0.md`
3. stop only when the validator passes
