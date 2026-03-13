==============================================================
AGENTHUB - FLOW 0.4.1 GENERATION BRIEF
Goal: Generate `agents/flow/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current Flow sources.
==============================================================

### 1 - Target Output

Write:

- `agents/flow/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/flow/0.3.0.md`
- `parse/flow-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Flow sources, including:

- official Flow docs for FCL, transactions, scripts, Cadence, accounts, events,
  and access-node behavior
- `npm:@onflow/fcl@1.21.9`
- `npm:@onflow/sdk@1.13.7`
- official release or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: flow`
- `Spec version: 0.4.0`
- `Library version: current-docs + @onflow/fcl^1.21.9 + @onflow/sdk^1.13.7`
- `Primary language: javascript`
- `Homepage: https://developers.flow.com/build/tools/clients/fcl-js`

Lock the target to the current Flow docs surface, with FCL as the main
application-facing package and `@onflow/sdk` as the lower-level contract anchor.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Flow Access Node WebSocket Stream API
- current target: broader Flow developer workflows with FCL auth, scripts,
  transactions, tx status handling, and low-level SDK boundaries made first-class

You must identify and avoid stale assumptions, including any assumptions about:

- Flow integration being mostly a websocket streaming problem
- wallet auth, scripts, and transactions sharing the same trust model
- Cadence arguments behaving like generic EVM ABI encoding
- FCL and the low-level SDK being interchangeable abstraction layers

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Flow as a developer platform, but it must keep workflow
boundaries explicit.

You must distinguish:

- FCL app and wallet integration flows
- low-level SDK interaction builders and transport flows
- Cadence scripts versus Cadence transactions
- transaction submission versus transaction-status observation
- event or stream subscriptions versus ordinary request-response reads

Specific rules:

- do not present Cadence transactions as EVM-style contract calls
- do not flatten scripts and transactions into one execution model
- do not present FCL wallet auth as available in the same way on server-only runtimes
- do not treat the old websocket stream API as the primary developer entrypoint

If a workflow belongs to a different layer, call it out as a boundary rather
than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Flow surface needed for real project
work, including:

- FCL configuration
- current-user auth flows
- script queries
- transaction mutation and tx-status waiting
- account and block reads
- low-level SDK builders where source support is strong
- event subscription or stream boundaries where source support is strong
- troubleshooting and FAQ where source support is strong

Use `agents/flow/0.3.0.md` only to audit coverage and preserve valid access-node
stream insights where they remain current. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Flow Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- configure FCL explicitly with access-node and wallet discovery settings
- keep wallet auth separate from chain read and write execution semantics
- distinguish Cadence scripts from Cadence transactions
- treat tx IDs and transaction-status polling as separate from submission
- keep FCL versus low-level SDK layering explicit

### 10 - Required Flow Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that Flow app development is primarily the websocket stream API
- that Cadence interactions are interchangeable with generic EVM patterns
- that browser wallet flows and server-side execution have the same runtime requirements

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   authenticate a user, run a Cadence script, submit a transaction, and watch its status
2. troubleshooting:
   debug broken FCL config, argument encoding mistakes, or stuck tx-status polling
3. design or tradeoff:
   choose between FCL and low-level SDK control for a Flow app
4. version-confusion:
   prevent answers that overfocus on streaming or impose EVM mental models on Cadence

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/flow/0.4.0.md`
3. fix any reported structural errors
4. confirm FCL-vs-SDK and script-vs-transaction boundaries are explicit
5. confirm wallet-auth runtime constraints are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
