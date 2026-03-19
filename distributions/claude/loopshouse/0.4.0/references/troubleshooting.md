# Loopshouse CLI Troubleshooting

### Commands Fail Even Though The CLI Is Installed
**Cause**
The local session is not authenticated or stored credentials are stale.

**Fix**
Run `loops auth status`, then `loops auth login` or `loops auth logout` followed by a fresh login if needed.

### MCP Integration Is Configured But The Agent Cannot Use Loops Tools
**Cause**
The config step and the server-runtime step were confused, or the MCP client is not launching `loops --mcp`.

**Fix**
Confirm the MCP client config points to `npx loopshouse --mcp` or an equivalent installed binary, and distinguish that runtime from `loops mcp add`.
