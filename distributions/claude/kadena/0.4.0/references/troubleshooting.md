# Kadena Pact Lang API Troubleshooting

### Transaction Fails Unexpectedly After Submission
**Cause**
The flow skipped local simulation or built incorrect metadata, often with millisecond timestamps.

**Fix**
Rebuild metadata with seconds-based `creationTime`, simulate with `Pact.fetch.local`, then resubmit and observe with `listen` or `poll`.

### Browser Signing Flow Is Unsafe Or Brittle
**Cause**
The integration is handling raw secret keys directly instead of using the wallet surface.

**Fix**
Move end-user signing to `Pact.wallet.sign` and keep private keys out of browser application code.
