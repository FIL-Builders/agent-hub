# Agent Hub API Groups

### MCP Tools
**Exports**
- agenthub_list
- agenthub_versions
- agenthub_fetch
- agenthub_docs

The callable MCP tool surface for browsing, version inspection, raw pack fetches,
and self-describing server docs.

#### agenthub_list
**Kind**
function

**Summary**
List available Agent Hub packs with simple pagination and optional substring
filtering by `tool_id`.

**Definition**
Language: typescript
Source: `netlify/functions/mcp.js`

```ts
agenthub_list({
  q?: string,
  limit?: number,
  offset?: number
}) => {
  total: number;
  limit: number;
  offset: number;
  nextOffset: number | null;
  q: string;
  items: Array<{ tool_id: string; versions: string[] }>;
}
```

**Guidance**
- Use this first when you know the general domain but not the exact `tool_id`.
- Filtering is only on `tool_id`; do not expect descriptions or tags to be indexed.
- Page through large result sets with `offset` instead of assuming the whole registry fits in one response.

**Example**
Language: json
Description: Search for tool IDs containing `sdk`.

```json
{
  "name": "agenthub_list",
  "arguments": {
    "q": "sdk",
    "limit": 10
  }
}
```

#### agenthub_versions
**Kind**
function

**Summary**
List the versions available for one Agent Hub pack.

**Definition**
Language: typescript
Source: `netlify/functions/mcp.js`

```ts
agenthub_versions({
  tool_id: string
}) => {
  tool_id: string;
  versions: string[];
}
```

**Guidance**
- Use this when you already know the `tool_id` and need to decide between `latest` and a pinned version.
- Reach for explicit versions in production, evaluations, and debugging so the retrieved context is reproducible.
- Do not assume version ordering is semver-aware; the server resolves `latest` lexicographically.

**Example**
Language: json
Description: Check which versions exist for the Agent Hub pack itself.

```json
{
  "name": "agenthub_versions",
  "arguments": {
    "tool_id": "agent-hub"
  }
}
```

#### agenthub_fetch
**Kind**
function

**Summary**
Fetch the raw Markdown spec for a tool at a chosen version, or resolve the
lexicographically highest version when `latest` is requested.

**Definition**
Language: typescript
Source: `netlify/functions/mcp.js`

```ts
agenthub_fetch({
  tool_id: string,
  version?: string
}) => string;
```

**Guidance**
- This is the main runtime retrieval path when an agent actually needs pack content.
- Prefer fetching only the relevant pack for the current task instead of loading many packs speculatively.
- Use `version: "latest"` for exploration and an explicit version for repeatable evaluations, tests, or agent workflows.
- Fetching `agent-hub` itself is a strong verification step because it proves the registry can serve its own product pack cleanly.

**Example**
Language: json
Description: Fetch the latest Agent Hub pack.

```json
{
  "name": "agenthub_fetch",
  "arguments": {
    "tool_id": "agent-hub",
    "version": "latest"
  }
}
```

#### agenthub_docs
**Kind**
function

**Summary**
Return the server’s own MCP usage docs as JSON text.

**Definition**
Language: typescript
Source: `netlify/functions/mcp.js`

```ts
agenthub_docs({}) => {
  name: string;
  transport: string;
  endpoint: string;
  usage: Record<string, string>;
  tools: Array<unknown>;
  notes: string[];
  health: Record<string, string>;
}
```

**Guidance**
- Use this when you need to inspect the tool surface or explain setup without separately opening the server source.
- It is useful for self-diagnosis when the agent can connect to the MCP server but is unsure how to call the tools.
- Do not confuse these docs with the fetched pack content; this tool explains the server, not a target library.

**Example**
Language: json
Description: Retrieve the server docs payload.

```json
{
  "name": "agenthub_docs",
  "arguments": {}
}
```

### Connection Model
**Exports**
- MCP endpoint
- docs endpoint
- direct HTTP config
- mcp-remote config

Operational connection paths for human setup and agent-assisted onboarding.

#### MCP endpoint
**Kind**
endpoint

**Summary**
The deployed Streamable HTTP MCP endpoint that exposes Agent Hub tools.

**Definition**
Language: text
Source: `tutorials/use-agent-hub-through-mcp.md`, `netlify/functions/mcp.js`

```text
https://agent-hub-1.netlify.app/mcp
```

**Guidance**
- Use this URL for direct client configuration and manual JSON-RPC testing.
- Manual calls should send `Accept: application/json, text/event-stream`.
- Treat the endpoint as the runtime surface; human-readable docs live at the docs variants below.

**Example**
Language: text
Description: Direct MCP endpoint value for manual or client configuration.

```text
https://agent-hub-1.netlify.app/mcp
```

#### docs endpoint
**Kind**
endpoint

