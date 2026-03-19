# Worldcoin Troubleshooting

### Proof flow returns success on the client but the backend rejects it
**Cause**
- The backend is verifying a different action, signal, protocol path, or environment than the client requested.
- The integration is conflating MiniKit verify output with the current IDKit `v4` verification contract.
- RP context, nullifier handling, or replay policy is stale or mismatched.

**Fix**
- Verify the exact action and signal the client requested.
- Confirm whether the flow is MiniKit verify or IDKit request and use the matching backend verification path.
- Refresh RP context or server-side request state and make nullifier handling explicit.

### Wallet login fails even though the user signed
**Cause**
- The backend-issued nonce does not match the nonce used in verification.
- SIWE statement, request ID, not-before, or expiration constraints do not line up with the signed payload.
- The app is verifying the wrong payload object or mixing up pre-sign and post-sign data.

**Fix**
- Generate and persist the nonce on the backend, then verify that exact nonce.
- Keep SIWE constraints stable between issuance and verification.
- Pass the exact `MiniAppWalletAuthSuccessPayload` into `verifySiweMessage(...)`.

### Payment or transaction looks successful but business state is wrong
**Cause**
- The app trusted the client callback instead of reconciling `transaction_id`.
- `reference` and `transaction_id` were not persisted or mapped consistently on the backend.
- The operation is still submitted or pending rather than mined.

**Fix**
- Reconcile the operation through `GET /api/v2/minikit/transaction/{transaction_id}`.
- Persist and index both `reference` and `transaction_id`.
- Model pending, mined, and failed as separate states in business logic.

### Permission prompt does not appear again
**Cause**
- The user already rejected, disabled, or permanently denied the permission.
- The app is prompting without checking current permission state first.
- The flow assumes the system will keep re-showing the same prompt.

**Fix**
- Check current state with `getPermissions` before prompting.
- Ask only when the user is entering the feature that needs the permission.
- Route the user toward settings or alternate UX when the modal will not be shown again.
