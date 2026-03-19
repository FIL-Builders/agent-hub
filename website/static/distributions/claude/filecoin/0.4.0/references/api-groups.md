# Filecoin API Groups

### Lotus JS Client Setup
**Exports**
- LotusRPC
- NodejsProvider
- mainnet.fullNode

Core JavaScript primitives for typed Filecoin-native RPC work.

#### LotusRPC
**Kind**
class

**Summary**
Typed JavaScript client wrapper around Lotus JSON-RPC methods.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
declare class LotusRPC {
  constructor(provider: any, options: { schema: any });
}
```

**Guidance**
- Use this as the default JavaScript entrypoint for Filecoin-native RPC work instead of hand-rolled method calls.
- Pair it with the correct schema surface such as `mainnet.fullNode`.
- Keep FEVM `eth_*` calls separate; those usually go directly to `/rpc/v1`.

**Example**
Language: javascript
Description: Create a typed Lotus client for a full node endpoint.

```js
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs";
import { mainnet } from "@filecoin-shipyard/lotus-client-schema";

const provider = new NodejsProvider("http://127.0.0.1:1234/rpc/v0");
const client = new LotusRPC(provider, { schema: mainnet.fullNode });
```

#### NodejsProvider
**Kind**
class

**Summary**
Node.js transport provider for Lotus JSON-RPC over HTTP or WebSocket.

**Definition**
Language: javascript
Source: npm:@filecoin-shipyard/lotus-client-provider-nodejs@1.1.1:package/README.md

```js
const provider = new NodejsProvider(url, options);
```

**Guidance**
- Use HTTP for ordinary request/response RPC.
- Prefer WebSocket for streaming surfaces such as `chainNotify`.
- Keep endpoint choice explicit so `/rpc/v0` and `/rpc/v1` do not get mixed accidentally.

**Example**
Language: javascript
Description: Use WebSocket transport for head notifications.

```js
import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs";

const provider = new NodejsProvider("ws://127.0.0.1:1234/rpc/v0");
```

#### mainnet.fullNode
**Kind**
config

**Summary**
Schema surface used by the Lotus JS Client to expose full-node methods.

**Definition**
Language: javascript
Source: npm:@filecoin-shipyard/lotus-client-schema@4.2.0:package/README.md

```js
const client = new LotusRPC(provider, { schema: mainnet.fullNode });
```

**Guidance**
- Use this when talking to a Lotus full node rather than other daemon subsets.
- Pick the schema surface deliberately because it determines which methods the client exposes.
- Do not assume every endpoint supports every method just because the schema includes it.

**Example**
Language: javascript
Description: Instantiate a full-node client.

```js
import { mainnet } from "@filecoin-shipyard/lotus-client-schema";

const client = new LotusRPC(provider, { schema: mainnet.fullNode });
```

### Chain And State Reads
**Exports**
- chainHead
- chainGetTipSetByHeight
- stateGetActor
- stateGetReceipt

Core Filecoin-native reads for head tracking, historical anchoring, actor inspection, and execution outcomes.

#### chainHead
**Kind**
function

**Summary**
Return the current head tipset.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
chainHead(): Promise<TipSet>
```

**Guidance**
- Use this to anchor later state reads when you need deterministic results.
- Treat the returned tipset as the Filecoin-native head concept, not as a single Ethereum block.
- Public endpoints may limit depth or retention for historical inspection.

**Example**
Language: javascript
Description: Fetch the head tipset and print the height.

```js
const head = await client.chainHead();
console.log(head.Height);
```

#### chainGetTipSetByHeight
**Kind**
function

**Summary**
Return the closest tipset at or before a target epoch.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
chainGetTipSetByHeight(chainEpoch: number, tipSetKey: Cid[]): Promise<TipSet>
```

**Guidance**
- Use this for historical reads where the epoch matters.
- Pass `[]` when you intentionally want resolution relative to the current head.
- Pair it with `State.*` methods when you need time-travel state inspection.

**Example**
Language: javascript
Description: Read the closest tipset at or before a historical epoch.

```js
const ts = await client.chainGetTipSetByHeight(1000000, []);
console.log(ts.Height);
```

#### stateGetActor
**Kind**
function

**Summary**
Read actor state such as balance and nonce at a given tipset.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
stateGetActor(address: string, tipSetKey: Cid[]): Promise<Actor>
```

**Guidance**
- Use `[]` only when you mean “latest”, not when you need a stable historical anchor.
- Keep actor-state reads distinct from FEVM contract reads.
- Use this when debugging wallet state, actor balances, or protocol actor behavior.

**Example**
Language: javascript
Description: Fetch actor balance and nonce.

```js
const actor = await client.stateGetActor("f1abc...", []);
console.log(actor.Balance, actor.Nonce);
```

#### stateGetReceipt
**Kind**
function

**Summary**
Fetch the execution receipt for a message CID at a tipset.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
stateGetReceipt(cid: Cid, tipSetKey: Cid[]): Promise<MessageReceipt>
```

**Guidance**
- Pair it with message lookup or submission flows to inspect execution results.
- A missing receipt usually means the message is not yet included at that chain point.
- Use this instead of inferring success from submission alone.

**Example**
Language: javascript
Description: Read a message receipt and print the exit code.

```js
const receipt = await client.stateGetReceipt({ "/": "bafy-msg..." }, []);
console.log(receipt.ExitCode, receipt.GasUsed);
```

### Message Submission And Wallet Flow
**Exports**
- gasEstimateMessageGas
- mpoolPushMessage
- walletDefaultAddress
- walletBalance

Core Filecoin-native write and wallet helpers.

#### gasEstimateMessageGas
**Kind**
function

**Summary**
Estimate gas fields for a Filecoin-native message before submission.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
gasEstimateMessageGas(msg: Message, spec: MessageSendSpec, tipSetKey: Cid[]): Promise<Message>
```

