# Monad Protocol Docs Troubleshooting

### Historical Read RPC Calls Keep Failing
**Cause**
The node does not retain the historical state depth that the application expects.

**Fix**
Reformulate the query against recent state or move the historical requirement to an indexer.

### Rapid Transaction Submission Reuses Nonces
**Cause**
The app relies on `eth_getTransactionCount` for each submission instead of tracking nonces locally.

**Fix**
Fetch the nonce once, increment it locally for the burst, and align the queue with Monad’s finality timing.
