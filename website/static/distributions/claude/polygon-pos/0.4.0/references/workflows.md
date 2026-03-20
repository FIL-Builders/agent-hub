# Polygon PoS Workflows

### Deposit An ERC-20 From Ethereum To Polygon PoS
1. Install the provider plugin and initialize `POSClient` with explicit parent and child providers.
2. Create a parent-side ERC-20 handle with `posClient.erc20(token, true)`.
3. Approve the token amount on the parent side.
4. Call `deposit(amount, userAddress)`.
5. Observe the parent-side transaction receipt and then track child-side availability separately.

### Withdraw An ERC-20 Back To Ethereum
1. Create a child-side ERC-20 handle with `posClient.erc20(token)`.
2. Call `withdrawStart(amount)` and persist the burn tx hash.
3. Wait until the burn transaction is checkpointed.
4. Finalize with `withdrawExitFaster(burnTxHash)` or the slower exit path as appropriate.
5. Optionally check `isExitProcessed` to avoid duplicate finalization attempts.

### Decide Between Portal And Programmatic Bridge Code
1. If the request is UX or user support for the official bridge, use Portal guidance.
2. If the request is application code or automation, initialize `POSClient`.
3. Keep deposit, burn, checkpoint, and exit-completion milestones explicit in either case.
