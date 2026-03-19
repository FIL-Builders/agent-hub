# NEAR AI Environment Workflows

### Run A Tool-Aware Agent Step
1. Load the current thread with `Environment.list_messages`.
2. Get or construct a tool registry.
3. Register any custom tools needed for the step.
4. Pass registry tools into `Environment.completion_and_run_tools`.
5. Persist the result with `Environment.add_reply`.

### Read Then Write On NEAR
1. Configure the client with `Environment.set_near`.
2. Use `NearClient.view` to inspect current state.
3. Decide whether a mutation is needed.
4. Use `NearClient.call` with explicit gas or deposit values.
