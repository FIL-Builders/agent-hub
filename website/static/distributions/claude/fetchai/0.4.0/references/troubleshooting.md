# FetchAI Agentverse Hosting API Troubleshooting

### Agent State Looks Stale After A Lifecycle Action
**Cause**
The workflow assumed the action succeeded without re-reading the agent record.

**Fix**
Call `agents.get` with the agent address after the action and use that record as the source of truth.

### Usage Data Is Being Used To Infer Runtime Health
**Cause**
The integration blurred analytics endpoints with lifecycle endpoints.

**Fix**
Use `agents.get` for runtime state and use `usage.getCurrent` or `usage.getCurrentForAgent` only for usage reporting.
