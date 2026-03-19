# NEAR AI Environment Troubleshooting

### Tool Calls Fail Or Never Trigger
**Cause**
Raw callables were passed instead of tool definitions from the registry.

**Fix**
Register tools through the registry and pass the resulting definitions to the tool-running helpers.

### NEAR Calls Are Fragile Or Leak Secrets
**Cause**
Credentials were handled ad hoc instead of through the environment’s NEAR setup path.

**Fix**
Create the client through `Environment.set_near` and load credentials from secure runtime configuration.
