==============================================================
AGENTHUB - CODEX AGENT PACK RUNBOOK (v0.4.0)
Goal: Provide one exact execution procedure for generating v0.4.0
      documentation packs and agent packs with Codex workers.
==============================================================

## 1 - Scope

This runbook defines the operational procedure for generating:

- Markdown documentation packs
- AgentHub Expert Knowledge Packs in Open Agent Spec v0.4.0 format

Use this runbook together with:

- `prompts/documentation-prompt-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `spec/open-agent-spec-v0.4.0.md`
- the relevant codex worker prompt for the task

## 2 - Execution Order

Follow these steps in order:

1. Lock the target library or API version.
2. Gather the initial local inputs provided by the task.
3. Acquire authoritative upstream sources for the locked version.
4. Build or refresh the documentation pack.
5. Generate the v0.4.0 agent pack.
6. Validate structure and provenance.
7. Stop only when the completion criteria are satisfied.

Do not skip version locking.

## 3 - Version Locking

Before extracting definitions or examples, lock the target version.

Use this priority order:

1. explicit invariant field in the task
2. explicit version context in the task
3. version pinned by the source bundle or package reference
4. best-supported inferred version, marked `Needs verification`

When the task supplies a semver range, record:

- the declared target range in the pack
- the exact upstream source ref used for extraction when available

Examples:

- declared target: `^18.3.0`
- extracted from: `react@18.3.1`
- extracted from: `facebook/react@v18.3.1`

## 4 - Source Hierarchy

Use sources in this priority order:

1. version-matched upstream source code
2. version-matched type declarations
3. version-matched official documentation
4. version-matched official examples
5. version-matched release notes, migration notes, or RFCs
6. local bundles and prior AgentHub packs for coverage audit only

The source hierarchy applies per symbol and per definition, not just per task.

## 5 - Source Selection Rules

When several plausible sources exist:

- prefer the most version-specific source
- prefer the most contract-authoritative source for `Definition`
- prefer official docs for high-level guidance
- prefer examples and release notes for workflows and caveats

Examples:

- `Definition` for a TypeScript library should usually come from declarations or
  source types
- `Guidance` may come from docs, examples, and release notes
- `Workflow` sections may combine docs and examples

## 6 - Conflict Resolution

When sources disagree, resolve them in this order:

1. version-matched source code or declarations
2. version-matched official docs
3. version-matched official examples
4. existing generated packs

If the conflict cannot be resolved confidently:

- preserve the stronger contract source
- mark the conflicting point as `Needs verification`
- record the mismatch in `Design Notes`

## 7 - Allowed Use Of Prior Packs

Prior generated AgentHub packs may be used only for:

- coverage comparison
- grouping comparison
- identifying likely missing symbols or workflows

Prior packs must not be the primary source for:

- `Definition` blocks
- version decisions
- authoritative symbol contracts

If a prior pack is the only available source for a useful item, record that
fact explicitly and mark the item `Needs verification` unless the task says
otherwise.

## 8 - Provenance Format

The generated output must make provenance auditable.

### Documentation Pack Provenance

The documentation pack must include:

- target version in `## Snapshot`
- source set summary in `## Snapshot`
- concrete source notes per symbol or primitive
- upstream refs in `## References`

### Agent Pack Provenance

The agent pack must include:

- `Library version` in `## Snapshot`
- `Source set` in `## Snapshot`
- `Source:` under every `Definition`
- enough information in `## Design Notes` to understand the exact upstream
  material used

Preferred `Source:` forms:

- `repo@tag:path`
- `repo@commit:path`
- `npm@version:path`
- exact official documentation URL

Avoid vague source labels when a concrete upstream ref is available.

## 9 - Documentation Pack Procedure

When generating a documentation pack:

1. lock the target version
2. inspect the provided local inputs
3. acquire authoritative upstream sources as needed
4. inventory the public surface area
5. separate contracts from guidance
6. draft the documentation pack in the required section order
7. record the source set and source notes
8. mark unresolved points as `Needs verification`

## 10 - Agent Pack Procedure

When generating an agent pack:

1. lock the target version
2. read the v0.4.0 spec and master prompt
3. read the documentation pack
4. inspect or acquire authoritative upstream sources for symbol contracts
5. map the public surface into groups and exports
6. write the pack in strict section order
7. ensure every symbol has the required fields
8. ensure every `Definition` has a concrete `Source`
9. validate the pack

## 11 - Structure Rules For Deterministic Parsing

The worker must preserve:

- `## Snapshot` as labeled bullets plus optional labeled lists
- `**Exports**` as a Markdown list
- symbol fields in strict order
- optional library-wide sections only when supported by source material

Do not vary field order for convenience.

## 12 - Completion Criteria

A generation run is complete only when:

1. the output file exists at the requested path
2. the target version is locked and stated clearly
3. the source set is recorded clearly
4. the output follows the required structure
5. the validator passes when one is provided
6. unresolved gaps are marked `Needs verification`

## 13 - Stop Conditions

Stop and report `Needs verification` when:

- the target version cannot be locked confidently
- the upstream source set is version-mismatched in a material way
- the contract for a symbol cannot be sourced cleanly
- sources disagree and the hierarchy does not resolve the conflict

Do not invent definitions to fill gaps.

## 14 - Final Worker Report

At the end of a run, report:

- output path
- locked target version
- local files used
- upstream sources fetched or inspected
- invariant fields preserved
- remaining `Needs verification` gaps
