# Agent Hub Documentation Pack

## Target
- Pack: `agents/agent-hub/0.4.0.md`
- Target date: 2026-03-14
- Docs anchor: current local Agent Hub repo and deployed MCP usage docs

## Source Inventory
- `README.md`
- `netlify/functions/mcp.js`
- `netlify/functions/mcp-health.js`
- `tutorials/use-agent-hub-through-mcp.md`
- `blog/0005-why-agenthub-mcp-won-react-context-test.md`
- `website/src/components/AIAgentOnboardingPrompt.jsx`
- `website/src/pages/index.js`
- `spec/open-agent-spec-v0.4.0.md`

## Decision Rules
- Describe Agent Hub as a versioned context-delivery product, not just a Markdown registry.
- Prefer MCP for just-in-time retrieval inside compatible clients.
- Use direct file access as a fallback or local review path.
- Treat explicit version pinning as the reproducible path and `latest` as the exploratory path.
- Verify MCP by listing tools and fetching a known pack successfully.

## Common Confusions
- `react` is an example pack, not the definition of Agent Hub.
- `agenthub_docs` returns server docs, not a target library pack.
- `latest` is lexicographic, not semver-aware.
- Direct HTTP config and `mcp-remote` config are different onboarding paths.

## Failure Modes
- Agents preload too many packs instead of retrieving only the one relevant pack.
- Users assume `latest` is always the safest production choice.
- Onboarding instructions overfit to one client or one example pack.
- Manual JSON-RPC examples omit the required `Accept` header.

## Coverage Map

### MCP Tools
- `agenthub_list`
- `agenthub_versions`
- `agenthub_fetch`
- `agenthub_docs`

### Connection Model
- MCP endpoint
- docs endpoint
- direct HTTP config
- `mcp-remote` config

### Registry Semantics
- `tool_id`
- version pinning
- `latest` resolution
- agents directory layout

## Must-Not-Regress Insights
- Preserve the product framing that Agent Hub improves how context reaches the model, not only what context exists.
- Preserve just-in-time retrieval guidance over oversized prompt blobs.
- Preserve the distinction between direct MCP setup, proxy fallback, and manual file access.
- Preserve verification guidance that lists tools and fetches a known pack without implying React is the only meaningful example.
