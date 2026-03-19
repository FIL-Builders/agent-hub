# FetchAI Agentverse Hosting API Workflows

### Create And Track A Hosted Agent
1. Create the agent with `agents.create`.
2. Store the returned address immediately.
3. Re-read it with `agents.get` to confirm runtime state and revision.
4. Use the address for later usage and lifecycle operations.
