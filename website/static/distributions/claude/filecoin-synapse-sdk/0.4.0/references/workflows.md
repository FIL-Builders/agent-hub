# Filecoin Synapse SDK Workflows

### Fund And Upload Through The Default Manager
1. Create a Synapse instance with the intended chain, account, transport, and source.
2. Inspect wallet and Synapse balances separately.
3. Deposit funds and approve the storage service if the workflow needs operator permissions.
4. Upload with `synapse.storage.upload(data)`.
5. Persist the returned `pieceCid`, copies, and any failures for later retrieval and debugging.

### Cost-Aware Upload With Preparation
1. Estimate or compute upload costs with `getUploadCosts()` or `prepare()`.
2. If `prepare()` returns a transaction plan, execute it before uploading.
3. Create or reuse the right storage context.
4. Upload only after funding and approval state is sufficient.

### Explicit Provider-Aware Storage
1. Query active providers or inspect provider info.
2. Create a storage context with explicit provider or dataset inputs.
3. Upload through the context.
4. Use Warm Storage and FilBeam reads to inspect resulting service and retrieval state without conflating them.
