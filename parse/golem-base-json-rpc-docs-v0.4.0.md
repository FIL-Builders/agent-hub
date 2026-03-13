# Golem Base JSON-RPC Documentation Pack

## Target
- Pack: `agents/golem-base-json-rpc/0.4.0.md`
- Target date: 2026-03-13

## Source Inventory
- `agents/golem-base-json-rpc/0.3.0.md` for contract and workflow extraction

## Decision Rules
- Send mutations to the storage precompile address with RLP-encoded transaction data.
- Prefer indexed lookups before free-form queries.
- Use `ExtendItem` when only TTL changes instead of full updates.

## Common Confusions
- BTL is in blocks, not seconds.
- Update replaces the full annotation set.
- Query results return Base64 payload values.

## Failure Modes
- Mutations are sent to the wrong address.
- Updates accidentally erase annotations.
- Clients forget to decode Base64 payloads from query results.

## Coverage Map

### Mutation
- `GOLEMBASE_MUTATION_ADDRESS`
- `StorageTransactionRlp`
- `CreateObject`
- `UpdateObject`
- `ExtendItem`
- `eth_sendTransaction`

### Queries
- `golembase_getEntityMetaData`
- `golembase_queryEntities`

## Must-Not-Regress Insights
- Preserve precompile-address guidance.
- Preserve full-replacement update semantics.
- Preserve Base64 decode guidance for query payloads.
