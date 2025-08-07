// scripts/gen-mcp-manifest.js
const fs = require("fs");
const path = require("path");

const AGENTS_DIR = path.join(__dirname, "../agents");
const OUTPUT_FILE = path.join(__dirname, "../website/.well-known/mcp/ai-plugin.json");

(async () => {
  const tools = [];

  const toolDirs = fs.readdirSync(AGENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const tool_id of toolDirs) {
    tools.push({ tool_id });
  }

  const manifest = {
    schema_version: "v1",
    name: "Framework Agent Server",
    description: "MCP server providing versioned agent files for common dev frameworks.",
    tools
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
  console.log(`✅ MCP manifest written to ${OUTPUT_FILE}`);
})();

