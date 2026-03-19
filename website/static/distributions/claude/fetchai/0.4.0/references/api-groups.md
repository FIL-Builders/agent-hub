# FetchAI Agentverse Hosting API API Groups

### Agents
**Exports**
- agents.list
- agents.create
- agents.get
- agents.delete

Hosted-agent lifecycle and identity endpoints.

#### agents.list
**Kind**
endpoint

**Summary**
List hosted agents for the current account or workspace.

**Definition**
Language: http
Source: agents/fetchai/0.3.0.md coverage audit

```http
GET /v1/hosting/agents
```

**Guidance**
- Use this to discover agent addresses and current runtime state.
- Treat the returned address as the stable key for later reads and usage lookups.
- Cache carefully and invalidate after create, update, start, or stop flows.

**Example**
Language: bash
Description: List hosted agents.

```bash
curl -sS https://agentverse.ai/v1/hosting/agents
```

#### agents.create
**Kind**
endpoint

**Summary**
Create a new hosted agent record and deployment target.

**Definition**
Language: http
Source: agents/fetchai/0.3.0.md coverage audit

```http
POST /v1/hosting/agents
Content-Type: application/json

{
  "name": "my-agent",
  "description": "optional"
}
```

**Guidance**
- Keep creation idempotent in your client logic so retries do not create confusing duplicates.
- Persist the returned address immediately; later APIs use it as the durable handle.
- Follow up with a fresh read if later configuration depends on the created runtime state.

**Example**
Language: bash
Description: Create a hosted agent.

```bash
curl -sS https://agentverse.ai/v1/hosting/agents \
  -H "Content-Type: application/json" \
  -d '{"name":"my-agent"}'
```

#### agents.get
**Kind**
endpoint

**Summary**
Fetch one hosted agent by address.

**Definition**
Language: http
Source: agents/fetchai/0.3.0.md coverage audit

```http
GET /v1/hosting/agents/{address}
```

**Guidance**
- Use this after lifecycle actions to confirm runtime state and revision.
- Treat the response as the authoritative post-action status check.
- Keep address handling exact and encoded properly.

**Example**
Language: bash
Description: Get one hosted agent by address.

```bash
curl -sS "https://agentverse.ai/v1/hosting/agents/$ADDRESS"
```

#### agents.delete
**Kind**
endpoint

**Summary**
Delete a hosted agent by address.

**Definition**
Language: http
Source: agents/fetchai/0.3.0.md coverage audit

```http
DELETE /v1/hosting/agents/{address}
```

**Guidance**
- Use the stable agent address as the delete handle.
- Treat deletion as destructive and avoid blind retry loops without confirming state.
- Re-read list or get endpoints after deletion if the workflow depends on confirmation.

**Example**
Language: bash
Description: Delete a hosted agent.

```bash
curl -sS -X DELETE "https://agentverse.ai/v1/hosting/agents/$ADDRESS"
```

### Usage
**Exports**
- usage.getCurrent
- usage.getCurrentForAgent

Analytics and current-period usage summaries.

#### usage.getCurrent
**Kind**
endpoint

**Summary**
Fetch current-period usage for the current account or workspace.

**Definition**
Language: http
Source: agents/fetchai/0.3.0.md coverage audit

```http
GET /v1/hosting/usage/current
```

**Guidance**
- Use this for analytics and operator dashboards, not deployment control.
- Treat the response as a current-period summary rather than an event log.
- Keep this path out of the critical deployment workflow unless budgeting requires it.

**Example**
Language: bash
Description: Fetch current account usage.

```bash
curl -sS https://agentverse.ai/v1/hosting/usage/current
```

#### usage.getCurrentForAgent
**Kind**
endpoint

**Summary**
Fetch current-period usage for one hosted agent by address.

**Definition**
Language: http
Source: agents/fetchai/0.3.0.md coverage audit

```http
GET /v1/hosting/usage/agents/{address}/current
```

**Guidance**
- Use the agent address as the stable usage key.
- Keep this separate from runtime state checks; usage and liveness are not the same thing.
- Use it for attribution and reporting after the agent is already identified.

**Example**
Language: bash
Description: Fetch current usage for one agent.

```bash
curl -sS "https://agentverse.ai/v1/hosting/usage/agents/$ADDRESS/current"
```
