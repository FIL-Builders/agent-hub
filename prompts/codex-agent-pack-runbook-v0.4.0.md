==============================================================
AGENTHUB - CODEX AGENT PACK RUNBOOK (v0.4.0)
Goal: Provide one exact execution procedure for generating v0.4.0
      documentation packs and agent packs with Codex workers.
==============================================================

## 1 - Scope

This runbook defines the operational procedure for generating:

- Markdown documentation packs
- AgentHub Expert Knowledge Packs in Open Agent Spec v0.4.0 format
- derived Claude-compatible skill distributions for those packs

Use this runbook together with:

- `prompts/documentation-prompt-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `spec/open-agent-spec-v0.4.0.md`
- the relevant codex worker prompt for the task

## 2A - Agent Selection

Use the sub-agent type that matches the execution needs of the run.

- use `worker` for any generation, validation, comparison, or review task that
  needs shell access, filesystem writes, or command execution
- use `helper-*` only for reasoning-only assistance that does not need
  `exec_command`

Current execution note:

- in this environment, `helper-*` agents may fail when a task needs shell
  access
- treat that as an execution-harness constraint, not as a pack-generation rule
- when in doubt, run pack generation and evaluation with a `worker`

## 3 - Execution Order

Follow these steps in order:

1. Lock the target library or API version.
2. Identify the prior pack target or prior major-version baseline.
3. Run a version delta audit.
4. Gather the initial local inputs provided by the task.
5. Run an ecosystem boundary audit.
6. Acquire authoritative upstream sources for the locked version.
7. Build or refresh the documentation pack.
8. Generate the v0.4.0 agent pack.
9. Generate the derived Claude-compatible skill distribution.
10. Validate structure and provenance.
11. Critique the pack against real task archetypes.
12. Revise weak areas and re-check the outputs.
13. Stop only when the completion criteria are satisfied.

Do not skip version locking.

## 4 - Version Locking

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

## 5 - Source Hierarchy

Use sources in this priority order:

1. version-matched upstream source code
2. version-matched type declarations
3. version-matched official documentation
4. version-matched official examples
5. version-matched release notes, migration notes, or RFCs
6. local bundles and prior AgentHub packs for coverage audit only

The source hierarchy applies per symbol and per definition, not just per task.

## 5A - Version Delta Audit

Before drafting either pack, identify:

- the target version of the previous pack, if one exists
- the currently locked target version
- whether the version change is major, minor, or primarily documentation-level
- which assumptions from the previous pack are likely to be stale

Record at least:

- the older mental model that may leak into the new pack
- the current replacement pattern
- whether the old pattern is deprecated, compatibility-only, or simply out of scope

Examples:

- a runtime helper that used to be core is now plugin-provided
- an old config style still parses but is no longer the preferred authoring model
- an old task flow still exists but is not the recommended path for new code

## 5B - Ecosystem Boundary Audit

Before drafting either pack, classify the source surface into:

1. core package or platform surface
2. first-party plugin, adapter, or companion-package surface
3. third-party ecosystem surface

Then decide:

- what belongs in the pack as first-class coverage
- what should be called out as a boundary
- what should be excluded from the pack to avoid confusing an agent

Do not silently blend companion surfaces into the core pack when that would
teach the wrong mental model.

## 6 - Source Selection Rules

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

## 7 - Conflict Resolution

When sources disagree, resolve them in this order:

1. version-matched source code or declarations
2. version-matched official docs
3. version-matched official examples
4. existing generated packs

If the conflict cannot be resolved confidently:

- preserve the stronger contract source
- mark the conflicting point as `Needs verification`
- record the mismatch in `Design Notes`

## 8 - Allowed Use Of Prior Packs

Prior generated AgentHub packs may be used only for:

- coverage comparison
- grouping comparison
- identifying likely missing symbols or workflows
- identifying strong operational insights that should not regress

Prior packs must not be the primary source for:

- `Definition` blocks
- version decisions
- authoritative symbol contracts

If a prior pack is the only available source for a useful item, record that
fact explicitly and mark the item `Needs verification` unless the task says
otherwise.

When a prior pack contains stronger operational guidance than the current draft:

- treat it as a benchmark insight, not as source truth
- re-ground the insight in authoritative upstream material before carrying it
  forward
- preserve it if it remains valid and improves task performance

## 9 - Provenance Format

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

## 10 - Documentation Pack Procedure

When generating a documentation pack:

1. lock the target version
2. identify the prior-pack target or prior major-version baseline
3. run the version delta audit
4. inspect the provided local inputs
5. run the ecosystem boundary audit
6. acquire authoritative upstream sources as needed
7. inventory the public surface area
8. inventory the source set by role:
   - contract source
   - guidance source
   - workflow source
   - migration source
   - cross-check-only source
9. separate contracts from guidance
10. extract deprecated and compatibility-only surface area
11. draft the documentation pack in the required section order
12. record the source set and source notes
13. mark unresolved points as `Needs verification`

## 11 - Agent Pack Procedure

When generating an agent pack:

1. lock the target version
2. identify the prior-pack target or prior major-version baseline
3. run the version delta audit
4. read the v0.4.0 spec and master prompt
5. read the documentation pack
6. run the ecosystem boundary audit
7. inspect or acquire authoritative upstream sources for symbol contracts
8. map the public surface into groups and exports
9. write the pack in strict section order
10. ensure every symbol has the required fields
11. ensure every `Definition` has a concrete `Source`
12. validate the canonical pack
13. generate the matching Claude-compatible skill distribution
14. validate the generated Claude-compatible skill distribution
15. run a critique pass against task archetypes
16. revise the pack where the critique finds weak operational guidance, then re-finalize the derived distribution

## 12 - Critique Pass

After the first structurally valid draft, run a critique pass before accepting
the pack.

Test the draft mentally or explicitly against three task archetypes:

1. implementation task
2. troubleshooting or debugging task
3. design or tradeoff task
4. version-confusion task where an old example or prior-pack pattern could lead
   to the wrong current answer

Ask:

- would the pack help an agent choose the correct primitive?
- would the pack help an agent avoid the common mistake?
- would the pack surface the key preconditions and sequencing rules?
- would the pack distinguish commonly confused alternatives?
- would the pack support a concise, correct implementation?
- would the pack keep an agent from using the previous major-version mental
  model when that model is now wrong?
- would the pack keep an agent from confusing core APIs with plugin or
  companion-package APIs?

If the answer is no for an important area, revise the pack before finishing.

## 13 - Revision Priorities

When the critique pass finds weaknesses, fix them in this order:

1. missing or weak decision rules
2. missing failure modes or troubleshooting guidance
3. stale version guidance or compatibility-only patterns presented as current
4. missing workflow sequencing or preconditions
5. missing symbol coverage
6. weak examples

Do not expand the pack with generic prose just to make it longer.
Prefer targeted revisions that improve task performance.

## 14 - Structure Rules For Deterministic Parsing

The worker must preserve:

- `## Snapshot` as labeled bullets plus optional labeled lists
- `**Exports**` as a Markdown list
- symbol fields in strict order
- optional library-wide sections only when supported by source material

