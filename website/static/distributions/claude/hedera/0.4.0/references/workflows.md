# Hedera Workflows

### Create An Account And Confirm It Safely
1. Build a client for the intended network and set the operator explicitly.
2. Construct `AccountCreateTransaction` with the correct key, alias, and receiver-signature policy.
3. Execute the transaction and fetch the receipt to obtain the created account ID.
4. Use `AccountInfoQuery` or `AccountBalanceQuery` for immediate protocol-side confirmation.
5. Use mirror-node REST only after that if the product also needs indexed account views.

### Create A Token And Associate A Recipient Before Transfer
1. Create the token and read the new token ID from the receipt.
2. Decide which accounts need association before any transfer attempt.
3. Submit `TokenAssociateTransaction` for the target account.
4. Confirm association success with a receipt, then perform transfers.
5. Use `TokenInfoQuery` or mirror-node token reads to inspect resulting metadata or holdings context.

### Simulate Then Execute A Contract Workflow
1. Choose whether the task needs a consensus-node read query or a mirror-node simulation.
2. Use `ContractCallQuery` or `POST /api/v1/contracts/call` for the dry run.
3. If the real action mutates state, build `ContractExecuteTransaction` separately with explicit gas and parameters.
4. Confirm the execute transaction with a receipt before updating application status.
5. Use mirror-node indexed views only for follow-up inspection once data has propagated.
