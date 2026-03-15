==============================================================
AGENTHUB - AGENT HUB 0.4.1 GENERATION BRIEF
Goal: Generate `agents/agent-hub/0.4.0.md` using the v0.4.0 spec,
      the improved v0.4 process, and the current Agent Hub product surface.
==============================================================

### 1 - Target Output

Write:

- `agents/agent-hub/0.4.0.md`

### 2 - Required Structural Inputs

Use these files as the generation contract:

- `spec/open-agent-spec-v0.4.0.md`
- `prompts/master-prompt-v0.4.0.md`
- `prompts/codex-generate-agent-file-v0.4.0.md`
- `prompts/codex-agent-pack-runbook-v0.4.0.md`

### 3 - Required Content Inputs

Use these local files as starting inputs:

- `parse/agent-hub-docs-v0.4.0.md`

You are explicitly allowed and expected to acquire additional authoritative
Agent Hub sources, including:

- the checked-in repository root docs
- the current MCP server implementation under `netlify/functions/mcp.js`
- the MCP health endpoint implementation under `netlify/functions/mcp-health.js`
- the homepage positioning copy, onboarding prompt, and MCP tutorial
- evaluation/proof documents that show how Agent Hub is used in practice

### 4 - Invariants To Preserve

Preserve these values exactly:

- `Spec name: agent-hub`
- `Spec version: 0.4.0`
- `Library version: current-docs + mcp-server^1.1.0`
- `Primary language: markdown`
- `Homepage: https://github.com/FIL-Builders/agent-hub`

Lock the target to the current checked-in Agent Hub repo surface before
extracting contracts.

### 5 - Version Delta Audit

Before drafting, explicitly audit the prior-pack delta:

- there is no prior `agents/agent-hub/0.3.0.md` pack
- this is a first-class v0.4 pack for the Agent Hub product itself
- the current target includes both the registry model and the deployed MCP server surface

You must avoid stale assumptions, including:

- that Agent Hub is only a static file registry
- that React is the product instead of one example pack
- that onboarding should assume one specific AI client or IDE
- that `latest` resolution is semver-aware

### 6 - Ecosystem Boundary Rules

This pack is for Agent Hub itself. Keep these boundaries explicit:

- registry content model vs runtime MCP delivery
- server docs vs fetched target packs
- direct file access vs MCP retrieval
- onboarding flow vs proof/evaluation content

Specific rules:

- do not collapse the MCP server into the underlying pack registry
- do not describe the React benchmark as the core API surface
- do not present `agenthub_docs` as a target-library retrieval tool

### 7 - Coverage Expectations

The generated file should cover the current Agent Hub surface needed for real use:

- `agenthub_list`
- `agenthub_versions`
- `agenthub_fetch`
- `agenthub_docs`
- direct MCP endpoint and docs endpoint
- direct HTTP config and `mcp-remote` fallback
- version pinning vs `latest`
- onboarding and verification workflows
- troubleshooting for common setup and retrieval errors

### 8 - Definition Quality

For each documented symbol or feature:

- prefer checked-in repo sources over homepage marketing copy when they disagree
- keep tool definitions close to `netlify/functions/mcp.js`
- compress only when the compression does not change operational meaning
- if a point is ambiguous, mark it `Needs verification`

### 9 - Required Agent Hub Guidance

Make sure the final pack teaches these behaviors clearly:

- retrieve context just in time instead of pasting giant prompt blobs
- pin versions when reproducibility matters
- verify MCP by listing tools and fetching a known pack
- use `agent-hub` itself as a valid verification target without implying other packs do not matter
- preserve existing MCP config and make the smallest safe change during onboarding

### 10 - Required Exclusions

Do not let the final pack imply:

- that Agent Hub is only for React
- that `latest` is always the production-safe default
- that MCP is the only way to use Agent Hub
- that proof posts are authoritative contract definitions

### 11 - Challenge Set

Critique the draft against at least these task shapes:

1. implementation:
   connect Agent Hub MCP to an AI client and verify it by listing tools and fetching `agent-hub`
2. troubleshooting:
   debug a broken MCP setup, a missing tool, or unexpected `latest` resolution
3. design or tradeoff:
   choose between direct file access and MCP retrieval for a specific workflow
4. version-confusion:
   prevent answers that treat `latest` as semver-aware or treat React as the product itself

### 12 - Completion Check

Before considering the task complete:

1. follow `prompts/codex-agent-pack-runbook-v0.4.0.md`
2. run `node scripts/validate-agent-pack-v0.4.0.js agents/agent-hub/0.4.0.md`
3. fix any reported structural errors
4. confirm the pack teaches both registry semantics and MCP delivery semantics
5. confirm onboarding and verification are generic and not overfit to React
6. stop only when the validator passes
