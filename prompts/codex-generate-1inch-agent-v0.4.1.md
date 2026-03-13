==============================================================
AGENTHUB - 1INCH 0.4.1 GENERATION BRIEF
Goal: Generate `agents/1inch/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current 1inch sources.
==============================================================

### 1 - Target Output

Write:

- `agents/1inch/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/1inch/0.3.0.md`
- `parse/1inch-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
1inch sources, including:

- official 1inch developer docs pages for swap, quote, routing, and execution flows
- `npm:@1inch/fusion-sdk@2.4.6`
- official release or compatibility notes when needed
- relevant 1inch repositories at version-matched tags or commits when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: 1inch`
- `Spec version: 0.4.0`
- `Library version: current-docs + fusion-sdk^2.4.6`
- `Primary language: typescript`
- `Homepage: https://docs.1inch.io`

Lock the target to the current 1inch docs surface, with `@1inch/fusion-sdk@2.4.6`
as the SDK anchor.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Aggregation REST API v5 + Fusion SDK
- current target: current 1inch routing, quote, approval, execution, and Fusion flows

You must identify and avoid stale assumptions, including any assumptions about:

- quote and execution payloads being interchangeable
- approval, permit, routing, and final submission being one undifferentiated workflow
- Fusion order flow being the same as ordinary router-based swaps
- generic DEX or generic EVM swap intuition being sufficient without 1inch-specific spender,
  routing, and API-surface semantics

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for 1inch integration workflows, but it must keep product and
workflow boundaries explicit.

You must distinguish:

- quote and routing APIs
- approval or permit preparation
- final swap/execution transaction construction
- Fusion order workflows
- raw wallet/RPC submission behavior

Specific rules:

- do not collapse quote and executable swap construction into one request model
- do not treat Fusion orders as ordinary router-call swaps
- do not present spender/router addresses as hardcoded constants when the docs
  or APIs require per-chain lookup

If a workflow is useful as context but belongs to a different layer, call it out
as a boundary rather than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current 1inch surface needed for real
project work, including:

- allowance and approval flows
- quoting and route validation
- final swap/execution transaction building
- transaction broadcast/submission boundaries where source support is strong
- Fusion order workflows and pagination where source support is strong
- chain-aware routing and spender lookup guidance
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/1inch/0.3.0.md` only to audit coverage and preserve valid swap/Fusion
insights where they remain current. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required 1inch Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- check allowance or use permit before execution flows that require token spend
- use quote or route discovery for validation, then a separate execution step
- treat chain IDs, spender lookup, and transaction submission boundaries as
  safety-critical
- distinguish ordinary swap execution from Fusion order creation and lifecycle
- preserve high-value guidance around slippage, integer token amounts, and
  signer/network mismatch failure modes

### 10 - Required 1inch Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that quote responses are directly executable on-chain
- that Fusion orders and standard swap transactions are interchangeable
- that spender/router addresses should be hardcoded across chains

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   check allowance, quote a route, and build an executable 1inch swap flow
2. troubleshooting:
   debug chain mismatch, spender mismatch, slippage, or execution-payload confusion
3. design or tradeoff:
   choose between ordinary aggregation execution and Fusion order flow
4. version-confusion:
   prevent an answer that treats old v5 examples or generic swap intuition as
   equivalent to the current documented 1inch surface

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/1inch/0.4.0.md`
3. fix any reported structural errors
4. confirm quote-vs-execution and swap-vs-Fusion boundaries are explicit
5. confirm chain-aware spender and submission semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
