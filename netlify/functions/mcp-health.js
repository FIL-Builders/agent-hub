// /netlify/functions/mcp-health.js
exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders(), body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: corsHeaders(), body: "Method Not Allowed" };
  }

  const origin = getOrigin(event.headers);
  const now = new Date().toISOString();

  const body = {
    status: "ok",
    time: now,
    mcp: { transport: "sse" },
    sse: `${origin}/mcp/sse`,
    rpc: `${origin}/mcp`,
    manifest: `${origin}/.well-known/ai-plugin.json`
  };

  return {
    statusCode: 200,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };
}

function getOrigin(headers = {}) {
  const h = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  const proto = h["x-forwarded-proto"] || h["x-forwarded-protocol"] || h["x-scheme"] || "https";
  const host = h["x-forwarded-host"] || h["host"] || "localhost:8888";
  return `${proto}://${host}`;
}

