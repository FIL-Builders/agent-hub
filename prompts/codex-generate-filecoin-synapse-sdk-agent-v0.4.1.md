==============================================================
AGENTHUB - FILECOIN SYNAPSE SDK 0.4.1 GENERATION BRIEF
Goal: Generate `agents/filecoin-synapse-sdk/0.4.0.md` using the
      v0.4.0 spec, the improved v0.4 process, and current Synapse sources.
==============================================================

### 1 - Target Output

Write:

- `agents/filecoin-synapse-sdk/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/filecoin-synapse-sdk/0.3.0.md`
- `parse/filecoin-synapse-sdk-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Synapse sources, including:

- official Synapse docs at `synapse.filecoin.services`
- `npm:@filoz/synapse-sdk@0.39.0`
- `npm:@filoz/synapse-core@0.3.0`
- official release or migration notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: filecoin-synapse-sdk`
- `Spec version: 0.4.0`
- `Library version: current-docs + @filoz/synapse-sdk^0.39.0 + @filoz/synapse-core^0.3.0`
- `Primary language: typescript`
- `Homepage: https://synapse.filecoin.services/`

Lock the target to the current Synapse docs surface and current npm package
contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: `@filoz/synapse-sdk` `0.24.x` with ethers v6, async `Synapse.create()`, RPC URL constants, and warm-storage-first framing
- current target: `0.39.0` with viem clients, synchronous `Synapse.create()`, explicit service objects, prepare flows, and expanded FilBeam and provider-registry support

You must identify and avoid stale assumptions, including any assumptions about:

- `Synapse.create()` being async
- ethers being the primary integration model
- RPC URL constants being the main network-selection surface
- Warm Storage being the only meaningful high-value subsystem

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Synapse SDK developer workflows, but it must keep subsystem and
trust boundaries explicit.

You must distinguish:

- `Synapse` high-level composition
- payments flows
- storage-manager flows
- explicit storage-context flows
- warm-storage service inspection
- provider registry discovery
- FilBeam stats and retrieval metrics

Specific rules:

- do not present wallet balance and Synapse account balance as the same thing
- do not flatten upload, prepare, fund, and settlement into one step
- do not present `withCDN` or FilBeam retrieval as identical to storage proof or payment state
- do not preserve older ethers/WebSocket assumptions unless current package contracts still require them

If a workflow belongs to a different layer, call it out as a boundary rather
than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Synapse surface needed for real
project work, including:

- top-level `Synapse` creation and chain/account setup
- payments deposits, approvals, service approvals, rails, settlement
- storage upload, download, context creation, prepare and upload-cost inspection
- warm-storage inspection and provider approval helpers
- provider registry discovery
- FilBeam stats
- troubleshooting and FAQ where source support is strong

Use `agents/filecoin-synapse-sdk/0.3.0.md` only to audit coverage and preserve
valid storage/payments insights where they remain current. It is not the primary
contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Synapse Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- start from a correctly configured viem client and chain
- keep wallet balance and Synapse payment-account state separate
- approve service operators before creating or funding storage-heavy workflows when needed
- use `prepare()` and upload-cost inspection for cost-aware flows
- keep default storage-manager flows separate from explicit storage-context control
- keep FilBeam stats separate from protocol-level payment and storage truth

### 10 - Required Synapse Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that current Synapse SDK is primarily ethers-based
- that upload success implies payment settlement is complete
- that FilBeam stats are the source of truth for onchain balances or storage commitments

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   create a Synapse client, fund an account, upload data, and inspect resulting storage/payment state
2. troubleshooting:
   debug insufficient approval, cost mismatch, or piece-download problems
3. design or tradeoff:
   choose between default storage-manager flows and explicit storage-context control
4. version-confusion:
   prevent answers that preserve the old async/ethers/RPC_URLS mental model

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/filecoin-synapse-sdk/0.4.0.md`
3. fix any reported structural errors
4. confirm payments-vs-storage-vs-filbeam boundaries are explicit
5. confirm current viem-based setup and `0.39.x` mental model are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
