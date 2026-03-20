# Lighthouse Web3 SDK Troubleshooting

### Encrypted Upload Fails With Auth Errors
**Cause**
The upload used a mismatched signer, public key, or signed auth message.

**Fix**
Regenerate the auth message and signature for the exact wallet identity intended to own the upload, then retry `uploadEncrypted`.

### Upload Succeeded But Data Is Not Yet Durable
**Cause**
The file was accepted by the upload path, but Filecoin deal activation is asynchronous.

**Fix**
Poll `dealStatus` using the returned CID and keep user-facing state separate between upload completion and durable storage activation.
