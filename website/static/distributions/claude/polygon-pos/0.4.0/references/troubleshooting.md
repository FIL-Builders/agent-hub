# Polygon PoS Troubleshooting

### Deposit transaction keeps failing before bridge entry
**Cause**
The parent-side ERC-20 was not approved, or the wrong parent provider or signer was configured.

**Fix**
Verify `POSClient.init` uses the intended parent provider and account, then confirm the approval transaction completed before retrying the deposit.

### Withdrawal looks stuck after `withdrawStart`
**Cause**
The burn happened on Polygon PoS, but the checkpoint has not propagated yet.

**Fix**
Treat the burn tx hash as an intermediate step, wait for checkpoint readiness, and only then call the exit-finalization method.

### The code mixes Ethereum and Polygon PoS token handles
**Cause**
One `erc20` helper is being reused across both parent and child logic without keeping the side explicit.

**Fix**
Use separate parent and child token objects and keep bridge direction explicit in the surrounding code.
