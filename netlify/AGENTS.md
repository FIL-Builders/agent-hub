# MCP Server on Netlify — Minimal HTTP Setup

This repo exposes a minimal, standard MCP server using Netlify Functions and the official MCP SDK’s Streamable HTTP transport. It serves a small, stable tool surface to browse and fetch versioned agent Markdown files from `agents/**` and generated Claude-compatible skill bundles from `distributions/claude/**`.

Key files:
- `netlify/functions/mcp.js:1` — Streamable HTTP MCP server (SDK)
- `netlify.toml:1` — Functions config (no SSE; no redirects needed)
- `scripts/gen-mcp-manifest.js:1` — Writes `/.well-known/ai-plugin.json` (transport=http)


## Endpoint

- HTTP `/mcp` — Streamable HTTP transport (SDK)
  - Netlify Function configured via `export const config = { path: "/mcp" }`.
  - `tools` surface (via SDK):
    - `agenthub_list` — args `{ q?: string, limit?: number, offset?: number }`; returns a JSON page of `{ tool_id, versions }`.
    - `agenthub_versions` — args `{ tool_id }`; returns `{ tool_id, versions }`.
    - `agenthub_fetch` — args `{ tool_id, version?: string|'latest' }`; returns raw spec text.
    - `agenthub_distributions` — args `{ tool_id, version?: string|'latest' }`; returns available generated distributions for that tool/version.
    - `agenthub_fetch_distribution` — args `{ tool_id, version?: string|'latest', distribution?: string }`; returns a machine-readable distribution bundle with file contents.
    - `agenthub_fetch_distribution_file` — args `{ tool_id, version?: string|'latest', distribution?: string, file_path }`; returns raw file text from a generated bundle.
    - `agenthub_docs` — returns server/tool docs as JSON.


## Agents Directory Layout

The server treats each subfolder under `agents/` as a tool, and each `*.md` file inside as a version:

```
agents/
  <tool_id>/
    0.3.0.md
    0.4.0.md
    ...
```

- `listTools` is built from the folders present in `agents/`.
- `getToolManifest` and `runTool` read versions by filename (without `.md`).
- `runTool` with `version: "latest"` sorts versions lexicographically descending and returns the first one.

Generated Claude-compatible skills live in:

```
distributions/
  claude/
    <tool_id>/
      <version>/
        SKILL.md
        references/
        manifest.json
```


## Quick Start (Local Dev)

1) Install Netlify CLI

```
npm i -g netlify-cli
```

2) Start the dev server from the repo root (so functions see `agents/**`):

```
netlify dev
```

- MCP will be available at `http://localhost:8888/mcp` (streamable HTTP).

3) Make a test call

```
curl -sS -X POST http://localhost:8888/mcp \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc":"2.0",
    "id":"1",
    "method":"listTools",
    "params":{}
  }' | jq .
```


## JSON‑RPC Methods (via SDK)

- tools/list → returns 7 tools
- tools/call → routes to `agenthub_list`, `agenthub_versions`, `agenthub_fetch`, `agenthub_distributions`, `agenthub_fetch_distribution`, `agenthub_fetch_distribution_file`, `agenthub_docs`


SSE is not required in this minimal setup.


## Deployment Notes

- `export const config = { path: "/mcp" }` in `netlify/functions/mcp.js:1` exposes `/mcp` directly.
- `[functions."mcp"].included_files = ["agents/**", "distributions/**"]` ensures both canonical packs and generated skill bundles ship with the function bundle.
- Push to a Netlify‑connected repo, or build locally with `npm run build` and let Netlify CI run the same.

- GET `/.well-known/mcp/health`
  - Backed by Netlify Function `mcp-health`.
  - Returns `{ status: "ok", time, mcp: { transport: "sse" }, sse, rpc, manifest }` with CORS enabled.


## MCP Discovery Manifest

The build step generates discovery manifests via `scripts/gen-mcp-manifest.js:1` to:

- `/.well-known/ai-plugin.json`
- `/.well-known/mcp/ai-plugin.json`

They include:

```
{
  "schema_version": "v1",
  "name": "AgentHub MCP Server",
  "description": "MCP over Streamable HTTP; serves versioned AgentHub Markdown specs.",
  "mcp": { "transport": "http", "rpc_url": "<base>/mcp" },
  "tools": [ { "tool_id": "..." } ]
}
```

Notes:
- The generator writes into `website/static/.well-known/**` so Docusaurus publishes them.
- `base` is read from `MCP_BASE_URL` (preferred) or Netlify `DEPLOY_PRIME_URL`/`DEPLOY_URL`/`URL`; locally it falls back to `http://localhost:8888`.


## Security and Limitations

- No authentication is implemented. Consider adding a token check on both `/mcp` and `/mcp/sse` for production use.
- Only tool discovery and retrieval are supported; MCP resources/prompts are not implemented.
- Version selection is lexicographic; if you need true semantic sorting, update `runTool` accordingly in `netlify/functions/mcp.js:21`.


## Using with Cursor / Warp / Claude

Recommended (proxy):
- Local (Inspector / Claude / Warp): `{ "mcpServers": { "agent-hub": { "command": "npx", "args": ["mcp-remote@next", "http://localhost:8888/mcp"] } } }`
- Deployed: `{ "mcpServers": { "agent-hub": { "command": "npx", "args": ["mcp-remote@next", "https://agent-hub-1.netlify.app/mcp"] } } }`

Direct (hosts with Streamable HTTP):
- Local HTTP: `{ "mcpServers": { "agent-hub": { "url": "http://localhost:8888/mcp", "transport": "http" } } }`
- Deployed HTTP: `{ "mcpServers": { "agent-hub": { "url": "https://agent-hub-1.netlify.app/mcp", "transport": "http" } } }`


## Minimal Client Snippets

- JavaScript (fetch):

```js
const res = await fetch("/mcp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ jsonrpc: "2.0", id: "1", method: "listTools", params: {} })
});
const json = await res.json();
console.log(json.result);
```

- JavaScript (SSE):

```js
const es = new EventSource("/mcp/sse?client=myapp");
es.onmessage = (e) => {
  // Each e.data is a JSON string (or a comment line starting with ':')
  if (e.data && !e.data.startsWith(":")) {
    const msg = JSON.parse(e.data);
    console.log("SSE", msg);
  }
};
```


---

If you want me to wire up dynamic `rpcInbox` in the SSE function or add authentication, say the word and I’ll patch it in.
