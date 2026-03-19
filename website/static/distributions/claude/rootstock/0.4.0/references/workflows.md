# Rootstock JSON-RPC And Bridge Workflows

### Send A Transaction Safely
1. Call `eth_getBlockByNumber("latest", false)` and read `minimumGasPrice`.
2. Call `eth_gasPrice` and clamp the result up to at least that minimum.
3. Use `eth_estimateGas` with realistic calldata and value.
4. Sign the transaction with the chosen gas limit and valid gas price.
5. Broadcast it with `eth_sendRawTransaction`.

### Discover The Current Federation Address
1. Instantiate the bridge precompile ABI or prepare a raw `eth_call`.
2. Call `Bridge.getFederationAddress`.
3. Store the result in runtime state, not as a hard-coded constant.
