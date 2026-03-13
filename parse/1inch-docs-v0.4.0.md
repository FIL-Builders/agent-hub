# 1inch Documentation Pack

## Snapshot
- library name: 1inch
- version or version range: current-docs + fusion-sdk^2.4.6
- primary language: typescript
- homepage or canonical docs URL: https://docs.1inch.io/
- short description: 1inch provides a current Business API surface for swap execution and transaction broadcasting, while `@1inch/fusion-sdk@2.4.6` anchors the agent-facing Fusion order contract layer.
- source set summary: official 1inch docs root and product pages, official 1inch Business product pages for Swap API and Transaction API, `npm:@1inch/fusion-sdk@2.4.6` declarations and README, and `agents/1inch/0.3.0.md` for coverage audit only

## What This Library Is For
1inch is used to integrate token swap flows and Fusion intent-order flows across supported chains. The current public docs surface emphasizes 1inch Business products such as Swap API and Transaction API, while the Fusion SDK provides the concrete TypeScript contract surface for quote retrieval, order creation, order submission, status polling, and websocket-based order monitoring. This pack is for agents that need to choose the right 1inch workflow, keep classic execution separate from Fusion orders, and handle signer, chain, allowance, and submission boundaries correctly.

## Installation And Setup
- install commands:
  - `npm install @1inch/fusion-sdk`
- environment prerequisites:
  - a current 1inch developer or business API credential when the hosted endpoints require authentication
  - an EVM signer or signing connector for Fusion order placement
  - chain-specific RPC access when the application also broadcasts or confirms transactions directly
- configuration prerequisites:
  - lock the intended chain and wallet before building swap or Fusion flows
  - treat token amounts as integer base units
  - keep business API auth and wallet credentials out of source control
- minimum setup example:

```ts
import { FusionSDK, NetworkEnum } from "@1inch/fusion-sdk";

const sdk = new FusionSDK({
  url: "https://api.1inch.dev/fusion",
  network: NetworkEnum.ETHEREUM,
  authKey: process.env.ONEINCH_API_KEY,
});
```

## Core Concepts

### Current docs surface is product-oriented
- The current public 1inch docs surface is organized around Business APIs rather than the older public Aggregation API v5 mental model.
- The main current product boundaries visible on the public site are Swap API and Transaction API.
- The swap product copy explicitly distinguishes intent-based swaps, cross-chain swaps, and classic DEX-aggregator routing.

### Classic execution and Fusion are different flows
- Classic swap execution is a route-discovery plus executable-transaction flow.
- Fusion is an intent-order flow with quote retrieval, signed order creation, submission, and later fill monitoring.
- Do not treat a Fusion quote or a classic route quote as an executable transaction by itself.

### Submission is a separate boundary
- A quote or prepared order is not the same thing as transaction broadcast.
- Transaction API exists as a distinct current product surface for broadcasting transactions, including private-mempool-oriented broadcasting.
- Wallet or RPC submission remains a separate system boundary from 1inch route discovery or order preparation.

### Chain and spender semantics are safety-critical
- 1inch Business advertises multi-chain coverage, and the Fusion SDK encodes chain choice through `NetworkEnum`.
- Approval or permit handling must be chain-specific and flow-specific.
- Agents should not hardcode spender or router assumptions across chains.

## Decision Rules
- Use current Business Swap API docs as the source of truth for classic swap product boundaries, not the old public Aggregation API v5 examples.
- Use `FusionSDK` when the task is specifically about Fusion mode, order placement, or Fusion order monitoring.
- Use classic swap routing when the task requires an immediately executable swap transaction; use Fusion when the task calls for intent-based auction execution.
- Treat approval or permit preparation as a separate step before execution when the input token requires spend authorization.
- Treat transaction broadcast as a separate concern from route discovery or order creation; use Transaction API only when the surrounding system actually wants 1inch-managed broadcasting behavior.

## Preconditions And Invariants
- Fusion order placement requires a signer-capable blockchain connector when the SDK needs to sign typed data.
- `walletAddress` is required for `OrderParams` and optional for `QuoteParams`; once an order is being created, the maker identity must be explicit.
- Token amounts are strings in base units, not decimal user input.
- `network` must match the actual chain where the order or swap is intended to settle.
- The current public 1inch site confirms multi-chain support, but exact classic swap request schemas are portal-defined and were not extracted from the portal shell HTML during this generation run.

