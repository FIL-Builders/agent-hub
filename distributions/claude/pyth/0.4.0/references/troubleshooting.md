# Pyth Troubleshooting

### Hermes update payload retrieved but on-chain call still fails
**Cause**
- wrong chain deployment address
- mismatched or stale `updateData`
- incorrect fee for the exact payload batch

**Fix**
- confirm the target chain is using the correct Pyth contract address
- recompute `getUpdateFee(updateData)` for the exact payload batch
- check that the payload format and chain match the downstream contract path

### On-chain read reverts for stale data
**Cause**
- the selected age threshold is too strict for the available publish time
- the update submission path did not store or parse a fresh enough update
- the code used an unsafe read pattern and delayed the freshness check

**Fix**
- prefer `getPriceNoOlderThan(...)` when the application requires freshness
- inspect the publish time and the age threshold you supplied
- ensure the update submission path actually stored or parsed the fresh update you intended

### Entropy callback fails
**Cause**
- callback gas is too low for the actual callback path
- `getEntropy()` does not return the correct contract address
- request state, provider, or sequence-number tracking is mismatched

**Fix**
- raise or right-size callback gas for the real callback path
- confirm the correct Entropy contract address is returned by `getEntropy()`
- verify that sequence-number tracking and provider selection are aligned to the request that was made

### Express Relay flow appears stuck
**Cause**
- the workflow assumes synchronous completion instead of status-driven progression
- the client is not subscribed to the intended chain set
- the request shape mixes quote-based and bid-based flows

**Fix**
- inspect bid or websocket status updates instead of assuming immediate success
- confirm the client subscribed to the intended chains
- check whether the workflow is quote-based or raw-bid based and ensure the request shape matches that model

### Lazer stream is unstable
**Cause**
- websocket-pool behavior or retry settings do not match the deployment environment
- the requested feed, format, or entitlement is not available to the token in use
- the client does not handle full-connection-down events

**Fix**
- handle `addAllConnectionsDownListener(...)` or equivalent logic
- review websocket-pool and retry settings
- confirm your token and endpoint entitlements are valid for the requested feed and format surface
