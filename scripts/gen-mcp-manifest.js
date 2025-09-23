// scripts/gen-mcp-manifest.js
const fs = require("fs");
const path = require("path");

const AGENTS_DIR = path.join(__dirname, "../agents");
// Publish under Docusaurus static assets so it ends up at
//   /.well-known/mcp/ai-plugin.json
// and also duplicate at
//   /.well-known/ai-plugin.json
const OUTPUT_DIR = path.join(__dirname, "../website/static/.well-known");
const OUTPUT_FILE_MCP = path.join(OUTPUT_DIR, "mcp/ai-plugin.json");
const OUTPUT_FILE_ROOT = path.join(OUTPUT_DIR, "ai-plugin.json");

(async () => {
  const tools = [];

  const toolDirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const tool_id of toolDirs) {
    tools.push({ tool_id });
  }

  const baseUrl = (process.env.MCP_BASE_URL || process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL || process.env.URL || "http://localhost:8888").replace(/\/$/, "");
  const manifest = {
    schema_version: "v1",
    name: "AgentHub MCP Server",
    description: "MCP over SSE + JSON-RPC; serves versioned AgentHub YAML tools.",
    mcp: {
      transport: "sse",
      sse_url: `${baseUrl}/mcp/sse`,
      rpc_url: `${baseUrl}/mcp`
    },
    tools
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE_MCP), { recursive: true });
  fs.mkdirSync(path.dirname(OUTPUT_FILE_ROOT), { recursive: true });
  const payload = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(OUTPUT_FILE_MCP, payload);
  fs.writeFileSync(OUTPUT_FILE_ROOT, payload);
  console.log(`✅ MCP manifests written to ${OUTPUT_FILE_MCP} and ${OUTPUT_FILE_ROOT}`);
})();
