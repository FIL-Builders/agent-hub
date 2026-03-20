# Agent Hub Troubleshooting

### The client can connect but no tools appear
**Cause**
- The client config was edited in the wrong location, the client does not support the chosen transport, or the client needs a proxy-style MCP setup instead of direct HTTP.

**Fix**
- Confirm the actual config path for the current client.
- Check whether the client needs direct HTTP or an `mcp-remote` wrapper.
- Use the docs URL directly to confirm the deployed endpoint is alive even if the client integration is failing.

### `latest` fetched an unexpected version
**Cause**
- The server resolves `latest` with lexicographic sorting, so the result may differ from a semver-aware expectation.

**Fix**
- Call `agenthub_versions` first, inspect the available versions, and pin the exact version you want.

### A fetch failed for a `tool_id`
**Cause**
- The requested `tool_id` or version does not match what exists under `agents/<tool_id>/<version>.md`, or the caller is using a display-sanitized name instead of the true registry ID.

**Fix**
- Use `agenthub_list` or `agenthub_versions` to confirm the exact `tool_id`.
- Fetch only versions that actually exist for that tool.
- Treat client-side tool-name sanitization as a UI concern only; the underlying `tool_id` still needs to match the server registry.

### The agent is fetching too much context
**Cause**
- The agent is treating Agent Hub like a blob store and preloading many packs before it knows which one the task actually needs.

**Fix**
- Fetch only the pack relevant to the active task, and only when needed.
- If reproducibility matters, inspect versions first and then fetch the single pinned pack you plan to use.

### A generated pack passes structure checks but still feels weak
**Cause**
- Structural validation only proves the pack matches the spec and validator; it does not prove the content is the strongest version of the pack.

**Fix**
- Run the candidate through the evaluation guide and compare it against the prior pack on realistic tasks.
- Tighten the source set, workflows, troubleshooting, and guidance before treating the new pack as canonical.

### The generator is unsure which local document should win
**Cause**
- The repo contains normative documents, prompts, validators, tutorials, and generated artifacts with different authority levels.

**Fix**
- Use `tutorials/authoritative-documents-for-v0.4-pack-generation.md` to resolve the conflict.
- In general, prefer the spec for structure, the validator for automated enforcement, the runbook/prompts for workflow, and generated artifacts only as run-specific outputs or examples.
