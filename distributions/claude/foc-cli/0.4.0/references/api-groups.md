# foc-cli API Groups

### Root CLI And Global Agent Surface
**Exports**
- `foc-cli`
- Global options
- Agent / MCP surface

Top-level command routing, global output controls, and the agent-facing surfaces inherited from `incur`.

#### `foc-cli`
**Kind**
workflow

**Summary**
Root CLI entrypoint that mounts wallet, dataset, piece, provider, upload, multi-upload, and docs commands.

**Definition**
Language: typescript
Source: `cli/src/index.ts`

```ts
const cli = Cli.create('foc-cli', {
  version: '0.0.4',
  description: 'CLI for Filecoin Onchain Cloud — decentralized storage on Filecoin with PDP verification and USDFC payments.',
  sync: {
    include: ['_root'],
    suggestions: [
      'initialize wallet with foc-cli wallet init --auto',
      'upload multiple files to Filecoin warm storage',
      'check wallet balances and payment account info',
      'create a new PDP dataset with a storage provider',
    ],
  },
});
```

**Guidance**
- Treat the root CLI as self-documenting: `-h` is part of the expected workflow, not a fallback.
- For agents, prefer `--json`, `--format yaml`, `--schema`, and `--llms` over screen-scraping terminal output.
- The mounted top-level upload commands are intentionally positioned as the common path; use dataset or piece subcommands only when you need lower-level control.

**Example**
Language: bash

```bash
npx foc-cli --help
npx foc-cli upload -h
npx foc-cli wallet deposit -h
```

#### Global options
**Kind**
config

**Summary**
Cross-command option layer for chain selection, debug output, and structured formatting.

**Definition**
Language: text
Source: `README.md`

```text
--chain <id> / -c   default 314159
--debug             verbose error logging
--format <fmt>      toon | json | yaml | md
--json              shorthand for --format json
```

**Guidance**
- Keep `--chain 314159` vs `--chain 314` explicit when moving between testnet and mainnet.
- Use `--json` or `--format yaml` for agents and automation; do not parse human-oriented default output if structured output is available.
- Treat `--debug` as a troubleshooting switch, not a normal mode for agent outputs.

**Example**
Language: bash

```bash
npx foc-cli upload ./file.pdf --chain 314159 --json
npx foc-cli wallet balance --format yaml
```

#### Agent / MCP surface
**Kind**
other

**Summary**
The CLI also exposes machine-readable docs, schema introspection, and MCP integration.

**Definition**
Language: text
Source: `README.md` + `skills/foc-cli/SKILL.md`

```text
npx foc-cli --llms
npx foc-cli <cmd> --schema
npx foc-cli --mcp
npx foc-cli mcp add
npx foc-cli mcp add --agent claude-code
```

**Guidance**
- Use `--schema` when an agent needs exact argument and output shapes for a command.
- Use `--llms` when a tool or model wants machine-readable docs without scraping the README.
- Treat `mcp add` and `--mcp` as agent integration helpers layered on top of the same command contracts, not a separate storage API.

**Example**
Language: bash

```bash
npx foc-cli upload --schema
npx foc-cli --llms
npx foc-cli mcp add --agent claude-code
```

### Wallet, Config, And Funding
**Exports**
- `wallet init`
- `wallet balance`
- `wallet fund`
- `wallet deposit`
- `wallet summary`
- `wallet costs`
- `privateKeyClient`

Wallet initialization, private-key or keystore resolution, testnet funding, payment-account deposits, and funding-runway inspection.

#### `wallet init`
**Kind**
workflow

**Summary**
Initialize the CLI with a generated private key, an explicit private key, or a Foundry keystore path.

**Definition**
Language: typescript
Source: `cli/src/commands/wallet/init.ts`

```ts
options: z.object({
  auto: z.boolean().optional(),
  keystore: z.string().optional(),
  privateKey: z.string().optional(),
})
```

**Guidance**
- In agent or non-interactive mode, always pass exactly one of `--auto`, `--keystore`, or `--privateKey`.
- `--keystore` requires Foundry tooling because the client uses `cast w dk` to extract the key.
- Do not assume a single OS-specific config file path; `conf` manages the actual location.

**Example**
Language: bash

```bash
npx foc-cli wallet init --auto
npx foc-cli wallet init --keystore ~/.foundry/keystores/alice
```

