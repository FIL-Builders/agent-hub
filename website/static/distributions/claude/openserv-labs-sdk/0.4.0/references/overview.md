# OpenServ Labs SDK Overview

## Snapshot

- Spec name: openserv-labs/sdk
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs
- Primary language: typescript
- Homepage: https://www.openserv.ai/
- Source set: current OpenServ site at `https://www.openserv.ai/`; `parse/openserv-labs-sdk-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/openserv-labs-sdk/0.3.0.md` for coverage audit only

**Tags**
- ai-agents
- openserv
- task-management
- integrations
- mcp
- typescript

## Purpose

This pack teaches an agent to use the OpenServ Labs SDK at a senior-developer level: instantiate an agent, register typed capabilities before start, process tasks with explicit status and logs, escalate to humans when blocked, and route platform-governed external calls through integrations instead of ad hoc HTTP.

## Guiding Principles

- Register capabilities before calling `start()` so the runtime begins in a coherent state.
- Prefer `addCapabilities` for boot-time bulk registration.
- Pair `updateTaskStatus` with `addLogToTask` so task progress is visible to operators.
- Use `requestHumanAssistance` when ambiguity or blockers require intervention.
- Prefer `callIntegration` over hand-rolled HTTP when the platform already manages the external system.

## Boundary Notes

- The old `0.3.0` pack already emphasized the right orchestration model. This `0.4.0` port keeps that model and makes the setup, task, and integration boundaries easier to retrieve from.
- This is an agent-runtime SDK pack, not just an HTTP-client pack: setup, lifecycle, and orchestration methods matter as much as raw API invocation.
- Current site content is used as the framing anchor; the old pack remains a coverage audit reference only.

## FAQ

### Should I use addCapability or addCapabilities at boot?
Use `addCapabilities` when you already know the startup capability set. It keeps registration declarative and minimizes startup drift.

### When should I use callIntegration instead of fetch?
Use `callIntegration` whenever the platform already manages the external system. It keeps auth, routing, and auditability under platform control.

## External Resources

- OpenServ: https://www.openserv.ai/
