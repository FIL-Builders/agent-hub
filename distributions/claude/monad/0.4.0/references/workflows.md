# Monad Protocol Docs Workflows

### Build A Read-Heavy App
1. Configure the Monad testnet chain ID and explorer correctly.
2. Use the documented Multicall3 address or RPC batching for grouped reads.
3. Avoid deep historical reads on the full node.
4. Add an indexer if the product needs historical analytics.

### Submit High-Frequency Transactions
1. Fetch the current nonce once from the node.
2. Manage subsequent nonces locally in the process.
3. Broadcast transactions in sequence with locally incremented nonces.
4. Update UI state using the protocol’s fast-finality expectations.
