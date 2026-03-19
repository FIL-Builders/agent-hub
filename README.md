# Agent Hub

> Expert guidance for AI coding agents, delivered as canonical Markdown packs and generated Claude-compatible skills.

## What Agent Hub Is

Agent Hub now has two related artifact types:

1. canonical versioned packs in `agents/<tool>/<version>.md`
2. generated distributions built from those packs, including Claude-compatible skills in `distributions/claude/<tool>/<version>/`

The canonical pack is the source of truth.
Generated distributions are delivery formats built from that source.

This gives Agent Hub two practical delivery paths:

- runtime retrieval over MCP
- file-based installation through generated Claude-compatible skills

## Canonical Pack Vs Generated Claude-Compatible Skill

### Canonical pack

The canonical pack is the authoritative authored artifact:

```text
agents/<tool>/<version>.md
```

It is:

- versioned
- validated
- reviewed directly in GitHub pull requests
- the thing contributors should edit

### Claude-compatible skill

The generated Claude-compatible skill is a delivery artifact:

```text
distributions/claude/<tool>/<version>/
  SKILL.md
  references/
  manifest.json
```

It is:

- generated from the canonical pack
- designed for progressive disclosure in Claude-compatible environments
- a distribution target, not the primary authoring surface

Default rule:

- edit the canonical pack
- regenerate the Claude-compatible skill
- do not hand-edit generated skill files unless the repo explicitly says otherwise

## How To Use Agent Hub

### Use MCP when you want runtime retrieval

Use Agent Hub MCP when the agent should:

- discover available packs
- inspect versions
- fetch the right pack only when a task needs it
- keep prompts smaller and more repeatable

Start here:

- [Get Better Agent Answers with Agent Hub MCP](./tutorials/use-agent-hub-through-mcp.md)

### Use the generated Claude-compatible skill when the environment wants a local skill

Use the generated Claude-compatible skill when the environment expects:

- a local `SKILL.md` bundle
- file-based installation
- progressive disclosure through a short skill entrypoint plus supporting files

Start here:

- [Use Agent Hub Claude-Compatible Skills](./tutorials/use-agent-hub-claude-compatible-skills.md)

## Contributing

Agent Hub is built in public through GitHub pull requests.

Good starting points:

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [Authoritative Documents For v0.4 Pack Generation](./tutorials/authoritative-documents-for-v0.4-pack-generation.md)
- [Evaluating AgentHub Pack Outputs](./tutorials/evaluating-agenthub-pack-outputs.md)

If you are contributing packs, remember:

- canonical pack first
- generated distribution second
- regenerate rather than hand-edit generated skill bundles

## Local Commands

Validate a canonical pack:

```bash
npm run validate:agent-pack -- agents/<tool>/0.4.0.md
```

Generate a Claude-compatible skill bundle:

```bash
npm run generate:claude-skill -- agents/<tool>/0.4.0.md
```

Generate the current pilot set:

```bash
npm run generate:claude-skill:pilot
```

Check generated Claude-compatible bundles for drift:

```bash
npm run check:claude-skill
```

Install a generated Claude-compatible skill into `.claude/skills/` in the
current project:

```bash
npm run install:claude-skill -- agent-hub --project
```

Install a generated Claude-compatible skill into `~/.claude/skills/`:

```bash
npm run install:claude-skill -- react --global
```

Check the MCP distribution tools locally:

```bash
npm run check:mcp-distributions
```

Check Claude Code local skill install + MCP setup preflight:

```bash
npm run check:claude-code-local-setup
```

Build the full site and synced static artifacts:

```bash
npm run build
```

## Repository Guide

- `agents/` — canonical versioned packs
- `distributions/claude/` — generated Claude-compatible skill bundles
- `parse/` — intermediate documentation packs
- `prompts/` — generation prompts and runbooks
- `spec/` — normative format specs
- `scripts/` — validators, generators, and sync tooling
- `tutorials/` — user and contributor workflow guides
- `website/` — Docusaurus site
- `netlify/functions/mcp.js` — deployed MCP server
