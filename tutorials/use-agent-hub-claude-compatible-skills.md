---
hide_table_of_contents: true
---

# Use Agent Hub Claude-Compatible Skills

Agent Hub supports two related outputs:

1. canonical versioned packs
2. generated Claude-compatible skills

They work together, but they are not the same thing.

This guide explains when to use the Claude-compatible skill path, how it
relates to the canonical pack, and what contributors should edit when they want
to improve the result.

## The Short Version

The canonical source of truth is:

```text
agents/<tool>/<version>.md
```

The generated Claude-compatible skill lives in:

```text
distributions/claude/<tool>/<version>/
```

Default rule:

* edit the canonical pack
* regenerate the Claude-compatible skill
* do not hand-edit the generated skill files unless the repo explicitly says to

## Canonical Pack Vs Claude-Compatible Skill

### Canonical pack

Use the canonical pack when you want:

* the authoritative Agent Hub source
* raw Markdown retrieved through `agenthub_fetch`
* the artifact contributors edit and review directly

### Claude-compatible skill

Use the generated Claude-compatible skill when you want:

* a local `SKILL.md` bundle
* a file-based install path in a Claude-compatible environment
* progressive disclosure through a short skill entrypoint plus supporting files

## How The Generated Skill Is Structured

The generated Claude-compatible skill bundle looks like this:

```text
distributions/claude/<tool>/<version>/
  SKILL.md
  references/
    overview.md
    api-groups.md
    workflows.md
    troubleshooting.md
  manifest.json
```

`SKILL.md` is the entrypoint.
The `references/` files hold the heavier material that would make the entrypoint
too large or too noisy.

## When To Use MCP Vs A Local Claude-Compatible Skill

Use MCP when you want runtime retrieval:

* the agent should fetch packs only when a task needs them
* you want version-aware retrieval without installing local files
* you want one Agent Hub integration that supports many tools

Use the generated Claude-compatible skill when:

* the environment expects a local skill bundle
* you want a file-based install
* the local agent should load the skill from disk instead of calling MCP

These paths can coexist.

MCP is the just-in-time retrieval path.
The generated Claude-compatible skill is the file-based install path.

## How To Fetch A Generated Skill Over MCP

Agent Hub MCP now supports generated Claude-compatible skill retrieval.

Use:

* `agenthub_distributions` to see which generated distributions exist
* `agenthub_fetch_distribution` to fetch the full bundle
* `agenthub_fetch_distribution_file` to fetch one file like `SKILL.md`

If you only want the canonical pack, continue using:

* `agenthub_fetch`

## Contributor Rule: Edit Canonical, Regenerate Distribution

When you improve a pack:

1. edit `agents/<tool>/<version>.md`
2. regenerate the Claude-compatible skill
3. validate both artifacts

Example:

```bash
npm run validate:agent-pack -- agents/<tool>/0.4.0.md
npm run generate:claude-skill -- agents/<tool>/0.4.0.md
npm run validate:claude-skill -- distributions/claude/<tool>/0.4.0
```

If you are working on a pilot pack or changing the compiler, also run:

```bash
npm run check:claude-skill
```

## Installing In Claude-Compatible Environments

The exact install flow depends on the environment.

The important Agent Hub behavior is:

* canonical packs remain the source of truth
* generated skills are available in a Claude-compatible folder shape
* MCP can also return the generated bundle programmatically

If your environment supports local skill installation, use the generated bundle.
If it prefers runtime retrieval, use MCP instead.

### Claude Code Local Install

Claude Code discovers custom skills from the filesystem. In practice, that
means you can install a generated Agent Hub skill into:

* `.claude/skills/` in the current project
* `~/.claude/skills/` for a user-wide install

Agent Hub now includes a helper for this:

```bash
# Install one generated skill into the current project's .claude/skills/
npm run install:claude-skill -- agent-hub --project

# Install one generated skill into ~/.claude/skills/
npm run install:claude-skill -- react --global

# Install the current pilot set into the current project's .claude/skills/
npm run install:claude-skill:pilot
```

The installer copies:

```text
distributions/claude/<tool>/0.4.0/
```

into:

```text
.claude/skills/<tool>/
```

or:

```text
~/.claude/skills/<tool>/
```

Use this when you are validating generated skills in Claude Code or another
filesystem-based Claude-compatible environment.

## Related Guides

* [Get Better Agent Answers with Agent Hub MCP](./use-agent-hub-through-mcp.md)
* [Authoritative Documents For v0.4 Pack Generation](./authoritative-documents-for-v0.4-pack-generation.md)
* [Evaluating AgentHub Pack Outputs](./evaluating-agenthub-pack-outputs.md)
