# FetchAI Agentverse Hosting API Documentation Pack

## Target
- Pack: `agents/fetchai/0.4.0.md`
- Target date: 2026-03-13

## Source Inventory
- `agents/fetchai/0.3.0.md` for contract extraction and coverage audit

## Decision Rules
- Treat agent addresses as stable identifiers.
- Poll the agent record after lifecycle changes.
- Keep usage endpoints separate from agent lifecycle endpoints.

## Common Confusions
- Start and stop toggle runtime state but do not replace agent metadata.
- Usage endpoints are analytics, not deployment control.
- Revision tracking matters for code-rollout reasoning.

## Failure Modes
- Clients ignore revision changes after updates.
- Runtime state is assumed instead of re-read after start or stop.
- Usage data is mixed into deployment logic.

## Coverage Map

### Agents
- `agents.list`
- `agents.create`
- `agents.get`
- `agents.delete`

### Usage
- `usage.getCurrent`
- `usage.getCurrentForAgent`

## Must-Not-Regress Insights
- Preserve agent-address-as-identifier guidance.
- Preserve post-action polling guidance.
- Preserve usage-vs-lifecycle boundary.
