export default async (req) => {
  try {
    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;

    // Lightweight docs and CORS to improve usability for humans and agents.
    if (req.method === "OPTIONS") {
      return new Response("", { status: 204, headers: corsHeaders() });
    }

    if (req.method === "HEAD") {
      // Health-ish HEAD response with allowed methods
      return new Response("", {
        status: 204,
        headers: { ...corsHeaders(), Allow: "POST, GET, OPTIONS, HEAD" }
      });
    }

    if (req.method === "GET") {
      const fmt = (url.searchParams.get("format") || url.searchParams.get("fmt") || "text").toLowerCase();
      const docJson = buildDocsJSON({ baseUrl: origin });
      if (fmt === "json") {
        return new Response(JSON.stringify(docJson, null, 2), {
          status: 200,
          headers: {
            ...corsHeaders(),
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        });
      }
      return new Response(buildDocsText(docJson), {
        status: 200,
        headers: {
          ...corsHeaders(),
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method Not Allowed",
          hint: "POST for MCP JSON-RPC; GET ?format=json for docs.",
          allow: ["POST", "GET", "OPTIONS", "HEAD"],
          docs: `${origin}/mcp?format=json`
        }),
        {
          status: 405,
          headers: { ...corsHeaders(), "Content-Type": "application/json", Allow: "POST, GET, OPTIONS, HEAD" }
        }
      );
    }

    // Validate content-type and parse body early for clearer errors
    const contentType = req.headers.get("content-type") || "";
    if (!/application\/json/i.test(contentType)) {
      return new Response(
        JSON.stringify({
          error: "Unsupported Media Type",
          hint: "Send JSON body with header Content-Type: application/json",
          example: {
            jsonrpc: "2.0",
            id: "1",
            method: "listTools",
            params: {}
          }
        }),
        { status: 415, headers: { ...corsHeaders(), "Content-Type": "application/json" } }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          hint: "Body must be a valid JSON-RPC 2.0 object",
          example: { jsonrpc: "2.0", id: "1", method: "listTools", params: {} }
        }),
        { status: 400, headers: { ...corsHeaders(), "Content-Type": "application/json" } }
      );
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
    // Ensure permissive CORS for browser-based clients
    try {
      nodeRes.setHeader("Access-Control-Allow-Origin", "*");
      nodeRes.setHeader("Access-Control-Allow-Headers", "Content-Type, Mcp-Session-Id, Authorization");
      nodeRes.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, HEAD");
      nodeRes.setHeader("X-AgentHub-Docs", `${origin}/mcp?format=json`);
    } catch {}

    const server = await buildServer({ McpServer, z, fs, path, AGENTS_DIR });
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);

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
        error: { code: -32603, message: (error && (error.stack || error.message)) || "Internal server error" },
        id: ""
      }),
      { status: 500, headers: { ...corsHeaders(), "Content-Type": "application/json" } }
    );
  }
};

export const config = { path: "/mcp" };

