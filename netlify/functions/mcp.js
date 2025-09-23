const fs = require("fs/promises");
const path = require("path");

const AGENTS_DIR = path.join(process.cwd(), "agents");

exports.handler = async function (event) {
  // Basic CORS handling for browsers / clients like ChatGPT or Cursor
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: ""
    };
  }

  // Allow HEAD/GET for liveness and simple query-mode RPC (for picky clients)
  if (event.httpMethod === "HEAD") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }
  if (event.httpMethod === "GET") {
    const qs = event.queryStringParameters || {};
    const method = qs.method;
    const id = qs.id || null;
    let params = {};
    if (qs.params) {
      try { params = JSON.parse(qs.params); } catch {}
    }
    if (!method) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          result: {
            ok: true,
            message: "AgentHub MCP function",
            endpoints: {
              sse: "/mcp/sse",
              rpc: "/.netlify/functions/mcp"
            },
            methods: ["tools/list", "tools/call", "listTools", "getToolManifest", "runTool", "ping"]
          }
        })
      };
    }
    try {
      return await handleRpc(method, params, id);
    } catch (err) {
      return jsonrpcError(id, err.message || String(err));
    }
  }
  
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders(), body: "Method not allowed" };
  }

  try {
    const { method, params, id } = JSON.parse(event.body);
    return await handleRpc(method, params, id);
  } catch (err) {
    return jsonrpcError(null, err.message);
  }
};

async function handleRpc(method, params, id) {
  // MCP-compatible aliases
  if (method === "tools/list" || method === "tools.list") {
    const toolDefs = mcpGenericTools();
    return jsonrpc(id, { tools: toolDefs });
  }

  if (method === "tools/call" || method === "tools.call") {
    const { name, arguments: args = {} } = params || {};
    if (!name) return jsonrpcError(id, "Missing tool name");
    const tool = String(name);

    if (tool === "agenthub.list") {
      const { q = "", limit = 20, offset = 0 } = args || {};
      const page = await agenthubList({ q, limit, offset });
      return jsonrpc(id, { content: [{ type: "text", text: JSON.stringify(page) }] });
    }

    if (tool === "agenthub.versions") {
      const { tool_id } = args || {};
      if (!tool_id) return jsonrpcError(id, "Missing 'tool_id'");
      const versions = await listVersions(tool_id);
      return jsonrpc(id, { content: [{ type: "text", text: JSON.stringify({ tool_id, versions }) }] });
    }

    if (tool === "agenthub.fetch") {
      const { tool_id, version = "latest" } = args || {};
      if (!tool_id) return jsonrpcError(id, "Missing 'tool_id'");
      const yaml = await readAgentByName(tool_id, version);
      return jsonrpc(id, { content: [{ type: "text", text: yaml }] });
    }

    // Back-compat: treat unknown tool as direct fetch by tool_id
    const version = (args && args.version) || "latest";
    const content = await readAgentByName(tool, version);
    return jsonrpc(id, { content: [{ type: "text", text: content }] });
  }

  if (method === "ping") {
    return jsonrpc(id, { status: "ok", t: Date.now() });
  }

  if (method === "getToolManifest") {
    const { tool_id } = params || {};
    const manifest = await buildToolManifest(tool_id);
    return jsonrpc(id, manifest);
  }

  if (method === "runTool") {
    const { tool_id, parameters = {} } = params || {};
    let version = parameters.version;

    if (version === "latest") {
      const allVersions = await listVersions(tool_id);
      if (allVersions.length === 0) throw new Error(`No versions found for tool: ${tool_id}`);
      version = allVersions.sort().reverse()[0];
    }

    const content = await readAgentFile(tool_id, version);
    return jsonrpc(id, { content });
  }

  if (method === "listTools") {
    const tools = await listAllTools();
    return jsonrpc(id, tools);
  }

  return jsonrpcError(id, "Unknown method");
}

async function buildToolManifest(tool_id) {
  const dir = path.join(AGENTS_DIR, tool_id);
  const files = await fs.readdir(dir);
  const versions = files.filter(f => f.endsWith(".yaml")).map(f => f.replace(".yaml", ""));
  return {
    name: `${tool_id} agent`,
    tool_id,
    description: `Agent for ${tool_id}`,
    parameters: {
      type: "object",
      properties: {
        version: { type: "string", enum: versions }
      },
      required: ["version"]
    }
  };
}

async function readAgentFile(tool_id, version) {
  const filePath = path.join(AGENTS_DIR, tool_id, `${version}.yaml`);
  return await fs.readFile(filePath, "utf-8");
}

function jsonrpc(id, result) {
  return {
    statusCode: 200,
    body: JSON.stringify({ jsonrpc: "2.0", id, result }),
    headers: { ...corsHeaders(), "Content-Type": "application/json" }
  };
}

async function listVersions(tool_id) {
  const dir = path.join(AGENTS_DIR, tool_id);
  const files = await fs.readdir(dir);
  return files
    .filter(f => f.endsWith(".yaml"))
    .map(f => f.replace(".yaml", ""));
}

function jsonrpcError(id, message) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code: -32000, message }
    }),
    headers: { ...corsHeaders(), "Content-Type": "application/json" }
  };
}

async function listAllTools() {
  const toolDirs = await fs.readdir(AGENTS_DIR, { withFileTypes: true });
  const tools = [];

  for (const dirent of toolDirs) {
    if (!dirent.isDirectory()) continue;

    const tool_id = dirent.name;
    const versions = await listVersions(tool_id);
    tools.push({ tool_id, versions });
  }

  return tools;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };
}

// Small, stable MCP tool surface
function mcpGenericTools() {
  return [
    {
      name: "agenthub.list",
      description: "List available AgentHub tools (paged)",
      input_schema: {
        type: "object",
        properties: {
          q: { type: "string", description: "Filter by tool_id substring" },
          limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          offset: { type: "integer", minimum: 0, default: 0 }
        }
      }
    },
    {
      name: "agenthub.versions",
      description: "List available versions for a tool_id",
      input_schema: {
        type: "object",
        properties: {
          tool_id: { type: "string" }
        },
        required: ["tool_id"]
      }
    },
    {
      name: "agenthub.fetch",
      description: "Fetch a specific AgentHub YAML by tool_id + version",
      input_schema: {
        type: "object",
        properties: {
          tool_id: { type: "string" },
          version: { type: "string", description: "Version or 'latest'", default: "latest" }
        },
        required: ["tool_id"]
      }
    }
  ];
}

async function agenthubList({ q = "", limit = 20, offset = 0 }) {
  const all = await listAllTools();
  const qnorm = String(q || "").toLowerCase();
  const filtered = qnorm
    ? all.filter(({ tool_id }) => tool_id.toLowerCase().includes(qnorm))
    : all;

  const total = filtered.length;
  const lim = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const off = Math.max(0, parseInt(offset, 10) || 0);
  const items = filtered.slice(off, off + lim);

  return { total, limit: lim, offset: off, q, items };
}

async function readAgentByName(name, version) {
  // name corresponds to tool_id
  if (version === "latest") {
    const all = await listVersions(name);
    if (!all.length) throw new Error(`No versions found for tool: ${name}`);
    version = all.sort().reverse()[0];
  }
  return await readAgentFile(name, version);
}
