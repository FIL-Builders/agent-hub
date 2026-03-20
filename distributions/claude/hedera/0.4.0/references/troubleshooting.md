# Hedera Troubleshooting

### The receipt says success but mirror-node REST still shows old data
**Cause**
Mirror-node indexing is asynchronous and can lag consensus visibility.

**Fix**
Treat receipt confirmation as the write-success signal, then retry the mirror-node read with backoff instead of assuming the transaction failed.

### A token transfer fails even though the token exists
**Cause**
The receiving account may be unassociated, frozen, missing KYC, or otherwise unable to hold the token.

**Fix**
Inspect account and token state explicitly, associate the account when required, and retry only after the prerequisite policy conditions are satisfied.

### A contract integration works in Ethereum tooling but not in Hedera code
**Cause**
The workflow may be assuming generic Ethereum node semantics instead of Hedera SDK and mirror-node boundaries.

**Fix**
Separate simulation from execution, use Hedera-specific client and receipt flows, and keep account IDs, contract IDs, and mirror-node paths explicit.
