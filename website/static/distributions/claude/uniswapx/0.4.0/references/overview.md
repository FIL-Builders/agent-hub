# UniswapX Integrator APIs Overview

## Snapshot

- Spec name: uniswapx/integrator-apis
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs
- Primary language: http+solidity
- Homepage: https://docs.uniswap.org/contracts/uniswapx/overview
- Source set: current UniswapX docs at `https://docs.uniswap.org/contracts/uniswapx/overview`; `parse/uniswapx-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/uniswapx/0.3.0.md` for coverage audit only

**Tags**
- uniswapx
- quote
- orders
- reactor
- filler
- defi

## Purpose

This pack teaches an agent to integrate with UniswapX at a senior-developer level: implement the quote endpoint with correct last-look behavior, query open orders from the orders API, execute fills through the reactor, and preserve the identifiers and lifecycle boundaries needed for reconciliation.

## Guiding Principles

- Echo `requestId` and `quoteId` unchanged so downstream reconciliation stays intact.
- Return `204` quickly when you do not intend to quote, rather than holding connections open.
- Keep quote generation, order discovery, and reactor execution as separate operational stages.
- Approve and validate output-token execution state before calling the reactor.
- Use `executeWithCallback` only when the strategy genuinely needs callback-driven execution.

## Boundary Notes

- The old `0.3.0` pack already had the right lifecycle model. This `0.4.0` port preserves that and makes quote, order, and reactor boundaries easier to retrieve from.
- UniswapX integrations are easiest to reason about as a three-stage system: quoter HTTP service, orders discovery, and onchain execution.
- Current docs are treated as the authoritative source for product framing and API roles; the older pack was used only for coverage audit.

## FAQ

### Should every filler use executeWithCallback?
No. Use `execute` for the ordinary direct path. Reserve `executeWithCallback` for strategies that truly need callback-driven execution behavior.

### Is the Orders API enough to execute a fill?
No. It helps you discover orders, but the actual fill happens through the reactor contract onchain.

## External Resources

- UniswapX docs: https://docs.uniswap.org/contracts/uniswapx/overview
