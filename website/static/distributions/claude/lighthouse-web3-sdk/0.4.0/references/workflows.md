# Lighthouse Web3 SDK Workflows

### Upload Encrypted Content Safely
1. Generate or load the correct wallet context.
2. Fetch or generate the auth material for the intended signer.
3. Call `oneTimeAuth` if the flow requires a short-lived token.
4. Call `uploadEncrypted` with the API key, public key, and signed message.
5. Store the returned CID and related metadata.

### Verify Durability After Upload
1. Upload the content and capture the returned CID.
2. Poll `dealStatus` with backoff until the desired storage state appears.
3. Keep the CID as the durable application reference.
