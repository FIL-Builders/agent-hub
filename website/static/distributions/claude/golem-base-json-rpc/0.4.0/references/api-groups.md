# Golem Base JSON-RPC API Groups

### Mutation Model
**Exports**
- GOLEMBASE_MUTATION_ADDRESS
- StorageTransactionRlp
- CreateObject
- UpdateObject
- ExtendItem
- eth_sendTransaction

Create, update, extend, and submit storage mutations through the precompile.

#### GOLEMBASE_MUTATION_ADDRESS
**Kind**
constant

**Summary**
Precompile address that processes DB-Chain storage mutations.

**Definition**
Language: typescript
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```ts
export const GOLEMBASE_MUTATION_ADDRESS =
  "0x0000000000000000000000000000000060138453" as const;
```

**Guidance**
- All create, update, delete, and extend mutations go to this address.
- Use normal Ethereum JSON-RPC transaction methods to deliver the call.
- Keep the mutation address centralized so app code cannot drift.

**Example**
Language: bash
Description: Send a storage mutation transaction.

```bash
curl http://localhost:8545 -H 'Content-Type: application/json' -d '{
  "jsonrpc":"2.0","id":1,"method":"eth_sendTransaction",
  "params":[{"from":"0xYourSender","to":"0x0000000000000000000000000000000060138453","data":"0x..."}]
}'
```

#### StorageTransactionRlp
**Kind**
type

**Summary**
Top-level RLP tuple for batching creates, updates, deletes, and extends.

**Definition**
Language: typescript
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```ts
export type StorageTransactionRlp = [
  CreateObject[],
  UpdateObject[],
  DeleteItem[],
  ExtendItem[]
];
```

**Guidance**
- Keep the four arrays in fixed order.
- Batch heterogeneous operations when it improves gas efficiency, but split oversized payloads.
- Treat this as the authoritative mutation envelope rather than inventing custom transaction shapes.

**Example**
Language: text
Description: Conceptual RLP layout.

```text
[ [CreateObject...], [UpdateObject...], [DeleteItem...], [ExtendItem...] ]
```

#### CreateObject
**Kind**
type

**Summary**
RLP element used to create a new entity with TTL, payload, and annotations.

**Definition**
Language: typescript
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```ts
export type CreateObject = [
  `0x${string}`,
  `0x${string}`,
  `0x${string}`[],
  `0x${string}`[]
];
```

**Guidance**
- Keep BTL in hex block units.
- Encode annotation keys and values as bytes.
- Prefer clear, stable annotation keys if later indexed lookup matters.

**Example**
Language: text
Description: Conceptual create tuple.

```text
[ "0x012c", "0x<payload>", ["0x6b6579","0x76616c"], ["0x6978","0x00000002"] ]
```

#### UpdateObject
**Kind**
type

**Summary**
RLP element used to replace an entity’s payload, annotations, and TTL.

**Definition**
Language: typescript
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```ts
export type UpdateObject = [
  `0x${string}`,
  `0x${string}`,
  `0x${string}`,
  `0x${string}`[],
  `0x${string}`[]
];
```

**Guidance**
- Updates replace the full annotation set, so resend all annotations you want to keep.
- Use `ExtendItem` instead when only TTL needs to change.
- Treat the entity key as an opaque hash, not a human-readable identifier.

**Example**
Language: text
Description: Conceptual update tuple.

```text
[ "0x<entityKey>", "0x04b0", "0x<payload>", ["0x6b","0x76"], ["0x6978","0x03"] ]
```

#### ExtendItem
**Kind**
type

**Summary**
RLP element used to extend an entity’s TTL without rewriting payload or annotations.

**Definition**
Language: typescript
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```ts
export type ExtendItem = [
  `0x${string}`,
  `0x${string}`
];
```

**Guidance**
- Use this for renewals when content and annotations are unchanged.
- Keep extension amounts explicit in block units.
- Prefer modest extension deltas that match your refresh model.

**Example**
Language: text
Description: Extend two entities.

```text
[ ["0x<entityKey1>","0x1000"], ["0x<entityKey2>","0x0200"] ]
```

#### eth_sendTransaction
**Kind**
endpoint

**Summary**
Submit a JSON-RPC transaction carrying an RLP-encoded storage transaction.

**Definition**
Language: json
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "eth_sendTransaction",
  "params": [
    {
      "from": "0xYourSender",
      "to": "0x0000000000000000000000000000000060138453",
      "gas": "0x5208",
      "gasPrice": "0x3b9aca00",
      "data": "0x..."
    }
  ]
}
```

**Guidance**
- Keep the `to` field fixed to the mutation precompile.
- Use standard hex-quantity formatting for transaction fields.
- For remote nodes without managed keys, sign offline and use `eth_sendRawTransaction` with the same payload semantics.

**Example**
Language: bash
Description: Send a mutation transaction to the precompile.

```bash
curl http://localhost:8545 -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":2,"method":"eth_sendTransaction","params":[{"from":"0xYourSender","to":"0x0000000000000000000000000000000060138453","gas":"0x5208","gasPrice":"0x3b9aca00","data":"0x..."}]}'
```

### Queries
**Exports**
- golembase_getEntityMetaData
- golembase_queryEntities

Read entity metadata and free-form query results.

#### golembase_getEntityMetaData
**Kind**
endpoint

**Summary**
Fetch owner, expiry, and annotation metadata for an entity.

**Definition**
Language: json
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "golembase_getEntityMetaData",
  "params": ["0x<entityKey>"]
}
```

**Guidance**
- Use this when you need TTL, owner, or annotations alongside the payload.
- Treat annotation values as exact-match metadata rather than fuzzy search hints.
- Pair this with payload fetches when materializing full objects.

**Example**
Language: bash
Description: Fetch entity metadata by key.

```bash
curl http://localhost:8545 -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"golembase_getEntityMetaData","params":["0x<entityKey>"]}'
```

#### golembase_queryEntities
**Kind**
endpoint

**Summary**
Run a free-form query over annotated entities and return matching keys with Base64 payload values.

**Definition**
Language: json
Source: agents/golem-base-json-rpc/0.3.0.md coverage audit

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "golembase_queryEntities",
  "params": ["annotation.status == \"active\" && annotation.kind == \"receipt\""]
}
```

**Guidance**
- Prefer indexed lookup endpoints first when the query can be expressed that way.
- Decode Base64 payload values before using them.
- Use this endpoint for flexible search, not as the fastest read path for known keys.

**Example**
Language: bash
Description: Query entities by annotation predicates.

```bash
curl http://localhost:8545 -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"golembase_queryEntities","params":["annotation.status == \"active\""]}'
```
