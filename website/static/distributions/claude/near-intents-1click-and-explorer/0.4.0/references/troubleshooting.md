# NEAR Intents 1Click And Explorer Troubleshooting

### Status Stays At Incomplete Deposit
**Cause**
The quoted swap did not receive the full expected deposit amount or the deposit was not observed yet.

**Fix**
Surface the deposit instructions clearly, optionally call `submitDepositTx` with the observed origin-chain hash, and continue polling `getSwapStatus`.

### Quote Request Fails For A Token Pair
**Cause**
The request used stale asset IDs or wrong decimal assumptions.

**Fix**
Refresh `getSupportedTokens`, rebuild the request using the returned token metadata, and keep all amounts in smallest-unit strings.
