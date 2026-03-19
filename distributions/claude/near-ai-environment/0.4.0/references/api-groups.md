# NEAR AI Environment API Groups

### Inference
**Exports**
- Environment.completions
- Environment.completion
- Environment.completion_and_run_tools

High-level text generation and tool-aware completion helpers.

#### Environment.completions
**Kind**
function

**Summary**
Return a model response or streaming wrapper for chat-style messages.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def completions(
    self,
    messages,
    model="",
    stream=False,
    thread_id=None,
    attachments=None,
    message_type=None,
    **kwargs
):
    ...
```

**Guidance**
- Use this when you need control over metadata, attachments, or streaming.
- Treat the return type as richer than plain text; unwrap it intentionally.
- Keep message ordering stable when later verifying or replaying model behavior.

**Example**
Language: python
Description: Non-streaming completions call.

```python
resp = env.completions([{"role": "user", "content": "Say hi."}], model="gpt-4o-mini")
env.add_reply(str(resp))
```

#### Environment.completion
**Kind**
function

**Summary**
Return the first text string from a completion as a convenience wrapper.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def completion(self, messages, model="", **kwargs) -> str:
    ...
```

**Guidance**
- Use this when plain text is enough and you do not need response metadata.
- Build message context from `env.list_messages()` when continuing a thread.
- Switch back to `completions` if you later need streaming or richer output.

**Example**
Language: python
Description: Produce a concise reply string.

```python
reply = env.completion(env.list_messages(), model="gpt-4o-mini")
env.add_reply(reply)
```

#### Environment.completion_and_run_tools
**Kind**
function

**Summary**
Run a completion and execute any tool calls declared through the environment tool model.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def completion_and_run_tools(self, messages, model="", tools=None, **kwargs):
    ...
```

**Guidance**
- Pass tool definitions from the registry, not raw callables.
- Use this when the model should both decide on tool use and execute it in one step.
- Keep tool schemas explicit so the planner receives a stable contract.

**Example**
Language: python
Description: Run a completion with registered tools.

```python
tools = env.get_tool_registry().tools
result = env.completion_and_run_tools(env.list_messages(), model="gpt-4o-mini", tools=tools)
```

### Messages And Tools
**Exports**
- Environment.list_messages
- Environment.add_reply
- Environment.get_tool_registry
- ToolRegistry.register_tool

Thread persistence and tool registration.

#### Environment.list_messages
**Kind**
function

**Summary**
Return the current thread’s message history.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def list_messages(self):
    ...
```

**Guidance**
- Use this to rebuild context deterministically instead of caching parallel copies elsewhere.
- Treat the returned order as meaningful for future completions and verification.
- Keep thread-local context in this system instead of custom global state.

**Example**
Language: python
Description: Read message history before responding.

```python
messages = env.list_messages()
```

#### Environment.add_reply
**Kind**
function

**Summary**
Append a reply to the current thread state.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def add_reply(self, text: str):
    ...
```

**Guidance**
- Use this to persist outputs that should become part of the thread history.
- Keep reply text concise and structured if later tool or model calls will consume it.
- Do not bypass it with ad hoc file writes for ordinary thread messaging.

**Example**
Language: python
Description: Append a reply to the thread.

```python
env.add_reply("done")
```

#### Environment.get_tool_registry
**Kind**
function

**Summary**
Return the environment’s tool registry for built-ins and custom tool definitions.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def get_tool_registry(self, new=False):
    ...
```

**Guidance**
- Use `new=True` when you want an isolated registry instead of extending built-ins.
- Keep the registry as the source of tool definitions passed into tool-execution helpers.
- Use it early in setup rather than inside every tool call path.

**Example**
Language: python
Description: Access the default registry.

```python
reg = env.get_tool_registry()
```

#### ToolRegistry.register_tool
**Kind**
function

**Summary**
Register a tool definition so the environment can expose it to model-driven tool use.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def register_tool(self, tool):
    ...
```

**Guidance**
- Register schema-first tool definitions that describe arguments and behavior clearly.
- Keep tool docstrings and schema fields aligned because the planner relies on them.
- Use the registry as the authoritative source of tools for model execution.

**Example**
Language: python
Description: Register a tool on the default registry.

```python
reg = env.get_tool_registry()
reg.register_tool(tool_definition)
```

### NEAR Blockchain
**Exports**
- Environment.set_near
- NearClient.view
- NearClient.call

Async NEAR client setup and blockchain interaction.

#### Environment.set_near
**Kind**
function

**Summary**
Configure and return a NEAR client bound to the supplied account credentials.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
def set_near(self, account_id: str, private_key: str):
    ...
```

**Guidance**
- Use this instead of hard-coding client construction throughout the app.
- Keep credentials in environment or secret storage, not source files.
- Treat the returned client as async and structure code accordingly.

**Example**
Language: python
Description: Configure a NEAR client.

```python
near = env.set_near("user.near", "ed25519:XXXXX")
```

#### NearClient.view
**Kind**
function

**Summary**
Run a read-only NEAR contract view call.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
async def view(self, contract_id: str, method_name: str, args=None):
    ...
```

**Guidance**
- Use this for reads that should not mutate chain state.
- Keep argument serialization explicit and deterministic.
- Prefer it over write calls whenever a task only needs contract inspection.

**Example**
Language: python
Description: Read a contract view method.

```python
data = await near.view("contract.near", "get_status", {})
```

#### NearClient.call
**Kind**
function

**Summary**
Send a state-changing NEAR contract call.

**Definition**
Language: python
Source: agents/near-ai-environment/0.3.0.md coverage audit

```python
async def call(self, contract_id: str, method_name: str, args=None, gas=None, deposit=None):
    ...
```

**Guidance**
- Use this only for writes that intentionally mutate state.
- Keep gas and deposit explicit for production-grade workflows.
- Separate this from view logic in application code to avoid accidental writes.

**Example**
Language: python
Description: Call a state-changing method.

```python
tx = await near.call("contract.near", "set_status", {"value": "ok"})
```
