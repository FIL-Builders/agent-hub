# NEAR Intents 1Click And Explorer Documentation Pack

## Target
- Pack: `agents/near-intents-1click-and-explorer/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current NEAR Intents docs at `https://docs.near-intents.org/`

## Source Inventory
- Current NEAR Intents docs for 1Click API and Explorer API
- `agents/near-intents-1click-and-explorer/0.3.0.md` for coverage audit only

## Decision Rules
- Use `/v0/tokens` before building quote requests so decimals and asset IDs are correct.
- Run `/v0/quote` with `dry=true` before committing a swap flow.
- Treat `depositAddress` as the durable handle for later status and reconciliation.
- Use Explorer APIs for analytics and backfills, not as the live execution state source of truth.

## Common Confusions
- `/v0/quote` with `dry=false` is the commit step; the dry quote is just a preview.
- `/v0/deposit/submit` is optional acceleration, not the lifecycle source of truth.
- Explorer pagination is a history read surface, not the real-time swap state.

## Failure Modes
- Wrong decimals or asset ID create unusable quote requests.
- Integrations lose track of `depositAddress` and cannot reconcile later state.
- Status polling ignores `INCOMPLETE_DEPOSIT` and provides no recovery path.

## Coverage Map

### 1Click
- `getSupportedTokens`
- `requestQuote`
- `submitDepositTx`
- `getSwapStatus`

### Explorer
- `explorer.listTransactions`
- `explorer.listTransactionPages`

## Must-Not-Regress Insights
- Preserve dry-quote-first guidance.
- Preserve `depositAddress` as the primary lifecycle key.
- Preserve the distinction between 1Click execution APIs and Explorer analytics APIs.
