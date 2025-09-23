# MCP Server on Netlify — Usage Guide

This repo includes a minimal Model Context Protocol (MCP‑flavored) server implemented using Netlify Functions (HTTP JSON‑RPC) plus a lightweight SSE channel via a Netlify Edge Function. It lets clients discover available "tools" (versioned agent YAML files under `agents/**`), fetch a tool manifest, and retrieve the raw YAML for a selected version.

Key implementation files:
- `netlify/functions/mcp.js:1` — JSON‑RPC 2.0 POST handler (tools API)
- `netlify/edge-functions/mcp-sse.js:1` — Server‑Sent Events (SSE) stream with basic MCP handshake
- `netlify.toml:1` — Routes, functions directory, edge function, and redirects
- `scripts/gen-mcp-manifest.js:1` — Generates discovery manifest at `website/.well-known/mcp/ai-plugin.json`


## Endpoints

- POST `/mcp` (JSON‑RPC 2.0)
  - Backed by Netlify Function `mcp` in `netlify/functions/mcp.js:1`.
  - Accepts a JSON‑RPC 2.0 request body and returns a JSON‑RPC 2.0 response.
  - Methods implemented:
    - `listTools` → returns an array of `{ tool_id, versions }` discovered in `agents/**`.
    - `getToolManifest` → `params: { tool_id }` → returns `{ name, tool_id, description, parameters }` where `parameters.version` enum is derived from available YAML versions.
    - `runTool` → `params: { tool_id, parameters: { version } }` → returns `{ content }` where `content` is the YAML string for the requested version. Supports `version: "latest"` which picks the highest lexicographic version.

- GET `/mcp/sse` (SSE)
  - Backed by Netlify Edge Function `mcp-sse` in `netlify/edge-functions/mcp-sse.js:1`.
  - Emits MCP‑style events over `text/event-stream`, including:
    - `server/ready` with minimal capabilities `{ tools: true, resources: false, prompts: false }`.
    - `server/config` with `rpcInbox` pointing at the POST endpoint (by default hard‑coded to the deployed site).
    - Periodic `notifications/heartbeat` and `:ping` comments to keep the connection alive.

Routing/config is defined in `netlify.toml:1`:
- Redirects `POST /mcp` → `/.netlify/functions/mcp`.
- Binds Edge Function `mcp-sse` to `GET /mcp/sse`.
- Ensures `agents/**` are bundled with the function (`[functions."mcp"].included_files`).


## Agents Directory Layout

The server treats each subfolder under `agents/` as a tool, and each `*.yaml` file inside as a version:

```
agents/
  <tool_id>/
    0.3.0.yaml
    0.4.0.yaml
    ...
```

- `listTools` is built from the folders present in `agents/`.
- `getToolManifest` and `runTool` read versions by filename (without `.yaml`).
- `runTool` with `version: "latest"` sorts versions lexicographically descending and returns the first one.


## Quick Start (Local Dev)

1) Install Netlify CLI

```
npm i -g netlify-cli
```

2) Start the dev server from the repo root (so functions see `agents/**`):

```
netlify dev
```

- Functions will be available at `http://localhost:8888/.netlify/functions/*`.
- Due to the redirect in `netlify.toml`, you can use:
  - POST `http://localhost:8888/mcp`
  - GET  `http://localhost:8888/mcp/sse`

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


## JSON‑RPC Methods and Examples

All requests use JSON‑RPC 2.0 envelopes: `{ jsonrpc: "2.0", id, method, params }`.
Responses return either `{ jsonrpc: "2.0", id, result }` (200) or `{ jsonrpc: "2.0", id, error }` (500).

- listTools

```
POST /mcp
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "listTools",
  "params": {}
}
```

Example response:

```
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": [
    { "tool_id": "filecoin", "versions": ["0.3.0"] },
    { "tool_id": "react",    "versions": ["0.3.0"] }
  ]
}
```

- getToolManifest

```
POST /mcp
{
  "jsonrpc": "2.0",
  "id": "2",
  "method": "getToolManifest",
  "params": { "tool_id": "filecoin" }
}
```

Example `result` (shape):

```
{
  "name": "filecoin agent",
  "tool_id": "filecoin",
  "description": "Agent for filecoin",
  "parameters": {
    "type": "object",
    "properties": {
      "version": { "type": "string", "enum": ["0.3.0"] }
    },
    "required": ["version"]
  }
}
```

- runTool

```
POST /mcp
{
  "jsonrpc": "2.0",
  "id": "3",
  "method": "runTool",
  "params": {
    "tool_id": "filecoin",
    "parameters": { "version": "latest" }
  }
}
```

Example `result`:

```
{ "content": "<YAML string for requested version>" }
```

Notes:
- If no versions exist for a tool and `version` is `"latest"`, the server replies with a JSON‑RPC error (HTTP 500).
- Unknown methods also return a JSON‑RPC error (HTTP 500).


## SSE Stream (Status + Handshake)

Connect with any SSE client (or curl):

```
curl -N -H 'Accept: text/event-stream' \
  'http://localhost:8888/mcp/sse?client=myapp'
```

You will see events like:

```
// initial handshake
{ "jsonrpc":"2.0", "method":"server/ready",  "params": { "serverName":"AgentHub on Netlify", "transport":"sse", "client":"myapp", "capabilities": { "tools":true, "resources":false, "prompts":false } } }
{ "jsonrpc":"2.0", "method":"server/config", "params": { "rpcInbox":"https://agent-hub-1.netlify.app/mcp" } }
// periodic heartbeats
{ "jsonrpc":"2.0", "method":"notifications/heartbeat", "params": { "t": 1712345678901 } }
:ping
```

Tips:
- The `rpcInbox` should point at your POST `/mcp` endpoint. In the sample code it is hard‑coded in `netlify/edge-functions/mcp-sse.js:45`; update it for your domain (or compute it dynamically) before deploying.
- SSE is optional for basic operation; it’s a convenience channel for readiness + heartbeats.


## Deployment Notes

- `netlify.toml:1` already wires everything up:
  - `[[redirects]]` sends `/mcp` to the function `/.netlify/functions/mcp`.
  - `[[edge_functions]]` binds `/mcp/sse` to the Edge function.
  - `[functions."mcp"].included_files = ["agents/**"]` ensures the YAML agents ship with the function bundle.
- Push to a Netlify‑connected repo, or build locally with `npm run build` and let Netlify run the same command in CI (`build.command`).

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
  "description": "MCP over SSE + JSON-RPC; serves versioned AgentHub YAML tools.",
  "mcp": {
    "transport": "sse",
    "sse_url": "<base>/mcp/sse",
    "rpc_url": "<base>/mcp"
  },
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


## Using with Cursor and ChatGPT

- Cursor
  - Either paste the SSE and RPC URLs directly:
    - SSE: `https://agent-hub-1.netlify.app/mcp/sse`
    - RPC: `https://agent-hub-1.netlify.app/mcp`
  - Or point Cursor at the manifest URL: `https://agent-hub-1.netlify.app/.well-known/ai-plugin.json`.
  - If you previously saw “missing JSON/manifest,” it was because the file wasn’t published; the build now emits it under `/.well-known/`.

- ChatGPT (Connectors / MCP)
  - Use the same two URLs above for SSE and RPC.
  - If ChatGPT asks for a manifest URL, use: `https://agent-hub-1.netlify.app/.well-known/ai-plugin.json`.
  - The server now supports CORS and `OPTIONS` preflight on `/mcp`, which some browser‑based clients require.


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