**Guidance**
- Treat this as part of the normal submission path, not an optional optimization.
- Estimate close to submission time because chain conditions can change.
- Keep this separate from FEVM `eth_estimateGas`; they belong to different surfaces.

**Example**
Language: javascript
Description: Estimate gas for a Filecoin-native message.

```js
const estimated = await client.gasEstimateMessageGas(message, {}, []);
```

#### mpoolPushMessage
**Kind**
function

**Summary**
Assign nonce, sign, and push a Filecoin-native message atomically.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
mpoolPushMessage(msg: Message, spec: MessageSendSpec): Promise<SignedMessage>
```

**Guidance**
- Prefer this over manual nonce-management flows whenever possible.
- Pair it with `gasEstimateMessageGas` before submission.
- Public endpoints may restrict broader write methods even when this one is exposed.

**Example**
Language: javascript
Description: Push an estimated message to the mempool.

```js
const signed = await client.mpoolPushMessage(estimated, {});
console.log(signed.CID);
```

#### walletDefaultAddress
**Kind**
function

**Summary**
Return the default wallet address configured on the node.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
walletDefaultAddress(): Promise<string>
```

**Guidance**
- Use this when the node manages keys and the workflow depends on the node’s default sender.
- Do not assume public endpoints expose wallet methods.
- Make node custody and key management explicit before relying on this.

**Example**
Language: javascript
Description: Print the node’s default wallet address.

```js
const sender = await client.walletDefaultAddress();
console.log(sender);
```

#### walletBalance
**Kind**
function

**Summary**
Read the Filecoin wallet balance for an address.

**Definition**
Language: typescript
Source: npm:@filecoin-shipyard/lotus-client-rpc@1.2.0:package/index.d.ts

```ts
walletBalance(address: string): Promise<string>
```

**Guidance**
- Use this for wallet-state checks before attempting costly message flows.
- Keep it distinct from FEVM token or contract-balance reads.
- Pair with actor or receipt inspection when troubleshooting state discrepancies.

**Example**
Language: javascript
Description: Query balance for a Filecoin address.

```js
const balance = await client.walletBalance("f1abc...");
console.log(balance);
```

### FEVM Ethereum-Compatible RPC
**Exports**
- eth_blockNumber
- eth_call
- eth_estimateGas
- eth_sendRawTransaction

Ethereum-style RPC surfaces exposed by Lotus for FEVM workloads.

#### eth_blockNumber
**Kind**
endpoint

**Summary**
Return the latest FEVM block-style height through the Ethereum-compatible endpoint.

**Definition**
Language: json
Source: https://docs.filecoin.io/smart-contracts/filecoin-ethereum-rpc

```json
{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}
```

**Guidance**
- Treat the returned value as the FEVM-facing view of Filecoin chain height.
- Do not assume this means ordinary Ethereum block semantics underneath.
- Use `/rpc/v1`, not `/rpc/v0`.

**Example**
Language: javascript
Description: Read the latest FEVM block number.

```js
const body = { jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] };
```

#### eth_call
**Kind**
endpoint

**Summary**
Execute an FEVM call without state mutation.

**Definition**
Language: json
Source: https://docs.filecoin.io/smart-contracts/filecoin-ethereum-rpc

```json
{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[transactionObject,"latest"]}
```

**Guidance**
- Use this for contract reads on FEVM.
- Keep it separate from Filecoin-native actor reads.
- Remember that compatibility lives on top of Filecoin chain semantics.

**Example**
Language: javascript
Description: Call a contract read method.

```js
const body = {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_call",
  params: [{ to: contract, data }, "latest"],
};
```

#### eth_estimateGas
**Kind**
endpoint

**Summary**
Estimate gas for an FEVM transaction.

**Definition**
Language: json
Source: https://docs.filecoin.io/smart-contracts/filecoin-ethereum-rpc

```json
{"jsonrpc":"2.0","id":1,"method":"eth_estimateGas","params":[transactionObject]}
```

**Guidance**
- Use this for FEVM transaction preparation, not for Filecoin-native messages.
- Keep FEVM gas estimation distinct from Lotus `gasEstimateMessageGas`.
- Endpoint choice matters; this belongs on `/rpc/v1`.

**Example**
Language: javascript
Description: Estimate gas for an FEVM write.

```js
const body = {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_estimateGas",
  params: [{ from, to, data }],
};
```

#### eth_sendRawTransaction
**Kind**
endpoint

**Summary**
Submit a signed FEVM transaction through Lotus’ Ethereum-compatible RPC.

**Definition**
Language: json
Source: https://docs.filecoin.io/smart-contracts/filecoin-ethereum-rpc

```json
{"jsonrpc":"2.0","id":1,"method":"eth_sendRawTransaction","params":[signedTxHex]}
```

**Guidance**
- Use this only for FEVM-signed transactions.
- Public endpoints may expose this even when other Lotus-native write methods stay restricted.
- Keep it separate from Filecoin-native message submission workflows.

**Example**
Language: javascript
Description: Submit a signed FEVM transaction.

```js
const body = {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_sendRawTransaction",
  params: [signedTx],
};
```
