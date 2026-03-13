==============================================================
AGENTHUB - HARDHAT 0.4.1 GENERATION BRIEF
Goal: Generate `agents/hardhat/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and version-matched Hardhat 3 sources.
==============================================================

### 1 - Target Output

Write:

- `agents/hardhat/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/hardhat.out`
- `agents/hardhat/0.2.0.md`
- `parse/hardhat-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Hardhat 3 sources, including:

- `npm:hardhat@3.1.12` package contents and type declarations
- official Hardhat 3 docs pages
- official Hardhat 3 explanations pages
- the Hardhat repository at a version-matched tag or commit when needed
- official migration, release, or compatibility notes when needed

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: hardhat`
- `Spec version: 0.4.0`
- `Library version: ^3.1.12`
- `Primary language: typescript`
- `Homepage: https://hardhat.org/docs/`

Lock the target to Hardhat `^3.1.12` before extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- prior pack target: Hardhat `^2.22.0`
- current target: Hardhat `^3.1.12`
- this is a major-version transition

You must identify and avoid carrying forward old Hardhat 2 assumptions,
including any assumptions about:

- `hre.ethers` being a core Hardhat primitive
- Hardhat 2 plugin-extension APIs being the preferred model
- legacy config shapes or task flows that are no longer the current default

If an older pattern still exists only for compatibility, do not present it as
the preferred current approach.

### 6 - Ecosystem Boundary Rules

This pack is for Hardhat core, not for a plugin bundle.

You must distinguish:

- Hardhat core exports and core runtime behavior
- first-party plugins or companion tooling
- third-party ecosystem helpers

Specific rule:

- do not treat ethers, viem, or verification helpers as core Hardhat APIs
  unless the authoritative Hardhat core sources show they are part of the
  locked target surface

If a plugin surface is operationally important, call it out as a boundary or
dependency instead of folding it into the core API groups.

### 7 - Coverage Expectations

The generated file should cover the current Hardhat 3 core surface needed for
real project work, including:

- configuration authoring
- secure config values
- runtime creation and inspection
- programmatic network management
- build-system access
- artifact access
- library-wide workflows
- troubleshooting and FAQ where source support is strong

Use `agents/hardhat/0.2.0.md` only to audit coverage and identify old high-value
insights that should not regress. It is not the primary contract source.

### 8 - Definition Quality

For each documented symbol:

- prefer version-matched published package declarations or source files
- use official docs for high-level guidance and workflows
- use `parse/hardhat.out` only as a cross-check
- do not source `Definition` blocks from `agents/hardhat/0.2.0.md`
- compress only when the compression does not change meaning
- if the source set is ambiguous, mark the point as `Needs verification`

### 9 - Required Hardhat 3 Guidance

Make sure the final pack teaches these behaviors clearly when supported by the
source material:

- use `defineConfig(...)` for current config authoring
- use `configVariable(...)` for machine-specific or secret values
- use the Hardhat keystore as an approved secret-management path when relevant
- use `network.connect(...)` for explicit programmatic connections
- close `NetworkConnection` objects in long-running or high-churn scripts
- use `artifacts` and `solidity` instead of guessing output paths or shelling
  out blindly
- respect the Node.js support floor for Hardhat 3 before debugging higher-level
  failures

### 10 - Required Hardhat 3 Exclusions

Do not let the final pack imply any of the following unless a cited,
version-matched core source proves otherwise:

- that `hre.ethers` is part of the core Hardhat 3 contract
- that old Hardhat 2 extension APIs are the recommended way to build new code
- that plugin-specific workflows are generic Hardhat core workflows

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   create a new Hardhat 3 project config using `defineConfig(...)` and
   `configVariable(...)`
2. troubleshooting:
   debug a missing or lazily resolved config variable or stale artifact issue
3. design or tradeoff:
   choose between CLI-only flow and programmatic `network.connect(...)` or
   `solidity.build(...)`
4. version-confusion:
   prevent a Hardhat 2-style answer that incorrectly relies on `hre.ethers`
   as a core Hardhat primitive

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/hardhat/0.4.0.md`
3. fix any reported structural errors
4. confirm the pack does not teach Hardhat 2 compatibility patterns as the
   preferred Hardhat 3 model
5. confirm core-vs-plugin boundaries are explicit
6. compare the regenerated pack against the baseline `agents/hardhat/0.4.0.md`
   when requested by the parent task
7. return a structured handoff report that the parent can inspect without
   needing direct file access to the forked workspace
8. stop only when the validator passes
