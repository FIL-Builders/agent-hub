const fs = require("fs/promises");
const path = require("path");

const AGENTS_DIR = path.join(process.cwd(), "agents");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { method, params, id } = JSON.parse(event.body);

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
    headers: { "Content-Type": "application/json" }
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
    headers: { "Content-Type": "application/json" }
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

