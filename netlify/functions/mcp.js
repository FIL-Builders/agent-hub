export default async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Dynamically import ESM-only deps to avoid CJS require errors in Netlify's bundler
    const [
      streamableMod,
      mcpMod,
      zodMod,
      fetchToNodeMod,
      fsMod,
      pathMod
    ] = await Promise.all([
      import("@modelcontextprotocol/sdk/server/streamableHttp.js"),
      import("@modelcontextprotocol/sdk/server/mcp.js"),
      // Use zod from root deps (must be v3.x to match SDK)
      import("zod"),
      import("fetch-to-node"),
      import("fs/promises"),
      import("path")
    ]);

    const { StreamableHTTPServerTransport } = streamableMod;
    const { McpServer } = mcpMod;
    const { z } = zodMod;
    const { toFetchResponse, toReqRes } = fetchToNodeMod;
    const fs = fsMod.default || fsMod;
    const path = pathMod.default || pathMod;
    const AGENTS_DIR = path.join(process.cwd(), "agents");

    const { req: nodeReq, res: nodeRes } = toReqRes(req);
    const server = await buildServer({ McpServer, z, fs, path, AGENTS_DIR });
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

async function buildServer({ McpServer, z, fs, path, AGENTS_DIR }) {
  const server = new McpServer({ name: "agent-hub", version: "1.0.0" }, { capabilities: { logging: {} } });

  // Register tools using the config API so inputSchema is honored (raw Zod shape)
  server.registerTool(
    "agenthub.list",
    {
      description: "List available AgentHub tools (paged)",
      inputSchema: {
        q: z.string().optional().default(""),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0)
      }
    },
    async ({ q = "", limit = 20, offset = 0 }) => {
      const all = await listAllTools({ fs, path, AGENTS_DIR });
      const qnorm = String(q).toLowerCase();
      const filtered = qnorm ? all.filter(({ tool_id }) => tool_id.toLowerCase().includes(qnorm)) : all;
      const total = filtered.length;
      const items = filtered.slice(offset, offset + limit);
      return { content: [{ type: "text", text: JSON.stringify({ total, limit, offset, q, items }) }] };
    }
  );

  server.registerTool(
    "agenthub.versions",
    {
      description: "List available versions for a tool_id",
      inputSchema: { tool_id: z.string() }
    },
    async ({ tool_id }) => {
      const versions = await listVersions({ fs, path, AGENTS_DIR, tool_id });
      return { content: [{ type: "text", text: JSON.stringify({ tool_id, versions }) }] };
    }
  );

  server.registerTool(
    "agenthub.fetch",
    {
      description: "Fetch a specific AgentHub YAML by tool_id + version",
      inputSchema: { tool_id: z.string(), version: z.string().optional().default("latest") }
    },
    async ({ tool_id, version = "latest" }) => {
      const yaml = await readAgentByName({ fs, path, AGENTS_DIR, name: tool_id, version });
      return { content: [{ type: "text", text: yaml }] };
    }
  );

  return server;
}

async function listAllTools({ fs, path, AGENTS_DIR }) {
  const toolDirs = await fs.readdir(AGENTS_DIR, { withFileTypes: true });
  const tools = [];
  for (const dirent of toolDirs) {
    if (!dirent.isDirectory()) continue;
    const tool_id = dirent.name;
    const versions = await listVersions({ fs, path, AGENTS_DIR, tool_id });
    tools.push({ tool_id, versions });
  }
  return tools;
}

async function listVersions({ fs, path, AGENTS_DIR, tool_id }) {
  const dir = path.join(AGENTS_DIR, tool_id);
  const files = await fs.readdir(dir);
  return files.filter(f => f.endsWith(".yaml")).map(f => f.replace(/\.yaml$/, ""));
}

async function readAgentByName({ fs, path, AGENTS_DIR, name, version }) {
  let v = version;
  if (v === "latest") {
    const all = await listVersions({ fs, path, AGENTS_DIR, tool_id: name });
    if (!all.length) throw new Error(`No versions found for tool: ${name}`);
    v = all.sort().reverse()[0];
  }
  const filePath = path.join(AGENTS_DIR, name, `${v}.yaml`);
  return await fs.readFile(filePath, "utf-8");
}
