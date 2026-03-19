# Helia Troubleshooting

### `cat` fails after a browser reload
**Cause**
The content may no longer exist in the local stores because the browser node was effectively ephemeral.

**Fix**
Treat browser persistence as a deliberate design choice. Rehydrate content from known providers or configure a runtime-appropriate persistent storage strategy.

### Retrieval fails with `InsufficientProvidersError`
**Cause**
Helia could not discover or use enough providers for the requested DAG.

**Fix**
Check router availability, verify that the content has providers on the network, and supply known peers through `ProviderOptions` when you have them.

### Retrieval fails because the node has no routers
**Cause**
Custom node configuration removed or failed to initialize the router layer Helia depends on for provider discovery.

**Fix**
Restore a working router configuration, usually by starting from `libp2pDefaults()` or `createHelia()` defaults and only making minimal changes.
