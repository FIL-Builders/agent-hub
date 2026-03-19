# 1inch Overview

## Snapshot

- Spec name: 1inch
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + fusion-sdk^2.4.6
- Primary language: typescript
- Homepage: https://docs.1inch.io/
- Source set: official 1inch docs root plus current 1inch Business product pages for Swap API and Transaction API, `npm:@1inch/fusion-sdk@2.4.6` declarations and README, `parse/1inch-docs-v0.4.0.md` as the intermediate documentation pack, and `agents/1inch/0.3.0.md` for coverage audit only

**Tags**
- defi
- dex-aggregator
- swaps
- intents
- fusion
- typescript

## Purpose

This pack teaches an agent to use the current 1inch docs surface and Fusion SDK for chain-aware swap routing, Fusion quote and order workflows, order monitoring, and transaction-broadcast boundary decisions without collapsing classic execution, Fusion orders, approvals, and submission into one undifferentiated swap flow.

## Guiding Principles

- Treat the current 1inch docs surface as product-oriented: Swap API, Fusion-mode workflows, and Transaction API are related but distinct layers.
- Keep classic executable swap flows separate from Fusion order flows; a Fusion order is not a direct router transaction.
- Treat approval or permit preparation as its own decision point before any spend-requiring execution path.
- Lock chain, wallet, and token addresses before asking 1inch for routes, quotes, or order data.
- Keep token amounts in base units and avoid decimal arithmetic in integration code.
- Do not hardcode spender, router, or endpoint assumptions across chains.
- Treat quote discovery, order creation, and transaction broadcasting as separate boundaries unless an authoritative current source proves they are coupled.

## Boundary Notes

- Source material: `https://docs.1inch.io/` and current 1inch Business product pages at `https://business.1inch.com/products/swap` and `https://business.1inch.com/products/tx-gateway` for current product boundaries; `npm:@1inch/fusion-sdk@2.4.6` declarations and README for concrete TypeScript contracts and examples.
- Coverage centers on what can be grounded cleanly today: current product-surface boundaries plus the exact Fusion SDK contract surface for quotes, orders, status, and websocket monitoring.
- The previous `agents/1inch/0.3.0.md` pack was used only to audit coverage and preserve valid operational insights. Its old public Aggregation API v5 routes were not reused as authoritative current contracts.
- Exact current classic-swap REST request and response schemas were not extracted from the business portal shell HTML during this run, so the pack documents current classic-swap behavior at the workflow boundary rather than asserting unverifiable endpoint shapes.
- The pack intentionally separates current swap product guidance from Fusion SDK contract details so agents do not answer with stale v5-only patterns or misuse Fusion APIs as if they were executable router calls.

## FAQ

### When should an agent choose classic swap flow instead of Fusion?
Choose classic swap flow when the task needs an immediately executable swap transaction. Choose Fusion when the task needs an intent order, order lifecycle tracking, or auction-based settlement.

### Can a Fusion quote be submitted directly like a swap transaction?
No. A Fusion quote feeds order creation and submission. It is not itself a transaction payload.

### Should agents hardcode spender or router addresses?
No. Treat spender and route details as chain-aware current-docs concerns unless an authoritative current source explicitly pins a constant for the exact flow in question.

### Do I always need the 1inch Transaction API?
No. Transaction API is a separate broadcast layer. Use it only when the system intentionally wants 1inch-managed transaction broadcasting behavior rather than direct wallet or RPC submission.

## External Resources

- Official docs root: https://docs.1inch.io/
- 1inch Business Swap API product page: https://business.1inch.com/products/swap
- 1inch Business Transaction API product page: https://business.1inch.com/products/tx-gateway
- Fusion SDK package on npm: https://www.npmjs.com/package/@1inch/fusion-sdk/v/2.4.6
- Fusion SDK repository: https://github.com/1inch/fusion-sdk
