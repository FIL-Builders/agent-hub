==============================================================
AGENTHUB - PYTH 0.4.1 GENERATION BRIEF
Goal: Generate `agents/pyth/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current Pyth sources.
==============================================================

### 1 - Target Output

Write:

- `agents/pyth/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/pyth/0.3.0.md`
- `parse/pyth-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Pyth sources, including:

- official Pyth docs pages for price feeds, Hermes, Entropy, Express Relay, and Lazer
- `npm:@pythnetwork/client@2.22.1`
- `npm:@pythnetwork/hermes-client@3.1.0`
- `npm:@pythnetwork/pyth-sdk-solidity@4.3.1`
- `npm:@pythnetwork/entropy-sdk-solidity@2.2.1`
- `npm:@pythnetwork/express-relay-js@0.29.0`
- `npm:@pythnetwork/pyth-lazer-sdk@6.0.0`
- official release or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: pyth`
- `Spec version: 0.4.0`
- `Library version: current-docs + client^2.22.1 + hermes^3.1.0 + pyth-sdk-solidity^4.3.1 + entropy-sdk-solidity^2.2.1 + express-relay-js^0.29.0 + pyth-lazer-sdk^6.0.0`
- `Primary language: typescript`
- `Homepage: https://docs.pyth.network`

Lock the target to the current Pyth docs surface with the package anchors above.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Entropy + Express Relay + Lazer with older package anchors
- current target: broader current Pyth developer surface including price feeds and Hermes, plus refreshed Entropy, Express Relay, and Lazer anchors

You must identify and avoid stale assumptions, including any assumptions about:

- Pyth meaning only randomness, relay, or low-latency verification surfaces
- price update retrieval and on-chain verification being the same thing
- Hermes delivery, EVM verification, Entropy randomness, and Express Relay auctions being one undifferentiated protocol flow
- generic oracle intuition being sufficient without Pyth-specific freshness, fee, verification, and chain-boundary semantics

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Pyth as a developer platform, but it must keep product and
workflow boundaries explicit.

You must distinguish:

- price-feed retrieval and update delivery
- on-chain verification and update consumption
- Entropy randomness flows
- Express Relay auction flows
- Lazer low-latency verification flows

Specific rules:

- do not collapse Hermes or price delivery into on-chain verification semantics
- do not treat Entropy or Express Relay as interchangeable with price-feed usage
- do not present generic oracle update handling as sufficient without Pyth-specific fee and freshness behavior

If a workflow is useful as context but belongs to a different surface, call it
out as a boundary rather than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Pyth surface needed for real
project work, including:

- price-feed retrieval and update delivery
- EVM verification/update consumption where source support is strong
- Entropy randomness requests and callback behavior
- Express Relay client flows where source support is strong
- Lazer verification and fee behavior where source support is strong
- workflow and troubleshooting guidance across these surfaces
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/pyth/0.3.0.md` only to audit coverage and preserve valid
Entropy/Express/Lazer guidance where it remains current. It is not the primary
contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Pyth Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- distinguish delivery of updates from on-chain verification and consumption
- keep price-feed, Entropy, Express Relay, and Lazer workflows clearly separated
- preserve fee calculation and callback-gas safety guidance where relevant
- keep freshness, verification, and chain-context checks explicit
- preserve high-value guidance around provider selection, async status handling,
  and safe use of update payloads

### 10 - Required Pyth Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that retrieved update payloads are trustworthy without verification where verification is required
- that Entropy, price feeds, Express Relay, and Lazer are interchangeable
- that generic oracle or MEV intuition fully captures Pyth-specific fee and protocol behavior

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   retrieve Pyth data, verify or consume it correctly, and handle fees or freshness safely
2. troubleshooting:
   debug stale data, verification failure, callback failure, or relay status confusion
3. design or tradeoff:
   choose between ordinary price-feed flows, Entropy, Express Relay, and Lazer for a given task
4. version-confusion:
   prevent an answer that reuses stale package assumptions or collapses Pyth surfaces into one generic oracle model

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/pyth/0.4.0.md`
3. fix any reported structural errors
4. confirm price-feed, Entropy, Express Relay, and Lazer boundaries are explicit
5. confirm fee, verification, and freshness semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
