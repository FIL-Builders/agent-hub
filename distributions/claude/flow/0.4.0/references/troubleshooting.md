# Flow Troubleshooting

### FCL auth opens nothing or fails immediately
**Cause**
`discovery.wallet`, `accessNode.api`, or the runtime context is misconfigured.

**Fix**
Confirm that the app is running in a browser-capable environment and that the configured discovery and access-node URLs match the target network.

### A transaction returns a tx ID but the app behaves as if it already succeeded
**Cause**
The app is treating submission as finality.

**Fix**
Poll or await transaction status separately through `tx(txId)` or the lower-level status helpers before treating the state change as complete.

### Cadence calls fail even though the values look correct
**Cause**
The argument types do not match the declared Cadence parameter types.

**Fix**
Encode arguments with Flow’s typed argument helpers and match the signature exactly instead of assuming ABI-style coercion.
