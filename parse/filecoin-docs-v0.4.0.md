# Filecoin Documentation Pack

## Snapshot
- library name: Filecoin
- version or version range: current docs surface, `@filecoin-shipyard/lotus-client-schema@4.2.0`, `@filecoin-shipyard/lotus-client-rpc@1.2.0`, `@filecoin-shipyard/lotus-client-provider-nodejs@1.1.1`
- primary language: javascript
- homepage: https://docs.filecoin.io/reference/json-rpc
- short description: Filecoin developer surface spanning Lotus JSON-RPC, FEVM Ethereum-compatible RPC, tipset-aware state reads, wallet/message flow, and JavaScript Lotus client usage
- source set summary: official Filecoin JSON-RPC and Ethereum JSON-RPC docs, Lotus docs for RPC usage, Lotus JS Client packages for JavaScript contract surfaces, and the prior `agents/filecoin/0.3.0.md` pack for coverage audit only

## What This Library Is For
Filecoin developer work usually falls into two adjacent but distinct surfaces: Lotus JSON-RPC for Filecoin-native state, actors, wallet, message, gas, and tipset operations, and FEVM Ethereum-compatible RPC for EVM-style contract interaction. A useful pack needs to preserve both without flattening them into generic Ethereum advice.

Major use cases:
- read tipsets, blocks, actor state, miner data, and receipts
- estimate gas and submit messages safely
- subscribe to head changes and mempool events
- interact with FEVM contracts over `eth_*` endpoints
- decide when a public endpoint is enough vs when a self-hosted node is required

Scope and boundaries:
- in scope: Lotus `/rpc/v0`, FEVM `/rpc/v1`, Lotus JS Client, gas/message flow, state queries, FEVM caveats
- out of scope for first-class coverage: storage-market deal lifecycle internals, miner-operator workflows, and lotus daemon administration

## Installation And Setup
- install commands:
  - `npm install @filecoin-shipyard/lotus-client-rpc @filecoin-shipyard/lotus-client-provider-nodejs @filecoin-shipyard/lotus-client-schema`
- environment prerequisites:
  - access to a Lotus endpoint for `/rpc/v0`
  - access to a Lotus FEVM endpoint for `/rpc/v1` when using `eth_*`
- configuration prerequisites:
  - pick the correct endpoint for the task
  - prefer WebSocket for streaming methods such as `chainNotify`

Minimum setup example:

```js
import { LotusRPC } from "@filecoin-shipyard/lotus-client-rpc";
import { NodejsProvider } from "@filecoin-shipyard/lotus-client-provider-nodejs";
import { mainnet } from "@filecoin-shipyard/lotus-client-schema";

const provider = new NodejsProvider("http://127.0.0.1:1234/rpc/v0");
const client = new LotusRPC(provider, { schema: mainnet.fullNode });
```

## Core Concepts

### Tipsets And Epochs
- Filecoin chain reads are tipset-oriented, not single-block oriented by default.
- FEVM block-like views still map to Filecoin tipsets and epochs.
- Many historical or deterministic reads require a `TipSetKey`.

### Lotus JSON-RPC vs FEVM RPC
- `/rpc/v0` is the Filecoin-native Lotus JSON-RPC surface.
- `/rpc/v1` is the FEVM Ethereum-compatible RPC surface.
- They solve different tasks and should not be interchanged casually.

### State Reads vs Message Submission
- `State.*` and `Chain.*` methods are for deterministic reads and inspection.
- message submission flows need explicit gas estimation and submission sequencing.
- public endpoints are often read-mostly, with limited write methods available.

### Public Endpoint Limits
- public endpoints are convenient for reads and FEVM submission prototypes
- broader writes and operational methods often require your own node
- historical depth or streaming support may also vary

## Version Delta Audit
- prior version or prior pack target: `agents/filecoin/0.3.0.md`, focused on Lotus JSON-RPC and FEVM RPC
- current locked version: current Filecoin docs surface with Lotus JS Client `schema@4.2.0` and `rpc@1.2.0`
- major changes that affect agent behavior:
  - none in package major versions, but the pack now broadens from narrow RPC reference to a fuller Filecoin developer workflow
- outdated assumptions that must not carry forward:
  - FEVM should not be treated as identical to ordinary Ethereum nodes
  - public RPC endpoints should not be treated as full-trust write surfaces
  - developer work is not only `eth_*` or only `Filecoin.*`; the boundary matters

