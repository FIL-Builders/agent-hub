# Rootstock JSON-RPC And Bridge API Groups

### JSON-RPC Core
**Exports**
- eth_getBlockByNumber
- eth_estimateGas
- eth_sendRawTransaction
- eth_gasPrice

Ordinary JSON-RPC methods with Rootstock-specific gas and block semantics.

#### eth_getBlockByNumber
**Kind**
endpoint

**Summary**
Fetch a block and inspect Rootstock-specific fields such as `minimumGasPrice`.

**Definition**
Language: http
Source: Rootstock developer docs and prior pack coverage

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_getBlockByNumber",
  "params": ["latest", false]
}
```

**Guidance**
- Call this before constructing gas parameters for a live transaction.
- Read `minimumGasPrice` from the returned block object and treat it as a validity floor.
- Keep the returned value in hex-quantity form until you intentionally normalize it.

**Example**
Language: bash
Description: Fetch the latest block and inspect the minimum gas price.

```bash
curl -sS "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["latest",false]}'
```

#### eth_estimateGas
**Kind**
endpoint

**Summary**
Estimate gas for a pending transaction using ordinary EVM simulation semantics.

**Definition**
Language: http
Source: Rootstock developer docs and prior pack coverage

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_estimateGas",
  "params": [{ "from": "0x...", "to": "0x...", "data": "0x..." }]
}
```

**Guidance**
- Use this before writes, but still set `gasPrice` to at least the latest `minimumGasPrice` when you later broadcast.
- Provide realistic calldata and value so the estimate reflects the eventual transaction path.
- Treat estimates as simulation, not inclusion guarantees.

**Example**
Language: bash
Description: Estimate gas for a contract call.

```bash
curl -sS "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_estimateGas","params":[{"from":"0xfrom","to":"0xto","data":"0xdeadbeef"}]}'
```

#### eth_sendRawTransaction
**Kind**
endpoint

**Summary**
Broadcast a signed transaction to the Rootstock network.

**Definition**
Language: http
Source: Rootstock developer docs and prior pack coverage

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_sendRawTransaction",
  "params": ["0x<signed-transaction>"]
}
```

**Guidance**
- Ensure the signed transaction uses a `gasPrice` greater than or equal to the latest block `minimumGasPrice`.
- Keep signed payload construction separate from RPC transport so retries are easier to reason about.
- Store the transaction hash durably once returned.

**Example**
Language: bash
Description: Broadcast a signed transaction.

```bash
curl -sS "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_sendRawTransaction","params":["0xsignedtx"]}'
```

#### eth_gasPrice
**Kind**
endpoint

**Summary**
Return the node’s suggested gas price for new transactions.

**Definition**
Language: http
Source: Rootstock developer docs and prior pack coverage

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_gasPrice",
  "params": []
}
```

**Guidance**
- Use this as a heuristic, not as the final validity threshold.
- Clamp the result up to at least the latest `minimumGasPrice`.
- Re-read it periodically in long-running processes rather than caching it indefinitely.

**Example**
Language: bash
Description: Fetch the node’s gas-price suggestion.

```bash
curl -sS "$RPC_URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}'
```

### Bridge Reads
**Exports**
- Bridge.getFederationAddress

Rootstock bridge-precompile reads used for peg-in and operator-facing flows.

#### Bridge.getFederationAddress
**Kind**
function

**Summary**
Read the current federation address from the bridge precompile.

**Definition**
Language: solidity
Source: Rootstock developer docs and prior pack coverage

```solidity
function getFederationAddress() external view returns (string memory);
```

**Guidance**
- Query this at runtime instead of hard-coding a federation address into the application.
- Use `eth_call` against the bridge precompile or an ABI wrapper around it.
- Cache the result only for the current session or deployment window; it is configuration, not a compile-time constant.

**Example**
Language: javascript
Description: Query the federation address via a bridge contract wrapper.

```js
const address = await bridge.methods.getFederationAddress().call();
```
