---
hide_table_of_contents: true
---

import AIAgentOnboardingPrompt from '@site/src/components/AIAgentOnboardingPrompt';

# Get Better Agent Answers with Agent Hub MCP

Stop pasting giant agent specs into prompts.

Agent Hub MCP gives your model a cleaner path: connect once, discover available packs, list versions, and fetch the exact spec it needs at runtime. The result is smaller prompts, fresher context, and more repeatable results when you pin versions.

With MCP, your coding agent can:

* discover available packs
* list versions for a specific tool
* fetch the exact Markdown spec it needs
* retrieve context deliberately instead of carrying oversized prompt material up front

If you want the proof that delivery shape matters, read [Better Context, Better Fixes: Why AgentHub MCP Won a Real React Test](/blog/0005-why-agenthub-mcp-won-react-context-test). In our latest four-way React comparison, Agent Hub MCP outperformed direct-file, no-pack, and inline-pack delivery, finishing first at **59/60**, **9.8/10**, and **rank #1**.

---

## **Fastest Path: AI Agent Onboarding**

If you are already working inside a CLI AI agent environment, the fastest path is usually not manual config editing.

Instead, copy the prompt below and paste it into your AI agent. It tells the agent to:

* detect the right MCP config location
* add Agent Hub MCP if it can do so safely
* fall back to exact manual steps if it cannot
* verify the connection by listing tools and fetching `react`

<AIAgentOnboardingPrompt />

This is the best starting point when you want one onboarding flow that works across multiple agent environments without hard-coding the instructions to a single tool.

---

## **What Agent Hub MCP Gives You**

The Agent Hub MCP server exposes a small, practical tool surface over the versioned packs in `agents/**`.

Today that surface includes:

* `agenthub_list` — search or browse packs
* `agenthub_versions` — list available versions for a tool
* `agenthub_fetch` — fetch a specific version, or `latest`
* `agenthub_docs` — fetch server and tooling docs

This is the difference between manually opening a Markdown file for every session and letting your MCP-aware client pull the right pack when it actually needs it.

---

## **Step 1: Start With the Deployed MCP Endpoint**

Agent Hub’s deployed MCP server lives at:

```text
https://agent-hub-1.netlify.app/mcp
```

Human-readable or JSON docs are available at:

```text
https://agent-hub-1.netlify.app/mcp?format=text
https://agent-hub-1.netlify.app/mcp?format=json
```

If you are wiring up a client manually, send this `Accept` header:

```text
Accept: application/json, text/event-stream
```

---

## **Step 2: Connect Agent Hub to Your MCP Client**

If your MCP client supports Streamable HTTP directly, use:

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

If your client works better through `mcp-remote`, use:

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

This is the easiest way to make Agent Hub available inside MCP-aware tools like Cursor, Claude, Warp, and similar environments.

---

## **Step 3: Inspect the Tool Surface**

Once your client is connected, Agent Hub should appear as an MCP server with four tools.

At a high level:

* use `agenthub_list` when you want to browse what exists
* use `agenthub_versions` when you already know the tool ID
* use `agenthub_fetch` when you want the actual pack text
* use `agenthub_docs` when you want the server’s own reference docs

For example, a model can discover that `react` has multiple versions available, then fetch `latest` before answering a React question.

---

## **Step 4: Try a Real React Example**

Here is a minimal JSON-RPC flow against the deployed endpoint.

Initialize:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "init-1",
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-06-18",
      "capabilities": {},
      "clientInfo": { "name": "agent-hub-demo", "version": "1.0.0" }
    }
  }'
```

List tools:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "tools-1",
    "method": "tools/list",
    "params": {}
  }'
```

Check React versions:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "versions-1",
    "method": "tools/call",
    "params": {
      "name": "agenthub_versions",
      "arguments": { "tool_id": "react" }
    }
  }'
```

Fetch the latest React pack:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "fetch-1",
    "method": "tools/call",
    "params": {
      "name": "agenthub_fetch",
      "arguments": { "tool_id": "react", "version": "latest" }
    }
  }'
```

That last response returns the raw Markdown pack your agent can use as runtime context.

---

## **Step 5: Know When to Use `latest` and When to Pin**

Use `version: "latest"` when:

* you want the newest pack available for a tool
* you are exploring or prototyping
* you want the freshest general guidance

Use an explicit version when:

* you want reproducible agent behavior
* you are testing outputs over time
* your workflow or product depends on a known pack revision

This is one of the quiet advantages of Agent Hub over ad hoc prompt snippets: versioned context is much easier to reason about and audit.

---

## **Step 6: Use It the Way Agents Actually Work**

The best workflow is not “fetch every pack all the time.”

The better workflow is:

1. identify the tool the model is working with
2. check versions if needed
3. fetch the right pack only when the task actually requires it
4. answer with pack-backed context instead of generic memory

That keeps prompts smaller, retrieval cleaner, and context more intentional.

In practice, this means your agent can:

* pull `react` before answering a React performance question
* fetch `ethers` before writing a wallet or contract integration
* grab `typescript` before untangling generics or module-resolution issues
* switch between packs without rewriting your whole system prompt every time

---

## **Why This Matters**

Agent Hub is not just a file registry. It is a context-delivery layer.

That distinction matters.

The React comparison linked above is a good example: the best result did not come from the most raw context. It came from the best-delivered context.

That is the practical value of Agent Hub MCP:

* cleaner retrieval than giant inline prompt blobs
* more structure than “answer from memory”
* better runtime ergonomics than manually opening Markdown files

If you are building coding agents, internal copilots, or AI-native tooling, MCP is the fastest path to making Agent Hub usable inside the workflow itself.

---

## **Next Steps**

* Connect the deployed MCP endpoint to your client
* Fetch `react`, `typescript`, or another pack you use every day
* Read the React comparison post to see why MCP delivery won in practice: [Better Context, Better Fixes: Why AgentHub MCP Won a Real React Test](/blog/0005-why-agenthub-mcp-won-react-context-test)
* Browse the full pack catalog at [Agent Specs](/agents/)

---

**Agent Hub makes it easy to move from “we have docs somewhere” to “the model has the right context right now.”**