**Summary**
Human-readable or JSON docs for the deployed MCP server.

**Definition**
Language: text
Source: `tutorials/use-agent-hub-through-mcp.md`, `netlify/functions/mcp.js`

```text
https://agent-hub-1.netlify.app/mcp?format=text
https://agent-hub-1.netlify.app/mcp?format=json
```

**Guidance**
- Use the JSON docs for tooling, introspection, or debugging.
- Use the text docs for quick human inspection.
- Prefer `agenthub_docs` once the MCP connection is working; prefer `?format=json` when the connection is not set up yet.

**Example**
Language: text
Description: Human-readable and JSON docs endpoints for Agent Hub MCP.

```text
https://agent-hub-1.netlify.app/mcp?format=text
https://agent-hub-1.netlify.app/mcp?format=json
```

#### direct HTTP config
**Kind**
config

**Summary**
Preferred MCP client configuration when the client supports Streamable HTTP directly.

**Definition**
Language: json
Source: `tutorials/use-agent-hub-through-mcp.md`

```json
{
  "mcpServers": {
    "agent-hub": {
      "url": "https://agent-hub-1.netlify.app/mcp",
      "transport": "http"
    }
  }
}
```

**Guidance**
- Prefer this over proxy-based setups when the client supports it natively.
- Preserve existing MCP servers in the config; do not replace the whole block unnecessarily.
- Use the smallest correct change when editing a client config automatically.

**Example**
Language: json
Description: Minimal direct HTTP MCP config block.

```json
{
  "mcpServers": {
    "agent-hub": {
      "url": "https://agent-hub-1.netlify.app/mcp",
      "transport": "http"
    }
  }
}
```

#### mcp-remote config
**Kind**
config

**Summary**
Fallback configuration pattern for clients that require an MCP proxy wrapper.

**Definition**
Language: json
Source: `tutorials/use-agent-hub-through-mcp.md`

```json
{
  "mcpServers": {
    "agent-hub": {
      "command": "npx",
      "args": ["mcp-remote@next", "https://agent-hub-1.netlify.app/mcp"]
    }
  }
}
```

**Guidance**
- Use this only when the client does not support direct HTTP MCP configuration.
- Explain to users why the proxy is required instead of treating it as the default path.
- When onboarding inside an AI client, detect the correct config style before proposing a snippet.

**Example**
Language: json
Description: Proxy-style config for clients that require `mcp-remote`.

```json
{
  "mcpServers": {
    "agent-hub": {
      "command": "npx",
      "args": ["mcp-remote@next", "https://agent-hub-1.netlify.app/mcp"]
    }
  }
}
```

### Registry Semantics
**Exports**
- tool_id
- version pinning
- latest resolution
- agents directory layout

Rules that govern how packs are named, versioned, and resolved.

#### tool_id
**Kind**
other

**Summary**
The stable identifier for one pack family, usually matching the folder name
under `agents/`.

**Definition**
Language: text
Source: `netlify/functions/mcp.js`

```text
agents/<tool_id>/<version>.md
```

**Guidance**
- Use `tool_id` consistently across `agenthub_versions` and `agenthub_fetch`.
- Keep new IDs simple and avoid characters likely to be sanitized by clients.
- Distinguish the product `agent-hub` pack from example packs like `react`; the latter are verification targets, not the definition of Agent Hub itself.

**Example**
Language: text
Description: The on-disk path shape that determines one pack family.

```text
agents/agent-hub/0.4.0.md
```

#### version pinning
**Kind**
workflow

**Summary**
The practice of fetching an explicit pack version instead of relying on `latest`.

**Definition**
Language: text
Source: `tutorials/use-agent-hub-through-mcp.md`, `website/src/pages/index.js`

```text
Use explicit versions for reproducible behavior, evaluations, and auditability.
```

**Guidance**
- Pin versions for tests, benchmark runs, and long-lived agent workflows.
- Use `latest` when exploring or when freshness matters more than reproducibility.
- Be explicit in user-facing summaries about which version was fetched and why.

**Example**
Language: json
Description: Fetch a pinned Agent Hub pack version for reproducible behavior.

```json
{
  "name": "agenthub_fetch",
  "arguments": {
    "tool_id": "agent-hub",
    "version": "0.4.0"
  }
}
```

#### latest resolution
**Kind**
other

**Summary**
The server resolves `latest` by choosing the lexicographically highest version string.

**Definition**
Language: text
Source: `netlify/functions/mcp.js`

```text
latest = [...versions].sort().reverse()[0]
```

**Guidance**
- Do not assume semver-aware ordering.
- If a precise version matters, call `agenthub_versions` and choose explicitly.
- Surface this nuance when troubleshooting unexpected `latest` behavior.

**Example**
Language: text
Description: Current server rule for resolving `latest`.

```text
latest = lexicographically highest available version string
```

