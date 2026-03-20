# foc-cli Documentation Pack

## Target
- Pack: `agents/foc-cli/0.4.0.md`
- Target date: 2026-03-19
- Repo anchor: upstream `main` at `46f80a379e351086758497944205eb7611143592`

## Source Inventory
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

## Version Delta Audit
- There is no prior `agents/foc-cli/0.3.0.md` pack in this repo.
- The current npm package version is `0.0.4`.
- The repo ships both a CLI and skill surfaces; this pack should center the CLI as the operational interface and mention the bundled skills and MCP path as secondary delivery modes.
- The current implementation is built on `incur`, `@filoz/synapse-sdk`, `@filoz/synapse-core`, and `viem`, not ethers.

## Ecosystem Boundaries

### foc-cli vs Filecoin docs vs Synapse SDK
- `foc-cli` is the operator-facing shell around Filecoin Onchain Cloud workflows.
- `docs.filecoin.cloud` and `llms.txt` are the documentation surface.
- `@filoz/synapse-sdk` and `@filoz/synapse-core` are the underlying programmatic layers.
- The pack should keep CLI contracts separate from lower-level SDK calls.

### High-level upload flow vs manual dataset flow
- `upload` and `multi-upload` are the recommended high-level commands.
- `dataset create`, `dataset upload`, `piece list`, and `piece remove` are for explicit PDP dataset management.
- The pack should preserve that the high-level upload path auto-selects providers and contexts, while the dataset path is more manual and provider-specific.

### Wallet balance vs payment-account state
- Wallet FIL and USDFC balances are not the same thing as the Synapse payment account.
- `wallet balance`, `wallet deposit`, `wallet withdraw`, `wallet summary`, and `wallet costs` are different layers of the funding model.

### Human CLI mode vs agent/MCP mode
- The repo explicitly detects agent mode and suppresses interactive prompts in that case.
- `--mcp`, `mcp add`, structured output, `--schema`, and `--llms` are part of the agent-facing surface.
- Human interactive `wallet init` behavior should not be treated as valid in agent mode without explicit flags.

## Decision Rules
- Start with `upload` or `multi-upload` unless the task clearly needs provider-by-provider dataset management.
- Use `wallet init --auto`, `--keystore`, or `--privateKey` explicitly for non-interactive or agent-driven setup.
- Keep `wallet balance` and `wallet summary` separate in mental model: one is current balances, the other is funding runway and lockup behavior.
- Treat `wallet costs` and `synapse.storage.prepare(...)` as estimation/preflight tools before cost-sensitive uploads.
- Use `provider list` before manual dataset creation if provider choice matters.
- Use `docs --prompt` or `docs --url` for FOC docs lookup; prefer `foc-docs` for documentation-heavy agent tasks and `foc-cli` for operations-heavy tasks.

## Common Confusions
- `wallet fund` is testnet-only.
- `wallet deposit` funds the payment account, not the raw wallet balance.
- `upload` is the recommended command; `dataset upload` is a more explicit dataset creation path.
- The config path is managed by `conf`, so the concrete file path can vary by OS even if the repo README shows a macOS example.
- The CLI supports both terminal usage and AI-agent usage; some prompt-driven flows are intentionally skipped in agent mode.
- `docs --prompt` can auto-fetch the top result when only a few matches are found instead of returning the raw `llms.txt`.

## Failure Modes
- Running write commands before `wallet init`.
- Expecting `wallet fund` to work on mainnet.
- Funding the wallet but not depositing USDFC into the payment account before uploading.
- Confusing high-level `upload` with manual dataset management and prematurely reaching for `dataset create`.
- Treating provider dashboard or scanner URLs as the source of truth instead of the CLI command outputs and onchain transaction confirmations.
- Invoking `wallet init` in agent mode without one of `--auto`, `--keystore`, or `--privateKey`.

## Coverage Map

### Root and Global Behavior
- `foc-cli`
- `--chain`, `--debug`, `--format`, `--json`
- structured output and CTA-shaped agent responses
- `--schema`
- `--llms`
- `--mcp`
- `mcp add`

### Upload Workflows
- `upload`
- `multi-upload`
- storage context creation
- `Synapse.storage.prepare(...)`
- copy counts
- CDN flag

### Wallet and Payments
- `wallet init`
- `wallet balance`
- `wallet fund`
- `wallet deposit`
- `wallet withdraw`
- `wallet summary`
- `wallet costs`
- keystore/private-key resolution

### Dataset and Piece Management
- `dataset list`
- `dataset details`
- `dataset create`
- `dataset upload`
- `dataset terminate`
- `piece list`
- `piece remove`

### Providers and Docs
- `provider list`
- `docs --prompt`
- `docs --url`
- `docs --maxDepth`

## Must-Not-Regress Insights
- Preserve `upload` and `multi-upload` as the preferred high-level operator path.
- Preserve that funding and payment-account state are separate concepts.
- Preserve non-interactive `wallet init` requirements in agent mode.
- Preserve the docs command’s `llms.txt` search-and-auto-fetch behavior.
- Preserve that the repo ships both `foc-cli` and `foc-docs` skills, with different intended uses.
