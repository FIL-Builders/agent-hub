==============================================================
AGENTHUB - ENS 0.4.1 GENERATION BRIEF
Goal: Generate `agents/ens/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current ENS sources.
==============================================================

### 1 - Target Output

Write:

- `agents/ens/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/ens/0.3.0.md`
- `parse/ens-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
ENS sources, including:

- official ENS docs pages for resolution, reverse resolution, public resolver,
  name wrapper, registration, ENSIPs, and dapp integration
- `npm:@ensdomains/ensjs@4.2.2` package contents when relevant
- official release or compatibility notes when needed
- relevant ENS repositories at version-matched tags or commits when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: ens`
- `Spec version: 0.4.0`
- `Library version: current-docs + ensjs^4.2.2`
- `Primary language: typescript`
- `Homepage: https://docs.ens.domains`

Lock the target to the current ENS docs surface, with `ensjs@4.2.2` as the
JavaScript integration anchor.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: ENS core on-chain contracts with practitioner guidance
- current target: broader ENS platform guidance including modern dapp usage,
  resolution, reverse resolution, resolver interaction, and current ENSjs flows

You must identify and avoid stale assumptions, including any assumptions about:

- ENS being only low-level on-chain contract interaction
- reverse resolution and primary names being interchangeable without forward
  verification
- resolver support being assumed without capability checks
- generic name resolution intuition being sufficient without ENS-specific
  normalization, namehashing, resolver, and chain-boundary semantics

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for ENS as a developer platform, but it must keep product and
workflow boundaries explicit.

You must distinguish:

- ordinary dapp integration and name resolution
- registration and renewal flows
- resolver interaction and record management
- reverse resolution / primary name behavior
- low-level contract workflows and name wrapper operations

Specific rules:

- do not collapse ENSjs and low-level contract calls into one indistinguishable
  integration model
- do not treat reverse resolution as trustworthy without forward verification
- do not present public resolver capabilities as universal resolver guarantees

If a workflow is operationally important but belongs to a different layer, call
it out as a boundary rather than treating it as the default path.

### 7 - Coverage Expectations

The generated file should cover the current ENS surface needed for real project
work, including:

- forward resolution
- reverse resolution and primary name verification
- resolver interaction and capability checks
- registration and renewal flows where source support is strong
- name wrapper and wrapping implications where source support is strong
- ENSjs usage for ordinary application work
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/ens/0.3.0.md` only to audit coverage and preserve valid low-level
insights where they remain current. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required ENS Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- normalize names before hashing, lookup, or registration work
- distinguish forward resolution, reverse resolution, and primary-name
  verification
- use resolver capability checks before attempting writes
- keep ENSjs as the ordinary integration path and low-level contracts as the
  lower-level escape hatch
- preserve high-value guidance around registration timing, price estimation,
  wrapping implications, and resolver changes

### 10 - Required ENS Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that reverse resolution alone is enough to trust a primary name
- that every resolver supports every record type or write method
- that low-level contract interaction is always the preferred default over
  current ENSjs and documented integration flows

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   resolve and verify an ENS name or primary name in a dapp
2. troubleshooting:
   debug a resolver mismatch, reverse-resolution failure, or registration issue
3. design or tradeoff:
   choose between ENSjs and direct contract calls, or between wrapped and
   unwrapped name management
4. version-confusion:
   prevent an answer that overfocuses on raw contract calls when the task is
   ordinary ENS integration, or trusts reverse records without verification

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/ens/0.4.0.md`
3. fix any reported structural errors
4. confirm resolution, reverse, resolver, and registration boundaries are
   explicit
5. confirm ENSjs-vs-contract and verified-primary-name semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
