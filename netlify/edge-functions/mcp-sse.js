// /netlify/edge-functions/mcp-sse.js

export default async (request, context) => {
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Optional: read a client token ?client=warp to correlate with your POST inbox
  const { searchParams } = new URL(request.url);
  const client = searchParams.get("client") || "warp";

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (obj) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };
      const ping = () => controller.enqueue(encoder.encode(`:ping\n\n`)); // comment frames are OK

      // 1) initial hello / capabilities (MCP-flavored)
      // keep it minimal; clients mainly need to see the stream alive
      send({
        jsonrpc: "2.0",
        method: "server/ready",
        params: {
          serverName: "AgentHub on Netlify",
          transport: "sse",
          client,
          // advertise the basic things your POST handler already supports
          capabilities: {
            tools: true,
            resources: false,
            prompts: false
          }
        }
      });

      // 2) optional: tell client where to POST JSON-RPC requests
      // so you can do full round-trip (client -> POST /mcp, server -> SSE back)
      send({
        jsonrpc: "2.0",
        method: "server/config",
        params: {
          rpcInbox: "https://agent-hub-1.netlify.app/mcp" // your existing POST endpoint
        }
      });

      // 3) heartbeats (keep connection from idling out)
      const heartbeat = setInterval(ping, 15000);

      // 4) example: push a periodic status (you can remove this)
      const ticker = setInterval(() => {
        send({
          jsonrpc: "2.0",
          method: "notifications/heartbeat",
          params: { t: Date.now() }
        });
      }, 30000);

      // Clean up when the client disconnects
      const close = () => {
        clearInterval(heartbeat);
        clearInterval(ticker);
        try { controller.close(); } catch {}
      };
      // Edge runtime provides an abort signal
      const signal = context?.signal || request.signal;
      if (signal) signal.addEventListener("abort", close);
    },
    cancel() {
      // Client closed; nothing else to do
    }
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      // CORS so Warp can reach it if needed
      "Access-Control-Allow-Origin": "*",
      // recommend disabling Netlify’s CDN buffering on this path
      "X-Accel-Buffering": "no"
    }
  });
};

