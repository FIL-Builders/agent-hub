# 0G Serving Broker Troubleshooting

### Inference Request Fails Before Execution
**Cause**
The broker ledger does not have enough funded balance for the request path.

**Fix**
Read `LedgerService.getLedger`, top up with `LedgerService.depositFund`, then retry after the funding state is visible.

### Verification Returns False
**Cause**
The response was checked with the wrong provider or mismatched request context.

**Fix**
Verify with the same provider and optional chat ID used to generate the original request headers.
