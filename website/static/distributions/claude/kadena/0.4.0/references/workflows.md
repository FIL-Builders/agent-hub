# Kadena Pact Lang API Workflows

### Submit A Write Safely
1. Build public metadata with `Pact.lang.mkMeta` using seconds-based timestamps.
2. Build capabilities with `Pact.lang.mkCap`.
3. Simulate with `Pact.fetch.local` if the write is risky or user-facing.
4. Submit with `Pact.fetch.send` or `Pact.wallet.sendSigned`.
5. Observe completion with `Pact.fetch.listen` or `Pact.fetch.poll`.

### Build An End-User Wallet Flow
1. Build metadata and capabilities explicitly.
2. Call `Pact.wallet.sign` with the full prepared payload.
3. Submit the signed command with `Pact.wallet.sendSigned`.
4. Wait for the final result with `listen` or `poll`.
