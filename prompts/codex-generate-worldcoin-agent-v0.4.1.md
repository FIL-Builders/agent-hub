==============================================================
AGENTHUB - WORLDCOIN 0.4.1 GENERATION BRIEF
Goal: Generate `agents/worldcoin/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current World developer sources.
==============================================================

### 1 - Target Output

Write:

- `agents/worldcoin/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/worldcoin/0.3.0.md`
- `parse/worldcoin-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
World developer sources, including:

- official World developer docs pages for Mini Apps, World ID, proof
  verification, and Developer Portal behavior
- `npm:@worldcoin/minikit-js@1.11.0`
- `npm:@worldcoin/idkit@4.0.9`
- `npm:@worldcoin/idkit-core@4.0.13`
- official release or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: worldcoin`
- `Spec version: 0.4.0`
- `Library version: current-docs + minikit-js^1.11.0 + idkit^4.0.9`
- `Primary language: typescript`
- `Homepage: https://developer.worldcoin.org`

Lock the target to the current World developer docs surface, with `minikit-js`
and `idkit` as the main package anchors.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: MiniKit JS + Developer Portal API v2
- current target: broader World developer surface with Mini Apps, World ID proof
  semantics, and backend verification boundaries made first-class

You must identify and avoid stale assumptions, including any assumptions about:

- client-side proof generation being sufficient without backend verification
- MiniKit command success being equivalent to trusted business completion
- payments, SIWE, World ID proofs, permissions, and signatures being one
  undifferentiated workflow
- World Chain, Mini Apps, and identity/proof workflows being interchangeable

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for World developer workflows, but it must keep product and
workflow boundaries explicit.

You must distinguish:

- MiniKit client commands
- World ID proof and verification flows
- SIWE and wallet-authentication flows
- payments and transaction flows
- backend verification and reconciliation logic

Specific rules:

- do not collapse World ID proof generation and proof verification into one step
- do not treat MiniKit client callbacks as authoritative without backend checks
- do not present permissions, payments, and identity proofs as the same trust model

If a workflow belongs to a different layer, call it out as a boundary rather
than treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current World developer surface needed for
real project work, including:

- MiniKit command usage
- World ID proof and verification flows
- wallet auth / SIWE flows
- payments and transaction requests
- permissions and notifications where source support is strong
- backend verification and reconciliation boundaries
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/worldcoin/0.3.0.md` only to audit coverage and preserve valid
MiniKit/portal insights where they remain current. It is not the primary
contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required World Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- always separate client-side command completion from backend verification
- distinguish World ID proof flows from wallet-auth flows and from payment flows
- keep correlation IDs and reconciliation data explicit
- preserve high-value guidance around permissions, allowlists, and safe typed-data usage
- keep World Chain or transaction behavior separate from proof-of-personhood semantics

### 10 - Required World Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that client-side proof or signature results are trustworthy without backend verification
- that SIWE, World ID proof, and payment completion are interchangeable trust signals
- that MiniKit client success alone is the source of truth for business completion

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   verify a World ID or MiniKit-driven workflow with correct server-side checks
2. troubleshooting:
   debug proof verification mismatch, permission failure, or payment reconciliation issue
3. design or tradeoff:
   choose between wallet-auth, proof, and payment flows for a product requirement
4. version-confusion:
   prevent an answer that trusts client outputs directly or conflates identity,
   payment, and signature workflows

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/worldcoin/0.4.0.md`
3. fix any reported structural errors
4. confirm MiniKit-vs-backend and proof-vs-payment-vs-auth boundaries are explicit
5. confirm backend verification and reconciliation semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
