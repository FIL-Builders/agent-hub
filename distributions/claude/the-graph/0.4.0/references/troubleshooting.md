# The Graph Troubleshooting

### Query returns empty or stale data
**Cause**
- The subgraph may still be indexing the relevant block range.
- The entity or fields may not exist in `schema.graphql`.
- The mapping or manifest may not be writing the data the query expects.

**Fix**
- Check whether the subgraph finished indexing the relevant range.
- Verify the entity exists in `schema.graphql`.
- Inspect mapping logic and entity ID construction.
- Confirm the manifest points at the expected contract, ABI, network, and handlers.

### Build fails after schema or ABI edits
**Cause**
- Code generation may be stale after schema or ABI changes.
- Manifest references, handler names, or file paths may no longer match the project files.

**Fix**
- Rerun `graph codegen`.
- Check for manifest drift between ABI names, handler names, and file paths.
- Rebuild before attempting deploy so authoring errors are isolated from deployment errors.

### Deployed subgraph behaves differently than expected
**Cause**
- The wrong subgraph target, version label, node, or credentials may have been used at deploy time.
- The selected network or network-file may not match the intended environment.

**Fix**
- Confirm the target subgraph name, node, version label, and credentials were correct at deploy time.
- Check whether the wrong network or `network-file` was used.
- Separate deployment-target mistakes from indexing or query mistakes.

### Indexer rule change has unexpected effect
**Cause**
- A more specific rule may have overridden a broader default.
- The decision basis may have changed to `always`, `never`, or `offchain`.

**Fix**
- Re-read current rules and consider precedence from broader to narrower scopes.
- Check whether the decision basis changed from `rules` to `always`, `never`, or `offchain`.
- Treat operational overrides as distinct from subgraph authoring fixes.