async function buildServer({ McpServer, z, fs, path, AGENTS_DIR }) {
  const server = new McpServer({ name: "agent-hub", version: "1.1.0" }, { capabilities: { logging: {} } });
  const DISTRIBUTIONS_DIR = path.join(process.cwd(), "distributions", "claude");
  const DISTRIBUTION_LABELS = {
    claude: "Claude-compatible skill"
  };

  // Register tools using the config API so inputSchema is honored (raw Zod shape)
  server.registerTool(
    "agenthub_list",
    {
      title: "AgentHub: List Tools",
      description:
        "List available AgentHub tools with basic paging and a simple case-insensitive substring filter on tool_id.\n" +
        "- q: optional string; filters by tool_id substring (case-insensitive).\n" +
        "- limit: 1..100 (default 20).\n" +
        "- offset: >= 0 (default 0).\n" +
        "Returns JSON text: { total, limit, offset, q, items: [{ tool_id, versions }] }.",
      inputSchema: {
        q: z.string().describe("Substring filter on tool_id (case-insensitive)").optional().default(""),
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
      const nextOffset = offset + items.length < total ? offset + items.length : null;
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ total, limit, offset, nextOffset, q, items }, null, 2)
          }
        ]
      };
    }
  );

  server.registerTool(
    "agenthub_versions",
    {
      title: "AgentHub: List Versions",
      description:
        "List available versions for a given tool_id (folder name under agents/).\n" +
        "Returns JSON text: { tool_id, versions }.",
      inputSchema: { tool_id: z.string().describe("Tool folder under agents/, e.g., 'openserv-labs-sdk'") }
    },
    async ({ tool_id }) => {
      const versions = await listVersions({ fs, path, AGENTS_DIR, tool_id });
      return { content: [{ type: "text", text: JSON.stringify({ tool_id, versions }, null, 2) }] };
    }
  );

  server.registerTool(
    "agenthub_fetch",
    {
      title: "AgentHub: Fetch Spec",
      description:
        "Fetch a specific AgentHub Markdown spec by tool_id and version.\n" +
        "- version: string or 'latest' (lexicographically highest).\n" +
        "Returns raw spec text.",
      inputSchema: {
        tool_id: z.string().describe("Tool folder under agents/"),
        version: z.string().optional().default("latest")
      }
    },
    async ({ tool_id, version = "latest" }) => {
      // Provide friendly errors including available versions
      const versions = await listVersions({ fs, path, AGENTS_DIR, tool_id }).catch(() => []);
      if (!versions.length) {
        throw new Error(`Unknown tool_id '${tool_id}'. No versions found under agents/${tool_id}.`);
      }
      let selected = version;
      if (version === "latest") {
        selected = [...versions].sort().reverse()[0];
      }
      if (!versions.includes(selected)) {
        throw new Error(
          `Unknown version '${version}' for tool '${tool_id}'. Available: [${versions.join(", ")}]`
        );
      }
      const specText = await readAgentByName({ fs, path, AGENTS_DIR, name: tool_id, version: selected });
      return { content: [{ type: "text", text: specText }] };
    }
  );

  // Chosen PR 4 design: add new distribution-specific tools instead of changing
  // the existing pack tools. This preserves backward compatibility for current
  // Markdown-pack clients while exposing generated Claude-compatible bundles.
  server.registerTool(
    "agenthub_distributions",
    {
      title: "AgentHub: List Distributions",
      description:
        "List available distributions for a tool_id and version.\n" +
        "- version: string or 'latest' (default 'latest').\n" +
        "Returns JSON text: { tool_id, version, distributions: [{ distribution, label, entrypoint, files, description }] }.",
      inputSchema: {
        tool_id: z.string().describe("Tool folder under agents/"),
        version: z.string().optional().default("latest")
      }
    },
    async ({ tool_id, version = "latest" }) => {
      const selectedVersion = await resolveVersion({ fs, path, AGENTS_DIR, tool_id, version });
      const distributions = await listDistributions({
        fs,
        path,
        DISTRIBUTIONS_DIR,
        tool_id,
        version: selectedVersion,
        distributionLabels: DISTRIBUTION_LABELS
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ tool_id, version: selectedVersion, distributions }, null, 2)
          }
        ]
      };
    }
  );

  server.registerTool(
    "agenthub_fetch_distribution",
    {
      title: "AgentHub: Fetch Distribution",
      description:
        "Fetch a generated distribution bundle for a tool_id and version.\n" +
        "- version: string or 'latest' (default 'latest').\n" +
        "- distribution: distribution slug (default 'claude').\n" +
        "Returns JSON text with entrypoint and file contents.",
      inputSchema: {
        tool_id: z.string().describe("Tool folder under agents/"),
        version: z.string().optional().default("latest"),
        distribution: z.string().optional().default("claude")
      }
    },
    async ({ tool_id, version = "latest", distribution = "claude" }) => {
      const selectedVersion = await resolveVersion({ fs, path, AGENTS_DIR, tool_id, version });
      const bundle = await readDistributionBundle({
        fs,
        path,
        DISTRIBUTIONS_DIR,
        tool_id,
        version: selectedVersion,
        distribution,
        distributionLabels: DISTRIBUTION_LABELS
      });

      return { content: [{ type: "text", text: JSON.stringify(bundle, null, 2) }] };
    }
  );

  server.registerTool(
    "agenthub_fetch_distribution_file",
    {
      title: "AgentHub: Fetch Distribution File",
      description:
        "Fetch a specific file from a generated distribution bundle.\n" +
        "- version: string or 'latest' (default 'latest').\n" +
        "- distribution: distribution slug (default 'claude').\n" +
        "- file_path: relative path inside the distribution bundle, e.g. 'SKILL.md'.\n" +
        "Returns raw file text.",
      inputSchema: {
        tool_id: z.string().describe("Tool folder under agents/"),
        version: z.string().optional().default("latest"),
        distribution: z.string().optional().default("claude"),
        file_path: z.string().describe("Relative file path inside the distribution bundle")
      }
    },
    async ({ tool_id, version = "latest", distribution = "claude", file_path }) => {
      const selectedVersion = await resolveVersion({ fs, path, AGENTS_DIR, tool_id, version });
      const fileText = await readDistributionFile({
        fs,
        path,
        DISTRIBUTIONS_DIR,
        tool_id,
        version: selectedVersion,
        distribution,
        filePath: file_path
      });

      return { content: [{ type: "text", text: fileText }] };
    }
  );

  // Optional helper: return same docs available via GET /mcp as an MCP tool
  server.registerTool(
    "agenthub_docs",
    {
      title: "AgentHub: Docs",
      description: "Return server/tool usage docs as JSON text (same as GET /mcp?format=json).",
      inputSchema: {}
    },
    async () => {
      const baseUrl = process.env.MCP_BASE_URL || "";
      const json = buildDocsJSON({ baseUrl });
      return { content: [{ type: "text", text: JSON.stringify(json, null, 2) }] };
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
  return [...new Set(files
    .filter((file) => /^\d+\.\d+\.\d+\.md$/i.test(file))
    .map((file) => file.replace(/\.md$/i, "")))];
}

async function resolveVersion({ fs, path, AGENTS_DIR, tool_id, version = "latest" }) {
  const versions = await listVersions({ fs, path, AGENTS_DIR, tool_id }).catch(() => []);
  if (!versions.length) {
    throw new Error(`Unknown tool_id '${tool_id}'. No versions found under agents/${tool_id}.`);
  }

  let selected = version;
  if (version === "latest") {
    selected = [...versions].sort().reverse()[0];
  }

  if (!versions.includes(selected)) {
    throw new Error(`Unknown version '${version}' for tool '${tool_id}'. Available: [${versions.join(", ")}]`);
  }

  return selected;
}

async function readAgentByName({ fs, path, AGENTS_DIR, name, version }) {
  let v = version;
  if (v === "latest") {
    const all = await listVersions({ fs, path, AGENTS_DIR, tool_id: name });
    if (!all.length) throw new Error(`No versions found for tool: ${name}`);
    v = all.sort().reverse()[0];
  }
  const filePath = path.join(AGENTS_DIR, name, `${v}.md`);
  return await fs.readFile(filePath, "utf-8");
}

async function listDistributions({ fs, path, DISTRIBUTIONS_DIR, tool_id, version, distributionLabels }) {
  const distributions = [];
  const manifestPath = path.join(DISTRIBUTIONS_DIR, tool_id, version, "manifest.json");
  try {
    const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    distributions.push({
      distribution: manifest.distribution || "claude",
      label: distributionLabels[manifest.distribution || "claude"] || manifest.distribution || "claude",
      entrypoint: manifest.entrypoint,
      files: manifest.files,
      description: manifest.description
    });
  } catch (error) {
    if (error && error.code !== "ENOENT") {
      throw error;
    }
  }

  return distributions;
}

function normalizeDistributionFilePath(filePath = "") {
  const normalized = String(filePath || "").replace(/^\/+/, "");
  if (!normalized || normalized.includes("..") || pathIsAbsolute(normalized)) {
    throw new Error(`Invalid distribution file path '${filePath}'. Expected a relative file path inside the bundle.`);
  }
  return normalized;
}

function pathIsAbsolute(candidate) {
  return candidate.startsWith("/") || /^[A-Za-z]:[\\/]/.test(candidate);
}

async function readDistributionManifest({ fs, path, DISTRIBUTIONS_DIR, tool_id, version, distribution }) {
  if (distribution !== "claude") {
    throw new Error(`Unknown distribution '${distribution}' for tool '${tool_id}'. Available: [claude]`);
  }

  const manifestPath = path.join(DISTRIBUTIONS_DIR, tool_id, version, "manifest.json");
  let manifest;
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      throw new Error(
        `No '${distribution}' distribution found for tool '${tool_id}' at version '${version}'.`
      );
    }
    throw error;
  }

  return {
    manifest,
    bundleDir: path.join(DISTRIBUTIONS_DIR, tool_id, version)
  };
}

