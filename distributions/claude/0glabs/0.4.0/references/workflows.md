# 0G Serving Broker Workflows

### Run A Verified Inference Request
1. Create the broker from the signer.
2. Check the current ledger state and top it up if needed.
3. Fetch provider metadata.
4. Generate fresh request headers for the prompt.
5. Send the request to the provider endpoint.
6. Verify the response with `processResponse`.
