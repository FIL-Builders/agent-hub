# NEAR AI Environment Documentation Pack

## Target
- Pack: `agents/near-ai-environment/0.4.0.md`
- Target date: 2026-03-13

## Source Inventory
- `agents/near-ai-environment/0.3.0.md` for contract extraction and coverage audit

## Decision Rules
- Prefer `Environment.completions` when metadata or streaming control matters.
- Pass tool definitions, not raw callables, to tool-running helpers.
- Keep thread state in messages and files managed through the environment.
- Use `set_near` to create an async NEAR client for onchain reads and writes.

## Common Confusions
- `completion` is a convenience wrapper over `completions`.
- Tool-running helpers expect registry definitions, not arbitrary functions.
- `NearClient.view` and `NearClient.call` serve different trust and cost models.

## Failure Modes
- Tool execution fails because raw callables were passed instead of tool definitions.
- Context is lost because thread messages were not persisted through environment helpers.
- NEAR credentials are embedded in code instead of configured through `set_near`.

## Coverage Map

### Inference
- `Environment.completions`
- `Environment.completion`
- `Environment.completion_and_run_tools`

### Messages And Tools
- `Environment.list_messages`
- `Environment.add_reply`
- `Environment.get_tool_registry`
- `ToolRegistry.register_tool`

### NEAR
- `Environment.set_near`
- `NearClient.view`
- `NearClient.call`

## Must-Not-Regress Insights
- Preserve completions-vs-completion guidance.
- Preserve tool-definition guidance.
- Preserve explicit NEAR client setup and async usage.
