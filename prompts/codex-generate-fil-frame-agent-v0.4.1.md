==============================================================
AGENTHUB - FIL-FRAME 0.4.1 GENERATION BRIEF
Goal: Generate `agents/fil-frame/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and current FIL-Frame sources.
==============================================================

### 1 - Target Output

Write:

- `agents/fil-frame/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `agents/fil-frame/0.3.0.md`
- `parse/fil-frame-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
FIL-Frame sources, including:

- the official repository at `https://github.com/FIL-Builders/fil-frame`
- the current README and raw source files under `packages/hardhat` and `packages/nextjs`
- root and workspace package manifests
- relevant upstream documentation for Lighthouse, Pinata, or Filecoin verification behavior when needed for clarification

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: fil-frame`
- `Spec version: 0.4.0`
- `Library version: fil-frame^0.0.1 + @fil-frame/nextjs^0.1.0`
- `Primary language: typescript`
- `Homepage: https://github.com/FIL-Builders/fil-frame`

Lock the target to the current `fil-frame` repository surface and checked-in
workspace package versions before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: FIL-Frame `0.0.1` monorepo with Solidity contracts, Hardhat tasks, deploy scripts, and Next.js helpers expressed in the old YAML pack format
- current target: the same starter-template repo surface, but structured as a v0.4 pack with explicit monorepo boundaries, stronger upload-vs-deal separation, and clearer handling of legacy example code

You must identify and avoid stale assumptions, including any assumptions about:

- upload success meaning a Filecoin deal already exists
- provider-specific upload helpers and onchain deal submission being the same layer
- the legacy `Upload.tsx` component being the preferred current integration path
- frontend ABI fragments being safe to hand-maintain after redeploys

If an older pattern still exists only as a legacy example, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for FIL-Frame as a Filecoin starter-template monorepo, but it must
keep internal boundaries explicit.

You must distinguish:

- Hardhat contract and task surfaces
- deploy and explorer-verification automation
- frontend deal helper utilities
- provider-specific storage-onramp helpers
- legacy example UI components versus preferred current template paths

Specific rules:

- do not collapse upload prep and onchain proposal submission into one step
- do not flatten `DealClient` and `DealInfo` into the same contract role
- do not present `makeDealFunction` as a full contract ABI
- do not present the legacy upload component as production-ready without calling out its hard-coded addresses and mixed dependency model

If another layer is useful as context, call it out as a boundary rather than
treating it as the same API surface.

### 7 - Coverage Expectations

The generated file should cover the current FIL-Frame surface needed for real
project work, including:

- `DealClient` and `DealInfo`
- Hardhat tasks for proposal submission, readback, and verification
- deployment or ABI-generation automation
- frontend helpers for deal object creation and defaults
- Lighthouse and Pinata upload helpers where the repo exposes them
- common workflows for deploy, verify, upload, and submit
- troubleshooting and FAQ where source support is strong

Use `agents/fil-frame/0.3.0.md` only to audit coverage and preserve still-valid
operational insights. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol or feature:

- prefer the current repository sources and package manifests when relevant
- keep definitions close to the checked-in code and README semantics
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required FIL-Frame Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- upload and derive piece metadata before building the onchain request
- treat `piece_cid` as raw CommP bytes, not a display CID
- keep generated ABI refresh as a first-class post-deploy step
- use Filfox-specific verification only on Filecoin networks
- keep provider metadata polling and asynchronous upload state explicit
- prefer the Lighthouse-based flow for ordinary current template work

### 10 - Required FIL-Frame Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched source proves otherwise:

- that upload completion and Filecoin deal publication are the same thing
- that the old `Upload.tsx` component is the preferred default integration path
- that ABI fragments or contract addresses should be hand-copied without regeneration after deploys

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   deploy the contracts, upload through Lighthouse, seed deal defaults, and submit `makeDealProposal`
2. troubleshooting:
   debug a bad `piece_cid` encoding, stale ABI problem, or Filfox verification failure
3. design or tradeoff:
   choose between the Lighthouse helper path and the legacy Pinata-oriented example flow
4. version-confusion:
   prevent answers that flatten upload prep, contract submission, and provider lifecycle into one step

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/fil-frame/0.4.0.md`
3. fix any reported structural errors
4. confirm contract-vs-helper-vs-upload boundaries are explicit
5. confirm the legacy upload example is clearly treated as a non-default path
6. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
7. stop only when the validator passes
