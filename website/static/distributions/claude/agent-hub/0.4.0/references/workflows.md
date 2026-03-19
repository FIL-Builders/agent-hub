# Agent Hub Workflows

### AI Agent Onboarding
1. Detect whether the current AI client supports MCP configuration and identify the correct config path or settings location.
2. Add an `agent-hub` server using direct HTTP when supported, or an `mcp-remote` pattern when required.
3. Preserve existing MCP servers and make the smallest safe change.
4. Verify the connection by listing tools and fetching a known pack. Prefer the `agent-hub` pack itself for a product-level verification step.
5. Summarize what changed, what worked, and any manual follow-up still required.

### Just-In-Time Retrieval
1. Identify the library or tool relevant to the task.
2. If reproducibility matters, call `agenthub_versions` before fetching.
3. Fetch only the one pack that the current task actually needs.
4. Use the fetched Markdown as runtime context, not as a permanent blob pasted into every prompt.
5. Report the fetched `tool_id` and version in the final answer when the workflow needs auditability.

### Manual Verification
1. Confirm the endpoint or docs URL is reachable.
2. Verify the client can see the `agenthub_list`, `agenthub_versions`, `agenthub_fetch`, and `agenthub_docs` tools.
3. Fetch a known pack, such as `agent-hub` or another task-relevant example.
4. If manual JSON-RPC is needed, send `Content-Type: application/json` and `Accept: application/json, text/event-stream`.

### Generate or Revise a Pack Locally
1. Start with `spec/open-agent-spec-v0.4.0.md` to understand the pack contract.
2. Read `tutorials/authoritative-documents-for-v0.4-pack-generation.md` to know which repo documents are authoritative for the task.
3. Use the checked-in `v0.4` prompts and runbook to generate a draft pack locally with your AI coding agent.
4. Run `node scripts/validate-agent-pack-v0.4.0.js <path-to-pack>` and fix all structural failures.
5. Compare the candidate output using `tutorials/evaluating-agenthub-pack-outputs.md` before treating it as an improvement over the prior pack.
6. Open a GitHub PR so the pack, prompts, and validation story remain reviewable in one place.

### Choose the Right Tutorial
1. Use `tutorials/use-agent-hub-through-mcp.md` when the task is connecting Agent Hub MCP and retrieving packs at runtime.
2. Use `tutorials/authoritative-documents-for-v0.4-pack-generation.md` when the task is creating or revising a pack.
3. Use `tutorials/evaluating-agenthub-pack-outputs.md` when the task is comparing candidate pack outputs.
4. Do not substitute the MCP tutorial for the pack-generation authority chain; they solve different problems.