## Decision Rules
- Use Lotus `/rpc/v0` when you need Filecoin-native chain, state, gas, wallet, or actor semantics.
- Use FEVM `/rpc/v1` when the task is specifically EVM-compatible contract interaction.
- Use `[]` as the `TipSetKey` when you intentionally want the current head.
- Avoid `mpoolGetNonce` + manual push when `mpoolPushMessage` can assign nonce and sign atomically.
- Choose a self-hosted node when the task requires broader writes, deep history, or reliable operational control.

## Ecosystem Boundaries
- core surface:
  - Lotus JSON-RPC
  - FEVM RPC exposed by Lotus
  - Lotus JS Client packages
- companion or adjacent surfaces:
  - FEVM contract tooling built on Ethereum libraries
  - operational Lotus node management
- intentionally out of scope:
  - generic Ethereum node assumptions as if they were Filecoin rules
  - low-level node administration and storage-miner ops

## Preconditions And Invariants
- a valid endpoint must be selected for the task: `/rpc/v0` vs `/rpc/v1`
- `State.*` reads that must be deterministic should be anchored to a known `TipSetKey`
- messages should be gas-estimated before submission
- FEVM block semantics must be interpreted in Filecoin chain terms

## Public Surface Area

### Client Setup

#### LotusRPC
**Kind:** class

**Summary:** JavaScript client wrapper around Lotus JSON-RPC methods.

**Definition**
```ts
new LotusRPC(provider, { schema: mainnet.fullNode })
```

**Guidance**
- pair it with the correct schema for the daemon surface you are targeting
- use it for typed Filecoin-native RPC instead of hand-rolling method calls when the JS client covers the method

**Example**
```js
const client = new LotusRPC(provider, { schema: mainnet.fullNode });
```

**Source Notes**
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- exact package surface

#### NodejsProvider
**Kind:** class

**Summary:** Provider implementation that talks to Lotus JSON-RPC over HTTP or WebSocket from Node.js.

**Definition**
```ts
new NodejsProvider(url, options?)
```

**Guidance**
- use HTTP for ordinary request/response flows
- prefer WebSocket for streaming surfaces such as `chainNotify`

**Example**
```js
const provider = new NodejsProvider("ws://127.0.0.1:1234/rpc/v0");
```

**Source Notes**
- `npm:@filecoin-shipyard/lotus-client-provider-nodejs@1.1.1`
- package README and implementation

### Filecoin-Native Reads

#### chainHead
**Kind:** function

**Summary:** Return the current head tipset.

**Definition**
```ts
chainHead(): Promise<TipSet>
```

**Guidance**
- use this to anchor time-sensitive or deterministic reads
- pass its `TipSetKey` into `State.*` methods when you need stable results

**Example**
```js
const head = await client.chainHead();
console.log(head.Height);
```

**Source Notes**
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- same contract also reflected in the prior pack

#### stateGetActor
**Kind:** function

**Summary:** Read actor state such as balance and nonce at a given tipset.

**Definition**
```ts
stateGetActor(address: string, tipSetKey: Cid[]): Promise<Actor>
```

**Guidance**
- use `[]` for latest state only when deterministic anchoring is not required
- actor reads are Filecoin-native and should not be mixed up with FEVM contract introspection

**Example**
```js
const actor = await client.stateGetActor("f1abc...", []);
```

**Source Notes**
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- Filecoin docs for JSON-RPC state methods

### Message Flow

#### gasEstimateMessageGas
**Kind:** function

**Summary:** Estimate gas fields for a Filecoin-native message before submission.

**Definition**
```ts
gasEstimateMessageGas(msg, spec, tipSetKey): Promise<Message>
```

**Guidance**
- treat this as mandatory for safe message submission
- estimation should happen close to submission time because chain conditions change

**Example**
```js
const estimated = await client.gasEstimateMessageGas(message, {}, []);
```

**Source Notes**
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- Lotus and Filecoin docs

#### mpoolPushMessage
**Kind:** function

**Summary:** Assign nonce, sign, and submit a Filecoin-native message atomically.

**Definition**
```ts
mpoolPushMessage(msg, spec): Promise<SignedMessage>
```

**Guidance**
- prefer this over separate nonce lookup plus push flows
- combine it with gas estimation and later receipt lookup

**Example**
```js
const signed = await client.mpoolPushMessage(estimated, {});
```

**Source Notes**
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- old pack insight preserved and re-grounded