Do not vary field order for convenience.

## 15 - Forked Workspace Handoff

When the generation run happens in a forked workspace that the parent thread
cannot inspect directly, the worker must treat the run as both a generation job
and a comparison or review job.

In that case, the worker must:

1. generate and validate the documentation pack or agent pack in the forked workspace
2. if an agent pack was generated, also generate and validate the matching Claude-compatible skill distribution
3. compare the regenerated output against the baseline file requested by the task
4. return a structured handoff report in the final response

The structured handoff report must include:

- output path
- generated Claude-compatible skill path when applicable
- baseline path, when one was provided
- validation result
- locked target version
- local files used
- upstream sources fetched or inspected
- section-level diff summary
- added or removed groups, exports, workflows, troubleshooting entries, FAQ items,
  or resources when relevant
- top regressions or improvements relative to the baseline
- explicit recommendation:
  - keep baseline
  - replace baseline
  - selectively patch baseline

When the parent thread needs an exact final file in the main workspace, do not
assume the forked workspace output will be available. In that case:

- the worker's output is advisory unless the environment guarantees shared writes
- the parent thread should apply the final changes locally using the worker's
  report, or the generation should be re-run locally in the main thread

## 16 - Completion Criteria

A generation run is complete only when:

1. the output file exists at the requested path
2. the target version is locked and stated clearly
3. the prior-pack target or prior major-version baseline has been identified
4. the version delta audit has been completed
5. the ecosystem boundary audit has been completed
6. the source set is recorded clearly
7. the output follows the required structure
8. the validator passes when one is provided
9. if the run produced an agent pack, the matching Claude-compatible skill distribution exists
10. if the run produced an agent pack, the generated Claude-compatible skill distribution validates
11. a critique pass has been completed
12. the pack has been revised if the critique exposed important weaknesses
13. unresolved gaps are marked `Needs verification`
14. the pack does not teach deprecated or compatibility-only patterns as the
    preferred current approach
15. if the run happened in a forked workspace, the final response contains the
    full structured handoff report

## 17 - Stop Conditions

Stop and report `Needs verification` when:

- the target version cannot be locked confidently
- the upstream source set is version-mismatched in a material way
- the contract for a symbol cannot be sourced cleanly
- sources disagree and the hierarchy does not resolve the conflict
- the pack remains weak on a critical task archetype and the source material is
  insufficient to improve it responsibly
- the boundary between core and plugin or companion-package surface cannot be
  established confidently
- the prior major-version model conflicts materially with current sources and
  cannot be resolved safely

Do not invent definitions to fill gaps.

## 18 - Final Worker Report

At the end of a run, report:

- output path
- generated Claude-compatible skill path when applicable
- locked target version
- local files used
- upstream sources fetched or inspected
- invariant fields preserved
- task archetypes used in the critique pass
- major weaknesses found and what was changed to address them
- remaining `Needs verification` gaps
