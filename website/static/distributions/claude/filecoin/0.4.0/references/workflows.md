# Filecoin Workflows

### Read State Deterministically
1. Use `chainHead()` or `chainGetTipSetByHeight(...)` first.
2. Pass the resulting `TipSetKey` into `stateGetActor(...)` or `stateGetReceipt(...)`.
3. Prefer this over unanchored reads when reproducibility matters.

### Submit A Filecoin-Native Message Safely
1. Build the message.
2. Estimate with `gasEstimateMessageGas(...)`.
3. Submit with `mpoolPushMessage(...)`.
4. Watch for inclusion and inspect receipts.

### Interact With FEVM Contracts
1. Use `/rpc/v1`.
2. Use `eth_call` for reads.
3. Use `eth_estimateGas` and `eth_sendRawTransaction` for writes.
4. Keep FEVM assumptions separate from Filecoin-native message semantics.
