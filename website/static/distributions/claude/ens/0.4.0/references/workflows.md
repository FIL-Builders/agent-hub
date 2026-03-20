# ENS Workflows

### Resolve And Safely Display A Primary Name
1. Create an ENS public client for the relevant chain context.
2. Call `getName` with the target address.
3. Check the returned `match` value before displaying the name.
4. Fall back to the raw address when forward verification fails.
5. If the task is chain-specific, pass `coinType` or `chainId` so the verification target matches the intended chain.

### Register A New `.eth` Name
1. Check availability with `getAvailable`.
2. Create or obtain a fresh secret for the commit-reveal flow.
3. Call `commitName` with the target name, owner, duration, and secret.
4. Wait for the commitment window required by the registrar flow.
5. Call `getPrice` near the reveal step and compute `base + premium` plus a buffer.
6. Call `registerName` with the same registration parameters and buffered `value`.
7. If the flow also needs resolver records or reverse configuration, handle those explicitly after the registration path is valid.

### Update Resolver Records Safely
1. Resolve the current resolver with `getResolver`.
2. If the task assumes a specific feature such as text or multicoin records, capability-check the resolver with `getSupportedInterfaces`.
3. Confirm the acting account is the effective manager of the name, taking wrapper state into account when necessary.
4. Call `setRecords` with the intended text, coin, contenthash, or ABI changes.
5. Re-read the affected records if the task needs verification or user feedback.
