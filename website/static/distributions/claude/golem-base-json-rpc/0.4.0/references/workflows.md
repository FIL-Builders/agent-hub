# Golem Base JSON-RPC Workflows

### Create And Later Extend An Entity
1. Build a `CreateObject` with BTL, payload, and annotations.
2. Place it in the creates array of `StorageTransactionRlp`.
3. RLP-encode the transaction and send it to the mutation precompile.
4. Later, build an `ExtendItem` for the entity key and send another mutation transaction.
