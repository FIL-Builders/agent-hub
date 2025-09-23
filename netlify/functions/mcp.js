import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { toFetchResponse, toReqRes } from "fetch-to-node";
import fs from "fs/promises";
import path from "path";

const AGENTS_DIR = path.join(process.cwd(), "agents");

export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { req: nodeReq, res: nodeRes } = toReqRes(req);
    const server = await buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);

    const body = await req.json();
    await transport.handleRequest(nodeReq, nodeRes, body);

    nodeRes.on("close", () => {
      try { transport.close(); } catch {}
      try { server.close(); } catch {}
    });

    return toFetchResponse(nodeRes);
  } catch (error) {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: ""
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/mcp" };

async function buildServer() {
  const server = new McpServer(
    { name: "agent-hub", version: "1.0.0" },
    { capabilities: { logging: {} } }
  );

  server.tool(
    "agenthub.list",
    "List available AgentHub tools (paged)",
    z.object({
      q: z.string().optional().default(""),
      limit: z.number().int().min(1).max(100).default(20),
      offset: z.number().int().min(0).default(0)
    }),
    async ({ q = "", limit = 20, offset = 0 }) => {
      const all = await listAllTools();
      const qnorm = String(q).toLowerCase();
      const filtered = qnorm ? all.filter(({ tool_id }) => tool_id.toLowerCase().includes(qnorm)) : all;
      const total = filtered.length;
      const items = filtered.slice(offset, offset + limit);
      return { content: [ { type: "text", text: JSON.stringify({ total, limit, offset, q, items }) } ] };
    }
  );

  server.tool(
    "agenthub.versions",
    "List available versions for a tool_id",
    z.object({ tool_id: z.string() }),
    async ({ tool_id }) => {
      const versions = await listVersions(tool_id);
      return { content: [ { type: "text", text: JSON.stringify({ tool_id, versions }) } ] };
    }
  );

  server.tool(
    "agenthub.fetch",
    "Fetch a specific AgentHub YAML by tool_id + version",
    z.object({ tool_id: z.string(), version: z.string().optional().default("latest") }),
    async ({ tool_id, version = "latest" }) => {
      const yaml = await readAgentByName(tool_id, version);
      return { content: [ { type: "text", text: yaml } ] };
    }
  );

  return server;
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

async function listVersions(tool_id) {
  const dir = path.join(AGENTS_DIR, tool_id);
  const files = await fs.readdir(dir);
  return files.filter(f => f.endsWith(".yaml")).map(f => f.replace(/\.yaml$/, ""));
}

async function readAgentByName(name, version) {
  if (version === "latest") {
    const all = await listVersions(name);
    if (!all.length) throw new Error(`No versions found for tool: ${name}`);
    version = all.sort().reverse()[0];
  }
  const filePath = path.join(AGENTS_DIR, name, `${version}.yaml`);
  return await fs.readFile(filePath, "utf-8");
}

