# NEAR Intents 1Click And Explorer Overview

## Snapshot

- Spec name: near-intents/1click-and-explorer
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + 1click-v0 + explorer-v0
- Primary language: http+json
- Homepage: https://docs.near-intents.org/
- Source set: current NEAR Intents docs at `https://docs.near-intents.org/`; `parse/near-intents-1click-and-explorer-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/near-intents-1click-and-explorer/0.3.0.md` for coverage audit only

**Tags**
- near-intents
- defuse
- 1click
- swap
- cross-chain
- api

## Purpose

This pack teaches an agent to use the NEAR Intents 1Click and Explorer APIs at a senior-developer level: discover supported tokens, request a dry or committed quote, track a swap using `depositAddress`, optionally submit the origin-chain transaction hash, and paginate explorer history without confusing historical analytics with live execution state.

## Guiding Principles

- Fetch the supported-token list before building quote requests so decimals, asset IDs, and chain assumptions are correct.
- Use `requestQuote` with `dry=true` first; only commit with `dry=false` after the user accepts the tradeoff.
- Treat `depositAddress` as the durable key for status checks and operational reconciliation.
- Keep Explorer endpoints separate from live 1Click execution APIs; they are for history and analytics.
- Poll status idempotently until a terminal state and surface `INCOMPLETE_DEPOSIT` with explicit next steps.

## Boundary Notes

- The old `0.3.0` pack already had the correct operational model. The `0.4.0` port preserves that model and makes the quote, status, and explorer boundaries easier to retrieve from.
- This pack keeps the `v0` route names explicit because real integrations depend on path stability.
- Explorer is intentionally treated as a separate read model so agents do not confuse historical pages with swap truth.

## FAQ

### Is Explorer enough to track an in-flight swap?
No. Explorer is a historical read surface. Use `getSwapStatus` as the lifecycle truth for an active swap keyed by `depositAddress`.

### Do I always need submitDepositTx?
No. It is optional and useful when your app already has the origin-chain transaction hash and wants to reduce observation lag.

## External Resources

- NEAR Intents docs: https://docs.near-intents.org/
