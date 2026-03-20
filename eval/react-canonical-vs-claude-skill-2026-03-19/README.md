# React Canonical Pack vs Claude-Compatible Skill

Date: 2026-03-19

## Candidates

* A: `agents/react/0.4.0.md`
* B: `distributions/claude/react/0.4.0/`

## Task Set

Focused task:

* Diagnose a React 18 page with 5,000 searchable rows where typing lags, rows rerender too often, and the selected row appears to reset after filtering. Explain root causes, provide a minimal production-sane fix with complete code, and explain when to use `useDeferredValue`, `useTransition`, `memo`, and stable props.

This is the same style of task Agent Hub already used in the React comparison work:

* it stresses API choice
* it requires tradeoff reasoning
* it needs both workflow guidance and troubleshooting detail

## Evaluation Method

This pass is a manual, source-grounded evaluation.

Why manual:

* local Claude Code validation is still blocked by `/login`
* an attempted automated OpenAI API comparison on 2026-03-19 was rate-limited with HTTP `429`

That means this pass should be treated as:

* valid for inspection and quality-gate review
* not a substitute for the Milestone B real-environment trigger/load gate

## Inspection Review

### A strengths

* single-file completeness keeps provenance, API groups, workflows, and troubleshooting together
* richer audit trail for why React 18.3 was chosen and what sources were trusted
* no extra navigation step to see boundary notes and FAQ material

### A weaknesses

* weaker as a local routing surface because there is no small trigger-focused entrypoint
* denser than a Claude-compatible local skill should be

### B strengths

* `SKILL.md` is lean and clearly says when the skill should trigger
* `references/api-groups.md` preserves the key React API details needed for this task
* `references/workflows.md` and `references/troubleshooting.md` keep the exact task-relevant guidance easy to find
* better fit for progressive disclosure in a Claude-compatible environment

### B weaknesses

* provenance and boundary notes moved behind `references/overview.md`
* one-file completeness is lower than the canonical pack
* an agent that never follows `Read next` could miss some supporting context

## Inspection Scores

* A: 9.4/10
* B: 9.1/10

Reason:

* the canonical pack still wins on source density and inspectability
* the generated skill stays very close because it preserves the API-heavy material where it matters

## Task Review

Expected task-critical guidance for this React task:

* keep the input state urgent and defer the heavy filter work
* preserve selection by stable item ID, not transient filtered position
* use `memo` only where stable props make it effective
* explain why `useTransition` is not the primary fix for a synchronous derived list filter
* keep stable props and callbacks where rerender skipping actually matters

### A task-output expectation

The canonical pack contains everything needed to produce a strong answer in one file:

* concurrency primitives
* `memo`
* stable-key guidance
* workflow and troubleshooting notes related to rerender stability

### B task-output expectation

The generated skill still contains the same task-critical material, but split across:

* `SKILL.md`
* `references/api-groups.md`
* `references/workflows.md`
* `references/troubleshooting.md`

For this task, the split does not appear to remove any necessary guidance.

## Task Scores

* A: 9.3/10
* B: 9.2/10

Reason:

* the generated skill remains practically strong enough for the task
* the small score gap comes from the risk that an agent may stop at `SKILL.md` or `overview.md` and delay reading the deeper files
* no material loss was found in the actual APIs or workflows needed for this task

## Conclusion

Winner:

* A slight win for the canonical pack as the authoring and inspection format

Most important result:

* the generated Claude-compatible skill remains good enough for practical React work on this task

What was lost:

* one-file density
* direct access to provenance and boundary notes

What was preserved:

* the React APIs that matter
* the key workflow for deferred filtering
* the rerender and troubleshooting guidance
* the practical caveats around `memo`, stable props, and concurrency primitives

Required follow-up:

* complete the real Claude-compatible environment test gate from issue #13
* continue spot-checking whether other packs lose more than React did when split into a skill bundle
