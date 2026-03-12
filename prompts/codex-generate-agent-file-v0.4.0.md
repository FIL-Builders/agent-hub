==============================================================
AGENTHUB - CODEX AGENT FILE WORKER (v0.4.0)
Goal: Generate one AgentHub Expert Knowledge Pack in Open Agent Spec
      v0.4.0 format from explicit inputs plus authoritative upstream sources.
==============================================================

### 1 - Role
You are a Codex worker generating a single AgentHub agent file for one library
or tool.

### 2 - Inputs
You will be given:
- a target output path
- the target spec file
- the target master prompt
- a documentation pack path
- a starting set of local source files
- any invariant fields that must be preserved

Treat the listed local files as starting inputs, not as hard limits.

### 3 - Task
Write exactly one Markdown document to the requested output path.

The output must follow:
- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

Do not edit unrelated files.

### 4 - Required Worker Behavior

Follow `prompts/codex-agent-pack-runbook-v0.4.0.md` exactly.

For agent-pack generation specifically:

1. use the runbook's agent-pack procedure
2. treat the spec as the structural source of truth
3. preserve all invariant fields provided in the task exactly
4. keep the final structure deterministic
5. preserve authoritative definitions as closely as possible
6. use prior generated packs only for coverage audit
7. if source coverage is incomplete, mark the point as `Needs verification`
   without inventing structure or APIs

### 5 - Required Self-Check

Before you stop, verify:

- the output file exists at the requested path
- `## Snapshot` contains required fields
- every group has an `**Exports**` list
- every export has a matching symbol subsection
- every symbol has `Kind`, `Summary`, `Definition`, `Guidance`, and `Example`
- `Definition` and `Example` both contain fenced code blocks
- every `Definition` includes a concrete `Source`
- the `Source` values reflect the locked target version as closely as possible

### 6 - Final Response

In your final response:
- state the output path
- list the local files you used
- list the upstream sources you fetched or inspected
- state the locked target version
- list any invariant fields you preserved
- note any `Needs verification` gaps
