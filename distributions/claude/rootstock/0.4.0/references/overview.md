# Rootstock JSON-RPC And Bridge Overview

## Snapshot

- Spec name: rootstock/json-rpc-bridge
- Spec version: 0.4.0
- Generated: 2026-03-12
- Library version: current-docs
- Primary language: http+json
- Homepage: https://dev.rootstock.io/
- Source set: current Rootstock developer docs at `https://dev.rootstock.io/`; `parse/rootstock-docs-v0.4.0.md` as the intermediate documentation pack; and `agents/rootstock/0.3.0.md` for coverage audit only

**Tags**
- rootstock
- rsk
- json-rpc
- bridge
- evm
- bitcoin

## Purpose

This pack teaches an agent to use Rootstock at a senior-developer level through its Ethereum-compatible JSON-RPC surface and the native Bridge precompile: read the latest block to learn the current minimum valid gas price, estimate and send transactions safely, and query the live federation address instead of hard-coding bridge parameters.

## Guiding Principles

- Read `minimumGasPrice` from the latest block before preparing production transactions.
- Treat `eth_gasPrice` as a hint and clamp it to at least the current `minimumGasPrice`.
- Simulate with `eth_estimateGas` or `eth_call` before broadcasting state-changing transactions.
- Query the bridge precompile for federation information at runtime instead of hard-coding it.
- Keep Rootstock-specific gas semantics explicit when porting Ethereum code.

## Boundary Notes

- The old `0.3.0` pack had the right Rootstock-specific instincts. This `0.4.0` port preserves those and makes the minimum-gas and bridge-read paths easier to retrieve from.
- The key Rootstock-specific difference is the per-block `minimumGasPrice`, which is not interchangeable with generic Ethereum gas heuristics.
- The bridge is still modeled as a precompile read surface exposed through ordinary EVM-style calls.

## FAQ

### Is eth_gasPrice enough on Rootstock?
No. Treat it as a suggestion. The latest block’s `minimumGasPrice` is the validity floor that your transaction must satisfy.

### Is the bridge precompile accessed differently from other contracts?
Not conceptually. You still use `eth_call` semantics or a normal ABI wrapper, but you target the precompile address.

## External Resources

- Rootstock developer docs: https://dev.rootstock.io/
