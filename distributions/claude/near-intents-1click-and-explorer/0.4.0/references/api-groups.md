# NEAR Intents 1Click And Explorer API Groups

### 1Click Token And Quote Flow
**Exports**
- getSupportedTokens
- requestQuote
- submitDepositTx
- getSwapStatus

The primary execution surface for requesting, committing, and monitoring a 1Click swap.

#### getSupportedTokens
**Kind**
endpoint

**Summary**
List the tokens currently supported by the 1Click API.

**Definition**
Language: http
Source: https://docs.near-intents.org/ 1Click API

```http
GET /v0/tokens
Host: 1click.chaindefuser.com
```

**Guidance**
- Use this before any quote-building logic so asset IDs and decimals are current.
- Store decimals and chain metadata from this endpoint instead of hard-coding token assumptions.
- Refresh this periodically if your integration caches token choices.

**Example**
Language: bash
Description: Fetch the supported token list.

```bash
curl -sS https://1click.chaindefuser.com/v0/tokens
```

#### requestQuote
**Kind**
endpoint

**Summary**
Request a 1Click quote, either as a dry preview or a committed swap intent.

**Definition**
Language: http
Source: https://docs.near-intents.org/ 1Click quote endpoint

```http
POST /v0/quote
Host: 1click.chaindefuser.com
Content-Type: application/json

{
  "dry": true,
  "originAsset": "asset-id",
  "destinationAsset": "asset-id",
  "amountIn": "smallest-unit-string",
  "slippageToleranceBps": 100
}
```

**Guidance**
- Use `dry=true` for preview and validation, then repeat with `dry=false` only after confirmation.
- Treat the returned `depositAddress` as the canonical handle for subsequent status checks.
- Keep amounts in smallest units as strings so integer precision is preserved.

**Example**
Language: bash
Description: Request a dry quote.

```bash
curl -sS https://1click.chaindefuser.com/v0/quote \
  -H "Content-Type: application/json" \
  -d '{"dry":true,"originAsset":"asset-a","destinationAsset":"asset-b","amountIn":"1000000","slippageToleranceBps":100}'
```

#### submitDepositTx
**Kind**
endpoint

**Summary**
Optionally submit the origin-chain transaction hash to help the service observe a deposit sooner.

**Definition**
Language: http
Source: https://docs.near-intents.org/ 1Click deposit submit endpoint

```http
POST /v0/deposit/submit
Host: 1click.chaindefuser.com
Content-Type: application/json

{
  "depositAddress": "deposit-address",
  "txHash": "0x..."
}
```

**Guidance**
- Treat this as an accelerator, not the primary lifecycle source of truth.
- Continue polling `getSwapStatus` even after submitting the transaction hash.
- Use it when your frontend already has the origin-chain hash and wants faster convergence.

**Example**
Language: bash
Description: Submit an observed deposit transaction hash.

```bash
curl -sS https://1click.chaindefuser.com/v0/deposit/submit \
  -H "Content-Type: application/json" \
  -d '{"depositAddress":"deposit-address","txHash":"0xabc"}'
```

#### getSwapStatus
**Kind**
endpoint

**Summary**
Read the current lifecycle state for a swap keyed by `depositAddress`.

**Definition**
Language: http
Source: https://docs.near-intents.org/ 1Click status endpoint

```http
GET /v0/status?depositAddress=<depositAddress>
Host: 1click.chaindefuser.com
```

**Guidance**
- Poll this endpoint until a terminal state such as `SUCCESS`, `REFUNDED`, or `FAILED`.
- Treat `INCOMPLETE_DEPOSIT` as a user-recovery state, not a silent failure.
- Keep `depositAddress` durable in storage so retries and background reconciliation remain possible.

**Example**
Language: bash
Description: Poll a swap by deposit address.

```bash
curl -sS "https://1click.chaindefuser.com/v0/status?depositAddress=deposit-address"
```

### Explorer History
**Exports**
- explorer.listTransactions
- explorer.listTransactionPages

Read-only Explorer endpoints for historical analytics and UI pagination.

#### explorer.listTransactions
**Kind**
endpoint

**Summary**
List Explorer transactions with cursor-style pagination and filtering.

**Definition**
Language: http
Source: https://docs.near-intents.org/ Explorer API transactions endpoint

```http
GET /api/v0/transactions?numberOfTransactions=50&lastDepositAddress=<optional>
Host: explorer.near-intents.org
Authorization: Bearer <JWT>
```

**Guidance**
- Use this for operational backfills, reconciliation, and analytics feeds.
- Keep Explorer queries separate from live swap status reads.
- Preserve `lastDepositAddress` when paginating instead of inventing numeric offsets.

**Example**
Language: bash
Description: Fetch the latest Explorer transactions.

```bash
curl -sS "https://explorer.near-intents.org/api/v0/transactions?numberOfTransactions=50" \
  -H "Authorization: Bearer $NEAR_INTENTS_JWT"
```

#### explorer.listTransactionPages
**Kind**
endpoint

**Summary**
List transaction pages with explicit page-number and count metadata for UI use.

**Definition**
Language: http
Source: https://docs.near-intents.org/ Explorer API transactions-pages endpoint

```http
GET /api/v0/transactions-pages?page=1&perPage=50
Host: explorer.near-intents.org
Authorization: Bearer <JWT>
```

**Guidance**
- Use this endpoint when a UI needs total-page style navigation rather than cursor backfills.
- Prefer `explorer.listTransactions` for pipelines and reconciliation jobs.
- Keep the page-number model isolated to presentation concerns; it is not a live execution primitive.

**Example**
Language: bash
Description: Fetch the first transactions page.

```bash
curl -sS "https://explorer.near-intents.org/api/v0/transactions-pages?page=1&perPage=50" \
  -H "Authorization: Bearer $NEAR_INTENTS_JWT"
```
