# Agent Hub Overview

## Snapshot

- Spec name: agent-hub
- Spec version: 0.4.0
- Generated: 2026-03-14
- Library version: current-docs + mcp-server^1.1.0
- Primary language: markdown
- Homepage: https://github.com/FIL-Builders/agent-hub
- Source set: `README.md`, `netlify/functions/mcp.js`, `netlify/functions/mcp-health.js`, `tutorials/use-agent-hub-through-mcp.md`, `blog/0005-why-agenthub-mcp-won-react-context-test.md`, `website/src/components/AIAgentOnboardingPrompt.jsx`, `website/src/pages/index.js`, and `spec/open-agent-spec-v0.4.0.md`

**Tags**
- agent-hub
- mcp
- ai-agents
- markdown
- context-delivery
- registry

## Purpose

This pack teaches an agent to use Agent Hub as a versioned context-delivery
system: discover available packs, inspect versions, fetch the exact pack needed
at task time, verify MCP-based retrieval without overfitting the workflow to
any single example pack such as `react`, and follow the repo’s own v0.4 pack
generation workflow when creating or revising Agent Hub packs locally.

## Guiding Principles

- Treat Agent Hub as both a registry of versioned packs and a delivery layer for those packs.
- Prefer just-in-time retrieval over pasting large packs into every prompt up front.
- Use explicit versions when you need reproducible, auditable behavior.
- Use `latest` for exploration, prototyping, and first-pass retrieval only.
- Verify MCP setup by listing tools and successfully fetching one known pack.
- Keep onboarding generic across AI clients; do not assume one specific CLI or IDE.
- Treat benchmark posts as proof points, not as the full product definition.
- Treat the pack-generation workflow as a first-class Agent Hub surface, not just an internal maintainer detail.
- When generating or revising packs, follow the authority chain: spec, validator, runbook, prompts, then generated artifacts.

## Boundary Notes

- The authoritative runtime surface comes from `netlify/functions/mcp.js`, which defines the deployed MCP endpoint, transport shape, tool set, and the human-readable docs payload.
- `tutorials/use-agent-hub-through-mcp.md` is the primary operational guide for setup, verification, and manual JSON-RPC examples.
- The React comparison post is used as product evidence for why delivery quality matters; it is not the contract source for MCP behavior.
- Homepage and onboarding prompt content are used to preserve the current product framing around versioned guidance, onboarding, and direct MCP setup.
- Agent Hub is a current-docs product pack, so version-sensitive claims are kept grounded in the checked-in docs and current Netlify MCP implementation rather than a package manifest alone.
- The pack-generation workflow is grounded in `spec/open-agent-spec-v0.4.0.md`, the authoritative-documents tutorial, the evaluation guide, and the checked-in generation prompts. Those sources are used to teach contribution behavior, not just runtime MCP use.

## FAQ

### Is Agent Hub only for React?
No. React is a commonly used benchmark or verification example because it is easy
to test and widely understood, but Agent Hub is a general registry and MCP server
for many packs across APIs, frameworks, SDKs, and product surfaces.

### When should I use MCP instead of opening a pack file directly?
Use MCP when you want runtime retrieval, version inspection, or a cleaner path
inside an MCP-aware client. Open a pack file directly when you are working
locally, reviewing content by hand, or the environment does not support MCP.

### Does this pack also teach how to create Agent Hub packs?
Yes. This pack covers both runtime use of Agent Hub and the local contribution workflow for generating or revising packs under the `v0.4` process. Use the authority-chain and evaluation tutorials when the task is pack creation rather than runtime retrieval.

### Does using Agent Hub guarantee better answers?
No. Agent Hub improves retrieval discipline, version clarity, and repeatability.
It can improve outcomes, as shown in the React proof post, but it does not
replace judgment, source evaluation, or task-specific reasoning.

## External Resources

- Agent Hub repository: https://github.com/FIL-Builders/agent-hub
- Agent Hub MCP tutorial: https://github.com/FIL-Builders/agent-hub/blob/main/tutorials/use-agent-hub-through-mcp.md
- Agent Hub pack-generation authority guide: https://github.com/FIL-Builders/agent-hub/blob/main/tutorials/authoritative-documents-for-v0.4-pack-generation.md
- Agent Hub pack evaluation guide: https://github.com/FIL-Builders/agent-hub/blob/main/tutorials/evaluating-agenthub-pack-outputs.md
- Agent Hub React proof post: https://github.com/FIL-Builders/agent-hub/blob/main/blog/0005-why-agenthub-mcp-won-react-context-test.md
- Open Agent Spec v0.4.0: https://github.com/FIL-Builders/agent-hub/blob/main/spec/open-agent-spec-v0.4.0.md
- Agent Hub generation runbook: https://github.com/FIL-Builders/agent-hub/blob/main/prompts/codex-agent-pack-runbook-v0.4.0.md
- Deployed MCP docs JSON: https://agent-hub-1.netlify.app/mcp?format=json
- Deployed MCP docs text: https://agent-hub-1.netlify.app/mcp?format=text
