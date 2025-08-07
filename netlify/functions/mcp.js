const fs = require("fs/promises");
const path = require("path");

const AGENTS_DIR = path.resolve(__dirname, "../../agents");

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
      const content = await readAgentFile(tool_id, parameters.version);
      return jsonrpc(id, { content });
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