async function readDistributionFile({ fs, path, DISTRIBUTIONS_DIR, tool_id, version, distribution, filePath }) {
  const { manifest, bundleDir } = await readDistributionManifest({
    fs,
    path,
    DISTRIBUTIONS_DIR,
    tool_id,
    version,
    distribution
  });
  const normalized = normalizeDistributionFilePath(filePath);
  if (!manifest.files.includes(normalized)) {
    throw new Error(
      `Unknown file '${filePath}' for distribution '${distribution}' on tool '${tool_id}' version '${version}'. ` +
      `Available: [${manifest.files.join(", ")}]`
    );
  }
  return await fs.readFile(path.join(bundleDir, normalized), "utf8");
}

async function readDistributionBundle({
  fs,
  path,
  DISTRIBUTIONS_DIR,
  tool_id,
  version,
  distribution,
  distributionLabels
}) {
  const { manifest, bundleDir } = await readDistributionManifest({
    fs,
    path,
    DISTRIBUTIONS_DIR,
    tool_id,
    version,
    distribution
  });

  const files = [];
  for (const file of manifest.files) {
    files.push({
      path: file,
      content: await fs.readFile(path.join(bundleDir, file), "utf8")
    });
  }

  return {
    tool_id,
    version,
    distribution,
    label: distributionLabels[distribution] || distribution,
    entrypoint: manifest.entrypoint,
    description: manifest.description,
    files
  };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, HEAD",
    "Access-Control-Allow-Headers": "Content-Type, Mcp-Session-Id, Authorization"
  };
}

