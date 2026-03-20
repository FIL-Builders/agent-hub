# Filecoin Overview

## Snapshot

- Spec name: filecoin
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs + lotus-client-schema^4.2.0 + lotus-client-rpc^1.2.0
- Primary language: javascript
- Homepage: https://docs.filecoin.io/reference/json-rpc
- Source set: official Filecoin docs for JSON-RPC and FEVM Ethereum-compatible RPC, Lotus docs for endpoint behavior, `npm:@filecoin-shipyard/lotus-client-schema@4.2.0`, `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`, `npm:@filecoin-shipyard/lotus-client-provider-nodejs@1.1.1`, parse/filecoin-docs-v0.4.0.md as the intermediate documentation pack, and agents/filecoin/0.3.0.md for coverage audit only

**Tags**
- filecoin
- lotus
- json-rpc
- fevm
- ethereum-compatibility
- tipsets
- gas
- web3

## Purpose

This pack teaches an agent to use Filecoin as a developer platform: reading chain and actor state through Lotus JSON-RPC, estimating gas and submitting messages safely, using FEVM Ethereum-compatible RPC without losing Filecoin-specific chain semantics, and choosing the right endpoint and client surface for the task.

## Guiding Principles

- Treat Lotus `/rpc/v0` and FEVM `/rpc/v1` as separate operational surfaces.
- Use the Lotus JS Client as the default JavaScript path for Filecoin-native RPC.
- Anchor state reads with a `TipSetKey` when determinism matters; use `[]` only when latest-head behavior is intended.
- Estimate gas before submitting Filecoin-native messages.
- Prefer `mpoolPushMessage` for nonce assignment, signing, and submission instead of composing non-atomic steps.
- Treat FEVM block-style responses in Filecoin chain terms: tipsets and epochs still matter.
- Treat public RPC endpoints as capability-limited compared with a self-hosted node.

## Boundary Notes

- The old `0.3.0` pack was strong on Lotus JSON-RPC and FEVM RPC safety, but it underrepresented the broader Filecoin developer model around choosing the right RPC surface and understanding Filecoin-native chain semantics.
- This pack preserves the high-value operational guidance from the old pack, especially gas estimation, tipset anchoring, and public-endpoint caution.
- Contract sources for JavaScript integration come from the Lotus JS Client packages; RPC request/response surface guidance comes from Filecoin and Lotus docs.
- The pack keeps Lotus-native JSON-RPC and FEVM Ethereum-compatible RPC separate on purpose because many practical mistakes come from flattening them into one “RPC” mental model.
- This is a fresh v0.4.0 pack, but `agents/filecoin/0.3.0.md` was used as coverage audit only.
