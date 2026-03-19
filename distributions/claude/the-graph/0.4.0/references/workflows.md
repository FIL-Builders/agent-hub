# The Graph Workflows

### Scaffold and deploy a new subgraph
1. Run `graph init` with the correct protocol, network, and optional contract inputs.
2. Refine `subgraph.yaml`, `schema.graphql`, and mappings so the indexing model matches the data you need.
3. Run `graph codegen` after schema or ABI changes.
4. Run `graph build` to catch local drift before deployment.
5. Run `graph deploy` with the correct node, credentials, IPFS settings, and optional version label.

### Debug missing or wrong query results
1. Check `schema.graphql` to confirm the entity and fields actually exist.
2. Inspect mappings for handler coverage, entity ID strategy, and field assignments.
3. Verify `subgraph.yaml` contains the expected data source, ABI, handler names, and network settings.
4. Regenerate types and rebuild if ABI or schema inputs changed.
5. Only after indexing design is verified, revise the GraphQL query.

### Adjust indexer behavior for a deployment
1. Connect to the correct Indexer Agent management API.
2. Inspect current rules with `graph indexer rules get`.
3. Apply a targeted `rules set`, `start`, `stop`, or `offchain` change.
4. Review resulting actions, allocations, or operational consequences before treating the change as complete.