#### `privateKeyClient`
**Kind**
function

**Summary**
Build a viem wallet client and chain object from configured credentials.

**Definition**
Language: typescript
Source: `cli/src/client.ts`

```ts
export function privateKeyClient(chainId: number) {
  const chain = getChain(chainId)
  const privateKey = privateKeyFromConfig()
  const account = privateKeyToAccount(privateKey as Hex)
  const client = createWalletClient({ account, chain, transport: http() })
  return { client, chain }
}
```

**Guidance**
- Most write commands depend on this helper and will fail until `wallet init` has run successfully.
- The helper can source credentials from either `privateKey` or `keystore`; do not assume direct private-key storage.
- Keep chain selection explicit because explorer URLs, provider scanners, and transactions all derive from it.

**Example**
Language: typescript

```ts
const { client, chain } = privateKeyClient(314159)
```

#### `wallet balance`
**Kind**
workflow

**Summary**
Show wallet FIL and USDFC balances plus payment-account funds and lockup state.

**Definition**
Language: typescript
Source: `cli/src/commands/wallet/balance.ts`

```ts
output: z.object({
  address: z.string(),
  fil: z.string(),
  usdfc: z.string(),
  availableFunds: z.string(),
  lockupCurrent: z.string(),
  lockupRate: z.string(),
  lockupLastSettledAt: z.string(),
  funds: z.string(),
})
```

**Guidance**
- Read this as a layered status report: wallet balances are not the same as usable storage funds.
- `availableFunds` and `funds` come from the payment-account layer, not the base wallet.
- Use this command after `wallet fund`, `wallet deposit`, or uploads to confirm the funding model, not just token ownership.

**Example**
Language: bash

```bash
npx foc-cli wallet balance
npx foc-cli wallet balance --chain 314
```

#### `wallet fund`
**Kind**
workflow

**Summary**
Request FIL and USDFC from the Calibration faucet and then re-read balances.

**Definition**
Language: typescript
Source: `cli/src/commands/wallet/fund.ts`

```ts
description: 'Request testnet FIL and USDFC from faucet (testnet only)'
hint: 'Only works on Calibration testnet (chain 314159).'
```

**Guidance**
- Do not suggest this on mainnet.
- The faucet step funds the wallet, but operators still need `wallet deposit` before storage spending works through the payment account.
- This is the expected first funding step in testnet quick starts.

**Example**
Language: bash

```bash
npx foc-cli wallet fund
```

#### `wallet deposit`
**Kind**
workflow

**Summary**
Deposit USDFC into the Synapse payment account using permit approvals.

**Definition**
Language: typescript
Source: `cli/src/commands/wallet/deposit.ts`

```ts
args: z.object({
  amount: z.string().describe('Amount of USDFC to deposit'),
})
```

**Guidance**
- This is the storage-spending step that matters after faucet funding.
- Do not confuse the deposit with moving tokens into the wallet; it moves spending power into the payment system.
- Wait for the transaction receipt and then re-check `wallet balance` or `wallet summary`.

**Example**
Language: bash

```bash
npx foc-cli wallet deposit 1
```

#### `wallet summary`
**Kind**
workflow

**Summary**
Show payment-account runway and lockup rates instead of only current balances.

**Definition**
Language: typescript
Source: `cli/src/commands/wallet/summary.ts`

```ts
output: z.object({
  availableFunds: z.string(),
  timeRemaining: z.string(),
  totalLockup: z.string(),
  monthlyAccountRate: z.string(),
  monthlyStorageRate: z.string(),
  funds: z.string(),
})
```

**Guidance**
- Use this when the task is about funding runway or whether more deposit is needed before uploads.
- `timeRemaining` is a derived, human-readable runway estimate, not an onchain primitive.
- Keep `wallet summary` separate from `wallet balance`: this is planning and monitoring, not just current balances.

**Example**
Language: bash

```bash
npx foc-cli wallet summary
```

#### `wallet costs`
**Kind**
workflow

**Summary**
Estimate extra monthly rate and deposit needed for additional upload bytes and runway.

**Definition**
Language: typescript
Source: `cli/src/commands/wallet/costs.ts`

```ts
options: z.object({
  extraBytes: z.number(),
  extraRunway: z.number(),
})
```

