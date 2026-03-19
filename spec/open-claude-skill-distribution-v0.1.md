# Open Claude Skill Distribution Spec v0.1

## Purpose

This document defines Agent Hub's generated Claude-compatible skill
distribution.

It does not replace the canonical Agent Hub pack format. It defines how a
canonical `0.4.0` pack is compiled into a Claude-compatible folder bundle for
installation and use in Claude-compatible environments.

## Terminology

- `canonical pack`: the authored Agent Hub source document stored at
  `agents/<tool>/<version>.md`
- `Claude-compatible skill`: the generated folder bundle distributed for
  Claude-compatible environments
- `distribution`: a delivery shape derived from the canonical pack

Use `claude` as the internal distribution slug in directory names, manifest
metadata, website selectors, and MCP responses.

Use `Claude-compatible skill` as the human-facing label unless a later RFC
updates this contract.

## Scope

This spec covers:

- folder layout
- required files
- allowed frontmatter
- section-mapping rules
- reference-file rules
- deterministic generation expectations
- validation requirements

This spec does not cover:

- replacing the canonical Agent Hub pack format
- MCP transport behavior
- website route design
- non-Claude distribution formats

## Source Of Truth

The source of truth for a Claude-compatible skill distribution is the canonical
Agent Hub pack:

```text
agents/<tool>/<version>.md
```

Generated Claude-compatible skill bundles are committed artifacts under
`distributions/claude/`. They are not hand-authored first and must not silently
become the canonical source.

## Distribution Model

A Claude-compatible skill distribution is a generated folder bundle:

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

The exact set of files under `references/` may vary by pack. Empty reference
files must not be emitted.

## Required Files

### `SKILL.md`

Required.

This is the Claude-compatible entrypoint for the bundle.

It must:

- exist at the top level of the bundle
- contain valid YAML frontmatter
- contain at least `name` and `description`
- stay lean compared with the canonical pack
- explain what the skill is for and when to use it
- point to any heavy supporting material via `references/`

### `manifest.json`

Required.

This is Agent Hub internal distribution metadata. It is not part of Anthropic's
required skill contract, but Agent Hub requires it for indexing, rendering, and
machine retrieval.

Required fields:

- `tool_id`
- `version`
- `distribution`
- `entrypoint`
- `generated_from`
- `display_name`
- `description`
- `files`

### `references/`

Optional in theory, expected in practice.

Use `references/` for heavier material that should not live in `SKILL.md`.

## Frontmatter Rules

Allowed frontmatter fields in `SKILL.md`:

- `name`
- `description`

No other fields should be emitted by default.

If a future change adds more frontmatter fields, that change must explicitly
update this spec.

### `name`

Required.

Rules:

- lowercase letters, digits, and hyphens only
- stable across regenerations for the same tool
- derived from the canonical tool identity without introducing spaces or slashes

Recommended rule:

- use the tool id if it already fits the pattern
- otherwise normalize to a hyphenated variant and preserve the original tool id
  in `manifest.json`

Pattern:

```text
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

### `description`

Required.

Rules:

- concise
- should help a Claude-compatible environment decide when the skill should load
- should describe the domain and task class, not just restate the title
- should avoid Agent Hub jargon such as "pack" or "expert knowledge pack"

## Progressive Disclosure Rules

`SKILL.md` should stay lean.

It should contain:

- what the skill is for
- when to use it
- short operational guidance
- explicit pointers to reference files that actually exist

It should not flatten the entire canonical pack into one file.

Heavy or dense content should move into `references/`.

## Section Mapping From Canonical Pack

### Canonical `## Snapshot`

Maps to:

- `manifest.json`
- optional short version or context note inside `SKILL.md`
- optional compressed context inside `references/overview.md`

Do not dump the full Snapshot block into `SKILL.md`.

### Canonical `## Purpose`

Maps to:

- core skill purpose text in `SKILL.md`
- optionally expanded context in `references/overview.md`

### Canonical `## Guiding Principles`

Maps to:

- short operational guidance in `SKILL.md`
- optionally expanded notes in `references/overview.md`

### Canonical `## Design Notes`

Maps to:

- omitted by default
- or compressed into `references/overview.md` only when needed to preserve real
  operational boundaries

Internal generation history must not become core skill instructions unless it is
necessary for correct use.

### Canonical `## API Groups`

Maps to:

- `references/api-groups.md`

This is the main fidelity-preserving file.

### Canonical `## Common Workflows`

Maps to:

- `references/workflows.md`

### Canonical `## Troubleshooting Cheatsheet`

Maps to:

- `references/troubleshooting.md`

### Canonical `## FAQ`

Maps to:

- `references/overview.md` when FAQ content adds meaningful context
- omitted when it is redundant

### Canonical `## External Resources`

Maps to:

- an optional links section inside `references/overview.md`
- or omission when the links do not add practical value

## Reference File Rules

If `SKILL.md` tells the agent to read another file:

- that file must exist
- the path must be correct
- the file should have a clear heading and focused scope

Reference files should be:

- one level below `references/`
- directly discoverable from `SKILL.md`
- organized by function, not arbitrary splitting

Avoid:

- deeply nested reference hierarchies
- references that only point to more references
- duplicate content across files

## Manifest Rules

`manifest.json` must contain:

```json
{
  "tool_id": "react",
  "version": "0.4.0",
  "distribution": "claude",
  "entrypoint": "SKILL.md",
  "generated_from": "agents/react/0.4.0.md",
  "display_name": "React",
  "description": "Use for React component, hooks, rendering, and performance tasks. Helps with API usage, debugging, and implementation decisions.",
  "files": [
    "SKILL.md",
    "references/api-groups.md",
    "references/overview.md",
    "manifest.json"
  ]
}
```

Rules:

- `distribution` must use the internal slug `claude`
- `entrypoint` must resolve to `SKILL.md`
- `files` must list every file in the bundle exactly once
- `files` must be deterministic and sorted lexicographically

## Determinism Rules

Generated output must be deterministic.

For the same canonical input pack and generator version:

- file layout must be stable
- file names must be stable
- section splitting must be stable
- frontmatter values must be stable
- manifest ordering must be stable

## Validation Requirements

A valid Claude-compatible skill distribution must satisfy all of the following:

- `SKILL.md` exists
- `manifest.json` exists
- `SKILL.md` frontmatter includes valid `name` and `description`
- no undocumented extra frontmatter fields are emitted
- all referenced files exist
- all files listed in `manifest.json` exist
- `entrypoint` resolves to `SKILL.md`
- `distribution` equals `claude`
- generated source metadata matches the canonical pack path shape
- no dangling internal file references exist
- file ordering in `manifest.json` is deterministic

## Recommended Validator Output

Validation errors should report:

- the bundle path
- the failing rule
- concise fix guidance

## Non-Goals

This distribution spec does not:

- replace the canonical Agent Hub `0.4.0` source format
- define how MCP should transport generated skill bundles
- define how the website should render generated skill bundles
- define Claude marketplace packaging or publishing behavior
