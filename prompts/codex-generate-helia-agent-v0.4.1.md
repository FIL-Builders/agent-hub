==============================================================
AGENTHUB - HELIA 0.4.1 GENERATION BRIEF
Goal: Generate `agents/helia/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current Helia sources.
==============================================================

### 1 - Target Output

Write:

- `agents/helia/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/helia/0.2.0.md`
- `parse/helia.out`
- `parse/helia-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Helia sources, including:

- `npm:helia@6.0.21`
- `npm:@helia/unixfs@7.0.4`
- official Helia docs and TypeDoc pages
- official release or compatibility notes when needed
- relevant Helia repositories at version-matched tags or commits when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: helia`
- `Spec version: 0.4.0`
- `Library version: helia^6.0.21 + @helia/unixfs^7.0.4`
- `Primary language: typescript`
- `Homepage: https://github.com/ipfs/helia`

Lock the target to `helia^6.0.21` and `@helia/unixfs^7.0.4` before extracting
contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Helia `^5.5.0` with a narrow core/defaults/constants focus
- current target: broader current Helia surface for ordinary IPFS/content-addressed app work

You must identify and avoid stale assumptions, including any assumptions about:

- Helia usage being only `createHelia()` plus defaults inspection
- browser and server persistence strategies being interchangeable
- content routing/provider errors being the same thing as UnixFS or blockstore
  API misuse
- generic IPFS intuition being sufficient without Helia-specific node,
  persistence, and module-boundary guidance

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Helia as a JavaScript IPFS implementation, but it must keep
surface boundaries explicit.

You must distinguish:

- core Helia node setup and lifecycle
- UnixFS application-level file workflows
- lower-level block/CID/content-routing behavior
- libp2p and transport/service configuration boundaries
- browser-vs-server persistence and environment behavior

Specific rules:

- do not collapse core Helia and `@helia/unixfs` into one vague API surface
- do not treat content-routing failures as generic file-API failures
- do not blur browser ephemeral nodes and persistent server-side nodes into the
  same operational model

If another layer is useful as context, call it out as a boundary rather than
 treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current Helia surface needed for real
project work, including:

- node creation and lifecycle
- UnixFS add/cat and content workflows
- blockstore/CID handling where source support is strong
- routing/provider behavior and common failure modes
- libp2p/default config boundaries
- browser-vs-server persistence guidance
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/helia/0.2.0.md` only to audit coverage and preserve still-valid
insights where they remain current. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer official docs and version-matched package contents when relevant
- keep definitions close to the authoritative source wording and semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Helia Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- distinguish core node setup from UnixFS file operations
- explain persistence and environment choices explicitly for browser vs server
- keep content-routing/provider failure modes separate from API misuse
- preserve strong defaults guidance without overfocusing on defaults inspection
- preserve high-value guidance around routing, provider availability, and
  content-addressed retrieval workflows

### 10 - Required Helia Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that browser and server persistence models are interchangeable
- that UnixFS helpers fully explain lower-level block and routing behavior
- that generic IPFS intuition fully captures Helia-specific operational choices

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   create a Helia node, add content with UnixFS, and retrieve it safely
2. troubleshooting:
   debug a provider/routing failure or a browser-persistence mismatch
3. design or tradeoff:
   choose between ephemeral browser nodes and persistent server-side nodes
4. version-confusion:
   prevent an answer that overfocuses on narrow old defaults/constants material
   instead of current Helia usage

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/helia/0.4.0.md`
3. fix any reported structural errors
4. confirm core-vs-unixfs and browser-vs-server boundaries are explicit
5. confirm routing/provider failure semantics are explicit
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