**Guidance**
- Use this before large or cost-sensitive uploads.
- The command internally uses `synapse.storage.prepare(...)`, so treat it as a preflight tool rather than a billing statement.
- `alreadyCovered` means the existing account funding is enough for the requested incremental storage and runway.

**Example**
Language: bash

```bash
npx foc-cli wallet costs --extraBytes 1000000 --extraRunway 1
```

### High-Level Uploads And Storage Contexts
**Exports**
- `upload`
- `multi-upload`
- `Synapse.storage.prepare`

Recommended upload paths that create contexts, preflight costs, and store files on Filecoin warm storage.

#### `upload`
**Kind**
workflow

**Summary**
Recommended single-file upload path with automatic provider/context selection and optional CDN plus copy count control.

**Definition**
Language: typescript
Source: `cli/src/commands/upload.ts`

```ts
args: z.object({ path: z.string() })
options: z.object({
  chain: z.number().default(314159),
  copies: z.number().default(2).optional(),
  withCDN: z.boolean().optional(),
  debug: z.boolean().optional(),
})
```

**Guidance**
- Prefer this command over manual dataset creation unless the user explicitly needs provider-by-provider control.
- `copies` controls replication count; keep in mind the README pricing assumes a minimum of two copies.
- The command creates storage contexts, runs `prepare(...)`, submits a transaction when needed, uploads the file, and reports both successful copies and failed attempts.

**Example**
Language: bash

```bash
npx foc-cli upload ./myfile.pdf
npx foc-cli upload ./myfile.pdf --withCDN --copies 3
```

#### `multi-upload`
**Kind**
workflow

**Summary**
Upload multiple files in one workflow by storing to a primary provider, pulling to secondaries, and committing across contexts.

**Definition**
Language: typescript
Source: `cli/src/commands/multi-upload.ts`

```ts
args: z.object({
  paths: z.preprocess(
    (val) => (typeof val === 'string' ? val.split(',') : val),
    z.array(z.string())
  )
})
```

**Guidance**
- Use this when batch upload matters more than separate per-file ergonomics.
- The command treats the first context as primary and the rest as replicas; that is a stronger operational contract than just calling `upload` in a loop.
- If primary-store or replication steps fail, fix that workflow first instead of assuming the final commit stage is the problem.

**Example**
Language: bash

```bash
npx foc-cli multi-upload ./a.pdf,./b.pdf --copies 3
```

#### `Synapse.storage.prepare`
**Kind**
function

**Summary**
Preflight storage costs and transaction requirements before upload or cost estimation.

**Definition**
Language: typescript
Source: `cli/src/commands/upload.ts` + `cli/src/commands/wallet/costs.ts`

```ts
const prep = await synapse.storage.prepare({
  context: contexts,
  dataSize: BigInt(file.byteLength),
})
```

**Guidance**
- This is the right mental model for “can I afford this?” or “what transaction will I need?” questions.
- `wallet costs` is the operator-facing convenience wrapper around the same concept.
- Do not jump straight to upload if the workflow is deposit-sensitive; inspect or estimate first.

**Example**
Language: typescript

```ts
const prep = await synapse.storage.prepare({
  dataSize: BigInt(1_000_000),
})
```

### Dataset, Piece, And Provider Operations
**Exports**
- `provider list`
- `dataset create`
- `dataset upload`
- `dataset details`
- `piece remove`

Lower-level PDP dataset management, provider inspection, and piece-level operations.

#### `provider list`
**Kind**
workflow

**Summary**
List approved PDP storage providers, pricing, size bounds, service URLs, and Dealbot dashboard links.

**Definition**
Language: typescript
Source: `cli/src/commands/provider/list.ts`

```ts
description: 'List all approved PDP storage providers with full details and performance dashboard'
```

**Guidance**
- Use this before manual dataset creation if provider choice matters.
- Keep provider IDs, service URLs, and pricing distinct; operator choice is not just a human-readable name.
- The Dealbot dashboard link is useful for performance context, but command output and onchain confirmations remain the operational truth.

**Example**
Language: bash

```bash
npx foc-cli provider list
```

#### `dataset create`
**Kind**
workflow

**Summary**
Create a PDP dataset, optionally with explicit provider choice and CDN.

**Definition**
Language: text
Source: `README.md` + `cli/src/commands/dataset/create.ts`

```bash
npx foc-cli dataset create [providerId] [--cdn]
```

