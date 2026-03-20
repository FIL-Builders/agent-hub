---
hide_table_of_contents: true
---

# Authoritative Documents For v0.4 Pack Generation

This guide defines the authority chain for AgentHub `v0.4.0` pack generation.
It explains which documents are normative, which documents are operational, which
documents are generated outputs, and which document wins when two artifacts
appear to disagree.

Use this guide whenever you are:

* generating a new `v0.4.0` documentation pack
* generating a new `v0.4.0` expert knowledge pack
* reviewing prompt changes
* validating whether a generated output is correct
* comparing two candidate pack outputs

## Why This Guide Exists

The `v0.4.0` workflow now has multiple important documents:

* the spec
* the prompts
* the codex runbook
* the validator
* generated documentation packs
* generated agent packs
* generated Claude-compatible skill distributions
* evaluation guidance

That is the right shape for the workflow, but only if it is clear which files
are authoritative for which kind of decision.

This guide removes ambiguity.

## Authority Model

There are four classes of documents in the `v0.4.0` system:

1. normative documents
2. operational documents
3. generated artifacts
4. evaluation documents

Each class has a different job. Do not treat them as interchangeable.

## 1. Normative Documents

Normative documents define what a valid `v0.4.0` pack is.

These are the highest-authority repository documents for pack structure.

### Primary normative document

* `spec/open-agent-spec-v0.4.0.md`

This file is the source of truth for:

* required top-level sections
* required field names
* symbol structure
* field ordering
* allowed `Kind` values
* optional sections
* deterministic parsing rules
* validation expectations

If another repo document disagrees with the v0.4.0 spec about pack structure,
the spec wins.

### Practical rule

If you are asking:

* "What sections must exist?"
* "What is the required shape of `## Snapshot`?"
* "Is `**Exports**` a Markdown list?"
* "What fields must every symbol contain?"

then `spec/open-agent-spec-v0.4.0.md` is authoritative.

## 2. Operational Documents

Operational documents define how to produce valid packs.

They do not override the spec. They translate the spec into repeatable
generation procedures.

### Core prompt documents

* `prompts/documentation-prompt-v0.4.0.md`
* `prompts/master-prompt-v0.4.0.md`

These files are authoritative for:

* the intended output targets for `v0.4.0`
* how a model should draft a documentation pack
* how a model should draft an expert knowledge pack
* what quality checks the generator should perform before emitting output

When they disagree with the spec on structure, the spec wins.
When they add generation detail that the spec does not cover, the prompts govern
the generation task.

### Codex execution documents

* `prompts/codex-agent-pack-runbook-v0.4.0.md`
* `prompts/codex-generate-documentation-pack-v0.4.0.md`
* `prompts/codex-generate-agent-file-v0.4.0.md`
* `prompts/codex-generate-react-agent-v0.4.0.md`

These files are authoritative for:

* execution order
* version locking
* source acquisition procedure
* source hierarchy
* conflict resolution during generation
* provenance recording during generation
* completion criteria for Codex workers

Sub-agent execution note:

* use `worker` for generation or evaluation tasks that need shell access,
  filesystem writes, or validation commands
* reserve `helper-*` agents for reasoning-only assistance
* this is an execution-harness constraint in the current environment, not a
  change to the v0.4.0 pack contract

These documents are the source of truth for workflow mechanics, not for pack
structure.

### Practical rule

If you are asking:

* "How should the worker lock the library version?"
* "Can the worker fetch upstream sources?"
* "What wins if docs and type declarations disagree?"
* "What should the final worker report include?"

then the runbook and Codex generation prompts are authoritative.

## 3. Validation Documents

Validation documents determine whether a generated pack satisfies the enforced
checks currently implemented in the repo.

### Primary validation artifact

* `scripts/validate-agent-pack-v0.4.0.js`

This file is authoritative for:

* what the current automated validator actually checks
* what failures will be caught mechanically
* what structure is enforced in CI or local validation runs

Important distinction:

* the spec defines what is valid in principle
* the validator defines what is currently enforced automatically

If the validator is weaker than the spec, the spec still wins conceptually, but
the validator should be updated to catch up.

If the validator is stricter than the spec, treat that as a repo inconsistency
that should be resolved by aligning the validator and spec.

### Practical rule

If you are asking:

* "Will this pack pass the current checker?"
* "What can we enforce automatically right now?"

then `scripts/validate-agent-pack-v0.4.0.js` is authoritative.

## 4. Generated Artifacts

Generated artifacts are outputs of the system. They are not normative.

They may be exemplars, useful references, or comparison baselines, but they do
not define the format.

### Documentation pack outputs

Example:

* `parse/react-docs-v0.4.0.md`

These files are authoritative only for:

* the content gathered for that specific generation run
* the source set actually used in that run
* the intermediate documentation basis for the downstream agent pack

They are not authoritative for the `v0.4.0` format itself.

### Expert knowledge pack outputs

Examples:

* `agents/react/0.4.0.md`
* `agents/react/0.3.0.md`

These files are authoritative only for:

