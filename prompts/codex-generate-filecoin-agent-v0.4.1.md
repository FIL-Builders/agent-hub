==============================================================
AGENTHUB - FILECOIN 0.4.1 GENERATION BRIEF
Goal: Generate `agents/filecoin/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current Filecoin sources.
==============================================================

### 1 - Target Output

Write:

- `agents/filecoin/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/filecoin/0.3.0.md`
- `parse/filecoin-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Filecoin sources, including:

- official Filecoin docs pages for JSON-RPC, FEVM RPC, protocol and actor/state
  behavior where relevant
- official Lotus docs pages for RPC usage and endpoint behavior
- `npm:@filecoin-shipyard/lotus-client-schema@4.2.0`
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- `npm:@filecoin-shipyard/lotus-client-provider-nodejs@1.1.1`
- official release or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: filecoin`
- `Spec version: 0.4.0`
- `Library version: current-docs + lotus-client-schema^4.2.0 + lotus-client-rpc^1.2.0`
- `Primary language: javascript`
- `Homepage: https://docs.filecoin.io/reference/json-rpc`

Lock the target to the current Filecoin docs surface, with the Lotus JS Client
packages as the main JavaScript contract anchors.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Lotus JSON-RPC and FEVM RPC
- current target: broader Filecoin platform guidance while preserving the strong
  RPC and FEVM material

You must identify and avoid stale assumptions, including any assumptions about:

- Filecoin developer work being only Lotus JSON-RPC calls
- FEVM Ethereum-compatible RPC semantics being identical to ordinary Ethereum
  behavior without Filecoin tipset and chain-specific caveats
- protocol state reads, wallet/message flow, and FEVM contract interaction being
  one undifferentiated workflow
- public RPC endpoints being interchangeable with a self-hosted node

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Filecoin as a developer platform, but it must keep product and
workflow boundaries explicit.

You must distinguish:

- Lotus JSON-RPC for Filecoin-native operations
- FEVM Ethereum-compatible RPC
- protocol state and actor reads
- wallet/message sending and gas estimation
- generic Ethereum tooling assumptions

Specific rules:

- do not collapse Lotus `/rpc/v0` and FEVM `/rpc/v1` into one endpoint model
- do not present FEVM semantics as identical to ordinary Ethereum without
  calling out Filecoin tipset and chain behavior
- do not treat public RPC endpoint capabilities as equivalent to a self-hosted
  node

If another workflow is useful as context, call it out as a boundary rather than
 treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Filecoin surface needed for real
project work, including:

- Lotus JSON-RPC read flows
- actor/state queries and message receipts
- message submission and gas estimation
- wallet and mempool behavior where source support is strong
- FEVM Ethereum-compatible RPC behavior and caveats
- protocol/query workflows and troubleshooting
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/filecoin/0.3.0.md` only to audit coverage and preserve strong RPC
insights where they remain valid. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Filecoin Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- distinguish Lotus JSON-RPC and FEVM RPC as separate operational surfaces
- treat tipsets, epochs, and Filecoin-specific chain behavior as first-class
  concepts
- preserve gas-estimation and message-submission safety guidance
- keep public-endpoint limitations explicit
- preserve high-value guidance around receipts, state anchoring, and FEVM
  compatibility boundaries

### 10 - Required Filecoin Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that FEVM RPC is fully identical to ordinary Ethereum node behavior
- that public RPC endpoints expose the same write surface as a self-hosted node
- that Lotus JSON-RPC and FEVM RPC are interchangeable

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   query Filecoin state, estimate gas, and submit a message safely
2. troubleshooting:
   debug a receipt/state mismatch, FEVM RPC confusion, or endpoint limitation
3. design or tradeoff:
   choose between Filecoin-native RPC and FEVM-compatible RPC for a task
4. version-confusion:
   prevent an answer that substitutes generic Ethereum intuition for Filecoin
   chain, tipset, and endpoint behavior

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/filecoin/0.4.0.md`
3. fix any reported structural errors
4. confirm Lotus-vs-FEVM and public-vs-self-hosted boundaries are explicit
5. confirm Filecoin-specific chain and gas semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
