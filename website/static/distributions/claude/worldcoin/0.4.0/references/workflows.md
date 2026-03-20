# Worldcoin Workflows

### Mini App wallet login
1. Issue a nonce on the backend and store it in a tamper-resistant way.
2. Call `MiniKit.commandsAsync.walletAuth(...)` inside World App.
3. Send the success payload plus nonce to your backend.
4. Verify it with `verifySiweMessage(...)`.
5. Create your own application session only after backend verification succeeds.

### Mini App proof-of-human gating
1. Trigger `MiniKit.commandsAsync.verify(...)` with a stable action and optional signal.
2. Receive the proof payload in the client.
3. Forward the payload to a trusted backend route.
4. Verify the proof with the appropriate backend verification path.
5. Apply your own nullifier or one-person-one-action policy before granting access.

### Current React World ID integration
1. Create the app in the Developer Portal and keep `app_id`, `rp_id`, and `signing_key`.
2. Generate `rp_context` on the backend with server-side signing.
3. Start the flow with `useIDKitRequest(...)` or `IDKitRequestWidget`.
4. Verify the resulting proof through `POST /api/v4/verify/{rp_id}`.
5. Unlock the feature only after backend verification completes.

### Payment or transaction reconciliation
1. Persist your own `reference` before triggering `pay` or `sendTransaction`.
2. Receive the client success payload and extract `transaction_id`.
3. Reconcile the operation on the backend with `GET /api/v2/minikit/transaction/{transaction_id}`.
4. Grant entitlements only when the reconciled transaction reaches the required final state.