function buildDocsJSON({ baseUrl }) {
  const rpc = `${baseUrl}/mcp`;
  return {
    name: "AgentHub MCP Server",
    transport: "http",
    endpoint: rpc,
    usage: {
      post: "POST JSON-RPC 2.0 to /mcp",
      get: "GET /mcp?format=json|text to read these docs"
    },
    tools: [
      {
        name: "agenthub_list",
        description:
          "List available AgentHub tools (paged) with a simple case-insensitive substring filter on tool_id.",
        params: {
          q: "optional string; filters by tool_id substring (case-insensitive)",
          limit: "integer 1..100 (default 20)",
          offset: "integer >= 0 (default 0)"
        },
        response: "JSON text: { total, limit, offset, nextOffset, q, items: [{ tool_id, versions }] }",
        examples: {
          rpc: {
            jsonrpc: "2.0",
            id: "1",
            method: "callTool",
            params: { name: "agenthub_list", arguments: { q: "sdk", limit: 10 } }
          }
        }
      },
      {
        name: "agenthub_versions",
        description: "List available versions for a given tool_id (folder name under agents/)",
        params: { tool_id: "string" },
        response: "JSON text: { tool_id, versions }",
        examples: {
          rpc: {
            jsonrpc: "2.0",
            id: "2",
            method: "callTool",
            params: { name: "agenthub_versions", arguments: { tool_id: "openserv-labs-sdk" } }
          }
        }
      },
      {
        name: "agenthub_fetch",
        description:
          "Fetch the Markdown spec for a tool_id at a version. If version is 'latest', the lexicographically highest version is used.",
        params: { tool_id: "string", version: "optional string|'latest' (default 'latest')" },
        response: "Raw spec text",
        examples: {
          rpc: {
            jsonrpc: "2.0",
            id: "3",
            method: "callTool",
            params: { name: "agenthub_fetch", arguments: { tool_id: "openserv-labs-sdk", version: "0.3.0" } }
          }
        }
      },
      {
        name: "agenthub_distributions",
        description:
          "List generated distributions for a tool_id and version, including Claude-compatible skill bundles when available.",
        params: { tool_id: "string", version: "optional string|'latest' (default 'latest')" },
        response: "JSON text: { tool_id, version, distributions: [{ distribution, label, entrypoint, files, description }] }",
        examples: {
          rpc: {
            jsonrpc: "2.0",
            id: "4",
            method: "callTool",
            params: { name: "agenthub_distributions", arguments: { tool_id: "react", version: "latest" } }
          }
        }
      },
      {
        name: "agenthub_fetch_distribution",
        description:
          "Fetch a full generated distribution bundle for a tool_id and version. Today this is primarily used for Claude-compatible skill bundles.",
        params: {
          tool_id: "string",
          version: "optional string|'latest' (default 'latest')",
          distribution: "optional string (default 'claude')"
        },
        response: "JSON text with entrypoint and file contents",
        examples: {
          rpc: {
            jsonrpc: "2.0",
            id: "5",
            method: "callTool",
            params: {
              name: "agenthub_fetch_distribution",
              arguments: { tool_id: "react", version: "latest", distribution: "claude" }
            }
          }
        }
      },
      {
        name: "agenthub_fetch_distribution_file",
        description:
          "Fetch a single file from a generated distribution bundle, for example 'SKILL.md' or a references file.",
        params: {
          tool_id: "string",
          version: "optional string|'latest' (default 'latest')",
          distribution: "optional string (default 'claude')",
          file_path: "relative file path inside the distribution bundle"
        },
        response: "Raw file text",
        examples: {
          rpc: {
            jsonrpc: "2.0",
            id: "6",
            method: "callTool",
            params: {
              name: "agenthub_fetch_distribution_file",
              arguments: {
                tool_id: "react",
                version: "latest",
                distribution: "claude",
                file_path: "SKILL.md"
              }
            }
          }
        }
      },
      {
        name: "agenthub_docs",
        description: "Return these docs as JSON text",
        params: {},
        response: "JSON text"
      }
    ],
    notes: [
      "Agents directory layout: agents/<tool_id>/<version>.md",
      "Claude-compatible distributions live under distributions/claude/<tool_id>/<version>/",
      "Filtering is only on tool_id; descriptions/tags are not indexed",
      "Versions are compared lexicographically (not semver-aware)",
      "No authentication; consider adding in production",
      "Some clients sanitize tool names for display (e.g., '.' becomes '_'). Prefer underscores in new tool IDs to avoid UI mismatch."
    ],
    health: {
      rpc,
      docs: `${rpc}?format=json`
    }
  };
}

function buildDocsText(json) {
  const lines = [];
  lines.push(`# ${json.name}`);
  lines.push("");
  lines.push(`Transport: ${json.transport}`);
  lines.push(`Endpoint: ${json.endpoint}`);
  lines.push("");
  lines.push("Usage:");
  lines.push(`- POST: ${json.usage.post}`);
  lines.push(`- GET:  ${json.usage.get}`);
  lines.push("");
  lines.push("Tools:");
  for (const t of json.tools) {
    lines.push(`- ${t.name} — ${t.description}`);
    const p = t.params || {};
    const keys = Object.keys(p);
    if (keys.length) {
      lines.push(`  params: ${keys.map(k => `${k}=${p[k]}`).join(", ")}`);
    }
  }
  lines.push("");
  lines.push("Notes:");
  for (const n of json.notes) lines.push(`- ${n}`);
  lines.push("");
  lines.push("Examples (JSON-RPC snippets):");
  for (const t of json.tools) {
    if (t.examples && t.examples.rpc) {
      lines.push(`- ${t.name}:`);
      lines.push(`  ${JSON.stringify(t.examples.rpc)}`);
    }
  }
  lines.push("");
  lines.push(`Docs JSON: ${json.health.docs}`);
  return lines.join("\n");
}
