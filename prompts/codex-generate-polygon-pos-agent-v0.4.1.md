==============================================================
AGENTHUB - POLYGON POS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/polygon-pos/0.4.0.md` using the v0.4.0
      spec, the improved v0.4 process, and current Polygon PoS sources.
==============================================================

### 1 - Target Output

Write:

- `agents/polygon-pos/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/polygon-pos/0.3.0.md`
- `parse/polygon-pos-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Polygon PoS sources, including:

- official Polygon docs for PoS building, bridging, Polygon Portal, and matic.js
- `npm:@maticnetwork/maticjs@3.9.6`
- `npm:@maticnetwork/maticjs-ethers@1.1.0`
- official release or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: polygon-pos`
- `Spec version: 0.4.0`
- `Library version: current-docs + @maticnetwork/maticjs^3.9.6 + @maticnetwork/maticjs-ethers^1.1.0`
- `Primary language: javascript`
- `Homepage: https://docs.polygon.technology/tools/matic-js/get-started/`

Lock the target to the current Polygon PoS docs surface, with `matic.js` as the
main JavaScript contract anchor.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Heimdall-v2 operator and node APIs
- current target: practical Polygon PoS application and bridge workflows with
  parent-chain, child-chain, deposit, burn, checkpoint, and exit boundaries made first-class

You must identify and avoid stale assumptions, including any assumptions about:

- Polygon PoS integration being mainly a Heimdall operator problem
- parent-chain Ethereum and child-chain Polygon PoS being one undifferentiated execution environment
- deposit and withdraw flows being symmetric in timing and confirmation semantics
- Portal UX, matic.js, and raw ethers workflows being interchangeable

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Polygon PoS developer workflows, but it must keep bridge and
network boundaries explicit.

You must distinguish:

- parent-chain Ethereum
- child-chain Polygon PoS
- deposits into PoS
- withdraw burn initiation on PoS
- checkpointing and final exit on Ethereum
- Polygon Portal UX versus programmatic matic.js flows

Specific rules:

- do not present deposit completion and withdraw completion as having the same timing model
- do not treat child-chain burn as the final withdrawal completion step
- do not hide the need for checkpointing before PoS exits
- do not flatten raw ethers provider usage into the same layer as `POSClient`

If a workflow belongs to a different layer, call it out as a boundary rather
than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Polygon PoS surface needed for real
project work, including:

- matic.js plugin setup
- `POSClient` initialization
- parent vs child token handles
- approve and deposit flows
- withdraw start and exit flows
- checkpoint and exit-processed checks
- Portal and bridge model boundaries
- troubleshooting and FAQ where source support is strong

Use `agents/polygon-pos/0.3.0.md` only to audit coverage and preserve valid
Polygon architecture insights where they remain current. It is not the primary
contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Polygon PoS Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- initialize `POSClient` with explicit parent and child providers
- keep parent-token and child-token handles distinct
- require approval on the parent side before ERC-20 deposit when applicable
- treat `withdrawStart` as burn initiation, not final bridge completion
- check checkpoint or exit readiness before final exit submission
- keep current POL migration context explicit where it affects gas or docs interpretation

### 10 - Required Polygon PoS Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that Polygon PoS withdrawals finalize immediately after the child-chain burn
- that one provider or one network context is enough for parent and child bridge work
- that Portal UX steps and matic.js APIs are the same abstraction layer

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   bridge an ERC-20 from Ethereum to Polygon PoS and then start a withdrawal back
2. troubleshooting:
   debug a stuck exit caused by missing checkpoint or wrong network/provider selection
3. design or tradeoff:
   choose between Portal UX and programmatic matic.js integration
4. version-confusion:
   prevent answers that confuse the old Heimdall-operator surface with ordinary app development

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/polygon-pos/0.4.0.md`
3. fix any reported structural errors
4. confirm parent-vs-child and deposit-vs-exit boundaries are explicit
5. confirm checkpointing and exit-readiness semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
