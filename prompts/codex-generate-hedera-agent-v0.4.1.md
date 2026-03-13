==============================================================
AGENTHUB - HEDERA 0.4.1 GENERATION BRIEF
Goal: Generate `agents/hedera/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current Hedera sources.
==============================================================

### 1 - Target Output

Write:

- `agents/hedera/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/hedera/0.3.0.md`
- `parse/hedera-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Hedera sources, including:

- official Hedera docs pages for SDK setup, account and transaction workflows,
  HTS, HCS, smart contracts, mirror node REST, and local development
- `npm:@hashgraph/sdk@2.80.0`
- `npm:@hashgraph/hedera-local@2.39.4`
- official release or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: hedera`
- `Spec version: 0.4.0`
- `Library version: current-docs + @hashgraph/sdk^2.80.0`
- `Primary language: javascript`
- `Homepage: https://docs.hedera.com/hedera/getting-started-sdk-developers/quickstart`

Lock the target to the current Hedera docs surface, with `@hashgraph/sdk` as the
main JavaScript contract anchor.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Hedera Mirror Node REST reads
- current target: broader Hedera developer workflows with SDK submission paths,
  mirror-node read paths, and local-network setup boundaries made first-class

You must identify and avoid stale assumptions, including any assumptions about:

- Hedera integration being only mirror-node REST reads
- mirror-node data being the same thing as consensus-node submission paths
- EVM-contract flows being the same thing as ordinary Ethereum node workflows
- current ecosystem branding being fully migrated from `hashgraph` to `hiero`
  across package names and docs

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Hedera as a developer platform, but it must keep product and
workflow boundaries explicit.

You must distinguish:

- SDK-based consensus-node queries and transactions
- mirror-node REST indexed reads
- mirror-node contract simulation
- Hedera account, token, topic, and contract surfaces
- local-node development versus public testnet or mainnet usage

Specific rules:

- do not collapse consensus-node submission and mirror-node indexing into one
  immediate-consistency model
- do not present mirror-node REST as the write path for transactions
- do not present Hedera EVM support as identical to a generic Ethereum node
- do not hide the current package-branding reality: docs increasingly use
  `Hiero`, but npm package anchors still use `@hashgraph/*`

If a workflow belongs to a different layer, call it out as a boundary rather
than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Hedera surface needed for real
project work, including:

- client setup and operator configuration
- account creation, HBAR transfer, receipts, and account reads
- token creation, association, and token reads
- topic submission and topic message consumption
- contract query, execute, and mirror-node simulation behavior
- mirror-node REST indexed reads for accounts, tokens, transactions, and contract calls
- local-node workflows where source support is strong
- troubleshooting and FAQ where source support is strong

Use `agents/hedera/0.3.0.md` only to audit coverage and preserve valid
mirror-node insights where they remain current. It is not the primary
contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Hedera Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- separate consensus-node submission from mirror-node indexing
- wait for transaction receipt before treating a write as finalized, and expect
  mirror-node visibility to lag consensus
- keep account IDs, aliases, and EVM addresses distinct
- preserve token-association and receiver-signature caveats
- preserve topic-submit versus topic-read boundaries
- preserve mirror-node contract-call versus consensus-node contract-call boundaries

### 10 - Required Hedera Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that mirror-node REST is the transaction-submission path
- that mirror-node reads are immediately consistent with submitted writes
- that Hedera contract and identity semantics are interchangeable with generic
  Ethereum assumptions

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   create an account or token, submit a transaction, and confirm it correctly
2. troubleshooting:
   debug a receipt-versus-mirror-node visibility mismatch or token-association failure
3. design or tradeoff:
   choose between consensus-node queries, mirror-node REST, and mirror-node contract simulation
4. version-confusion:
   prevent an answer that confuses current docs branding with current npm package names

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/hedera/0.4.0.md`
3. fix any reported structural errors
4. confirm consensus-node-vs-mirror-node boundaries are explicit
5. confirm SDK-vs-REST-vs-contract-simulation boundaries are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
