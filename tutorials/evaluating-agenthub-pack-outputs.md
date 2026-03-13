# Evaluating AgentHub Pack Outputs

This guide defines a repeatable process for comparing two AgentHub pack outputs.
It works for version-to-version comparisons such as `0.3` versus `0.4`, but it
is designed to be generic: you can use it to compare any two packs, any two
generation runs, or any two candidate rewrites of the same pack.

The goal is not just to decide which file "looks better." The goal is to
measure which pack helps an agent produce stronger answers on real work while
remaining structurally reliable and easy to maintain.

## When To Use This Guide

Use this guide when:

* you have two candidate pack files for the same library or tool
* you are reviewing a new pack format or prompt version
* you want to validate that a regenerated pack is actually better than the prior version
* you want a documented acceptance process before merging a pack rewrite

## What Good Evaluation Looks Like

A strong evaluation has three properties:

* the comparison is controlled: same task, same model family, same constraints
* the comparison is two-part: inspect the pack itself and test the answers it produces
* the scoring is explicit: note the reasons, not just the winner

Do not rely on file aesthetics alone. A cleaner format can still lose if it
produces weaker answers. Likewise, a denser older pack can still lose if it is
harder for an agent to retrieve from reliably.

## Evaluation Workflow

### 1. Freeze the candidates

Pick the two exact files being compared and do not change them during the evaluation.

Record:

* file paths
* pack version
* target library version
* branch or commit SHA if relevant

Example:

* candidate A: `agents/react/0.3.0.md`
* candidate B: `agents/react/0.4.0.md`

### 2. Define the evaluation task set

Pick one or more realistic tasks that stress the pack in ways that matter.

Good tasks:

* require the agent to choose the right APIs
* require tradeoff reasoning, not just symbol lookup
* force the pack to surface best practices and pitfalls
* are specific enough to score consistently

Weak tasks:

* trivial symbol definition lookups
* open-ended brainstorming with no right or wrong shape
* tasks that depend more on general model intelligence than on the pack

For a first pass, one carefully chosen task is acceptable. For merge confidence,
use a task set with at least:

* one implementation task
* one debugging or troubleshooting task
* one design or tradeoff task

### 3. Run an inspection review

Read both packs directly before testing them in agents.

Score the following:

* structural determinism: are sections and symbol entries predictable?
* retrieval shape: can an agent find the right material quickly?
* source discipline: does the pack clearly identify authoritative sources?
* contract quality: are definitions crisp and version-appropriate?
* coverage: does the pack cover the expected public surface area?
* operational usefulness: are workflows, troubleshooting notes, and FAQs helpful?

Look for concrete failure modes:

* stale or mismatched library version
* ambiguous or missing `Definition` blocks
* inconsistent section ordering
* missing exports or missing symbols
* vague guidance that does not help with real implementation work
* poor provenance, especially if old generated packs are being reused as truth

### 4. Run a controlled sub-agent comparison

Use one isolated sub-agent per pack. Give both sub-agents:

* the exact same task
* the same constraints
* the same model tier if possible
* no access to the competing pack

The only intended difference should be the pack each sub-agent receives.

Recommended constraints:

* treat the supplied pack as the authoritative context
* do not browse the web unless the evaluation explicitly allows it
* return only the answer to the task
* mention the APIs used and why

### 5. Review the generated answers

Judge each answer on output quality, not just plausibility.

Score the following:

* API choice: did the answer choose the right primitives?
* correctness: is the solution technically sound?
* specificity: does it name the right caveats and tradeoffs?
* completeness: does it solve the full task?
* code quality: is the code minimal, coherent, and likely to work?
* pack utilization: does the answer reflect the strengths of the pack?

Look for concrete differences:

* one answer may mention the right API but omit the key caveat
* one answer may solve responsiveness but ignore rerender stability
* one answer may be more complete but also more bloated
* one answer may be cleaner because the pack grouped the relevant material better

