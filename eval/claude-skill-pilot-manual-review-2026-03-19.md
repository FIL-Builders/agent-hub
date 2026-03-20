# Claude Skill Pilot Manual Review

Date: 2026-03-19

## Scope

Manual review of the pilot Claude-compatible skill bundles generated for:

* `agent-hub`
* `react`
* `typescript`
* `nextjs`
* `playwright`
* `supabase-js`
* `scaffold-eth-2`

The review focused on:

* triggerability of `name` and `description`
* clarity and size discipline of `SKILL.md`
* correctness of `Read next` routing
* whether task-critical content survived the split into `references/`
* obvious generator defects

## Findings

### What looked good

* All seven pilot bundles have clear, task-triggerable `description` text.
* All seven `SKILL.md` files stay lean and read like entrypoints rather than pack dumps.
* `Read next` routing is consistent across the pilot set and points to real files.
* `references/api-groups.md` preserves the task-critical API surface with high fidelity.
* `references/workflows.md` and `references/troubleshooting.md` survive the split well where those sections exist.

### Generator defect found in review

The generated `SKILL.md` purpose block still reused canonical phrasing:

* `This pack teaches...`

That is incorrect in the generated skill distribution and weakens the illusion
that the output is a real local skill rather than a renamed pack export.

## Fix applied

Updated the compiler to rewrite the generated `SKILL.md` purpose paragraph to:

* `This skill teaches...`

Then regenerated the pilot set and reran validation.

## Remaining tradeoffs

The generated skills are not equivalent to canonical packs in one-file density.

Observed losses:

* provenance and boundary notes move behind `references/overview.md`
* FAQ / auxiliary context is one extra hop away
* a fast reader can see less of the full pack contract without following links

Observed wins:

* trigger metadata is stronger for local skill routing
* `SKILL.md` is much easier to scan than a full canonical pack
* progressive disclosure is clearer and more Claude-compatible

## Conclusion

The pilot outputs are structurally strong enough to continue.

The main quality bar is now:

* verify real Claude-compatible environments load and route these skills as expected
* keep watching for cases where the generated split hides information that was task-critical in the canonical pack