#### agents directory layout
**Kind**
other

**Summary**
The on-disk layout that backs both the registry and the MCP server.

**Definition**
Language: text
Source: `netlify/functions/mcp.js`, `README.md`

```text
agents/<tool_id>/<version>.md
```

**Guidance**
- This is the source of truth for what the server can list and fetch.
- Missing folders or versioned files mean the MCP server cannot serve that pack.
- When creating a new pack, keep the naming consistent so direct file access and MCP access agree.

**Example**
Language: text
Description: Agent Hub's filesystem-backed registry layout.

```text
agents/<tool_id>/<version>.md
```

### Pack Generation Surface
**Exports**
- open-agent-spec-v0.4.0
- authoritative-documents-for-v0.4-pack-generation
- evaluating-agenthub-pack-outputs
- codex-agent-pack-runbook-v0.4.0
- codex-generate-agent-file-v0.4.0

The documents and prompts that govern how Agent Hub packs should be generated,
reviewed, and evaluated locally.

#### open-agent-spec-v0.4.0
**Kind**
other

**Summary**
The normative Markdown specification that defines what a valid `0.4.0` Agent Hub
pack must contain.

**Definition**
Language: text
Source: `spec/open-agent-spec-v0.4.0.md`

```text
spec/open-agent-spec-v0.4.0.md
```

**Guidance**
- Start here when generating or revising packs, because it defines required sections, field names, symbol structure, and allowed `Kind` values.
- If another repo document disagrees with the pack structure, the spec wins.
- Treat this as the contract for pack shape, not as a content-generation tutorial.

**Example**
Language: text
Description: Normative spec path for v0.4 pack structure.

```text
spec/open-agent-spec-v0.4.0.md
```

#### authoritative-documents-for-v0.4-pack-generation
**Kind**
workflow

**Summary**
The tutorial that defines which repo documents are authoritative for pack generation decisions.

**Definition**
Language: text
Source: `tutorials/authoritative-documents-for-v0.4-pack-generation.md`

```text
tutorials/authoritative-documents-for-v0.4-pack-generation.md
```

**Guidance**
- Use this when you need to know whether the spec, validator, runbook, prompts, or generated artifacts should win in a conflict.
- This is the best first tutorial for contributors generating or revising packs locally.
- It is especially important when an AI coding agent is deciding which local files to trust during generation.

**Example**
Language: text
Description: Authority-chain tutorial path for v0.4 pack generation.

```text
tutorials/authoritative-documents-for-v0.4-pack-generation.md
```

#### evaluating-agenthub-pack-outputs
**Kind**
workflow

**Summary**
The guide for comparing two candidate pack outputs by inspection and task-based evaluation.

**Definition**
Language: text
Source: `tutorials/evaluating-agenthub-pack-outputs.md`

```text
tutorials/evaluating-agenthub-pack-outputs.md
```

**Guidance**
- Use this when deciding whether a regenerated pack is actually better than an older one.
- Keep the comparison controlled: same task, same model family, same constraints, different pack inputs.
- Treat this as the acceptance process for content quality, not as the structural spec.

**Example**
Language: text
Description: Evaluation tutorial path for pack comparisons.

```text
tutorials/evaluating-agenthub-pack-outputs.md
```

#### codex-agent-pack-runbook-v0.4.0
**Kind**
workflow

**Summary**
The operational runbook for executing a pack-generation task under the `v0.4` process.

**Definition**
Language: text
Source: `prompts/codex-agent-pack-runbook-v0.4.0.md`

```text
prompts/codex-agent-pack-runbook-v0.4.0.md
```

**Guidance**
- Follow this when a local AI coding agent is doing the generation work and needs explicit execution order, source hierarchy, and completion checks.
- The runbook governs workflow mechanics; it does not override the spec on structure.
- Use it to keep source acquisition, critique, revision, and validation consistent across generation runs.

**Example**
Language: text
Description: Operational runbook path for v0.4 generation tasks.

```text
prompts/codex-agent-pack-runbook-v0.4.0.md
```

#### codex-generate-agent-file-v0.4.0
**Kind**
workflow

**Summary**
The general worker prompt for drafting a final `v0.4` Agent Hub pack from the current source set.

**Definition**
Language: text
Source: `prompts/codex-generate-agent-file-v0.4.0.md`

```text
prompts/codex-generate-agent-file-v0.4.0.md
```

**Guidance**
- Use this as the generic generation worker prompt when no tool-specific brief exists yet.
- Pair it with the runbook, the spec, and any tool-specific brief for better results.
- Treat tool-specific generation briefs as refinements of this base prompt, not replacements for the authority chain.

**Example**
Language: text
Description: Base worker prompt path for final agent-pack drafting.

```text
prompts/codex-generate-agent-file-v0.4.0.md
```
