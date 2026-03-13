# OpenServ Labs SDK Documentation Pack

## Target
- Pack: `agents/openserv-labs-sdk/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current OpenServ site at `https://www.openserv.ai/`

## Source Inventory
- Current OpenServ site and SDK-facing docs
- `agents/openserv-labs-sdk/0.3.0.md` for coverage audit only

## Decision Rules
- Register capabilities before starting the agent.
- Use `addCapabilities` for boot-time bulk registration.
- Use task-status and task-log methods together.
- Use `callIntegration` instead of ad hoc API calls when platform integrations exist.

## Common Confusions
- `addCapability` and `addCapabilities` serve different ergonomics but the same registration stage.
- `process()` requires the model-side environment to be configured.
- `requestHumanAssistance` is part of task orchestration, not a generic logging helper.

## Failure Modes
- Agents start before capability registration is complete.
- Operators omit `updateTaskStatus` and lose task-state visibility.
- Integrations are called ad hoc instead of through the platform integration surface.

## Coverage Map

### Agent Setup
- `Agent`
- `Agent.addCapabilities`
- `Agent.start`
- `Agent.process`

### Task Coordination
- `Agent.updateTaskStatus`
- `Agent.addLogToTask`
- `Agent.requestHumanAssistance`

### Integrations
- `Agent.callIntegration`

## Must-Not-Regress Insights
- Preserve boot-time capability registration guidance.
- Preserve status-plus-log coordination guidance.
- Preserve `callIntegration` preference over ad hoc HTTP for platform-managed integrations.
