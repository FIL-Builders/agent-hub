# Filecoin Synapse SDK Troubleshooting

### Upload fails even though the wallet still has funds
**Cause**
Wallet balance and Synapse payment-account or operator-approval state are separate.

**Fix**
Check `walletBalance()`, `balance()`, and service approval status independently, then fund or approve the service as needed.

### Cost-aware flow still runs out of funds
**Cause**
The workflow skipped `prepare()` or reused stale cost assumptions.

**Fix**
Recompute costs with the current size and runway assumptions, then execute the returned funding or approval plan before uploading.

### Retrieval or analytics look wrong after upload
**Cause**
FilBeam and CDN-assisted retrieval are observability or retrieval layers, not the direct source of truth for onchain payment or storage state.

**Fix**
Separate storage proof, provider state, payment rails, and FilBeam stats in diagnosis rather than treating any one of them as the whole system.
