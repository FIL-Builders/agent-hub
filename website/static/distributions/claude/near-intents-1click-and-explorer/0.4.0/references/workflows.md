# NEAR Intents 1Click And Explorer Workflows

### Execute A 1Click Swap Safely
1. Fetch supported tokens and choose origin and destination assets from that list.
2. Call `requestQuote` with `dry=true` to validate parameters and preview execution.
3. Call `requestQuote` again with `dry=false` after user confirmation.
4. Store the returned `depositAddress`.
5. Broadcast the origin-chain transaction and optionally call `submitDepositTx`.
6. Poll `getSwapStatus` until a terminal status appears.

### Backfill Historical Activity
1. Query `explorer.listTransactions` with a JWT and the desired filters.
2. Store the returned `lastDepositAddress` for the next page.
3. Use `explorer.listTransactionPages` only if the consumer truly needs page counts.
