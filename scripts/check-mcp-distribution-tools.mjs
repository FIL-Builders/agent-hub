import handler from "../netlify/functions/mcp.js";

async function callTool(name, args = {}) {
  const request = new Request("http://localhost/mcp", {
    method: "POST",
    headers: {
      "Accept": "application/json, text/event-stream",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: `${name}-1`,
      method: "tools/call",
      params: {
        name,
        arguments: args
      }
    })
  });

  const response = await handler(request);
  const raw = await response.text();
  const payload = parseMcpResponse(raw, response.headers.get("content-type") || "");
  if (!response.ok || payload.error) {
    throw new Error(`${name} failed: ${JSON.stringify(payload, null, 2)}`);
  }

  return payload.result?.content?.[0]?.text || "";
}

function parseMcpResponse(raw, contentType) {
  if (/application\/json/i.test(contentType)) {
    return JSON.parse(raw);
  }

  const dataLine = raw
    .split("\n")
    .find((line) => line.startsWith("data: "));
  if (!dataLine) {
    throw new Error(`Expected MCP stream response with a data line, got: ${raw}`);
  }
  return JSON.parse(dataLine.slice(6));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const distributionsText = await callTool("agenthub_distributions", {
  tool_id: "react",
  version: "latest"
});
const distributions = JSON.parse(distributionsText);
assert(Array.isArray(distributions.distributions), "agenthub_distributions should return a distributions array");
assert(
  distributions.distributions.some((entry) => entry.distribution === "claude"),
  "agenthub_distributions should report the claude distribution for react"
);

const bundleText = await callTool("agenthub_fetch_distribution", {
  tool_id: "react",
  version: "latest",
  distribution: "claude"
});
const bundle = JSON.parse(bundleText);
assert(bundle.distribution === "claude", "agenthub_fetch_distribution should return the claude distribution slug");
assert(bundle.entrypoint === "SKILL.md", "agenthub_fetch_distribution should return SKILL.md as the entrypoint");
assert(Array.isArray(bundle.files) && bundle.files.length > 0, "agenthub_fetch_distribution should include file contents");
assert(bundle.files.some((file) => file.path === "SKILL.md"), "bundle should include SKILL.md");

const skillText = await callTool("agenthub_fetch_distribution_file", {
  tool_id: "react",
  version: "latest",
  distribution: "claude",
  file_path: "SKILL.md"
});
assert(skillText.includes("# React"), "agenthub_fetch_distribution_file should return the requested file content");

const packText = await callTool("agenthub_fetch", {
  tool_id: "react",
  version: "latest"
});
assert(packText.includes("# React"), "agenthub_fetch should continue to return canonical Markdown packs");

const docsRequest = new Request("http://localhost/mcp?format=json", {
  method: "GET",
  headers: { "Accept": "application/json, text/event-stream" }
});
const docsResponse = await handler(docsRequest);
const docs = JSON.parse(await docsResponse.text());
assert(
  Array.isArray(docs.tools) && docs.tools.some((tool) => tool.name === "agenthub_fetch_distribution"),
  "GET /mcp?format=json should document the new distribution tools"
);

console.log("MCP distribution tool checks passed.");
