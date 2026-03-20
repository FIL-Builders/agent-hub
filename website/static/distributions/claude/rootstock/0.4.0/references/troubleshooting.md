# Rootstock JSON-RPC And Bridge Troubleshooting

### Raw Transaction Is Rejected Immediately
**Cause**
The signed transaction’s `gasPrice` is below the current block `minimumGasPrice`.

**Fix**
Read the latest block, clamp `eth_gasPrice` up to that floor, re-sign, and resend the transaction.

### Peg-In Flow Uses The Wrong Federation Address
**Cause**
The application hard-coded a stale address instead of reading the bridge precompile.

**Fix**
Query `Bridge.getFederationAddress` at runtime and replace the static configuration.
