# Flow Workflows

### Authenticate A User And Run A Read-Only Script
1. Configure FCL with the correct access-node and wallet discovery endpoints for the target network.
2. Call `authenticate()` in a browser-capable environment.
3. Use `query()` with explicit `arg` and `t` helpers to run the Cadence script.
4. Keep the authenticated user state separate from the script result in application logic.

### Submit A Transaction And Wait For Final Status
1. Build the transaction with `mutate()` and explicit arguments and compute limit.
2. Treat the returned tx ID as submission only.
3. Call `tx(txId).onceSealed()` or the equivalent status-observation workflow.
4. Update application state only after the observed status is acceptable for the task.

### Drop To The Low-Level SDK For Explicit Control
1. Decide that FCL’s high-level helper is insufficient for the task.
2. Build the interaction explicitly with `build`, `script` or `transaction`, and `args`.
3. Send it with `send()`.
4. Decode the response with `decode()`.
5. Keep transport, decode, and Cadence-type debugging separate.