### 6. Score both phases separately

Do not collapse everything into one gut-feel score.

Recommended scorecard:

* inspection score: `0-10`
* task-output score: `0-10`
* overall score: weighted average or explicit judgment

A common weighting is:

* inspection: `40%`
* task output: `60%`

That weighting reflects the actual purpose of the pack: helping an agent
produce stronger work.

### 7. Write a short review summary

Every evaluation should end with a written conclusion:

* which pack won by inspection
* which pack won on task output
* where each pack was stronger
* what must be fixed before merging or adopting the winner as canonical

## Recommended Scoring Rubric

Use the same rubric each time so scores are comparable across packs.

### Inspection rubric

* `9-10`: highly structured, version-disciplined, easy to retrieve from, strong provenance, strong operational sections
* `7-8`: solid but with noticeable weaknesses in coverage, structure, or provenance
* `5-6`: usable but inconsistent, weakly sourced, or missing important sections
* `0-4`: unreliable as an agent pack

### Task-output rubric

* `9-10`: selects the right APIs, explains tradeoffs, includes strong code, and addresses the full task
* `7-8`: mostly correct and useful, but misses one important caveat or refinement
* `5-6`: partially helpful, but shallow or incomplete
* `0-4`: materially wrong or not useful

## Suggested Sub-Agent Prompt Template

Use a prompt like this for each candidate:

```text
Use only this AgentHub pack as your knowledge source: <PATH>

Task:
<TASK>

Constraints:
- Treat the pack as authoritative context.
- Do not browse the web.
- Answer as if helping a senior engineer.
- Mention the specific APIs you are using and why.
- Return only the answer to the task, no meta commentary.
```

Run the prompt separately for each candidate pack.

## Fairness Rules

Keep the comparison clean:

* use the same model class for both runs
* do not let one sub-agent see the other answer
* do not revise one answer before the first comparison pass
* do not switch tasks mid-evaluation
* do not reward verbosity on its own

If you later do an edited second round, keep the first-round results as the
official baseline.

## Common Failure Patterns

These show up often in pack comparisons:

* the newer pack is structurally better but semantically thinner
* the older pack has stronger coverage but poor retrieval shape
* the pack cites the wrong version of the library
* definitions are copied from old generated artifacts instead of authoritative sources
* operational sections such as troubleshooting and workflows are present but generic
* the task answer is polished but misses the core tradeoff the task was designed to test

## How To Decide the Winner

Use this decision rule:

* if one pack wins both inspection and task output, it wins outright
* if one pack wins inspection but loses task output, do not adopt it yet
* if one pack loses inspection but wins task output, keep it as a content benchmark and remediate the weaker format
* if the result is split, fix the weaker pack and rerun the same evaluation

In practice, task-output quality should carry more weight than format elegance.
The pack exists to improve agent behavior.

## Evaluation Template

Copy this template into an issue, PR comment, or review document:

```md
# Pack Evaluation

## Candidates
- A: <path>
- B: <path>

## Task Set
- Task 1: <task>
- Task 2: <task>

## Inspection Review
- A strengths:
- A weaknesses:
- B strengths:
- B weaknesses:

## Inspection Scores
- A:
- B:

## Sub-Agent Task Review
- Task 1 winner:
- Task 2 winner:

## Task Scores
- A:
- B:

## Conclusion
- Winner:
- Why:
- Required follow-up:
```

## Recommended Acceptance Bar

For a pack rewrite to replace an existing canonical pack, it should meet all of these:

* equal or better task-output score
* equal or better provenance discipline
* equal or better coverage of the target public surface
* clearer structure for deterministic retrieval

If it fails the task-output comparison, it is not ready, even if the format is better.

## Final Advice

The best evaluations are specific and repeatable. Avoid loose statements like
"this one feels better" or "the new format is cleaner." Instead, show the task,
show the outputs, score them, and explain the tradeoff.

That makes the decision auditable and gives the next iteration a clear target.
