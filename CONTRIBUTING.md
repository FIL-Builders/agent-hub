# Contributing to Agent Hub

Agent Hub is built in public through GitHub pull requests.

Contributions can include:

- new Agent Hub packs for tools, libraries, APIs, SDKs, and product surfaces
- revisions to existing packs
- improvements to pack-generation prompts and runbooks
- evaluation, onboarding, tutorial, or website improvements

The current contribution model is the Markdown-native `v0.4` workflow. If you
see older `0.1`-`0.3` files in the repo, treat them as historical context
unless a current tutorial or prompt explicitly tells you to use them.

## What A Good Contribution Looks Like

The active Agent Hub surface is built around:

- versioned Markdown packs in `agents/<tool>/`
- intermediate documentation packs in `parse/`
- generation prompts in `prompts/`
- the normative spec in `spec/open-agent-spec-v0.4.0.md`
- validation and evaluation scripts in `scripts/` and `tutorials/`

The best contributions are:

- version-disciplined
- grounded in authoritative upstream sources
- operationally useful for real implementation or debugging work
- structurally valid under the `v0.4` spec

## Before You Start

Read these repo documents first:

1. `spec/open-agent-spec-v0.4.0.md`
2. `tutorials/authoritative-documents-for-v0.4-pack-generation.md`
3. `tutorials/evaluating-agenthub-pack-outputs.md`

If you are generating or revising a pack with a local AI coding agent, also use:

- `prompts/codex-agent-pack-runbook-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`

If a tool-specific generation brief already exists in `prompts/`, use that too.

## Contributing A New Or Updated Pack

### 1. Pick the target

Choose one of these paths:

- add a new pack under `agents/<tool>/0.4.0.md`
- improve an existing `0.4.0.md` pack
- regenerate a pack using the current `v0.4` prompts and review process

If the repo already has an older pack for that tool, use it only as a coverage
benchmark. Do not treat older generated packs as authoritative sources for API
definitions.

### 2. Gather authoritative sources

Use upstream documentation, official references, package metadata, and primary
source material for the target library or product.

Then follow the repository authority chain:

1. `spec/open-agent-spec-v0.4.0.md`
2. `scripts/validate-agent-pack-v0.4.0.js`
3. `prompts/codex-agent-pack-runbook-v0.4.0.md`
4. `prompts/master-prompt-v0.4.0.md`
5. `prompts/documentation-prompt-v0.4.0.md`
6. generated artifacts in `parse/` and `agents/`

If repo documents disagree on pack structure, the spec wins.

### 3. Generate or revise the pack

The normal `v0.4` flow is:

1. create or update the intermediate documentation pack in `parse/`
2. create or update the final expert pack in `agents/<tool>/0.4.0.md`
3. if needed, add or update a tool-specific generation brief in `prompts/`

Use the checked-in prompts and runbook instead of inventing a new pack shape.

### 4. Validate the result

Run the pack validator on the generated pack:

```bash
node scripts/validate-agent-pack-v0.4.0.js agents/<tool>/0.4.0.md
```

Fix all structural failures before opening a PR.

If you changed prompts or regenerated a pack that replaces an existing one,
follow the evaluation process in:

- `tutorials/evaluating-agenthub-pack-outputs.md`

That guide is the standard for deciding whether a new candidate is actually
better than the prior pack.

### 5. Build the site if your change affects surfaced content

If you changed packs, tutorials, the site UI, or anything that could affect the
rendered website or MCP-facing static content, run:

```bash
npm run build
```

At minimum, pack-only changes should still pass:

```bash
npm run validate:agent-pack -- agents/<tool>/0.4.0.md
```

## Active Vs Archived Packs

The website and MCP surface only expose active packs from `agents/`.

Older packs that are no longer meant to appear in the live product are kept in:

- `archive/agents/`

Do not add new active work to `archive/agents/`.
Use the archive only for historical preservation or recovery.

## Pull Request Expectations

Open a GitHub pull request with:

- a short summary of what changed
- the target pack or tutorial path
- validation results
- evaluation results if you are replacing or regenerating an existing pack

Draft PRs are fine.

We prefer contributions that stay reviewable:

- focused changes
- explicit version updates
- clear source discipline
- no speculative format changes without updating the spec or prompts that govern them

## UI, Docs, And Website Contributions

Agent Hub is not only a pack registry. It also includes:

- MCP onboarding
- tutorials
- blog posts
- the Docusaurus site and cybergrid-based UI

If you change public-facing site content or workflows:

- keep the copy aligned with the current product positioning
- preserve the existing visual language unless the change is intentionally a redesign
- run `npm run build`

## Need Help?

If you are unsure how to contribute, start here:

- `tutorials/authoritative-documents-for-v0.4-pack-generation.md`
- `tutorials/evaluating-agenthub-pack-outputs.md`
- `agents/agent-hub/0.4.0.md`

If something in the repo is ambiguous or stale, a pull request that fixes the
documentation is a valid contribution too.