### FEVM RPC

#### eth_call
**Kind:** endpoint

**Summary:** Execute an FEVM call without state mutation against the `/rpc/v1` Ethereum-compatible endpoint.

**Definition**
```json
{"method":"eth_call","params":[transactionObject, blockTag]}
```

**Guidance**
- use the FEVM endpoint only when the task is truly EVM contract interaction
- remember that FEVM chain semantics still sit on top of Filecoin tipsets and epochs

**Example**
```js
const body = {
  jsonrpc: "2.0",
  id: 1,
  method: "eth_call",
  params: [{ to: contract, data }, "latest"]
};
```

**Source Notes**
- official Filecoin docs for Ethereum JSON-RPC
- exact request shape condensed

#### eth_sendRawTransaction
**Kind:** endpoint

**Summary:** Submit a signed FEVM transaction through the Lotus `/rpc/v1` endpoint.

**Definition**
```json
{"method":"eth_sendRawTransaction","params":[signedTxHex]}
```

**Guidance**
- only use this for FEVM/Ethereum-style signed transactions
- public endpoints may allow this method while still restricting wider Filecoin-native writes

**Example**
```js
await fetch("http://127.0.0.1:1234/rpc/v1", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "eth_sendRawTransaction",
    params: [signedTx],
  }),
});
```

**Source Notes**
- official Filecoin docs for Ethereum JSON-RPC
- exact request shape condensed

## Common Workflows

### Read Actor State At Head
- when to use it: inspect balance, nonce, or actor metadata
- ordered steps:
  - create `NodejsProvider` and `LotusRPC`
  - call `chainHead()`
  - call `stateGetActor(address, head.Cids ?? [])` or `[]` when latest is enough
- common failure points:
  - using FEVM RPC for Filecoin-native actor reads
  - assuming unanchored reads are deterministic

### Estimate Gas And Submit A Message
- when to use it: send Filecoin-native messages safely
- ordered steps:
  - construct the message
  - estimate with `gasEstimateMessageGas`
  - submit with `mpoolPushMessage`
  - poll or query for receipt
- common failure points:
  - skipping gas estimation
  - using non-atomic nonce flows
  - assuming a public endpoint exposes all write methods

### Call A FEVM Contract
- when to use it: read or write EVM-compatible contracts on FEVM
- ordered steps:
  - use `/rpc/v1`
  - call `eth_call` for reads or `eth_sendRawTransaction` for signed writes
  - interpret block and height semantics in Filecoin terms
- common failure points:
  - using `/rpc/v0`
  - assuming Ethereum block semantics map 1:1

## Common Confusions
- `TipSetKey: []` means current head, not historical determinism
- `/rpc/v0` and `/rpc/v1` are not interchangeable
- FEVM compatibility does not erase Filecoin-specific chain semantics
- public RPC usability does not imply full node capability

## Deprecated And Compatibility Surface
- the old pack’s narrow RPC-only model is no longer sufficient as the whole developer mental model
- FEVM compatibility should be treated as an adjacent surface, not the only application surface

## Pitfalls And Troubleshooting

### Message Submitted But No Expected Receipt
- likely cause: wrong endpoint, wrong chain context, or message not yet included at the inspected tipset
- how to verify:
  - inspect head and receipt lookup at the correct chain position
  - confirm you used Filecoin-native vs FEVM submission flow correctly
- fix:
  - separate the write path by endpoint and re-check anchoring

### FEVM Query Works But Filecoin State Query Fails
- likely cause: mixing `/rpc/v1` expectations into `/rpc/v0` or vice versa
- how to verify:
  - inspect the endpoint URL and request method family
- fix:
  - route FEVM and Lotus-native tasks through the correct surfaces

## Best Practices
- estimate gas before Filecoin-native message submission
- anchor state reads when determinism matters
- use WebSocket for subscription-style RPC
- keep FEVM and Lotus-native workflows separate in code and docs
- treat public endpoint support as a limited operational surface

## References
- https://docs.filecoin.io/reference/json-rpc
- https://docs.filecoin.io/smart-contracts/filecoin-ethereum-rpc
- https://lotus.filecoin.io/
- `npm:@filecoin-shipyard/lotus-client-schema@4.2.0`
- `npm:@filecoin-shipyard/lotus-client-rpc@1.2.0`
- `npm:@filecoin-shipyard/lotus-client-provider-nodejs@1.1.1`

## Open Questions
- none for the current core pack