* the content of that exact generated pack
* the reference quality of that exact library pack
* exemplar usage if explicitly adopted as a benchmark

They are not authoritative for the `v0.4.0` structure in the abstract.

### Claude-compatible skill outputs

Examples:

* `distributions/claude/react/0.4.0/SKILL.md`
* `distributions/claude/react/0.4.0/references/*`

These files are authoritative only for:

* the generated Claude-compatible distribution for that exact canonical pack
* the installable skill bundle emitted from that generation run
* distribution-specific review of routing, progressive disclosure, and file layout

They are not authoritative for the canonical pack content and they must be
regenerated from the canonical pack rather than edited first.

No generated pack should override:

* the spec
* the runbook
* the validator

### Practical rule

If you are asking:

* "What did the React `0.4.0` run actually produce?"
* "What source set was used for this one pack?"
* "What is our current exemplar output?"

then the generated pack files are authoritative for that one run only.

## 5. Evaluation Documents

Evaluation documents define how to compare candidate outputs.

### Primary evaluation guide

* `tutorials/evaluating-agenthub-pack-outputs.md`

This file is authoritative for:

* the recommended comparison process
* inspection scoring
* sub-agent A/B testing
* fairness rules for comparisons
* acceptance criteria for replacing an existing pack

It does not define the pack format and it does not define generation procedure.
It defines how to judge outputs.

### Practical rule

If you are asking:

* "How should we compare two candidate packs?"
* "How should we score `0.3` versus `0.4`?"
* "What is a fair sub-agent comparison setup?"

then `tutorials/evaluating-agenthub-pack-outputs.md` is authoritative.

## Precedence Rules

When two repository documents appear to conflict, use this order:

1. `spec/open-agent-spec-v0.4.0.md`
2. `scripts/validate-agent-pack-v0.4.0.js` for current automated enforcement
3. `prompts/codex-agent-pack-runbook-v0.4.0.md`
4. `prompts/master-prompt-v0.4.0.md`
5. `prompts/documentation-prompt-v0.4.0.md`
6. task-specific Codex generation prompts
7. generated documentation packs
8. generated agent packs
9. evaluation documents

Use that list carefully:

* the spec has highest authority on format
* the validator has highest authority on what is mechanically enforced today
* the runbook has highest authority on execution procedure
* generated packs are evidence, not law
* evaluation docs judge outputs, they do not define the format

## Decision Table

Use this table when you need to resolve a question quickly.

| Question | Authoritative document |
| --- | --- |
| What is a valid `v0.4.0` pack? | `spec/open-agent-spec-v0.4.0.md` |
| What does the automated checker enforce? | `scripts/validate-agent-pack-v0.4.0.js` |
| How should a Codex worker generate a pack? | `prompts/codex-agent-pack-runbook-v0.4.0.md` |
| Which sub-agent type should run shell-backed generation and evaluation? | `prompts/codex-agent-pack-runbook-v0.4.0.md` |
| How should a model draft the final expert pack? | `prompts/master-prompt-v0.4.0.md` |
| How should a model draft the documentation pack? | `prompts/documentation-prompt-v0.4.0.md` |
| What did a specific run produce? | the relevant file in `parse/` or `agents/` |
| What Claude-compatible bundle did that canonical pack produce? | the relevant files in `distributions/claude/` |
| How should two outputs be compared? | `tutorials/evaluating-agenthub-pack-outputs.md` |

## Default Output Set For A Pack Generation Task

When the task is "generate a pack for `<tool>`", the operational default output
set is:

1. the intermediate documentation pack in `parse/`
2. the canonical pack in `agents/<tool>/<version>.md`
3. the derived Claude-compatible skill in `distributions/claude/<tool>/<version>/`

For the pack-generation workflow, the task is not complete when only the
canonical pack exists. The matching Claude-compatible skill distribution should
also be generated and validated unless the task explicitly says to skip it.

## Change Management Rules

When changing the `v0.4.0` system, update files in this order:

1. the spec
2. the validator if enforcement should change
3. the runbook if workflow should change
4. the master and documentation prompts
5. task-specific Codex prompts
6. generated exemplar outputs
7. evaluation or tutorial documents if the review process changes

This keeps the authority chain coherent.

Do not update generated packs first and then retrofit the spec later.

## Review Checklist

When reviewing a `v0.4.0` change, ask:

* does the change alter the pack contract?
* if yes, was `spec/open-agent-spec-v0.4.0.md` updated first?
* does the validator still match the contract?
* do the prompts still match the contract?
* does the runbook still describe the real workflow?
* do the generated exemplars still reflect the intended state?
* do the evaluation docs still describe the correct acceptance process?

## Bottom Line

For `v0.4.0`, treat the documents this way:

* the spec defines the pack
* the validator enforces the current mechanical checks
* the runbook defines the generation procedure
* the prompts instruct the worker
* the generated packs are outputs and exemplars
* the evaluation guide tells you how to compare outputs

That separation is what keeps the system understandable as the repository grows.
---
hide_table_of_contents: true
---
