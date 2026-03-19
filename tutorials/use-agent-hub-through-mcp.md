---
hide_table_of_contents: true
---

import AIAgentOnboardingPrompt from '@site/src/components/AIAgentOnboardingPrompt';

# Get Better Agent Answers with Agent Hub MCP

Stop pasting giant agent specs into prompts.

Agent Hub MCP gives your model a cleaner path: connect once, discover available packs, list versions, and fetch the exact spec it needs at runtime. The result is smaller prompts, fresher context, and more repeatable results when you pin versions.

Agent Hub also supports generated Claude-compatible skills as a second
distribution path. MCP is the runtime retrieval path. The generated
Claude-compatible skill is the local file-install path.

With MCP, your coding agent can:

* discover available packs
* list versions for a specific tool
* fetch the exact canonical pack it needs
* retrieve context deliberately instead of carrying oversized prompt material up front

If you specifically want the local file-based path instead, read
[Use Agent Hub Claude-Compatible Skills](/tutorials/use-agent-hub-claude-compatible-skills).

If you want the proof that delivery shape matters, read [Better Context, Better Fixes: Why AgentHub MCP Won a Real React Test](/blog/0005-why-agenthub-mcp-won-react-context-test). In our latest four-way React comparison, Agent Hub MCP outperformed direct-file, no-pack, and inline-pack delivery, finishing first at **59/60**, **9.8/10**, and **rank #1**.

---

## **Fastest Path: AI Agent Onboarding**

If you are already working inside a CLI AI agent environment, the fastest path is usually not manual config editing.

Instead, copy the prompt below and paste it into your AI agent. It tells the agent to:

* detect the right MCP config location
* add Agent Hub MCP if it can do so safely
* fall back to exact manual steps if it cannot
* verify the connection by listing tools and fetching `agent-hub`
* fetch the latest `agent-hub` pack and derive a short routing note from it
* install that note into persistent agent instructions, or print it for manual paste

<AIAgentOnboardingPrompt />

This is the best starting point when you want one onboarding flow that works across multiple agent environments without hard-coding the instructions to a single tool. It also helps the agent learn when to use Agent Hub after setup, instead of only teaching it how to connect once.

### **Why the Onboarding Prompt Installs a Routing Note**

Connecting MCP is only half of the job. An AI agent also needs to know when Agent Hub is worth checking.

That is why the onboarding prompt now asks the agent to fetch the `agent-hub` pack after setup and turn it into a short persistent routing note. The note should teach the agent to:

* use Agent Hub for versioned library, framework, SDK, protocol, or product questions
* prefer just-in-time retrieval over loading many packs up front
* pin versions when reproducibility matters
* skip Agent Hub when the task does not need versioned technical context

If the environment also supports local Claude-compatible skills, the routing
guidance should help the agent distinguish between:

* MCP for runtime retrieval
* generated local skills for file-based installation

---

## **What Agent Hub MCP Gives You**

The Agent Hub MCP server exposes a small, practical tool surface over the versioned packs in `agents/**`.

Today that surface includes:

* `agenthub_list` — search or browse packs
* `agenthub_versions` — list available versions for a tool
* `agenthub_fetch` — fetch a specific version, or `latest`
* `agenthub_distributions` — list generated distributions for a tool and version
* `agenthub_fetch_distribution` — fetch a full generated bundle such as a Claude-compatible skill
* `agenthub_fetch_distribution_file` — fetch one file from a generated bundle
* `agenthub_docs` — fetch server and tooling docs

This is the difference between manually opening a Markdown file for every session and letting your MCP-aware client pull the right pack when it actually needs it.

That runtime path is different from the generated Claude-compatible skill path.
If you want a local `SKILL.md` bundle rather than live retrieval, use the
generated distribution instead of the raw canonical pack.

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

Once your client is connected, Agent Hub should appear as an MCP server with seven tools.

At a high level:

* use `agenthub_list` when you want to browse what exists
* use `agenthub_versions` when you already know the tool ID
* use `agenthub_fetch` when you want the canonical Markdown pack text
* use `agenthub_distributions` when you want to see which generated distributions exist
* use `agenthub_fetch_distribution` when you want the full generated bundle
* use `agenthub_fetch_distribution_file` when you want a single file such as `SKILL.md`
* use `agenthub_docs` when you want the server’s own reference docs

For example, a model can discover that `agent-hub` has multiple versions available, then fetch `latest` to verify the server and inspect the product pack itself.

---

## **Step 4: Try a Real Agent Hub Pack Example**

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

Check Agent Hub versions:

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
      "arguments": { "tool_id": "agent-hub" }
    }
  }'
```

Fetch the latest Agent Hub pack:

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
      "arguments": { "tool_id": "agent-hub", "version": "latest" }
    }
  }'
```

That last response returns the raw Markdown pack your agent can use as runtime context.

---

## **Step 5: Fetch a Claude-Compatible Skill Bundle**

If your client wants the generated Claude-compatible skill instead of the raw canonical pack, list the available distributions first:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "dist-1",
    "method": "tools/call",
    "params": {
      "name": "agenthub_distributions",
      "arguments": { "tool_id": "react", "version": "latest" }
    }
  }'
```

Fetch the full bundle:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "bundle-1",
    "method": "tools/call",
    "params": {
      "name": "agenthub_fetch_distribution",
      "arguments": { "tool_id": "react", "version": "latest", "distribution": "claude" }
    }
  }'
```

Or fetch only the entrypoint skill file:

```bash
curl -sS https://agent-hub-1.netlify.app/mcp \
  -H 'Accept: application/json, text/event-stream' \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "skill-1",
    "method": "tools/call",
    "params": {
      "name": "agenthub_fetch_distribution_file",
      "arguments": {
        "tool_id": "react",
        "version": "latest",
        "distribution": "claude",
        "file_path": "SKILL.md"
      }
    }
  }'
```

Use this path when your client or install flow wants the generated Claude-compatible skill bundle rather than the raw Markdown pack.

---

## **Step 6: Know When to Use `latest` and When to Pin**

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

## **Canonical Pack Vs Generated Claude-Compatible Skill**

Use the canonical pack when you want:

* the authoritative Agent Hub source
* raw Markdown retrieved via `agenthub_fetch`
* the thing contributors edit and review directly

Use the generated Claude-compatible skill when you want:

* a local `SKILL.md` bundle
* a file-based install for Claude-compatible environments
* progressive disclosure through `SKILL.md` plus supporting references

Agent Hub supports both, but they have different jobs.

If you need the file-based path, read:

* [Use Agent Hub Claude-Compatible Skills](/tutorials/use-agent-hub-claude-compatible-skills)

---

## **Step 7: Use It the Way Agents Actually Work**

The best workflow is not “fetch every pack all the time.”

The better workflow is:

1. identify the tool the model is working with
2. check versions if needed
3. fetch the right pack only when the task actually requires it
4. answer with pack-backed context instead of generic memory

That keeps prompts smaller, retrieval cleaner, and context more intentional.

In practice, this means your agent can:

* pull `agent-hub` first when you want to verify the server or explain Agent Hub itself
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
* Fetch `agent-hub`, `typescript`, or another pack you use every day
* Read the React comparison post to see why MCP delivery won in practice: [Better Context, Better Fixes: Why AgentHub MCP Won a Real React Test](/blog/0005-why-agenthub-mcp-won-react-context-test)
* Browse the full pack catalog at [Agent Packs](/agents/)

---

**Agent Hub makes it easy to move from “we have docs somewhere” to “the model has the right context right now.”**