## Version Delta Audit
- previous pack target: public Aggregation REST API v5 plus Fusion SDK
- current target: current 1inch Business docs surface plus `@1inch/fusion-sdk@2.4.6`
- delta type: major docs-surface and workflow-model shift
- stale mental model to avoid:
  - treating `/quote`, `/swap`, and `/approve/*` from the old v5 public API as the preferred current public integration model
  - collapsing classic swap execution and Fusion orders into one uniform "swap" flow
  - assuming a single public router/spender pattern is enough across all current chains and products
- replacement pattern:
  - use the current Business Swap API docs surface for current product boundaries
  - use the Fusion SDK for hard contract details around Fusion quotes, orders, status, and websocket monitoring
  - treat Transaction API as a separate broadcast layer

## Ecosystem Boundaries
- core first-class coverage:
  - current 1inch swap product surface
  - current 1inch transaction-broadcast product surface
  - `@1inch/fusion-sdk@2.4.6`
- first-party companion surface:
  - `@1inch/limit-order-sdk`, because Fusion SDK re-exports and depends on its limit-order types
- out-of-scope or boundary-only surface:
  - exact private portal REST schemas for current classic swap endpoints that are not visible from public shell HTML
  - generic wallet, RPC, or token-list infrastructure outside the points where 1inch touches them
  - resolver implementation details beyond the official Fusion resolver example reference

## Deprecated And Compatibility Surface
- The old `agents/1inch/0.3.0.md` pack documents public v5 Aggregation REST endpoints. Those are useful as historical coverage context, but they are not treated as the preferred current public surface here.
- Public v5-style examples should not be taught as the default answer unless a task explicitly targets that older API surface.

## Public Surface Area

### Current product boundaries
- Business Swap API:
  - marketed as the current swap product surface
  - covers intent-based swaps, cross-chain swaps, and classic DEX-aggregator routing
  - public product pages confirm multi-chain scope and product framing, but not concrete REST contracts
- Transaction API:
  - marketed as the current transaction-broadcast product surface
  - positioned for broadcasting transactions, including private-mempool-oriented broadcasting

### Fusion SDK contracts

#### FusionSDK
- contract source:
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/sdk.d.ts`
- role:
  - high-level client for Fusion quotes, order creation, order submission, order status, maker order lists, and cancel calldata

#### FusionSDKConfigParams
- contract source:
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts`
- role:
  - config for hosted endpoint URL, network, auth key, and optional custom connectors

#### QuoteParams
- contract source:
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts`
- role:
  - quote input for Fusion quote discovery

#### OrderParams
- contract source:
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts`
- role:
  - order-creation input for Fusion mode

#### OrderStatus and OrderStatusResponse
- contract source:
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/api/orders/types.d.ts`
- role:
  - status polling contract for Fusion lifecycle monitoring

#### WebSocketApi
- contract source:
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/ws-api/ws-api.d.ts`
  - `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/ws-api/types.d.ts`
- role:
  - websocket monitoring surface for active orders and order events

## Failure Modes And Common Confusions
- confusing classic route or quote discovery with an executable transaction
- treating Fusion orders as direct router transactions
- skipping chain locking and then building or signing for the wrong chain
- using decimal user input directly instead of integer token amounts
- assuming approval, permit, order creation, order submission, and transaction broadcast are one API call
- hardcoding spender or routing assumptions across chains

## Workflow Preconditions
- Before classic execution:
  - know the target chain
  - know the exact from and to token contracts for that chain
  - check whether approval or permit is required
- Before Fusion order placement:
  - have a signer or signing connector
  - have a business auth key if the hosted endpoint requires it
  - decide whether preset-based or custom-preset auction behavior is intended
- Before transaction broadcast:
  - know whether the system is using direct wallet or RPC broadcast, or the 1inch Transaction API boundary

## Migration Traps
- Reusing v5 public endpoint examples as if they were the current first-choice docs surface.
- Answering "use `/swap`" for a Fusion task that actually needs `createOrder` and `submitOrder`.
- Treating `quoteId` as optional after an order has been created; it is part of the order-submission path.
- Assuming classic swap, Fusion, and tx-gateway all share one request model.

## References
- `https://docs.1inch.io/`
- `https://business.1inch.com/products/swap`
- `https://business.1inch.com/products/tx-gateway`
- `npm:@1inch/fusion-sdk@2.4.6`
- `npm:@1inch/fusion-sdk@2.4.6:package/README.md`
- `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/sdk.d.ts`
- `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/sdk/types.d.ts`
- `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/api/orders/types.d.ts`
- `npm:@1inch/fusion-sdk@2.4.6:package/dist/types/src/ws-api/ws-api.d.ts`
