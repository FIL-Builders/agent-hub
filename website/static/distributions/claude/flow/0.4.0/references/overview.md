# Flow Overview

## Snapshot

- Spec name: flow
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + @onflow/fcl^1.21.9 + @onflow/sdk^1.13.7
- Primary language: javascript
- Homepage: https://developers.flow.com/build/tools/clients/fcl-js
- Source set: official Flow docs for FCL JS, scripts, transactions, accounts, blocks, events, and access-node behavior; `npm:@onflow/fcl@1.21.9`; `npm:@onflow/sdk@1.13.7`; `parse/flow-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/flow/0.3.0.md` for coverage audit only

**Tags**
- flow
- fcl
- cadence
- wallet
- access-node
- scripts
- transactions
- events

## Purpose

This pack teaches an agent to use Flow as an application platform: configure FCL correctly, authenticate users through Flow-compatible wallets, run Cadence scripts, submit Cadence transactions, observe transaction status separately from submission, and drop to the lower-level SDK only when explicit interaction or transport control is actually needed.

## Guiding Principles

- Start with FCL for normal Flow application work and use the low-level SDK only when you need more explicit control.
- Keep Cadence scripts and Cadence transactions distinct because they have different trust, auth, and execution models.
- Treat a returned tx ID as submission, not final success.
- Keep wallet auth and signing flows separate from server-only execution logic.
- Encode Cadence arguments with Flow’s typed argument model rather than EVM-style assumptions.
- Treat access-node streams as a specialized read surface, not the default entrypoint for ordinary app work.

## Boundary Notes

- The old `0.3.0` pack was a strong access-stream reference, but it overfit a specialized Flow surface.
- This pack recenters Flow around FCL because that is the ordinary entrypoint for connected web apps.
- `@onflow/fcl` is the right default for auth, scripts, transactions, and status observation in app code.
- `@onflow/sdk` remains important for lower-level interaction building, transport, and advanced control; the pack keeps that boundary explicit instead of flattening the two layers.
- `agents/flow/0.3.0.md` was used only for coverage audit and stream-boundary preservation, not as the contract source.

## FAQ

### Should I start with FCL or `@onflow/sdk`?
Start with FCL for normal app work. Drop to `@onflow/sdk` only when you need explicit interaction building or transport control that FCL does not expose cleanly.

### Is `query()` the Flow equivalent of a contract read?
It is the high-level way to run a read-only Cadence script, but the mental model is different from EVM contract calls. Keep Cadence scripts and transactions distinct.

### When should I use streaming?
Use streaming for event-heavy, monitoring, or continuous-observation problems. For normal auth, reads, writes, and tx status, start with FCL and ordinary access-node request-response flows.

## External Resources

- Flow FCL Docs: https://developers.flow.com/build/tools/clients/fcl-js
- Flow App Quickstart: https://developers.flow.com/tutorials/flow-app-quickstart
- Flow Cadence Docs: https://cadence-lang.org
- FCL Package: https://www.npmjs.com/package/@onflow/fcl
- Flow SDK Package: https://www.npmjs.com/package/@onflow/sdk
