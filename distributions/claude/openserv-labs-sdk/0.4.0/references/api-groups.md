# OpenServ Labs SDK API Groups

### Agent Setup
**Exports**
- Agent
- Agent.addCapabilities
- Agent.start
- Agent.process

Boot-time setup and task processing lifecycle.

#### Agent
**Kind**
class

**Summary**
Main SDK entrypoint for constructing and running an OpenServ agent.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
class Agent {
  addCapabilities(capabilities: Capability[]): void;
  start(): Promise<void>;
  process(input: unknown): Promise<unknown>;
}
```

**Guidance**
- Treat this as the owner of capability registration, task orchestration, and integration access.
- Keep environment configuration minimal and explicit for the features you actually use.
- Start the agent only after setup is complete.

**Example**
Language: typescript
Description: Construct and start an agent after registering capabilities.

```ts
const agent = new Agent({ apiKey: process.env.OPENSERV_API_KEY! });
agent.addCapabilities([capabilityA, capabilityB]);
await agent.start();
```

#### Agent.addCapabilities
**Kind**
function

**Summary**
Register multiple capabilities in one boot-time call.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
agent.addCapabilities(capabilities: Capability[]): void;
```

**Guidance**
- Prefer this at startup to avoid fragmented capability registration.
- Keep schemas and descriptions explicit so the agent planner can reason about them.
- Call it before `start()` to avoid race conditions.

**Example**
Language: typescript
Description: Register capabilities in a single call.

```ts
agent.addCapabilities([searchCapability, summarizeCapability]);
```

#### Agent.start
**Kind**
function

**Summary**
Start the agent runtime after capabilities and configuration are ready.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
await agent.start();
```

**Guidance**
- Start only once the registration phase is complete.
- Keep start-up deterministic by avoiding dynamic last-moment capability mutation.
- Treat this as the transition from configuration to live runtime.

**Example**
Language: typescript
Description: Start the agent runtime.

```ts
await agent.start();
```

#### Agent.process
**Kind**
function

**Summary**
Run a model-driven processing step through the agent runtime.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
const result = await agent.process(input);
```

**Guidance**
- Use this only when the runtime actually needs model-backed processing and the required environment is configured.
- Keep deterministic side effects outside of `process()` when possible.
- Record task status and logs around process-heavy flows so operators can see progress.

**Example**
Language: typescript
Description: Process a task input.

```ts
const result = await agent.process({ prompt: "Summarize this task" });
```

### Task Coordination
**Exports**
- Agent.updateTaskStatus
- Agent.addLogToTask
- Agent.requestHumanAssistance

Methods for keeping operators and automated workflows aligned on task progress.

#### Agent.updateTaskStatus
**Kind**
function

**Summary**
Update the state of a task in the platform.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
await agent.updateTaskStatus({ taskId, status });
```

**Guidance**
- Use this early and often in long-running tasks.
- Keep statuses meaningful and paired with log entries for context.
- Use explicit blocked or human-assistance statuses instead of silent stalls.

**Example**
Language: typescript
Description: Mark a task as done.

```ts
await agent.updateTaskStatus({ taskId, status: "done" });
```

#### Agent.addLogToTask
**Kind**
function

**Summary**
Append a log entry to a task for operator visibility.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
await agent.addLogToTask({ taskId, message });
```

**Guidance**
- Use logs to mark milestones, external-call boundaries, and failure points.
- Keep secrets and excessive raw dumps out of task logs.
- Pair logs with status changes rather than relying on either in isolation.

**Example**
Language: typescript
Description: Log a task milestone.

```ts
await agent.addLogToTask({ taskId, message: "Fetched upstream data" });
```

#### Agent.requestHumanAssistance
**Kind**
function

**Summary**
Escalate a task to a human when the agent is blocked or needs clarification.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
await agent.requestHumanAssistance({ taskId, question, agentDump });
```

**Guidance**
- Use this when ambiguity or missing external information prevents safe progress.
- Keep the question concise and include only the minimal context required.
- Pair the escalation with a status update such as `human-assistance-required`.

**Example**
Language: typescript
Description: Ask for a missing approval.

```ts
await agent.requestHumanAssistance({
  taskId,
  question: "Which workspace should receive this integration output?"
});
```

### Integrations
**Exports**
- Agent.callIntegration

Platform-governed access to third-party systems.

#### Agent.callIntegration
**Kind**
function

**Summary**
Invoke an OpenServ-managed integration using the workspace’s configured credentials and routing.

**Definition**
Language: typescript
Source: agents/openserv-labs-sdk/0.3.0.md coverage audit

```ts
const response = await agent.callIntegration({ integrationId, details });
```

**Guidance**
- Prefer this over ad hoc HTTP calls when the external system is already configured as a platform integration.
- Keep integration IDs and payload details explicit in logs so operations remain auditable.
- Use platform integrations to centralize auth and policy enforcement.

**Example**
Language: typescript
Description: Invoke a workspace integration.

```ts
const response = await agent.callIntegration({
  integrationId: "exa-search",
  details: { query: "OpenServ SDK" }
});
```