**Guidance**
- Reach for this only when you need explicit dataset lifecycle control.
- If no provider ID is supplied, the command can select interactively for humans; do not assume that is appropriate for agent mode.
- After creating a dataset, piece-oriented follow-up commands become the right surface.

**Example**
Language: bash

```bash
npx foc-cli dataset create 1 --cdn
```

#### `dataset upload`
**Kind**
workflow

**Summary**
Create a dataset with a chosen provider and upload a piece into it in one step.

**Definition**
Language: typescript
Source: `cli/src/commands/dataset/upload.ts`

```ts
args: z.object({
  path: z.string(),
  providerId: z.coerce.number(),
})
```

**Guidance**
- This is more explicit than the high-level `upload` command because the provider is part of the contract.
- The command computes a piece CID, uploads the piece, then creates the dataset and adds that piece.
- Use this when the provider choice is part of the task, not just because a file needs storing.

**Example**
Language: bash

```bash
npx foc-cli dataset upload ./myfile.pdf 1 --cdn
```

#### `dataset details`
**Kind**
workflow

**Summary**
Show dataset metadata, provider context, and all pieces with piece metadata and retrieval URLs.

**Definition**
Language: typescript
Source: `cli/src/commands/dataset/details.ts`

```ts
alias: { chain: 'c', dataSetId: 'd' }
```

**Guidance**
- This is the right inspection surface after uploads or before piece removal or dataset termination.
- Use it to reason about active piece count, provider service URL, and piece metadata without dropping to lower-level SDK code.
- If a dataset is missing, treat that as a real not-found condition, not an empty list.

**Example**
Language: bash

```bash
npx foc-cli dataset details -d 42
```

#### `piece remove`
**Kind**
workflow

**Summary**
Schedule deletion of a specific piece from a dataset and wait for the transaction receipt.

**Definition**
Language: typescript
Source: `cli/src/commands/piece/remove.ts`

```ts
args: z.object({
  dataSetId: z.coerce.number(),
  pieceId: z.coerce.number(),
})
```

**Guidance**
- Use `piece list` or `dataset details` first to resolve the correct `pieceId`.
- This is a write operation with real lifecycle consequences, so keep chain and dataset identity explicit.
- Treat the scheduled deletion transaction and receipt as the state transition, not the CLI confirmation message alone.

**Example**
Language: bash

```bash
npx foc-cli piece remove 42 7
```

### Documentation Search And AI Support
**Exports**
- `docs`
- Bundled skills

Documentation retrieval and agent-facing operational guidance.

#### `docs`
**Kind**
workflow

**Summary**
Fetch and search `docs.filecoin.cloud` through `llms.txt`, optionally auto-fetching a top match and filtering markdown depth.

**Definition**
Language: typescript
Source: `cli/src/commands/docs.ts`

```ts
const LLMS_TXT_URL = 'https://docs.filecoin.cloud/llms.txt'
const MAX_HEADER_DEPTH = 4
```

**Guidance**
- `docs --prompt` is a search flow, not just a raw docs dump. When only a few matches are found, it can auto-fetch the best page.
- `docs --url` fetches a specific page and filters deep headings by default; use `--maxDepth 6` when you need the full page.
- Use this command or the `foc-docs` skill for documentation-heavy tasks; keep `foc-cli` focused on execution and operations.

**Example**
Language: bash

```bash
npx foc-cli docs --prompt "upload files"
npx foc-cli docs --url https://docs.filecoin.cloud/developer-guides/storage/storage-operations.md --maxDepth 6
```

#### Bundled skills
**Kind**
other

**Summary**
The repo ships both `foc-cli` and `foc-docs` skills with different intended triggers.

**Definition**
Language: text
Source: `README.md` + `skills/foc-cli/SKILL.md`

```text
foc-cli  => CLI & operations
foc-docs => documentation search
```

**Guidance**
- If the task is “do something with storage, wallets, datasets, or providers,” start from the CLI operational surface.
- If the task is “look up how FOC or Synapse works,” prefer the docs skill or the docs command.
- Do not flatten both skills into one generic Filecoin helper; the split is deliberate.

**Example**
Language: bash

```bash
npx skills add FIL-Builders/foc-cli --skill foc-cli
npx skills add FIL-Builders/foc-cli --skill foc-docs
```
