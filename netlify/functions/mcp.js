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

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders(), body: "Method not allowed" };
  }

  try {
    const { method, params, id } = JSON.parse(event.body);

    // MCP-compatible aliases
    if (method === "tools/list" || method === "tools.list") {
      const toolDefs = await mcpListTools();
      return jsonrpc(id, { tools: toolDefs });
    }

    if (method === "tools/call" || method === "tools.call") {
      const { name, arguments: args = {} } = params || {};
      if (!name) return jsonrpcError(id, "Missing tool name");
      const version = args.version || "latest";
      const content = await readAgentByName(name, version);
      // MCP content array result
      return jsonrpc(id, { content: [{ type: "text", text: content }] });
    }

    if (method === "ping") {
      return jsonrpc(id, { status: "ok", t: Date.now() });
    }

    if (method === "getToolManifest") {
      const { tool_id } = params;
      const manifest = await buildToolManifest(tool_id);
      return jsonrpc(id, manifest);
    }

    if (method === "runTool") {
      const { tool_id, parameters } = params;
      let version = parameters.version;

      if (version === "latest") {
        const allVersions = await listVersions(tool_id);
        if (allVersions.length === 0) throw new Error(`No versions found for tool: ${tool_id}`);

        // Sort descending using semver if your versions are semantic, else lexicographically
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
  } catch (err) {
    return jsonrpcError(null, err.message);
  }
};

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };
}

// Build MCP tool definitions with input_schema
async function mcpListTools() {
  const tools = await listAllTools();
  return tools.map(({ tool_id, versions }) => ({
    name: tool_id,
    description: `Agent for ${tool_id}`,
    input_schema: {
      type: "object",
      properties: {
        version: { type: "string", enum: versions, description: "Agent file version (or 'latest')" }
      },
      required: versions && versions.length ? ["version"] : []
    }
  }));
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
