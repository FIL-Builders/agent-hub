# UniswapX Integrator APIs Troubleshooting

### Order Was Quoted But Cannot Be Reconciled Later
**Cause**
`requestId` or `quoteId` was changed, dropped, or regenerated between phases.

**Fix**
Echo both identifiers exactly as supplied and carry them through quote, order discovery, and execution records.

### Reactor Execution Fails Unexpectedly
**Cause**
Approvals, token assumptions, or callback payloads were not validated before broadcast.

**Fix**
Validate the order parameters, ensure the exact allowance is in place, and prefer `execute` over `executeWithCallback` unless the callback path is required.
