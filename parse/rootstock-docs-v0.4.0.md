# Rootstock Documentation Pack

## Target
- Pack: `agents/rootstock/0.4.0.md`
- Target date: 2026-03-12
- Docs anchor: current Rootstock developer docs at `https://dev.rootstock.io/`

## Source Inventory
- Current Rootstock developer docs at `https://dev.rootstock.io/`
- `agents/rootstock/0.3.0.md` for coverage audit only

## Decision Rules
- Read `minimumGasPrice` from the latest block before sending transactions.
- Clamp `eth_gasPrice` suggestions up to at least the current block minimum.
- Use `eth_call` for bridge precompile reads such as federation-address discovery.

## Common Confusions
- Rootstock does not follow Ethereum base-fee intuition for minimum valid gas price.
- `eth_gasPrice` is a hint, not the minimum validity threshold.
- Bridge read calls are regular EVM `eth_call` interactions against a precompile address.

## Failure Modes
- Transactions are rejected because `gasPrice` is below `minimumGasPrice`.
- Peg-in flows hard-code the federation address instead of querying the bridge.
- Clients simulate without realistic gas assumptions and then fail at broadcast time.

## Coverage Map

### JSON-RPC Core
- `eth_getBlockByNumber`
- `eth_estimateGas`
- `eth_sendRawTransaction`
- `eth_gasPrice`

### Bridge
- `Bridge.getFederationAddress`

## Must-Not-Regress Insights
- Preserve `minimumGasPrice` guidance.
- Preserve runtime federation-address discovery.
- Preserve simulation-before-send guidance.
