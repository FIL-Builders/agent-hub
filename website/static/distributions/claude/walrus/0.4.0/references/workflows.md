# Walrus HTTP API Workflows

### Upload And Retrieve A Blob
1. Choose a publisher or daemon endpoint for the upload.
2. Call `walrus.blobs.put` with the desired retention settings.
3. Store the returned blob ID.
4. Use an aggregator or daemon endpoint to call `walrus.blobs.get` with that blob ID.

### Validate A Deployment Before Integration
1. Call `walrus.api.get` on the target deployment.
2. Confirm the exposed schema matches the parameters and response shapes your client expects.
3. Only then bind the deployment into automation or production code.
