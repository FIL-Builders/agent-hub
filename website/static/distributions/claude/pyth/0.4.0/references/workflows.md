# Pyth Workflows

### Hermes to EVM on-demand update flow
1. Use `HermesClient.getLatestPriceUpdates(...)` to fetch serialized update payloads for the target feed IDs.
2. On-chain, call `IPyth.getUpdateFee(updateData)` for the exact payload batch.
3. Submit `IPyth.updatePriceFeeds{ value: fee }(updateData)` or `updatePriceFeedsIfNecessary(...)` when you already track publish times.
4. Read with `IPyth.getPriceNoOlderThan(...)` or use `parsePriceFeedUpdates(...)` when the business logic is fixed-time or event-window based.

### Lower-level Pythnet direct-read flow
1. Resolve the program key with `getPythProgramKeyForCluster(...)`.
2. Use `PythConnection` for streaming callbacks or `PythHttpClient` for one-shot reads.
3. Prefer this only when direct Pythnet account access is actually needed; otherwise use Hermes.

### Entropy request and callback flow
1. Pick the right `requestV2(...)` overload.
2. Compute `getFeeV2(...)` for the exact request shape.
3. Persist the returned sequence number.
4. Handle `entropyCallback(...)` with tight gas and explicit sequence-number state cleanup.

### Express Relay quote or bid flow
1. Create `Client` with opportunity and bid-status callbacks.
2. Subscribe to the relevant chains.
3. Use `getQuote(...)` or prepare a `Bid` from the actual opportunity and chain-specific state.
4. Submit and then track status asynchronously through the returned IDs and callbacks.

### Lazer low-latency stream flow
1. Create `PythLazerClient` with explicit token and connection behavior.
2. Register listeners before subscribing.
3. Subscribe with narrow properties, formats, and symbols or feed IDs.
4. Handle connection-down events and subscription lifecycle as first-class operational concerns.
